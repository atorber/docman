## 案例介绍

> NVIDIA Isaac Sim是基于NVIDIA Omniverse构建的机器人仿真平台，本文是在开发机上基于isaac sim实现可视化能力的实践教程


![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_a758003.png)
NVIDIA Isaac Sim是基于NVIDIA Omniverse构建的机器人仿真平台，支持从URDF、MJCF和CAD等常见格式导入机器人系统。通过GPU加速物理引擎来实现精确仿真，并支持大规模、多传感器RTX渲染。集成数据生成、强化学习、ROS集成和数字孪生模拟等端到端工作流程。其优势包括：

* **资产导入&导出：**支持从非USD格式导入机器人和环境，或将其导出为非USD格式；
* **机器人微调：**优化机器人的物理精度、计算效率或真实感；
* **机器人仿真：**提供全流程运动控制工具链，如控制器、运动生成和运动学求解器以及策略集成接口；
* **传感器系统：**支持RTX和物理学传感器。



**官方地址**：

[https://docs.isaacsim.omniverse.nvidia.com/4.5.0/index.html](https://docs.isaacsim.omniverse.nvidia.com/4.5.0/index.html)



## 部署方案

目前百舸平台提供了两种Isaac sim可视化的方案：

- 基于 RDP 远程桌面的部署方式：支持密码鉴权，通用性较高。
- NV 官方 [ webviewer可视化方案](https://github.com/NVIDIA-Omniverse/web-viewer-sample?tab=readme-ov-file#prerequisites)：基于 WebRTC协议，性能较好，不支持鉴权（推荐配合云的安全组使用）

选型建议：如果仅使用 Isaac sim 软件，推荐 webviewer 方式，性能较好；如果还有一些其他可视化操作的需求，可以使用 RDP 方式；也可以组合使用，如用户通过 webviewer 的方式使用 Isaac sim，也可以再启动 RDP桌面 进行一些其他可视化的操作

> - 不推荐使用两种方式同时启动 Isaac sim
> - webview 方式仅支持 Isaac sim 5.0 版本，不支持 4.5 版本



## 部署环境要求

|      | 部署要求                                               | 最佳实践 |
| ---- | ------------------------------------------------------ | -------- |
| CPU  | 建议8核及以上                                          | 按需     |
| 内存 | 建议64G及以上                                          | 按需     |
| GPU  | Isaac Sim :  L20等 支持RT Core的NVIDIA GPU卡 1卡及以上 | 按需     |
| CDS  | 按需                                                   | 按需     |
| 其它 | 无                                                     | 无       |

**使用需知：**

1. Isaac Sim 的仿真渲染依赖DLSS（超采样技术，Deep Learning Super Sampling），因此推荐使用GeForce RTX系列显卡
2. 本案例使用L20等Ada Lovelace架构三代RT Core的显卡，且使用的BLB网络带宽为50Mbps时，无噪点，无卡顿，表现更为符合期望
3. isacc官方要求，显卡驱动版本需要高于535.129  ，如果Ubuntu版本>=22.04.5 kernel 6.8.0-48-generic，则驱动至少要求在535.216.01以上
4. 535驱动版本中（550无此问题），含535.255及以上的驱动版本，存在一个已知的显卡驱动判断错误，需要添加--/rtx/verifyDriverVersion/enabled=false参数，跳过显卡驱动判断（操作方式见后续步骤）
5. 官方未对cuda和cudnn有限制，不同的cuda版本和cudnn版本是否对可视化界面的表现有影响未验证
6. 由于该工具的较多场景需要访问外网，可以通过设置服务网卡，并设置HTTPS网络代理支持访问。[服务网卡的配置参考](https://cloud.baidu.com/doc/VPC/s/Plztid5es#2-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%8D%A1)
7. 建议在距离您最近的地域创建开发机实例使用当前方案。如果远程桌面不流畅，建议配置 RDP 比特率为16位



## 使用说明

本文会先介绍如何【启动可视化客户端】，然后以【执行官方四足和人形可操作演示】、【宇树GR1机器人简易操作演示】两个例子，简单介绍Isaac Sim的使用。

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置

### 1. 创建与登录开发机

#### 1.1 从快速开始创建一个【Isaac Sim可视化】开发机实例

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_b6d010f.png)

点击在开发机中打开，创建开发机，主要配置如下：

- 基本信息
  - 版本选择：支持 Isaac Sim 5.0 和 4.5 版本

* 资源配置：

  * GPU选择： 建议使用 NVIDIA L20
  * CPU/内存：推荐8核64G及以上，保证运行所需的基础资源配置

* 启动自定义端口，选择支持**公网访问**的BLB（建议选择网络带宽≥50Mbps的BLB，带宽越大越好，越少共享复用越好）

* 新增访问端口，具体如下:

  | 服务名称      | 开发机监听端口                       | BLB 监听端口                           | 传输协议 | 用途                                                         |
  | ------------- | ------------------------------------ | -------------------------------------- | -------- | :----------------------------------------------------------- |
  | rdp           | 3389（固定）                         | 随机分配即可                           | TCP      | RDP 启动必需                                                 |
  | streaming-udp | 随机分配，需要与**BLB 监听端口**一致 | 随机分配，需要与**开发机监听端口**一致 | UDP      | 需要保证**开发机监听端口**和**BLB 监听端口**一致，随机分配即可<br/>webviewer必需 |
  | streaming-tcp | 49100（固定）                        | 随机分配即可                           | TCP      | webviewer 必需                                               |
  | webviewver    | 8080（固定）                         | 随机分配即可                           | TCP      | webviewer 必需                                               |



> Isaac sim  4.5 版本仅支持 RDP 的方式启动，不支持 Webviewer 方式，无需设置streaming-udp、streaming-tcp、webviewver服务

#### 1.2 登录开发机

填写完表单，提交后，在开发机列表可见创建的开发机，等待资源调度并部署成功后，点击登录，即可进入开发机webIDE

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e43f67f.png)

主要路径介绍

* Isaac Sim USD资产挂载路径：/mnt/bos/isaac-sim，该目录下存有Isaac Sim预置的部分USD资产。

#### 1.3 验证GPU硬件和显卡驱动版本

根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，打开Terminal界面：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_60c29e3.png)
在打开的Terminal界面内输入以下命令，确认NVIDIA的GPU硬件和显卡驱动版本

