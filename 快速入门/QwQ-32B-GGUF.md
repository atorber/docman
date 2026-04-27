QwQ 是 Qwen 系列的推理模型，与传统指令调优（instruction-tuned）模型相比，具备思维与推理能力的 QwQ 在下游任务（尤其是复杂难题）中表现显著提升。QwQ-32B作为中等规模的推理模型，在性能上可与当前最先进的推理模型（如 DeepSeek-R1、o1-mini 等）相媲美。
## 模型特点
### 模型类型
* 因果语言模型（Causal Language Model）
### 训练阶段
* 预训练 + 后训练（监督微调与强化学习）
### 参数量
* 总参数量：325 亿（32.5B）
* 非嵌入参数量：310 亿（31.0B）
### 基础架构
基于 Transformer，采用以下技术：
* RoPE（旋转位置编码）
* SwiGLU 激活函数
* RMSNorm 层归一化
* 注意力 QKV 偏置（Attention QKV Bias）
### 上下文长度
* 支持完整上下文窗口：131,072 tokens
* 长文本提示注意：若提示超过 8,192 tokens，需按说明启用 YaRN 扩展方法。
### 量化
* q4_k_m, q5_0, q5_k_m, q6_k, q8_0
<!-- qwq-32b-q4_k_m.gguf qwq-32b-q5_0.gguf qwq-32b-q5_k_m.gguf qwq-32b-q6_k.gguf qwq-32b-q8_0.gguf-->
* **默认使用 q8_0 量化精度（即 qwq-32b-q8_0.gguf）进行部署。**
* 如需使用其它精度，待服务部署成功后可在"在线服务部署"中 升级服务 修改服务的启动参数。以q5_k_m为例，参数修改为--model /mnt/aihc_model_dir/qwq-32b-q5_k_m.gguf

## API调用
* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_3bb1609.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data '{
    "model": "QwQ-32B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

