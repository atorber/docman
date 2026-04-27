
# 模型介绍
**一句话介绍**： 

> BEVFormer：BEVFormer 通过提取环视相机采集到的图像特征，并将提取的环视特征通过模型学习的方式转换到 BEV 空间（模型去学习如何将特征从 图像坐标系转换到 BEV 坐标系），从而实现 3D 目标检测和地图分割任务，并取得了 SOTA 的效果。


**详细图文介绍**：

![截屏2025-07-11 16.11.51.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E6%88%AA%E5%B1%8F2025-07-11%2016.11.51_9d1e82d.png)
**核心思想**：提出一种新的框架BEVFormer，利用时空变换器（spatiotemporal transformers）从多摄像头图像中学习统一的BEV表示，以支持多种自动驾驶感知任务。

**关键设计**：

* **网格形BEV查询（BEV Queries）**：预定义为可学习参数，通过注意力机制灵活融合空间和时间特征。
* **空间交叉注意力（Spatial Cross-Attention）**：基于可变形注意力，使每个BEV查询仅与摄像头视图中感兴趣区域交互，有效聚合空间信息。
* **时间自注意力（Temporal Self-Attention）**：通过循环融合历史BEV信息，提取时间信息，提升对移动物体速度估计的准确性，并有助于检测严重遮挡物体，且计算开销小。

# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|按需|建议按表单默认值及以上|
|内存|按需|建议按表单默认值及以上|
|GPU|1~8卡  A800/H20|建议4~8卡  A800/H20|
|CDS|按需|按需|
|其它|如果更改了默认的数据集、存储挂载地址、代码地址，需要同时更改对应的脚本配置|若想获得最佳训练性能，建议将预置数据转储至PFS或CFS，转储方式见文末|

# 使用说明
## **创建与登录开发机**
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，并打开VScode中的terminal 

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d77c535.png)
* 代码保存路径：/root/workspace/BEVFormer_origin
* 数据默认挂载路径：/mnt/dataset/autodrive
* 虚拟环境名：uniad

## 启动训练
* 在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置
* 若想获得最佳训练性能，建议将预置数据转储至PFS或CFS，转储方式见文末

### 2.1 一键启动训练
可以通过脚本，一键启动（单机or多机）快速训练。

```
# 设置数据路径，nuscenes数据默认路径/mnt/dataset/autodrive                    
export DATA_PATH=/mnt/dataset/autodrive
# 设置训练配置文件
export CONFIG=projects/configs/bevformer/bevformer_base.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径，默认/root/workspace/BEVFormer_origin/work_dir
export WORK_DIR=/root/workspace/BEVFormer_origin/work_dir

source /root/env_bevformer.sh 

export PYTHONPATH=/root/workspace/BEVFormer_origin:$PYTHONPATH 
cd /root/workspace/BEVFormer_origin && \
rm -rf ./data && ln -sf $DATA_PATH ./data

NNODES=${NNODES:-1}
NODE_RANK=${NODE_RANK:-0}
PORT=${PORT:-29500}
MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}

PYTHONPATH="$(dirname $0)/..":$PYTHONPATH \

python -m torch.distributed.launch \
    --nnodes=$NNODES \
    --node_rank=$NODE_RANK \
    --master_addr=$MASTER_ADDR \
    --nproc_per_node=$GPUS \
    --master_port=$PORT \
    tools/train.py \
    $CONFIG \
    --seed 0 \
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
export CONFIG=projects/configs/bevformer/bevformer_base.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径，默认/root/workspace/BEVFormer_origin/work_dir
export WORK_DIR=/root/workspace/BEVFormer_origin/work_dir
```
#### **2.2.2. 激活模型运行虚拟环境**
```
source /root/env_bevformer.sh 
```
#### **2.2.3.  启动模型训练**
```
export PYTHONPATH=/root/workspace/BEVFormer_origin:$PYTHONPATH 
cd /root/workspace/BEVFormer_origin && \
rm -rf ./data && ln -sf $DATA_PATH ./data

NNODES=${NNODES:-1}
NODE_RANK=${NODE_RANK:-0}
PORT=${PORT:-29500}
MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}

PYTHONPATH="$(dirname $0)/..":$PYTHONPATH \

python -m torch.distributed.launch \
    --nnodes=$NNODES \
    --node_rank=$NODE_RANK \
    --master_addr=$MASTER_ADDR \
    --nproc_per_node=$GPUS \
    --master_port=$PORT \
    tools/train.py \
    $CONFIG \
    --seed 0 \
    --work-dir $WORK_DIR \
    --launcher pytorch ${@:3} 2>&1 | tee output.log
```
## 查看训练结果
训练结果保存在$WORK_DIR下，包含训练日志以及模型权重文件，使用其他保存路径可以修改环境变量$WORK_DIR。

```
# 设置训练结果保存路径，默认/root/workspace/mmdetection3d/work_dir
export WORK_DIR=/root/workspace/mmdetection3d/work_dir
```
可在路径下查看：

* 完整训练日志： output.log
* 最终模型权重：latest.pth





# 附： BOS数据转储PFS方式
1. 挂载PFS或CFS

可以在创建或者更新开发机配置时，选择存储挂载，选择集群对应的PFS或者CFS，可自定义挂载路径

![image1.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image1_e04f65d.png)


2. 将预置数据（BOS）拷贝到对应的PFS或CFS路径

```
#命令格式  cp -rv  源路径 目标路径
cp -rv  bos路径  PFS或CFS路径
#命令示例  假设bos挂载地址为/mnt/dataset/autodrive   PFS挂载地址为/mnt/pfs/urvmsq
cp -rv  /mnt/dataset/autodrive/   /mnt/pfs/urvmsq/
```