  
AIAK-Inference-LLM是百度智能云基于百舸AI计算平台，面向大模型推理场景提供的最佳实践解决方案配套 AI 加速工具，帮助模型开发者高效完成大模型推理部署，提升推理效率，相比开源vLLM性能可大幅提升。

## 使用前提

- 基础设施为百度智能云云资源（购买百度云CCE及配套资源）
- 运行环境硬件资源须和加速镜像支持的芯片匹配
- 运行环境操作系统版本推荐CentOS7+

## 基础依赖
| 芯片 | A800、H800、4090等 |
| --- | --- |


## 软件包说明
| 操作系统 | ubuntu22.04 |
| --- | --- |
| **PyTorch** | v2.5.1 |
| **CUDA** | v12.3 |
| **Python** | v3.10 |
| **测试工具** | Performance Tool |


## 模型支持
| 模型系列 | 模型名称 |
| --- | --- |
| Llama1 | 30B |
| Llama2 | 7B、13B、70B |
| Llama3 | 8B、70B |
| Qwen | 14B、72B |
| Qwen1.5 | 0.5B、1.8B、4B、7B、14B、32B、72B、110B |
| Qwen2 | <font style="color:rgb(31, 35, 40);">0.5B、1.5B、7B、72B、57BA14B</font> |
| Qwen2-VL | <font style="color:rgb(31, 35, 40);">7B</font> |
| Qwen2.5 | <font style="color:rgb(31, 35, 40);">0.5B、1.5B、3B、7B、14B、32B、72B</font> |
| Baichuan2 | <font style="color:rgb(31, 35, 40);">7B、13B</font> |
| Mixtral | 7B*8、22B*8 |
| ChatGLM2 | <font style="color:rgb(31, 35, 40);">6B</font> |
| InternLM2 | <font style="color:rgb(31, 35, 40);">20B</font> |


## 镜像获取
在百舸控制台进入 [AI加速套件](https://console.bce.baidu.com/aihc/hubs/detail?name=AIAK-Inference-LLM) 菜单中可获取最新版本镜像。


> 更多信息和使用说明参见百舸在线产品文档

