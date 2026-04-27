百舸工具市场上线百舸自研的DeepSeek-R1-WebUI镜像服务，可快速使用单机H20部署DeepSeek-R1满血版+联网搜索+文件上传+图片识别的应用。无需额外开发，零代码快速使用DeepSeek-R1和相关插件服务

## 准备环境和资源
可根据资源规模、稳定性、灵活性等要求按需准备轻量计算实例或通用计算资源池，运行本镜像推荐使用H20*8。

## 安装DeepSeek-R1
1. 在工具市场->模版市场中，选择「DeepSeek-R1（FP8）」镜像，点击「部署工具」按钮，快速部署DeepSeek-R1的WebUI。

![WX20250226-131815@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250226-131815@2x_6facca1.png)

2. 选择为部署工具所需的实例规格和卡数，推荐H20*8，选择机器后，资源申请参数自动配置，可根据需求调整。

![ee33b759ea7a1a8258552ebbe.jpg](https://bce.bdstatic.com/doc/bce-doc/AIHC/ee33b759ea7a1a8258552ebbe_ee33b75.jpg)

3. 完成配置后点击**确认**，当**工具状态**从**创建中**变为**运行中**，表明工具已部署成功。

![WX20250225-101439@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250225-101439@2x_9c65eed.png)

## 访问DeepSeek-R1 WebUI
1. 工具部署成功后，点击查看工具详情，单击 **登录** 通过WebUI的访问地址和用户名、密码。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_0de10bb.png)

2. 进行模型推理验证。输入用户名、密码，验证推理功能。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f328cb3fbed24c479152bfae5a4abc7f&docGuid=vR9aAS8zFnOirf "")

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b57c639e07824eb091b499dc32f55021&docGuid=vR9aAS8zFnOirf "")


## 扩展功能介绍
### 1. 联网搜索

点击**联网搜索**按钮，开启联网搜索能力。联网搜索当前为内置服务，采用多轮搜索和AI Agent智能协同机制，实现精准的信息提取：

![WX20250225-100728@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250225-100728@2x_9351e9c.png)

* **第一步原始Query查询**：基于用户的原始查询（Query），进行全网搜索，获取初步搜索结果。
* **第二步智能Query扩写**：**智能扩写Agent**，对初始Query进行优化扩写，并再次执行全网搜索，获取更多结果。（可重复多次）
* **第三步AI相关性分析**：**相关性分析Agent**，对前几轮的搜索结果的简介内容进行相关性分析，并筛选出最相关的10条（可改条数）信息。
* **第四步网页结果读取**：将筛选后的高相关性搜索结果取出链接，进行网页内容抓取、清洗、关键信息提取后，输入给大模型，由大模型进行总结，最终生成回答。

### 2. 文件上传

点击**文件上传** 按钮，上传本地文件。上传文档当前为内置服务，支持多个文档同时上传，可根据文档内容进行提问。当前文档上传最大限制为50M。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_667bd5d.png)

**注意：联网搜索和文档上传不支持同时使用。**

### 3. 图片识别OCR
平台支持配置图片识别OCR的服务，在WebUI链接后添加“/setting”，可进入设置页面（如WebUI地址为http://xxx.1234.123 ，则设置地址为http://xxx.1234.123/setting ）。
可在设置中配置百度智能云图像识别服务的AK/SK、App ID，获取OCR功能详情参考：[图片识别功能](https://ai.baidu.com/ai-doc/REFERENCE/Bkru0l60m)

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e7f5a53.png)

### 4. 内容审核服务
平台支持配置提问内容的审核服务，针对黄反内容进行前置屏蔽，需要在WebUI的设置中配置。在WebUI链接后添加“/setting”，可进入设置页面（如WebUI地址为http://xxx.1234.123 ，则设置地址为http://xxx.1234.123/setting ）。可在设置中配置百度智能云黄反检测服务的AK/SK、App ID，获取内容审核接口详情参考：[内容审核](https://cloud.baidu.com/doc/ANTIPORN/s/Wkhu9d5iy)

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_5663963.png)




