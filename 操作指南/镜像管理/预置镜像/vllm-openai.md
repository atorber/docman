vLLM 是由加州大学伯克利分校 LMSYS 团队开发的开源大语言模型（LLM），以超高吞吐、低延迟和易用性著称，已被 Meta、Google、Databricks、Hugging Face 等众多企业和社区广泛采用。

## 核心优势
### 性能领先
相比 Hugging Face Transformers + Text Generation Inference（TGI），吞吐量提升 10~24 倍；
### 显存高效
独创 PagedAttention 技术，实现 KV Cache 的高效内存管理，显著降低显存占用；
### 开箱即用
支持 OpenAI 兼容 API，无缝替换现有 LLM 服务；
### 广泛兼容
原生支持 Llama、Llama2/3、Mistral、Qwen、ChatGLM、Phi、Gemma 等主流开源模型；
### 生产就绪
支持张量并行、连续批处理（Continuous Batching）、LoRA 微调推理等企业级特性。

## 快速启动
启动一个 Llama-3-8B 服务（OpenAI API 兼容）
```
docker run --gpus all -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model meta-llama/Meta-Llama-3-8B-Instruct
```

客户端可直接使用 openai Python SDK 调用
```
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8000/v1", api_key="token")
response = client.chat.completions.create(...)
```