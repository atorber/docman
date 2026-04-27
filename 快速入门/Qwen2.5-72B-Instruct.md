  Qwen2.5 是通义千问发布的大模型系列，包含多个基础语言模型和指令微调模型，参数量范围从 0.5B 到 720 亿。
## 模型介绍
相较于 Qwen2 实现了以下关键改进：

### **知识增强与专业能力提升**
* 通过领域专家模型优化，显著扩展知识库，并大幅提升代码生成与数学推理能力。

### 指令遵循与复杂任务处理
* 强化指令理解、长文本生成（超 8K tokens）、结构化数据（如表格）解析及结构化输出（尤其是 JSON 格式）；
* 提升对系统提示词多样性的适应能力，优化聊天机器人的角色扮演和条件设定效果。

### 长上下文支持
* 上下文窗口扩展至 128K tokens，支持生成 8K tokens 的连续文本。

### 多语言覆盖
* 支持 29+ 种语言，包括中、英、法、西、葡、德、意、俄、日、韩、越南语、泰语、阿拉伯语等。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl --location '<访问地址>/v1/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' 
--data '{
    "model": "Qwen2.5-72B-Instruct",
    "prompt": ["鸡兔同笼，头共20个，足共62只，求鸡与兔各有多少只？"],
    "max_tokens": 2000,
    "temperature": 1
}'
```