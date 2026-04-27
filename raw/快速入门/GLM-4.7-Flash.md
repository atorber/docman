## 模型介绍

GLM-4.7-Flash 作为 30B 级 SOTA 模型，提供了一个兼顾性能与效率的新选择。面向 Agentic Coding 场景强化了编码能力、长程任务规划与工具协同，并在多个公开基准的当期榜单中取得同尺寸开源模型中的出色表现。在执行复杂智能体任务，在工具调用时指令遵循更强，Artifacts 与 Agentic Coding 的前端美感和长程任务完成效率进一步提升。

## 模型特性

GLM-4.7 系列在编程、推理与智能体三个维度实现了显著突破：

- **更强的编程能力：**显著提升了模型在多语言编码和在终端智能体中的效果；现在可以在 Claude Code、Kilo Code、TRAE、Cline 和 Roo Code 等编程框架中实现“先思考、再行动”的机制，在复杂任务上有更稳定的表现

- **前端审美提升：**GLM-4.7 系列模型在前端生成质量方面明显进步，能够生成观感更佳的网页、PPT 、海报

- **工具调用与协同执行更强：** 增强对复杂链路的任务拆解与流程编排能力，可在多步执行中持续校验与纠偏，更适合端到端交付类的智能体任务。

- **通用能力增强：**GLM-4.7 系列模型的对话更简洁智能且富有人情味，写作与角色扮演更具文采与沉浸感

## 出色的性能表现

* 在 SWE-bench Verified、τ²-Bench 等主流基准测试中，GLM-4.7-Flash 的综合表现在相同尺寸模型系列中取得开源SOTA分数。另外，相比于同尺寸模型，GLM-4.7-Flash 同样具有出色的前端和后端开发能力。

* 在内部的编程实测中，GLM-4.7-Flash 在前后端任务上表现出色。编程场景之外，也可以在中文写作、翻译、长文本、情感/角色扮演等通用场景中体验 GLM-4.7-Flash。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "GLM-4.7-Flash",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```