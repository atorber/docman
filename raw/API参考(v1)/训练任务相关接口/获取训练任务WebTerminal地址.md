### 描述

获取训练任务中指定容器的web Terminal

### 请求结构

```bash
GET /api/v1/aijobs/{jobId}/pods/{podName}/webterminal
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json    
```

### 请求头域

除公共头域外，无其它特殊头域。

### 请求参数

| 参数名称       | 类型   | 是否必须 | 参数位置   | 说明                   |
| -------------- | ------ | -------- | ---------- | ---------------------- |
| jobId          | String | 是       | Path 参数  | 训练任务ID             |
| podName        | String | 是       | Path 参数  | 训练任务节点名称       |
| resourcePoolId | String | 是       | Query 参数 | 标识资源池的唯一标识符 |
| handshakeTimeoutSecond | String | 否       | Query 参数 | 连接超时参数，仅在建立连接时使用，单位秒，默认值30，最小值30 |
| pingTimeoutSecond | String | 否       | Query 参数 | 心跳超时参数，单位秒，默认值900，最小值1，最大值3600  |

### 返回头域

除公共头域，无其它特殊头域。

### 返回参数

| 名称      | 类型                                                        | 说明     |
| --------- | ----------------------------------------------------------- | -------- |
| requestId | String                                                      | 请求ID   |
| result    | [WebTerminalResult](AIHC/API参考(v1)/附录.md#EebTerminalResult) | 返回结果 |

### 返回示例

```json
{
  "requestId": "2f2d2ab7-2c8e-45fd-a562-8bbded9ef77f",
  "result": {
    "WebTerminalUrl": "wss://cce-webshell-bj.bce.baidu.com/api/v1/containerwebshell/establish/ppsurbh9ro763fmyx1ueaws6une8ek5mg3t3tt268ta8gmayngaf4ziw66fzu10iq1r4clpxuif547ux6p93vt98d0v24e9t5rm29qofxsti41lt1wntydhr7pkx8cyt?handshakeTimeoutSecond=30&pingTimeoutSecond=900"
  }
}
```