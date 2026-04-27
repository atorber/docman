DeepSeek-OCR 采用光学 2D 映射技术压缩长上下文，以更少的视觉Token实现高精度OCR识别，并在文档处理领域展现出显著实用价值。

## 核心创新

* **上下文光学压缩**

通过视觉 Token 替代文本 Token，实现更高压缩率（如 10× 压缩下精度达 97%；20× 压缩比下，精度约 60%）

* **端到端架构**

统一编码器（DeepEncoder）+ 解码器（DeepSeek3B-MoE）设计，支持多分辨率输入
* **实用性能**

在 OmniDocBench 基准测试中，以更少视觉 Token 超越 GOT-OCR2.0 和 MinerU2.0

## 模型架构
![ds-ocr-arch.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/ds-ocr-arch_d2c2040.png)


## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: <TOKEN>" \
-d '{
  "model": "DeepSeek-OCR",
  "messages": [{"role": "user","content": [{"type": "text", "text": "Free OCR."},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/receipt_552c243.png"}}]}],
  "max_tokens": 1024,
  "temperature": 0.3
}'
```

