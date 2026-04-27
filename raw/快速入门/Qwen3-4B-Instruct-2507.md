# 模型介绍

Qwen3-4B-Instruct-2507 是通义千问系列推出的轻量级指令微调模型。该模型采用了先进的 Dense（稠密） 架构，总参数量仅 40 亿。该模型定位为“小而精”的全能型助手，旨在以极低的部署成本提供接近更大规模模型的综合能力，特别适用于端侧部署、低资源环境以及对响应速度要求较高的应用场景。

## 模型特性

* **显著提升**了通用能力，包括指令执行、逻辑推理、文本理解、数学、科学、编程和工具使用。

* 在**多种语言**中的长尾知识覆盖方面取得了重大进展。

* 在**主观和开放式任务**中与用户偏好更好地对齐，使响应更加有用，生成的文本质量更高。

* 提升了**256K长上下文理解**的能力。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2. 调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Qwen3-4B-Instruct-2507",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
