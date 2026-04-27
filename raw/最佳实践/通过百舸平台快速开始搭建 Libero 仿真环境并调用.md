## 一、产品简介
LIBERO 是基于百舸平台的**机器人仿真评估与训练工具**。您可以在虚拟环境中训练机器人操作策略，并自动评估其表现——无需真实机器人。

**您可以用它来：**

* 训练机器人学会抓取、放置、开关柜门等 **130 种**操作任务
* 一键训练模型、一键评测效果，全流程通过脚本完成
* 将服务部署在 GPU 服务器上，团队成员通过浏览器或命令行远程提交评测任务

所有操作均通过一个脚本 `run.sh` 完成，按照本指南操作即可。

---

## 二、快速开始（约 30 分钟）
整体流程：**创建开发机 → 登录 → 下载数据 → 训练 → 评测**

### 2.1 创建开发机
打开百舸控制台 → 进入开发机页面 → 点击【创建实例】。

**环境配置**

|配置项|部署要求|最佳实践|
|-|-|-|
|CPU|8核|建议按表单默认值及以上|
|内存|32G|建议按表单默认值及以上，128G为最佳|
|GPU|L20等|本示例使用 L20 创建开发机|
|CDS|按需|推荐100G以上|
|其它|需挂载bos|建议使用bos中的数据集和模型|

**创建时需要填写以下配置：**

|配置项|填写说明|
|-|-|
|实例名称|自定义命名，例如 `libero-eval`|
|资源池类型/资源池/队列|根据您已有的资源池类型选择|
|资源规格|按上方推荐配置选择|

其余配置保持默认，点击【确定】即可。

### 2.2 登录开发机
在开发机列表中等待状态变为「运行中」，点击【登录】进入终端。

> 如果长时间处于「创建中」，请检查资源池是否有可用资源。
### 2.3 下载数据集
 从hugging face下载：

```bash
# 进入项目目录
cd /root/workspace/LIBERO

# 下载数据集
bash run.sh download --datasets libero_spatial
```
> 首次使用推荐只下载 `libero_spatial`。从 hugging face 下载可能遇到网络问题
**数据集说明：**

|数据集|大小|任务数|说明|
|-|-|-|-|
|`libero_spatial`|4.2GB|10|同一物体在不同位置|
|`libero_object`|7.0GB|10|同一操作抓取不同物体|
|`libero_goal`|6.0GB|10|同一场景执行不同目标|
|`libero_100`|76GB|100|大规模综合任务集|

### 2.4 训练模型
```bash
# 开始训练（默认约 5-10 分钟）
bash run.sh train
```
训练完成后，终端会显示模型保存路径（checkpoint），后续评测会自动使用这个模型。

**训练参数**

```bash
bash run.sh train --benchmark libero_spatial --task_id 4 --n_epochs 10 --batch_size 16
```
### 2.5 运行评测
```bash
# 一键评测（自动查找刚训练好的模型）
bash run.sh eval
```
评测完成后会看到类似输出：

```
  Episode 1/10: 失败 (200步)
  Episode 2/10: 成功 (156步)
  Episode 3/10: 失败 (200步)
  ...
  成功率: 30.0%
```
****

---

## 三、远程评测（多人共享服务器）
### 3.1 什么时候需要用？
当您希望：

* 把仿真服务部署在一台 GPU 服务器上，多人共享使用
* 在自己电脑上提交评测任务，不需要安装任何 AI 框架
* 由您的训练机发起，不需要单独占用资源
* 对比多个模型的评测结果

### 3.2 整体流程
```
您的电脑/笔记本/独立服务器                       GPU 服务器
┌─────────────────┐     发送评测请求      ┌─────────────────┐
│                 │  ─────────────────►  │                 │
│  发一条命令      │                      │  自动完成：      │
│  等待结果        │  ◄─────────────────  │  · 加载模型      │
│                 │     返回评测结果      │  · 运行仿真      │
│  无需安装任何    │                      │  · 计算成功率    │
│  AI 依赖        │                      │                 │
└─────────────────┘                      └─────────────────┘
```
### 3.3 第一步：启动服务（在 GPU 服务器上）
```bash
cd /root/workspace/LIBERO

# 启动服务
bash run.sh deploy --port 8100
```
看到以下输出表示启动成功：

```
[INFO] 仿真服务启动成功 (PID=xxxx)
```
验证服务是否正常运行：

```bash
curl http://localhost:8200/health
# 应返回 {"status":"ok"}
```
> 如需跨机器访问，请在百舸控制台开启对应自定义端口并配置 BLB。
### 3.4 第二步：提交评测（在您的电脑上）
客户端**不需要安装 LIBERO**，有两种提交方式：

**方式 1：使用脚本**（需要 Python）

```bash
bash run.sh remote \
    --server http://<服务器IP>:8200 \
    --ckpt-path /root/workspace/LIBERO/experiments_base/LIBERO_SPATIAL/BCRNNPolicy_seed42/task0_model.pth
```
**方式 2：使用 curl**（零依赖）

```bash
curl -X POST http://<服务器IP>:8200/eval \
    -H "Content-Type: application/json" \
    -d '{
        "ckpt_path": "/root/workspace/LIBERO/experiments_base/LIBERO_SPATIAL/BCRNNPolicy_seed42/task0_model.pth",
        "benchmark": "libero_spatial",
        "task_id": 0,
        "n_eval": 10
    }'
```
> **关于模型路径**：`--ckpt-path` 填写的是**服务器上**的路径。如果您在服务器上训练了模型，训练完成时终端会输出保存路径，直接复制使用即可。
**示例**：