```bash
nvidia-smi
```


执行结果查看，红圈中是显卡驱动版本和GPU硬件型号

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_2591f3a.png)

**请参考我们下面提出的建议，选择驱动版本**

1. isacc官方要求，显卡驱动版本需要高于535.129  ，如果Ubuntu版本>=22.04.5 kernel 6.8.0-48-generic，则驱动至少要求在535.216.01以上
2. 535驱动版本中（550无此问题），含535.255及以上的驱动版本，存在一个已知的显卡驱动判断错误，需要添加--/rtx/verifyDriverVersion/enabled=false参数，跳过显卡驱动判断（操作方式见后续步骤）
3. 官方未对cuda和cudnn有限制，不同的cuda版本和cudnn版本是否对可视化界面的表现有影响未验证

**如显卡驱动不符合建议，建议联系售后支持同学重装节点驱动**



### 2. 通过 RDP 方式配置访问Isaac Sim环境

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
在本地电脑或者需要连接开发机Isaac SIm环境的电脑。

##### 2.3.1 MAC/Windows远程桌面

从app store安装Windows App。

![img](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b281493e5ab24a46b84e7af117447e69&docGuid=BBnuRt41crykTy&sign=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiYXBwSWQiOjEsInVpZCI6IjZsaHJiWEIzUjUiLCJkb2NJZCI6IkJCbnVSdDQxY3J5a1R5In0..Vd-GOwku5my7KWoh.pEEOnb_KLgdDTwebYrvqVRvsQgPqKC0YiUmAhM7AJzuIMrzGwMgwcsLSfwVXddBy-ag6BQ0w-W0hGPVpLsNrM2MFkQdcgpgEFcKtHSfc0vOx9_gncdawMTJt8oMNCsxCHqGjOP_4Z_iGVJMLatcbEBuDeYB4Waw9i4Cf3s6rcmAAnUVAsSEAm5ahTdBPr2TL8iI2ZrdhGs14CwZrDHzv1lJIwQ.PM2oLSfhvkGEeujaRH0SDg)

本次安装后，

