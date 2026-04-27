  
ComfyUI 是一个专为 Stable Diffusion 设计的基于节点的图形用户界面（GUI），将整个图像生成过程分解为多个独立的节点，每个节点都有自己独立的功能，例如加载模型，文本提示，生成图片等等。每个模块通过输入和输出的线连在一起变成一个完整的工作流
## 准备资源
可根据资源规模、稳定性、灵活性等要求按需准备轻量计算实例或通用计算资源池，用于快速部署ComfyUI。
## 安装ComfyUI
1. 在百舸平台**工具市场**选择ComfyUI模版，点击 **部署工具** 按钮；
2. 根据模型开发调试需求，选择使用卡数量，至少需要选择1张卡，点击 **确定** 等待工具启动。

## 访问ComfyUI
### 获取WebUI访问地址
工具部署成功后，您可以在工具详情中找到对应实例，单 **登录 **查看WebUI的访问地址和用户名、密码。
### 设置中文界面
登录WebUI后，默认语言为英文，如需中文界面，可打开ComfyUI Settings，点击 **language option **选择语言。
### 有经验用户设置
已有模型文件无需重新下载的用户，只需将ComfyUI根目录下的**extra_model_paths.yaml.example**文件重命名为**extra_model_paths.yaml**，编辑yaml文件指向您现有的模型位置，然后重启 ComfyUI 即可。
## 下载模型

1. 模型下载

平台内置基础模型，可以满足基础的图片生成需求。若您对推理效果和质量有更高要求，可以在 [https://huggingface.co/](https://huggingface.co/) 或 [https://civitai.com/](https://civitai.com/) 搜索和下载。

2. 对应路径存储

下载您选择的模型检查点，并将其放置在**models/checkpoints**目录中（如果目录不存在，请创建它），然后重启 ComfyUI 以加载新模型。
## 创建工作流
### 启动服务
通过WebUI启动服务，ComfyUI 在您的浏览器中运行时，可以根据界面导航和使用基本操作：

- **画布导航**：拖动画布或按住 空格键 并移动鼠标
- **缩放**：使用鼠标滚轮
- **重置工作流**：如需重新开始，点击菜单中的**加载默认值**

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9f81320.png)

### 快速预览设置
在运行第一次生成之前，修改工作流以便更轻松地预览图像：

1. 移除**Save Image**节点（右键点击并选择**Remove**）
2. 添加**PreviewImage**节点（双击画布，输入 "preview"，选择**PreviewImage**）
3. 将**VAE Decode**的**IMAGE**输出连接到**PreviewImage**的**images**输入

这个设置允许您预览图像而无需自动保存，简化了您的工作流程。
### 生成图像
点击菜单中的**Queue Prompt**，或使用键盘快捷键Cmd+Enter（Mac）/Ctrl+Enter（Windows/Linux）即可。
### 加载外部工作流
ComfyUI 与许多 Stable Diffusion 界面一样，在生成的 PNG 图像中嵌入了工作流元数据。这个功能使得复杂设置的分享和复制变得简单。
加载图像中的工作流：
点击菜单中的 **Load** 按钮或将图像拖放到 ComfyUI 窗口中相关的工作流将自动加载，包括所有节点和设置。
## 保存文件
为了帮助组织您的图像，您可以通过**file_prefix**小部件将特殊格式的字符串传递给输出节点。
要自动将某些节点小部件的值插入文件名，可以使用以下语法：**%node_name.widget_name%**例如，如果我们希望按分辨率存储图像，我们可以为节点提供以下字符串：**%Empty Latent Image.width%x%Empty Latent Image.height%/image**。然后，这些字符串将被指定的节点值替换。
有时节点名称可能相当大，或者可能有多个节点共享相同的名称。在这些情况下，可以在节点选项菜单的**属性>节点名称用于S&R**下指定一个特定名称。

## 附录
核心节点列表可以参考ComfyUI官方文档 [https://comfyuidoc.com/zh/Core%20Nodes/Image/](https://comfyuidoc.com/zh/Core%20Nodes/Image/)
快捷键列表可以参考ComfyUI官方文档 [https://comfyuidoc.com/zh/Interface/Shortcuts.html](https://comfyuidoc.com/zh/Interface/Shortcuts.html)
ComfyUI示例可以参考ComfyUI官方文档 [https://comfyuidoc.com/zh/Examples/](https://comfyuidoc.com/zh/Examples/)
