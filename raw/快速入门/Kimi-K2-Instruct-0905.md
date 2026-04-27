Kimi K2 是月之暗面开源的 混合专家 (MoE) 语言模型，Kimi K2-Instruct-0905 是 Kimi K2 最新且性能最强的版本，具有320亿激活参数和1万亿总参数量。

### **核心特性**

#### 增强的智能体编码能力
Kimi K2-Instruct-0905在公共基准测试和实际编码智能体任务中展现出显著性能提升。

#### 改进的前端编程体验

该版本在前端编程的视觉美观性与实践实用性方面实现双重突破。

#### 扩展的上下文长度

上下文窗口从128K词元扩展至256K词元，为长周期任务提供更强大的支持。


### API调用
1. 服务部署成功后，可在服务列表查看调用信息

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=bb3a09f4c9ef45c089b540988b7b9f1e&docGuid=wdyXqmIbsW9dU2 "")

2.调用示例

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "Kimi-K2-Instruct-0905",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'

```
