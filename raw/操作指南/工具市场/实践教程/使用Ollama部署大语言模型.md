  
Ollama是一个开源的大模型管理工具，它提供了丰富的功能，包括模型的训练、部署、监控等。 您可以通过Ollama轻松地管理本地的大模型，提高模型的训练速度和部署效率。 百舸工具市场预置了Ollama镜像模板，您可以使用模板快速搭建Ollama工具，使用Ollama进行大语言模型推理
## 准备环境和资源
可根据资源规模、稳定性、灵活性等要求按需准备轻量计算实例或通用计算资源池，用于快速部署Ollama。
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_70a4ac7.png)

## 安装 Ollama
在百舸平台的**工具市场**中选择Ollama模版，点击 **部署工具** 按钮；根据需要部署的模型参数量，选择使用卡数量，至少需要选择1张卡，点击 **确定** 等待工具启动。

![2.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/2_1d42fe3.png)

## 部署模型
您可以在官方模型仓库https://ollama.com/library 找到您想部署的模型，通过JuypterLab部署模型。
除了官方模型仓库提供的模型，您也可以直接加载下载到本地的模型文件。模型文件存储到
OLLAMA_MODELS=/root/ollama/ollama_cache/models 路径。


1. **通过JupyterLab登录**

在工具详情中，点击 **登录 **查看JupyterLab访问地址和SSH登录信息，

![3.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/3_8220b70.png)

您可以在浏览器中打开JupyterLab或使用其他工具通过SSH登录

![5.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/5_619839f.png)


2. **启动Ollama服务**

启动服务
```
#启动ollama服务
ollama serve
```

3. **下载模型**

以部署Llama3 模型为例，使用此命令下载模型
```
ollama pull llama3
```
下载成功示例：

![6.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/6_6f93a2d.png)


4. **其他命令**
```
#启动ollama服务
ollama serve
#从模型文件创建模型
ollama create
#显示模型信息
ollama show
#运行模型
ollama run 模型名称
#从注册表中拉去模型
ollama pull 模型名称
#将模型推送到注册表
ollama push
#列出模型
ollama list
#复制模型
ollama cp
#删除模型
ollama rm 模型名称
#获取有关ollama任何命令的帮助信息
ollama help
```
## **模型测试验证**
### **命令行测试模型**
使用此命令启动模型，进行在线测试。
```
ollama run llama3
```
![7.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/7_8263f77.png)


### 通过API调用模型 

1. **获取OpenAPI 地址**

单击 **登录**，查看OpenAPI地址

2. **调用API**

使用以下代码通过API调用模型。
```
#Generate a response
curl http://106.12.158.93:8028/api/generate -d '{
  "model": "llama3",
  "prompt":"Why is the sky blue?",
  "stream": false
}'
```
```
#Chat with a model
curl http://106.12.158.93:8028/api/chat -d '{
  "model": "llama3",
  "messages": [
    { "role": "user", "content": "why is the sky blue?" }
  ],
  "stream": false
}'
```
更多API信息可以查看Ollama官方文档 
[https://github.com/ollama/ollama/blob/main/docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)
