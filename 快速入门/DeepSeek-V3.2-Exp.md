DeepSeek-V3.2-Exp是DeepSeek模型的一个实验版本。作为迈向下一代架构的中间步骤，V3.2-Exp 在 V3.1-Terminus 的基础上引入了 DeepSeek 稀疏注意力机制——一种旨在探索和验证在长上下文场景中训练和推理效率优化的稀疏注意力机制。

这个实验版本代表了DeepSeek对更高效变压器架构的持续研究，特别关注在处理扩展文本序列时提高计算效率。


## 模型摘要

### DeepSeek Sparse Attention（DSA）

稀疏注意力机制
DeepSeek Sparse Attention（DSA）首次实现了细粒度稀疏注意力机制，在几乎不影响模型输出效果的前提下，实现了长文本训练和推理效率的大幅提升。

为了严谨地评估引入稀疏注意力带来的影响，特意把 DeepSeek-V3.2-Exp 的训练设置与 V3.1-Terminus 进行了严格的对齐。在各领域的公开评测集上，DeepSeek-V3.2-Exp 的表现与 V3.1-Terminus 基本持平。

### TileLang & CUDA 算子开源
在新模型的研究过程中，需要设计和实现很多新的 GPU 算子。我们使用高级语言 TileLang 进行快速原型开发，以支持更深入的探索。在最后阶段，以 TileLang 作为精度基线，逐步使用底层语言实现更高效的版本。因此，本次开源的主要算子包含 TileLang 与 CUDA 两种版本。我们建议社区在进行研究性实验时，使用基于 TileLang 的版本以方便调试和快速迭代。

### 论文链接 & 模型开源

查看深度求索 [官方发布公告](https://mp.weixin.qq.com/s/6hKi5F_S2zQ4g6SyF0UNow)

## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c71f0ba.png)

* 调用示例

```bash
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-V3.2-Exp",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
DeepSeek-V3.2-Exp 模型由深度求索公司研发，使用需遵循 [MIT 许可协议](https://huggingface.co/deepseek-ai/DeepSeek-V3.2-Exp/blob/main/LICENSE)