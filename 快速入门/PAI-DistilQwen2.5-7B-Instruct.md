## 模型介绍
PAI-DistilQwen2.5-7B-Instruct是阿里云 PAI 平台基于通义千问 2.5 系列开发的轻量级指令微调模型，通过创新蒸馏技术将 76 亿参数的原版 Qwen2.5-7B-Instruct 压缩至约 35 亿参数，同时保留90% 以上的核心性能，实现了性能与部署成本的最佳平衡。

## 核心架构

* 采用优化的Transformer 解码器（非 MoE 结构，全参数激活）

* PAI-DistilQwen2.5-7B-Instruct 通过创新双层蒸馏技术和架构优化，在保持原版 Qwen2.5-7B-Instruct90% 以上核心能力的同时，将参数量减少54%，模型大小降低53%，推理速度提升30-50%，实现了 **"小而强"** 的轻量化目标。


## 核心价值

让通义千问 2.5 的强大能力（多语言理解、代码生成、逻辑推理）能够在更广泛的设备和场景中部署应用，尤其适合资源受限环境和高并发服务，为大模型的普及应用开辟了新路径。

## API调用

1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "PAI-DistilQwen2.5-7B-Instruct",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
~~~~