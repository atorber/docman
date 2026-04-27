  Qwen2.5 是通义千问发布的大模型系列，包含多个基础语言模型和指令微调模型，参数量范围从 0.5B 到 720 亿。
## 模型介绍
相较于 Qwen2，Qwen2.5 带来了以下改进：

* 借助在代码和数学领域的专项专家模型，显著增强了知识储备，并大幅提升了代码与数学能力。
* 在指令遵循、生成长文本（超过 8K token）、理解结构化数据（例如表格）以及生成结构化输出（尤其是 JSON）方面有显著提升。对系统提示的多样性更具适应性，增强了聊天机器人的角色扮演实现和条件设定能力。
* 支持长达 128K token 的上下文，并可生成最多 8K token 的文本。
* 支持超过 29 种语言的多语言能力，包括中文、英文、法文、西班牙文、葡萄牙文、德文、意大利文、俄文、日文、韩文、越南文、泰文、阿拉伯文等。


## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Qwen2.5-0.5B-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```