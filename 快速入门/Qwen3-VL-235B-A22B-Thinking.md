Qwen3-VL 是阿里巴巴 Qwen 团队推出的多模态视觉语言模型，在文本理解、视觉感知、推理能力和长上下文处理等多个维度都实现了显著升级。这个系列提供了从轻量到旗舰的多种规格，并具备视觉智能体、空间感知等前沿能力，旨在让 AI 不仅能“看到”，更能真正“理解”世界。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f4a9e84.png)  

## 主要改进

* **视觉代理**

操作 PC/移动 GUI——识别元素、理解功能、调用工具、完成任务
* **可视化编码加速**

从图像/视频生成 Draw.io/HTML/CSS/JS
* **高级空间感知**

判断物体位置、视角和遮挡；提供更强的 2D 基础，并为空间推理和具身人工智能实现 3D 基础
* **长上下文和视频理解**

原生支持 256K 上下文，可扩展至 1M；能够处理书籍和数小时的视频，并具有完全回忆和二级索引功能
* **增强多模态推理能力**

擅长 STEM/数学——因果分析和基于逻辑、证据的答案
* **升级的视觉识别**

更广泛、更高质量的预训练能够“识别一切”——名人、动漫、产品、地标、动植物等
* **扩展的 OCR**

支持 32 种语言（从 19 种增加到 32 种）；在弱光、模糊和倾斜条件下表现更佳；对罕见/古代字符和术语的处理能力更强；改进了长文档结构解析
* **文本理解能力与纯 LLM 相当**

实现无损、统一的文本视觉无缝融合，从而获得统一的理解

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TOKEN" \
-d '{
  "model": "Qwen3-VL-235B-A22B-Thinking",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "请描述这张图片的内容"},
        {"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f4a9e84.png"}}
      ]
    }
  ],
  "max_tokens": 1024,
  "temperature": 0.7
}'
```

