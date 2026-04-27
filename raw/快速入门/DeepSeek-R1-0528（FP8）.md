DeepSeek-R1-0528是DeepSeek R1 模型小版本升级，其仍然使用2024年12月所发布的DeepSeek V3 Base 模型作为基座，但在后训练过程中投入了更多算力，显著提升了模型的思维深度与推理能力。

更新后的 R1 模型在数学、编程与通用逻辑等多个基准测评中取得了当前国内所有模型中首屈一指的优异成绩，并且在整体表现上已接近其他国际顶尖模型，如o3与 Gemini-2.5-Pro。

相较于旧版 R1，新版在复杂推理任务中的表现有了显著提升。例如在 AIME 2025 测试中，新版模型准确率由旧版的 70% 提升至 87.5%。这一进步得益于模型在推理过程中的思维深度增强：在 AIME 2025 测试集上，旧版模型平均每题使用 12K tokens，而新版模型平均每题使用 23K tokens，表明其在解题过程中进行了更为详尽和深入的思考。

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
    "model": "DeepSeek-R1-0528",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
使用请遵循 DeepSeek-R1-0528 模型许可协议。