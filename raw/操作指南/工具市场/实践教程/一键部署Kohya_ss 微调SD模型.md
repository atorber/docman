Kohya_ss主要用于训练图像生成模型，提供用于模型训练的WebUI可视化界面。在AI绘画场景中，您可以将经过训练的LoRA模型应用于Stable Diffusion（SD）服务，作为辅助模型，以提升SD绘画的效果
## 准备环境和资源
可根据资源规模、稳定性、灵活性等要求按需准备轻量计算实例或通用计算资源池，用于快速部署Kohya_ss。

## 安装Kohya_ss
1. 在百舸平台**工具市场**中选择 **Kohya_ss **模版，点击 **部署工具** 按钮，快速部署Kohya_ss。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9f701c6.png)

2. 根据需要部署的模型参数量，选择使用卡数量，至少需要选择1张卡，点击** 确定** 等待工具启动。

## 访问WebUI
工具部署成功后，您可以在工具详情中找到对应实例，单击 **登录** 查看WebUI的访问地址和用户名、密码。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_90fc660.png)

## 准备训练数据
目录/root/kohya_ss/test/img with spaces/10_darius kawasaki person下有制作好的数据可以直接使用。

对于LoRA，图片收集的标准：
* 数量几十张即可；
* 分辨率适中，勿收集极小图像；
* 数据集主题和风格统一，图片不宜有复杂背景以及其他无关人物；
* 图像人物尽量多角度，多表情，多姿势；
* 凸显面部的图像数量比例稍微大点，全身照的图片数量比例稍微小点。

### 数据预处理
主要是图像分辨率方面的预处理，可以将图片裁剪到512✖️512，可使用[https://www.birme.net/](https://www.birme.net/)进行批量裁剪。

### 图片标注
对每张训练图片加以文字描述，<font style="color:rgb(25, 27, 31);">并保存为与图片同名的txt格式文本。</font>
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_449124d.png)

可能会遇到ImportError: libGL.so.1: cannot open shared object file: No such file or directory，执行：

```plain
apt-get install -y libgl1-mesa-glx
```



## LoRA微调
### 参数设置

为了能够稳定地进行训练，推荐如下配置：

+ LoRA > Training > Accelerate launch > Resource Selection > Mixed precision，选择精度为bf16；

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_11f73a5.png)

+ LoRA > Training > Model，填写<font style="color:#1c1d1f;">Pretrained model name or path、Trained Model output name和Image folder。然后勾选"SDXL"和"bf16"；</font>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_69bc037.png)

注意：<font style="color:#1c1d1f;">Image folder路径要包含图像子文件夹。以内附数据集为例，Image folder应填写/root/</font>kohya_ss/test/img with spaces

+ LoRA > Training > Folders，<font style="color:#1c1d1f;">填写Output directory for trained model和Logging directory。这里可以设置Output directory for trained model为/root/apps/model；</font>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e2e93b9.png)

然后，在LoRA > Training > Parameters下，可以调整训练参数。

### 开始微调
设置好训练的配置后，点击"start training"按钮，训练可随时通过点击"stop training"按钮终止训练。更新训练配置后，选择新的输出模型路径或模型名，即可重新开始训练。

注意：训练详情建议在终端执行tail -f /root/apps/logs/kohya.log查看。

成功进行LoRA训练的截图：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9c699f6.png)

tensorboard打开参考 2.2 Dreambooth训练。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_3f4ebe3.png)

训练完成后，我们可以在/root/apps/model下找到训练好的LoRA模型：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_0b16b2a.png)

以及在/root/apps/log下存储的相关训练日志：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_b29d492.png)

出于安全考虑，我们暂时禁用了训练过程中tensorboard面板的实时启用，不过用户仍然可以通过如下命令行查看。其中，port 和 logdir可替换为自定义的端口和tensorboard日志路径：
``
tensorboard --host 0.0.0.0 --port 6009 --logdir=/root/apps/log/20241029160703/network_train
``
浏览器访问容器所在节点的公网IP : port，例如节点公网IP为120.48.10.237，端口设置为6009时，访问http://120.48.10.237:6007/即可查看。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_dd53105.png)


## Dreambooth微调
### 参数设置
可参考Lora微调中的参数配置。
### 开始微调
Dreambooth对于cuda内存的消耗很大，原因在于所有模型参数及其梯度都会被加载和更新，A10 24GB的内存占用率会很快达到100%，然后导致OOM。尽管已经将batchsize设置为1，此外，使用fp16训练也可能缓解内存占用，但可能导致Nan detected in latents错误。


## 参考文档

[https://github.com/burashixi/kohya_ss_localized_zh/tree/master](https://github.com/burashixi/kohya_ss_localized_zh/tree/master)

