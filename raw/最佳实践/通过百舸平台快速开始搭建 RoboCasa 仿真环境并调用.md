## 一、产品简介
RoboCasa 是斯坦福大学发布的一款**厨房场景机器人仿真工具**，可以让您在电脑上模拟机器人执行各种厨房操作，无需真实机器人即可训练和测试。

**核心能力：**

* 提供 365 个厨房操作任务（拿取、放置、开关橱柜/冰箱/微波炉等），覆盖常见生活场景
* 基于 MuJoCo 物理引擎，**无需额外 license 文件**，开箱即用
* 内置 2200+ 小时的示教数据集，可直接用于策略训练
* 支持 Diffusion Policy 等主流机器人策略

**典型使用场景：**

* 在无真实机器人的情况下验证操作策略效果
* 对比不同策略模型在厨房任务中的表现
* 快速迭代和调试机器人控制算法

**与 LIBERO 的主要区别：**

如果您之前用过 LIBERO 仿真工具，以下是 RoboCasa 的主要不同点：

|对比项|LIBERO|RoboCasa|
|-|-|-|
|任务规模|130 个桌面操作任务|365 个厨房操作任务|
|MuJoCo 授权|需要 license 文件|**无需**（免费）|
|无 GPU 渲染方式|需要 Xvfb|**OSMesa**（更简单）|
|数据格式|HDF5|lerobot (parquet)|

本指南帮助您快速上手核心功能。

---

## 二、快速开始
### 环境准备与开发机创建
#### 推荐硬件配置
|配置项|最低要求|推荐配置|
|-|-|-|
|GPU|无|L20 或更高规格的加速卡|
|内存|32GB|64GB+|
|CPU|8 核|16 核+|
|存储|按需|100GB+（含数据集）|

> **说明**：RoboCasa 的仿真运行可以在无 CPU 机器中运行。但 GPU 能提供更高的仿真效率
#### 1.1 创建开发机
打开百舸控制台 → 进入开发机页面 → 点击【创建实例】，按以下信息配置：

**基本信息：**

|配置项|填写说明|
|-|-|
|实例名称|自定义命名|
|资源池类型/资源池/队列|根据您已有的资源池类型选择|
|资源规格|按上方推荐硬件配置选择|
|云磁盘|推荐预留 50GiB，保证运行空间|

**访问配置：**

* **配置自定义端口**：开启端口 **8100**（用于后续远程调用仿真服务，如果只做本地验证可先跳过）
* **配置 BLB**：如需远程调用，请配置 BLB

![](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_31fd80f.png)


填写完成后点击【确定】，等待开发机创建完成。

#### 1.2 登录开发机
创建成功后，在开发机列表中找到刚创建的实例，等待状态变为「运行中」后，点击【登录】进入终端。

> **提示**：如果开发机状态长时间处于「创建中」，请检查资源池是否有可用资源。
开发机镜像中已经预装了完整的 RoboCasa 环境，目录结构如下：

```
/root/workspace/
├── robocasa/           # RoboCasa 主程序（含厨房场景资源 23GB）
│   └── robocasa-quickstart.ipynb   # 本文件
├── robosuite/          # robosuite 仿真框架
└── baige/              # 百舸预置脚本（包含一键启动、验证等工具）
```


进入`robocasa-quickstart.ipynb`后，选择 RoboCasa 内核环境

![](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%281%29_27baf8d.png)

### 下载资产
```python
# 从百度 BOS 下载
bcecmd bos cp -r bos:/aihc-rdw-bj/robocasa-assets/ /root/workspace/robocasa/robocasa/models/assets/
```
环境可用性检查

