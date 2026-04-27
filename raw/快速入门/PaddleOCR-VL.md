## 模型介绍

PaddleOCR-VL是一款专为文档解析而设计的、资源高效的 SOTA 模型。其核心组件是 PaddleOCR-VL-0.9B，这是一款紧凑而强大的视觉语言模型，它将 NaViT 风格的动态分辨率视觉编码器与 ERNIE-4.5-0.3B 语言模型相结合，从而实现精准的元素识别。这款创新模型高效支持 109 种语言，尤其擅长识别复杂元素（例如文本、表格、公式和图表），同时保持极低的资源消耗。通过在广泛使用的公共基准测试和内部基准测试上的全面评估，PaddleOCR-VL 在页面级文档解析和元素级识别方面均达到了 SOTA 的性能水平。它显著优于现有解决方案，与顶级 VLM 相比也极具竞争力，并拥有快速的推理速度。这些优势使其非常适合在实际应用场景中部署。


## 核心功能

* **紧凑而强大的视觉语言模型架构**

该模型专为资源高效推理而设计，在元素识别方面表现出色。通过将 NaViT 风格的动态高分辨率视觉编码器与轻量级的 ERNIE-4.5-0.3B 语言模型相集成，我们显著提升了模型的识别能力和解码效率。这种集成在保持高精度的同时降低了计算需求，使其非常适合高效实用的文档处理应用
* **文档解析性能达到最先进水平**

PaddleOCR-VL 在页面级文档解析和元素级识别方面均实现了最先进的性能。它显著优于现有的基于流水线的解决方案，并在文档解析方面与领先的视觉语言模型 (VLM) 展开了激烈的竞争。此外，它还擅长识别复杂的文档元素，例如文本、表格、公式和图表，使其适用于各种具有挑战性的内容类型，包括手写文本和历史文档。这使其具有高度的通用性，适用于各种文档类型和应用场景。
* **多语言支持**

PaddleOCR-VL 支持 109 种语言，涵盖全球主要语言，包括但不限于中文、英文、日文、拉丁文和韩文，以及采用不同文字和结构的语言，例如俄语（西里尔字母）、阿拉伯语、印地语（梵文）和泰语。如此广泛的语言覆盖范围显著提升了我们系统在多语言和全球化文档处理场景中的适用性。

## 模型架构
![paddleocrvl_arch.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/paddleocrvl_arch_72b0dd4.png)


## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
  "model": "PaddleOCR-VL",
  "messages": [{"role": "user","content": [{"type": "text", "text": "Free OCR."},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/receipt_552c243.png"}}]}],
  "max_tokens": 1024,
  "temperature": 0.3
}'
```