```bash
bash run.sh remote \
    --server http://<服务器IP>:8200 \
    --ckpt-path /root/workspace/LIBERO/experiments_base/LIBERO_SPATIAL/BCRNNPolicy_seed42/task0_model.pth \
    --task-id 0 \
    --n-trajs 10
```
> 如果在服务器本机测试，`--server` 填 `http://localhost:8200` 即可。
### 3.5 查看结果
评测完成后会输出：

```
  任务: pick up the black bowl on the cookie box and place it ...

  Episode 1/10: 失败 (200步, 28.8s)
  Episode 2/10: 成功 (156步, 13.5s)
  Episode 3/10: 失败 (200步, 25.1s)
  ...
============================================================
成功率: 30.0% (3/10)
============================================================
```
---

## 四、参数说明
### 4.1 训练参数（`bash run.sh train`）
|参数|说明|默认值|示例|
|-|-|-|-|
|`--benchmark`|任务套件（见第五节）|`libero_spatial`|`libero_object`|
|`--task_id`|任务编号|`0`|`4`|
|`--n_epochs`|训练轮数，越大效果越好但越慢|`5`|`10`|
|`--batch_size`|每批样本数|`8`|`16`|
|`--device`|训练设备|`cuda`（GPU）|`cpu`|

### 4.2 评测参数（`bash run.sh eval`）
|参数|说明|默认值|示例|
|-|-|-|-|
|`--benchmark`|任务套件|`libero_spatial`|`libero_goal`|
|`--task_id`|任务编号|`0`|`4`|
|`--ckpt`|模型文件路径（不填则自动查找）|自动|`/path/to/model.pth`|
|`--n_eval`|评测次数，越多结果越稳定|`10`|`20`|
|`--device`|推理设备|`cuda`（GPU）|`cpu`|

### 4.3 远程评测参数（`bash run.sh remote`）
|参数|必填|说明|默认值|示例|
|-|-|-|-|-|
|`--server`|是|服务器地址|-|`http://192.168.1.100:8100`|
|`--ckpt-path`|是|服务器上的模型路径|-|见下方说明|
|`--benchmark`|否|任务套件|`libero_spatial`|`libero_object`|
|`--task-id`|否|任务编号|`0`|`4`|
|`--n-trajs`|否|评测次数|`10`|`20`|

> **模型路径在哪？** 训练完成后终端会输出，格式为：
> `/root/workspace/LIBERO/experiments_base/LIBERO_SPATIAL/BCRNNPolicy_seed42/task0_model.pth`
> 其中 `LIBERO_SPATIAL` 对应任务套件，`task0` 对应任务编号。
### 4.4 服务部署参数（`bash run.sh deploy`）
|参数|说明|默认值|示例|
|-|-|-|-|
|`--port`|服务端口号|`8100`|`8100`|

---

## 五、任务套件一览
|套件名称|任务数|说明|推荐度|
|-|-|-|-|
|`libero_spatial`|10|同一物体在不同位置（如碗在柜子旁/盘子旁）|强烈推荐（入门）|
|`libero_object`|10|同一操作抓不同物体（如碗/杯子/罐子）|推荐|
|`libero_goal`|10|同一场景执行不同目标（如放桌上/放柜里）|推荐|
|`libero_10`|10|多步骤复合任务（如开柜门→拿碗→放盘子）|进阶|
|`libero_90`|90|大规模混合任务|进阶|

> 通过 `--benchmark` 指定套件，`--task_id` 指定套件内的具体任务编号。
---

## 六、命令速查
```bash
# 验证环境
bash run.sh quickstart

# 下载数据集
bash run.sh download --datasets libero_spatial

# 训练
bash run.sh train
bash run.sh train --task_id 4 --n_epochs 10

# 评测
bash run.sh eval
bash run.sh eval --ckpt /path/to/model.pth

# 随机策略（用于对比基线）
bash run.sh random

# 启动远程服务
bash run.sh deploy --port 8200

# 远程评测
bash run.sh remote \
    --server http://<服务器IP>:8200 \
    --ckpt-path /root/workspace/LIBERO/experiments_base/LIBERO_SPATIAL/BCRNNPolicy_seed42/task0_model.pth

# 查看帮助
bash run.sh help
```
---

## 七、使用建议
1. **第一次用？** 按照「快速开始」走一遍即可：下载 → 训练 → 评测，最快 30 分钟出结果
2. **先跑通再调参**：首次评测用 `--n_eval 3` 减少等待，确认流程没问题后再增加数量
3. **对比模型效果**：用不同的 `--n_epochs` 训练多个模型，在同一任务上评测对比成功率
4. **团队协作**：在服务器上运行 `deploy` 启动服务，团队成员各自用 `curl` 提交评测即可

---

## 八、常见问题
**Q：运行时出现大量 Warning，是否正常？**

正常。这些是底层库的兼容性提示，不影响结果。只要没有红色的 Error 就没问题。

**Q：下载数据集超时或断开，怎么办？**

重新运行一次即可，脚本会自动断点续传：

```bash
bash run.sh download --datasets libero_spatial
```
**Q：评测时提示「Checkpoint 不存在」？**

说明还没有训练过模型。请先训练：

```bash
bash run.sh train
bash run.sh eval
```
**Q：远程评测连不上服务器？**

请依次检查：

1. 服务器上是否已运行 `bash run.sh deploy`（用 `curl http://<IP>:8200/health` 测试）
2. 两台机器是否在同一网络下
3. 是否在百舸控制台开放了对应端口
4. `--ckpt-path` 填的是**服务器上的路径**，不是您本机的路径

**Q：可以用自己训练的模型吗？**

可以。只要是通过 `bash run.sh train` 训练保存的 `.pth` 文件，用 `--ckpt` 指向该文件即可。