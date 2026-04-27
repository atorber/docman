RLinf（Reinforcement Learning Infrastructure）是一个由清华大学、无问芯穹联合北京大学、伯克利等顶级机构联合开发的开源强化学习基础设施框架。它专为**大规模、高效率的强化学习（RL）后训练**而设计，旨在解决传统RL框架在训练具身智能体和大语言模型时面临的异构性、低效性和复杂性难题。

所述工作流基于 Rlinf  官方镜像环境针对 pi0.5 进行强化学习训练与评估。


## 硬件要求
以下是本快速开始使用的硬件配置：

|组件|配置|
|-|-|
|GPU| 8 块 A800|
|CPU| 110 核|
|内存| 900 GiB|


## 运行环境
在官方镜像中，提供了三套环境对应不同的模型，即`openvla`、`openvla-oft` 和 `openpi`，可以通过以下指令进行切换：

```
source switch_env <env_name>
# source switch_env openvla
# source switch_env openvla-oft
# source switch_env openpi
```
## 项目下载
通过以下代码下载 Rlinf 项目：

```
git clone https://github.com/RLinf/RLinf
# 为提高国内下载速度，可以使用：
# git clone https://ghfast.top/github.com/RLinf/RLinf.git
```
后续相关 example 都在该项目中。

## 模型下载
Rlinf 官方提供了不同版本的 Pi、Pi0.5 以及 VLA 模型，可以通过以下方式进行下载，此处以LIBERO空间物体目标任务 SFT 训练模型为例，如果需要下载其他模型可以参考附录选择需要的模型进行下载：

```
pip install huggingface-hub
# 此处可以调整自己的下载路径
# 例如 pi05 模型
hf download RLinf/RLinf-Pi05-LIBERO-SFT --local-dir ./data_asserts/
# pi0 模型
# hf download RLinf/RLinf-Pi0-LIBERO-Spatial-Object-Goal-SFT --local-dir ./data_asserts/
```
## 运行参数配置
在项目下载中的 examples/embodiment/config 文件夹中可以找到相关运行参数文件，其中已经包含了针对部分任务的配置，对于 libero-10，对应 pi0 与 pi05 有如下示例配置文件：

* **π0+ PPO: **examples/embodiment/config/libero_10_ppo_openpi.yaml
* **π0+ GRPO: **examples/embodiment/config/libero_10_grpo_openpi.yaml
* **π0.5+ PPO: **examples/embodiment/config/libero_10_ppo_openpi_pi05.yaml
* **π0.5+ GRPO: **examples/embodiment/config/libero_10_grpo_openpi_pi05.yaml

以下以**libero_10_ppo_openpi_pi05**为例。

### 显卡运行参数配置
Rlinf 框架中有三个组件（env、rollout、actor），**Env提供规则和反馈，Rollout负责用当前策略去收集数据，Actor则利用这些数据来学习和改进策略本身**。三者形成一个闭环，驱动模型从零开始成长。

通过配置 cluster 参数可以灵活配置三个组件（env、rollout、actor）使用 GPU 数量，外加配置 rollout 中的 pipeline_stage_num:2来实现流水线重合提升效率，例如使用以下配置：

```
cluster:
   num_nodes: 1
   component_placement:
      env: 0-3
      rollout: 4-7
      actor: 0-7

rollout:
   pipeline_stage_num: 2
```
可以通过以下配置实现组件完全共享 GPU：

```
cluster:
   num_nodes: 1
   component_placement:
      env,rollout,actor: all
```
也可以通过以下配置实现 GPU 完全隔离，互不干扰：

```
cluster:
   num_nodes: 1
   component_placement:
      env: 0-1
      rollout: 2-5
      actor: 6-7
```
### 运行参数配置
#### 2.1 模型参数
```
openpi:
  noise_level: 0.5
  action_chunk: ${actor.model.num_action_chunks}
  num_steps: ${actor.model.num_steps}
  train_expert_only: True
  action_env_dim: ${actor.model.action_dim}
  noise_method: "flow_sde"
  add_value_head: False
  pi05: False
  value_after_vlm: False
```
在 openpi 模块可以针对以上参数进行独立配置

#### 2.2 LoRA设置
如果您想使用 LoRA 进行微调，请配置 is_lora: True并设置 lora_rank，当前不支持梯度检查点，请保证gradient_checkpointing: False：

