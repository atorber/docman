## 模型介绍

Sarvam-30B 是 Sarvam AI 推出的混合专家（MoE）模型，总参数约为30B，每个 Token 仅激活约 2.4B 参数，主要面向实际部署场景。它融合了强大的推理能力、可靠的代码生成能力，以及在印度语言中一流的对话质量。Sarvam-30B 专为在资源受限的环境中稳定运行而设计，能够同时处理多语言语音通话和工具调用。

该模型在训练过程中特别注重印度语境和语言，使其在同规模模型中实现了 22 种印度语言上的最先进性能。

## 模型架构

该模型旨在实现高吞吐量和内存效率。它采用 19 层结构，密集前馈网络（FFN）的 intermediate_size 为 8192，moe_intermediate_size 为 1024，使用 top-6 路由策略、分组 KV 头（num_key_value_heads=4），以及极高的 rope_theta（8e6），以在不使用 RoPE 缩放的情况下保证长上下文稳定性。该模型包含 128 个专家（含一个共享专家）、路由缩放因子为 2.5，并采用无辅助损失的路由器平衡机制。该模型通过减少层数、使用分组 KV 注意力机制和更小的专家模块，专注于提升吞吐量和内存效率。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "sarvam-30b",
    "messages": [{"role": "system", "content": "You are a helpful AI assistant."}, {"role": "user", "content": "Who wrote The Picture of Dorian Gray?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```