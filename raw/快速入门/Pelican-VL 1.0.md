## 模型介绍
Pelican-VL 1.0，这是一个新的开源具身大脑模型系列，参数规模从 7B 到 72B 不等。Pelican-VL 1.0 目前是最大规模的开源具身多模态脑模型。其核心优势在于深入整合数据能力和智能自适应学习机制。

**概览**

![teaser.jpg](https://bce.bdstatic.com/doc/bce-doc/AIHC/teaser_8c81a8d.jpg)


**亮点**

- **多模态理解与推理** ：Pelican-VL 处理视觉和文本输入，训练于大量图像、视频和跨模态注释数据集。它不仅能准确识别物体，还能基于场景上下文进行物理推理、空间关系理解和功能预测。例如，在厨房或超市等封闭环境中，它可以区分水果和蔬菜的位置、柜台位置，并据此规划拣选或摆放动作。

- **时空认知** ：模型训练包括数万小时的视频和动态场景问答，使其能够理解连续的时间序列。在处理视频帧时，Pelican-VL 捕捉物体运动和动作的时间顺序，使其能够对复杂的顺序任务做出连贯推断——例如，确定“应先移动哪个物品，然后再作下一个”。

- **具身交互能力** ：在机器人任务中，如物体抓取、导航和协作作，Pelican-VL 不仅理解高层次任务目标，还能生成详细的动作序列及可行性评估。这意味着在接收指令后，模型可以确定合适的抓取点并设计相应的作策略。其多任务熟练度涵盖抓取、导航和人机交互，展现出强大的跨任务泛化能力。

- **自我纠正与迭代学习** ：通过 DPPO 循环训练，Pelican-VL 展现出“自我纠正”能力。每次强化学习周期结束后，模型会自动生成新的挑战性样本进行再训练——类似于重复练习和反思。随着时间推移，它的弱点逐渐被解决，能力也不断提升。这一过程呼应了“刻意实践”的概念，使 Pelican-VL 能够迭代进步，实现与顶级专有系统同等的性能。

## 性能
### 整体任务

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_64ba2e7.png)
Pelican-VL1.0 的性能比较。（左）与参数 ≤100B 的模型对比。阴影（粉色）区域突出了相对于基线的性能提升。（右）与参数 ≥100B 的模型对比，包括领先的开源和专有模型，我们的模型也展示了 SOTA 性能。

### 细节维度
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_916eede.png)
Pelican-VL 1.0 (72B)与其他模型在九个维度上的基准性能雷达对比。

### 下游应用
请参阅我们的项目网站： <a href="https://pelican-vl.github.io">pelican-vl.github.io</a>


### Open-Source Weights
我们将在  [Hugging Face](https://huggingface.co) 和 [ModelScope](https://modelscope.cn)上发布我们的 pelican 模型：

| 模型名称 | 参数 |  检查点| 检查点 | 
|------------|-------------|------|------|
| Pelican1.0-VL-7B | 7B    | [ 链接](https://huggingface.co/X-Humanoid/Pelican1.0-VL-7B) |[ 链接](https://modelscope.cn/models/X-Humanoid/Pelican1.0-VL-7B)|
| Pelican1.0-VL-72B | 72B  | [ 链接](https://huggingface.co/X-Humanoid/Pelican1.0-VL-72B) |[ 链接](https://modelscope.cn/models/X-Humanoid/Pelican1.0-VL-72B)|


## 快速开始
这里，我们提供了一个简单的 LoRa 微调脚本，并给出了几个具体的示例，让你体验如何使用具身数据进行实验。训练基于 LLM 训练和部署框架 <a href="https://swift.readthedocs.io/zh-cn/latest/index.html">**`Swift`**</a>

### 安装
```
# pip installation
# pip install ms-swift -U

# Source code installation
git clone https://github.com/modelscope/ms-swift.git
cd ms-swift
pip install -e .

pip install qwen-vl-utils[decord]==0.0.11 # qwen-vl-utils 0.0.11, decord 0.6.0
pip install deepspeed==0.16.9 # distributed training
pip install wandb # wandb=0.21.0
pip install msgspec
pip install transformers==4.51.1 
pip install flash-attn==2.6.1 --no-build-isolation # if GPU supports
```

### LoRa微调
**数据集来源**
此演示中使用的全部具身数据均为 JSON 文件，均来源于 Hugging Face 上的公开数据集：

| 数据集名称 | 类型 | 链接 | 
|-|-|-|
| Cosmos Reasoning SFT Data | 视频    |  [链接](https://huggingface.co/datasets/nvidia/Cosmos-Reason1-SFT-Dataset/tree/main/robovqa )  |
| Robopoint GQA Data | 图像  |  [链接](https://huggingface.co/datasets/wentao-yuan/robopoint-data/tree/main )  |
| VSI-Bench ScanNetpp Data | 视频  |  [链接](https://huggingface.co/datasets/nyu-visionx/VSI-Bench/tree/main ) |


从上述链接下载这三个数据集，将下载的文件放置在与 JSON 中路径匹配的本地目录（例如 /datasets/xxx）中（或者修改 JSON 路径以适应你的本地存储路径）。

```
# Using an interactive command line for training.
CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 \
NPROC_PER_NODE=8 \
swift sft \
    --model Qwen2.5-VL-7B-Instruct \
    --dataset /datasets/robopoint_example_500.json \
              /datasets/vsibench_example_500.json \
              /datasets/cosmos_example_500.json \
    --train_type lora \
    --torch_dtype bfloat16 \
    --num_train_epochs 2 \
    --per_device_train_batch_size 1 \
    --per_device_eval_batch_size 1 \
    --learning_rate 5e-5 \
    --lora_rank 8 \
    --lora_alpha 32 \
    --lora_dropout 0.1 \
    --freeze_vit true \
    --target_modules all-linear \
    --gradient_accumulation_steps 16 \
    --split_dataset_ratio 0.1 \
    --data_seed 42 \
    --eval_steps 200 \
    --save_strategy epoch \
    --logging_steps 1 \
    --max_length 8192 \
    --output_dir /xxx/output \
    --warmup_ratio 0.05 \
    --dataloader_num_workers 16 \
    --save_only_model True \
    --attn_impl flash_attn

```

训练完成后，使用以下命令通过训练好的权重进行推理：

- 这里 `--adapters` 应替换为训练过程中生成的最后一个检查点文件夹。由于 adapters 文件夹包含了训练参数文件 `args.json`，因此无需单独指定 `--model`、`--system`；Swift 将自动读取这些参数。

```
# Using an interactive command line for inference.
CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 \
swift infer \
    --adapters /xxx/output/checkpoint-xxx \
    --stream true \
    --infer_backend pt \
    --max_new_tokens 2048
```

更多详细参数，请参考 <a href="https://swift.readthedocs.io/zh-cn/latest/index.html">`Swift`</a>  的官方文档。

## 评估复现

为了便于复现我们报告的结果，我们在下面总结了官方评估设置。
请参考 **[Evaluation.md](evaluation/README.md)**