```
model:
  is_lora: True
  lora_rank: 8
  gradient_checkpointing: False
```
### 模型加载配置
通过修改以下配置来指向已下载的模型：

```
# 使用模型下载中使用地址的绝对路径
model_dir: "./data_asserts/"
```
## 进行强化学习训练
通过以下命令进行训练：

```
# 通过调整 CHOSEN_CONFIG 调用不同训练任务
# bash examples/embodiment/run_embodiment.sh CHOSEN_CONFIG
bash examples/embodiment/run_embodiment.sh libero_10_ppo_openpi_pi05
```
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9693ad5.png)

运行如图

训练已默认配置 Tensorboard，可通过如下指令查看：

```
# 可将 ./logs 改为日志地址
tensorboard --logdir ./logs --port 6006
```
训练输出文件默认位于./logs/任务时间-任务名文件夹中，输出文件如下所示，包含 checkpoint，tensorboard 以及训练输出 video：

```
.
├── libero_10_ppo_openpi_pi05
│   └── checkpoints
│       └── global_step_40
│           └── actor
│               ├── dcp_checkpoint
│               └── model_state_dict
├── tensorboard
└── video
    └── train
        ├── seed_0
        ├── seed_1
        ├── seed_2
        ├── seed_3
        ├── seed_4
        ├── seed_5
        ├── seed_6
        └── seed_7
```
![0 \(1\).gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/0%20%281%29_ad9d384.gif)
## 模型评估
所有的评估辅助脚本位于 examples/embodiment/ 目录下，可以根据需要修改 checkpoint 路径、GPU ID 等配置即可，以下是使用 LIBERO 进行评测的脚本（eval_embodiment.sh）：

```
#! /bin/bash

export EMBODIED_PATH="$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
export REPO_PATH=$(dirname "$(dirname "$EMBODIED_PATH")")
export SRC_FILE="${EMBODIED_PATH}/eval_embodied_agent.py"

export MUJOCO_GL="osmesa"
export PYOPENGL_PLATFORM="osmesa"
export PYTHONPATH=${REPO_PATH}:$PYTHONPATH

# LIBERO 仓库路径
export LIBERO_PATH="/opt/LIBERO"
export PYTHONPATH=${LIBERO_PATH}:$PYTHONPATH

export CUDA_LAUNCH_BLOCKING=1
export HYDRA_FULL_ERROR=1

CONFIG_NAME=${1:-libero_goal_grpo_openvlaoft.eval}

LOG_DIR="${REPO_PATH}/logs/$(date +'%Y%m%d-%H:%M:%S')"
MEGA_LOG_FILE="${LOG_DIR}/eval_embodiment.log"
mkdir -p "${LOG_DIR}"

CMD="python ${SRC_FILE} --config-path ${EMBODIED_PATH}/config/ \
     --config-name ${CONFIG_NAME} \
     runner.logger.log_path=${LOG_DIR}"

echo ${CMD}
${CMD} 2>&1 | tee "${MEGA_LOG_FILE}"
```
### 修改配置文件
修改examples/embodiment/config/libero_10_ppo_openpi.yaml 文件内相关配置

```
runner:
  eval_policy_path: "/path/to/rl_ckpt.pt"    # 可选：.pt文件路径或直接填None。如果为None，将使用rollout.model.model_path中的检查点。
  only_eval: True    # 配置为 true 这样就不会再 eval 中间再跑 training 了
algorithm:
  eval_rollout_epoch: 1
rollout:
  model:
    model_path: "/path/to/sft_base_model/"
actor:
  model:
    model_path: "/path/to/sft_base_model/"
  tokenizer:
    tokenizer_model: "/path/to/sft_base_model/"
```
以下是一些关键配置字段：

|字段名|作用|
|-|-|
|`simulator_type`|必须为 `libero`|
|`task_suite_name`|LIBERO 任务分支名（如 `libero_goal`）|
|`max_episode_steps`|每个 episode 的最大步数（默认 512）|
|`seed`|环境随机种子|
|`num_envs`|并行评估环境数量（例如 500）|

### 运行评估脚本
通过以下命令运行评估脚本：

