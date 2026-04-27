## **模型介绍**

GLM-4.6 是智谱的语言模型，其总参数量 355B，激活参数 32B。GLM-4.6 所有核心能力上均完成了对 GLM-4.5 的超越，具体如下：

* **高级编码能力**：在公开基准与真实编程任务中，GLM-4.6 的代码能力对齐 Claude Sonnet 4。

* **上下文长度**：上下文窗口由 128K→200K，适应更长的代码和智能体任务。

* **推理能力**：推理能力提升，并支持在推理过程中调用工具。

* **搜索能力**：增强了模型在工具调用和搜索智能体上的表现，在智能体框架中表现更好。

* **写作能力**：在文风、可读性与角色扮演场景中更符合人类偏好。

* **多语言翻译**：进一步增强跨语种任务的处理效果。

## 综合评测

在 8 大权威基准：AIME 25、GPQA、LCB v6、HLE、SWE-Bench Verified、BrowseComp、Terminal-Bench、τ^2-Bench、GPQA 模型通用能力的评估中，GLM-4.6 在大部分权威榜单表现对齐 Claude Sonnet 4。

## 真实编程评测

为了测试模型在实际编程任务中的能力，在 Claude Code 环境下进行了 74 个真实场景编程任务测试。结果显示，GLM-4.6 实测超过 Claude Sonnet 4。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "GLM-4.6",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```