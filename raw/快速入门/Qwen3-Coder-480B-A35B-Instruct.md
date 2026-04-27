Qwen3-Coder 提供多种规模版本，Qwen3-Coder-480B-A35B-Instruct是截止目前最强大的版本。

## 模型特性

* 在智能体编程（Agentic Coding）、智能体浏览器操作（Agentic Browser-Use）及其他基础编码任务上，于开源模型中表现卓越，性能媲美 Claude Sonnet。

* 支持超长上下文，原生支持 256K tokens，通过 Yarn 技术可扩展至 100 万 tokens，专为整个代码仓库级理解优化。

* 全面支持智能体编程范式，兼容主流平台（如 Qwen Code、CLINE），并采用专门设计的函数调用格式。

![qwen3-coder-main \(1\).jpg](https://bce.bdstatic.com/doc/bce-doc/AIHC/qwen3-coder-main%20%281%29_95abf5b.jpg)

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例
```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Qwen3-Coder-480B-A35B-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

