
# 模型介绍 #
InternVL3 系列是由上海人工智能实验室（OpenGVLab）研发的开源多模态大语言模型（MLLM）家族，涵盖 1B 至 78B 等不同参数量版本（模型 ID：203001-203007），专为跨模态信息理解与生成任务设计。该系列突破传统 “文本模型后适配多模态” 的范式限制，通过原生多模态预训练实现视觉与语言能力的深度融合，在保持高效部署灵活性的同时，达到开源领域 SOTA 性能。​

## 核心特性：​

原生多模态融合：采用单阶段联合训练方案，将图像 - 文本、视频 - 文本等多模态数据与纯文本语料混合训练，所有参数同步优化，避免模态对齐脱节问题，文本性能较 Qwen2.5 系列进一步提升。​

全场景能力覆盖：支持图像分类、目标检测、视觉问答（VQA）、OCR 识别、图表理解、视频描述、3D 视觉感知、GUI 交互等多元任务，可适配工业分析、具身智能等复杂场景。​

高性能与鲁棒性：在 MMMU 等权威基准测试中接近 GPT-4o、Claude 3.5 Sonnet 等闭源模型水平，通过随机 JPEG 压缩训练增强真实场景适应性。​

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "<model_name>",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```


