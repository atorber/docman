## 模型介绍

Sarvam-105B 是 Sarvam AI 推出的混合专家（MoE）模型，总参数量105B，激活参数仅约 10.3B，专为在各类复杂任务中实现卓越性能而设计。该模型在复杂推理方面高度优化，尤其在智能体任务、数学和编程方面表现出色。Sarvam-105B 表现顶尖，在多种推理和智能体基准测试中持续媲美或超越多个主流闭源模型，且与前沿模型的差距极小。在实际应用场景（如网络搜索和技术故障排查）中，它展现出卓越的智能体能力和推理能力。

该模型在训练过程中特别关注了印度语境和语言，使其在 22 种印度语言上达到同规模模型中的最先进水平。

## 模型架构

该模型采用 MLA 风格的注意力堆栈，其 QK 头维度解耦（q_head_dim=192，分为 RoPE 和无 RoPE 组件，v_head_dim=128），并使用较大的头维度 576，在保持隐藏层大小为 4096 的同时，提高了每个注意力头的表征带宽。这种方法增强了注意力表达能力，并通过 YaRN 缩放（缩放因子为 40，支持 128K 上下文）提升了长上下文外推能力。模型的 intermediate_size 为 16384，moe_intermediate_size 为 2048，结合 128 个专家中的 top-8 路由机制，在控制激活成本的同时提高了每 token 的活跃容量。该模型包含一个共享专家，路由缩放因子为 2.5，并采用无辅助损失的路由器平衡机制。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "sarvam-105b",
    "messages": [{"role": "system", "content": "You are a helpful AI assistant."}, {"role": "user", "content": "Who wrote The Picture of Dorian Gray?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```