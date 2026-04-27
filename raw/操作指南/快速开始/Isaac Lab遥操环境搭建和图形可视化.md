## 案例介绍

本文以 Isaac lab 2.1.0 版本为例，指导客户如何搭建遥操系统采集数据以及图形的可视化

Isaac Lab提供了SE(2)和SE(3)空间的命令接口用于机器人控制：

- SE(2) teleoperation: 返回线性x-y速度和偏航角速度
- SE(3) teleoperation: 返回6维向量表示姿态变化
- 注意: 目前Isaac Lab Mimic仅在Linux上支持。



## 部署环境要求&最佳实践建议

|      | 部署要求                                  | 最佳实践 |
| ---- | ----------------------------------------- | -------- |
| CPU  | 建议8核及以上                             | 按需     |
| 内存 | 建议64G及以上                             | 按需     |
| GPU  | L20等 支持RT Core的NVIDIA GPU卡 1卡及以上 | 按需     |
| CDS  | 按需                                      | 按需     |
| 其它 | 无                                        | 无       |

**使用需知：**

1. 由于该工具的较多场景需要访问外网，可以通过设置服务网卡，并设置HTTPS网络代理支持访问。[服务网卡的配置参考](https://cloud.baidu.com/doc/VPC/s/Plztid5es#2-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%8D%A1)
2. 建议在距离您最近的地域创建开发机实例使用当前方案。如果远程桌面不流畅，建议配置 RDP 比特率为16位



## 使用说明

### 1. 创建与登录开发机

#### 1.1 创建开发机实例

![image-20251212155635888.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20251212155635888_1ed756b.png)

点击在开发机中打开，创建开发机，主要配置如下：

* 资源配置：
  * GPU选择： 建议使用 NVIDIA L20
  * CPU/内存：推荐8核64G及以上，保证运行所需的基础资源配置
* 启动自定义端口，选择支持**公网访问**的BLB（建议选择网络带宽≥50Mbps的BLB，带宽越大越好，越少共享复用越好）
* 新增访问端口：
  * 服务名称：rdp
  * 开发机容器监听端口：3389
  * BLB监听端口：随机分配即可

#### 1.2 登录开发机

填写完表单，提交后，在开发机列表可见创建的开发机，等待资源调度并部署成功后，点击登录，即可进入开发机webIDE

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e43f67f.png)

### 2. 配置访问远程桌面

登录开发机，进入开发机webIDE，打开Terminal界面

#### 2.1 设置RDP远程桌面登陆的账号密码

使用`chpasswd`工具设置RDP远程桌面登陆的账号密码

```
echo "root:xrdp-aihc" | chpasswd
```

其中，

- `root`：为设置用户名。
- `xrdp-aihc`：为登陆密码，请替换为你的密码。
- `chpasswd`：Linux 系统中一个用于**批量设置或者更新用户密码**的实用命令行工具，支持从标准输入或指定的文件中读取用户名和密码的组合，然后自动完成密码修改

#### 2.2 启动RDP服务

启动 RDP 服务

```
/usr/bin/supervisord -c /etc/supervisor/conf.d/xrdp.conf
```



#### 2.3 通过桌面客户端访问

在本地电脑或者需要连接开发机Isaac SIm环境的电脑，安装Windows App。以Mac为例，从app store安装

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d29790b.png)

本次安装后，

1. 在Windows APP 中依次点击右上角的***\*加号\**** 和 ***\*添加电脑\**** 菜单，新建远程连接
2. 将从开发机复制的 RDP 的公网地址加端口（公网地址可从开发机详情页的自定义端口配置区域获取）输入到访问地址栏![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_b3f9a8b.png)![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bb0bc46.png)
3. 输入2.1步骤中中设置的用户名和密码
4. 登陆远程桌面

5. 如果您的远程桌面在运行过程中出现卡顿现象，建议您降低远程连接的分辨率和颜色质量

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_422514b.png)

### 3. 案例演示

登录到远程桌面，打开远程桌面的命令行工具

![image-20251209160753724.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20251209160753724_bec39a6.png)

#### 3.1 使用键盘进行遥操

以Isaac-Stack-Cube-Franka-IK-Rel-v0为例，建议启动前建议设置HTTP和HTTPS网络代理。

```
 mkdir -p datasets
 
 #可通过 ./isaaclab.sh -p scripts/environments/list_envs.py 查看环境列表,根据需要切换环境
 
 #使用键盘操作启动 Isaac-Stack-Cube-Franka-IK-Rel-v0 任务
 ./isaaclab.sh -p scripts/tools/record_demos.py \
     --task Isaac-Stack-Cube-Franka-IK-Rel-v0 \
     --teleop_device keyboard \
     --dataset_file ./datasets/dataset.hdf5 \
     --num_demos 10
```

- 参数详解
  - 必需参数
    - --task TASK: 指定要运行的任务环境名称（如Isaac-Stack-Cube-Franka-IK-Rel-v0）
  - 可选参数
    - --teleop_device TELEOP_DEVICE: 指定遥操作设备类型（keyboard, spacemouse, handtracking等）
    - --dataset_file DATASET_FILE: 指定保存演示数据的文件路径（HDF5格式）
    - --step_hz STEP_HZ: 控制演示收集的频率（每秒步数）
    - --num_demos NUM_DEMOS: 指定要收集的演示episode数量
    - --num_success_steps NUM_SUCCESS_STEPS: 指定成功episode所需的最小步数
    - --enable_pinocchio: 启用Pinocchio动力学库

- 操作指南

  - SE(3) 键盘控制器：Se3Keyboard
    - 重置所有指令：R
    - 切换夹爪（打开/关闭）：K
    - 沿x轴移动机械臂：W/S
    - 沿y轴移动机械臂：A/D
    - 沿z轴移动机械臂：Q/E
    - 绕x轴旋转机械臂：Z/X
    - 绕y轴旋转机械臂：T/G
    - 绕z轴旋转机械臂：C/V

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f660214.png)

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e08a16f.png)

验证回放数据

```
./isaaclab.sh -p scripts/tools/replay_demos.py \
     --task Isaac-Stack-Cube-Franka-IK-Rel-v0 \
     --dataset_file ./datasets/dataset.hdf5
```

![huifang.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/huifang_2ac11d8.gif)

﻿

#### 3.2 使用空间鼠标进行遥操

以Isaac-Stack-Cube-Franka-IK-Rel-v0为例，建议启动前建议设置HTTP和HTTPS网络代理。

```
 #使用SpaceMouse(空间鼠标)操作 启动 Isaac-Stack-Cube-Franka-IK-Rel-v0 任务
 ./isaaclab.sh -p scripts/tools/record_demos.py \
     --task Isaac-Stack-Cube-Franka-IK-Rel-v0 \
     --teleop_device spacemouse \
     --dataset_file ./datasets/dataset.hdf5 \
     --num_demos 10
```

- 操作指南
  - SE(3) SpaceMouse 控制器：Se3SpaceMouse
    - 重置所有指令：右键单击
    - 切换夹爪（打开/关闭）：单击 SpaceMouse 左键
    - 沿 x/y 轴移动机械臂：倾斜 SpaceMouse
    - 沿 z 轴移动机械臂：推或拉 SpaceMouse
    - 旋转机械臂：扭转 SpaceMouse





同时，Isaac lab 可通过Apple Vision Pro 遥操收集数据，具体请参考：https://isaac-sim.github.io/IsaacLab/main/source/overview/imitation-learning/teleop_imitation.html





