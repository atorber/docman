  
基于 Llama-3.3-70B-Instruct 架构，通过 DeepSeek-R1 的强化学习（RL）输出进行精细调优，是目前参数规模最大的蒸馏模型（700 亿参数）。

## 核心特点

### 高性能推理
在数学、代码生成等复杂任务中表现接近完整版 671B 模型，支持长上下文推理（131K tokens）12。
### 量化优化
推荐使用 Q4KM 量化模式以降低显存占用，提升推理速度。

## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_2252b96.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-R1-Distill-Llama-70B",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
需遵循 Llama3.3-70B-Instruct 原[MIT 协议](https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct/blob/main/LICENSE)
