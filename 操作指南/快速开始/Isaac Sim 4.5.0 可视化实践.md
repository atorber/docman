# 案例介绍

> NVIDIA Isaac Sim是基于NVIDIA Omniverse构建的机器人仿真平台，本文是在开发机上基于isaac sim实现可视化能力的实践教程
> 


![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_a758003.png)
NVIDIA Isaac Sim是基于NVIDIA Omniverse构建的机器人仿真平台，支持从URDF、MJCF和CAD等常见格式导入机器人系统。通过GPU加速物理引擎来实现精确仿真，并支持大规模、多传感器RTX渲染。集成数据生成、强化学习、ROS集成和数字孪生模拟等端到端工作流程。其优势包括：

* **资产导入&导出：**支持从非USD格式导入机器人和环境，或将其导出为非USD格式；
* **机器人微调：**优化机器人的物理精度、计算效率或真实感；
* **机器人仿真：**提供全流程运动控制工具链，如控制器、运动生成和运动学求解器以及策略集成接口；
* **传感器系统：**支持RTX和物理学传感器。



**官方地址**：

[https://docs.isaacsim.omniverse.nvidia.com/4.5.0/index.html](https://docs.isaacsim.omniverse.nvidia.com/4.5.0/index.html)

# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|建议8核及以上|按需|
|内存|建议64G及以上|按需|
|GPU|Isaac Sim 4.5.0 : A800 / L20 / 支持RT Core的NVIDIA GPU卡 1卡及以上|按需|
|CDS|按需|按需|
|其它|无|无|

**使用需知：**

1. Isaac Sim 4.5.0的仿真渲染依赖DLSS（超采样技术，Deep Learning Super Sampling），因此推荐使用GeForce RTX系列显卡（A800没有RT core，测试效果有噪点问题，不推荐使用）
2. 本案例使用L20等Ada Lovelace架构三代RT Core的显卡，且使用的BLB网络带宽为50Mbps时，无噪点，无卡顿，表现更为符合期望
3. isacc官方要求，显卡驱动版本需要高于535.129  ，如果Ubuntu版本>=22.04.5 kernel 6.8.0-48-generic，则驱动至少要求在535.216.01以上
4. 535驱动版本中（550无此问题），含535.255及以上的驱动版本，存在一个已知的显卡驱动判断错误，需要添加--/rtx/verifyDriverVersion/enabled=false参数，跳过显卡驱动判断（操作方式见后续步骤）
5. 官方未对cuda和cudnn有限制，不同的cuda版本和cudnn版本是否对可视化界面的表现有影响未验证
6. 由于该工具的较多场景需要访问外网，可以通过设置服务网卡，并设置HTTPS网络代理支持访问。[服务网卡的配置参考](https://cloud.baidu.com/doc/VPC/s/Plztid5es#2-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%8D%A1)



### 
# 使用说明
本文会先介绍如何【启动可视化客户端】，然后以【执行官方四足和人形可操作演示】、【宇树GR1机器人简易操作演示】两个例子，简单介绍Isaac Sim的使用。

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置


## 1. 创建与登录开发机
### 1.1 步骤一：从快速开始创建一个【Isaac Sim 4.5.0 可视化实践】开发机实例：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_089fe0b.png)
### 1.2 步骤二：填写表单
* GPU选择： 建议使用 NVIDIA L20
* 其它选项值建议参考截图表单填写(官方推荐8核64G)，保证运行所需的基础资源配置
* **启用SSH**，填入创建好的公钥，选择支持**公网访问**的BLB（建议选择网络带宽≥50Mbps的BLB，带宽越大越好，越少共享复用越好）
* 其它表单项默认即可

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_8d350e1.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bcd0394.png)
### 1.3 步骤三：创建并登录开发机
填写完表单，提交后，在开发机列表可见创建的开发机，等待资源调度并部署成功后，点击登录，即可进入开发机webIDE

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e43f67f.png)
主要路径介绍

* Isaac Sim USD资产挂载路径：/mnt/bos/isaac-sim，该目录下存有Isaac Sim预置的部分USD资产。

### 1.4 验证GPU硬件和显卡驱动版本
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

