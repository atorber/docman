### 描述
获取任务某个Pod的系统事件

### 请求结构
```bash
POST ?action=DescribePodEvents&resourcePoolId=xxxx&queueID=xxxx
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
|startTime|String|否|Body 参数|任务pod事件的起始时间，默认为 Pod 创建时间|
|endTime|String|否|Body 参数|任务pod事件的结束时间，默认为 now|

### 返回头域
除公共头域，无其它特殊头域。

### 返回参数
|参数名称|类型|说明|
|-|-|-|
|requestId|String|请求ID|
|events|[PodEvents](AIHC/API参考/数据结构.md#PodEvents)&ZeroWidthSpace;|成功请求时的返回结果|
|total|Number|事件总数|

### 请求示例
```json
{ 
    "jobId": "job-xf3iqxrm6pyk",
    "podName": "job-xf3iqxrm6pyk-worker-0"
}
```

### 返回示例
```json
{
    "events": [],
    "requestId": "6fe43c4b-5ff5-4ae3-bca6-011815d63bd9",
    "total": 0
}
```
