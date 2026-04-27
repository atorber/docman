## 模型介绍

GLM-4.5 系列模型是专为智能体（intelligent agents）设计的基础模型。GLM-4.5 使用了混合专家（Mixture-of-Experts）架构, 总参数量为 3550 亿，激活参数量为 320 亿。GLM-4.5 系列模型统一了推理、编码和智能体能力，以满足智能体应用的复杂需求。

## 核心能力

* **智能体优化**

    深度适配 Claude Code、Roo Code 等代码智能体框架。

* **工具生态**

    支持工具调用接口，可接入任意智能体应用。

* **双模推理**

    思考模式（Thinking Mode）：复杂推理与多步工具调用

    非思考模式（Non-thinking Mode）：低延迟即时响应

## 性能表现

在涵盖12个行业标准基准的综合评估中，GLM-4.5 表现卓越，综合得分为 63.2，在所有闭源和开源模型中位列 第 3 名。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "GLM-4.5",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```