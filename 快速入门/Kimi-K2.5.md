Kimi K2.5 是一个开源的原生多模态智能体模型，在 Kimi-K2-Base 基础上通过约 15 万亿混合视觉与文本 token 的持续预训练构建而成。它无缝融合了视觉与语言理解能力，并具备高级智能体功能，包括即时模式与思考模式，以及对话式与智能体式交互范式。

## 核心特性

* **原生多模态**：在视觉-语言 token 上进行预训练，K2.5 在视觉知识、跨模态推理以及基于视觉输入的智能体工具使用方面表现卓越。

* **视觉驱动的编程**：K2.5 能够根据视觉规范（如 UI 设计、视频工作流）生成代码，并自主编排工具以处理视觉数据。

* **智能体集群**：K2.5 从单智能体扩展演进为自导向、协同式的集群执行架构。它能将复杂任务分解为多个并行子任务，并由动态实例化的领域专用智能体协同执行。

## 模型概要


|  |  |
| --- | --- |
|架构  |混合专家模型（MoE）  |
|总参数量  |1T  |
|激活参数量  |32B  |
|层数（含稠密层）  |61  |
|稠密层数量  |1  |
|注意力隐藏维度  |7168  |
|MoE 隐藏维度（每个专家）  |2048  |
|注意力头数  |64  |
|专家数量  |384  |
|每 token 选择的专家数  |8  |
|共享专家数量  |1  |
|词表大小  |160K  |
|上下文长度  |256K  |
|注意力机制  |MLA  |
|激活函数  |SwiGLU  |
|视觉编码器  |MoonViT  |
|视觉编码器参数量  |4 亿  |

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
--data '{
    "model": "Kimi-K2.5",
    "messages": [{"role": "user","content": [{"type": "text", "text": "请描述这张图片的内容"},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/dog_e941a21.jpeg"}}]}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
