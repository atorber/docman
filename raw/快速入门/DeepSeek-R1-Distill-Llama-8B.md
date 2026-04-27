基于 Llama-3 架构的轻量级蒸馏模型（80 亿参数），面向低算力资源设计。

## 核心特点
### 低成本部署
可在16GB 显存的 NVIDIA 显卡上流畅运行，适合个人开发者和小型工作室。
### 快速推理
首个 Token 响应时间（TTFT）优化至 0.2 秒内，支持实时交互应用（如聊天机器人）。
### 开源兼容
支持 Ollama 框架和 LMStudio 工具链，提供开箱即用的 API 接口。


## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1773d30.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-R1-Distill-Llama-8B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```


## 授权条款
基于 Llama3.1-8B 模型使用 DeepSeek-R1 精选的 80 万样本微调获得，使用过程中需遵循原Llama3.1-8B [MIT协议](https://huggingface.co/meta-llama/Llama-3.1-8B/blob/main/LICENSE) 