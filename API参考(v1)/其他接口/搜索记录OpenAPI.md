### 使用限制
百度搜索接口服务目前为内测阶段，使用有以下限制：

* 客户需要已开通并购买百舸算力服务
* 客户有大模型推理+搜索的业务需求，并通过百舸平台部署推理服务
* 加入百舸搜索接口白名单
* 白名单客户免费试用限定次数，限制1qps

### 描述
搜索记录，包括总量

### 请求结构
```bash
GET /v{version}/aisearch/history
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json  
```
### 请求头域
除公共头域外，无其它特殊头域。

### 请求参数
|参数名称|类型|是否必选|参数位置|参数描述|
|-|-|-|-|-|
|version|String|是|URL参数|API版本号|
|pageNo|int|否|Query参数|页数，默认值为1|
|pageSize|int|否|Query参数|每页返回条数，默认值为10，最大50条|
### 返回头域
除公共头域外，无其它特殊头域。

### 返回参数
|参数名称|类型|说明|
|-|-|-|
|requestId|String|请求ID|
|result|SearchRecord|成功请求时的返回结果|
SearchRecord

|参数名称|类型|必选|说明|
|-|-|-|-|
|totalCount|int|是|总记录数|
|data|List<SearchRecordList>|是|详细结果|
SearchRecordList

|参数名称|类型|必选|说明|
|-|-|-|-|
|query|string|是|搜索关键词|
|createdAt|string|是|查询结果写入数据库时间|
|items|List<WebItem>|是|详细结果|
WebItem

|参数名称|类型|必选|说明|
|-|-|-|-|
|title|string|是|网页标题|
|link|string|是|网页地址|
|snippet|string|否|网站摘要|
|icon|string|否|站点图标|
|date|string|否|网页日期|


### 请求示例
```bash
GET /v1/aisearch/history
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json
```
### 返回示例
```json
{
  "requestId": "3bef3f87-c5b2-4419-936b-50f9884f10d5",
  "result": {
    "totalCount": 1,
    "data": [
      {
        "query": "mcp",
        "createdAt": "2025-04-17T16:40:47.626577Z",
        "items": [
          {
            "link": "https://blog.csdn.net/qq_45066628/article/details/146225428",
            "title": "一文带你入门 MCP(模型上下文协议)-CSDN博客",
            "icon": "",
            "snippet": "无论你是构建 AI 驱动的 IDE、改善 chat 交互,还是构建自定义的 AI 工作流,MCP 提供了一种标准化的方式,将 LLM 与它们所需的上下文...",
            "date": "2025-4-17"
          },
          {
            "link": "https://juejin.cn/post/7463005171515621417",
            "title": "一文带你入门 MCP(模型上下文协议)什么是 MCP? MCP(Model...",
            "icon": "",
            "snippet": "本文带领读者快速入门了 MCP(模型上下文协议),介绍了其架构、核心概念以及实际应用场景。通过演示 Claude Desktop 结合 PostgreSQL MCP Server 查询数据库的场景,展示了 MCP 如何增强 LLM...",
            "date": "2025-4-17"
          },
          {
            "link": "https://zhuanlan.zhihu.com/p/1892612293252065003",
            "title": "最近热火朝天的 MCP 是什么鬼?如何使用 MCP?一文给你讲清楚! - 知...",
            "icon": "",
            "snippet": "那么,今天就来聊聊最近热火朝天的 MCP 是什么?? MCP 是什么鬼? ",
            "date": "2025-4-17"
          },
          {
            "link": "https://baike.baidu.com/item/MCP/2318509?fr=aladdin",
            "title": "MCP_百度百科",
            "icon": "",
            "snippet": "MCP基组包括MCP-DZP， MCP-TZP，MCP-QZP。由于MCP基组包含芯实投影算符(core Projeetor)，产生的价电子轨道(基组函数)保持了正确的节点 (nodal structure)，从而...",
            "date": "2006-05-09"
          },
          {
            "link": "https://cloud.tencent.com/developer/article/2505540",
            "title": "一文读懂:模型上下文协议(MCP)-腾讯云开发者社区-腾讯云",
            "icon": "",
            "snippet": "Hello folks,我是 Luga,今天我们来聊一下人工智能应用场景 - 构建高效、灵活的计算架构的模型上下文协议(MCP)。 ",
            "date": "2025-4-17"
          },
          {
            "link": "https://baijiahao.baidu.com/s?id=1825309960083632895\u0026wfr=spider\u0026for=pc",
            "title": "生成式人工智能常识之:什么是MCP?",
            "icon": "",
            "snippet": "答案或许就在于 MCP（Model Context Protocol，模型上下文协议）。它的出现，就像一座桥梁，有望连接起大模型与外部数据源，为我们...",
            "date": "2025-2-28"
          }
        ]
      }
    ]
  }
}
```