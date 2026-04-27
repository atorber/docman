## 模型介绍
Gemma 是谷歌推出的一系列轻量级、最先进的开源模型，其研发和技术与 Gemini 模型一脉相承。Gemma 3 模型支持多模态处理，能够处理文本和图像输入并生成文本输出，同时预训练版本和指令调整版本均提供开放权重。Gemma 3 拥有 128K 的大型上下文窗口，支持超过 140 种语言，并提供比以往版本更多的模型尺寸选择。Gemma 3 模型非常适合各种文本生成和图像理解任务，包括问答、摘要和推理。其相对较小的体积使其能够部署在资源有限的环境中，例如笔记本电脑、台式机或您自己的云基础设施，从而普及最先进的 AI 模型，并助力所有人进行创新。

## 模型架构

Gemma 3模型在前几代模型的 decoder-only Transformer架构基础上，进行了几项关键改进：

* **注意力机制**

    局部与全局注意力交错（5:1），每1个全局注意力层后接5个局部滑动窗口注意力层，大幅减少长上下文推理时的 KV 缓存内存占用。

* **长上下文优化** 

    全局层使用更高的 RoPE 基频（1M），并采用类似于位置插值的技术扩展其注意范围，稳定支持 128K 的上下文长度。

* **视觉编码器** 

    采用定制化的 SigLIP 视觉编码器（ViT 架构），固定输入分辨率为 896×896，实现图像到软标记序列的转换，支持视觉任务。

* **自适应窗口 (P&S)**

    推理时，将高分辨率或非标准宽高比的图像智能分割为多个 896×896 的区块进行处理，提升处理非正方形、高分辨率图像的灵活性，避免细节丢失。


## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

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
