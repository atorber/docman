BGE-M3是一个通用向量模型，具有多功能性、多语言性和多粒度性的特点。
* 多功能性：它可以同时执行向量模型的密集检索（dense retrieval）、多向量检索（multi-vector retrieval）和稀疏检索（sparse retrieval）
* 多语言性：支持超过100种工作语言
* 多粒度性：能够处理不同粒度的输入，从短句子到8192 Token的长文本

## API调用 
* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9d04bdf.png)

* 调用示例

```
curl --location '<访问地址>/v1/embeddings' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "BGE-M3",
    "input": "这是一个测试文本"
}'
```