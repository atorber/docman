NVIDIA Isaac Sim 是构建于 NVIDIA Omniverse 框架之上的高性能机器人仿真环境，它利用 GPU 加速的物理引擎实现物理级精确的仿真，并具备大规模、多传感器 RTX 渲染能力

。该平台集成了从合成数据生成、强化学习训练、ROS 系统对接到数字孪生应用在内的完整端到端开发工作流。本文将具体演示如何在百舸 AI 计算平台上，运用 Isaac Lab 组件提供的数据合成与扩增功能，以及其模仿学习算法，并结合 Cosmos 模型的视觉增强技术，来生成大规模、高质量的机器人演示数据集，进而训练出能够有效应对视觉场景变化的模仿学习策略

。所述工作流基于 Isaac Lab 2.2、Isaac Sim 5.0.0 和 Cosmos-Transfer1 环境构建并完成测试验证。

## 使用说明
整个流程包含以下四个主要阶段：

1. **生成演示数据**：使用 Isaac Lab Mimic 生成初始的机器人操作演示。您可以直接在开发机运行仿真任务，或通过分布式训练进行采集。我们提供了一份示例数据集，您也可参照官方指南采集自己的数据。
2. **视觉数据增强**：通过部署并调用 Cosmos 在线服务，对演示中的视觉观测进行增强，以提升数据的多样性和质量。
3. **训练策略模型**：利用 Isaac Lab 支持的 robomimic 框架，训练一个 BC-RNN 策略模型。此步骤支持在开发机上进行本地训练，也可提交分布式训练任务进行离线训练。
4. **评估模型鲁棒性**：对训练完成的策略模型进行系统性评估，测试其在不同条件下的鲁棒性与性能。

## 一、环境配置
||部署要求|最佳实践|
|-|-|-|
|CPU|8核|建议按表单默认值及以上|
|内存|64G|建议按表单默认值及以上|
|GPU|Isaac Lab 2.1.0：A10 / A100 / A800 / H20 / H800 / L20 / 支持RT Core的GPU卡 ×1Isaac Lab 2.2.0：L20 / 支持RT Core的GPU卡 ×1|视觉仿真渲染场景显卡必须含有RTCore；基于物理仿真的强化学习场景可以使用A10/A100/V100等其他不含RTCore的显卡|
|CDS|按需|建议存储资源>500G, 渲染时会涉及到大量3D资产及中间文件存储|
|其它|无|无|

