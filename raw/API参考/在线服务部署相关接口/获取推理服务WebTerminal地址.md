  
# 获取推理服务WebTerminal地址
## 描述
获取推理服务中指定实例的web Terminal

## 请求结构
```
POST ?action=DescribeServiceWebterminal
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json
X-API-Version: v2    
```
## 请求头域
除公共头域外，无其它特殊头域。

## 请求参数
|参数名称|类型|是否必须|参数位置|说明|
|-|-|-|-|-|
|resourcePoolId|String|是|Body 参数|自运维资源池传递资源池唯一标识（示例：cce-1uji3ib5），托管资源池传递 aihc-serverless|
|queue|String|是|Body 参数|训练任务所属队列，自运维资源池须填入队列名称，托管资源池须填入队列Id|
|resourcePoolType|String|是|Body 参数|资源池类型,取值为“”、serverless、public，空字符串为自运维资源池，serverless是全托管资源池，public预留字段暂未使用|
|serviceId|String|是|Body 参数|服务ID|
|instanceId|String|是|Body 参数|实例ID|
|handshakeTimeoutSecond|Integer|否|Body 参数|连接超时参数，仅在建立连接时使用，单位秒，默认值30，最小值30，最大值9999|
|pingTimeoutSecond|Integer|否|Body 参数|心跳超时参数，单位秒，默认值900，最小值30，最大值3600|

## 返回头域
除公共头域，无其它特殊头域。

## 返回参数
|名称|类型|说明|
|-|-|-|
|requestId|String|请求ID|
|WebTerminalUrl|String|WebTerminal的连接地址|

## 请求示例
```
{
    "serviceId": "s-r6531bcd74d9",
    "instanceId": "s-r6531bcd74d9-65c9b6958f-h9gq6",
    "resourcePoolId": "aihc-serverless",
    "queue": "aihcq-21wqq2l2zris",
    "resourcePoolType":"serverless",
    "commandType": "sh"
}
```
## 返回示例
```json
{
    "requestId": "ad719b9d-e8ab-493f-9739-f67009ff65b0",
    "webTerminalUrl": "wss://cce-webshell-bj.bce.baidu.com/api/v1/containerwebshell/establish/hizbhf7z8xdd17ipk71utdbqq3upj4cwv6nngp77rrw8a1gapqcv4esxdg93xrm5x0i3nw6w03pl0igrhil9o9xjt3cp73a9shtpxhgnmbv8k32z2p1tc113i2z544g1?handshakeTimeoutSecond=30\u0026pingTimeoutSecond=900"
}
```

