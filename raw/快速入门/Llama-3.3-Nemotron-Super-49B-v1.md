Llama-3.3-Nemotron-Super-49B-v1 是英伟达开源基于 Llama-3.3-70B-Instruct微调的大语言模型，专注于推理能力优化，针对人类对话偏好、RAG和工具调用等任务进行了后训练。该模型支持 128K tokens 的超长上下文窗口。Llama-3.3-Nemotron-Super-49B-v1 在模型精度与效率之间实现了出色的平衡，大幅降低了模型的显存占用，能够处理更大规模的负载。

## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9a3d920.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Llama-3.3-Nemotron-Super-49B-v1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0.6
    "top_p": 0.95
}'
```

## 授权条款
本模型可商用，授权条款遵循 [NVIDIA Open Model License](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-open-model-license/ )
和 [Llama 3.3 Community License Agreement](https://www.llama.com/llama3_3/license/)