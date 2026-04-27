## 一、产品简介
Simpler 是一个基于百舸平台的**机器人仿真评估工具**，主要用于对 RT-1 等机器人操作策略模型进行**仿真推理和效果评估**。

**核心能力：**

* 提供 25+ 种预置仿真任务（抓取、移动、开关抽屉等），无需真实机器人即可验证模型效果
* 支持多种 RT-1 模型版本的一键加载与对比评估
* 支持**本地一体化部署**（仿真+推理同机）和**远程 C/S 架构**（仿真与推理分离），灵活适配不同算力环境

**典型使用场景：**

* 在训练过程中定期评估模型性能（通过仿真替代真机测试，降低成本）
* 对比不同训练阶段的 checkpoint 表现
* 快速验证新任务/新场景下的策略效果

本指南帮助您快速上手核心功能。

---

## 二、快速开始
> **整体流程预览**：创建开发机 → 登录开发机 → 下载模型 → 运行推理，整个过程约 10-15 分钟即可完成首次推理测试。
### 步骤 1：环境准备与开发机创建
#### 推荐硬件配置
|配置项|最低要求|推荐配置|
|-|-|-|
|GPU|L20*1|L20*1|
|显存|24GB|24GB+|
|内存|16GB|32GB+|
|存储|50GB 可用空间|100GB+|

#### 1.1 创建开发机
打开百舸控制台 → 进入开发机页面 → 点击【创建实例】，按以下信息配置：

**基本信息：**

|配置项|填写说明|
|-|-|
|实例名称|自定义命名，例如 `simpler-env-server`|
|资源池类型/资源池/队列|根据您已有的资源池类型选择|
|资源规格|按上方推荐硬件配置选择|
|云磁盘|推荐预留 50GiB，保证运行空间|
|存储挂载|类型选 PFS，源路径如 `/simpler`，挂载路径如 `/mnt/pfs/`（用于存放模型和结果）|

**访问配置 & 高级配置：**

* 保持默认即可，无需修改

填写完成后点击【确定】，等待开发机创建完成。

#### 1.2 登录开发机
创建成功后，在开发机列表中找到刚创建的实例，等待状态变为「运行中」后，点击【登录】进入终端。

> **提示**：如果开发机状态长时间处于「创建中」，请检查资源池是否有可用资源。
### 步骤 2：下载模型
我们提供了 4 个不同训练阶段的 RT-1 模型 checkpoint，您可以根据需要选择下载：

|模型版本|训练阶段|适用场景|推荐度|
|-|-|-|-|
|**RT-1-X**|多任务联合训练（完全收敛）|正式评估、效果对比|强烈推荐|
|**RT-1-Converged**|单任务完整训练（40万步）|正式评估、基线对比|推荐|
|**RT-1-15%**|训练中期（约5.8万步）|训练过程分析、中间效果查看|一般|
|**RT-1-Begin**|训练初期（约1千步）|对比实验、验证流程可用性|一般|

> **建议**：首次使用推荐下载 **RT-1-X**，该模型经过多任务训练，泛化能力最强，在大部分任务上表现最佳。
```bash
# 登录终端后，先进入工作目录
cd /root/workspace/SimplerEnv

# 创建模型目录
mkdir -p checkpoints

# 下载 RT-1-X 模型（推荐，最强泛化）
bcecmd bos cp bos:/aihc-models-bj/RT-1/checkpoints/rt_1_x_tf_trained_for_002272480_step checkpoints/rt_1_x_tf_trained_for_002272480_step -r

# 下载 RT-1-Converged 模型（完整训练）
bcecmd bos cp bos:/aihc-models-bj/RT-1/checkpoints/rt_1_tf_trained_for_000400120 checkpoints/rt_1_tf_trained_for_000400120 -r

# 下载 RT-1-15% 模型（训练 15% 的检查点）
bcecmd bos cp bos:/aihc-models-bj/RT-1/checkpoints/rt_1_tf_trained_for_000058240 checkpoints/rt_1_tf_trained_for_000058240 -r

# 下载 RT-1-Begin 模型（训练初始阶段）
bcecmd bos cp bos:/aihc-models-bj/RT-1/checkpoints/rt_1_tf_trained_for_000001120 checkpoints/rt_1_tf_trained_for_000001120 -r
```
> **注意**：模型文件较大，下载可能需要几分钟，请耐心等待。下载完成后可通过 `ls checkpoints/` 确认文件完整性。
### 步骤 3：运行推理
#### 快速测试
使用以下启动命令启动开发机，会自动启动仿真环境，加载 RT-1 模型，在 `google_robot_pick_coke_can`（机器人抓取可乐罐）任务上运行 10 条轨迹的评估。

