## 模型介绍
InternLM3 开源了一个80亿参数的指令模型 InternLM3-8B-Instruct，专为通用用途和高级推理而设计。该模型具有以下特点：

* **以更低成本实现更强性能**

在推理和知识密集型任务上的最先进性能超越了 Llama3.1-8B 和 Qwen2.5-7B 等模型。值得注意的是，InternLM3 仅使用4万亿个高质量标记进行训练，相比同等规模的其他LLM节省了75%以上的训练成本。

* **深度思考能力**

InternLM3 支持深度思考模式，通过长链思维解决复杂推理任务，同时也支持流畅用户交互的正常响应模式。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl -X POST '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
-d '{
    "model": "internlm3-8b-instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