### 1.5 节点调整显卡驱动版本，即重装系统（如果驱动版本满足，可跳过）
**如显卡驱动不符合建议，则建议重装节点驱动**： 建议使用百舸的驱动推荐版本，如果推荐的驱动无法满足业务需求，可进入BCC进行重装操作，有更多的版本选择

**重装步骤**： 从资源池中移除节点 -> 在bcc中重装系统并调整显卡驱动版本 -> 将节点重新加入资源池

**备注：**因为全托管资源池使用的推荐驱动版本和Isaac sim客户端的适配性没有问题，所以此处只覆盖自运维资源池的重装步骤

#### 1.5.1 从资源池中移除节点
1、在百舸页面中，选择开发机所在的资源池，点击进入详情界面

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6b18980.png)

2、点击希望重装驱动的节点（eg：如果GPU卡选择了L20，则需要更新所有L20的节点），记录下来**实例ID**（整个流程都会用到），操作移出节点，弹出窗口

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_95c533f.png)

3、在下面弹窗中，无需勾选复选框，直接点击确定即可

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c8de235.png)

4、等待移出完成（需要刷新页面或者用右上角刷新按钮才能看到状态更新）

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6aea304.png)

#### 1.5.2 在bcc中重装系统并调整显卡驱动版本
1、进入bcc：点击左上角，打开导航页，搜索bcc，然后点击【云服务器】，进入bcc界面

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_2d6923c.png)
2、找到对应节点，并操作

使用刚才记录的**实例ID**，在bcc中搜索，并操作【重装操作系统】（重装操作系统只有移出节点之后才能操作）

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_44fa8a9.png)
3、系统和驱动版本选择

重装操作系统，建议选择Ubuntu的22.04版本作为os，然后选择目标Driver版本，cuda版本和CUDNN版本可按需选择，对isaac sim可视化客户端没有影响

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c123965.png)
4、设置root密码，点击确定，开始重装系统

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6f3f167.png)
5、安全验证，输入短信验证码

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_0ecf50d.png)
6、开始重装后，此处状态会显示为【重建中】，等到状态变回【运行中】，即可将节点重新加入资源池

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_673f89f.png)
#### 1.5.3 节点重新加入资源池
1、回到百舸资源池，节点管理界面，点击添加节点按钮，进入添加节点页面

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ab5a6ec.png)
2、点击【使用已有服务器】，通过**实例ID**，找到我们刚刚重装的机器（有时实例不在【云服务器BCC】选项卡中，可以尝试【弹性裸金属服务器EBC/裸金属服务器BBC/高性能应用服务HPAS】这几个选项卡都找一下有没有）

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_3738d5f.png)
3、注意选择【使用已有配置】，不要再重装操作系统以免覆盖掉我们刚才选择的显卡驱动，输入刚才重装时设置的root密码，点击完成，开始加入

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c356cd1.png)
4、等待节点加入完成，状态为未干预，且可用，即可开始使用

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e50621a.png)
## 2. 启动客户端
### 2.1 启动vnc远程桌面
#### 2.1.1 启动vnc服务端
在Terminal界面内输入以下命令，开启vnc服务

```bash
# 镜像中TurboVNC服务器，可以使用以下命令设置或修改密码（会被提示可以设置一个 view-only 密码，可以跳过）；
# 如果不在这一步设置一个密码，在实际启动vncserver的时候就会被要求现设置密码
# /opt/TurboVNC/bin/vncpasswd ~/.vnc/passwd

# 如果之前没有设置过turboVNC的密码，这里会要求设置密码和只读密码（当前先不设置只读密码）例如密码： aihclite，建议只读
# /opt/TurboVNC/bin/vncserver :1 -geometry 1920x1080 -depth 24  #参数1 会默认选择端口5901

# 每次在停止开发机之前，都要用这个命令关闭vnc服务端
# 如果没有关闭，则下次开机再想启动vnc服务，就会碰上【/tmp/.X1-lock】和【/tmp/.X11-unix/X1】两个文件锁，需要删除了文件锁之后才能再次开启vnc服务端
# /opt/TurboVNC/bin/vncserver -kill :1

# 使用下面的脚本启动vnc客户端，客户端会自动清理锁文件
# 但如果:1已经在运行一个vnc服务，那么脚本会提示【A VNC server is already running as :1】并退出，不做任何事情
~/workspace/vncstart.sh
# 如果希望修改启动参数，例如修改默认分辨率为1024*768，或者将24色修改为16色，则可以在【/opt/TurboVNC/bin/vncserver -kill :1】关掉之前的vnc服务之后，使用下面带参数的命令重新启动vnc服务
# ~/workspace/vncstart.sh -geometry 1024*768 -depth 16
```
初次开启vnc服务，会要求输入密码（密码限制了8位长度），以及选择是否添加只读密码

