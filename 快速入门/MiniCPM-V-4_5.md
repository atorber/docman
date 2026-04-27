  
## 模型介绍
MiniCPM-V 4.5是 MiniCPM-V 系列中最新、功能最强大的型号。该型号基于 Qwen3-8B 和 SigLIP2-400M 芯片构建，共包含 80 亿个参数。与之前的 MiniCPM-V 和 MiniCPM-o 型号相比，其性能显著提升，并引入了许多实用新功能。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "MiniCPM-V-4_5",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```