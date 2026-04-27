## 模型介绍

GLM-5.1 是智谱最新旗舰模型，代码能力大大增强，长程任务显著提升，能够在单次任务中持续、自主地工作长达 8 小时，完成从规划、执行到迭代优化的完整闭环，交付工程级成果。在综合能力与 Coding 能力上，GLM-5.1 整体表现对齐 Claude Opus 4.6，并在长程自主执行、复杂工程优化与真实开发场景中展现出更强的持续工作能力，是构建 Autonomous Agent 与长程 Coding Agent 的理想基座。

## 模型特性

* **综合与 Coding 能力：对齐全球顶尖水平**

    GLM-5.1 在综合能力与 Coding 能力上达到全球第一梯队，整体表现对齐 Claude Opus 4.6，并在多个关键评测中位居前列。
    
    在 SWE-Bench Pro 上达到了当前最优水平，并在 NL2Repo（仓库生成）和 Terminal-Bench 2.0（真实终端任务）上大幅领先于 GLM-5。

* **长程任务能力：迈向 8 小时级持续工作**

    GLM-5.1 长程任务（Long Horizon Task）显著提升，重点提升模型在复杂目标下的持续执行、闭环优化与工程交付能力。

* **工程交付能力：从代码生成向全自治智能体进化**

    GLM-5.1 长程任务中形成“实验—分析—优化”的自主闭环，能够主动运行 benchmark、识别瓶颈、调整策略，并在多轮迭代中持续提升结果质量。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_49bc753.png)

2. 调用示例

```
curl -X POST '<访问地址>/v1/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
-d '{
    "model": "GLM-5.1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