```
bash examples/embodiment/eval_embodiment.sh libero_10_ppo_openpi_pi05
```
请注意，如果您使用的显卡规格为NVIDIA A800，请修改评估脚本中的 7-8 行，改为使用 egl ，否则会导致产生异常 kill 的情况：

```
# export MUJOCO_GL="osmesa"
# export PYOPENGL_PLATFORM="osmesa"

export MUJOCO_GL="egl"
export PYOPENGL_PLATFORM="egl"
```
运行结束后，可以在./logs/时间 文件夹下找到对应的评估输出文件：

```
.
├── tensorboard
└── video
    └── eval
        ├── seed_0
        ├── seed_1
        ├── seed_2
        ├── seed_3
        ├── seed_4
        ├── seed_5
        ├── seed_6
        └── seed_7
```
#### 评估矩阵
在其根目录下有对应评估报文，可以找到如下一行确认评估结果：

```
eval_metrics={
    'eval/success_once': array(0.9173387, dtype=float32), 
    'eval/return': array(0.7520161, dtype=float32), 
    'eval/episode_len': array(480., dtype=float32), 
    'eval/reward': array(0.0015667, dtype=float32), 
    'eval/success_at_end': array(0.7520161, dtype=float32)
   }
```    
评估结果包含以下字段，如果启用了 TensorBoard，这些指标也会记录在TensorBoard 中：   

1. **eval/success_once**：也就是成功率——“一个 episode 里只要曾经满足过一次成功条件”，然后对所有评估 episode 取平均。
2. **eval/success_at_end**：终态成功率——看 episode **结束时**是否处于成功状态的比例（通常会 ≤ success_once，因为可能中途成功过但最后失败/掉回去）。

> **success_at_end **其实现细节就是ignore_terminations即在max_step之前已经任务成功了但是还继续跑，直到截断。
> 这里两个的区别是：一个子任务是放置杯子，如果机械臂在操作过程中放置好了，但是离开的时候又把杯子碰倒了，那么success_once=1，但是success_at_end=0
3. **eval/episode_len**：平均 episode 长度（步数）。一般会 ≤ `max_episode_steps`（episode 的 horizon 上限）

> 1. `env.train.max_episode_steps`: Maximum number of steps per episode for training. 我们配置默认设置的是480，也就是说如果达到这么多步都没有结束就会被截断
> 2. `actor.model.num_action_chunks`：送入env中的最大截断action长度，actions_horizon是模型推理的最大长度，基于此截断送入env中交互
> 3. 模型推理的次数：`max_episode_steps` / `num_action_chunks` 就是当前配置下最大需要的推理次数
> 
4. **eval/reward**：平均每步 reward（per-step mean）。也就是RL中的**单步奖励**
5. **eval/return**：每个 episode 的总回报（把该 episode 的每步 reward 累加起来），所以通常有 `return ≈ reward × episode_len`；官方示例里就是 1.0476562 ≈ 0.0130957 × 80。也就是RL中的T累积奖励     

#### 评估视频    
同时在 video 文件夹中也可以找到生成的可视化视频（每个视频下格数为 total_num_envs / 显卡数 / pipeline_stage_num）：

![0.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/0_b2505a6.gif)

每个视频都包含reward、terminated 以及 task三项说明

