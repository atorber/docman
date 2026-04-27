DeepSeek-V3.2 是深度求索公司12月1日发布的3.2正式版，目标是平衡推理能力与输出长度，适合日常使用，例如问答场景和通用 Agent 任务场景。在公开的推理类 Benchmark 测试中，DeepSeek-V3.2 达到了 GPT-5 的水平，仅略低于 Gemini-3.0-Pro；相比 Kimi-K2-Thinking，V3.2 的输出长度大幅降低，显著减少了计算开销与用户等待时间。

![f9a70e96524c6cc8aac4f1aed263e404.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/f9a70e96524c6cc8aac4f1aed263e404_74272ae.png)



## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c71f0ba.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-V3.2",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
DeepSeek-V3.2 模型由深度求索公司研发，使用需遵循 [MIT 许可协议](https://huggingface.co/deepseek-ai/DeepSeek-V3.2/blob/main/LICENSE)