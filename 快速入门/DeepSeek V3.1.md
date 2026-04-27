  
DeepSeek-V3.1 是一种支持思维模式与非思维模式的混合模型。与前一版本相比，本次升级在多个方面实现了改进：

### **混合思维模式**
通过更改对话模板，单一模型可同时支持思维模式和非思维模式。

### 更智能的工具调用
通过训练后优化，模型在工具使用和智能体任务方面的性能显著提升。

### 更高的思维效率
DeepSeek-V3.1-Think 在达到与 DeepSeek-R1-0528 相当答案质量的同时，响应速度更快。

DeepSeek-V3.1 是在 DeepSeek-V3.1-Base 基础上进行训练后优化的模型，该基座模型基于原始 V3 基础检查点，采用两阶段长上下文扩展方法构建，遵循原 DeepSeek-V3 技术报告中概述的方法论。通过收集更多长文档数据显著扩展了训练数据集：32K 扩展阶段的训练量提升 10 倍至 630B 词元，128K 扩展阶段延长 3.3 倍至 209B 词元。此外，DeepSeek-V3.1 采用 UE8M0 FP8 缩放数据格式进行训练，以确保与微缩放数据格式的兼容性。


### 更高的思维效率

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_5c488e3.png)


* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-V3.1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```