DeepSeek-R1是基于DeepSeek-V3-Base训练的高性能推理模型。本文将指导您如何使用AIAK推理加速镜像在百舸平台快速部署DeepSeek-R1模型，提升模型推理性能。


## 前置条件
1. 创建H20机型的全托管资源池；
注意：购买H20机器需要先联系百度售前工程师开通白名单
2. 开通PFS与资源池关联。

## 准备模型文件
从平台预置的BOD路径下载到CFS或PFS,平台已提供DeepSeek-R1模型权重文件存储在BOS对象存储中，您可以从平台提供的BOS路径中下载模型。

1. 登录节点安装BOSCMD https://cloud.baidu.com/doc/BOS/s/qjwvyqegc 并完成BOSCMD配置置 https://cloud.baidu.com/doc/BOS/s/Ejwvyqe55

2. 从平台提供的BOS地址中拷贝权重文件到PFS存储中：

```
下载DeepSeek-R1模型文件
./bcecmd bos sync bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1 /mnt/pfs/DeepSeek-R1
下载MTP使能依赖的小模型文件
./bcecmd bos sync bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1-NextN /mnt/pfs/DeepSeek-R1-NextN
```

## 部署模型
 1. 登录百舸AI计算平台；
 2. 在左侧导航中选择 **在线服务部署 **；
 3. 进入在线服务列表页面点击 **部署服务**；
 4. 填写部署服务需要的参数：
    <br> a. 输入服务名称，选择需要部署的全托管资源池；
    <br> b.服务镜像选择 **百舸预置镜像** 中的 **aiak-inference-vllm**镜像，镜像版本为ubuntu22.04-cu12.4-torch2.6.0-py310_2.1.0.0
    <br> c.输入以下启动命令：

```
export SGL_ENABLE_JIT_DEEPGEMM=1
export SGL_DISABLE_TP_MEMORY_INBALANCE_CHECK=1
export SGL_JIT_DEEPGEMM_PRECOMPILE=1
R1_MODEL_PATH=/pfs/pfs-iQ14no/models/DeepSeek-R1 #更改为实际路径
NextN_MODEL_PATH=/pfs/pfs-iQ14no/models/DeepSeek-R1-NextN #更改为实际路径
TP=8
PORT=8000
max_running_requests=512 #可结合业务场景调整

python3 -m sglang.launch_server \
    --model-path "$R1_MODEL_PATH" \
    --tp "$TP" \
    --trust-remote-code \
    --port "$PORT" \
    --host 0.0.0.0 \
    --mem-fraction-static 0.85 \
    --max-running-requests "$max_running_requests" \
    --attention-backend flashinfer \
    --speculative-algorithm NEXTN \
    --speculative-draft "$NextN_MODEL_PATH" \
    --speculative-num-steps 3 \
    --speculative-eagle-topk 1 \
    --speculative-num-draft-tokens 4 \
    --chunked-prefill-size=12288

```  

   <br> d.挂载存储模型权重文件和MTP使能小模型文件的PFS源路径和容器目标路径；
   <br> e.填写服务访问端口；
   
5.部署服务，等待服务状态为“运行中”即可调用。

## 调用模型服务 
1. 在服务列表中查看调用地址

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_dfca09a.png)

2. 请求示例

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


