AIAK-Training-LLM是百度智能云基于百度百舸·AI计算平台，面向大模型训练场景提供的最佳实践解决方案配套AI加速工具，帮助模型开发者高效完成大规模深度学习分布式训练，提升训练效率，相比开源 Megatron-LLM性能明显提升。关于AIAK-Training-LLM的使用说明，详见这里[这里](https://cloud.baidu.com/doc/AIHC/s/Alyo476jr)

这里我们以Qwen/Qwen2.5-VL-7B-Instruct模型为示例，介绍如何使用AIAK-Training-LLM 进行训练。


## 使用前提

1. 已经创建百舸资源池，包含至少1台8卡的GPU节点，这里我们以A800为例
2. 已经创建并行文件存储PFS，并且已经和资源池关联。推荐使用PFS存储数据，进行训练



## 步骤一：准备模型原始权重文件

百舸平台已经在对象存储BOS中预置模型权重，您可以从对应地域的BOS路径中下载数据。请参考[下载百舸平台预置的公共数据到PFS](https://cloud.baidu.com/doc/AIHC/s/Mmfjj3i9f)

```
bos:/aihc-models-bj/Qwen/Qwen2.5-VL-7B-Instruct  #北京
bos:/aihc-models-bd/Qwen/Qwen2.5-VL-7B-Instruct  #保定
```



## 步骤二：准备数据集

### 2.1 数据集格式和处理

考虑多模态数据集的多样性，本次版本将采用 ***\*Energon\**** 加载器来提升数据处理性能，它要求数据集以标准的 ***\*WebDataset\**** 格式存储。WebDataset 是以原生文件格式 (jpg、mp4等) 存储数据，这使得各种原生的多模态数据集只需简单地压缩就能转成 WebDataset 格式，进而被 Energon 读取。

相关的参考文档：

- Energon： https://nvidia.github.io/Megatron-Energon/﻿
- WebDataset：https://huggingface.co/docs/hub/datasets-webdataset﻿

﻿

针对 Qwen2.5-VL 模型，AIAK-Training-LLM 当前重点支持了  ***\*VQA\**** 和 ***\*Captioning\**** 两种多模态数据格式（下文分别介绍具体的数据处理流程）：

- VQA 格式的数据集
- Captioning 格式的数据集，以 minigpt4_3500 数据集为例

﻿

#### 2.1.1 VQA

**1) 第一步：准备原始数据集：**

如下样本来自 https://github.com/hiyouga/LLaMA-Factory/blob/b4c7dd3ac5615ccb52d7627db635d33336e51951/data/mllm_demo.json﻿

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=1d2fc29056574b8aaae1b4b44ded1045&docGuid=glq4_zkWFSId1O)

﻿

**2）第二步：将原始数据集压缩成WebDataset格式**

AIAK 内置了工具用于处理数据格式转换，路径在`/workspace/AIAK-Training-LLM/tools/data_preprocess/convert_to_webdataset.py`，具体使用方式：

```bash
python /workspace/AIAK-Training-LLM/tools/data_preprocess/convert_to_webdataset.py \
    --output_dir /tmp/mllm/wds \
    --json_file /tmp/mllm/mllm_demo.json \
    --image_dir /tmp/mllm/ \
    --maxcount 10000
```

功能说明：

- ﻿`convert_to_webdataset.py`会将 `***\*json_file\****` 中每个样本抽出来存储成独立的json文件，并和 `***\*image_dir\****` 中相对应的图片一起被压缩到 ***\*$output_dir\****，每个tar包最多包含有 `***\*maxcount\****` 个样本；
- ﻿后续启动训练时，将通过`--data-path`参数指定如上 WebDataset 路径  `/tmp/mllm/wds`，用于训练数据读取；

﻿

执行示例：

- 当执行上面脚本后，`--output_dir`目录下新增处理后的数据压缩包：

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=1103d8e1e54044eeaa49c98dd7578199&docGuid=glq4_zkWFSId1O)

- pretrain-0.tar 中的文件如下，其中具有相同前缀的数据文件都属于同一个样本，比如 1.jpg 和 1.json 属于样本1。

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=22c4ff3f7b2c49e292a5e25d30ec575b&docGuid=glq4_zkWFSId1O)

