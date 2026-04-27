DeepSeek 推出了旗下 DeepSeek-V3模型的小升级版本 DeepSeek-V3-0324。新版 V3模型借鉴 DeepSeek-R1 模型训练过程中所使用的强化学习技术，大幅提高了在百科知识（MMLU-Pro, GPQA）、数学（MATH-500, AIME 2024）和代码任务（LiveCodeBench）上的表现水平。本文将介绍如何通过百舸平台部署DeepSeek V3模型。

## 前置条件 
### 准备资源
1. 购买1台H20机器创建百舸通用资源池（H20需开通白名单，请联系百度售前工程师）
2. 开通PFS或CFS存储并与资源池绑定


### 准备数据
平台已提供DeepSeek-V3-0324模型权重文件存储在BOS对象存储中，您可以从对应地域的BOS路径中下载模型。 

1. 登录节点安装BOSCMD[<font style="color:#3f83f8;">https://cloud.baidu.com/doc/BOS/s/qjwvyqegc</font>](https://cloud.baidu.com/doc/BOS/s/qjwvyqegc)并完成BOSCMD配置[<font style="color:#3f83f8;">https://cloud.baidu.com/doc/BOS/s/Ejwvyqe55</font>](https://cloud.baidu.com/doc/BOS/s/Ejwvyqe55)
2. 从平台提供的BOS地址中拷贝权重文件到PFS或CFS存储中：

```
./bcecmd bos sync bos:/aihc-models-bj/deepseek-ai/DeepSeek-V3-0324 /mnt/model/DeepSeek-V3-0324
```

| **地域** | **BOS路径** |
| --- | --- |
| 北京 | bos:/aihc-models-bj/deepseek-ai/DeepSeek-V3-0324  |
| 苏州 | bos:/aihc-models-su/deepseek-ai/DeepSeek-V3-0324  |
| 广州 | bos:/aihc-models-gz/deepseek-ai/DeepSeek-V3-0324  |

### 镜像准备
sglang版本 >= 0.4.3.post4，平台已预置sglang 官方镜像，建议直接使用平台提供的镜像


## 部署服务
1. <font style="color:rgb(24, 24, 24);">登录</font>**<font style="color:rgb(24, 24, 24);">百舸在线服务部署</font>**<font style="color:rgb(24, 24, 24);">控制台，选择</font>**<font style="color:rgb(24, 24, 24);">自定义部署</font>**<font style="color:rgb(24, 24, 24);">，点击</font>**<font style="color:rgb(24, 24, 24);">部署服务；</font>**
2. 输入服务名称、选择资源池/队列；
3. 资源规格设置为，加速芯片8卡，CPU128核，内存1024GiB
4. 服务镜像选择百舸预置镜像中的 sglang 社区镜像
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d9bdc5d.png)
5. 启动命令：
* model-path需替换为实际的容器目标路径
```
python3 -m sglang.launch_server --model-path /mnt/pfs/deepseek-ai/DeepSeek-V3-0324 --host 0.0.0.0  --port 8088 --tensor-parallel-size 8 --trust-remote-code --max-total-tokens 256 --mem-fraction-static 0.95
```
6. **存储挂载**
建议您使用PFS L2存储类型，提高模型加载和服务异常恢复速度；以PFS存储类型为例，填写存储模型权重文件的PFS或CFS源路径和容器目标路径，启动命令中的路径会根据目标路径动态更新；
7.  **流量接入**
+ 设置服务端口设置为8088，启动命令会根据此配置动态更新
+ 开启云原生AI网关
8. 共享内存设置为32GiB

## 服务访问
1. 服务部署成功后可在列表查看，服务状态为 “运行中”，点击 **调用信息**查看服务调用地址和Token信息
![87948525acb74711c75f513769e2ccdb.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/87948525acb74711c75f513769e2ccdb_8794852.png)
2.下载并安装 ChatBoxAI客户端 https://chatboxai.app/zh， 以下为基于 Chatbox 客户端的访问示例，您需要将百舸控制台提供的访问 Token 中的"Bearer "（包括空格）去掉后填入API密钥中。
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_3e488fb.png)
3.请求推理服务
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_135e0b9.png)


