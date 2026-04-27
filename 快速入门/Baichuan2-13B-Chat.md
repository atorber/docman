## 模型介绍

Baichuan 2 是百川智能推出的新一代开源大语言模型，Baichuan2-13B-Chat 包含130亿参数，采用 2.6 万亿 Tokens 的高质量语料训练，在权威的中文和英文 benchmark 上均取得同尺寸最好的效果。Baichuan2-13B-Chat 是聊天模型，通过进一步优化能更好的遵循人类指令，而且在对话和上下文理解方面也表现出色。

## 架构

Baichuan 2的模型架构基于主流的Transformer，但进行了若干优化

* **Tokenizer** 

平衡高压缩率与适当词汇表大小，将词汇表从Baichuan 1的64,000扩展到125,696。

* **位置嵌入**

Baichuan 2 - 7B采用旋转位置嵌入（RoPE），Baichuan 2 - 13B采用ALiBi。ALiBI是一种较新的位置编码技术，在长文本外推方面表现出更强的性能。

* **激活函数和归一化**

用SwiGLU激活函数，将隐藏大小从4倍减少到8/3倍并四舍五入到128的倍数。注意力层采用xFormers实现的内存高效注意力，整合ALiBi位置编码并减少内存开销。在Transformer块输入上应用层归一化，用RMSNorm实现提高效率。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bee5749.png)

2.调用示例

```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{
    "model": "Baichuan2-13B-Chat",
    "messages": [{"role": "system", "content": "你是一个天文学专家。"},{"role": "user", "content": "请问人类是否可以登录火星？"}],
    "max_tokens": 1024,
    "temperature": 0.7
}'
```