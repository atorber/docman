为加速 BEV感知模型从研发到验证的闭环，Apollo 自动驾驶平台提供了一套**开箱即用**的工具链，涵盖**模型训练**（[Apollo-BEV-Train](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=3928100)） → **模型导出**（[Apollo-BEV-Model-Export](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=5599233)） → **模型验证**（[Apollo-Model-Deployment](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=9770074)）三大核心阶段。用户可按此顺序依次使用三个标准化环境，高效完成 BEV 模型的开发与评估。

# 介绍

近些年来，基于纯视觉+BEV的目标检测和占据栅格任务称为自动驾驶的研究热点。2022年提出的BEVFormer网络，使用环视图像作为输入，使用Transformer架构生成BEV特征，完成目标检测任务。占据栅格任务是一种通过预测三维栅格来表达真实世界的任务，如下图所示，栅格代表对应位置被占据，不同颜色代表不同的类别。占据栅格任务可以很好地处理自动驾驶中面临的异形障碍物问题，为此受到广泛的研究。

![b219e73d234ac6a981c7e696d8b7a26d.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/b219e73d234ac6a981c7e696d8b7a26d_b219e73.png)![107692d0ba05788eccc4ece745ac9b66.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/107692d0ba05788eccc4ece745ac9b66_107692d.png)

Apollo 11.0发布了纯视觉模型Apollo-vision-Net，具有如下的特性：
<br> 1. 【 更先进 】将视觉 bev 目标检测 + occ 占用网络的主流感知范式引入 Apollo 开源框架
<br> 2. 【 效果好 】在业界经典模型基础之上进行优化，各自的效果均超越业界经典模型效果。目标检测 mAP 较 bevformer（2022 ECCV）提升 6.74% ，occ miou较OccNet（2023 ICCV）提升 2.39%
<br> 3. 【 性能高 】模型共享backbone，多任务联合训练优化，在单个 jetson orin 平台上可达到 5hz 的推理帧率，在效果与性能上均取得1+1>2的效果

# Apollo-vision-Net 介绍
## 网络结构
Apollo-vision-Net的整体网络结构如下所示：
* 输入环视图像，经过image backbone提取图像特征
* Transformer encoder部分
    * 使用temporal self-attention融合当前帧bev queries和历史帧bev queries
    * 使用spatial cross-attention融合bev queries和图像特征
    * 经过6个encoder layer后输出bev queries

* detection head：将bev queries作为输入，使用groupdetr网络进行目标检测
* occ head：对bev queries进行上采样，随后扩充高度方向特征，最后使用linear层预测每个栅格类别信息


![f34a985674ec6a6c9d6c4261e90259ab.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/f34a985674ec6a6c9d6c4261e90259ab_f34a985.png)


我们对Apollo-vision-Net进行了如下优化，显著提升了目标检测、占据栅格的分数以及模型性能：
* image backbone：使用深度估计数据（Toyota DDAD15M）预训练的DLA-34替换ResNet-50，降低了模型复杂度同时提升了效果
* image neck：使用SecondFPN网络替换单尺度FPN网络，提升了模型整体效果
* detection head：使用GroupDETR替换DETR，在不增加耗时的前提下，显著提升目标检测效果
* occ head：在Transformer encoder部分使用低分辨率bev queries（50*50），在occ head部分再上采样至高分辨率（200*200），可大幅提升模型性能
* occ loss：将occ focal loss weight从1.0提升至10.0，引入affinity loss和lovasz-softmax loss，大幅提升occ检测效果

<br>

## 定量结果
在Nuscenes数据集上，Apollo-vision-Net目标检测mAP分数超越bevformer-tiny（2022 ECCV）6.74%，超越OccNet-R50（2023 ICCV）2.39%

| | 目标检测mAP （val dataset） | 占据栅格miou (OpenOcc val dataset) |
| :--- | :---: | :---: |
| bevformer-tiny （2022 ECCV） | 25.2% | - |
| OccNet-R50 （2023 ICCV） | - | 19.48% |
| Apollo-vision-Net (ours) | 31.94% （↑ 6.74） | 21.87% （↑ 2.39） |


<br>

## 定性结果
### Nuscenes数据集结果


