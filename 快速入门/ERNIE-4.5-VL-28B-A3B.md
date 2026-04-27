ERNIE 4.5 是一个全新的大规模多模态模型系列，包含 10 个不同的变体。该系列由拥有 470 亿和 30 亿激活参数的混合专家 (MoE) 模型组成，其中最大的模型总参数量达到 4280 亿，此外还有一个包含 3 亿参数的稠密模型。针对 MoE 架构，文心模型提出了一种新颖的异构模态结构，该结构支持跨模态的参数共享，同时也为每个单独的模态保留了专用参数。这种 MoE 架构非常适用于从大型语言模型进行持续预训练以构建多模态模型。它还能够在增强多模态理解的同时，提升文本相关任务的性能。

## 关键技术点
### 多模态异构 MoE 预训练
文心模型在文本和视觉两种模态上进行联合训练，以更好地捕捉多模态信息的细微差别，并提升在文本生成、图像理解和跨模态推理等任务上的性能。为了在实现这一目标的同时，避免单一模态对其他模态学习过程的干扰，文心设计了异构 MoE 结构，引入了三维旋转位置编码，并采用了路由正交损失和多模态令牌平衡损失。这些架构上的选择确保了两种模态都能得到有效的表征，在训练过程中实现相互促进。

### 高可扩展性的高效基础设施
文心为 ERNIE 4.5 模型的高效训练，引入了一套创新的异构混合并行与分层负载均衡策略。通过运用节点内专家并行、内存高效的流水线调度、FP8 混合精度训练、以及细粒度重计算等方法，实现了卓越的预训练吞吐量。在推理方面，针对 W4A8 精度提出了多专家并行协作方法，并为纯权重 2比特精度设计了卷积码量化算法。文心的 PD 解耦方案融合了多级负载均衡，并实现了预填充和解码阶段的动态角色切换。此外，基于飞桨深度学习框架，ERNIE 4.5 在多种硬件平台上都能实现高性能推理。

### 特定模态的后训练
为了满足现实世界应用的多样化需求，对预训练模型的不同变体针对特定模态进行了精调。文心大语言模型专为通用语言理解与生成任务进行了优化。视觉语言模型则专注于视觉语言理解，并支持思考和无思考两种模式。每个模型在后训练阶段，都结合运用了有监督精调、直接偏好优化,或一种名为统一偏好优化的改良版强化学习方法。

## API调用

1.服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c9f66ce.png)

2.调用示例
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: $Token" \
-d '{
  "messages": [
    {"role": "user", "content": "写一个300字的小说大纲，内容是李白穿越到现代，最后成为公司文职人员的故事"}
  ]
}'


输入包含图片时，按如下命令请求
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: $Token" \
-d '{
  "messages": [
    {"role": "user", "content": [
      {"type":"image_url", "image_url": {"url":"https://paddlenlp.bj.bcebos.com/datasets/paddlemix/demo_images/example2.jpg"}},
      {"type":"text", "text":"图中的文物属于哪个年代?"}
    ]}
  ]
}'


输入包含视频时，按如下命令请求
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: $Token" \
-d '{
  "messages": [
    {"role": "user", "content": [
      {"type":"video_url", "video_url": {"url":"https://bj.bcebos.com/v1/paddlenlp/datasets/paddlemix/demo_video/example_video.mp4"}},
      {"type":"text", "text":"画面中有几个苹果?"}
    ]}
  ]
}'


当前ERNIE-4.5-VL模型支持思考模式且默认开启，按如下命令关闭思考
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: $Token" \
-d '{
  "messages": [
    {"role": "user", "content": [
      {"type": "image_url", "image_url": {"url": "https://paddlenlp.bj.bcebos.com/datasets/paddlemix/demo_images/example2.jpg"}},
      {"type": "text", "text": "图中的文物属于哪个年代"}
    ]}
  ],
  "metadata": {"enable_thinking": false}
}'
```


