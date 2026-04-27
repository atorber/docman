## 模型介绍
DeepSeek-Coder-V2-Lite-Instruct 是一款基于 MoE 架构的开源代码语言模型，旨在通过高效的专家网络组合实现与 GPT4-Turbo 相媲美的代码生成能力。其核心设计理念是通过稀疏激活的专家网络，显著降低推理成本，同时保持高性能。

## 模型架构

DeepSeek-Coder-V2-Lite-Instruct 的基座架构基于 DeepSeek-V2 的改进版本，采用 MoE 设计。以下是其核心架构特点：

* **参数规模**
  
    总参数16B，激活参数2.4B，通过稀疏激活机制，仅调用部分专家网络，显著降低计算资源需求。

* **MoE 层设计**

    替换传统 Transformer 中的密集前馈网络（FFN）为稀疏 MoE 层。
    
    每个 MoE 层包含多个专家网络（Experts）和一个门控网络（Gating Network），动态路由输入到最相关的专家。

* **上下文长度** 

    支持 128K 上下文窗口，适合长代码生成和复杂任务推理。

* **多语言能力** 

    覆盖 338 种编程语言，基于10.2T tokens训练。


## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data '{
    "model": "DeepSeek-Coder-V2-Lite-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```

