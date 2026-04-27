## 模型介绍

InternVL3.5 系列模型是 InternVL 系列中全新的开源多模态模型，其在多功能性、推理能力和推理效率方面实现了显著提升。一个关键的创新是级联强化学习 (Cascade RL) 框架，该框架通过两阶段过程增强推理能力：离线 RL 用于稳定收敛，在线 RL 用于精细对齐。这种从粗到细的训练策略在下游推理任务上带来了大幅性能提升，例如 MMMU 和 MathVista。

为了优化推理效率，通过一种视觉分辨率路由器 (ViR)，它可在不牺牲性能的前提下动态调整视觉 token 的分辨率。结合 ViR，通过视觉-语言解耦部署（DvD）策略，将视觉编码器与语言模型分别部署在不同 GPU 上，有效平衡计算负载。

这些贡献共同使 InternVL3.5 在整体推理性能上比其前身（即 InternVL3）提高了 +16.0%，并且推理速度提高了 4.05 倍。此外，InternVL3.5 支持新的功能，如 GUI 交互和实体代理。

值得注意的是，该系列最大的模型 InternVL3.5-241B-A28B 在开源多模态大语言模型（MLLMs）中，于通用多模态、推理、文本及智能体任务上均取得了当前最优（state-of-the-art）结果，显著缩小了与 GPT-5 等领先商业模型之间的性能差距。且所有模型与代码均已公开。

## 模型参数

|模型|视觉参数|语言参数|总参数|
|:--|:--|:--|:--|
|InternVL3.5-1B|0.3B|0.8B|1.1B|
|InternVL3.5-2B|0.3B|2.0B|2.3B|
|InternVL3.5-4B|0.3B|4.4B|4.7B|
|InternVL3.5-8B|0.3B|8.2B|8.5B|
|InternVL3.5-14B|0.3B|14.8B|15.1B|
|InternVL3.5-38B|5.5B|32.8B|38.4B|
|InternVL3.5-20B-A4B|0.3B|20.9B|21.2B-A4B|
|InternVL3.5-30B-A3B|0.3B|30.5B|30.8B-A3B|
|InternVL3.5-241B-A28B|5.5B|235.1B|240.7B-A28B|

## 模型架构

InternVL3.5 这一系列模型遵循了之前版本（InternVL）采用的 "ViT–MLP–LLM" 范式。 使用 Qwen3 系列和 GPT-OSS 初始化语言模型，使用 InternViT-300M 和 InternViT-6B 初始化视觉编码器。同时还保留了在 InternVL1.5 中引入的动态高分辨率策略。

![internVL3_5-arch.jpg](https://bce.bdstatic.com/doc/bce-doc/AIHC/internVL3_5-arch_8f56772.jpg)

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "<MODEL_NAME>",
    "messages": [{"role": "user","content": [{"type": "text", "text": "请描述这张图片的内容"},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/dog_e941a21.jpeg"}}]}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```