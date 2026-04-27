## 准备资源

可根据资源规模、稳定性、灵活性等要求按需准备轻量计算实例或通用计算资源池，用于快速部署JuypterLab开发机。[AI计算资源](https://cloud.baidu.com/doc/AIHC/s/Xlzkvayzs)


## 部署JupyterLab

1. 在 **工具市场**中选择JuypterLab模版，点击 **部署工具 **按钮快速部署工具。


![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f9e4cf4.png)


2. 根据模型开发调试需求，选择使用卡数量，至少需要选择1张卡，点击 **确定 **启动工具。

## 通过浏览器访问JupyterLab
在**我的工具**中找到创建的开发机，进入详情页

![4.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/4_ab59c3a.png)

在详情页点击资源实例下的 **登录 **，选择 **JupyterLab **访问地址即可访问。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ab9cee0.png)



## 配置外网访问
如需要外网访问时，您需要自行通过安全组功能添加出入站规则 [创建安全组](https://console.bce.baidu.com/network/#/vpc/security/list)

## 注意事项

**您需妥善保管工具地址和token，避免泄露，尤其配置了外网访问时，token泄露可能会造成损失，开发者需明确知悉风险，做好相关防护**

## Jupyter使用参考

官方文档： [https://jupyter-notebook.readthedocs.io/en/latest/](https://jupyter-notebook.readthedocs.io/en/latest/)

