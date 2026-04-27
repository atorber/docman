### 接口描述
摘除Pod流量

### 请求结构
```bash
POST ?action=DisableServicePod&serviceId=serviceId&instanceId=instanceId&block=true
HTTP/1.1
Host:aihc.bj.baidubce.com
version: v2
Authorization:authorization string 
```
### 请求头域
除公共头域外，无其它特殊头域。

### 请求参数
|参数名|参数类型|是否必须|参数位置|参数说明|
|-|-|-|-|-|
|serviceId|String|是|Query参数|服务ID|
|instanceId|String|是|Query参数|实例ID，单机情况下是服务下某个pod的id，分布式情况下是指某个实例组的Id，该实例一般包含一个或多个pod|
|block|Boolean|是|Query参数|是否封锁流量，不填默认false|

### 返回头域
除公共头域，无其它特殊头域。

### 返回参数
|参数名称|类型|说明|
|-|-|-|
|requestId|String|请求唯一标识|

### 请求示例
```bash
POST ?action=DisableServicePod&serviceId=s-f9c14dcf3da2&instanceId=s-f9c14dcf3da2-595b6bcc54-7jms9&block=true
HTTP/1.1
Host:aihc.bj.baidubce.com
version: v2
Authorization: bce-auth-v1/f81d3b34e48048fbb2634dc7882d7e21/2024-08-11T04:17:29Z/3600/host/74c506f68c65e26c633bfa104c863fffac5190fdec1ec24b7c03eb5d67d2e1de

```
### 返回示例
```bash
HTTP/1.1 200 OK
x-bce-request-id: 623d8716-17a3-4285-96fd-ab41e3c15d93
Date:Thu, 24 Apr 2025 15:45:43 GMT
Content-Type: application/json;charset=UTF-8
Server: Service
{
    "requestId": "623d8716-17a3-4285-96fd-ab41e3c15d93"
}
```
