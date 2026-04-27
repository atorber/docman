  
# 模型介绍

dots.ocr 是一个强大的多语言文档解析器，它在一个单一的视觉-语言模型中统一了布局检测和内容识别，同时保持良好的阅读顺序。尽管其基础是紧凑的1.7B参数的大规模语言模型，但它达到了最先进的（SOTA）性能。

强大的性能： dots.ocr 在 OmniDocBench 上实现了文本、表格和阅读顺序的SOTA性能，同时在公式识别方面与更大的模型如Doubao-1.5和gemini2.5-pro相比也具有可比性。

多语言支持： dots.ocr 对低资源语言表现出强大的解析能力，在我们的内部多语言文档基准测试中，在布局检测和内容识别方面都取得了决定性的优势。

统一且简单的架构： 通过利用单一的视觉-语言模型，dots.ocr 提供了一个比依赖复杂多模型流水线的传统方法更简洁的架构。任务之间的切换只需简单地改变输入提示即可实现，证明了一个VLM可以与传统的检测模型如DocLayout-YOLO相比达到竞争性的检测结果。
高效且快速的性能： 基于紧凑的1.7B大规模语言模型构建，dots.ocr 比许多基于更大基础的高性能模型提供了更快的推理速度。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "dots.ocr",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```