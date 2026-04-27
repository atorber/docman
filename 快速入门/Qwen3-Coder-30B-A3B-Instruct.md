## 模型介绍
Qwen3 是 Qwen 系列最新一代的大语言模型，提供了一系列密集（Dense）和混合专家(MOE）模型。基于广泛的训练，Qwen3 在推理、指令跟随、代理能力和多语言支持方面取得了突破性的进展，具有以下关键特性：

独特支持在思考模式（用于复杂逻辑推理、数学和编码）和 非思考模式（用于高效通用对话）之间无缝切换，确保在各种场景下的最佳性能。 
显著增强的推理能力，在数学、代码生成和常识逻辑推理方面超越了之前的 QwQ （在思考模式下）和 Qwen2.5 指令模型（在非思考模式下）。
卓越的人类偏好对齐，在创意写作、角色扮演、多轮对话和指令跟随方面表现出色，提供更自然、更吸引人和更具沉浸感的对话体验。
擅长 Agent 能力，可以在思考和非思考模式下精确集成外部工具，在复杂的基于代理的任务中在开源模型中表现领先。
支持 100 多种语言和方言，具有强大的多语言理解、推理、指令跟随和生成能力。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Qwen3-Coder-30B-A3B-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```