## 模型介绍
Mixtral-8x7B-Instruct-v0.1 是由 Mistral AI 开发的稀疏混合专家模型（Sparse Mixture-of-Experts, SMoE），属于 Mixtral-8x7B 系列的指令微调版本。其核心设计目标是通过稀疏激活机制在保持低推理成本的同时，实现接近70B参数模型的性能，并优化对人类指令的遵循能力。该模型在多语言支持、代码生成、数学推理 等任务中表现突出，性能与 GPT-3.5 相当，甚至在部分基准测试中超越 Llama 2-70B。

## 架构设计：稀疏专家混合（Sparse MoE）

1. **整体架构**

Mixtral-8x7B-Instruct-v0.1 采用 Decoder-Only Transformer 架构，核心创新在于 稀疏专家混合网络（Sparse Mixture-of-Experts, SMoE）。

2. **MoE 核心机制**
* 对于每个输入 Token，路由网络（Router Network）从 8 个专家中选择 Top-2 进行处理。

* 两个选定专家的输出通过加权累加组合，形成最终输出。

* 这种设计使得虽然模型总参数量达 47B，但每个 Token 仅使用约 13B 参数进行计算，推理成本与 13B 规模的稠密模型相当。



## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data '{
    "model": "Mixtral-8x7B-Instruct-v0.1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
