Qwen2 是通义千问发布的大模型系列，包含多个基础语言模型和指令微调模型，参数范围从 0.5B 到 720 亿参数，其中包括一个混合专家（MoE）模型。
## 模型介绍
与包括之前发布的 Qwen1.5 在内的最先进的开源语言模型相比，Qwen2 总体上超越了大多数开源模型，并在针对语言理解、语言生成、多语言能力、编码、数学、推理等领域的一系列基准测试中，展现出了与专有模型相媲美的竞争力。

Qwen2-72B-Instruct 支持最长 131,072 个 token 的上下文长度，能够处理超长的输入文本。

## 模型细节
Qwen2 是一系列不同规模的解码器语言模型。对于每种规模，都发布了基本语言模型和对齐的聊天模型。该系列基于 Transformer 架构，具有 SwiGLU 激活、注意力 QKV 偏置、组查询注意力等技术。此外，还改进了标记器，可适应多种自然语言和代码。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data '{
    "model": "Qwen2-72B-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```

