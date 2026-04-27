Mixtral 8x22B 是 MistralAI 最新的开放模型。它在人工智能社区中树立了性能和效率的新标准。它是一款稀疏的专家混合（SMoE）模型，总参数量为141B，激活参数量为39B，以其规模而言提供了无与伦比的成本效益。

## 模型特点

* **能够流利地使用英语、法语、意大利语、德语和西班牙语**

* **具有强大的数学和编码能力**

* **原生支持函数调用** 结合在 La Plateforme 上实现的受限输出模式，这使应用开发和技术栈能够大规模实现

* **64K上下文窗口** 其 64K tokens 上下文窗口可实现对大型文档的精准信息提取

## 性能优势

* **常识推理** MMLU（77.75%）、HellaSwag（88.5%）等指标上超越 LLaMA 2 70B

* **多语言理解** 在法语、德语、西班牙语、意大利语评测中全面领先 LLaMA 2 70B

* **成本效益** 以更低的激活参数实现了更高的 MMLU 准确率，其性价比处于行业领先水平

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data '{
    "model": "Mixtral-8x22B-Instruct-v0.1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
