使用百舸平台进行Qwen-2.5-VL模型训练 v2.0

AIAK-Training-LLM是百度智能云基于百度百舸·AI计算平台，面向大模型训练场景提供的最佳实践解决方案配套AI加速工具，帮助模型开发者高效完成大规模深度学习分布式训练，提升训练效率，相比开源 Megatron-LLM性能明显提升。关于AIAK-Training-LLM的使用说明，详见[这里](https://cloud.baidu.com/doc/AIHC/s/Alyo476jr)



针对于Qwen2.5vl模型，百度百舸团队基于自研大模型训练加速框架 AIAK-Training-LLM，在 SFT / Pretrain 阶段实现了多模态数据混合训练，并结合离线 Sequence Packing 技术，显著提升训练效率与资源利用率。



这里我们以Qwen2.5-VL-7B-Instruct模型单机训练混训为示例，介绍如何使用AIAK-Training-LLM在A800上进行训练，同时包含如何进行数据集离线预处理（Packing）功能。

# 资源准备
## 算力资源
使用AIAK加速训练Qwen2.5-VL-3B/7B/32B/72B-Instruct，请使用A800*8卡/P800*8 卡的节点

## 存储资源
为保证训练的性能，推荐使用并行文件存储PFS，以达到分布式加速训练效果。

# 开发机环境准备
创建开发机用于下载模型、数据集，并进行模型权重转换、数据集预处理等工作。

## 开发机创建：
在百度百舸.AI计算平台[控制台](https://console.bce.baidu.com/aihc/resources)，点击【开发机】-【创建实例】开始创建开发机并填写开发机配置信息：

* 基本信息
    * 实例名称：输入您为开发机命名的名称，例如：VL-dev-test
    * 资源池类型/资源池/队列：根据您的资源池类型选择已创建的资源池和队列
    * 资源规格：预处理无需GPU资源，可以选择不使用加速芯片，同时最好保证内存资源不少于16GB以保证预处理脚本正常运行，此处推荐使用128核CPU与256GB以上内存保证预处理效率

* 环境配置
    * 镜像地址：可以从训练任务处通过模板创建获取最新镜像，当前镜像为：registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu24.04-cu12.9-torch2.8.0-py312_v2.2.6.4_release_fixed
    * 云磁盘：推荐预留100GiB保证开发机正常运行
    * 启动命令：用于填写开发机启动自动运行命令，此处暂时留空
    * 环境变量：一般用于配合启动命令使用，此处暂时留空
    * 存储挂载：用于挂载云存储资源（PFS/BOS/CFS等），此处选择存储类型为PFS的资源，默认带出存储配置区，填写源路径与挂载路径，例如：源路径：/vl，挂载路径：/mnt/pfs/（后续相关存储路径与此高度相关）

* 访问配置&高级配置
    * 可以使用默认配置，此处不做修改


完成后点击确定，即可完成开发机创建。

## BOS工具验证：
在开发机中，已经预置了BOS下载工具，输入以下命令以验证下载工具是否安装：

```
bcecmd
```
产生以下输出则为可用：

```
usage: bcecmd [--help] [-configure ['''] [--debug] [--conf-path CONF-PATH] [-multiupload-infos-path MULTIUPLOAD-INFOS-PATH] [-version]
```
反之，执行以下命令（请确保在开发机环境下运行）：

```
wget https://doc.bce.baidu.com/bos-optimization/linux-bcecmd-0.5.9.zip   #下载
unzip linux-bcecmd-0.5.9.zip   #解压
ln linux-bcecmd-0.5.9/bcecmd /usr/sbin/  #设置为全局使用
```
# 模型&数据集准备
## 模型准备：
### (1) 模型下载
本次VL 共支持四个模型，均已内置于BOS 中：

|模型名称|BOS 位置|
|-|-|
|Qwen2.5-VL-3B-Instruct|bos:/aihc-models-bj/Qwen/Qwen2.5-VL-3B-Instruct/|
|Qwen2.5-VL-7B-Instruct|bos:/aihc-models-bj/Qwen/Qwen2.5-VL-7B-Instruct/|
|Qwen2.5-VL-32B-Instruct|bos:/aihc-models-bj/Qwen/Qwen2.5-VL-32B-Instruct/|
|Qwen2.5-VL-72B-Instruct|bos:/aihc-models-bj/Qwen/Qwen2.5-VL-72B-Instruct/|

BOS参考下载指令（此处的第二个参数参考开发机创建-环境配置-存储挂载-挂载路径）：

```
bcecmd bos sync bos:/aihc-models-bj/Qwen/Qwen2.5-VL-3B-Instruct/ /mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-3B-Instruct/
```
模型 BOS 地址：

```
bcecmd bos sync bos:/aihc-models-bj/Qwen/Qwen2.5-VL-7B-Instruct/ /mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/
```
模型 BOS 地址：

```
bcecmd bos sync bos:/aihc-models-bj/Qwen/Qwen2.5-VL-32B-Instruct/ /mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-32B-Instruct/
```
模型 BOS 地址：

```
bcecmd bos sync bos:/aihc-models-bj/Qwen/Qwen2.5-VL-72B-Instruct/ /mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-72B-Instruct/
```
### (2) 模型CKPT预处理
进入开发机/workspace/AIAK-Training-LLM/examples/qwen2_5_vl/目录可以找到模型权重转换脚本，调整模型权重位置与数据集输入输出位置后即可运行（这里以 7B 模型为例）：

```

#! /bin/bash

AIAK_TRAINING_PATH=${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}
AIAK_MAGATRON_PATH=${AIAK_MAGATRON_PATH:-"/workspace/AIAK-Magatron"}
CONVERT_CHECKPOINT_PATH="$AIAK_TRAINING_PATH/tools/convert_checkpoint"

LOAD=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct
SAVE=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/qwen2_5-vl-7b-tp1-pp1

SAVE_LANGUAGE_MODEL=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/aiak-training-llm/tmp/language-mcore
SAVE_VISION_MODEL=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/aiak-training-llm/tmp/vision-model-mcore
SAVE_ADAPTER=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/aiak-training-llm/tmp/adapter-mcore
SAVE_PATCH=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/aiak-training-llm/tmp/patch-mcore

TP=1
PP=1

# qwen2
python $CONVERT_CHECKPOINT_PATH/model.py \
    --load_platform=huggingface \
    --save_platform=mcore \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/qwen2_5.json \
    --tensor_model_parallel_size=$TP \
    --pipeline_model_parallel_size=$PP \
    --load_ckpt_path=$LOAD \
    --save_ckpt_path=$SAVE_LANGUAGE_MODEL \
    --safetensors \
    --no_save_optim \
    --no_load_optim

# vit
python $CONVERT_CHECKPOINT_PATH/model.py \
    --load_platform=huggingface \
    --save_platform=mcore \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/vision-model.json \
    --tensor_model_parallel_size=$TP \
    --load_ckpt_path=$LOAD \
    --save_ckpt_path=$SAVE_VISION_MODEL \
    --safetensors \
    --no_save_optim \
    --no_load_optim

# adapter
python $CONVERT_CHECKPOINT_PATH/custom/qwen2_vl/adapter.py \
    --load_platform=huggingface \
    --save_platform=mcore \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/adapter.json \
    --tensor_model_parallel_size=$TP \
    --load_ckpt_path=$LOAD \
    --save_ckpt_path=$SAVE_ADAPTER

# vision patch in vit
python $CONVERT_CHECKPOINT_PATH/custom/qwen2_vl/vision_patch.py \
    --load_platform=huggingface \
    --save_platform=mcore \
    --tensor_model_parallel_size=$TP \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/vision-patch.json \
    --load_ckpt_path=$LOAD \
    --save_ckpt_path=$SAVE_PATCH

# merge
python $CONVERT_CHECKPOINT_PATH/custom/qwen2_vl/merge_megatron.py \
    --megatron_path $AIAK_MAGATRON_PATH \
    --language_model_path $SAVE_LANGUAGE_MODEL/release \
    --vision_model_path $SAVE_VISION_MODEL/release \
    --vision_patch $SAVE_PATCH/release \
    --adapter_path $SAVE_ADAPTER/release \
    --save_ckpt_path $SAVE/release \
    --tensor_model_parallel_size $TP \
    --pipeline_model_parallel_size $PP

echo release > $SAVE/latest_checkpointed_iteration.txt
rm -rf $SAVE_LANGUAGE_MODEL
rm -rf $SAVE_VISION_MODEL
rm -rf $SAVE_ADAPTER
rm -rf $SAVE_PATCH

```
运行结束后显示INFO:root:Finished convert checkpoint huggingface -> mcore即为转换成功

需注意：对于72B 模型中有一行--custom_pipeline_layers配置，需要注意将此配置项与训练时一致

```
--custom_pipeline_layers 20,20,20,20 
```
### (3) 模型CKPT结果
输出结果应在SAVE文件夹下应有一个release文件夹，一个latest_checkpointed_iteration.txt文本文档。

## 数据集准备：
### (1) 预置数据集下载
百舸平台已经在对象存储BOS中预置相关数据集（energon加载器格式），您可以从对应地域的BOS路径中下载数据：

简易版数据集 BOS 地址：bos:/aihc-rdw-bj/dataset/qwen2.5-vl-dataset/demo/

```
bcecmd bos sync bos:/aihc-rdw-bj/dataset/qwen2.5-vl-dataset/demo/ /mnt/pfs/qwen-2-5-vl-dataset
```
数据集格式如下：

```
pretrain-0.tar      pretrain-1.tar.idx  pretrain-3.tar      pretrain-4.tar.idx  pretrain-6.tar
pretrain-0.tar.idx  pretrain-2.tar      pretrain-3.tar.idx  pretrain-5.tar      pretrain-6.tar.idx
pretrain-1.tar      pretrain-2.tar.idx  pretrain-4.tar      pretrain-5.tar.idx
```
### (2) 数据集预处理（可选）
用户也可以使用图文对结构的如下格式数据集（包含问答对/图片），需要先将数据集转换为energon 加载器格式：

```
[
  {
    "messages": [
      {
        "content": "<image>Who are they?",
        "role": "user"
      },
      {
        "content": "They're Kane and Gretzka from Bayern Munich.",
        "role": "assistant"
      },
      {
        "content": "What are they doing?<image>",
        "role": "user"
      },
      {
        "content": "They are celebrating on the soccer field.",
        "role": "assistant"
      }
    ],
    "images": [
      "mllm_demo_data/1.jpg",
      "mllm_demo_data/2.jpg"
    ]
  },
  ...
 ]
```
您可以下载如下数据集进行实验验证：

```
bcecmd bos sync bos:/aihc-rdw-bj/huggingface.co/datasets/LLaVA-Pretrain/ /mnt/pfs/Qwen-2.5-VL-data/datasets/
```
使用/workspace/AIAK-Training-LLM/tools/data_preprocess/convert_to_webdataset.py进行格式转换：

```
python /workspace/AIAK-Training-LLM/tools/data_preprocess/convert_to_webdataset.py \
    --output_dir /mnt/pfs/Qwen-2.5-VL-data/datasets/output \
    --json_file /mnt/pfs/Qwen-2.5-VL-data/datasets/blip_laion_cc_sbu_558k.json \
    --image_dir /mnt/pfs/Qwen-2.5-VL-data/datasets/ \
    --media image \
    --columns_messages messages \
    --maxsize 10000000000
```
--output_dir目录下的输出文件后续可直接作为训练用数据集。

您也可以直接下载已经处理好的energon 加载器格式数据集：

```
bcecmd bos sync bos:/aihc-rdw-bj/huggingface.co/datasets/wds/ /mnt/pfs/Qwen-2.5-VL-data/datasets/output/
```
### (3) 数据Packing预处理（可选）
为提升混训效率，百度AIAK-Traing加速团队提供了离线数据集预处理方式，可以进一步提升后续训练效率。

1️⃣ 使用/workspace/AIAK-Training-LLM/examples/qwen2_5_vl/finetuning目录下的preprocess_data.sh脚本开始对数据集进行预处理：

```
#! /bin/bash
# The script needs to be run on at least 1 nodes.
#export WORLD_SIZE=2
#export RANK=0
#export MASTER_ADDR=192.168.81.53
#export MASTER_PORT=6000

MEGATRON_PATH=${MEGATRON_PATH:-"/workspace/AIAK-Megatron"}
AIAK_TRAINING_PATH=${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}

DATA_PATH=${DATA_PATH:-"mnt/pfs/qwen-2-5-vl-dataset/wds"}

TOKENIZER_PATH=${TOKENIZER_PATH:-"/mnt/cluster/Qwen2.5-VL-7B-Instruct/"}

CHECKPOINT_PATH=${CHECKPOINT_PATH:-"/mnt/cluster/aiak-training-llm/qwen2_5-vl/qwen2_5-vl-7b-tp1-pp1"}

TENSORBOARD_PATH=${TENSORBOARD_PATH:-"/mnt/cluster/aiak-training-llm/tensorboard-log/qwen2_5-vl-7b"}

GPUS_PER_NODE=8

# Change for multinode config
MASTER_ADDR=${MASTER_ADDR:-"localhost"}
MASTER_PORT=${MASTER_PORT:-"6000"}
NNODES=${WORLD_SIZE:-"1"}
NODE_RANK=${RANK:-"0"}

DISTRIBUTED_ARGS=(
    --nproc_per_node $GPUS_PER_NODE
    --nnodes $NNODES
    --node_rank $NODE_RANK
    --master_addr $MASTER_ADDR
    --master_port $MASTER_PORT
)

# or you can setup qwen2_5-vl-7b by using the following command
MODEL_ARGS=(
    --model-name qwen2_5-vl-7b
)

DATA_ARGS=(
    --tokenizer-type HFTokenizer \
    --hf-tokenizer-path $TOKENIZER_PATH \
    --data-path $DATA_PATH
    --dataloader-type external
    --split 100,0,0
    --num-workers 8
    --chat-template qwen2-vl
    --packing-batch-size 10
    --packing-sft-data
    --packing-pretrain-data
    --preprocess-data-on-cpu
)

TRAINING_ARGS=(
    --training-phase sft
    --trainable-modules language_model adapter
    --seq-length 4096
    --max-position-embeddings 8192
    --micro-batch-size 1
    --global-batch-size 32
    --train-iters 50000
    --initial-loss-scale 65536
    --bf16
    --save-interval 10000000
    --ckpt-format torch
)

MODEL_PARALLEL_ARGS=(
    --attention-backend flash
    --pipeline-model-parallel-size 1
    --tensor-model-parallel-size 1
    --use-distributed-optimizer
    --distributed-backend gloo
    #--sequence-parallel
)

PYTHONPATH=$MEGATRON_PATH:$AIAK_TRAINING_PATH:$PYTHONPATH \
    torchrun ${DISTRIBUTED_ARGS[@]} \
    $AIAK_TRAINING_PATH/tools/data_preprocess/preprocess_megatron_energon_dataset.py \
    ${MODEL_ARGS[@]} \
    ${DATA_ARGS[@]} \
    ${TRAINING_ARGS[@]} \
    ${MODEL_PARALLEL_ARGS[@]} \
    --output-path /mnt/pfs/qwen-2-5-vl-dataset/data
```
脚本中需要注意的点：

1.始能packing功能需要配置如下参数，packing-batch-size可以根据实际情况进行大小调整，48-50 行：

```
    --packing-batch-size 10
    --packing-sft-data
    --packing-pretrain-data
```
2.如预处理执行在cpu环境需要加上下面参数，51 行

```
--preprocess-data-on-cpu
```
3.预处理tp和pp统一配置成1、1，将预处理数据集的颗粒度最小化，70-71 行

```
    --pipeline-model-parallel-size 1
    --tensor-model-parallel-size 1
```
4.分布式后端使用gloo，73 行

```
--distributed-backend gloo
```
5.指定预处理输出路径，84 行

```
--output-path /mnt/pfs/qwen-2-5-vl-dataset/data
```
执行完成后可在输出路径找到对应数据集输出结果。

2️⃣ 再执行/workspace/AIAK-Training-LLM/tools/data_preprocess/preprocess_megatron_energon_dataset_stage2.py python文件，对预处理完的数据进行拼接。

注意：此处 world-size 需要能被下面 tp*pp 整除同时需保持与后续训练中配置一致，文件路径为预处理脚本中注入地址。

```
python preprocess_megatron_energon_dataset_stage2.py --data-path /mnt/pfs/qwen-2-5-vl-dataset/data --world-size 8 --tp 1 --pp 1 --clean-temp
```
# 训练
## 数据在线Packing场景：
在百度百舸.AI计算平台[控制台](https://console.bce.baidu.com/aihc/resources)，点击【分布式训练】-【创建任务】开始创建训练任务并填写训练任务配置信息：

* 基本信息
    * 任务名称：输入您为本次任务命名的名称，例如：vl-7b-SFT-test
    * 可见范围：队列哪可见/仅创建人可见
    * 创建方式：【基于开源模型训练模版创建】
        * 模型：【qwen2.5】-> 【qwen2.5-vl-7b】
        * 芯片类型：NVIDIA/昆仑芯，此处以 A800 为例
        * 训练模版：AIAK加速版
        * 训练模式：选择【SFT】 / 【Pretrain】，此处以 SFT 为例
        * 训练方法：全量更新


* 资源配置（先配置此项）
    * 资源池类型/资源池/队列：根据您的资源池类型选择A800资源所在的资源池和队列
    * 优先级：默认为高，无需修改
    * 训练框架：PyTorch，无需修改
    * 资源配额：请确保GPU不少于A800 * 4（推荐使用单机 8 卡配置运行以保证效率最大化），CPU与内存在可配置条件下越大越好，在更多资源条件下可以适当提高--global-batch-size等参数
    * 共享内存：100GiB
    * 数据集挂载：本示例中为空，具体用挂载用法与存储挂载类似
    * 存储挂载：此处与开发机创建配置保持一致：源路径：/vl，挂载路径：/mnt/pfs

* 环境信息
    * 镜像地址：由基本信息自动带出无需修改
    * 执行命令：需要自行配置数据集路径，Tokenizer路径，Checkpoint加载/保存路径，可通过环境变量注入或直接替换执行命令代码进行修改，例如(替换15-18行)：
    * MODEL_PARALLEL_ARGS配置：需要注意，此处 --pipeline-model-parallel-size，--tensor-model-parallel-size，--custom-pipeline-layers（仅限 72B 模型），需要保证与 CKPT 转换时同相同精度，参考 84-85 行。


```
#! /bin/bash
# The script needs to be run on at least 1 nodes.

MEGATRON_PATH=${MEGATRON_PATH:-"/workspace/AIAK-Megatron"}
AIAK_TRAINING_PATH=${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}

# ----------------------------------------------------------------------------------------
# 用户自定义配置:
#     DATA_PATH: 数据集路径
#     TOKENIZER_PATH: Tokenizer路径
#     CHECKPOINT_LOAD_PATH: Checkpoint加载路径
#     CHECKPOINT_SAVE_PATH: Checkpoint保存路径
#     TENSORBOARD_PATH: Tensorboard日志保存路径, 在创建任务时开启Tensorboard后百舸自动注入环境变量
# ----------------------------------------------------------------------------------------
DATA_PATH="/mnt/pfs/qwen-2-5-vl-dataset/wds"
TOKENIZER_PATH="/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct"
CHECKPOINT_LOAD_PATH="/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/qwen2_5-vl-7b-tp1-pp1"
CHECKPOINT_SAVE_PATH="/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/output/qwen2_5-vl-7b-tp1-pp1/1"
TENSORBOARD_PATH=$AIHC_TENSORBOARD_LOG_PATH

GPUS_PER_NODE=8

# Change for multinode config
MASTER_ADDR=${MASTER_ADDR:-"localhost"}
MASTER_PORT=${MASTER_PORT:-"6000"}
NNODES=${WORLD_SIZE:-"1"}
NODE_RANK=${RANK:-"0"}

DISTRIBUTED_ARGS=(
    --nproc_per_node $GPUS_PER_NODE
    --nnodes $NNODES
    --node_rank $NODE_RANK
    --master_addr $MASTER_ADDR
    --master_port $MASTER_PORT
)

# or you can setup qwen2_5-vl-7b by using the following command
MODEL_ARGS=(
    --model-name qwen2_5-vl-7b
)

DATA_ARGS=(
    --tokenizer-type HFTokenizer \
    --hf-tokenizer-path $TOKENIZER_PATH \
    --data-path $DATA_PATH
    --dataloader-type external
    --split 100,0,0
    --num-workers 16
    --chat-template qwen2-vl
)

TRAINING_ARGS=(
    --training-phase sft
    --trainable-modules language_model adapter
    --seq-length 1024
    --max-position-embeddings 4096
    --init-method-std 0.02
    --micro-batch-size 1
    --global-batch-size 128
    --lr 0.0002
    --min-lr 1.0e-5
    --clip-grad 1.0
    --weight-decay 0.01
    --optimizer adam
    --adam-beta1 0.9
    --adam-beta2 0.95
    --adam-eps 1e-05
    --norm-epsilon 1e-6
    --train-iters 5000
    --lr-decay-iters 5000
    --lr-decay-style cosine
    --lr-warmup-fraction 0.002
    --initial-loss-scale 65536
    --bf16
    --load $CHECKPOINT_LOAD_PATH
    --save $CHECKPOINT_SAVE_PATH
    --save-interval 10000000
    --ckpt-format torch
    --dataloader-save ${CHECKPOINT_SAVE_PATH}/dataloader
)

MODEL_PARALLEL_ARGS=(
    --attention-backend flash
    --pipeline-model-parallel-size 1
    --tensor-model-parallel-size 1
    --use-distributed-optimizer
    --overlap-grad-reduce
    --overlap-param-gather
    --distributed-backend nccl
)

LOGGING_ARGS=(
    --log-interval 1
    --tensorboard-dir ${TENSORBOARD_PATH}
    --log-timers-to-tensorboard
)

if [ -n "${WANDB_API_KEY}" ]; then
    LOGGING_ARGS+=(
        --wandb-project ${WANDB_PROJECT}
        --wandb-exp-name ${WANDB_NAME}
    )
fi

PYTHONPATH=$MEGATRON_PATH:$AIAK_TRAINING_PATH:$PYTHONPATH \
    torchrun ${DISTRIBUTED_ARGS[@]} \
    $AIAK_TRAINING_PATH/aiak_training_llm/train.py \
    ${MODEL_ARGS[@]} \
    ${DATA_ARGS[@]} \
    ${TRAINING_ARGS[@]} \
    ${MODEL_PARALLEL_ARGS[@]} \
    ${LOGGING_ARGS[@]}
```
* 监控信息
    * Tensorboard：打开，并选择PFS，后续此路径会自动注入执行命令中
    * 其余容错与诊断，监控信息可选择性打开。


点击确定，即可开始训练任务，此数据集的SFT任务在1*8卡环境下使用该参数大约为1000iter/小时。

## 数据离线Packing：
您也可以使用先前离线处理的数据集，来体验更高效的训练过程，在百度百舸.AI计算平台[控制台](https://console.bce.baidu.com/aihc/resources)，点击【分布式训练】-【创建任务】开始创建训练任务并填写训练任务配置信息（在资源处与在线版唯一区别就是把显卡从 1*8 变成了 2*4）：

* 基本信息
    * 任务名称：输入您为本次任务命名的名称，例如：vl-7b-SFT-test-offline
    * 可见范围：队列哪可见/仅创建人可见
    * 创建方式：【基于开源模型训练模版创建】
        * 模型：【qwen2.5】-> 【qwen2.5-vl-7b】
        * 芯片类型：NVIDIA A800
        * 训练模版：AIAK加速版
        * 训练模式：选择【SFT】，此处以 SFT 为例
        * 训练方法：全量更新


* 资源配置（先配置此项）
    * 资源池类型/资源池/队列：根据您的资源池类型选择A800资源所在的资源池和队列
    * 优先级：默认为高，无需修改
    * 训练框架：PyTorch，无需修改
    * 资源配额： 实例数*1，显卡为 A800*8
    * 共享内存：100GiB
    * 数据集挂载：本示例中为空，具体用挂载用法与存储挂载类似
    * 存储挂载：此处与开发机创建配置保持一致：源路径：/vl，挂载路径：/mnt/pfs

* 环境信息
    * 镜像地址：由基本信息自动带出无需修改
    * 执行命令：需要自行配置数据集路径，Tokenizer路径，Checkpoint加载/保存路径，可通过环境变量注入或直接替换执行命令代码进行修改，例如(替换15-18行)：
    * MODEL_PARALLEL_ARGS配置：需要注意，此处 --pipeline-model-parallel-size，--tensor-model-parallel-size，--custom-pipeline-layers（仅限 72B 模型），需要保证与 CKPT 转换时同相同精度，参考 88-89 行。
    * 同时声明使用离线数据集格式进行训练【**--is-tokenized-data**】，参考 50-53 行。


```
#! /bin/bash
# The script needs to be run on at least 1 nodes.

MEGATRON_PATH=${MEGATRON_PATH:-"/workspace/AIAK-Megatron"}
AIAK_TRAINING_PATH=${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}

# ----------------------------------------------------------------------------------------
# 用户自定义配置:
#     DATA_PATH: 数据集路径
#     TOKENIZER_PATH: Tokenizer路径
#     CHECKPOINT_LOAD_PATH: Checkpoint加载路径
#     CHECKPOINT_SAVE_PATH: Checkpoint保存路径
#     TENSORBOARD_PATH: Tensorboard日志保存路径, 在创建任务时开启Tensorboard后百舸自动注入环境变量
# ----------------------------------------------------------------------------------------
DATA_PATH="/mnt/pfs/qwen-2-5-vl-dataset/data"
TOKENIZER_PATH="/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct"
CHECKPOINT_LOAD_PATH="/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/qwen2_5-vl-7b-tp1-pp1"
CHECKPOINT_SAVE_PATH="/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/qwen2_5-vl-7b-tp1-pp1/1"
TENSORBOARD_PATH=$AIHC_TENSORBOARD_LOG_PATH

GPUS_PER_NODE=8

# Change for multinode config
MASTER_ADDR=${MASTER_ADDR:-"localhost"}
MASTER_PORT=${MASTER_PORT:-"6000"}
NNODES=${WORLD_SIZE:-"1"}
NODE_RANK=${RANK:-"0"}

DISTRIBUTED_ARGS=(
    --nproc_per_node $GPUS_PER_NODE
    --nnodes $NNODES
    --node_rank $NODE_RANK
    --master_addr $MASTER_ADDR
    --master_port $MASTER_PORT
)

# or you can setup qwen2_5-vl-7b by using the following command
MODEL_ARGS=(
    --model-name qwen2_5-vl-7b
)

DATA_ARGS=(
    --tokenizer-type HFTokenizer \
    --hf-tokenizer-path $TOKENIZER_PATH \
    --data-path $DATA_PATH
    --dataloader-type external
    --split 100,0,0
    --num-workers 16
    --chat-template qwen2-vl
    --packing-batch-size 10
    --is-tokenized-data
    --packing-pretrain-data
    --packing-sft-data
)

TRAINING_ARGS=(
    --training-phase sft
    --trainable-modules language_model adapter
    --seq-length 1024
    --max-position-embeddings 4096
    --init-method-std 0.02
    --micro-batch-size 1
    --global-batch-size 128
    --lr 0.0002
    --min-lr 1.0e-5
    --clip-grad 1.0
    --weight-decay 0.01
    --optimizer adam
    --adam-beta1 0.9
    --adam-beta2 0.95
    --adam-eps 1e-05
    --norm-epsilon 1e-6
    --train-iters 5000
    --lr-decay-iters 5000
    --lr-decay-style cosine
    --lr-warmup-fraction 0.002
    --initial-loss-scale 65536
    --bf16
    --load $CHECKPOINT_LOAD_PATH
    --save $CHECKPOINT_SAVE_PATH
    --save-interval 10000000
    --ckpt-format torch
    --dataloader-save ${CHECKPOINT_SAVE_PATH}/dataloader
)

MODEL_PARALLEL_ARGS=(
    --attention-backend flash
    --pipeline-model-parallel-size 1
    --tensor-model-parallel-size 1
    --use-distributed-optimizer
    --overlap-grad-reduce
    --overlap-param-gather
    --distributed-backend nccl
)

LOGGING_ARGS=(
    --log-interval 1
    --tensorboard-dir ${TENSORBOARD_PATH}
    --log-timers-to-tensorboard
)

if [ -n "${WANDB_API_KEY}" ]; then
    LOGGING_ARGS+=(
        --wandb-project ${WANDB_PROJECT}
        --wandb-exp-name ${WANDB_NAME}
    )
fi

PYTHONPATH=$MEGATRON_PATH:$AIAK_TRAINING_PATH:$PYTHONPATH \
    torchrun ${DISTRIBUTED_ARGS[@]} \
    $AIAK_TRAINING_PATH/aiak_training_llm/train.py \
    ${MODEL_ARGS[@]} \
    ${DATA_ARGS[@]} \
    ${TRAINING_ARGS[@]} \
    ${MODEL_PARALLEL_ARGS[@]} \
    ${LOGGING_ARGS[@]}
```
# 权重转换
在开发机使用如下脚本进行权重转换，将mcore格式训练结果转换为hf格式用于后续部署工作，转换脚本参考位置为/workspace/AIAK-Training-LLM/examples/qwen2_5_vl/checkpoint_convert/convert_qwen2_5_vl_7b_mcore_to_hf.sh：

注意：LOAD 目录地址为结果中最后一次迭代的文件夹名，此处只运行了 50 次迭代因此文件夹名为iter_0000050，具体文件夹信息可见目录中 latest_iteration.txt。

```
#! /bin/bash

AIAK_TRAINING_PATH=${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}
AIAK_MAGATRON_PATH=${AIAK_MAGATRON_PATH:-"/workspace/AIAK-Megatron"}
CONVERT_CHECKPOINT_PATH="$AIAK_TRAINING_PATH/tools/convert_checkpoint"

SAVE=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/output/hf
LOAD=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/output/qwen2_5-vl-7b-tp1-pp1/1/iter_0000050/

SAVE_LANGUAGE_MODEL=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/output/tmp/language-expert-hf
SAVE_VISION_MODEL=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/output/tmp/vision-model-hf
SAVE_ADAPTER=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/output/tmp/adapter-hf
SAVE_PATCH=/mnt/pfs/qwen-2-5-vl-model/Qwen2.5-VL-7B-Instruct/output/tmp/patch-hf

TP=1
PP=1

# llama: language expert
python $CONVERT_CHECKPOINT_PATH/model.py \
    --load_platform=mcore \
    --megatron_path $AIAK_MAGATRON_PATH \
    --save_platform=huggingface \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/qwen2_5.json \
    --tensor_model_parallel_size=$TP \
    --pipeline_model_parallel_size=$PP \
    --load_ckpt_path=$LOAD \
    --save_ckpt_path=$SAVE_LANGUAGE_MODEL \
    --safetensors \
    --no_save_optim \
    --no_load_optim

# vit

if [[ $PP -eq 1 ]]; then
    LOAD_PATH=$LOAD
else
    LOAD_PATH=$LOAD/tmp/
    mkdir -p $LOAD_PATH
    for ((i=0;i<$TP;i++)); do
        from=`printf "mp_rank_%02d_000" $i`
        to=`printf "mp_rank_%02d" $i`
        cp -r $LOAD/$from $LOAD_PATH/$to
    done
fi

python $CONVERT_CHECKPOINT_PATH/model.py \
    --load_platform=mcore \
    --save_platform=huggingface \
    --megatron_path $AIAK_MAGATRON_PATH \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/vision-model.json \
    --tensor_model_parallel_size=$TP \
    --pipeline_model_parallel_size=1 \
    --load_ckpt_path=$LOAD_PATH \
    --save_ckpt_path=$SAVE_VISION_MODEL \
    --safetensors \
    --no_save_optim \
    --no_load_optim

if [[ $LOAD != $LOAD_PATH ]]; then
    rm -rf $LOAD_PATH
fi

# adapter
python $CONVERT_CHECKPOINT_PATH/custom/qwen2_vl/adapter.py \
    --load_platform=mcore \
    --save_platform=huggingface \
    --megatron_path $AIAK_MAGATRON_PATH \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/adapter.json \
    --tensor_model_parallel_size=$TP \
    --pipeline_model_parallel_size=$PP \
    --load_ckpt_path=$LOAD \
    --save_ckpt_path=$SAVE_ADAPTER

# vision patch
python $CONVERT_CHECKPOINT_PATH/custom/qwen2_vl/vision_patch.py \
    --load_platform=mcore \
    --save_platform=huggingface \
    --megatron_path $AIAK_MAGATRON_PATH \
    --tensor_model_parallel_size=$TP \
    --pipeline_model_parallel_size=$PP \
    --common_config_path=$CONVERT_CHECKPOINT_PATH/config/qwen2_5-vl-7b/vision-patch.json \
    --load_ckpt_path=$LOAD \
    --save_ckpt_path=$SAVE_PATCH

# merge
python $CONVERT_CHECKPOINT_PATH/custom/qwen2_vl/merge_huggingface.py \
    --megatron_path $AIAK_MAGATRON_PATH \
    --language_model_path $SAVE_LANGUAGE_MODEL \
    --vision_model_path $SAVE_VISION_MODEL \
    --vision_patch $SAVE_PATCH \
    --adapter_path $SAVE_ADAPTER \
    --save_ckpt_path $SAVE

# BASE=/mnt/cluster/huggingface.co/Qwen/Qwen2_5-VL-7B-Instruct/
# find $BASE -type f -not -iname '*safetensors*' -exec cp {} ${SAVE}/ ';'
rm -rf $SAVE_LANGUAGE_MODEL
rm -rf $SAVE_VISION_MODEL
rm -rf $SAVE_ADAPTER
rm -rf $SAVE_PATCH
```
最后输出结果为：Finished convert checkpoint mcore->huggingface即为正确的