AIAK-Training-LLM是百度智能云基于百度百舸·AI计算平台，面向大模型训练场景提供的最佳实践解决方案配套AI加速工具，帮助模型开发者高效完成大规模深度学习分布式训练，提升训练效率，相比开源 Megatron-LLM性能明显提升。
## 使用前提

- 基础设施为百度智能云云资源（购买百度云CCE及配套资源）
- 运行环境硬件资源须和加速镜像支持的芯片匹配
- 运行环境操作系统版本推荐CentOS7+
## 环境版本

### 基础依赖

| **芯片** | H800、A800、L20 |
| --- | --- |
| **NVIDIA Driver** | 450.51 (or later R450)、470.57 (or later R470)、510.47 (or later R510)、525.85 (or later R525)、535.86 (or later R535)、545.23 (or later R545) |

百舸资源池资源已默认内置上述驱动，如手动操作更新过驱动需自行确认驱动版本在上述列表。

### 预装软件包

| **基础镜像** | ubuntu22.04 |
| --- | --- |
| **框架** | Megatron Core（截止0702版本） |
| **PyTorch** | v2.2.0 |
| **CUDA** | v12.3 |
| **Python** | v3.10 |
| **BCCL** | v1.2.7.2 |

## 镜像获取
在百舸控制台进入 [AI加速套件](https://console.bce.baidu.com/aihc/hubs/detail?name=AIAK-Training-LLM) 菜单中可获取最新版本镜像

## 模型支持

| **Model Family** | **Model Architecture** | 预训练 | SFT |
| --- | --- | --- | --- |
| llama2 | llama2-7b, llama2-13b, llama2-70b | ✓ | ✓ |
| llama3 | llama3-8b, llama3-70b | ✓ | ✓ |
|llama3.1|llama3.1-8b, llama3.1-70b,llama3.1-405b|✓ | ✓ |
| baichuan2 | baichuan2-7b, baichuan2-13b | ✓ | ✓ |
| qwen | qwen-1.8b, qwen-7b, qwen-14b, qwen-72b | ✓ | ✓ |
| qwen1.5 | qwen1.5-0.5b, qwen1.5-1.8b, qwen1.5-4b, qwen1.5-7b, qwen1.5-14b, qwen1.5-32b, qwen1.5-72b | ✓ | ✓ |
| qwen2 | qwen2-0.5b, qwen2-1.5b, qwen2-7b, qwen2-72b | ✓ | ✓ |
| qwen2.5 | qwen2.5-0.5b，qwen2.5-1.5b，qwen2.5-3b，qwen2.5-7b, qwen2.5-14b，qwen2.5-32b，qwen2.5-72b | ✓ | ✓ |
| mixtral | mixtral-8x7b, mixtral-8x22b | ✓ | ✓ |
| cogvlm2 | cogvlm2-llama3-chinese-chat-19b | ✓ | - |
| stdit | stdit-xl/2 | ✓ | - |
| deepseek | deepseek-v2-lite deepseek-v2 deepseek-v3 | ✓ | ✓ |

> 更多信息和使用说明参见百舸在线产品文档