1. 在Windows APP 中依次点击右上角的***\*加号\**** 和 ***\*添加电脑\**** 菜单，新建远程连接
2. 将从开发机复制的 RDP 的公网地址加端口（公网地址可从开发机详情页的自定义端口配置区域获取）输入到访问地址栏![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_b3f9a8b.png)![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bb0bc46.png)
3. 输入2.1步骤中中设置的用户名和密码
4. 登陆远程桌面

##### 2.3.2 Linux远程桌面

1. 安装FreeRDP：
```
 apt update && apt install -y freerdp2-x11
```
2. 启动FreeRDP连接服务：
```
#启动xfreerdp 用户名和密码为2.1设置RDP远程桌面登陆的账号密码中设置的用户名和密码
xfreerdp /v:<IP>:3386 /u:root /p:密码
```
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_dfe77e1.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6293b39.png)

3. 启动后可以看到远程桌面，可能需要输入密码，输入的密码使用在2.1设置RDP远程桌面登陆的账号密码中设置的密码即可登录。

#### 2.4 启动isaac-sim

在上面已经打开的RDP界面中，执行如下操作，从命令行启动isaac-sim客户端IsaacSim可视化界面：

![image-20251209160753724.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20251209160753724_bec39a6.png)

![image-20251209160922299.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20251209160922299_2623c49.png)




可视化界面为先出现窗口边框，加载过程结束后再出现窗口内容，创建开发机第一次加载可能会需要几分钟(下载一些服务依赖)，之后再启动一般需要十秒左右。另外，IsaacSim在初始化和使用过程中可能会访问外网，**建议设置HTTP和HTTPS网络代理**

```
# 先设置网络代理，再启动isaac-sim服务
/isaac-sim/isaac-sim.sh --allow-root
```


请使用nvidia-smi命令查看显卡驱动版本，如显卡驱动版本为535.261.03则建议使用

```
# 先设置网络代理，再启动isaac-sim服务
/isaac-sim/isaac-sim.sh --allow-root --/rtx/verifyDriverVersion/enabled=false
```

启动结果：

命令行出现红框内字样，说明启动成功

![image-20251209161237024.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20251209161237024_46db693.png)


![image-20251209161301589.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20251209161301589_758ae49.png)

如果您的远程桌面在运行过程中出现卡顿现象，建议您降低远程连接的分辨率和颜色质量

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_422514b.png)



### 3. 通过 webviewer 方式配置访问Isaac Sim环境

登录开发机，进入开发机webIDE，打开Terminal界面

#### 3.1 启动webviewer和isaac sim streaming

- 启动webviewer服务

```
# --out-streaming-ip 当前开发机的外网IP地址
# --inner-streaming-port 开发机webviewer-tcp端口的【开发机容器监听端口】字段
# --out-webrtc-tcp-port 开发机streaming-tcp端口的【BLB监听端口】字段
~/start_webviewer.sh --out-streaming-ip <IP地址> --inner-webviewer-port <开发机容器监听端口> --out-streaming-tcp-port <BLB监听端口>
# 使用下面的命令可关闭webviewer服务
~/stop_webviewer.sh
```

- 启动isaac sim streaming服务端，并查看日志确认完全启动

```
# --out-streaming-ip 当前开发机的外网IP地址
# --streaming-udp-port 开发机streaming-udp端口的【开发机容器监听端口】和【BLB监听端口】字段
# --assets-root 开发机以bos方式加入的Assets文件夹，isaac sim 5.0可直接使用【/mnt/bos/isaac-sim/Assets/Isaac/5.0】这个值
~/start_isaac_streaming.sh --out-streaming-ip <IP地址> --streaming-udp-port <端口号> [可选： --assets-root /mnt/bos/isaac-sim/Assets/Isaac/5.0]
# 使用下面的命令可关闭isaac sim的streaming服务
# ~/stop_isaac_streaming.sh
# 持续查看日志，直到确认完全启动，完全启动判定见下图
tail -f /root/isaac-sim.streaming.log
```

确认完全启动方式： 看到日志中出现这个字样

![image-20251219115911911.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20251219115911911_75b0734.png)

