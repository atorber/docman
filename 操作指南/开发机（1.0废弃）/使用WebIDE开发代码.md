WebIDE是开发机提供的在线集成开发环境。百舸平台的开发机基于开源的JupyterLab实现，用户可以直接在浏览器打开WebIDE获得更好的在线开发体验。

## 使用平台默认WebIDE

1. 在开发机列表中通过开发机列表中【Web IDE】操作按钮在新标签打开开发机

![使用WebIDE开发代码.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E4%BD%BF%E7%94%A8WebIDE%E5%BC%80%E5%8F%91%E4%BB%A3%E7%A0%81_19a4e97.png)

1. 在JupyterLab控制台进行开发操作，Jupyter使用参考：
   - JupyterLab [官方文档](https://jupyter-notebook.readthedocs.io/en/latest/)
   - 中文教程 [Jupyter Notebook介绍、安装及使用教程](https://www.jianshu.com/p/91365f343585)


## 自定义WebIDE

除使用平台默认WebIDE之外，用户可以在自定义镜像中预置自定义WebIDE服务，例如[Web在线版VS Code](https://github.com/coder/code-server)，平台在创建开发机时会通过环境变量指定服务访问路径`JUPYTERLAB_BASE_URL`，在服务中使用JUPYTERLAB_BASE_URL的值作为默认路径即可在开发机列表页直接使用服务。
