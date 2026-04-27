DeepSeek-V3-0324 是深度求索公司 2025年3月24日 发布的大语言模型升级版本，属于 DeepSeek-V3 系列的小版本更新，性能提升显著，尤其在代码生成、数学推理、前端开发等方面表现突出。
## 推理能力
### 基准测试显著提升
* MMLU-Pro：75.9 → 81.2（+5.3）
* GPQA：59.1 → 68.4（+9.3）
* AIME：39.6 → 59.4（+19.8）
* LiveCodeBench：39.2 → 49.2（+10.0）
### 更强的代码能力
* 网页、游戏前端界面设计更美观
* 提升生成代码的可执行性，大幅提升开发效率
### 中文搜索与写作能力
* 风格与内容质量增强，中长篇写作质量更高
* 与R1 写作风格对齐
* 增强对报告分析请求的支持，输出更详细
### 功能增强 
* 改进多轮交互式改写
* 优化翻译质量与信件撰写

## API调用
* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_999d65e.png)

* 调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "DeepSeek-V3-0324",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```

## 授权条款
DeepSeek-V3-0324 模型由深度求索公司研发，使用需遵循 [MIT 许可协议](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324/blob/main/LICENSE)