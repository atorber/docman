# 模型介绍

Qwen3-30B-A3B-Instruct-2507 是通义千问系列于 2025年7月 发布的最新一代大语言模型。该模型为混合专家（MoE）架构，总参数量305亿，激活参数量33亿，配置128个专家节点（每次激活8个）。它是 Qwen3-30B-A3B 系列的优化版本，专注于非思考模式（即快速响应模式）的指令遵循能力，旨在以极低的推理成本提供媲美更大规模模型的性能。

## 模型特性

* **显著提升**了通用能力，包括指令执行、逻辑推理、文本理解、数学、科学、编程和工具使用。

* 在**多种语言**中的长尾知识覆盖方面取得了重大进展。

* 在**主观和开放式任务**中与用户偏好更好地对齐，使响应更加有用，生成的文本质量更高。

* 提升了**256K长上下文理解**的能力。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Qwen3-30B-A3B-Instruct-2507",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
