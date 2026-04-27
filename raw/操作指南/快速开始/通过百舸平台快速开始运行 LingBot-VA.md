> [https://technology.robbyant.com/lingbot-va](https://technology.robbyant.com/lingbot-va)
> lingbo-va——通用机器人控制的因果视频动作世界模型


## 模型概述


LingBot-VA 是一个自回归框架，它将视频世界建模与策略学习统一起来，联合学习未来帧预测和动作执行。该模型在长程操作、数据高效的后训练以及对新配置的鲁棒泛化方面展现出显著潜力。

它是一个多功能的全能型模型，在各种场景下都表现出色——从长程任务到高精度控制，再到可变形物体和关节物体的操作。

### 任务示例
|类别|任务|
|-|-|
|**长程任务**|制作早餐、拆快递|
|**高精度任务**|插入试管、拾取螺丝|
|**可变形物体**|叠衣服、开抽屉|

#### 长程任务
![1-nY2ZTr4w7WUAAAAAgGAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/1-nY2ZTr4w7WUAAAAAgGAAAAgADkxfAQFr_e91de6e.gif)
#### 高精度任务
![2-Jz1bT5L8_esAAAAAgHAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/2-Jz1bT5L8_esAAAAAgHAAAAgADkxfAQFr_e2db3e6.gif)
#### 可变形物体任务
![3-6Ae8SYfvkeEAAAAAgFAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/3-6Ae8SYfvkeEAAAAAgFAAAAgADkxfAQFr_6648abe.gif)


---

## 性能结果
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=727be0fcb55c4956b3de77904db7c1c7&docGuid=fIBWTUiaRI00XV)
---

## 仿真基准测试
LingBot-VA 在两个仿真基准测试上进行了评估：RoboTwin 2.0 和 LIBERO。这些测试涵盖多种机器人构型的各种操作任务。结果表明，该模型相较于现有最先进的方法具有一致的改进。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=94c906b78af844649a179b46888beda8&docGuid=fIBWTUiaRI00XV)
### RoboTwin 2.0
#### 简单设置
|视野|1|2|3|平均|
|-|-|-|-|-|
|LingBot-VA|50|65|80|100|
|π₀|50|65|80|100|
|π₀.₅|50|65|80|100|

#### 困难设置
|视野|1|2|3|平均|
|-|-|-|-|-|
|LingBot-VA|50|65|80|100|
|π₀|50|65|80|100|
|π₀.₅|50|65|80|100|





### 技术原理
LingBot-VA 是一个自回归扩散框架，在架构上将视觉动力学预测和动作推断统一在单个交错序列中。这使得机器人能够同时推理未来状态并执行精确的闭环控制。

### 大规模预训练
LingBot-VA 在大规模机器人视频动作数据集上进行预训练，学习丰富的视觉动力学，为理解物理世界的演变和在其中运行建立了坚实基础。

![4-JcO0TKYj3S0AAAAAgDAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/4-JcO0TKYj3S0AAAAAgDAAAAgADkxfAQFr_d2fd26a.gif)
### 框架架构
该框架分为三个阶段运行：

1. **自回归视频生成**：根据当前观察和语言指令预测未来帧
2. **逆动力学模型 (IDM)**：从预测的视频中解码出动作
3. **闭环控制**：执行后，用真实观察替换视频 KV-cache，将视频动作模型锚定在实际结果中
![5-qZXlSaC6ULsAAAAAgBAAAAgAfoeUAQBr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/5-qZXlSaC6ULsAAAAAgBAAAAgAfoeUAQBr_eb32730.gif)

### 逆动力学模型
逆动力学模型 (IDM) 能够准确地从预测视频中解码动作，并在不同的环境和机器人构型中表现出良好的泛化能力。

### 预测与现实对比
预测的视频与机器人实际执行过程中观察到的视频高度一致。执行解码后的动作产生的真实观察与预测帧相符。

# 在百舸平台上快速开始
## 环境要求
* Python 3.10.16
* PyTorch 2.9.0
* CUDA 12.6
* GPU（推理：单卡 RTX 4090 即可；训练：需要 8 卡 A800）



镜像：ccr-2hpgw1bh-pub.cnc.bj.baidubce.com/aihc-private/lingbot-va:v0.1-661d52a



## 数据准备
拷贝模型

```python
!set -e && \
wget -q https://doc.bce.baidu.com/bos-optimization/linux-bcecmd-0.5.10.zip && \
unzip -q linux-bcecmd-0.5.10.zip && \
chmod +x linux-bcecmd-0.5.10/bcecmd && \
mv linux-bcecmd-0.5.10/bcecmd /usr/local/bin/bcecmd && \
rm -rf linux-bcecmd-0.5.10 linux-bcecmd-0.5.10.zip

!bcecmd -v
```
```python
bcecmd bos cp -r bos:/aibox-private/LingBot/LingBot-VA/lingbot-va-model ~/workspace/lingbot-va-model

cd ~/workspace/lingbot-va
```
工作目录结构如下：

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=25d438e94f76477ca0c5fbfb25024fd6&docGuid=fIBWTUiaRI00XV)


**启动Python虚拟环境**

```bash
source /root/workspace/lingbot-va/.venv/bin/activate
```


## 环境配置（已在开发机器上配置好）
|模式|`attn_mode` 值|说明|
|-|-|-|
|**训练**|`"flex"`|训练必需|
|**推理/评估**|`"torch"` 或 `"flashattn"`|推理必需，`flex` 模式会报错|

