### 描述
获取训练任务中指定容器的web Terminal

### 请求结构
```bash
POST ?action=DescribeJobWebterminal&resourcePoolId=xxxx&queueID=xxxx
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json
X-API-Version: v2    
```
### 请求头域
除公共头域外，无其它特殊头域。

### 请求参数
|参数名称|类型|是否必须|参数位置|说明|
|-|-|-|-|-|
|resourcePoolId|String|是|Query 参数|自运维资源池传递资源池唯一标识（示例：cce-1uji3ib5），托管资源池传递 aihc-serverless|
|queueID|String|是|Query 参数|训练任务所属队列，自运维资源池须填入队列名称，托管资源池须填入队列Id|
|jobId|String|是|Body 参数|训练任务ID|
|podName|String|是|Body 参数|训练任务节点名称|
|handshakeTimeoutSecond|String|否|Body 参数|连接超时参数，仅在建立连接时使用，单位秒，默认值30，最小值1|
|pingTimeoutSecond|String|否|Body 参数|心跳超时参数，单位秒，默认值900，最小值1，最大值3600|

### 返回头域
除公共头域，无其它特殊头域。

### 返回参数
|名称|类型|说明|
|-|-|-|
|requestId|String|请求ID|
|webTerminalUrl|String|WebTerminal的连接地址|

### 请求示例
```json
{ 
    "jobId": "job-0hy1pdtr3r7y",
    "podName": "job-0hy1pdtr3r7y-worker-0"
}
```

### 返回示例
```json
{
  "requestId": "2f2d2ab7-2c8e-45fd-a562-8bbded9ef77f",
  "webTerminalUrl": "wss://cce-webshell-bj.bce.baidu.com/api/v1/containerwebshell/establish/ppsurbh9ro763fmyx1ueaws6une8ek5mg3t3tt268ta8gmayngaf4ziw66fzu10iq1r4clpxuif547ux6p93vt98d0v24e9t5rm29qofxsti41lt1wntydhr7pkx8cyt?handshakeTimeoutSecond=30&pingTimeoutSecond=900"
}
```
