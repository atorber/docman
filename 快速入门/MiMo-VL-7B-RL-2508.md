MiMo-VL-7B-RL-2508 是小米于2025年8月开源的多模态大模型，参数规模 70 亿，基于 Qwen2.5-ViT 视觉编码器和自研 MiMo-7B 语言模型构建，采用四阶段预训练策略以及混合在线强化学习（MORL）框架进行训练。

## 模型特性

MiMo-VL（MiMo-VL-7B-RL-2508 和 MiMo-VL-7B-SFT-2508）进行了一系列改进，包括在多个基准测试中的性能提升、增强的思维控制能力和更好的用户体验等。

* **性能提升**

    MiMo-VL-7B-RL-2508 在图像和视频基准测试中表现出一致的改进，达到了 MMMU 上的 70.6 和 VideoMME 上的 70.8 的显著里程碑。

* **思维控制功能**

    一种思维控制能力，允许用户使用 no_think 参数关闭模型的推理模式：

    - 思维模式（默认行为）：完全可见的推理过程，100% 控制成功率；

    - 非思维模式：直接响应，无推理，99.84% 控制成功率。

* **增强的用户体验**

    VLM Arena 评分从 1093.9 提升至 1131.2，实际性能有显著提升。

## 模型架构
![mimo-7b-arch.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/mimo-7b-arch_694f6d8.png)

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "MiMo-VL-7B-RL-2508",
    "messages": [{"role": "user","content": [{"type": "text", "text": "请描述这张图片的内容"},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/dog_e941a21.jpeg"}}]}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```