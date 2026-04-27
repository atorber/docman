SGLang（Structured Generation Language）是由 斯坦福大学和 UC Berkeley 联合发起的开源项目，旨在解决大语言模型在结构化输出、复杂推理和高吞吐服务场景下的效率与可控性难题。

调用方式灵活，使用 OpenAI SDK（兼容 /v1/chat/completions）或直接编写 SGLang 程序实现高级控制逻辑。


## 核心优势
### 结构化生成原生支持
强制模型输出 JSON、代码、表格等结构化内容，无需后处理。 
### 极致推理性能
基于 RadixAttention 和高效调度器，吞吐量媲美甚至超越 vLLM，尤其在长上下文和复杂约束场景下优势显著。
### 统一编程模型
用 Python 编写“生成程序”（Generation Program），将提示词、控制逻辑、后处理融为一体，代码更清晰可维护。
### 广泛模型兼容
支持 Llama、Mistral、Qwen、DeepSeek、Phi et al. 主流开源模型。
### 生产就绪
内置 OpenAI 兼容 API、张量并行、连续批处理、LoRA 支持，可直接部署到 Kubernetes。

## 快速启动

```
docker run --gpus all -p 30000:30000 \
  sglang/srt:latest \
  --model meta-llama/Meta-Llama-3-8B-Instruct \
  --port 30000
```
