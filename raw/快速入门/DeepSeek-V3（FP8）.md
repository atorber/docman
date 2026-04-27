
DeepSeek-V3模型适用于多种自然语言处理任务，如文本生成、问答系统、文本摘要等，能够生成高质量的语言内容并支持多语言对话。该模型拥有671亿个总参数，能够处理更大规模的数据集，在各项任务种表现出更强的泛化能力、提供更快的推理时间。

## 模型摘要
### 架构创新：高效性能与推理加速
* 无辅助损失负载平衡策略首创技术，消除传统负载平衡策略的性能损耗，提升模型训练稳定性与效率。
* 多标记预测（MTP）目标优化模型性能，支持推测解码技术，显著加速推理速度。
### 预训练效率：极致成本与扩展性
* FP8混合精度训练框架首次在超大规模模型上验证FP8训练可行性，降低显存占用并提升计算效率。
* 跨节点MoE通信优化算法-框架-硬件协同设计，实现近乎完全的计算-通信重叠，突破分布式训练瓶颈。
### 推理能力跃升：知识提炼与可控输出
* DeepSeek-R1长思维链蒸馏将R1系列模型的复杂推理能力（验证与反射模式）迁移至DeepSeek-V3，显著提升逻辑与数学推理性能。
* 输出风格与长度控制精准约束生成内容的格式、长度及风格，适配多样化应用场景。


## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c71f0ba.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-V3",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
DeepSeek-V3 模型由深度求索公司研发，使用需遵循[MIT 许可协议](https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/LICENSE-CODE)