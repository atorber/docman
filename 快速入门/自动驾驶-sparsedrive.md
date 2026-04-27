 # 模型介绍
> 来自清华和地平线的论文“[SparseDrive](https://zhida.zhihu.com/search?content_id=252280537&content_type=Article&match_order=1&q=SparseDrive&zhida_source=entity): End-to-End Autonomous Driving via Sparse Scene Representation”，通过稀疏场景表示来实现端到端自动驾驶新范式，兼具SOTA的性能和易于部署的优点。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f618328.png)
  在自动驾驶端到端技术快速发展之前，传统的自动驾驶系统通常会将任务分解为独立的部分，如感知、预测和规划。但这种方法会导致模块间的信息丢失和错误累积。相比之下，端到端方法将所有任务整合到一个完全可微分的框架中，从而允许以规划为导向进行优化。然而，尽管端到端方法具有巨大潜力，但其性能和效率往往不能达到预期。这主要是由于需要计算成本高昂的 BEV 特征以及简单的预测和规划设计。

  为了解决这些问题，提出了名为SparseDrive的新端到端范式。SparseDrive主要由两部分构成：对称稀疏感知模块和并行运动规划器。对称稀疏感知模块将检测、跟踪和在线地图构建整合到一起，通过模型学习得到驾驶场景的完全稀疏表示。对于运动预测和规划，研究人员发现这两个任务有很大的相似性，因此为运动规划器设计了一个并行的框架。在这个框架下，规划被建模为一个多模态问题，通过一个分层的规划选择策略，结合碰撞感知的重新评分模块，选择最合理且安全的轨迹作为最终的规划输出。

  借助这种高效的设计，SparseDrive在所有任务上都实现了最先进的性能，同时提高了训练和推理的效率。

</br>

# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|按需|建议按表单默认值及以上|
|内存|按需|建议按表单默认值及以上|
|GPU|1~8卡|建议4~8卡|
|CDS|按需|按需|
|其它|如果更改了默认的数据集、存储挂载地址、代码地址，需要同时更改对应的脚本配置|若想获得最佳训练性能，建议将预置数据转储至PFS或CFS，转储方式见文末|

</br></br>



# 使用说明
## **1. 创建与登录开发机**
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，并打开VScode中的terminal 

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d77c535.png)
* 代码保存路径：/root/workspace/SparseDrive
* 数据默认挂载路径：/mnt/dataset/autodrive
* 虚拟环境名：sparsedrive

## 2. 启动训练
若想获得最佳训练性能，建议将预置数据转储至PFS或CFS，转储方式见文末

### 2.1 一键启动训练
可以通过脚本，一键启动（单机or多机）快速训练。

```
# 设置数据路径，nuscenes数据默认路径/mnt/dataset/autodrive                    
export DATA_PATH=/mnt/dataset/autodrive
# 设置训练配置文件
export CONFIG=projects/configs/sparsedrive_small_stage1.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径，默认/root/SparseDrive/work_dir
export WORK_DIR=/root/SparseDrive/work_dir

source /root/env_sparsedrive.sh

cd /root/workspace/SparseDrive && \
rm -rf data && ln -sf $DATA_PATH ./data                    # 链接数据

# 添加项目文件夹到PYTHONPATH
export PYTHONPATH=/root/workspace/SparseDrive:$PYTHONPATH  

NNODES=${WORLD_SIZE:-1}
NODE_RANK=${RANK:-0}
PORT=${MASTER_PORT:-29600}
MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}                   
python3 -m torch.distributed.launch \
    --nnodes=$NNODES \
    --node_rank=$NODE_RANK \
    --master_addr=$MASTER_ADDR \
    --nproc_per_node=$GPUS \
    --master_port=$PORT \
    tools/train.py \
    $CONFIG \
    --work-dir $WORK_DIR \
    --launcher pytorch ${@:3} 2>&1 | tee output.log
```


### 2.2. 分步训练
分步进行训练任务，可以自定义训练相关参数信息。

#### **2.2.1.  在环境变量中设置相关参数**
若不修改默认配置，可跳过此步骤

```
# 设置数据路径，nuscenes数据默认路径/mnt/dataset/autodrive                    
export DATA_PATH=/mnt/dataset/autodrive
# 设置训练配置文件
export CONFIG=projects/configs/sparsedrive_small_stage1.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径，默认/root/SparseDrive/work_dir
export WORK_DIR=/root/SparseDrive/work_dir
```
#### **2.2.2. 激活模型运行虚拟环境**
```
source /root/env_sparsedrive.sh
```
#### **2.2.3.  启动模型训练**
```
cd /root/workspace/SparseDrive && \
rm -rf data && ln -sf $DATA_PATH ./data                    # 链接数据

# 添加项目文件夹到PYTHONPATH
export PYTHONPATH=/root/workspace/SparseDrive:$PYTHONPATH  

NNODES=${WORLD_SIZE:-1}
NODE_RANK=${RANK:-0}
PORT=${MASTER_PORT:-29600}
MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}                   
python3 -m torch.distributed.launch \
    --nnodes=$NNODES \
    --node_rank=$NODE_RANK \
    --master_addr=$MASTER_ADDR \
    --nproc_per_node=$GPUS \
    --master_port=$PORT \
    tools/train.py \
    $CONFIG \
    --work-dir $WORK_DIR \
    --launcher pytorch ${@:3} 2>&1 | tee output.log
```
## 3. 查看训练结果
训练结果保存在$WORK_DIR下，包含训练日志以及模型权重文件，使用其他保存路径可以修改环境变量$WORK_DIR。

```
# 设置训练结果保存路径，默认/root/SparseDrive/work_dir
export WORK_DIR=/root/SparseDrive/work_dir
```
可在路径下查看：

* 完整训练日志： output.log
* 最终模型权重：latest.pth


</br></br>


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










