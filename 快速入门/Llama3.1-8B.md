Meta Llama 3.1 系列多语言大语言模型（LLMs）是一组包含 8B、70B 和 405B 参数规模的预训练及指令微调的生成式模型（文本输入/文本输出）。Llama 3.1 的纯文本指令微调模型（8B, 70B, 405B）针对多语言对话用例进行了优化，在常见的行业基准测试中表现优于许多现有的开源和闭源聊天模型。

## 模型架构
Llama 3.1 是一个使用优化 Transformer 架构的自回归语言模型。经过调优的版本使用监督微调（SFT）和基于人类反馈的强化学习（RLHF）使模型符合人类对实用性和安全性的偏好。
## 支持语言 
支持英语、德语、法语、意大利语、葡萄牙语、印地语、西班牙语和泰语。

Llama 3.1 的训练数据所涵盖的语言范围广于这 8 种支持语言。开发者可以为超出这 8 种支持语言之外的语言对 Llama 3.1 模型进行微调，前提是遵守 Llama 3.1 社区许可证和可接受使用政策。

## API调用
1.服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_4f3896a.png)

2.调用示例
```
curl --location '<访问地址>/v1/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Llama3.1-8B",
    "prompt": ["鸡兔同笼，头共20个，足共62只，求鸡与兔各有多少只？"],
    "max_tokens": 2000,
    "temperature": 1
}'
```