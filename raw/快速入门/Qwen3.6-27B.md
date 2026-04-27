## 模型介绍

Qwen3.6-27B 是通义千问系列最新开源的多模态模型，具有旗舰级编程能力。该模型采用稠密架构，参数量 27B。该模型基于社区的直接反馈打造，注重稳定性与实际应用价值，为开发者提供更直观、响应更快且真正高效的编码体验。

## 模型特性

* **智能体编码（Agentic Coding）：**模型现在能以更高的流畅度和精确度处理前端工作流和仓库级推理。

* **思维保留（Thinking Preservation）：**引入一项新功能，可保留历史消息中的推理上下文，从而简化迭代开发并降低开销。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Qwen3.6-27B",
    "messages": [{"role": "user","content": [{"type": "text", "text": "请描述这张图片的内容"},{"type": "image_url", "image_url": {"url": "https://bce.bdstatic.com/doc/bce-doc/AIHC/dog_e941a21.jpeg"}}]}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```