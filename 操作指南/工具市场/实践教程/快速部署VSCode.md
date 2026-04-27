## 准备资源
可根据资源规模、稳定性、灵活性等要求，在**AI计算资源**中按需准备轻量计算实例或自运维资源池，用于快速部署Vscode开发机。[AI计算资源](https://cloud.baidu.com/doc/AIHC/s/Xlzkvayzs)


## 部署VSCode
1. 在 **工具市场>工具模版** 选择VSCode模版，点击 **部署工具 **按钮快速部署工具。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_281b09c.png)

2. 根据模型开发调试需求设置开发资源配置，点击 **确定 **启动工具。


## 通过浏览器访问VSCode
在**我的工具**中找到创建的开发机，进入详情页，

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_56b3359.png)

在详情页点击资源实例下的 **登录 **，选择 **通过Vscode登录 ** 即可访问。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_337c56a.png)


## 配置外网访问
如需要外网访问时，您需要自行通过安全组功能添加出入站规则 [创建安全组](https://console.bce.baidu.com/network/#/vpc/security/list)。

## 注意事项

**您需妥善保管工具地址和token，避免泄露，尤其配置了外网访问时，token泄露可能会造成损失，开发者需明确知悉风险，做好相关防护。**

## VSCode使用指南
官方文档：https://code.visualstudio.com/docs