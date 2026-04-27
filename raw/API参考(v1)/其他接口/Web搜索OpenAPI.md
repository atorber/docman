### 使用限制
百度搜索接口服务目前为内测阶段，使用有以下限制：

* 客户需要已开通并购买百舸算力服务
* 客户有大模型推理+搜索的业务需求，并通过百舸平台部署推理服务
* 加入百舸搜索接口白名单
* 白名单客户免费试用限定次数，限制1qps


### 接口描述
根据关键词进行搜索

### **权限说明**
鉴权认证机制的详细内容请参见[鉴权认证](https://cloud.baidu.com/doc/Reference/s/Njwvz1wot)。

### 请求结构
```bash
GET /v{version}/aisearch/search
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json  
```
### 请求头域
除公共头域外，无其它特殊头域。

### 请求参数
|参数名称|类型|是否必选|参数位置|参数描述|
|-|-|-|-|-|
|version|string|是|URL参数|API版本号|
|query|string|是|Query参数|搜索关键词|
|分页相关参数|string/int|否|Query参数|分页参数，取值来自上一页结果返回 queries.nextPage 中的所有字段，字段名不固定，通过遍历方式拼接实际返回的字段放到 Query 中，如：fqid、gb、pn、usm 等|
### 返回头域
除公共头域外，无其它特殊头域。

### 返回参数
|参数名称|类型|说明|
|-|-|-|
|searchInformation|SearchInformation|搜索信息，如总结果数|
|queries|SearchQuery|query相关信息，如下一页分页参数|
|items|List<WebItem>|搜索结果|
SearchInformation

|参数名称|类型|必选|说明|
|-|-|-|-|
|totalResults|string|是|总条数|
SearchQuery

|参数名称|类型|必选|说明|
|-|-|-|-|
|nextPage|NextPage|是|下一页分页参数|
NextPage

|参数名称|类型|必选|说明|
|-|-|-|-|
|fqid|string|否|query ID标识相关|
|pn|int|是|页码offset|
|gb|string|否|query ID标识相关|
注：字段名不固定，这里列出的字段只是举例，以实际返回为准

WebItem

|参数名称|类型|必选|说明|
|-|-|-|-|
|title|string|是|网页标题|
|link|string|是|网页地址|
|snippet|string|否|网站摘要|
|icon|string|否|站点图标|
|date|string|否|网页日期|

### 请求示例
无分页请求示例：

```bash
GET /v1/aisearch/search?query=MCPServer
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json  
```
有分页示例：

```bash
GET /v1/aisearch/search?query=MCPServer&fqid=11634959053713548547&ft_sig=13&gb=00|00|00|00|00|00|2&pn=10&rtime=1744803585&usm=0&vfeed=1024
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json  
```
### 返回示例
```json
{
    "searchInformation": {
        "totalResults": "760"
    },
    "queries": {
        "nextPage": {
            "fqid": "11634959053713548547",
            "ft_sig": "13",
            "gb": "00|00|00|00|00|00|2",
            "pn": 10,
            "rtime": "1744803585",
            "usm": "0",
            "vfeed": "1024"
        }
    },
    "items": [
        {
            "link": "https://www.cnblogs.com/fnng/p/18744210",
            "title": "一文搞懂 MCP Servers - 虫师 - 博客园",
            "icon": "",
            "snippet": "本地实现一个文件资源服务,创建mcp_server.py文件。 importjsonimportsys# 处理客户端请求defhandle_request(request): ...",
            "date": "2025-4-16"
        },
        {
            "link": "https://blog.csdn.net/m0_59163425/article/details/146415861",
            "title": "...一步步教你借助第三方MCP Server开发Agent-CSDN博客",
            "icon": "",
            "snippet": "新的AI能力共享生态:通过MCP Server的共享,新的LLM应用可以快速获得各种工具,形成了一种新的合作体系,提高整体效用。 ",
            "date": "2025-3-29"
        },
        {
            "link": "https://blog.csdn.net/sufu1065/article/details/146554118",
            "title": "必看!SpringAI轻松构建MCP Client-Server架构_springai mcp...",
            "icon": "",
            "snippet": "设置MCP 配置信息。 编写MCP Server 服务代码。 将MCP Server 进行暴露设置。 关键实现代码如下。 添加MCP Server 依赖 ...",
            "date": "2025-4-14"
        },
        {
            "link": "https://juejin.cn/post/7483083622034096165",
            "title": "浅谈mcp server什么是 MCP Server? MCP Server 是一种...",
            "icon": "",
            "snippet": "开发者可以根据需求自定义 MCP Server。以下是使用python-sdk的一个简单示例: uvadd\"mcp[cli]\"pip install mcp # server.pyfrommcp.server.fastmcpimportFastMCP# Create an MCP server...",
            "date": "2025-4-14"
        },
        {
            "link": "http://www.laidianping.cn/?developer/article/2501593",
            "title": "从零构建自己的MCP Server-腾讯云开发者社区-腾讯云",
            "icon": "",
            "snippet": "然而,构建一个完整的MCP Server(Modded Coded Protocol Server)需要跨越多个技术领域,包括逆向工程、网络协议解析、自定义逻辑实现等。本文将从零开始,逐步讲解如何构建一个功能完整的MCP...",
            "date": "2025-4-15"
        },
        {
            "link": "https://baijiahao.baidu.com/s?id=1829443686266003783&wfr=spider&for=pc",
            "title": "支付宝推国内首个“支付MCPServer”",
            "icon": "",
            "snippet": "观点网讯：4月15日，支付宝与魔搭社区合作，在中国推出了“支付MCPServer”服务。这一服务使AI开发者能够通过自然语言轻松接入支付宝支付服务，实现AI智能体内的支付功能。此举旨在促进...",
            "date": "2025-4-15"
        },
        {
            "link": "https://www.panziye.com/ai/15995.html",
            "title": "MCP Server 介绍及核心功能架构详解 _ 潘子夜个人博客",
            "icon": "",
            "snippet": "要是你不想从头开始折腾,也可以直接用现有的MCP Server。下面给大家推荐几个不错的资源: mcp中文教程:mcpdoc.club/这个网站可能是中文资料里对MCP讲解最全面的教程了,从环境配置到实...",
            "date": "2025-4-14"
        },
        {
            "link": "https://www.bilibili.com/video/BV1umPieHEch",
            "title": "cursor-点击说话就可以改代码的mcpserver功能",
            "icon": "",
            "snippet": "MCPServer一服务 这里面已经细介绍了 安装一个扩展程序 下载以后 直点左上角那页 找到文件夹就可以直接安装了 第二击 直接在cursor里面生成这个服务 如果是绿色的就证明安装成功了 ...",
            "date": "2025-4-14"
        }
    ]
}
```
## 错误码
|错误码|错误描述|HTTP 状态码|说明|
|-|-|-|-|
|ErrCodeParam|Invalid parameter: XXX|400 Bad Param|参数校验，XXX 为具体错误|
|ErrCodeInternal|Internal error: XXX|400 Internal Server Error|服务内部错误， XXX 为具体错误|
|QPSLimit|The diagnosis report is not found, try later please.|200 OK|QPS超过限制|
|ErrCodeAuthForbidden|Auth forbidden: XXX|400 Bad Param|权限不够，无法访问，XXX为具体错误|