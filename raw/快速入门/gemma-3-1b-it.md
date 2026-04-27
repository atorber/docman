## 模型介绍
Gemma 是谷歌推出的一系列轻量级、最先进的开源模型，其研发和技术与 Gemini 模型一脉相承。gemma-3-1b-it 是谷歌推出的轻量级纯文本模型（1B参数）。

## 模型架构

Gemma 3模型在前几代模型的 decoder-only Transformer架构基础上，进行了几项关键改进：

* **注意力机制**

    局部与全局注意力交错（5:1），每1个全局注意力层后接5个局部滑动窗口注意力层，大幅减少长上下文推理时的 KV 缓存内存占用。

* **长上下文优化** 

    全局层使用更高的 RoPE 基频（1M），并采用类似于位置插值的技术扩展其注意范围，稳定支持 32K 的上下文长度。


## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "gemma-3-1b-it",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```
