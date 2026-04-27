  DeepSeek-Prover-V2-671B 初始化数据通过DeepSeek-V3驱动的递归定理证明流程采集，与DeepSeek-V3的逐步推理相结合，构建强化学习的初始冷启动。实现了非形式化数学推理与形式化证明在统一模型中的融合。

## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_60bb873.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-Prover-V2-671B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
使用请遵循 DeepSeek-Prover-V2 模型许可协议。