```python
import os
import sys

os.environ.setdefault("MUJOCO_GL", "osmesa")
os.environ.setdefault("PYOPENGL_PLATFORM", "osmesa")

import numpy as np
```
```python
"""
RoboCasa 快速验证
测试内容：
  1. 创建环境（PnPCounterToCab 任务）
  2. reset + 随机 step × 5
  3. 打印 obs keys 和 reward
  4. 渲染一帧并保存为 PNG
运行方式：
  MUJOCO_GL=osmesa python baige/robocasa_test_getting_started.py
  或
  sh baige/robocasa_headless_run.sh python baige/robocasa_test_getting_started.py
"""

print("=== RoboCasa 环境验证 ===\n")

# 1. 导入
try:
    import robosuite
    import robocasa
    print(f"robosuite 版本: {robosuite.__version__}")
    print(f"robocasa 路径: {robocasa.__path__[0]}")
except ImportError as e:
    print(f"[ERROR] 导入失败: {e}")
    sys.exit(1)

import robosuite as suite
from robosuite.controllers import load_composite_controller_config

# 2. 创建环境
print("\n[1/4] 创建环境 (PnPCounterToCab)...")
try:
    controller_config = load_composite_controller_config(robot="PandaOmron")
    env = suite.make(
        env_name="PickPlaceCounterToCabinet",
        robots="PandaOmron",
        controller_configs=controller_config,
        has_renderer=False,
        has_offscreen_renderer=True,
        use_camera_obs=True,
        camera_names=["robot0_agentview_center"],
        camera_heights=128,
        camera_widths=128,
        render_gpu_device_id=-1,   # -1 = CPU/osmesa
    )
    print("  环境创建成功")
except Exception as e:
    print(f"[ERROR] 创建环境失败: {e}")
    import traceback; traceback.print_exc()
    sys.exit(1)

# 3. Reset
print("\n[2/4] Reset 环境...")
try:
    obs = env.reset()
    print(f"  obs keys 数量: {len(obs)}")
    print(f"  obs keys 示例: {list(obs.keys())[:8]}")
except Exception as e:
    print(f"[ERROR] Reset 失败: {e}")
    import traceback; traceback.print_exc()
    sys.exit(1)

# 4. 随机 step
print("\n[3/4] 随机 step × 5...")
try:
    total_reward = 0.0
    low, high = env.action_spec
    for i in range(5):
        action = np.random.uniform(low, high)
        obs, reward, done, info = env.step(action)
        total_reward += reward
        print(f"  step {i+1}: reward={reward:.4f}, done={done}")
    print(f"  累计 reward: {total_reward:.4f}")
except Exception as e:
    print(f"[ERROR] Step 失败: {e}")
    import traceback; traceback.print_exc()
    sys.exit(1)

# 5. 渲染并保存
print("\n[4/4] 渲染并保存图像...")
try:
    from PIL import Image
    cam_key = "robot0_agentview_center_image"
    if cam_key in obs:
        img_array = obs[cam_key]
        # robosuite 图像是 (H, W, 3)，值域 [0,255]，需要上下翻转
        img_array = img_array[::-1]
        img = Image.fromarray(img_array.astype(np.uint8))
        img.save("test_frame.png")
        print(f"  图像已保存: test_frame.png  shape={img_array.shape}")
    else:
        print(f"  [WARN] 未找到相机 obs key '{cam_key}'，可用 keys: {[k for k in obs if 'image' in k]}")
except Exception as e:
    print(f"[ERR] {e}")

env.close()
print("\n=== 验证完成 ✓ ===")
```

![](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%282%29_80f810b.png)

![test_frame.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/test_frame_61eeece.png)


### 1.3 基础用法
### Gym 封装器
```python
import gymnasium as gym
import robocasa
from robocasa.utils.env_utils import run_random_rollouts

env = gym.make(
    "robocasa/PickPlaceCounterToCabinet",
    split="pretrain", # use 'pretrain' or 'target' kitchen scenes and objects
    seed=0 # seed environment as needed. set seed=None to run unseeded
)

# run rollouts with random actions and save video
run_random_rollouts(
    env, num_rollouts=3, num_steps=100, video_path="/tmp/test.mp4"
)
```