```bash
# 1. 激活 conda 环境
eval "$(conda shell.bash hook)"
conda activate simpler_env

# 2. 设置渲染环境（必须，用于无显示器的 GPU 渲染）
export VK_ICD_FILENAMES=/etc/vulkan/icd.d/nvidia_icd.json
export LD_LIBRARY_PATH=$CONDA_PREFIX/lib:/usr/local/nvidia/lib64:${LD_LIBRARY_PATH:-}

# 3. 进入项目目录
cd /root/workspace/SimplerEnv

# 4. 运行推理测试（请将 <ckpt 路径> 替换为实际的模型路径）
xvfb-run python simpler_env/simple_inference_visual_matching_prepackaged_envs.py \
    --policy rt1 \
    --ckpt-path <ckpt 路径> \
    --task google_robot_pick_coke_can \
    --logging-root ./results_simple_eval/ \
    --n-trajs 10
```
**示例（使用 RT-1-X 模型），将该代码替换上述#4内容：**

```bash
xvfb-run python simpler_env/simple_inference_visual_matching_prepackaged_envs.py \
    --policy rt1 \
    --ckpt-path ./checkpoints/rt_1_x_tf_trained_for_002272480_step \
    --task google_robot_pick_coke_can \
    --logging-root ./results_simple_eval/ \
    --n-trajs 10
```
> **预期运行时间**：10 条轨迹在 RTX 4090 上约需 5-10 分钟。首次运行会自动下载语言编码模型（约 1GB），后续运行将使用缓存。
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f83b0894816a4de8aa040316c1844ab5&docGuid=4yYZElJlwrd7iY)
#### 运行效果
推理完成后，您将在终端看到每条轨迹的成功/失败结果和总体成功率。仿真过程的视频和日志会自动保存到 `--logging-root` 指定的目录中。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=538cf0614e4541a59d209895ec649b6a&docGuid=YSDNjhR8RGh6Ic)
#### 【可选】RDP 连接运行
如果您不想用 headless 方式运行，希望有可视化界面也可以通过以下方式启动 RDP 服务：

1. 开启开发机自定义端口
2. 配置 3389 端口（启动脚本使用该端口）
3. 使用以下命令开启开发机 RDP 服务并配置密码

```
bash rdp_setup.sh
# 使用指令配置密码
passwd root
```
4. 然后在您的电脑上下载 RDP 或者Windows App
5. 添加电脑，输入您的 ip 地址:端口号，并配置账号名和密码
6. 双击图标进入可视化界面，通过其终端输入以下指令即可运行

```
conda activate simpler_env
cd /root/workspace/SimplerEnv/baige
python test_getting_started.py
```
---

## 三、进阶功能：远程调用（C/S 架构）
### 场景说明
在实际使用中，您可能希望将**仿真环境**和**模型推理**部署在不同的机器上，例如：

* 仿真环境需要 GPU + Vulkan 渲染支持（资源要求高）
* 模型推理只需要 TensorFlow + GPU（可复用训练机器）
* 团队中多人共享同一个仿真服务，各自运行不同的模型

此时可以使用远程调用功能，将系统拆分为两台开发机：

```
┌──────────────────────┐          HTTP          ┌──────────────────────┐
│   推理服务器 (A)      │  ◄──────────────────►  │   仿真服务器 (B)      │
│                      │                        │                      │
│  · RT-1 模型推理      │   /env/create          │  · SAPIEN 仿真引擎    │
│  · 发送动作指令       │   /env/{id}/reset      │  · Vulkan GPU 渲染    │
│  · 接收观测图像       │   /env/{id}/step       │  · 物理模拟计算       │
│                      │   /env/{id}/obs         │                      │
│  需要：TF + GPU      │                        │  需要：GPU + Vulkan   │
└──────────────────────┘                        └──────────────────────┘
```
### 创建流程
需要创建**两台开发机**（仿真服务器 + 推理服务器），创建步骤与「二、快速开始」相同，额外注意以下配置。

