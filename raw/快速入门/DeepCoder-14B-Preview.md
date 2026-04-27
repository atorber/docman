<!-- https://zhuanlan.zhihu.com/p/1893707250306093385 -->
## 模型介绍

DeepCoder-14B-Preview 是由 Agentica 团队 与 Together AI 联合发布的开源代码推理模型。该模型以仅 14B 参数的规模，在代码推理性能上达到了与 OpenAI 闭源模型（o3-mini、o1）相媲美的水平，是开源代码大模型领域的重要突破。

## 模型架构

- **基座模型**: 基于DeepSeek-R1-Distilled-Qwen-14B进行精心微调

- **参数规模**: 14B（140亿参数）

- **训练方法**: GRPO+ 强化学习 + 迭代上下文延长技术

- **上下文窗口**: 

  - 训练: 32K tokens

  - 推理: 可外推至 64K tokens

与基础模型相比，DeepCoder-14B 在长上下文代码推理上的泛化能力显著提升，能够处理大型代码库并保持连贯的高质量输出。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl -X POST '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
-d '{
    "model": "DeepCoder-14B-Preview",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
