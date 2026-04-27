## 模型介绍
phi-4 是一个基于合成数据集、经过筛选的公共领域网站数据以及获取的学术书籍和问答数据集构建的先进开放模型。该模型经过严格的增强和校准过程，结合了监督式微调和直接偏好优化，以确保精确遵循指令并具备强大的安全措施。

## 模型架构
Phi-4 延续了大语言模型的经典范式，参数规模 140 亿（14B），核心是 Decoder-only Transformer（与 GPT、Llama 系列一致）

* **Decoder-only Transformer**：仅保留 Transformer 解码器部分，通过自注意力捕捉文本上下文依赖，是当前大语言模型的主流架构；

* **分词器**：采用 GPT-2 的 BPE（字节对编码），词汇量约 50257，兼顾中英文等多语言处理；

* **位置编码**：使用 RoPE（旋转位置编码），解决固定位置编码的长度限制问题，支持上下文窗口扩展。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "phi-4",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```