### 仿真服务器配置（Server B）
在开发机创建阶段，需要额外操作：

1. **配置自定义端口**：开启端口 8100
2. **配置 BLB**：选择您使用的 BLB（百度负载均衡），配置 BLB 监听 8100 端口
3. **填写启动命令**：将以下代码填入启动命令中

```bash
eval "$(conda shell.bash hook)"
conda activate simpler_env

export VK_ICD_FILENAMES=/etc/vulkan/icd.d/nvidia_icd.json
export LD_LIBRARY_PATH=$CONDA_PREFIX/lib:/usr/local/nvidia/lib64:${LD_LIBRARY_PATH:-}

nohup xvfb-run python /root/workspace/baige/env_server.py --host 0.0.0.0 --port 8100
```
> **创建成功后**，在开发机详情页中会显示该机器的 **IP 地址**，请记录下来，后续推理服务器需要用到。
### 推理服务器配置（Server A）
在开发机创建阶段，将以下代码填入启动命令中。请将 `<仿真服务器IP>` 和 `<ckpt路径>` 替换为实际值：

```bash
eval "$(conda shell.bash hook)"
conda activate simpler_env

nohup python /root/workspace/baige/rt1_remote_inference.py \
    --server http://<仿真服务器IP>:8100 \
    --ckpt-path <ckpt路径> \
    --task google_robot_pick_coke_can \
    --n-trajs 10
```
**示例（假设仿真服务器 IP 为 192.168.1.100）：**

```bash
nohup python /root/workspace/baige/rt1_remote_inference.py \
    --server http://192.168.1.100:8100 \
    --ckpt-path /root/workspace/SimplerEnv/checkpoints/rt_1_x_tf_trained_for_002272480_step \
    --task google_robot_pick_coke_can \
    --n-trajs 10
```
### 运行效果
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=c10bedb2e4b344c6a8817af99e5e35f3&docGuid=YSDNjhR8RGh6Ic)
## 四、关键参数说明
### 本地推理参数（步骤 3 使用）
|参数|必选|说明|默认值|示例|
|-|-|-|-|-|
|`--policy`|是|策略类型，目前支持 rt1|-|`rt1`|
|`--ckpt-path`|是|模型 checkpoint 路径|-|`./checkpoints/rt_1_x_tf_trained_for_002272480_step`|
|`--task`|是|仿真任务名称（见第五节任务列表）|-|`google_robot_pick_coke_can`|
|`--n-trajs`|否|评估的轨迹数量，越多结果越稳定|`10`|`3`（快速测试用）|
|`--logging-root`|否|结果文件保存目录|`./results_simple_eval/`|`./my_results/`|

### 远程服务参数（第三节使用）
**仿真服务器端（env_server.py）：**

|参数|必选|说明|默认值|示例|
|-|-|-|-|-|
|`--host`|否|监听地址|`0.0.0.0`|`0.0.0.0`（监听所有网卡）|
|`--port`|否|监听端口号|`8100`|`8100`|
|`--max-envs`|否|最大并发仿真环境数|`5`|`3`（显存不足时可调低）|

**推理客户端（rt1_remote_inference.py）：**

|参数|必选|说明|默认值|示例|
|-|-|-|-|-|
|`--server`|是|仿真服务器地址（含端口）|-|`http://192.168.1.100:8100`|
|`--ckpt-path`|是|模型 checkpoint 路径|-|`./checkpoints/rt_1_x_tf_trained_for_002272480_step`|
|`--task`|是|仿真任务名称|-|`google_robot_pick_coke_can`|
|`--n-trajs`|否|评估的轨迹数量|`10`|`10`|
|`--tf-memory-limit`|否|TF GPU 显存限制（MB）|`4096`|`2048`（与训练共享 GPU 时可调低）|

---

## 五、常见任务列表
> 以下是目前支持的所有仿真任务。`--task` 参数需填写「task 名称」列中的值。
### Google Robot 任务
**抓取类任务：**

