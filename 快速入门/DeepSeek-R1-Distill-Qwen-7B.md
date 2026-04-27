  
DeepSeek-R1-Distill-Qwen-7B 是DeepSeek AI从DeepSeek-R1模型中蒸馏出来的Qwen模型，比经过强化学习训练出来的小型稠密模型拥有更好的推理能力。参数量为70亿，专为移动端或嵌入式设备优化。

## 核心特点
### 极致轻量化
7B 模型可在低至 8GB 内存的设备上运行，支持离线部署（如通过 Ollama 框架）。
### 场景灵活性
适用于 IoT 设备语音助手、轻量级文本生成（如智能客服回复），兼顾速度与基础推理能力。
### 教育用途
适合教学场景中演示大模型原理，降低 AI 技术学习门槛。


## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1773d30.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-R1-Distill-Qwen-7B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```


## 授权条款
基于 Qwen2.5 系列模型（原许可协议为 Apache 2.0），使用 DeepSeek-R1 精选的 80 万样本微调获得，使用过程中需遵循原Qwen2.5 [MIT协议](https://huggingface.co/Qwen/Qwen2.5-1.5B/blob/main/LICENSE) 