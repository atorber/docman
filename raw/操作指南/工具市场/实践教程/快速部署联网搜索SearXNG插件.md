  
联网搜索是一种应用层能力，它通过结合大模型和智能搜索技术，面向需要网络信息检索的需求场景，丰富大模型回答的参考信息。联网搜索可以整合**多个搜索引擎**，聚合多个来源的信息，确保搜索给到大模型参考信息的广度和深度，不再受限于单一引擎的局限。百舸工具市场提供开源搜索工具SearXNG的快速部署镜像，用户可根据需要自行部署

## 联网搜索的实现方式
百舸联网搜索采用多轮搜索和AI Agent智能协同机制，实现精准的信息提取：

* **第一步原始Query查询**：基于用户的原始查询（Query），进行全网搜索，获取初步搜索结果。
* **第二步智能Query扩写**：**智能扩写Agent**，对初始Query进行优化扩写，并再次执行全网搜索，获取更多结果。（可重复多次）
* **第三步AI相关性分析**：**相关性分析Agent**，对前几轮的搜索结果的简介内容进行相关性分析，并筛选出最相关的10条（可改条数）信息。
* **第四步网页结果读取**：将筛选后的高相关性搜索结果取出链接，进行网页内容抓取、清洗、关键信息提取后，输入给客户正在使用的大模型，由大模型进行总结，最终生成回答。

## 部署方式
### 准备环境和资源
可根据资源规模、稳定性、灵活性等要求按需准备轻量计算实例或通用计算资源池，用于快速部署SearXNG。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=5c5265b5efe8482b9ea98e35aa339278&docGuid=t-u52yW4R64OUt "")
## 安装SearXNG
1. 在工具市场>模版市场 选择SearXNG模版，点击 **部署工具 **按钮，使用轻量计算实例或通用计算资源快速部署SearXNG；

![WX20250225-095632@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250225-095632@2x_65c7ec2.png)

2. 完成配置后点击**确认**，当**工具状态**从**创建中**变为**运行中**，表明工具已部署成功。

![WX20250225-100036@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250225-100036@2x_ef4c7d3.png)

## 使用SearXNG
1. 工具部署成功后，点击查看工具详情，单击 **登录** 复制 Open API 


2. 将Open API接口粘贴到WebUI的配置中。以百舸工具市场Deepseek R1应用的WebUI举例，在WebUI链接后添加“/setting”（如WebUI地址为http://xxx.1234.123 ，则设置地址为http://xxx.1234.123/setting ）可进入设置页面，在设置中配置填写SearAPI地址。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=6916a135a1ed4ce3be5c6310f4ec2983&docGuid=t-u52yW4R64OUt "")

如果您使用的是其他WebUI，也可将Open Api配置进对应的联网搜索设置中。

3. 配置完成后，在WebUI中开启「联网搜索」按钮，使用联网搜索。

![WX20250225-100728@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250225-100728@2x_9351e9c.png)

![WX20250225-101036@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250225-101036@2x_e1827e8.png)