  Qwen3-8B是通义千问系列最新一代大语言模型，参数量8.2B。
  
## 推理能力
该模型基于大规模训练实现突破性进步，在推理能力、指令遵循、智能体功能及多语言支持方面具有以下显著特性：
### 独创双模式无缝切换
* 单一模型内支持思维模式（处理复杂逻辑推理、数学与代码任务）与非思维模式（高效通用对话）自由切换，确保各类场景最优表现
### 推理能力跨越式提升
* 在数学、代码生成与常识逻辑推理任务上，思维模式超越前代QwQ，非思维模式超越Qwen2.5 instruct模型
### 人类偏好深度对齐
* 在创意写作、角色扮演、多轮对话及指令遵循方面表现卓越，提供更自然、生动且沉浸式的交互体验
### 智能体功能专家级表现
* 双模式下均可精准对接外部工具，在复杂智能体任务中保持开源模型领先性能
### 超百种语言支持
* 支持100+语言与方言，具备强大的多语言指令遵循与翻译能力

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2.调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Qwen3-8B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```



  