## 模型介绍
Qwen2.5-1M 是 Qwen2.5 系列模型的长上下文版本，支持高达 100 万个 token 的上下文长度。与 Qwen2.5 128K 版本相比，Qwen2.5-1M 在处理长上下文任务方面性能显著提升，同时保持了其在短上下文任务中的出色表现。

## 模型特性

* **类型**：因果语言模型

* **训练阶段**：预训练 & 后训练

* **架构**：带 RoPE、SwiGLU、RMSNorm 和 Attention QKV 偏置的 transformers

* **参数数量**：147 亿

* **非嵌入参数数量**：131 亿

* **层数**：48 层

* **注意力头数（GQA）**：Q 为 40 个，KV 为 8 个

* **上下文长度**：完整 1,010,000 个标记，生成 8192 个标记

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Qwen2.5-14B-Instruct-1M",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
