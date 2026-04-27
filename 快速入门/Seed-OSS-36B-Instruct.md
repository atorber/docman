  
## 模型介绍
Seed-OSS 是由字节跳动Seed团队开发的一系列开源大型语言模型，旨在提供强大的长上下文、推理、代理和通用能力，以及多样的开发者友好功能。用 12T tokens 进行训练，Seed-OSS 在多个流行的开放基准测试中表现出色。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Seed-OSS-36B-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```