**注意**：部署该实例的集群需要具备访问公网的能力，配置方式见：[https://cloud.baidu.com/doc/CCE/s/plmk196bx](https://cloud.baidu.com/doc/CCE/s/plmk196bx)

> Isaac Lab 2.2.0 依赖于 Isaac Sim 5.0，该仿真环境在渲染时使用了 DLSS（超采样技术，Deep Learning Super Sampling），因此推荐使用支持 RT Core 的 GPU 卡。
### 服务网卡配置
由于该工具的较多场景需要访问外网，可以通过设置服务网卡，并设置 HTTP & HTTPS 网络代理支持。[服务网卡配置参考](https://cloud.baidu.com/doc/VPC/s/Plztid5es#2-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%8D%A1)

## 二、数据准备
### 2.1 原始数据下载
使用 BOS 下载 Nvdia 开源原始数据集

```
bcecmd bos cp bos:/aihc-rdw-bj/cosmos_data/dataset.hdf5 /mnt/data/isaac_tmp/dataset/dataset.hdf5
```
### 2.2 数据标注
使用 isaaclab 脚本进行自动标注，同时您可以通过调整scripts/imitation_learning/isaaclab_mimic/annotate_demos.py中的`num_envs`参数，以增加或减少并行环境数量，充分利用显存。

```
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/imitation_learning/isaaclab_mimic/annotate_demos.py \
--enable_cameras --task Isaac-Stack-Cube-Franka-IK-Rel-Visuomotor-Mimic-v0 --auto \
--input_file /mnt/data/isaac_tmp/dataset/dataset.hdf5 --output_file /mnt/data/isaac_tmp/dataset/annotated_dataset.hdf5 --headless
```
运行结束后文件夹中出现annotated_dataset.hdf5 文件

### 2.3 数据增广
使用以下脚本进行数据增广，可以通过调整`num_envs`参数，以增加或减少并行环境数量（建议的数量为10，可以在一般笔记本电脑CPU上运行。在性能更强的台式机上，可以使用更多环境以显著加快此步骤），充分利用显存，同时通过调整`generation_num_trials`来调整增广数目（此处耗时巨大，若要体验可以将数字调整为 10 来进行体验）

```
# 完整生成代码
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/imitation_learning/isaaclab_mimic/generate_dataset.py \
--enable_cameras --headless --num_envs 8 --generation_num_trials 1000 \
--input_file /mnt/data/isaac_tmp/dataset/annotated_dataset.hdf5 --output_file mnt/data/isaac_tmp/dataset/mimic_dataset_1k.hdf5 \
--task Isaac-Stack-Cube-Franka-IK-Rel-Visuomotor-Cosmos-Mimic-v0

# 体验代码
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/imitation_learning/isaaclab_mimic/generate_dataset.py \
--enable_cameras --headless --num_envs 8 --generation_num_trials 10 \
--input_file /mnt/data/isaac_tmp/dataset/annotated_dataset.hdf5 --output_file mnt/data/isaac_tmp/dataset/mimic_dataset_10.hdf5 \
--task Isaac-Stack-Cube-Franka-IK-Rel-Visuomotor-Cosmos-Mimic-v0
```
同时可以通过下载 bos 预置数据直接进行体验：

```
bcecmd bos cp bos:/aihc-rdw-bj/cosmos_data/mimic_dataset_1k.hdf5 /mnt/data/isaac_tmp/dataset/mimic_dataset_1k.hdf5
```
## 三、使用 Cosmos 进行数据增强
![Cosmos input](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=83e0a5e1126f4d35878a32c26bbddb31&docGuid=-wUueYClx5Nltq "Cosmos input")
![Cocmos output](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=e15b8bde13fd4bfc8801783e2d7b294d&docGuid=-wUueYClx5Nltq "Cocmos output")
### 3.1 格式转换 hdf5->mp4
通过以下代码将hdf5 格式文件转换为 mp4 格式：

```
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/tools/hdf5_to_mp4.py \
    --input_file /mnt/data/isaac_tmp/dataset/mimic_dataset_1k.hdf5 \
    --output_dir /mnt/data/isaac_tmp/dataset/mimic_dataset_1k_mp4 \
    --input_keys table_cam table_cam_depth table_cam_shaded_segmentation
```
### 3.2 Cosmos增强提示词生成
使用以下脚本生成提示词

```
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/tools/cosmos/cosmos_prompt_gen.py \
    --templates_path /workspace/isaaclab/scripts/tools/cosmos/transfer1_templates.json \
    --num_prompts 10 \
    --output_path /mnt/data/isaac_tmp/dataset/cosmos_prompts.txt
```
您也可以自己编写一些提示词，以下是 Nvidia 官方给出的提示词编写法则：

1. 尽量详细地保留prompts。最好对生成过程中每个可见对象/感兴趣区域都有一些指导。例如，我们提供的prompts涵盖了桌子、灯光、背景、机械臂、立方体和整体布景的细节。
2. 尽量使增强指令尽可能地真实和连贯。模型在保留输入控制视频的关键特征方面做得越不真实或不传统，它的表现就越糟糕。
3. 保持每个方面的增强指令同步。我们的意思是，所有对象/感兴趣区域的增强应该在彼此之间是连贯和传统的。例如，最好是有一个prompts，例如 "The table is of old dark wood with faded polish and food stains and the background consists of a suburban home" ，而不是像 "The table is of old dark wood with faded polish and food stains and the background consists of a spaceship hurtling through space" 。
4. 在输入控制视频的关键方面，必须包括应保留或保持不变的细节。在我们的prompts中，我们非常明确地提到立方体的颜色应保持不变，使得底部立方体是蓝色，中间是红色，顶部是绿色。请注意，我们不仅提到了应该保持不变的内容，还详细说明了该方面当前的形式。

### 3.3 Cosmos 视觉增强
#### 3.3.1 **在本地部署cosmos-transfer1服务进行数据处理**
* 克隆 cosmos-transfer1 源代码（如果网络状况不良可以使用镜像站）

```
cd /root
git clone git@github.com:nvidia-cosmos/cosmos-transfer1.git
cd cosmos-transfer1
git submodule update --init --recursive
```
* 以下命令将创建 cosmos-transfer1 的 conda 环境（Cosmos 要求 Python 版本为 3.12.x），并安装用于推理的依赖项：

```
# 创建 cosmos-transfer1 conda 环境
conda env create --file cosmos-transfer1.yaml

# 激活 cosmos-transfer1 conda 环境
conda activate cosmos-transfer1

# 安装依赖
pip install -r requirements.txt

# 安装 vllm
pip install https://download.pytorch.org/whl/cu128/flashinfer/flashinfer_python-0.2.5%2Bcu128torch2.7-cp38-abi3-linux_x86_64.whl
export VLLM_ATTENTION_BACKEND=FLASHINFER
pip install vllm==0.9.0

# 安装 decord
pip install decord==0.6.0

# 修复 conda 环境中 Transformer Engine 的链接问题
ln -sf $CONDA_PREFIX/lib/python3.12/site-packages/nvidia/*/include/* $CONDA_PREFIX/include/
ln -sf $CONDA_PREFIX/lib/python3.12/site-packages/nvidia/*/include/* $CONDA_PREFIX/include/python3.12

# 安装 Transformer Engine
pip install transformer-engine[pytorch]
```
* 运行以下命令来测试环境配置是否正确：

```
python scripts/test_environment.py
```
* 下载模型权重文件（注意，该文件约300G，下载需要较长时间与充足磁盘空间）
* 生成一个 Hugging Face 访问令牌，并将访问权限设置为 **“Read”**（默认是 **“Fine-grained”**）。
* 设置 Hugging Face 镜像

```
export HF_ENDPOINT=https://hf-mirror.com
```
* 使用访问令牌登录 Hugging Face

```
huggingface-cli login
```
* 进入以下每个 Hugging Face 模型的使用条款页面，滚动到最底部并选择同意

```
    •    https://huggingface.co/nvidia/Cosmos-Transfer1-7B
    •    https://huggingface.co/nvidia/Cosmos-Tokenize1-CV8x8x8-720p
    •    https://huggingface.co/nvidia/Cosmos-Guardrail1
    •    https://huggingface.co/meta-llama/Llama-Guard-3-8B
```
* 从 Hugging Face 下载 Cosmos 模型权重

```
python scripts/download_checkpoints.py --output_dir checkpoints/
```
下载后的文件结构应如下所示：

```
checkpoints/
├── nvidia
│   │
│   ├── Cosmos-Guardrail1
│   │   ├── README.md
│   │   ├── blocklist/...
│   │   ├── face_blur_filter/...
│   │   └── video_content_safety_filter/...
│   │
│   ├── Cosmos-Transfer1-7B
│   │   ├── base_model.pt
│   │   ├── vis_control.pt
│   │   ├── edge_control.pt
│   │   ├── seg_control.pt
│   │   ├── depth_control.pt
│   │   ├── 4kupscaler_control.pt
│   │   └── config.json
│   │
│   ├── Cosmos-Transfer1-7B-Sample-AV/
│   │   ├── base_model.pt
│   │   ├── hdmap_control.pt
│   │   └── lidar_control.pt
│   │
│   │── Cosmos-Tokenize1-CV8x8x8-720p
│   │   ├── decoder.jit
│   │   ├── encoder.jit
│   │   ├── autoencoder.jit
│   │   └── mean_std.pt
│   │
│   └── Cosmos-UpsamplePrompt1-12B-Transfer
│       ├── depth
│       │   ├── consolidated.safetensors
│       │   ├── params.json
│       │   └── tekken.json
│       ├── README.md
│       ├── segmentation
│       │   ├── consolidated.safetensors
│       │   ├── params.json
│       │   └── tekken.json
│       ├── seg_upsampler_example.png
│       └── viscontrol
│           ├── consolidated.safetensors
│           ├── params.json
│           └── tekken.json
│
├── depth-anything/...
├── facebook/...
├── google-t5/...
├── IDEA-Research/...
└── meta-llama/...
```
#### 3.3.2 在开发机调用在线模型服务
下载调用脚本：

```
bcecmd bos cp bos:/aihc-rdw-bj/cosmos_data/run_cosmos_local.py /mnt/data/isaac_tmp/dataset/run_cosmos_local.py
```
运行脚本：

```
python /mnt/data/isaac_tmp/dataset/run_cosmos_local.py --mp4_output_dir /mnt/data/isaac_tmp/dataset/mimic_dataset_1k_mp4 \
    --cosmos_output_dir /mnt/data/isaac_tmp/dataset/cosmos_dataset_1k_mp4 \
    --prompts_file /mnt/data/isaac_tmp/dataset/cosmos_prompts.txt  \
    --checkpoint_dir /root/cosmos-transfer1/checkpoints
```
### 3.4 格式转换 hdf5<-mp4
通过以下代码将hdf5 格式文件转换为 mp4 格式：

```
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/tools/mp4_to_hdf5.py \
    --input_file /mnt/data/isaac_tmp/dataset/mimic_dataset_1k.hdf5 \
    --videos_dir /mnt/data/isaac_tmp/dataset/cosmos_dataset_1k_mp4 \
    --output_file /mnt/data/isaac_tmp/dataset/cosmos_dataset_1k.hdf5
```
### 3.5 直接下载增强后数据（可选）
用户可通过以下命令下载数据跳过该阶段

```
bcecmd bos cp bos:/aihc-rdw-bj/cosmos_data/cosmos_dataset_1k.hdf5 /mnt/data/isaac_tmp/dataset/cosmos_dataset_1k.hdf5
```
### 3.6 数据集合并
将增强前后数据通过以下代码进行合并

```
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/tools/merge_hdf5_datasets.py --input_files /mnt/data/isaac_tmp/dataset/mimic_dataset_1k.hdf5 /mnt/data/isaac_tmp/dataset/cosmos_dataset_1k.hdf5 --output_file /mnt/data/isaac_tmp/dataset/mimic_cosmos_dataset.hdf5
```



## 四、模型训练
通过以下指令进行训练（dataset 可根据您实际预处理结果使用您所有可用的 hdf5 训练集）（模型默认保存路径为当前文件夹下 log 文件夹）：

```
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/imitation_learning/robomimic/train.py \
    --task Isaac-Stack-Cube-Franka-IK-Rel-Visuomotor-Cosmos-v0 --algo bc \
    --dataset /mnt/data/isaac_tmp/dataset/mimic_cosmos_dataset.hdf5 \
    --name bc_rnn_image_franka_stack_mimic_cosmos2
```
## 五、模型评估
您可以使用如下指令进行模型评估，其中 input_dir为模型目录，log_dir为输出目录

```
/workspace/isaaclab/isaaclab.sh -p /workspace/isaaclab/scripts/imitation_learning/robomimic/robust_eval.py \
    --task Isaac-Stack-Cube-Franka-IK-Rel-Visuomotor-Cosmos-v0 \
    --input_dir /root/workspace/logs/robomimic/Isaac-Stack-Cube-Franka-IK-Rel-Visuomotor-Cosmos-v0/bc_rnn_image_franka_stack_mimic_cosmos2/20260107022104/models/ \
    --log_dir /log/ \
    --log_file result \
    --enable_cameras \
    --livestream 1 \
    --seeds 0 \
    --num_rollouts 15 \
    --headless
```