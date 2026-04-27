## 模型介绍
Kimi-Linear-48B-A3B-Instruct 是月之暗面于 2025年11月8日 正式开源的混合线性注意力架构大语言模型。该模型采用混合专家（MoE）架构，总参数量 480 亿，激活参数量 30 亿。

该模型是一种混合线性注意力架构，在各种上下文中（包括短、长和强化学习（RL）扩展机制）都优于传统的全注意力方法。 其核心是Kimi Delta Attention (KDA)——这是Gated DeltaNet的一个改进版本，引入了更高效的门控机制，以优化有限状态RNN内存的使用。

该模型在长上下文任务中实现了卓越的性能和硬件效率。它可以将大KV缓存的需求减少多达75%，并将解码吞吐量提高到原来的6倍，适用于长达1M token的上下文。

## 模型特点

* **Kimi Delta Attention (KDA): **一种线性注意力机制，通过细粒度门控改进了门控delta规则。

* **混合架构: **3:1的KDA到全局MLA比率减少了内存使用，同时保持或超越了全注意力的质量。

* **卓越的性能: **在多种任务中优于全注意力，包括长上下文和RL风格的基准测试，在1.4T token的训练运行中进行了公平比较。

* **高吞吐量: **实现了高达6倍的解码速度，并显著减少了每个输出token的时间 (TPOT)。

## 模型架构
![kimi_linear_48b_a3b_instruct_arch.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/kimi_linear_48b_a3b_instruct_arch_bc06602.png)

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Kimi-Linear-48B-A3B-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
