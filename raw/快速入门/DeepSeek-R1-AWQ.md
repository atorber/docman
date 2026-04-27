## 模型介绍

DeepSeek-R1-AWQ 是社区基于 DeepSeek-R1 官方模型推出的 AWQ 量化优化版本，属于面向高效部署的大语言模型，核心定位是 “高精度 + 低资源占用”，兼顾推理性能和部署成本，以下是核心特征：

* **原生 DeepSeek-R1**：是深度求索自研的 Decoder-only 大语言模型，参数规模涵盖 7B/16B/32B/70B 等版本，主打通用推理、代码生成、数学计算、长文本处理，原生版本采用 FP16/FP32 精度，显存占用高；

*  **AWQ 量化改造**：基于Activation-aware Weight Quantization（AWQ，激活感知权重量化） 技术，将模型从 FP16/FP32 量化为 INT4/INT8 精度，在几乎不损失推理精度的前提下，大幅降低显存占用（约 70%）和推理延迟（提升 2-3 倍）。

## 模型架构

* DeepSeek-R1-AWQ 的架构分为 “原生 DeepSeek-R1 基础架构” 和 “AWQ 量化适配架构” 两部分，核心是在原生 Transformer 架构上做量化优化，而非颠覆式重构；

* 核心框架是 Decoder-only Transformer（与 GPT、Llama、Phi 系列一致），AWQ 是 DeepSeek-R1-AWQ 的核心，区别于普通的 “均匀量化”，其核心是 “激活感知的权重量化”，只对关键层做低精度量化，非关键层保留 FP16 以减少精度损失。


## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl -X POST '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
-d '{
    "model": "DeepSeek-R1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
