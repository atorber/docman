### 接口描述
拉取服务pod列表

### 请求结构
```bash
GET ?action=DescribeServicePods&serviceId=serviceId
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
|serviceId|String|是|Query参数|操作对象|

### 返回头域
除公共头域，无其它特殊头域。

### 返回参数
|参数名称|类型|说明|
|-|-|-|
|requestId|String|请求唯一标识|
|pods|List<[InsInfo](AIHC/API参考/数据结构.md#InsInfo)>|实例列表|

### 请求示例
```bash
GET ?action=DescribeServicePods&serviceId=s-f9c14dcf3da2
HTTP/1.1
Host:aihc.bj.baidubce.com
version: v2
Authorization: bce-auth-v1/f81d3b34e48048fbb2634dc7882d7e21/2024-08-11T04:17:29Z/3600/host/74c506f68c65e26c633bfa104c863fffac5190fdec1ec24b7c03eb5d67d2e1de

```
### 返回示例
```bash
HTTP/1.1 200 OK
x-bce-request-id: 1214cca7-4ad5-451d-9215-71cb844c0a50
Date:Thu,
24 Apr 2025 15: 27: 43 GMT
Content-Type: application/json;charset=UTF-8
Server: Service
{
    "pods": [
        {
            "containers": [
                {
                    "container": {
                        "command": [
                            "/bin/sh",
                            "-c",
                            "sleep inf"
                        ],
                        "cpus": 1,
                        "image": {
                            "imageUrl": "registry.baidubce.com/inference/vllm-openai:v0.8.3"
                        },
                        "memory": 2,
                        "name": "custom-container",
                        "ports": [
                            {
                                "name": "HTTP",
                                "port": 10089
                            }
                        ]
                    },
                    "status": {
                        "containerStatus": "Running",
                        "createdAt": 1745465654
                    }
                }
            ],
            "instanceId": "s-f9c14dcf3da2-595b6bcc54-7jms9-0",
            "status": {
                "availableContainers": 1,
                "createdAt": 1745465590,
                "nodeIP": "10.0.7.38",
                "podIP": "10.0.50.97",
                "status": "Running",
                "totalContainers": 1
            }
        },
        {
            "containers": [
                {
                    "container": {
                        "command": [
                            "/bin/sh",
                            "-c",
                            "sleep inf"
                        ],
                        "cpus": 1,
                        "image": {
                            "imageUrl": "registry.baidubce.com/inference/vllm-openai:v0.8.3"
                        },
                        "memory": 2,
                        "name": "custom-container",
                        "ports": [
                            {
                                "name": "HTTP",
                                "port": 10089
                            }
                        ]
                    },
                    "status": {
                        "containerStatus": "Running",
                        "createdAt": 1745465672
                    }
                }
            ],
            "instanceId": "s-f9c14dcf3da2-595b6bcc54-7jms9-1",
            "status": {
                "availableContainers": 1,
                "createdAt": 1745465590,
                "nodeIP": "10.0.7.38",
                "podIP": "10.0.50.129",
                "status": "Running",
                "totalContainers": 1
            }
        }
    ],
    "requestId": "f639e7a2-e596-4bee-97bb-9e27b265155d"
}
```
