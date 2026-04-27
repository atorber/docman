  
# 模型介绍
UniAD是一个端到端的自动驾驶框架，通过整合感知、预测、决策和控制模块，实现全栈驾驶任务的协同优化，显著提升系统在复杂场景下的性能和安全性。
</br>

![截屏2025-07-03 下午3.52.57.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E6%88%AA%E5%B1%8F2025-07-03%20%E4%B8%8B%E5%8D%883.52.57_2d53a06.png)
</br>
</br>
现代自动驾驶系统的特点是按顺序排列的模块化任务，即感知、预测和规划。为了执行多种多样的任务并实现高级别的智能，当前的方法要么为单个任务部署独立模型，要么设计具有独立分支的多任务范式。然而，它们可能会遭受累积误差或任务协调不足的问题。UniAD重新审视了感知和预测中的关键组件，并对任务进行了优先级排序，使所有任务都有助于规划。UniAD 是一个目前最全面的框架，它将全栈驾驶任务整合到一个网络中。该框架设计精巧，能够充分利用每个模块的优势，并从全局视角为智能体交互提供互补的特征抽象。任务通过统一的查询接口进行通信，以相互促进规划。通过大量的消融实验，证明了使用这种理念的有效性，其在所有方面都大幅超越了之前的最先进水平。

# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|8|建议按表单默认值及以上|
|内存|200G+|建议按表单默认值及以上|
|GPU|1~8卡  H20|建议4~8卡  H20|
|CDS|按需|按需|
|其它|如果更改了默认的数据集、存储挂载地址、代码地址，需要同时更改对应的脚本配置|若想获得最佳训练性能，建议将预置数据转储至PFS或CFS，转储方式见文末|

# 使用说明
## **创建与登录开发机**
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，并打开VScode中的terminal 

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d77c535.png)
* 代码保存路径：/root/workspace/UniAD
* 数据默认挂载路径：/mnt/dataset/autodrive
* 虚拟环境名：uniad_new

## 启动训练
* 在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置
* 若想获得最佳训练性能，建议将预置数据转储至PFS或CFS，转储方式见文末


### 2.1 一键启动训练
可以通过脚本，一键启动（单机or多机）快速训练。

```
# 设置数据路径，nuscenes数据默认路径/mnt/dataset/autodrive                    
export DATA_PATH=/mnt/dataset/autodrive
# 设置训练配置文件
export CONFIG=projects/configs/stage1_track_map/base_track_map.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径
export WORK_DIR=/root/workspace/UniAD/work_dir

export TORCH_CUDA_ARCH_LIST=9.0
export LD_LIBRARY_PATH=/root/anaconda3/envs/uniad_new/lib/python3.8/site-packages/torch/lib:$LD_LIBRARY_PATH
export PATH=/root/cuda-12.2/bin/:$PATH
export LD_LIBRARY_PATH=/root/cuda-12.2/lib64/:$LD_LIBRARY_PATH
export CUDA_HOME=/root/cuda-12.2
source /root/anaconda3/etc/profile.d/conda.sh
conda activate uniad_new
export NCCL_IB_GID_INDEX="3"

export PYTHONPATH=/root/workspace/UniAD:$PYTHONPATH 
cd /root/workspace/UniAD && \
rm -rf ./data && ln -s $DATA_PATH data

NNODES=${WORLD_SIZE:-1}
NODE_RANK=${RANK:-0}
PORT=${MASTER_PORT:-29600}
MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}
python -m torch.distributed.launch \
    --nproc_per_node=$GPUS \
    --master_addr=$MASTER_ADDR \
    --master_port=$PORT \
    --nnodes=$NNODES \
    --node_rank=$NODE_RANK \
    tools/train.py \
    $CONFIG \
    --launcher pytorch ${@:3} \
    --deterministic \
    --work-dir $WORK_DIR \
    2>&1 | tee output.log
```
### 2.2. 分步训练
分步进行训练任务，可以自定义训练相关参数信息。

#### **2.2.1.  在环境变量中设置相关参数**
若不修改默认配置，可跳过此步骤

```
# 设置数据路径，nuscenes数据默认路径/mnt/dataset/autodrive                    
export DATA_PATH=/mnt/dataset/autodrive
# 设置训练配置文件
export CONFIG=projects/configs/stage1_track_map/base_track_map.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径，默认/root/workspace/mmdetection3d/work_dir
export WORK_DIR=/root/workspace/UniAD/work_dir
```
#### **2.2.2. 激活模型运行虚拟环境**
```
export TORCH_CUDA_ARCH_LIST=9.0
export LD_LIBRARY_PATH=/root/anaconda3/envs/uniad_new/lib/python3.8/site-packages/torch/lib:$LD_LIBRARY_PATH
export PATH=/root/cuda-12.2/bin/:$PATH
export LD_LIBRARY_PATH=/root/cuda-12.2/lib64/:$LD_LIBRARY_PATH
export CUDA_HOME=/root/cuda-12.2
source /root/anaconda3/etc/profile.d/conda.sh
conda activate uniad_new
export NCCL_IB_GID_INDEX="3"
```
#### **2.2.3.  启动模型训练**
```
export PYTHONPATH=/root/workspace/UniAD:$PYTHONPATH 
cd /root/workspace/UniAD && \
rm -rf ./data && ln -s $DATA_PATH data

NNODES=${WORLD_SIZE:-1}
NODE_RANK=${RANK:-0}
PORT=${MASTER_PORT:-29600}
MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}
python -m torch.distributed.launch \
    --nproc_per_node=$GPUS \
    --master_addr=$MASTER_ADDR \
    --master_port=$PORT \
    --nnodes=$NNODES \
    --node_rank=$NODE_RANK \
    tools/train.py \
    $CONFIG \
    --launcher pytorch ${@:3} \
    --deterministic \
    --work-dir $WORK_DIR \
    2>&1 | tee output.log
```
## 查看训练结果
训练结果保存在$WORK_DIR下，包含训练日志以及模型权重文件，使用其他保存路径可以修改环境变量$WORK_DIR。

```
# 设置训练结果保存路径，默认/root/workspace/UniAD/work_dir
export WORK_DIR=/root/workspace/UniAD/work_dir
```
可在路径下查看：

* 完整训练日志： output.log
* 最终模型权重：latest.pth

# 附： BOS数据转储PFS方式
1. 挂载PFS或CFS

可以在创建或者更新开发机配置时，选择存储挂载，选择集群对应的PFS或者CFS，可自定义挂载路径

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e04f65d.png)


2. 将预置数据（BOS）拷贝到对应的PFS或CFS路径

```
#命令格式  cp -rv  源路径 目标路径
cp -rv  bos路径  PFS或CFS路径
#命令示例  假设bos挂载地址为/mnt/dataset/autodrive   PFS挂载地址为/mnt/pfs/urvmsq
cp -rv  /mnt/dataset/autodrive/   /mnt/pfs/urvmsq/
```
3. 转储后，需要更改配置里的数据集变量DATA_PATH地址为/mnt/pfs/urvmsq/autodrive/文件夹
