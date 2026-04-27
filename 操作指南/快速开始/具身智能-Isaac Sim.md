
# 工具介绍

> NVIDIA Isaac Sim是基于NVIDIA Omniverse构建的机器人仿真平台。通过GPU加速物理引擎来实现精确仿真，并支持大规模、多传感器RTX渲染。集成数据生成、强化学习、ROS集成和数字孪生模拟等端到端工作流程。


![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_a758003.png)
NVIDIA Isaac Sim是基于NVIDIA Omniverse构建的机器人仿真平台，支持从URDF、MJCF和CAD等常见格式导入机器人系统。通过GPU加速物理引擎来实现精确仿真，并支持大规模、多传感器RTX渲染。集成数据生成、强化学习、ROS集成和数字孪生模拟等端到端工作流程。其优势包括：

* **资产导入&导出：**支持从非USD格式导入机器人和环境，或将其导出为非USD格式；
* **机器人微调：**优化机器人的物理精度、计算效率或真实感；
* **机器人仿真：**提供全流程运动控制工具链，如控制器、运动生成和运动学求解器以及策略集成接口；
* **传感器系统：**支持RTX和物理学传感器。

# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|建议8核及以上|按需|
|内存|建议64G及以上|按需|
|GPU|**Isaac Sim 4.5.0 :** A10 / A100 / A800 / H20 / H800 / L20 / 支持RT Core的GPU卡 ×1 <br/>**Isaac Sim 5.0.0 :**  L20/支持RT Core的GPU卡 ×1|按需|
|CDS|按需|按需|
|其它|无|无|

> Isaac Sim 5.0的仿真渲染依赖DLSS（超采样技术，Deep Learning Super Sampling），因此推荐使用支持RT Core的系列显卡。
> 
### 服务网卡配置
由于该工具的较多场景需要访问外网，可以通过设置服务网卡，并设置HTTPS网络代理支持。[服务网卡的配置参考](https://cloud.baidu.com/doc/VPC/s/Plztid5es#2-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%8D%A1)




# 使用说明
本文以纯python脚本形式启动两个任务为例，简单介绍Isaac Sim的使用。

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置。

## **创建与登录开发机**
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，打开Terminal界面：

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_83cb6b8.jpeg)

主要路径介绍

* Isaac Sim USD资产挂载路径：/mnt/bos/isaac-sim，该目录下存有Issac Sim预置的部分USD资产。





## 快速开始
### 立方体碰撞模拟
该任务主要模拟了不同属性的立方体，并逐步为其中一个视觉立方体添加物理属性（刚体属性）和碰撞属性的过程。

执行如下命令即可启动任务：

```
cd ~/workspace/quick_start
/isaac-sim/python.sh my_getting_started.py
```
> 相比standalone_examples/tutorials/getting_started.py，my_getting_started.py设置当前仿真环境为headless模式。


运行结果如下所示：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ad6cf3e.png)
### 2.2 机械臂&小车运控模拟
该任务主要模拟了机械臂和小车在同一环境下的运动控制。

执行如下命令即可启动任务：

```
cd ~/workspace/quick_start
/isaac-sim/python.sh my_getting_started_robot.py
```
> 相比standalone_examples/tutorials/getting_started_robot.py，my_getting_started_robot.py的改动主要在以下三个地方：
> 1. 设置当前仿真环境为headless模式；
> 2. 用USD挂载路径代替函数get_assets_root_path()，避免网络访问限制导致任务运行失败；
> 3. 用GroundPlane(prim_path="/World/GroundPlane", z_position=0)代替my_world.scene.add_default_ground_plane()，创建地面对象，避免网络访问限制导致任务运行失败。
> 


运行结果如下所示：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e731b18.png)



