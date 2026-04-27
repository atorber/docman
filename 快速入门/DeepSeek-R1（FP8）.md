DeepSeek-R1-Zero 通过大规模强化学习（RL）直接训练，无需监督微调（SFT）作为前置步骤，在推理任务中展现出卓越性能。通过强化学习，该模型自然涌现出大量强大且有趣的推理行为。然而，DeepSeek-R1-Zero 也存在一些挑战，例如无限重复、可读性差和语言混杂等问题。
为解决上述问题并进一步提升推理能力， DeepSeek-R1在强化学习前引入了冷启动数据。DeepSeek-R1 在数学、代码和推理任务上的性能已可比肩 OpenAI-o1。
  
## 模型特点
### 后训练阶段：基于原模型的大规模强化学习
直接在基础模型上应用强化学习（RL），无需依赖监督微调（SFT）作为前置步骤。
### 蒸馏阶段：小模型亦可强大
大模型的推理能力可蒸馏至小模型，其性能优于直接对小模型进行RL训练得到的推理模式。蒸馏后的小型稠密模型在基准测试中表现卓越。社区已开源了基于 Qwen2.5 和 Llama3 架构的蒸馏模型，参数量覆盖 1.5B、7B、8B、14B、32B 和 70B 的多个检查点。
  
## API调用
* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_3bb1609.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-R1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```
  
## 授权条款
DeepSeek-VR1模型由深度求索公司研发，使用需遵循[MIT 许可协议](https://github.com/deepseek-ai/DeepSeek-R1/blob/main/LICENSE)
