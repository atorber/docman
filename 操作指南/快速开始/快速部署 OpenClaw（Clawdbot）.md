OpenClaw 是一个可以运行在终端设备上的个人AI助手，能在日常聊天应用（如 WhatsApp、Telegram、Slack、Mattermost（插件）、Discord、Google Chat、Signal、iMessage、WebChat）中进行回复，并在支持的平台上实现语音交互和实时画布，具备有状态的会话、记忆和工具功能。

本文会介绍如何部署使用OpenClaw，在WebUI中OpenClaw进行对话。


**使用需知：**

1. OpenClaw需要至少搭配一个大模型服务，才能进行最基础的对话；
2. OpenClaw 既是一个产品，也是一项实验：接入真实的通讯平台和真实的工具。**不存在“绝对安全”的设置方案**。建议从能满足基本功能的最小权限开始，再逐步扩大其访问范围；
3. 部署OpenClaw的开发机实例和OpenClaw需要调用的大语言模型需要属于同一资源池。


如何连接聊天软件的部分，本教程暂不涉及，请参照 OpenClaw 官网： [Chat Channels](https://docs.openclaw.ai/channels/index)


## **一、部署OpenClaw**
![image \(7\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%287%29_93359c1.png)

1. 在 **快速开始 **中查找 OpenClaw 点击 **在开发机中打开 ；**

2. 填写创建开发机在开发机中打开 OpenClaw 所需的参数；
    * 不需要加速芯片，CPU和内存建议4核、16G
    * 使用百舸云盘/云磁盘
    * 开启启用SSH，填写公钥
    * 选择支持公网访问的BLB（仅对话情况下带宽需求不高10Mbps即可，如需要图片传输，建议调大BLB带宽）

  3. 填写完成创建部署 OpenClaw 的开发机，可在 **开发机** 中查看实例；

* /app：根目录下的app文件夹
* /home/node/.openclaw：存储openclaw配置文件 
* /home/node/clawd：openclaw工作文件夹


## 二、初始化OpenClaw配置
1. 开发机 “运行中” 后，可点击 **登录** 可进入开发机WebIDE；
![image \(8\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%288%29_17bf6aa.png)

2. 在开发机的WebIDE中打开 Terminal界面内输入以下命令，对OpenClaw进行配置初始化；

![image \(9\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%289%29_042663a.png)
```
# 从root用户切换到node，所有动作都要用node用户操作
su node
# 进入OpenClaw根目录
cd /app
# 开启设置界面
node dist/index.js onboard --install-daemon
```
![image \(10\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2810%29_116211b.png)
![image \(11\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2811%29_a433396.png)
* 左右键切换为yes，回车下一步

![image \(12\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2812%29_dee3d74.png)

* QuickStart，回车下一步

![image \(13\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2813%29_9503d64.png)

* 按一下上键，光标可直接选择Skip for now，回车下一步

![image \(14\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2814%29_6452c7c.png)

* 直接选择All providers回车

![image \(15\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2815%29_706b937.png)

* 选择Keep current，回车下一步

![image \(16\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2816%29_8ac86c0.png)

* 上键，光标跳转到Skip for now，回车下一步

![image \(17\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2817%29_6e77735.png)

* 左右键选择No，回车选中
* 
![image \(18\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2818%29_c0de077.png)

* 空格勾选上Skip for now，回车下一步

![image \(19\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2819%29_111214e.png)

* 等待一段时间，出现配置流程

![image \(20\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2820%29_2f70cb0.png)

3. 启动Gateway

```
# 从root用户切换到node，所有动作都要用node用户操作
su node # 已切换可忽略
# 进入OpenClaw根目录
cd /app # 已进入可忽略
# 前台开启Gateway，开启后，关掉这个bash窗口会导致Gateway停止
node dist/index.js gateway --port 18789 --verbose
```
![image \(21\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2821%29_2137cf9.png)

4. 验证OpenClaw是否已经正常启动

使用本地ssh将开发机的18789端口映射到本地，**本地**（Windows或Mac）命令行启动ssh作为转发通道（在使用vnc期间，命令行的ssh需要持续开启）：

```
# 用本地环境的命令行执行这个ssh，-L是将开发机的5901监听连接到本地，后面的root、ip和-p部分根据实际开发机给出的公网访问命令执行
ssh -L 18789:127.0.0.1:18789 root@开发机公网IP地址 -p 开发机公网端口（可在开发机详情页复制）
```
开发机详情页公网IP和公网端口位置（在创建开发机时，选择开启ssh，并选择一个能连上公网的BLB，才能看到下面的部分）：

![image \(22\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2822%29_5cb7e7b.png)

访问本地18789端口（带有token）

![image \(23\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2823%29_f23f3e0.png)

使用从这一步中提取出的url： [http://127.0.0.1:18789/?token=df9b8005e58c1dc2eafa047b9870bb4f884754e6215616bb](http://127.0.0.1:18789/?token=df9b8005e58c1dc2eafa047b9870bb4f884754e6215616bb)

![image \(24\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2824%29_f23f3e0.png)
成功后，右上角会有【Health Ok】标识

## 三、部署大语言模型
本教程使用会使用一个百舸创建的LLM模型服务，来提供OpenClaw所需要的模型支持

1. 在**  快速开始** 中搜索 Deepseek-V3.2模型，点击 **部署** 部署OpenClaw的开发机实例和OpenClaw需要调用的大语言模型需要属于同一资源池；

![image \(25\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2825%29_440cca5.png)

2. 在 **在线服务部署** 中查看已部署的模型，服务状态为“运行中” 即可调用，点击 **调用信息 **获取模型服务的调用地址、Token

![image \(26\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2826%29_13f61c8.png)
![image \(27\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2827%29_eeef711.png)
注意：访问地址需要自行拼接/v1，例：[http://10.0.0.135/auth/s-rd2ff74bfcb6/8000](http://10.0.0.135/auth/s-rd2ff74bfcb6/8000)/v1 
3. 服务部署成功后，可以在开发机中请求服务，检查网络联通性。

## 四、配置 OpenClaw WebUI
1. **填写agent**

![image \(28\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2828%29_3dfc84c.png)
* 进入Config->Agents->Defaults；
* 通过网页搜索Model Fallbacks，找到Model区域（Model Fallbak还会搜到Image Model，跳过这个区域寻找Model区域）；
* Primary Model填写【provider名称 + model名称】，这两个名称都可以自定义，只要配置中填写的Agents、Authentication、Provider三个区域能够对应上即可，本教程中会使用【demo-provider】和【Deepseek-V3.2】

![image \(29\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2829%29_ac78ea4.png)
* 继续下拉到Models部分，需要点击右侧按钮将其展开
* 在Custom entries一栏点击【Add Entry】添加一条新的自定义Models
* 填入Primary model的值，【demo-provider/Deepseek-V3.2】
* 在alias中填入一个别名，我们这里使用【deepseek】这个alias
* 点击右上角的save按钮，保存修改

2. **填写Authentication**

![image \(30\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2830%29_967b65a.png)
* 增加auth认证，进入config->Authentication->Auth Profiles界面，点击Add Entry按钮新增一项
* 填入标题为： demo-provider:default
* 选中 api_key 验证方式
* 填入Provider为： demo-provider
* 最后点击右上角的save

3. **填写Provider**

![image \(31\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2831%29_99fd3cc.png)
* 进入config->Models->Providers界面

![image \(32\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2832%29_396f5a4.png)
* 点击Add Entry按钮新增一项
* 填入Provider名称为demo-provider
* 选择Api为【openai-completions】
* 将之前推理服务的Token填入这里的Api Key（不带Bearer）
* 将之前推理服务的url填入这里的Base Url（到v1为止）

![image \(33\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2833%29_ce8659b.png)
* 向下滚动到Models
* 点击Add按钮添加一项
* 选择Api为【openai-completions】

![image \(34\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2834%29_e9da5b8.png)
* 向下滚动到Models中填写id的部分，我们这里填入Deepseek-V3.2，也就是之前的Model名称
* 点击Add添加一个输入，选择text
* Name也填入Deepseek-V3.2
* 最后点击右上角的save

4. 配置完成，即可进行对话回到首页，进行大模型对话

![image \(35\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2835%29_99989e7.png)