|task 名称|说明|
|-|-|
|`google_robot_pick_coke_can`|抓可乐罐（默认姿态，推荐入门）|
|`google_robot_pick_horizontal_coke_can`|可乐罐水平放置（增加难度）|
|`google_robot_pick_vertical_coke_can`|可乐罐垂直放置|
|`google_robot_pick_standing_coke_can`|可乐罐站立|
|`google_robot_pick_object`|抓取随机物体（泛化测试）|

**移动类任务：**

|task 名称|说明|
|-|-|
|`google_robot_move_near`|移动物体到目标附近（v1，推荐）|
|`google_robot_move_near_v0`|同上 v0 版本|
|`google_robot_move_near_v1`|同上 v1 版本|

**抽屉操作任务：**

|task 名称|说明|
|-|-|
|`google_robot_open_drawer`|打开抽屉（随机层）|
|`google_robot_open_top_drawer`|打开顶部抽屉|
|`google_robot_open_middle_drawer`|打开中间抽屉|
|`google_robot_open_bottom_drawer`|打开底部抽屉|
|`google_robot_close_drawer`|关闭抽屉（随机层）|
|`google_robot_close_top_drawer`|关闭顶部抽屉|
|`google_robot_close_middle_drawer`|关闭中间抽屉|
|`google_robot_close_bottom_drawer`|关闭底部抽屉|

**放置类任务：**

|task 名称|说明|
|-|-|
|`google_robot_place_in_closed_drawer`|放入关闭的抽屉（随机层）|
|`google_robot_place_in_closed_top_drawer`|放入顶部抽屉|
|`google_robot_place_in_closed_middle_drawer`|放入中间抽屉|
|`google_robot_place_in_closed_bottom_drawer`|放入底部抽屉|
|`google_robot_place_apple_in_closed_top_drawer`|放苹果到顶部抽屉|

### WidowX Bridge 任务
|task 名称|说明|
|-|-|
|`widowx_spoon_on_towel`|勺子放毛巾上|
|`widowx_carrot_on_plate`|胡萝卜放盘子上|
|`widowx_stack_cube`|堆叠方块|
|`widowx_put_eggplant_in_basket`|茄子放篮子里|

---

## 六、最佳实践建议
1. **首次使用**：推荐从 RT-1-X 模型 + `google_robot_pick_coke_can` 任务开始，这是最经典的评估组合
2. **快速测试**：使用 `--n-trajs 3` 减少测试时间，确认流程跑通后再增加轨迹数
3. **性能优化**：RTX 4090 上仿真服务器建议 `--max-envs` 不超过 5，避免显存溢出
4. **结果保存**：推理结果（视频 + 日志）自动保存在 `--logging-root` 指定的目录中
5. **模型对比**：可以对同一任务分别使用不同 checkpoint 运行评估，对比不同训练阶段的成功率

---

## 七、常见问题（FAQ）
**Q1：首次运行时出现大量 TF 警告信息（cuDNN、cuFFT、cuBLAS 等），是否正常？**

正常。这些是 TensorFlow 初始化 CUDA 库时的日志输出，不影响推理结果。只要最终没有报 Error 即可。

**Q2：运行报错 **`OSError: SavedModel file does not exist`**，怎么办？**

说明 `--ckpt-path` 指定的路径不正确。请确认：

* 路径指向的目录中包含 `saved_model.pb` 文件
* 可以用 `ls <你的ckpt路径>/` 检查目录内容
* 如果使用 BOS 下载，请确认下载是否完整（`bcecmd` 命令是否成功执行）

**Q3：远程调用模式下，推理服务器连不上仿真服务器？**

请检查：

* 仿真服务器是否已启动（`curl http://<仿真服务器IP>:8100/tasks` 应返回任务列表）
* 两台开发机是否在同一 VPC 网络下 /  正确配置了 BLB
* BLB 是否正确配置了 8100 端口的监听
* 防火墙是否放行了 8100 端口

**Q4：可以用自己训练的 RT-1 模型吗？**

可以。只要您的模型是 TensorFlow SavedModel 格式（目录中包含 `saved_model.pb`），将 `--ckpt-path` 指向您的模型目录即可。

**Q5：如何查看评估结果？**

推理完成后，终端会输出每条轨迹的成功/失败状态和总体成功率。详细的仿真视频和日志保存在 `--logging-root` 指定的目录中，可以直接下载查看，也可以根据输出报文查看。