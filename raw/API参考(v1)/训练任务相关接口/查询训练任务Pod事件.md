### 描述

获取任务某个Pod的系统事件

### 请求结构

```bash
GET /api/v1/aijobs/{jobId}/pods/{podName}/events
Host:aihc.bj.baidubce.com
Authorization:authorization string
ContentType: application/json    
```

### 请求头域

除公共头域外，无其它特殊头域。

### 请求参数

| 参数名称       | 类型   | 是否必须 | 参数位置   | 说明                                                |
| -------------- | ------ | -------- | ---------- | --------------------------------------------------- |
| jobId          | String | 是       | Path 参数  | 训练任务ID                                          |
| podName        | String | 是       | Path 参数  | 训练任务节点名称                                    |
| jobFramework   | String | 是       | Query 参数 | 训练任务框架类型，当前支持 "PyTorchJob" 和 "MPIJob" |
| resourcePoolId | String | 是       | Query 参数 | 标识资源池的唯一标识符                              |
| startTime      | String | 否       | Query 参数 | 任务pod事件的起始时间，默认为 Pod 创建时间          |
| endTime        | String | 否       | Query 参数 | 任务pod事件的结束时间，默认为 now                   |

### 返回头域

除公共头域，无其它特殊头域。

### 返回参数

| 参数名称  | 类型                                                  | 说明                 |
| --------- | ----------------------------------------------------- | -------------------- |
| requestId | String                                                | 请求ID               |
| result    | [PodEventResult](AIHC/API参考(v1)/附录.md#PodEventResult) | 成功请求时的返回结果 |

### 返回示例

```json
{
  "events": [
    {
      "reason": "Started",
      "message": "Started container ftagent",
      "firstTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Pulled",
      "message": "Successfully pulled image \"registry.baidubce.com/cce-plugin-pro/ftagent:v1.6.16\" in 83.42021ms",
      "firstTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Started",
      "message": "Started container pytorch",
      "firstTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Created",
      "message": "Created container ftagent",
      "firstTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Pulling",
      "message": "Pulling image \"registry.baidubce.com/cce-plugin-pro/ftagent:v1.6.16\"",
      "firstTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:10 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Created",
      "message": "Created container pytorch",
      "firstTimestamp": "2024-07-16 02:36:08 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:08 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Pulled",
      "message": "Successfully pulled image \"registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release\" in 301.668397ms",
      "firstTimestamp": "2024-07-16 02:36:08 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:08 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Pulling",
      "message": "Pulling image \"registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release\"",
      "firstTimestamp": "2024-07-16 02:36:08 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:08 +0000 UTC",
      "count": 1,
      "type": "Normal"
    },
    {
      "reason": "Scheduled",
      "message": "Successfully assigned default/test-api-llama2-7b-4-master-0 to 192.168.12.179",
      "firstTimestamp": "2024-07-16 02:36:07 +0000 UTC",
      "lastTimestamp": "2024-07-16 02:36:07 +0000 UTC",
      "count": 1,
      "type": "Normal"
    }
  ],
  "total": 9
}
```