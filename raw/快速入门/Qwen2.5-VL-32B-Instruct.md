Qwen2.5-VL 是通义千问推出的多模态大模型，在 Qwen-VL 的基础上进行了升级，增强了图像理解、文本理解和多模态交互能力，能够处理更复杂的视觉-语言任务。
## 核心升级
### 视觉理解能力增强
Qwen2.5-VL 不仅能精准识别常见物体（如花鸟鱼虫），还擅长分析图像中的文本、图表、图标、图形与布局。
### 智能体（Agent）能力
可直接作为视觉智能体动态调用工具，支持计算机操作和手机交互。

### 长视频理解与事件捕捉
可解析超过1小时的长视频，新增事件定位能力，能精准锁定相关视频片段。

### 多格式视觉定位
通过生成边界框（bounding boxes）或关键点（points）精确标注图像中的物体，并输出稳定的 JSON 格式坐标与属性数据。

### 结构化输出生成
针对发票扫描件、表单、表格 等数据，支持结构化内容输出，适用于金融、商业等场景。

## API调用
1. 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_5b92ae3.png)

2.调用示例 
```
curl -X POST "<访问地址>/v1/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TOKEN" \
-d '{
  "model": "Qwen2.5-VL-32B-Instruct",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "请描述这张图片的内容"},
        {"type": "image_url", "image_url": {"url": "https://example.com/path/to/image.jpg"}}
      ]
    }
  ],
  "max_tokens": 1024,
  "temperature": 0.7
}'
```