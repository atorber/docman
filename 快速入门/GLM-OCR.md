## 模型介绍

GLM-OCR 是一款面向复杂文档理解的多模态 OCR 模型，基于 GLM-V 编码器—解码器架构构建，参数仅为0.9B。它引入多令牌预测（Multi-Token Prediction, MTP）损失与稳定的全任务强化学习训练策略，以提升训练效率、识别精度与泛化能力。模型集成了在大规模图文数据上预训练的 CogViT 视觉编码器、具备高效令牌下采样的轻量跨模态连接器，以及 GLM-0.5B 语言解码器。结合基于 PP-DocLayout-V3 的“两阶段”流程（（布局分析与并行识别）），GLM-OCR 能在多样化文档布局下提供稳健且高质量的 OCR 表现。

## 关键特性

* **业界领先的效果：**在 OmniDocBench V1.5 上取得 94.62 分，综合排名第一；并在公式识别、表格识别、信息抽取等主流文档理解基准上达到 SOTA 水平。

* **面向真实场景优化：**针对实际业务需求进行设计与优化，在复杂表格、代码密集文档、印章等各类真实且高难版面场景中依然保持稳定表现。

* **高效推理：**总参数量仅 0.9B，支持通过 vLLM、SGLang 与 Ollama 部署，显著降低推理时延与算力成本，适用于高并发服务与端侧部署。

* **易于使用：**全面开源，并提供完整 SDK 与推理工具链，支持便捷安装、一行调用、以及与现有生产流程的顺滑集成。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl -X POST '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
-d '{
    "model": "GLM-OCR",
    "messages": [{"role": "user","content": [{"type": "text", "text": "请描述这张图片的内容"},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/dog_e941a21.jpeg"}}]}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
