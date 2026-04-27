GPT OSS 是 OpenAI 推出的 重量级开放模型，面向强推理、智能体任务以及多样化开发场景。该系列包含两款模型：拥有 117B 参数的 gpt‑oss‑120b 和拥有 21B 参数的 gpt‑oss‑20b。二者皆采用MoE架构，并在 MoE 权重上使用 4‑bit 量化方案 MXFP4。由于 active 参数更少，资源占用低的同时实现了快速推理。

## 能力与架构概览

### 完整思维链（Full Chain-of-Thought）

支持推理过程追溯，便于调试与分析（不推荐直接展示给终端用户）

### 支持微调（Fine-Tunable）

可针对特定场景优化模型参数

### 智能体（Agent）能力

函数调用（Function Calling）

网页浏览（Web Browsing）

Python 代码执行（Code Execution）

结构化输出（Structured Outputs）

### 高效量化（MXFP4 原生支持）

专家混合层（MoE）采用 MXFP4 低精度训练，显著降低计算资源需求

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2.调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "GPT-OSS-120B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```