<table>
    <tr>
        <!-- 跨3列的表头 -->
        <th colspan="3" align="center">图像</th>
        <th align="center">目标检测结果</th>
        <th align="center">occ结果</th>
    </tr>
    <tr>
        <!-- 第一行的3张小图 -->
        <td><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/35cf9dd14634a91834a964cfa9c5bdb2_35cf9dd.png" width="150" alt="">
        <td><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/88f1ce7e1931cae4fc139c99a4c68718_88f1ce7.png" width="150" alt=""></td>
        <td><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/4cd5b772937a9719b08d489c223f2895_4cd5b77.png" width="150" alt=""></td>
        <!-- 跨2行的检测结果图 -->
        <td rowspan="2" align="center"><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/fde58122a93a4b85513f70d4e95f2ecb_fde5812.png" width="200" alt="检测结果"></td>
        <!-- 跨2行的OCC结果图 -->
        <td rowspan="2" align="center"><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/78ddff6e5999ba9a6397146e11de6c48_78ddff6.png" width="200" alt="OCC结果"></td>
    </tr>
    <tr>
        <!-- 第二行的3张小图，因为右边跨行了，这里不需要写右边的td -->
        <td><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/625e32519ea0d839cd78788b43a473e7_625e325.png" width="150" alt="图4"></td>
        <td><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/daf3ee0837a426303bd74ec0d2baed41_daf3ee0.png" width="150" alt="图5"></td>
        <td><img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/150d28585a57c05c39d78a71d12051ae_150d285.png" width="150" alt="图6"></td>
    </tr>
</table>

<br>

### 百度自动驾驶数据集结果
为了进一步验证效果，我们使用百度自动驾驶数据对Apollo-vision-Net进行训练，同时对occ的分辨率进行提升（0.5m*0.5m*0.5m->0.2m*0.2m*0.2m）可以看到Apollo-vision-Net可以提供复杂城市道路场景下的准确目标检测和occ检测。
<br>

# 部署环境要求&最佳实践建议

| | 部署要求 | 最佳实践 |
| :--- | :--- | :--- |
| **CPU** | 按需 | 建议按表单默认值及以上 |
| **内存** | 按需 | 建议按表单默认值及以上 |
| **GPU** | 24G以上显存 | 建议24G以上显存 |
| **CDS** | 按需 | 按需 |

<br>

## 模型训练使用说明
### 创建与登录开发机
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，并打开VScode中的terminal
![d77c535f2d7c3a5ddcfef85a593ea4ee.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/d77c535f2d7c3a5ddcfef85a593ea4ee_d77c535.png)
<br>

* 代码保存路径：/root/Apollo-Vision-Net
* 数据默认挂载路径：/mnt/dataset/nuscenes_data

## 数据集处理
### 存储挂载配置
默认在bos挂载`nuscenes`数据集

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_59003a9.png)

1. 挂载PFS或CFS

