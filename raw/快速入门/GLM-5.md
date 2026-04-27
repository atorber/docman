## 模型介绍

GLM-5 是智谱新一代的旗舰基座模型，面向 Agentic Engineering 打造，能够在复杂系统工程与长程 Agent 任务中提供可靠生产力。在 Coding 与 Agent 能力上，GLM-5 取得开源 SOTA 表现，在真实编程场景的使用体感逼近 Claude Opus 4.5，擅长复杂系统工程与长程 Agent 任务，是通用 Agent 助手的理想基座。

## 模型特性

**1. 更大基座，更强智能**

GLM-5 全新基座为从“写代码”到“写工程”的能力演进提供了坚实基础：

  - **参数规模扩展**：从 355B（激活 32B）扩展至 744B（激活 40B），预训练数据从 23T 提升至 28.5T，更大规模的预训练算力显著提升了模型的通用智能水平

  - **异步强化学习**：构建全新的 “Slime” 框架，支持更大模型规模及更复杂的强化学习任务，提升强化学习后训练流程效率；提出异步智能体强化学习算法，使模型能够持续从长程交互中学习，充分激发预训练模型的潜力

  - **稀疏注意力机制**：首次集成 DeepSeek Sparse Attention，在维持长文本效果无损的同时，大幅降低模型部署成本，提升 Token Efficiency

**2. Coding 能力：对齐 Claude Opus 4.5**

  - GLM-5 在编程能力上实现了对 Claude Opus 4.5 的对齐，**在业内公认的主流基准测试中取得开源模型最高分数**。在 SWE-bench-Verified 和 Terminal Bench 2.0 中分别获得 77.8 和 56.2 的开源模型最高分数，性能表现超过 Gemini 3.0 Pro。

  - 内部 Claude Code 评估集合中，GLM-5 在前端、后端、长程任务等编程开发任务上显著超越 GLM-4.7，能够以极少的人工干预自主完成 Agentic 长程规划与执行、后端重构和深度调试等系统工程任务，使用体验逼近 Opus 4.5。

**3. Agent 能力：SOTA级长程任务执行**

  - GLM-5 在 Agent 能力上实现开源 SOTA，在多个评测基准中取得开源第一。在 BrowseComp（联网检索与信息理解）、MCP-Atlas（工具调用和多步骤任务执行）和 τ²-Bench（复杂多工具场景下的规划和执行）均取得最高表现。

  - 这些能力是 Agentic Engineering 的核心：模型不仅要能写代码、完成工程，还要能在长程任务中保持目标一致性、进行资源管理、处理多步骤依赖关系，成为真正的 Agentic Ready 基座模型。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl -X POST '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
-d '{
    "model": "GLM-5",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
