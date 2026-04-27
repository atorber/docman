  

# 模型介绍

> BEVDet：BEVDet是基于LSS提出的方法，实现从图像空间到BEV空间的视图变换，构建统一的鸟瞰图特征空间，用于视觉3D目标检测任务。



![截屏2025-07-04 15.55.18.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E6%88%AA%E5%B1%8F2025-07-04%2015.55.18_e80cc50.png)
  BEVDet的核心思想是将多相机图像特征转换到BEV空间中进行3D目标检测。其框架包括以下几个关键模块：

1. **图像视角编码器（Image-view Encoder）**：用于从输入图像中提取高级特征，包括一个主干网络（如ResNet或SwinTransformer）和一个特征融合模块（如FPN）。
2. **视角变换器（View Transformer）**：将图像视角特征转换为BEV特征。它通过预测深度图，并利用深度图将图像特征渲染到BEV空间。
3. **BEV编码器（BEV Encoder）**：进一步对BEV特征进行编码，以提取更高级的语义信息。
4. **任务特定头（Task-specific Head）**：基于BEV特征进行3D目标检测，使用CenterPoint的检测头进行预测。

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
* 代码保存路径：/root/workspace/BEVDet-dev3.0
* 数据默认挂载路径：/mnt/dataset/autodrive
* 虚拟环境名：bevdet_h20

## 启动训练
* 在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置
* 若想获得最佳训练性能，建议将预置数据转储至PFS或CFS，转储方式见文末



### 2.1 一键启动训练
可以通过脚本，一键启动（单机or多机）快速训练。

```
# 设置数据路径，nuscenes数据默认路径/mnt/dataset/autodrive                    
export DATA_PATH=/mnt/dataset/autodrive
# 设置训练配置文件
export CONFIG=configs/bevdet/bevdet-r50.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径，默认/root/workspace/mmdetection3d/work_dir
export WORK_DIR=/root/workspace/BEVDet-dev3.0/work_dir

cd /root && source env.sh 

export PYTHONPATH=/root/workspace/BEVDet-dev3.0:$PYTHONPATH 
cd /root/workspace/BEVDet-dev3.0 && \
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
export CONFIG=configs/bevdet/bevdet-r50.py
# 设置训练使用gpu卡数，默认使用全部gpu
export GPUS=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader | wc -l)
# 设置训练结果保存路径，默认/root/workspace/mmdetection3d/work_dir
export WORK_DIR=/root/workspace/BEVDet-dev3.0/work_dir
```
#### **2.2.2. 激活模型运行虚拟环境**
```
cd /root && source env.sh 
```
#### **2.2.3.  启动模型训练**
```
export PYTHONPATH=/root/workspace/BEVDet-dev3.0:$PYTHONPATH 
cd /root/workspace/BEVDet-dev3.0 && \
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
3. 转储后，需要更改配置里的数据集变量DATA_PATH地址为/mnt/pfs/urvmsq/autodrive/文件夹

