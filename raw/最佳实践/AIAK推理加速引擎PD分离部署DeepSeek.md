本文将为您介绍如何在百舸平台通过多角色服务组功能在8台Hopper架构服务器，使用AIAK推理引擎 PD分离部署 DeepSeek R1。

## 前置条件
### 准备资源
1. 创建百舸全托管资源池，购买8台支持RDMA的Hopper架构服务器
2. 开通PFS或CFS存储并与资源池绑定

*购买资源需开通白名单，请联系百度售前工程师*

### 准备数据
为了提升部署服务效率，百舸已将常用模型下载到BOS存储中，您可以直接通过BOSCMD工具拉取模型文件到自己的文件系统中，除了模型权重文件，还需要拉取对应模型的NextN文件。

BOSCMD工具拉取模型命令示例：

```
./bcecmd bos sync bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1 /mnt/model/DeepSeek-R1
./bcecmd bos sync bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1 /mnt/model/DeepSeek-R1-NextN
```
|模型名称|BOS路径|
|-|-|
|DeepSeek-R1|bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1-0528|
|DeepSeek-V3|bos:/aihc-models-bj/deepseek-ai/DeepSeek-V3.1|
|DeepSeek-R1|bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1|
|DeepSeek-V3|bos:/aihc-models-bj/deepseek-ai/DeepSeek-V3|
|DeepSeek-R1-NextN|bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1-NextN|
|DeepSeek-V3-NextN|bos:/aihc-models-bj/deepseek-ai/DeepSeek-V3-NextN|

Tips：
模型路径需要根据您资源所在的Region适当调整，示例路径中的 bj 代表北京 Region，可替换为资源位置首字母缩写。

### 部署服务
1.登录百舸AI计算平台AIHC控制台，点击左侧导航栏中的 在线服务部署 进入列表页面；

2.切换到 **多角色服务组** 页签，点击 **部署多角色服务组** ；

3.正确填写服务名称及以下参数：
#### 服务配置

* **分别配置Prefill和Decode服务参数**

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_4f5287a.png)


| 参数名称 |参数说明  |
| --- | --- |
| 资源队列 | 选择需要部署的算力所属全托管资源池队列，资源配置请选择Hopper架构的算力 |
| 资源规格 | 资源规格推荐Prefill和Decode分别32卡，CPU 100核，内存 1024G  |
| 实例数| 可以根据业务需求设置Prefill和Decode的期望副本数 |
| 单实例Pod数 | 当前配置推荐单实例Pod数为4，即Prefill和Decode服务分别部署到4台机器  |
| RDMA |当前配置需要多机通讯，建议开启RDMA |
| Kv Cache感知调度 | 开启后平台会感知Prefill节点的缓存命中率，将请求调度到命中率高的实例  |
| 镜像地址| 平台默认推荐AIAK推理引擎，无需修改|
| 端口| 按需填写端口，可以为端口设置标签，便于多端口调用时区分用途|
| 存储挂载| 挂载模型权重文件 |

* **环境变量**

*以下参数若无特殊需求可以直接使用平台推荐值*

|参数|说明|
|-|-|
|ENABLE_REDUNDANT_EXPERTS|冗余专家使能 如需关闭修改false，并添加环境变量 SET_DEEP_DP_NUM_EXPERTS=256|
|MAX_PREFILL_TOKENS|控制预填充阶段单批处理的最大token数量，推荐值为8192|
|MAX_RUNNING_REQUESTS|限制并发处理的请求数量，推荐值为256|
|MAX_TOTAL_TOKENS|设定单个请求的输入和输出token总数上限，推荐值为300000|
|MEM_FRACTION_STATIC|分配固定比例的GPU内存用于KV Cache等，推荐值为0.95|
|MODEL_DP_SIZE|指定数据并行的GPU数量，推荐值为8|
|MODEL_PATH|需填写模型R1权重文件容器挂载的目标路径，以上图为例：/deepseek|
|MODEL_TP_SIZE|指定张量并行的GPU数量，推荐值为4|
|MODEL_PATH_NEXTN|需填写模型R1权重文件容器挂载的目标路径，以上图为例：/deepseek-nextn|
|CUDA_GRAPH_MAX_BS|使用 CUDA Graph 时允许的最大Batch Size，推荐值为64|

#### 高级配置
共享内存建议设置为400G

#### 流量接入
选择云原生网关，负载均衡策略设置为轮询，正确填写端口号

### 调用服务
部署服务成功后，在服务组中查看PD服务的调用信息。

**调用示例**

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-R1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```