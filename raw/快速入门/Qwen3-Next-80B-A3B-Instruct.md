  Qwen3-Next-80B-A3B-Instruct 是 Qwen3-Next 系列的首个版本，具有以下关键增强特性。
## 模型介绍
### 核心技术增强

* 混合注意力机制：采用门控DeltaNet与门控注意力的组合架构，替代标准注意力机制，实现对超长上下文的高效建模
* 高稀疏性混合专家系统：在MoE层实现极低的激活比例，在保持模型容量的同时显著降低每个token的浮点运算量
* 稳定性优化：包含零中心化权重衰减层归一化及其他稳定性增强技术，确保预训练与后训练的稳健性
* 多Token预测：提升预训练模型性能并加速推理过程
### 性能表现
Qwen3-Next-80B-A3B 在参数效率和推理速度方面均展现出卓越性能：

* Qwen3-Next-80B-A3B-Base 在下游任务中表现超越 Qwen3-32B-Base，总训练成本降低10%，在超过32K Token的上下文场景中推理吞吐量提升10倍

* Qwen3-Next-80B-A3B-Instruct 在部分基准测试中与 Qwen3-235B-A22B-Instruct-2507 性能相当，同时在处理高达256K Token 的超长上下文任务中展现出显著优势

### 模型架构详情
Qwen3-Next-80B-A3B-Instruct 仅支持指令模式（非思考模式），输出不包含`<think></think> `


![model_architecture.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/model_architecture_70fcc17.png)

## API调用

* 服务部署成功后，可在服务列表查看调用信息


![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_de50148.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Qwen3-Next-80B-A3B-Instruct",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```