在创建或更新开发机时，在存储挂载配置中选择集群对应的 PFS 或 CFS 存储，并设置自定义挂载路径（示例路径：`/mnt/pfs/nuscenes_data`）可以在创建或者更新开发机配置时，选择存储挂载，选择集群对应的PFS或者CFS，可自定义挂载路径
![image \(1\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%281%29_1bbe09b.png)
### 数据集迁移
创建数据集目录结构
```bash
cd /mnt/pfs/nuscenes_data
mkdir -p bev_data/nuscenes
```
从bos上迁移数据集至PFS文件
```bash
cp -rv  bos挂载路径/apollo_nuscenes_bev_data/nuscenes/*  /mnt/pfs/nuscenes_data/bev_data/nuscenes/
cp -rv  bos挂载路径/apollo_nuscenes_bev_data/can_bus/*  /mnt/pfs/nuscenes_data/bev_data/
cp -rv  bos挂载路径/apollo_nuscenes_bev_data/occ_gt_release_v1_0/* /mnt/pfs/nuscenes_data/bev_data/
```

<br>

### 数据集解压与整理
NuScenes 数据集处理
```bash
cd /mnt/pfs/nuscenes_data/bev_data/nuscenes
#运行指令解压数据集，也可以开多个终端依次解压数据集
bash tar_files.sh 
```

nuscenes数据集解压后目录结构：
```bash
/mnt/pfs/nuscenes_data/bev_data# tree nuscenes/ -L 1
nuscenes/
├── maps //地图
├── samples //数据集
├── sweeps //数据集
├── v1.0-trainval//数据集
├── tar_files.sh //解压指令
├── nuscenes_infos_temporal_train_occ_gt.pkl //目标检测和occupancy的pkl文件
├── nuscenes_infos_temporal_val_occ_gt.pkl   //目标检测和occupancy的pkl文件
├── maps.tar.gz //地图压缩包
├── v1.0-trainval01_blobs.tgz //数据集压缩包
├── v1.0-trainval02_blobs.tgz //数据集压缩包
├── v1.0-trainval03_blobs.tgz //数据集压缩包
├── v1.0-trainval04_blobs.tgz //数据集压缩包
├── v1.0-trainval05_blobs.tgz //数据集压缩包
├── v1.0-trainval06_blobs.tgz //数据集压缩包
├── v1.0-trainval07_blobs.tgz //数据集压缩包
├── v1.0-trainval08_blobs.tgz //数据集压缩包
├── v1.0-trainval09_blobs.tgz //数据集压缩包
└── v1.0-trainval10_blobs.tgz //数据集压缩包
```
occ_gt_release_v1_0数据集处理：
<br>解压occ_gt_release_v1_0压缩包
```bash
cd /mnt/pfs/nuscenes_data/bev_data
tar -zxvf occ_gt_release_v1_0.tar.gz
```
解压后
```bash
occ_gt_release_v1_0
├── occ_gt_train.json
├── occ_gt_val.json
├── train
└── val
```
复制目标检测和occupancy的pkl文件到occ_gt_release_v1_0
```bash
cp /mnt/pfs/nuscenes_data/bev_data/nuscenes/*.pkl /mnt/pfs/nuscenes_data/bev_data/occ_gt_release_v1_0/
```
最终目录结构
```bash
/mnt/pfs/nuscenes_data/bev_data# tree occ_gt_release_v1_0 -L 1
occ_gt_release_v1_0
├── nuscenes_infos_temporal_train_occ_gt.pkl
├── nuscenes_infos_temporal_val_occ_gt.pkl
├── occ_gt_train.json
├── occ_gt_val.json
├── train
└── val
```
 CAN-Bus 数据处理
 ```bah
cd /mnt/pfs/nuscenes_data/bev_data
tar -zxvf can_bus.tar.gz
```
<br>

### 数据集结构规范
```bash
├── data/
│   ├── can_bus/
│   ├── nuscenes/
│   │   ├── maps/
│   │   ├── samples/
│   │   ├── sweeps/
│   │   ├── v1.0-test
│   │   ├── v1.0-trainval
│   │   ├── nuscenes_infos_temporal_train.pkl
│   │   ├── nuscenes_infos_temporal_val.pkl
│   ├── occ_gt_release_v1_0/
│   │   ├── train/
│   │   ├── val/
│   │   ├── occ_gt_train.json
│   │   ├── occ_gt_val.json
│   │   ├── nuscenes_infos_temporal_train_occ_gt.pkl
│   │   ├── nuscenes_infos_temporal_val_occ_gt.pkl
```

### 数据集挂载
开发机内数据集挂载：
```bash
cd ~/Apollo-Vision-Net/data

# 创建符号链接（注意使用正确的 -s 参数）
ln -s /mnt/pfs/nuscenes_data/bev_data/nuscenes nuscenes
ln -s /mnt/pfs/nuscenes_data/bev_data/occ_gt_release_v1_0 occ_gt_release_v1_0
ln -s /mnt/pfs/nuscenes_data/bev_data/can_bus can_bus
```
### 最终项目结构：
```bash
~/Apollo-Vision-Net/data/
├── can_bus -> /mnt/pfs/nuscenes_data/bev_data/can_bus
├── nuscenes -> /mnt/pfs/nuscenes_data/bev_data/nuscenes
└── occ_gt_release_v1_0 -> /mnt/pfs/nuscenes_data/bev_data/occ_gt_release_v1_0
```
### 训练模型
```bash
# 进入工作目录
cd ~/Apollo-Vision-Net/
# 训练模型
./tools/dist_train.sh \                                      # 训练脚本
  ./projects/configs/bevformer/bev_tiny_det_occ_apollo.py \  # 模型配置文件路径
  8                                                          # 使用8个GPU进行分布式训练
  ```
训练暂停后继续训练指令
```bash
# 进入工作目录
cd ~/Apollo-Vision-Net/

# 训练模型
./tools/dist_train.sh \                                       # 训练脚本
  ./projects/configs/bevformer/bev_tiny_det_occ_apollo.py \   # 模型配置文件路径
  8 \                                                         # 使用8个GPU进行分布式训练
  --resume-from work_dirs/bev_tiny_det_occ_apollo/epoch_4.pth # 从第4epoch的检查点恢复训练
```
### 模型评测
```bash
# 进入工作目录
cd ~/Apollo-Vision-Net/

# 启动评测脚本
./tools/dist_test.sh \
  ./projects/configs/bevformer/bev_tiny_det_occ_apollo.py \  # 模型配置文件路径
  work_dirs/bev_tiny_det_occ_apollo/epoch_4.pth \          # 训练好的模型权重文件
  4                                                        # 使用*个GPU进行分布式测试
```
**将训练得到的 .pth 模型文件在模型导出所使用的开发机上执行模型导出功能，将该.pth文件转换为符合 Apollo 要求的 ONNX 模型文件，以用于后续apollo系统部署验证模型效果。**

# 附：Apollo 11.0 BEV+OCC 模型训练使用

| 流程 | 使用方式 | 备注 |
| :--- | :--- | :--- |
| Apollo-BEV-Train | 百舸平台 | 训练 Apollo BEV+OCC模型 |
| Apollo-BEV-Model-Export | 百舸平台 | 将训练好的BEV+OCC模型导出成onnx文件 |
| Apollo-Model-Deployment | 百舸平台或本地验证 | apollo环境镜像，验证bev模型效果以及仿真等apollo工具 |

