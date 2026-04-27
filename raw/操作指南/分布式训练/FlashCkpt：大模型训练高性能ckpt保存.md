**FlashCkpt**是百舸AI计算平台为PyTorch大模型训练场景而开发的高性能Checkpoint框架，实现接近0开销的模型状态保存。本文将介绍如何使用百舸**FlashCkpt**的能力，提升Checkpoint保存的性能。

## 背景信息

大模型训练随着参数量和数据规模的增长，受限于单机GPU内存容量限制，通常会使用分布式训练框架进行训练。但是分布式训练中可能会遇到单点的节点故障、系统问题等其他难以预知的异常问题，造成训练任务的中断。

在实际训练过程中，通常会开启定期Checkpoint机制来保存和恢复进度，尽量降低训练中断带来的算力浪费，但Checkpoint本身的耗时与模型的大小成正比。对于百亿、千亿参数的大模型，单次Checkpoint的保存时间开销通常在几分钟到十几分钟之间。Checkpoint间隔时间较短会使训练任务频繁暂停，GPU算力严重浪费；Checkpoint间隔时间较长，一旦发生中断，之前损失的迭代次数在恢复时需要重新计算。以1千卡为例，假设每4小时Checkpoint一次，单次保存耗时10分钟，那么每天因Checkpoint损失的GPU算力接近1000卡时。

因此，在大规模分布式训练时，需要一种以低成本、可靠的方法来保存最新的checkpoint，降低时间和资源的浪费，提升GPU的有效训练时长。



## 方案介绍

**Flash Ckpt核心思路**：Checkpoint保存与模型训练过程重叠，降低Checkpoint保存占用GPU训练的有效时间。

![0415359f-83a0-441a-94f4-a3c947ea7258.svg](https://bce.bdstatic.com/doc/bce-doc/AIHC/0415359f-83a0-441a-94f4-a3c947ea7258_62d6f53.svg)

## 收益

**分别针对 7B，70B，130B三种参数规模的模型训练进行对比测试，百舸FlashCkpt相比于原生的Ckpt方案，单次保存耗时最高减少93到99%**。

| 模型参数 | ckpt文件大小 | 训练环境配置                                                 | 原生ckpt单次保存耗时（秒） | 百舸FlashCkpt单次保存耗时（秒） |
| -------- | ------------ | ------------------------------------------------------------ | -------------------------- | ------------------------------- |
| 7B       | 88GB         | 模型切分：1TP 1PP 8DP<br>机器配置：NVIDIA A800-SMX4-80G，1 node，8GPUs | 35                         | **2.5**                         |
| 70B      | 899GB        | 模型切分：2TP 8PP 2DP<br/>机器配置：NVIDIA A800-SMX4-80G，4 node，32GPUs | 143                        | **4**                           |
| 130B     | 1702GB       | 模型切分：4TP 6PP 2DP<br/>机器配置：NVIDIA A800-SMX4-80G，6 node，48GPUs | 262                        | **3.8**                         |

> 说明：
>
> 1. 训练镜像：`registry.baidubce.com/cce-ai-native/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.3.0_release`
> 2. 以上相同参数的模型，在ckpt保存耗时的对比测试中，采用相同的共享存储，排除存储性能的影响

## 使用说明

### 使用限制

1. 内存占用：单机所有GPU卡的Checkpoint会优先保存在内存，因此对于千亿参数规模模型，单机建议预留200G以上的内存。
2. 框架支持：当前仅支持Megatron训练框架（<= 23.04版本），DeepSpeed支持中。

### 使用方式

提供以下两种的使用方式：

- 通过AIAK加速镜像使用：针对于在训练中直接使用AIAK-Training加速镜像的用户；
- 通过代码包的方式使用：针对于自定义训练镜像的客户。

#### 通过AIAK镜像使用

**FlashCkpt**的能力已经默认集成到AIAK-Training加速镜像 v1.2.3.0及更高版本中，通过在启动命令中增加 `--enable-accelerate-checkpoint `一键开启FlashCkpt加速。

1. AIAK-training加速镜像V1.2.3.0版本：

```
registry.baidubce.com/cce-ai-native/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.3.0_release  # NVIDIA A800机型适用
registry.baidubce.com/cce-ai-native/aiak-megatron:ubuntu22.04-cu12.2-torch2.1.0-py310_v1.2.3.0_release` # NVIDIA H800机型适用
```

2. 启动命令示例：

```bash
OTHER_ARGS="--data-path $DATA_PATH \
            --data-impl mmap \
            --split 949,50,1 \
            --save $CHECKPOINT_SAVE_PATH \
            --load $CHECKPOINT_LOAD_PATH \
+           --enable-accelerate-checkpoint \ # 开启checkpoint加速
            --tensorboard-dir ${TENSORBOARD_PATH} \
            --distributed-backend nccl"
```

#### 通过代码包使用

1. 加速包下载

```bash
wget https://cce-ai-aihc.bj.bcebos.com/Checkpoint/AIDK_CentOS7-0.1.0-py3-none-any.whl # 针对于容器base镜像为CentOS-7的加速包
wget https://cce-ai-aihc.bj.bcebos.com/Checkpoint/AIDK_Ubuntu20-0.1.0-py3-none-any.whl # 针对于容器base镜像为Ubuntu20.04的加速包
```

2. 安装加速包

这里以`AIDK_Ubuntu20-0.1.0-py3-none-any.whl`作为示例：

```bash
pip3 install AIDK_Ubuntu20-0.1.0-py3-none-any.whl
```

3. 代码导入加速包，只需要修改2行代码
   - 替换megatron的Checkpoint接口
   - 在最后一次Checkpoint结束后，调用finish_checkpoint_process()通知Checkpoint，确保最后一次Checkpoint正常结束。

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2820f7bfccda47b99a4c823d10f346bf&docGuid=T2i_x7AArYzSyx)

需要替换的代码如下：

```
from aidk.checkpoint.megatron.checkpointing import (load_model_checkpoint_for_zero,
                                                    load_optim_checkpoint_for_zero,
                                                    load_checkpoint,
                                                    save_checkpoint,
                                                    finish_checkpoint_process)
```

```
finish_checkpoint_process()
```



### 观察效果

任务启动后，可以通过查询rank0的日志获取ckpt信息

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=a48759229d824726b3fe5e1b9fa3ebde&docGuid=T2i_x7AArYzSyx)

| **字段**                       | **解释**                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| **async save checkpoint at 6** | 当前Checkpoint采用的是异步Checkpoint，保存的是iteration 6.   |
| **memory used**                | 统计当前内存使用情况（系统整体内存使用情况，仅供参考）       |
| **start timestamp**            | 本次Checkpoint的开始时间戳                                   |
| **end timestamp**              | 本次Checkpoint的结束时间戳（不包括Checkpoint保存到存储的时间） |
| **cost time**                  | 本次Checkpoint接口调用的总耗时（不包括Checkpoint保存到存储的时间） |