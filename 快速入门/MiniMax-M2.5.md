## 模型介绍
M2.5 在数十万个复杂真实环境中经过强化学习的广泛训练，在代码编写、智能体工具使用与搜索、办公任务以及一系列其他具有经济价值的任务上达到当前最先进（SOTA）水平，在 SWE-Bench Verified、Multi-SWE-Bench 和 BrowseComp（含上下文管理）等评测中分别取得了 80.2%、51.3% 和 76.3% 的高分。
M2.5 经过专门训练，能够高效推理并最优地分解任务，在执行复杂的智能体任务时展现出惊人的速度，完成 SWE-Bench Verified 评测的速度比 M2.1 快 37%，与 Claude Opus 4.6 的速度相当。
## 模型架构
该框架引入了一个中间层，将底层的训练-推理引擎与智能体完全解耦，支持任意智能体的集成，并使我们能够优化模型在不同智能体框架和工具上的泛化能力。为提升系统吞吐量，我们优化了异步调度策略，在系统吞吐量与样本的非策略性（off-policyness）之间取得平衡，并设计了一种树状结构的训练样本合并策略，实现了约 40 倍的训练加速。
## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "MiniMax-M2.5",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'