﻿

**3）第三步：将 WebDataset 格式转成 Energon 加载器格式**

Energon 格式相对于 WebDataset，只增加了 yaml 文件记录数据集信息，用于后续 dataloader 解析数据集，具体如下：

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=337540bb3f87474e99dc5b3c704789fa&docGuid=glq4_zkWFSId1O)

- ﻿`.info.yaml`记录各压缩包的样本数
- ﻿`dataset.yaml`记录样本信息
- ﻿`split.yaml` 记录数据集的划分

﻿

由于上述 yaml 文件存在一些格式要求，为了方便用户生成以上yaml文件，AIAK镜像中也内置了 energon 命令行工具通过交互式指令来自动生成 yaml 格式问题，具体步骤如下：

```bash
# Step 1，生成 info.yaml
cd /tmp/mllm/wds/
energon prepare ./
﻿
# Step 2, 生成 split.yaml，和后续训练保持一致即可
> Please enter a desired train/val/test split: 10,0,0
﻿
# Step 3, 生成 dataset.yaml
> Do you want to create a dataset.yaml interactively? [Y/n]: Y
> Please enter a number to choose a class: 9
> Do you want to set a simple field_map[Y]? [Y/n]: Y
> Please enter a webdataset field name for 'image' : jpg
> Please enter a webdataset field name for 'context': json[0][content]
> Please enter a webdataset field name for 'answers': json[1][content]
Done
```

执行示例：

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=cb9b94a3159c45e6a142866c7f7a7e5e&docGuid=glq4_zkWFSId1O)

﻿

对  **第三步** 补充说明：

- 以上共列出12个种数据集格式，当前仅支持 ***\*0. CaptionSample\**** 和 ***\*9. VQASample\****。
- 每种数据集格式都有各自的字段需指定，比如VQASample的字段有：
  - ﻿`image`： dataloader 会按该字段寻找相应后辍名的文件，比如：1.jpg。
  - ﻿`context`：dataloader 会按该字段寻找相应后辍名的文件，并在文件中匹配相应内容。比如：`json[0][content]` 表示在 *.json 文件中把第1条信息中的 content 字段对应的内容作为"问题"
  - ﻿`answers`：同理，`json[1][content]` 将在 *.json 文件中把第2条信息中的 content 字段对应的内容作为"答案"

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b7924677fa2946eba0b022734d46df51&docGuid=glq4_zkWFSId1O)

﻿

**4）第四步：校验转换结果（可选）**

```bash
energon preview ./
```

正常打印图像说明转换成功

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=337cb391a0994ff0b615ba1b55612c58&docGuid=glq4_zkWFSId1O)

﻿

#### 2.1.2 Caption

**1）第一步：准备原始数据集**

样本来自 https://huggingface.co/datasets/THUDM/CogVLM-SFT-311K﻿

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=54c755a2605b487e8a4153f010b6006a&docGuid=glq4_zkWFSId1O)

﻿

**2）第二步：将原始数据集压缩成WebDataset格式**

```bash
cd /tmp/minigpt4
mkdir wds
tar -cf wds/pretrain.tar samples/
```

由于原始数据集格式，已经和`convert_to_webdataset.py`工具所生成 tar 内的格式一致，因此仅需要执行压缩命令即可，而不需要额外调用转换工具单独处理；

﻿

**3）第三步：WebDataset 格式转成 Megatron-Energon 格式**

```bash
cd wds
energon prepare ./
为所显示的选项选择以下值：
> Please enter a desired train/val/test split: 10,0,0
> Do you want to create a dataset.yaml interactively? [Y/n]: Y
> Please enter a number to choose a class: 0
> Please enter a webdataset field name for 'image' : jpg
> Please enter a webdataset field name for 'caption': json[captions][0][content]
Done
```

﻿

**4）第四步：校验转换结果（可选）**

```bash
energon preview ./
```

能正常打印图像说明转换成功

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b07498c794c8483198237e0fbee94246&docGuid=glq4_zkWFSId1O)

### 2.2 数据集下载

