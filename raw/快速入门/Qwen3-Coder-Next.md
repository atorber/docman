## 模型介绍

Qwen3-Coder-Next 是一款专为代码智能体和本地开发设计的开源权重语言模型。该模型基于 Qwen3-Next-80B-A3B-Base 构建，采用混合注意力机制与 MoE 的新型模型结构。Qwen3-Coder-Next 通过大规模执行任务合成、环境交互和强化学习进行了智能体训练，在显著降低推理成本的同时，获得了强大的编程和智能体能力。

## 模型特性

* **超高效率与卓越性能：**总参数量达 800 亿，仅激活 30 亿参数，即可实现媲美激活参数量高出 10–20 倍模型的性能，为智能体部署提供极高的性价比。

* **先进的智能体能力：**通过精心设计的训练方案，该模型在长程推理、复杂工具调用以及执行失败后的恢复方面表现出色，确保在动态编码任务中具备稳健性能。

* **灵活集成真实世界 IDE：**原生支持 256k 上下文长度，并能适配多种脚手架模板，可无缝集成各类 CLI/IDE 平台（例如 Claude Code、Qwen Code、Qoder、Kilo、Trae、Cline 等），全面支持多样化的开发环境。

## 在编程智能体基准上的表现
### 面向智能体的基准结果

![Qwen3-Coder-Next-bench.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/Qwen3-Coder-Next-bench_cfea83e.png)

* 使用 SWE-Agent 框架时，Qwen3-Coder-Next 在 SWE-Bench Verified 上达到 70% 以上。

* 在多语言设置以及更具挑战的 SWE-Bench-Pro 基准上保持竞争力。

* 尽管激活参数规模很小，该模型在多项智能体评测上仍能匹敌或超过若干更大的开源模型。

### 效率与性能的权衡

![Qwen3-Coder-Next-swe.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/Qwen3-Coder-Next-swe_b1be343.png)

* Qwen3-Coder-Next（3B 激活） 的 SWE-Bench-Pro 表现可与 激活参数量高 10×–20× 的模型相当。

* Qwen3-Coder-Next 在 面向低成本代码智能体部署方面具有较为明显的优势。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_282fb44.png)

2. 调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Qwen3-Coder-Next",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```