```
reward: 0.0                        # 这一步环境给的即时奖励
terminated: false                  # 当前task是否完成
task: pick up the book             # 子任务描述
and place it in the
back compartment of
the caddy
```
## 附录1： 官方模型权重
以下是截止 2026-02-06 时Rlinf 在 huggingface 所上传的所有模型，最新模型可直接访问：[https://huggingface.co/RLinf](https://huggingface.co/RLinf/RLinf-Gr00t-RL-Spatial-Step400)[/collections](https://hf-mirror.com/RLinf/collections) 或 [https://hf-mirror.com/RLinf/collections](https://hf-mirror.com/RLinf/collections) 进行获取

|模型名称|参数量|所属模型系列|说明|更新日期|HF 下载地址|
|-|-|-|-|-|-|
|**Gr00t-RL系列**||||||
|RLinf-Gr00t-RL-Spatial-Step400|-|Gr00t-RL系列|GR00T RL模型 - 空间推理任务|2025-12-16|[https://huggingface.co/RLinf/RLinf-Gr00t-RL-Spatial-Step400](https://huggingface.co/RLinf/RLinf-Gr00t-RL-Spatial-Step400)|
|RLinf-Gr00t-RL-Goal-Step500|-|Gr00t-RL系列|GR00T RL模型 - 目标导向任务|2025-12-11|[https://huggingface.co/RLinf/RLinf-Gr00t-RL-Goal-Step500](https://huggingface.co/RLinf/RLinf-Gr00t-RL-Goal-Step500)|
|RLinf-Gr00t-RL-Long-Step300|-|Gr00t-RL系列|GR00T RL模型 - 长程任务|2025-12-11|[https://huggingface.co/RLinf/RLinf-Gr00t-RL-Long-Step300](https://huggingface.co/RLinf/RLinf-Gr00t-RL-Long-Step300)|
|RLinf-Gr00t-RL-Object-Step400|-|Gr00t-RL系列|GR00T RL模型 - 物体操作任务|2025-12-11|[https://huggingface.co/RLinf/RLinf-Gr00t-RL-Object-Step400](https://huggingface.co/RLinf/RLinf-Gr00t-RL-Object-Step400)|
|RLinf-Gr00t-RL-Stack-cube|-|Gr00t-RL系列|GR00T RL模型 - Stack cube任务|2026-02-06|[https://huggingface.co/RLinf/RLinf-Gr00t-RL-Stack-cube](https://huggingface.co/RLinf/RLinf-Gr00t-RL-Stack-cube)|
|**Gr00t-SFT系列**||||||
|RLinf-Gr00t-SFT-Object|3B|Gr00t-SFT系列|GR00T SFT模型 - 物体操作任务|2025-12-11|[https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Object](https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Object)|
|RLinf-Gr00t-SFT-Goal|3B|Gr00t-SFT系列|GR00T SFT模型 - 目标导向任务|2025-12-11|[https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Goal](https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Goal)|
|RLinf-Gr00t-SFT-Long|3B|Gr00t-SFT系列|GR00T SFT模型 - 长程任务|2025-12-11|[https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Long](https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Long)|
|RLinf-Gr00t-SFT-Spatial|3B|Gr00t-SFT系列|GR00T SFT模型 - 空间推理任务|2025-11-14|[https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Spatial](https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Spatial)|
|RLinf-Gr00t-SFT-Stack-cube|3B|Gr00t-SFT系列|GR00T SFT模型 - Stack cube任务|2026-02-06|[https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Stack-cube](https://huggingface.co/RLinf/RLinf-Gr00t-SFT-Stack-cube)|
|**OpenSora-LIBERO系列**||||||
|RLinf-OpenSora-LIBERO-Object|1B|OpenSora-LIBERO系列|OpenSora模型 - LIBERO-Object场景任务|2026-01-23|[https://huggingface.co/RLinf/RLinf-OpenSora-LIBERO-Object](https://huggingface.co/RLinf/RLinf-OpenSora-LIBERO-Object)|
|RLinf-OpenSora-LIBERO-Spatial|1B|OpenSora-LIBERO系列|OpenSora模型 - LIBERO-Spatial空间推理任务|2026-01-23|[https://huggingface.co/RLinf/RLinf-OpenSora-LIBERO-Spatial](https://huggingface.co/RLinf/RLinf-OpenSora-LIBERO-Spatial)|
|**OpenVLA系列**||||||
|RLinf-OpenVLA-GRPO-ManiSkill3-25ood|8B|OpenVLA系列|OpenVLA模型 - ManiSkill3 OOD任务 - GRPO训练|2025-10-10|[https://huggingface.co/RLinf/RLinf-OpenVLA-GRPO-ManiSkill3-25ood](https://huggingface.co/RLinf/RLinf-OpenVLA-GRPO-ManiSkill3-25ood)|
|RLinf-OpenVLA-PPO-ManiSkill3-25ood|8B|OpenVLA系列|OpenVLA模型 - ManiSkill3 OOD任务 - PPO训练|2025-10-10|[https://huggingface.co/RLinf/RLinf-OpenVLA-PPO-ManiSkill3-25ood](https://huggingface.co/RLinf/RLinf-OpenVLA-PPO-ManiSkill3-25ood)|
|**OpenVLAOFT系列**||||||
|RLinf-OpenVLAOFT-Behavior|8B|OpenVLAOFT系列|OpenVLAOFT通用行为模型|2025-10-29|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-Behavior](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-Behavior)|
|RLinf-OpenVLAOFT-GRPO-ManiSkill3-25ood|8B|OpenVLAOFT系列|OpenVLAOFT模型 - ManiSkill3 OOD任务 - GRPO训练|2025-10-10|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-ManiSkill3-25ood](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-ManiSkill3-25ood)|
|RLinf-OpenVLAOFT-PPO-ManiSkill3-25ood|8B|OpenVLAOFT系列|OpenVLAOFT模型 - ManiSkill3 OOD任务 - PPO训练|2025-10-10|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-PPO-ManiSkill3-25ood](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-PPO-ManiSkill3-25ood)|
|RLinf-OpenVLAOFT-GRPO-LIBERO-object|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-object任务 - GRPO训练|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-object](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-object)|
|RLinf-OpenVLAOFT-GRPO-LIBERO-goal|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-goal任务 - GRPO训练|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-goal](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-goal)|
|RLinf-OpenVLAOFT-GRPO-LIBERO-90|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-90任务 - GRPO训练|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-90](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-90)|
|RLinf-OpenVLAOFT-GRPO-LIBERO-spatial|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-spatial任务 - GRPO训练|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-spatial](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-spatial)|
|RLinf-OpenVLAOFT-GRPO-LIBERO-long|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-long任务 - GRPO训练|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-long](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-GRPO-LIBERO-long)|
|RLinf-OpenVLAOFT-LIBERO-90-Base-Lora|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-90任务 - Base Lora|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-LIBERO-90-Base-Lora](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-LIBERO-90-Base-Lora)|
|RLinf-OpenVLAOFT-LIBERO-130-Base-Lora|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-130任务 - Base Lora|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-LIBERO-130-Base-Lora](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-LIBERO-130-Base-Lora)|
|RLinf-OpenVLAOFT-LIBERO-130|8B|OpenVLAOFT系列|OpenVLAOFT模型 - LIBERO-130任务|2025-12-21|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-LIBERO-130](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-LIBERO-130)|
|RLinf-OpenVLAOFT-ManiSkill-Base-Lora|-|OpenVLAOFT系列|OpenVLAOFT模型 - ManiSkill任务 - Base Lora|2025-12-14|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-ManiSkill-Base-Lora](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-ManiSkill-Base-Lora)|
|RLinf-OpenVLAOFT-ManiSkill-Base-Main|8B|OpenVLAOFT系列|OpenVLAOFT模型 - ManiSkill任务 - Base Main|2025-12-14|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-ManiSkill-Base-Main](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-ManiSkill-Base-Main)|
|**OpenVLAOFT-RoboTwin系列**||||||
|RLinf-OpenVLAOFT-RoboTwin-SFT-beat_block_hammer|8B|OpenVLAOFT-RoboTwin系列|SFT模型 - 用锤子敲击方块|2026-01-10|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-beat_block_hammer](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-beat_block_hammer)|
|RLinf-OpenVLAOFT-RoboTwin-SFT-place_empty_cup|8B|OpenVLAOFT-RoboTwin系列|SFT模型 - 放置空杯子|2026-01-08|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-place_empty_cup](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-place_empty_cup)|
|RLinf-OpenVLAOFT-RoboTwin-SFT-handover_block|8B|OpenVLAOFT-RoboTwin系列|SFT模型 - 交接方块|2026-01-31|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-handover_block](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-handover_block)|
|RLinf-OpenVLAOFT-RoboTwin-SFT-lift_pot|8B|OpenVLAOFT-RoboTwin系列|SFT模型 - 抬起锅|2026-01-31|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-lift_pot](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-lift_pot)|
|RLinf-OpenVLAOFT-RoboTwin-SFT-move_can_pot|8B|OpenVLAOFT-RoboTwin系列|SFT模型 - 移动罐子到锅中|2026-01-31|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-move_can_pot](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-move_can_pot)|
|RLinf-OpenVLAOFT-RoboTwin-SFT-pick_dual_bottles|8B|OpenVLAOFT-RoboTwin系列|SFT模型 - 拾取两个瓶子|2026-01-10|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-pick_dual_bottles](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-SFT-pick_dual_bottles)|
|RLinf-OpenVLAOFT-RoboTwin-RL-beat_block_hammer|-|OpenVLAOFT-RoboTwin系列|RL模型 - 用锤子敲击方块|2026-01-14|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-beat_block_hammer](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-beat_block_hammer)|
|RLinf-OpenVLAOFT-RoboTwin-RL-handover_block|-|OpenVLAOFT-RoboTwin系列|RL模型 - 交接方块|2026-01-31|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-handover_block](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-handover_block)|
|RLinf-OpenVLAOFT-RoboTwin-RL-lift_pot|8B|OpenVLAOFT-RoboTwin系列|RL模型 - 抬起锅|2026-01-31|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-lift_pot](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-lift_pot)|
|RLinf-OpenVLAOFT-RoboTwin-RL-move_can_pot|8B|OpenVLAOFT-RoboTwin系列|RL模型 - 移动罐子到锅中|2026-01-31|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-move_can_pot](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-move_can_pot)|
|RLinf-OpenVLAOFT-RoboTwin-RL-pick_dual_bottles|8B|OpenVLAOFT-RoboTwin系列|RL模型 - 拾取两个瓶子|2026-01-13|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-pick_dual_bottles](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-pick_dual_bottles)|
|RLinf-OpenVLAOFT-RoboTwin-RL-place_empty_cup|-|OpenVLAOFT-RoboTwin系列|RL模型 - 放置空杯子|2026-01-13|[https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-place_empty_cup](https://huggingface.co/RLinf/RLinf-OpenVLAOFT-RoboTwin-RL-place_empty_cup)|
|**Pi0系列**||||||
|RLinf-Pi0-Behavior|4B|Pi0系列|Pi0通用行为模型|2025-11-27|[https://huggingface.co/RLinf/RLinf-Pi0-Behavior](https://huggingface.co/RLinf/RLinf-Pi0-Behavior)|
|RLinf-Pi0-CALVIN-ABC-D-RL-FlowNoise|-|Pi0系列|Pi0模型 - CALVIN ABC-D任务 - FlowNoise算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi0-CALVIN-ABC-D-RL-FlowNoise](https://huggingface.co/RLinf/RLinf-Pi0-CALVIN-ABC-D-RL-FlowNoise)|
|RLinf-Pi0-CALVIN-ABC-D-RL-FlowSDE|-|Pi0系列|Pi0模型 - CALVIN ABC-D任务 - FlowSDE算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi0-CALVIN-ABC-D-RL-FlowSDE](https://huggingface.co/RLinf/RLinf-Pi0-CALVIN-ABC-D-RL-FlowSDE)|
|RLinf-Pi0-CALVIN-ABC-D-SFT|4B|Pi0系列|Pi0模型 - CALVIN ABC-D任务 - SFT|2025-11-29|[https://huggingface.co/RLinf/RLinf-Pi0-CALVIN-ABC-D-SFT](https://huggingface.co/RLinf/RLinf-Pi0-CALVIN-ABC-D-SFT)|
|RLinf-Pi0-LIBERO-Long-SFT|4B|Pi0系列|Pi0模型 - LIBERO长程任务 - SFT|2025-10-16|[https://huggingface.co/RLinf/RLinf-Pi0-LIBERO-Long-SFT](https://huggingface.co/RLinf/RLinf-Pi0-LIBERO-Long-SFT)|
|RLinf-Pi0-LIBERO-Spatial-Object-Goal-SFT|4B|Pi0系列|Pi0模型 - LIBERO空间物体目标 - SFT|2025-10-16|[https://huggingface.co/RLinf/RLinf-Pi0-LIBERO-Spatial-Object-Goal-SFT](https://huggingface.co/RLinf/RLinf-Pi0-LIBERO-Spatial-Object-Goal-SFT)|
|RLinf-Pi0-ManiSkill-25Main-RL-FlowNoise|-|Pi0系列|Pi0模型 - ManiSkill2 25个主要任务 - FlowNoise算法|2025-12-28|[https://huggingface.co/RLinf/RLinf-Pi0-ManiSkill-25Main-RL-FlowNoise](https://huggingface.co/RLinf/RLinf-Pi0-ManiSkill-25Main-RL-FlowNoise)|
|RLinf-Pi0-ManiSkill-25Main-RL-FlowSDE|-|Pi0系列|Pi0模型 - ManiSkill2 25个主要任务 - FlowSDE算法|2025-12-28|[https://huggingface.co/RLinf/RLinf-Pi0-ManiSkill-25Main-RL-FlowSDE](https://huggingface.co/RLinf/RLinf-Pi0-ManiSkill-25Main-RL-FlowSDE)|
|RLinf-Pi0-ManiSkill-25Main-SFT|4B|Pi0系列|Pi0模型 - ManiSkill2 25个主要任务 - SFT|2025-12-18|[https://huggingface.co/RLinf/RLinf-Pi0-ManiSkill-25Main-SFT](https://huggingface.co/RLinf/RLinf-Pi0-ManiSkill-25Main-SFT)|
|RLinf-Pi0-MetaWorld-RL-FlowNoise|-|Pi0系列|Pi0模型 - MetaWorld任务 - FlowNoise算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi0-MetaWorld-RL-FlowNoise](https://huggingface.co/RLinf/RLinf-Pi0-MetaWorld-RL-FlowNoise)|
|RLinf-Pi0-MetaWorld-RL-FlowSDE|-|Pi0系列|Pi0模型 - MetaWorld任务 - FlowSDE算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi0-MetaWorld-RL-FlowSDE](https://huggingface.co/RLinf/RLinf-Pi0-MetaWorld-RL-FlowSDE)|
|RLinf-Pi0-MetaWorld-SFT|4B|Pi0系列|Pi0模型 - MetaWorld任务 - SFT|2025-12-19|[https://huggingface.co/RLinf/RLinf-Pi0-MetaWorld-SFT](https://huggingface.co/RLinf/RLinf-Pi0-MetaWorld-SFT)|
|RLinf-Pi0-RoboCasa|4B|Pi0系列|Pi0模型 - RoboCasa场景任务|2025-12-17|[https://huggingface.co/RLinf/RLinf-Pi0-RoboCasa](https://huggingface.co/RLinf/RLinf-Pi0-RoboCasa)|
|**Pi05系列**||||||
|RLinf-Pi05-CALVIN-ABC-D-RL-FlowNoise|-|Pi05系列|Pi05模型 - CALVIN ABC-D任务 - FlowNoise算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi05-CALVIN-ABC-D-RL-FlowNoise](https://huggingface.co/RLinf/RLinf-Pi05-CALVIN-ABC-D-RL-FlowNoise)|
|RLinf-Pi05-CALVIN-ABC-D-RL-FlowSDE|-|Pi05系列|Pi05模型 - CALVIN ABC-D任务 - FlowSDE算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi05-CALVIN-ABC-D-RL-FlowSDE](https://huggingface.co/RLinf/RLinf-Pi05-CALVIN-ABC-D-RL-FlowSDE)|
|RLinf-Pi05-CALVIN-ABC-D-SFT|4B|Pi05系列|Pi05模型 - CALVIN ABC-D任务 - SFT|2025-11-29|[https://huggingface.co/RLinf/RLinf-Pi05-CALVIN-ABC-D-SFT](https://huggingface.co/RLinf/RLinf-Pi05-CALVIN-ABC-D-SFT)|
|RLinf-Pi05-GSEnv-PutCubeOnPlate-V0-SFT|4B|Pi05系列|Pi05模型 - GSEnv环境中将方块放置到盘子上|2026-02-02|[https://huggingface.co/RLinf/RLinf-Pi05-GSEnv-PutCubeOnPlate-V0-SFT](https://huggingface.co/RLinf/RLinf-Pi05-GSEnv-PutCubeOnPlate-V0-SFT)|
|RLinf-Pi05-LIBERO-130-fullshot-SFT|4B|Pi05系列|Pi05模型 - LIBERO-130任务 - fullshot SFT|2025-11-06|[https://huggingface.co/RLinf/RLinf-Pi05-LIBERO-130-fullshot-SFT](https://huggingface.co/RLinf/RLinf-Pi05-LIBERO-130-fullshot-SFT)|
|RLinf-Pi05-LIBERO-SFT|4B|Pi05系列|Pi05模型 - LIBERO任务 - SFT|2025-11-04|[https://huggingface.co/RLinf/RLinf-Pi05-LIBERO-SFT](https://huggingface.co/RLinf/RLinf-Pi05-LIBERO-SFT)|
|RLinf-Pi05-ManiSkill-25Main-RL-FlowNoise|-|Pi05系列|Pi05模型 - ManiSkill2 25个主要任务 - FlowNoise算法|2025-12-28|[https://huggingface.co/RLinf/RLinf-Pi05-ManiSkill-25Main-RL-FlowNoise](https://huggingface.co/RLinf/RLinf-Pi05-ManiSkill-25Main-RL-FlowNoise)|
|RLinf-Pi05-ManiSkill-25Main-RL-FlowSDE|-|Pi05系列|Pi05模型 - ManiSkill2 25个主要任务 - FlowSDE算法|2025-12-28|[https://huggingface.co/RLinf/RLinf-Pi05-ManiSkill-25Main-RL-FlowSDE](https://huggingface.co/RLinf/RLinf-Pi05-ManiSkill-25Main-RL-FlowSDE)|
|RLinf-Pi05-ManiSkill-25Main-SFT|4B|Pi05系列|Pi05模型 - ManiSkill2 25个主要任务 - SFT|2025-12-18|[https://huggingface.co/RLinf/RLinf-Pi05-ManiSkill-25Main-SFT](https://huggingface.co/RLinf/RLinf-Pi05-ManiSkill-25Main-SFT)|
|RLinf-Pi05-MetaWorld-RL-FlowNoise|-|Pi05系列|Pi05模型 - MetaWorld任务 - FlowNoise算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi05-MetaWorld-RL-FlowNoise](https://huggingface.co/RLinf/RLinf-Pi05-MetaWorld-RL-FlowNoise)|
|RLinf-Pi05-MetaWorld-RL-FlowSDE|-|Pi05系列|Pi05模型 - MetaWorld任务 - FlowSDE算法|2025-12-29|[https://huggingface.co/RLinf/RLinf-Pi05-MetaWorld-RL-FlowSDE](https://huggingface.co/RLinf/RLinf-Pi05-MetaWorld-RL-FlowSDE)|
|RLinf-Pi05-MetaWorld-SFT|4B|Pi05系列|Pi05模型 - MetaWorld任务 - SFT|2025-11-20|[https://huggingface.co/RLinf/RLinf-Pi05-MetaWorld-SFT](https://huggingface.co/RLinf/RLinf-Pi05-MetaWorld-SFT)|
|RLinf-Pi05-PPO-LIBERO-130|-|Pi05系列|Pi05模型 - LIBERO-130任务 - PPO训练|2025-11-13|[https://huggingface.co/RLinf/RLinf-Pi05-PPO-LIBERO-130](https://huggingface.co/RLinf/RLinf-Pi05-PPO-LIBERO-130)|
|**Pi0-LIBERO-130-fullshot系列**||||||
|RLinf-Pi0-LIBERO-130-fullshot-SFT|4B|Pi0-LIBERO-130-fullshot系列|Pi0模型 - LIBERO-130任务 - fullshot SFT|2025-11-06|[https://huggingface.co/RLinf/RLinf-Pi0-LIBERO-130-fullshot-SFT](https://huggingface.co/RLinf/RLinf-Pi0-LIBERO-130-fullshot-SFT)|
|**ResNet10系列**||||||
|RLinf-ResNet10-pretrained|-|ResNet10系列|ResNet10预训练模型|2025-12-23|[https://huggingface.co/RLinf/RLinf-ResNet10-pretrained](https://huggingface.co/RLinf/RLinf-ResNet10-pretrained)|
|**Math系列**||||||
|RLinf-math-1.5B|2B|Math系列|数学推理模型 - 1.5B参数版本|2025-09-01|[https://huggingface.co/RLinf/RLinf-math-1.5B](https://huggingface.co/RLinf/RLinf-math-1.5B)|
|RLinf-math-7B|8B|Math系列|数学推理模型 - 7B参数版本|2025-10-10|[https://huggingface.co/RLinf/RLinf-math-7B](https://huggingface.co/RLinf/RLinf-math-7B)|
|**WideSeek-R1系列**||||||
|WideSeek-R1-4b|4B|WideSeek-R1系列|宽Scaling多Agent信息检索模型，通过MARL训练实现lead-agent和subagent协同|2026-02-05|[https://huggingface.co/RLinf/WideSeek-R1-4b](https://huggingface.co/RLinf/WideSeek-R1-4b)|


---