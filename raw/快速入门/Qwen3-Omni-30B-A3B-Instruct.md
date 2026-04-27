## 模型介绍

![Qwen3-Omni.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/Qwen3-Omni_2121ec0.png)

Qwen3-Omni 是一个原生端到端多语言全模态基础模型。可以处理文本、图像、音频和视频，并以文本和自然语音形式提供实时流式响应。Qwen3-Omni引入了多项架构升级，以提高性能和效率。

### 模型特性

- **跨模态的最先进技术：**早期以文本为主的预训练和混合多模态训练提供了原生多模态支持。在实现强大的音频和音视频结果的同时，单模态文本和图像性能没有退化。在36个音频/视频基准测试中的22个上达到SOTA，在36个中的32个上达到开源SOTA；ASR、音频理解和语音对话性能与Gemini 2.5 Pro相当。

- **多语言：**支持119种文本语言，19种语音输入语言和10种语音输出语言。

    - **语音输入：**英语、中文、韩语、日语、德语、俄语、意大利语、法语、西班牙语、葡萄牙语、马来语、荷兰语、印度尼西亚语、土耳其语、越南语、粤语、阿拉伯语、乌尔都语。
    
    - **语音输出：**英语、中文、法语、德语、俄语、意大利语、西班牙语、葡萄牙语、日语、韩语。

- **新颖的架构：**基于MoE的思考者-说话者设计，通过AuT预训练获得强大的通用表示，加上多码本设计，将延迟降至最低。

- **实时音频/视频交互：**低延迟流媒体，具有自然的轮流发言和即时文本或语音响应。

- **灵活控制：**通过系统提示自定义行为，实现细粒度控制和轻松适应。

- **详细的音频字幕生成器：**Qwen3-Omni-30B-A3B-Captioner现已开源：这是一个通用的、高度详细的、低幻觉的音频字幕生成模型，填补了开源社区的一个关键空白。


## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Qwen3-Omni-30B-A3B-Instruct",
    "messages": [{"role": "user","content": [{"type": "text", "text": "请描述这张图片的内容"},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/dog_e941a21.jpeg"}}]}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
