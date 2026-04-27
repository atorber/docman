  
  Qwen2.5-Omni 是一种端到端的多模态模型，旨在感知包括文本、图像、音频和视频在内的多种模态，同时以流式方式生成文本和自然语音响应。
  
  ![189651bdb0d06be65086e4beeb236ab4.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/189651bdb0d06be65086e4beeb236ab4_189651b.png)
## 主要特点
### Omni 和新颖的架构
* 提出Thinker-Talker架构，这是一种端到端的多模态模型，旨在感知包括文本、图像、音频和视频在内的多种模态，同时以流式方式生成文本和自然语音响应。我们提出了一种新颖的位置嵌入方法，名为TMRoPE（时间对齐多模态RoPE），用于同步视频输入与音频的时间戳。

### 实时语音和视频聊天
* 专为全实时交互而设计的架构，支持分块输入和即时输出。

### 自然且稳健的语音生成
* 超越许多现有的流式和非流式替代方案，在语音生成中展现出卓越的稳健性和自然性。

### 跨模态的强大性能
* 与类似大小的单模态模型进行基准测试时，在所有模态中表现出卓越的性能。 Qwen2.5-Omni 在音频功能方面优于类似尺寸的 Qwen2-Audio，并实现了与 Qwen2.5-VL-7B 相当的性能。

### 出色的端到端语音指令跟踪
* Qwen2.5-Omni 在端到端语音指令跟踪方面的性能可与文本输入相媲美，MMLU 和 GSM8K 等基准测试证明了这一点。

## 模型架构
![2056aeb0b7c83acf81245247b8d23b9d.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/2056aeb0b7c83acf81245247b8d23b9d_2056aeb.png)

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: <TOKEN>" \
-d '{
  "model": "Qwen2.5-Omni-7B",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "请描述这张图片的内容"},
        {"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/dog_e941a21.jpeg"}}
      ]
    }
  ],
  "max_tokens": 1024,
  "temperature": 0.7
}'
```