修改方法：编辑模型目录下的 `transformer/config.json`，找到 `"attn_mode"` 字段修改。

### 安装依赖（参考）
```bash
# 安装 uv
pip install uv

# 创建虚拟环境
uv venv /root/workspace/lingbot-va/.venv
source /root/workspace/lingbot-va/.venv/bin/activate

# 安装 PyTorch 2.9.0
uv pip install torch==2.9.0 torchvision==0.24.0 torchaudio==2.9.0 --index-url https://download.pytorch.org/whl/cu126

# 安装依赖
uv pip install diffusers==0.36.0 transformers==4.55.2 accelerate einops easydict tqdm \
  'imageio[ffmpeg]' websockets msgpack opencv-python matplotlib ftfy safetensors Pillow


# 安装 flash-attn（编译时间较长）
uv pip install wheel
uv pip install flash-attn --no-build-isolation
```


## 模型下载
### 已下载模型
|模型|本地路径|说明|
|-|-|-|
|LingBot-VA-Base|`/root/workspace/lingbot-va-model/`|基础模型（约 23GB）|

### 手动下载命令（参考）
```bash
# 配置网络代理
export HF_ENDPOINT=https://hf-mirror.com
export http_proxy=http://10.0.7.40:18000
export https_proxy=http://10.0.7.40:18000

# 下载模型
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
apt-get install git-lfs
git lfs install
git clone https://huggingface.co/robbyant/lingbot-va-base /root/workspace/lingbot-va-model

# 下载数据集

```


## 推理测试
### 1. 修改模型配置
模型需要设置为推理模式：

```bash
# 编辑 transformer config
vim /root/workspace/lingbot-va-model/transformer/config.json

# 将 "attn_mode": "flex" 改为 "attn_mode": "torch"
```
### 2. 修改配置文件
更新配置文件中的模型路径：

```bash
# 编辑配置
vim /root/workspace/lingbot-va/wan_va/configs/va_demo_cfg.py

# 修改模型路径
wan22_pretrained_model_name_or_path = "/root/workspace/lingbot-va-model"
```
### 3. 运行推理
```bash
cd /root/workspace/lingbot-va
source .venv/bin/activate

# 单 GPU 推理
python -m torch.distributed.run \
    --nproc_per_node=1 \
    --master_addr=127.0.0.1 \
    --master_port=29501 \
    -m wan_va.wan_va_server \
    --config-name demo_i2av
```
### 推理输出示例
```
Loading checkpoint shards: 100%|██████████| 3/3 [00:00<00:00, 109.97it/s]
USE I2AV mode
FRAME START ID: 0
 17%|█▌        | 1/6 [00:00<00:03,  1.37it/s]
...
100%|██████████| 6/6 [00:01<00:00,  4.28it/s]
```


## 训练测试
### 配置wandb（可选）
如需使用 wandb 记录训练过程：

```bash
export WANDB_API_KEY="your-key"
export WANDB_BASE_URL="https://api.wandb.ai"
export WANDB_TEAM_NAME="your-team"
export WANDB_PROJECT="your-project"
```
### 运行训练
```bash
cd /root/workspace/lingbot-va
source .venv/bin/activate

# 8 GPU 训练
python -m torch.distributed.run --nproc_per_node=8 --master_addr=127.0.0.1 --master_port=29501 -m wan_va.train --config-name robotwin_train
```
### 训练配置参数
|参数|说明|示例值|
|-|-|-|
|`--config-name`|配置名称|`robotwin_train`, `demo_train`|
|`NGPU`|GPU 数量|`8`|
|`dataset_path`|训练数据路径|`/path/to/dataset`|
|`batch_size`|Batch size|`1`|
|`num_steps`|训练步数|`2000`|

## 目录结构
```
/root/workspace/lingbot-va/
├── .venv/                    # 虚拟环境
├── lingbot-va-model/         # 模型文件（约 23GB）
│   ├── transformer/          # Transformer 模型
│   ├── vae/                 # VAE 模型
│   ├── text_encoder/        # 文本编码器
│   └── tokenizer/            # Tokenizer
├── wan_va/                   # 源代码
│   ├── configs/              # 配置文件
│   ├── modules/              # 模型模块
│   ├── distributed/           # 分布式训练
│   ├── dataset/              # 数据集处理
│   └── train.py              # 训练入口
├── script/                   # 训练脚本
│   ├── run_va_posttrain.sh
│   └── run_launch_va_server_sync.sh
└── example/                  # 示例数据
```




## 常见问题
### 1. FSDP dtype 不一致错误
```
AssertionError: FSDP expects uniform original parameter dtype but got {torch.float32, torch.bfloat16}
```
**解决**：确保使用 PyTorch 2.9.0 和 CUDA 12.6

### 2. 推理提示 attn_mode 错误
```
Unsupported attention mode: flex, only support torch and flashattn
```
**解决**：将模型 `transformer/config.json` 中的 `attn_mode` 改为 `"torch"`或`"flashattn"`

### 3. 单 GPU 训练 OOM
训练需要约 8 卡 A800 才能运行，单卡会 OOM。推理可以在单卡 RTX 4090 上运行。



## 参考资料
* [技术报告](https://github.com/Robbyant/lingbot-va/blob/master/LingBot_VA_paper.pdf)
* [代码仓库](https://github.com/Robbyant/lingbot-va)
* [Hugging Face](https://huggingface.co/collections/robbyant/lingbot-va)
* [ModelScope](https://www.modelscope.cn/collections/Robbyant/LingBot-va)