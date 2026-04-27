DeepSeek-R1-0528-Qwen3-8B是将DeepSeek-R1-0528的思维链蒸馏出来用于后训练Qwen3 8B Base从而获得。

该模型在AIME 2024上的表现达到了开源模型中的最先进水平（SOTA），比Qwen3 8B高出+10.0%，并匹配了Qwen3-235B-thinking的表现。

来自DeepSeek-R1-0528的思维链对于推理模型的学术研究以及专注于小规模模型的工业开发都具有重要意义。

更多信息可查看DeepSeek官方更新日志 [DeepSeek-R1 更新，思考更深，推理更强](https://api-docs.deepseek.com/zh-cn/news/news250528)

## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_60bb873.png)

* 调用示例

```bash
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-R1-0528-Qwen3-8B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
使用请遵循 DeepSeek-R1-0528-Qwen3-8B 模型许可协议。