百舸平台已经在对象存储BOS中预置VQA格式的数据集，您可以从对应地域的BOS路径中下载，直接训练。请参考[下载百舸平台预置的公共数据到PFS](https://cloud.baidu.com/doc/AIHC/s/Mmfjj3i9f)

```
bos:/aihc-rdw-bj/dataset/mllm/demo/wds/
```

已上传



## 步骤三： 模型权重转换

AIAK-Training-LLM 是基于 Megatron 构建的大模型训练库，而 Megatron 模型权重格式和开源的格式（如 huggingface）存在区别，因此，当用户需基于开源权重进行再训练时，需要提前将模型权重格式进行转换。 AIAK 针对支持的模型提供了统一的权重转换工具 ，具体使用方式，详见 [Checkpoint及格式转换](https://cloud.baidu.com/doc/AIHC/s/Vlyo4r4gj#checkpoint%E5%8F%8A%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2)。

**具体转换操作，用户可以进入容器，参考**`**/workspace/AIAK-Training-LLM/examples/{model}/checkpoint_convert**`**目录下提供的示例脚本，将 `Huggingface` 权重转换到 AIAK 支持的`MegatronCore` 格式

```
#! /bin/bash

AIAK_TRAINING_PATH=${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}
AIAK_MAGATRON_PATH=${AIAK_MAGATRON_PATH:-"/workspace/AIAK-Magatron"}
CONVERT_CHECKPOINT_PATH="$AIAK_TRAINING_PATH/tools/convert_checkpoint"

## LOAD：原始权重地址，SAVE 转换的模型存储路径
LOAD=/mnt/cluster/aiak-training-llm/qwen2.5-vl/Qwen2.5-VL-7B-Instruct
SAVE=/mnt/cluster/aiak-training-llm/qwen2.5-vl/qwen2_5-vl-7b-tp1-pp1

SAVE_LANGUAGE_MODEL=/mnt/cluster/aiak-training-llm/tmp/language-mcore
SAVE_VISION_MODEL=/mnt/cluster/aiak-training-llm/tmp/vision-model-mcore
SAVE_ADAPTER=/mnt/cluster/aiak-training-llm/tmp/adapter-mcore
SAVE_PATCH=/mnt/cluster/aiak-training-llm/tmp/patch-mcore

# 不需要进行模型切分，所以TP=1，PP=1
TP=1
PP=1


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



百舸平台已经在对象存储BOS中预置megatronCore格式的qwen2.5-vl-7B得模型权重，您也可以从对应地域的BOS路径中下载，直接使用:

```
bos:/aihc-models-bj/Qwen/qwen2_5-vl-7b-tp1-pp1
```



## 步骤四： 开启训练

### 4.1 训练参数

AIAK 当前提供各模型预训练示例脚本，进入容器，可以在`**/workspace/AIAK-Training-LLM/examples/{model}/**`下查看。 关于训练说明，详见:[这里](https://cloud.baidu.com/doc/AIHC/s/Vlyo4r4gj)

目前训练模式支持Pretrain和SFT，这里我们以SFT为例，**用户可以参考**`**/workspace/AIAK-Training-LLM/examples/{model}/finetuning**`**目录下的示例脚本进行 SFT 训练**.

```
#! /bin/bash
# The script needs to be run on at least 1 nodes.

MEGATRON_PATH=${MEGATRON_PATH:-"/workspace/AIAK-Megatron"}
AIAK_TRAINING_PATH=${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}

DATA_PATH=${DATA_PATH:-"/mnt/cluster/aiak-training-llm/dataset/mllm/demo/wds/"} #替换为环境中的数据集地址

TOKENIZER_PATH=${TOKENIZER_PATH:-"/mnt/cluster/aiak-training-llm/qwen2.5-vl/Qwen2.5-VL-7B-Instruct/"} #替换为环境中的Tokenizer地址

CHECKPOINT_PATH=${CHECKPOINT_PATH:-"/mnt/cluster/aiak-training-llm/qwen2.5-vl/qwen2_5-vl-7b-tp1-pp1"}  #替换为环境中的ckpt地址

TENSORBOARD_PATH=$AIHC_TENSORBOARD_LOG_PATH #开启tensorboard后，设置Tensorboard日志的保存路径

GPUS_PER_NODE=8

#若开启wandb，设置以下环境变量
export WANDB_API_KEY=""
export WANDB_PROJECT=""
export WANDB_NAME=""
export http_proxy=""
export https_proxy=""


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
    --global-batch-size 512
    --lr 0.0002
    --min-lr 1.0e-5
    --clip-grad 1.0
    --weight-decay 0.01
    --optimizer adam
    --adam-beta1 0.9
    --adam-beta2 0.95
    --adam-eps 1e-05
    --norm-epsilon 1e-6
    --train-iters 50000
    --lr-decay-iters 50000
    --lr-decay-style cosine
    --lr-warmup-fraction 0.002
    --initial-loss-scale 65536
    --bf16
    --load $CHECKPOINT_PATH
    --save $CHECKPOINT_PATH
    --save-interval 10000000
    --ckpt-format torch
    --dataloader-save ${CHECKPOINT_PATH}/dataloader
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



### 4.2 创建任务

1. 登录[百舸异构计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)。

2. 进入 **分布式训练** 列表页面，点击**创建任务**，填写任务关键配置信息：

   - 基础信息
     - 任务名称：这里输入qwen2-5-vl-7b-sft
     - 资源池&队列：选择已创建的资源池和队列
     - 优先级：默认 中 优先级，无需更改
     - 训练框架：选择Pytorch
     - 任务创建方式： 自定义创建
   - 环境配置
     - 镜像地址：这里输入`registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.6-torch2.5.0-py310-bccl1.2.7.2_v2.2.3.2_release`
     - 执行命令：参考上述4.1的训练脚本，可以直接粘贴进来（注意：需要根据实际的环境替换以下的参数）DATA_PATH`、`TRAINING_CONFIG`等配置信息
       - `DATA_PATH`：可下载预置的数据集，填写实际的数据集路径
       - `TOKENIZER_PATH`：填写tokenizer的实际路径，即模型原始的huggingface格式的模型权重，可下载文档中平台预置的原始模型权重
       - `CHECKPOINT_PATH`：填写MegatronCore 格式的模型权重地址，可以参考步骤三转换，或者下载直接使用平台预置的模型权重
       - `TENSORBOARD_PATH`: 若希望开启Tensorboard，则需要指定Tensobroard日志的保存路径。注意：平台自动注入`$AIHC_TENSORBOARD_LOG_PATH`环境变量，代表Tensorboard日志路径，您可以在代码中使用此环境变量来引用日志路径
       - 若希望使用wandb观察训练过程，需要额外配置如下参数
         - `export WANDB_API_KEY` ：Wandb 账户的**认证密钥**，用于身份验证和访问权限。**必须设置**才能与 Wandb 服务端通信
         - `export WANDB_PROJECT`：设置wandb project名称，如qwen
         - `export WANDB_NAME`：设置实验名称，如qwen2.5vl-7b-1
         - `export http_proxy`：设置代理，可以连接wandb服务器
         - `export https_proxy`：设置代理，可以连接wandb服务器
     - 环境变量：无需更改
   - 资源配置
     - 实例数：这里填写1，单机训练A800训练
     - 加速芯片：这里选择提前准备的A800 GPU，单实例8卡
     - 共享内存：默认10Gi
     - RDMA：单机训练，无需开启
   - 设置数据源
     - 存储类型：这里选择我们提前准备的PFS
     - PFS源路径：PFS的挂载路径，默认根目录，按实际情况填写
     - 挂载路径：容器内的挂载路径设置数据源

   - 监控信息：
     - Tensorboard：开启Tensorboard，自定义Tensorboard日志再日志中的存储路径

3. 点击 **完成**，提交训练任务。

### 4.3 观察训练任务

任务进行运行状态后，您可以在百舸平台查询看任务的监控、日志、Tensorboard等信息；也可以登陆wandb官网，查询训练过程

**训练日志**

![image-20250915103131998.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20250915103131998_d085a12.png)



**Tensorboard**

![image-20250915103222656.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20250915103222656_1cca300.png)

![image-20250915103313723.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20250915103313723_9942cac.png)


**监控**

![image-20250915103430608.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20250915103430608_927a0a5.png)



**wandb**

![image-20250915103714081.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20250915103714081_6950ba1.png)
