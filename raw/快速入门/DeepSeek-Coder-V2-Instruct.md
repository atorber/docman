## 模型介绍
DeepSeek-Coder-V2 是一个开源混合专家（Mixture-of-Experts, MoE）代码语言模型，其在特定代码任务上的性能可与GPT4-Turbo相媲美。具体而言，DeepSeek-Coder-V2是从DeepSeek-V2的一个中间检查点继续预训练，并额外增加了6万亿个令牌。通过这种持续的预训练，DeepSeek-Coder-V2显著增强了DeepSeek-V2的编码和数学推理能力，同时在一般语言任务上保持了相当的性能。与DeepSeek-Coder-33B相比，DeepSeek-Coder-V2在各种与代码相关的任务、推理及通用能力方面均显示出重大进步。

## 模型架构

DeepSeek-Coder-V2 的基座架构基于 DeepSeek-V2 的改进版本，采用 MoE 设计。以下是其核心架构特点：

* **参数规模**
  
    总参数236B，激活参数21B，通过稀疏激活机制，仅调用部分专家网络，显著降低计算资源需求。

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
curl -X POST '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
-d '{
    "model": "DeepSeek-Coder-V2-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