**注意**： 每次启动isaac sim的streaming服务，只能连接一个客户端（每个使用webviewer登录的都会被视为一个客户端），如果前面的人没有关闭客户端，后面访问会出现空白页面。可以通过可重启streaming服务强制访问（注意，这会杀死当前正在进行的未保存工作）

重启streaming服务： 使用~/stop_isaac_streaming.sh关闭，再用~/start_isaac_streaming.sh启动（webviewer不需要重启）

#### 3.2 使用webviewer连接Isaac Sim streaming服务

1. 在开发机详情页中找到webviewer-port端口，复制【外网访问指令】，内容应是【IP:端口】

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c9d44a3.png)

2. 在chrome浏览器打开，出现下面的选择界面，选择下面的【UI for ***\*any\**** streaming app】选项，再点击Next

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_5f83733.png)

3. 由于 webviewer 的方式不支持密码鉴权，推荐配置 LB 的安全组来控制来源 IP 范围，避免服务泄露。您可以在开发机详情找到开发机使用的 BLB，跳转到BLB 页面配置安全组信息。请参考：[BLB 支持安全组](https://cloud.baidu.com/doc/BLB/s/3kgug1oeb#blb%E6%94%AF%E6%8C%81%E5%AE%89%E5%85%A8%E7%BB%84)



### 4. 案例演示

以 RDP 启动 Isaac sim 为例：

#### 4.1 执行官方四足和人形可操作演示

##### 4.1.1 步骤一：开启机器人案例选项卡

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_772046e.png)

##### 4.1.2 步骤二：加载Humanoid人形机器人案例

点击Load按钮加载，Reset按钮重置案例（或选择右侧的Quadruped四足机器人案例，也是点击Load按钮加载，Reset按钮重置案例）

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9106e91.png)
一般来说，对一个模型或者脚本点击Load按钮，客户端窗口会停止响应一些时间进行网络加载

但在开发机刚新建时，这里的加载时间过长，也有几率是客户端卡死

如果客户端卡死，则可以点击右上角的x关闭客户端后，在命令行再次执行命令启动，一般一到两次之后，一旦有一次Load成功，之后客户端就不会再卡死

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_7cfb8f8.png)

##### 4.1.3 步骤三：操作机器人

窗口缩放操作：

* 在窗口内使用鼠标滚轮

Humanoid人形机器人操作：

* 前进：向上箭头/数字键 8
* 左转：左箭头/数字 4
* 右转：右箭头/数字 6

Quadruped四足机器人操作：

* 前进：向上箭头/数字键 8
* 后退：后退箭头/数字 2
* 向左移动：左箭头/数字 4
* 向右移动：右箭头/数字键 6
* 左转：N / NUM 7
* 右转：M / NUM 9

##### 4.1.4 运行效果图片&视频

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d7c2294.png)

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e4c3867.png)

#### 4.2 宇树GR1机器人简易操作演示

##### 4.2.1 步骤一： 在Assets中找到GR1机器人，并加载到工作空间中

操作步骤：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_42a8035.png)

操作结果：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9aef452.png)

##### 4.2.2 步骤二： 使用Physics Inspector工具，对关节进行简易操作

操作步骤：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_b987ca1.png)

额外步骤：

如果按照上面操作后，Physics Inspector显示成下面的样子，则需要点击一下【Re-Enable authoring】按钮，就会显示关节角度界面

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d089462.png)
操作结果图片&视频：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_fb2c578.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_093946f.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_76f22de.png)

#### 4.3 Replicator 数据生成

Replicator，是一种用于生成具身智能训练数据的框架
这个框架可使用数据资产，根据要求，生成不同场景、不同情况、随机化的大量训练数据（生成结果可包含场景图片 + 精准标注）
**数据资产**可使用多种开源标准，例如通用场景描述(USD)、PhysX、材质定义语言(MDL)
基于官方公开的示例，其大致工作流程为：


| 步骤            | 内容                                                         |
| --------------- | ------------------------------------------------------------ |
| 1. 定义场景     | 基于USD构建或加载一个3D场景                                  |
| 2. 配置生成规则 | 设置相机、灯光、随机化参数（如物体、纹理、位置的随机范围）   |
| 3. 执行与记录   | 运行脚本，Replicator会自动在场景中采样大量随机状态，驱动渲染引擎和标注器，生成成对的图像和标注文件 |
| 4. 输出         | 结果以标准格式（如RGB图像、边界框JSON等）保存，可直接用于主流的AI训练框架（如PyTorch, TensorFlow） |

