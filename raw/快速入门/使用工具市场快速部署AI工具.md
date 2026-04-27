本文为您简要的介绍使用百度百舸·AI计算平台的工具市场快速部署开源AI工具。在首次使用百度百舸·AI计算平台的情况下，帮助开发者快速上手，在平台上完成创建轻量计算实例、在线部署AI工具、在线使用等流程。

## 主要操作流程
1. 注册百度智能云账号，并完成实名认证。请参考 [注册](UserGuide/账号密码/注册账号.md#注册百度账号) 和 [实名认证](UserGuide/实名认证/认证须知.md)
2. 登录[百度百舸·AI计算管理控制台]([https://console.bce.baidu.com/aihc/resources](https://console.bce.baidu.com/aihc/resources))。
3. 创建轻量计算实例
4. 在线部署AI工具
5. 在线使用
## 创建步骤
### 第一步：创建轻量计算实例
1. 登录[百度百舸·AI计算平台控制台](https://console.bce.baidu.com/aihc/service/resource)。
2. 进入**轻量计算实例**页面，点击**添加实例。**
  * 若您有已购买但还未加入CCE集群或百舸资源池的实例（BCC云服务器），您可直接添加已有实例；
  * 若您没有创建/购买过任何BCC实例，可以去BCC云服务器页面直接购买，购买后再进行添加；
  * 暂不支持添加CPU实例。
  * 购买实例请参考[购买云服务器实例](https://cloud.baidu.com/doc/AIHC/s/Jlzkwn7n5)中的注意事项。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=230a8c3f32c5461ab3418481fe28eb0c&docGuid=0FvAx4aq0xgjBB "")

3. 选择实例信息
  * 选择已有的实例类型
 
 ![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=434803b361f04e7b97e52f3dd8263ec1&docGuid=0FvAx4aq0xgjBB "")
 
  * 选择实例并填写密码

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=cc47dfede2a54948aae61e3dd8c2ea24&docGuid=0FvAx4aq0xgjBB "")

  * 填写公网访问信息，选择带宽和峰值
 
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=aefff51be91245068aea34aca7c3f5aa&docGuid=0FvAx4aq0xgjBB "")

  * 选择CFS共享存储，如为创建需要创建

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=4c14c043d71148cbbf20982a66c7430c&docGuid=0FvAx4aq0xgjBB "")

4. 点击**完成**，资源显示**已就绪**，完成轻量资源实例创建。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=d6dbd0850e9e40f1b04caea645b07843&docGuid=0FvAx4aq0xgjBB "")

更多操作请查看：[轻量资源实例](https://cloud.baidu.com/doc/AIHC/s/Jlzkwn7n5)

### 第二步：在线部署AI工具
1. 完成轻量资源实例创建后，点击**工具市场，**选择您想要快速部署的AI开源工具，点击工具卡右下角的**部署工具。**工具市场也已支持通用资源池部署使用，可按需选择。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=486111ffc8904f2a809ab6770b8c28b0&docGuid=0FvAx4aq0xgjBB "")

2. 填写部署信息
  * 填写工具名称

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=92a4b4ea66724fdeb6faab0d6a06ef4d&docGuid=0FvAx4aq0xgjBB "")

  * 选择轻量计算实例
  * 选择实例类型
  * 选择实例
  * 选择加速芯片

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=c0b754bb4e784d7d8db49bea2077b31c&docGuid=0FvAx4aq0xgjBB "")

3. 点击**确定，**完成工具创建。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2ee439b4c6984f11a1e415dabbf87c35&docGuid=0FvAx4aq0xgjBB "")

### 第三步：在线使用AI工具
1. 在工具市场中，点击**我的工具**，找到您创建的工具名称，点击名称进入工具详情

2. 在工具实例中，点击**登录**，选择您所需要的登录方式

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f860f712654b4ce4aa16728245165de2&docGuid=0FvAx4aq0xgjBB "")

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=863371c7365b47479d3922ddf6d7c30b&docGuid=0FvAx4aq0xgjBB "")

3. 通过不同方式登录后，可在线使用AI开源工具。更多AI工具创建教程：
  * [如何使用SSH登录实例](https://cloud.baidu.com/doc/AIHC/s/8lywok9y0)
  * [使用LLaMA Factory快速微调大模型](https://cloud.baidu.com/doc/AIHC/s/Blywumhin)
  * [快速部署JuypterLab](https://cloud.baidu.com/doc/AIHC/s/alywuje0r)
  * [快速部署AI绘画SDWebUI](https://cloud.baidu.com/doc/AIHC/s/plzgkh5yx)
  * [使用Ollama部署大语言模型](https://cloud.baidu.com/doc/AIHC/s/0lzguaxez)
  * [使用vLLM加速大模型推理](https://cloud.baidu.com/doc/AIHC/s/ilzkqytix)
  * [使用DataEnhance扩展数据集](https://cloud.baidu.com/doc/AIHC/s/rlzv2j0a7)
  * [快速部署AI绘画ComfyUI](https://cloud.baidu.com/doc/AIHC/s/Rm04vir87)
  * [一键部署Kohya_ss 微调SD模型](https://cloud.baidu.com/doc/AIHC/s/4m2sxwvdr)
  * [快速部署Swift微调大语言模型](https://cloud.baidu.com/doc/AIHC/s/Zm35swdf0)
  * [一键部署CosyVoice进行语音生成](https://cloud.baidu.com/doc/AIHC/s/Vm373hh5l)
  * [快速部署GPT-SoVITS语音合成](https://cloud.baidu.com/doc/AIHC/s/rm387b3vz)
  * [快速部署opencompass评测大语言模型](https://cloud.baidu.com/doc/AIHC/s/km3z9b66q)