按以下操作完成密码设置，建议不添加只读密码（建议**选n**）

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_89cb176.png)


这个步骤完成后，vnc远程桌面就会在开发机的5901端口等待响应

为安全等考量，不建议将5901直接公开到外网上，下面会演示如何通过ssh将端口投射到本地，然后通过本地连接远程桌面

#### 2.1.2 使用本地ssh将开发机的5901端口投射到本地
**本地**（Windows或Mac）命令行启动ssh作为转发通道（在使用vnc期间，命令行的ssh需要持续开启）：

```bash
# 用本地环境的命令行执行这个ssh，-L是将开发机的5901监听连接到本地，后面的root、ip和-p部分根据实际开发机给出的公网访问命令执行
ssh -L 5901:127.0.0.1:5901 root@开发机公网IP地址 -p 开发机公网端口（可在开发机详情页复制）
```
开发机详情页公网IP和公网端口位置（在创建开发机时，选择开启ssh，并选择一个能连上公网的BLB，才能看到下面的部分）：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_a0c83b7.png)
#### 2.1.3 下载TurboVNC客户端到本地并安装，并链接vnc服务
TurboVNC客户端下载地址： [https://github.com/TurboVNC/turbovnc/releases](https://github.com/TurboVNC/turbovnc/releases) 找到相应版本（建议选择3.2版本），点击展开版本卡片最下方的Assets链接，可以看到各OS下载地址。当前版本TurboVNC Viewer v3.2 (20250506)。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_83e9911.png)
下载安装完成后，会有两个快捷图标，点击如下图标：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6c60713.png)

点击启动后，点击connect进行远程连接：

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ce152b4.jpeg)
![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_60fef14.jpeg)
连接成功后：

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1be3a81.jpeg)
### 2.2 启动isaac-sim客户端
在上面已经打开的vnc界面中，执行如下操作，从命令行启动isaac-sim客户端IsaacSim可视化界面：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_eaeb3a2.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_5482a46.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_4131dba.png)

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

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_790664b.png)
![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bcfdc9a.jpeg)

## 3. 案例演示
### 3.1 执行官方四足和人形可操作演示
#### 3.1.1 步骤一：开启机器人案例选项卡
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_772046e.png)
#### 3.1.2 步骤二：加载Humanoid人形机器人案例
点击Load按钮加载，Reset按钮重置案例（或选择右侧的Quadruped四足机器人案例，也是点击Load按钮加载，Reset按钮重置案例）

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9106e91.png)
一般来说，对一个模型或者脚本点击Load按钮，客户端窗口会停止响应一些时间进行网络加载

但在开发机刚新建时，这里的加载时间过长，也有几率是客户端卡死

如果客户端卡死，则可以点击右上角的x关闭客户端后，在命令行再次执行命令启动，一般一到两次之后，一旦有一次Load成功，之后客户端就不会再卡死

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_7cfb8f8.png)

#### 3.1.3 步骤三：操作机器人
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

#### 3.1.4 运行效果图片&视频
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_150a1fa.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_00337cb.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c4711da.png)

### 3.2 宇树GR1机器人简易操作演示
#### 3.2.1 步骤一： 在Assets中找到GR1机器人，并加载到工作空间中
操作步骤：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_7f65ae2.png)
操作结果：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_26df0fa.png)
#### 3.2.2 步骤二： 使用Physics Inspector工具，对关节进行简易操作
操作步骤：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_7178629.png)
额外步骤：

如果按照上面操作后，Physics Inspector显示成下面的样子，则需要点击一下【Re-Enable authoring】按钮，就会显示关节角度界面

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d089462.png)
操作结果图片&视频：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_17b5a41.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_4b64795.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1cb311e.png)