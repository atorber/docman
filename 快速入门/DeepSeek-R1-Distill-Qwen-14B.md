基于 Qwen2.5系列模型架构，通过知识蒸馏技术从 DeepSeek-R1 生成的 80 万精选样本中微调，针对中等规模硬件优化的蒸馏模型，参数量 140 亿，适用于资源有限场景。

## 核心特点
### 多领域卓越性能
在数学（如 MATH-500 得分 94.3%）、编程和逻辑推理任务中超越 OpenAI-o1-mini，部分场景性能接近 GPT-4.5。
### 轻量化部署
适配 Serverless API（如 Gitee AI 平台）。
### 开源生态
与 Qwen 系列工具链兼容，便于二次开发和行业定制。



## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1773d30.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-R1-Distill-Qwen-14B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```


## 授权条款
基于 Qwen2.5 系列模型（原许可协议为 Apache 2.0），使用 DeepSeek-R1 精选的 80 万样本微调获得，使用过程中需遵循原Qwen2.5 [MIT协议](https://huggingface.co/Qwen/Qwen2.5-1.5B/blob/main/LICENSE) 