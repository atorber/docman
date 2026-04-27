## 什么是AIAK大模型训推加速套件？

AIAK大模型训推加速套件（后文使用简称 AIAK）是百舸基于百舸平台推出的大模型AI加速能力，用来加速Megatron、Megatron-Core等训练框架的大语言模型，能极大提升大模型分布式训练和推理的性能。下图为AIAK的整体解决方案架构图。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_54b0a5c.png)

## 应用场景

AIAK大模型训推加速套件支持但不限于以下场景：
* 训练加速镜像，例如llama、qwen、baichuan、mixtral等系列模型的Postpretrain和SFT微调场景的训练加速。
* 推理加速镜像，例如llama、qwen、baichuan等系列模型的推理加速。
* 模型权重格式转换和并行策略切分工具，支持模型权重从Huggingface到Megatron框架的相互转换，支持Megatron框架下模型权重按照不同的DP、TP、PP并行策略进行切分。
* 自适应并行策略搜索工具，支持并行策略自动搜索，方便用户快速进行性能调优，以达到该配置下的最优配置性能

## 产品优势
* 多框架支持：提供对Megatron和、Megatron-Core多种训练框架的加速优化。
* 轻量便捷：基于开源框架编写并集成了主流开源大模型的模型代码，用户只需修改少量参数，即可快速提交训练任务或进行推理服务部署。
* 性能优异：相比社区主流框架，如Megatron和vLLM等，使用AIAK大模型训推加速工具包，训练和推理性能可大幅提升。

## 下载和使用

进入百舸控制台，在左侧菜单中找到【AI加速套件】即可获取镜像地址和工具下载地址，每个镜像和工具对应有详细的使用操作说明。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_175ddf2.png)

