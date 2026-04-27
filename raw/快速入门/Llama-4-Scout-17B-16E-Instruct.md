  ## 模型介绍
Llama 4 模型集合是支持文本和多模态的 AI 模型，它们利用混合专家架构，在文本和图像理解方面获得行业leading性能。Llama 4 模型集合标志着 Llama 生态的新时代。目前推出了两个新的模型：Llama 4 Scout，一个 17 亿参数的 16 个专家模型；Llama 4 Maverick，一个 17 亿参数的 128 个专家模型。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Llama-4-Scout-17B-16E-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```