下面我们将展示几个官方的例子
这两个示例均是 Isaac Sim官网示例，两个示例各有侧重，从不同方面示范了如何使用Replicator插件

##### 示例1：物品数据集合成 

官方链接：[Object Based Synthetic Dataset Generation](https://docs.robotsfan.com/isaacsim/4.5.0/replicator_tutorials/tutorial_replicator_object_based_sdg.html)

这是一个使用 Isaac Sim 和 Replicator 生成以物体为中心的合成数据集的示例，该脚本会在一个预定义的区域（由不可见的碰撞墙围成）内，生成带有标签的物体和干扰物体，并从多个相机视点捕捉场景。同时，该脚本还演示了如何随机化相机姿态、对物体施加随机速度，以及如何触发自定义事件来随机化场景。这些随机化器可以是基于 Replicator 的，也可以是基于自定义的 Isaac Sim/USD API 的，并且可以在特定时间触发。

######  示例 1-2：GUI模式

```
# 创建工作目录（若已存在则跳过）
mkdir -p ~/isaacsim_test
# 进入工作目录，生成结果就会在当前目录下生成
cd /root/isaacsim_test/

# 下面的操作请注意根据Isaac Sim的不同版本加载不同的命令

# 启动，使用的Assets为bos挂载盘，Isaac Sim 4.5.0版本
/isaac-sim/python.sh /isaac-sim/standalone_examples/replicator/object_based_sdg/object_based_sdg.py --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/4.5"

# 启动，使用的Assets为bos挂载盘，Isaac Sim 5.0.0版本
/isaac-sim/python.sh /isaac-sim/standalone_examples/replicator/object_based_sdg/object_based_sdg.py --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/5.0"
```

1. 执行上面的文件后，会出现GUI界面
2. 需要等待一段时间，直到命令行出现【Simulation App Startup Complete】字样，之后GUI界面内会开始加载各种信息
   ![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bd7e66e.png)

3. 图像中的物品会在一个规划好区域内，随机运动 => 快要碰撞（距离小于阈值） => 随机重置运动（每次重置的时候会卡顿），这样反复循环，直到结束模拟

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_8fdce61.png)

生成结果文件夹结构（当前工作目录下的_out_obj_based_sdg_pose_writer文件夹）：

```
# 会生成30个结果，每个结果中有两个图片和一个json文件，000000-000029，这里就都用0000XX代替
# 其中0000XX.png是没有标注的图片，0000XX_overlay.png则会给目标物品进行标注
_out_obj_based_sdg_pose_writer/
├── 0000XX.json
├── 0000XX_overlay.png
├── 0000XX.png
└── metadata.txt

0 directories, 91 files
```

######  示例 1-2：Headless模式

####### 步骤 1：创建工作目录并拷贝官方脚本

执行以下命令，进入工作目录：

```
# 创建工作目录（若已存在则跳过）
mkdir -p /root/isaacsim_test
# 进入目标目录
cd /root/isaacsim_test/
```

####### 步骤 2：新建配置

1. 执行以下命令，生成配置文件
2. 这个配置文件是以/isaac-sim/standalone_examples/replicator/object_based_sdg/config/object_based_sdg_centerpose_config.yaml 为基础，添加上headless: true，来达到无GUI模式的目的
3. 并且加上renderer: RaytracedLighting，来启动自然光源渲染方式

```
cat > ./object_based_sdg_centerpose_config_headless.yaml << 'EOF'
launch_config:
  renderer: RaytracedLighting
  headless: true
writer_type: PoseWriter
writer_kwargs:
  output_dir: _out_obj_based_sdg_pose_writer_centerpose
  format: centerpose
  write_debug_images: true
  skip_empty_frames: false
EOF

```

####### 步骤 3：运行脚本生成合成数据

执行以下命令启动数据生成（指定配置文件和 3D 资产路径）：

