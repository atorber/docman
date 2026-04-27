Llama-3_1-Nemotron-Ultra-253B-v1是英伟达开源基于Llama-3.1-405B-Instruct微调的推理模型，参数量253B。专注于推理、聊天偏好和任务以及 RAG和工具调用，支持 128K tokens 上下文长度。


## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9a3d920.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Llama-3_1-Nemotron-Ultra-253B-v1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0.6
    "top_p": 0.95
}'
```

## 授权条款
本模型可商用，授权条款遵循 [NVIDIA Open Model License](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-open-model-license/)
和 [Llama 3.1 Community License Agreement](https://www.llama.com/llama3_1/license/)