

# 工具介绍

> LeRobot 是 Hugging Face 推出的、基于 PyTorch的开源具身智能学习框架。目前「快速开始」主要支持数据集格式转换功能，支持将HDF5、RLDS等多种格式的数据集转换为LeRobotDataset格式。


它的主要特征在于：

1. **多模态算法集成。**融合模仿学习、强化学习及 Transformer 架构，支持机器人通过视觉等多模态数据学习操作逻辑（如模仿人类抓取、自主强化试错）。
2. **全流程开发工具链**
    1. **预训练模型**：提供开箱即用的机器人控制模型，降低开发门槛；
    2. **数据集与模拟器**：内置多传感器时序数据集，兼容 Gazebo 等仿真环境，支持虚拟调试与算法迭代；
    3. **硬件兼容性**：模块化设计适配机械臂、人形机器人等硬件，开源硬件文档助力系统搭建。

3. **具身智能典型场景。**专注物体操作（如抓取、传递、堆叠）与空间导航，在 AlohaTransferCube（物体传输）、PushT（物体操纵）等任务中实现高效交互控制。

# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|8核|建议按表单默认值及以上|
|内存|32GB|建议按表单默认值及以上|
|GPU|目前数据转换功能无GPU要求|目前数据转换功能无GPU要求|
|CDS|按需|按需|
|其它|无|无|





# 使用说明
本文以 amandlek/mimicgen_datasets/robot/square_d1_iiwa.hdf5 的数据转换为例，介绍LeRobot数据转换功能的使用过程

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置

## **创建与登录开发机**
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，并打开VScode中的terminal 。

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6a2252a.jpeg)




## 启动数据转换脚本
以转换[amandlek/mimicgen_datasets](https://huggingface.co/datasets/amandlek/mimicgen_datasets)下的mimicgen/robot/square_d0_iiwa.hdf5为例：

* 转换脚本路径：lerobot/quick_start/data_convert.py，以下为脚本中引用的文件
    * 源数据集路径src_root：/mnt/dataset/mimicgen/robot
    * 源数据集文件h5_f：square_d0_iiwa.hdf5
    * 目标数据集路径tgt_path：/root/workspace/lerobot/quick_start/output/




**在terminal中执行数据转换脚本**

```
cd /root/workspace/lerobot/quick_start/
python data_convert.py
```
脚本执行完成即可查看转换结果



**温馨提醒**

1. 脚本data_convert.py中有详细的注释以帮助理解，实际业务可以根据自己的需要进行更改
2. 每次脚本启动在linux命令和脚本data_convert.py内都会默认重置清空目标文件夹下的历史数据，实际业务请根据需要调整





##  查看转换结果
在转换输出路径/root/workspace/lerobot/quick_start/output/{TIMESTAMP}/下，可以看到：

* data：转换后数据
* meta：转换元信息

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ac88cb9.jpeg)