```
# 下面的操作请注意根据Isaac Sim的不同版本加载不同的命令

# 启动，使用的Assets为bos挂载盘，并使用刚才修改/生成的文件作为配置文件，Isaac Sim 4.5.0版本
/isaac-sim/python.sh /isaac-sim/standalone_examples/replicator/object_based_sdg/object_based_sdg.py \
  --config="./object_based_sdg_centerpose_config_headless.yaml" \
  --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/4.5"

# 启动，使用的Assets为bos挂载盘，并使用刚才修改/生成的文件作为配置文件，Isaac Sim 5.0.0版本
/isaac-sim/python.sh /isaac-sim/standalone_examples/replicator/object_based_sdg/object_based_sdg.py \
  --config="./object_based_sdg_centerpose_config_headless.yaml" \
  --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/5.0"
```

结果查看生成的数据存储路径：/root/isaacsim_test/_out_obj_based_sdg_pose_writer_centerpose，也就是当前执行目录下创建_out_obj_based_sdg_pose_writer_centerpose文件夹

##### 示例2 自助移动机器人导航数据集合成 

官方链接：[Randomization in Simulation – AMR Navigation](https://docs.robotsfan.com/isaacsim/4.5.0/replicator_tutorials/tutorial_replicator_amr_navigation.html)

使用 Isaac Sim 与 Replicator 从模拟环境中采集合成数据的示例（AMR 导航），本教程旨在演示如何设置一个 Isaac Sim 模拟场景，并结合 omni.replicator 扩展，利用多样化的随机化技术来采集合成数据，将多种随机情况混合在一起。

######  示例 1-1：GUI 模式

```
# 创建工作目录（若已存在则跳过）
mkdir -p ~/isaacsim_test
# 进入工作目录，生成结果就会在当前目录下生成
cd /root/isaacsim_test/

# 下面的操作请注意根据Isaac Sim的不同版本加载不同的命令

# 启动，使用的Assets为bos挂载盘，Isaac Sim 4.5.0版本
/isaac-sim/python.sh /isaac-sim/standalone_examples/replicator/amr_navigation.py --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/4.5"

# 启动，使用的Assets为bos挂载盘，Isaac Sim 5.0.0版本
/isaac-sim/python.sh /isaac-sim/standalone_examples/replicator/amr_navigation.py --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/5.0"
```

1. 执行上面的文件后， 等到命令行内出现【Simulation App Startup Complete】字样后，之后GUI界面内会开始加载各种信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_040f9b6.png)

2. gui界面开始播放后，可以在Isaac Sim Python窗口内使用下面的操作
   1. 按住鼠标右键可操控场景镜头朝向（镜头改变方向和鼠标移动方向相同）
   2. 鼠标滚轮控制镜头缩放
3. 生成结果文件夹结构（当前工作目录下的_out_obj_based_sdg_pose_writer文件夹）：

```
# 会生成9个结果，每个结果中有两个图片文件，0000-0008，这里就都用000X代替
# 其中left_sensor文件夹是左侧镜头的图片，right_sensor文件夹是右侧镜头的图片
_out_nav_sdg_demo/
├── left_sensor
│   └── rgb
│       ├── rgb_000X.png
├── metadata.txt
└── right_sensor
    └── rgb
        ├── rgb_000X.png

4 directories, 19 files
```

######  示例 2-2：Headless模式

按照下述操作执行

```
# 创建工作目录（若已存在则跳过）
mkdir -p ~/isaacsim_test
# 进入工作目录
cd /root/isaacsim_test/
# 复制官方例子，并且把启动模式从gui图像模式替换为无GUI命令行模式
cp /isaac-sim/standalone_examples/replicator/amr_navigation.py ./
sed -i 's/simulation_app = SimulationApp(launch_config={"headless": False})/simulation_app = SimulationApp(launch_config={"headless": True})/g' ./amr_navigation.py

# 下面的操作请注意根据Isaac Sim的不同版本加载不同的命令

# 启动，使用的Assets为bos挂载盘，Isaac Sim 4.5.0版本
/isaac-sim/python.sh ./amr_navigation.py --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/4.5"

# 启动，使用的Assets为bos挂载盘，Isaac Sim 5.0.0版本
/isaac-sim/python.sh ./amr_navigation.py --/persistent/isaac/asset_root/default="/mnt/bos/isaac-sim/Assets/Isaac/5.0"
```