![image \(3\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%283%29_6d41724.png)

### 
---

## 三、远程调用
### 场景说明
在实际使用中，您可能希望将**仿真环境**和**策略推理**部署在不同的机器上，例如：

* 仿真环境运行在一台服务器上，负责物理模拟和画面渲染
* 策略推理运行在另一台机器上，负责决策计算
* 团队中多人共享同一个仿真服务，各自运行不同的策略

此时可以使用远程调用功能，将系统拆分为两台机器通过网络通信：

![](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%284%29_31eb2b2.png)


### 创建流程
需要创建**两台开发机**（仿真服务器 + 推理服务器），创建步骤与「二、快速开始」相同，额外注意以下配置。

### 仿真服务器配置（Server B）
在开发机创建阶段，需要额外操作：

1. **配置自定义端口**：开启端口 **8100**（如在快速开始中已配置，可跳过）
2. **配置 BLB**：选择您使用的 BLB

> **创建成功后**，在开发机详情页中会显示该机器的 **IP 地址**与仿真服务绑定端口
### 第一步：启动仿真服务
在仿真服务器上登录终端，执行以下命令：

```python
!bash ../baige/robocasa_deploy.sh
```

![](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%285%29_40770b0.png)

**确认服务是否正常运行：**

```python
# 健康检查
!curl http://localhost:8100/health
# {"status":"ok"}

# 查看支持的任务列表
!curl http://localhost:8100/tasks
# {"common_tasks": [...], "count": 12}
```
### 第二步：运行推理客户端
如果需要在远程推理服务器（或本地机器）上调用仿真服务，则需要将 `<仿真服务器IP>` 与`<仿真服务实际对外暴露端口>`替换为你实际使用的值

```python
%%bash
python3.11 ../baige/robocasa_random_remote.py \
    e# --server http://<仿真服务器IP>:<仿真服务实际对外暴露端口> \  # 远程调用
    --server http://localhost:8100 \  # 本地运行推理用于测试
    --task PickPlaceCounterToCabinet \
    --n-trajs 3 \
    --max-steps 100 \
    --save-gif        # 可选：保存仿真动画为 GIF 文件
```

![](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%286%29_f9c55dd.png)

```
=== RoboCasa 远程随机推理 ===
Server : http://192.168.1.100:8100
Task   : PickPlaceCounterToCabinet
Trajs  : 3  MaxSteps: 100

[✓] 服务健康: {'status': 'ok'}
[✓] 可用任务数: 12

Episode 1/3 | env_id=6e90a48f... | action_dim=12
  reset OK | obs_keys=30
  steps=100 | reward=0.0000 | done=False | 72.3s

==================================================
完成轨迹: 3
平均步数: 100.0
平均 reward: 0.0000
成功率: 0.0%  (随机策略预期 0%)
==================================================

[✓] GIF 已保存: baige/robocasa_random_rollout.gif
```
> **说明**：因为使用的是随机策略，所以成功率为 0% 是正常现象。实际使用请替换为训练好的策略模型
---

## 四、关键参数说明
### 仿真服务 API 接口
仿真服务启动后，提供以下 HTTP 接口供推理端调用：

|接口|方法|说明|
|-|-|-|
|`/health`|GET|健康检查，确认服务是否正常|
|`/tasks`|GET|列出所有支持的仿真任务|
|`/env/create`|POST|创建一个新的仿真环境|
|`/env/{env_id}/reset`|POST|重置环境到初始状态|
|`/env/{env_id}/step`|POST|执行一个动作，获取结果|
|`/env/{env_id}`|DELETE|销毁环境，释放资源|

**创建环境示例：**

```python
!curl -s -X POST http://localhost:8100/env/create \
    -H "Content-Type: application/json" \
    -d '{"task_name": "PickPlaceCounterToCabinet", "robot": "PandaOmron"}'
```
### 推理客户端参数（robocasa_random_remote.py）
|参数|必选|说明|默认值|
|-|-|-|-|
|`--server`|是|仿真服务器地址（含端口）|-|
|`--task`|否|任务名称（见第五节任务列表）|`PickPlaceCounterToCabinet`|
|`--n-trajs`|否|评测轨迹数量（越多结果越稳定）|`3`|
|`--max-steps`|否|每条轨迹最大步数|`50`|
|`--save-gif`|否|是否保存仿真动画为 GIF|否|

---

## 五、常见任务列表
> 以下是 RoboCasa 中常用的仿真任务。`--task` 参数需填写「任务名称」列中的值。
### 取放类任务
|任务名称|说明|
|-|-|
|`PickPlaceCounterToCabinet`|从台面取物放入橱柜（推荐入门）|
|`PickPlaceCabinetToCounter`|从橱柜取物放回台面|
|`PickPlaceCounterToSink`|从台面取物放入水槽|
|`PickPlaceCounterToMicrowave`|从台面取物放入微波炉|

### 开关类任务
|任务名称|说明|
|-|-|
|`OpenCabinet`|打开橱柜门|
|`CloseCabinet`|关闭橱柜门|
|`OpenMicrowave`|打开微波炉|
|`CloseMicrowave`|关闭微波炉|
|`OpenFridge`|打开冰箱|
|`CloseFridge`|关闭冰箱|

> **提示**：RoboCasa 共支持 365 个任务，以上仅列出最常用的。如需查看完整列表，可在 Python 中执行：
```python
import robocasa, robosuite
print(list(robosuite.environments.REGISTERED_ENVS.keys()))
```
---

## 六、最佳实践建议
1. **首次使用**：推荐先运行验证脚本（步骤 3），确认环境正常后再进行后续操作
2. **快速测试**：使用 `--n-trajs 3 --max-steps 50` 减少测试时间，确认流程跑通后再增加数量
3. **无 GPU 也能用**：仿真运行不需要 GPU，使用 OSMesa 软件渲染即可，适合在 CPU 开发机上调试
4. **远程调用**：如果需要仿真和推理分离部署，使用内置的 `env_server` + 推理客户端方案
5. **任务名称注意**：RoboCasa v1.0 对任务名做了重命名（如 `PnPCounterToCab` → `PickPlaceCounterToCabinet`），请使用新名称



#### 【可选】RDP 连接运行
如果您希望有可视化界面也可以通过以下方式启动 RDP 服务：

1. 开启开发机自定义端口
2. 配置 3389 端口（启动脚本使用该端口）
3. 使用以下命令开启开发机 RDP 服务并配置密码

```
bash rdp_setup.sh
# 使用指令配置密码
passwd root
```
4. 然后在您的电脑上下载远程桌面客户端
5. 添加电脑，输入您的 ip 地址:端口号，并配置账号名和密码
6. 双击图标进入可视化界面，通过其终端执行命令即可



---

## 七、常见问题（FAQ）
**Q1：运行时出现 **`Segmentation fault (core dumped)`**，怎么办？**

这是最常见的问题。原因是仿真引擎默认尝试使用图形界面渲染，但服务器没有显示器，导致崩溃。

**解决方法：** 使用百舸提供的一键启动脚本运行您的程序：

```bash
sh /root/workspace/baige/robocasa_headless_run.sh <您的命令>
```
脚本会自动设置正确的渲染模式。如果您需要手动设置，请确保在运行任何 Python 代码**之前**执行：

```bash
export MUJOCO_GL=osmesa
export PYOPENGL_PLATFORM=osmesa
unset DISPLAY
```
**Q2：运行时报错 **`Environment PnPCounterToCab not found`**，怎么办？**

这是因为 RoboCasa v1.0 对任务名称做了更新。请使用新名称：

|旧名称（已废弃）|新名称（请使用这个）|
|-|-|
|`PnPCounterToCab`|`PickPlaceCounterToCabinet`|
|`PnPCabToCounter`|`PickPlaceCabinetToCounter`|

如需查看所有可用任务名，请在 Python 中运行：

```python
import robocasa, robosuite
print(list(robosuite.environments.REGISTERED_ENVS.keys()))
```
**Q3：运行时提示缺少系统库（如 **`libGL`** 或 **`libosmesa`**），怎么办？**

请执行以下命令安装系统依赖：

```bash
apt-get install -y linux-libc-dev build-essential gcc \
    libgl1 libglib2.0-0 xvfb libosmesa6
```
安装完成后重新运行即可。

**Q4：远程调用模式下，推理客户端连不上仿真服务器？**

请依次检查：

1. 仿真服务是否已启动：在仿真服务器上执行 `curl http://localhost:8100/health`，应返回 `{"status":"ok"}`
2. 两台开发机是否在同一 VPC 网络下 / 正确配置了 BLB
3. BLB 是否正确配置了 8100 端口的监听
4. 防火墙是否放行了 8100 端口

**Q5：RoboCasa 需要 GPU 吗？**

* **仅运行仿真**：不需要 GPU，CPU 机器即可，使用 OSMesa 软件渲染
* **策略训练**：需要 GPU（推荐支持 RTX 渲染的显卡）