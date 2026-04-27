  
# 工具介绍


> Label Studio 是一个开源的多类型数据标注平台，支持文本、图像、音频、视频等多种数据类型，并且提供了灵活的标注模板、协作管理功能以及可插拔的机器学习（ML）后端接口，方便实现自动标注和主动学习流程。


Label Studio 是 Heartex 开源的一款功能强大且可以高度定制的多模态数据标注平台。广泛的应用于机器学习领域的数据准备环节，典型的场景包括自然语言处理、计算机视觉、语音音频处理、自动标注以及人机协作等等。

它的核心功能包括：

* 多类型数据标注
* 可定制标注模板
* 协作与权限管理
* 机器学习后端集成
    * 可连接内置或自定义的 ML Backend
    * 支持预标注、自动预测、主动学习

* 数据导入导出
    * 多种数据格式（JSON, CSV, COCO, YOLO 等）
    * REST API 接口可批量导入/导出数据

* 开放 API

**主界面：**

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=0d723c31a138438c96938eac75c45ae3&docGuid=e87iEEt7zWA7l6 "")
**数据管理：**

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=84beeef700c5472b90ac71f76999abf8&docGuid=e87iEEt7zWA7l6 "")
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=aed0f76bcb924ab8856d56a6cd2bd6b9&docGuid=e87iEEt7zWA7l6 "")




**官方地址**：

[https://labelstud.io/](https://labelstud.io/)

# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|按需|4核以上|
|内存|按需|8G以上|
|GPU|按需|按需|
|CDS|按需|20G以上|
|其它|无|无|



# 使用说明
本文以猫狗分类为例，介绍使用Label Studio进行数据标注的操作步骤

## **创建与登录开发机**
根据部署环境要求成功创建开发机，选择自定义端口，选择 8990（或者其他端口，此端口为 label studio 服务在容器内的监听端口），blb 根据是否开通公网来进行选择。

创建成功后，点击登录开发机，进入开发机 webIDE，并打开 VScode 中的 terminal 

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=8ca9fe52b68a42c3a11f654c648bdc2a&docGuid=0t0W9c4-jBNf8Z "")
## 启动 Label Studio 服务
按照如下命令与说明，启动 label studio 服务

```
# 启动命令设置初始的用户名密码，指定服务的端口为开发机设置的容器服务端口，设置数据目录，用于挂载
label-studio start --username admin@mail.com --password admin123 --port 8990 --data-dir /label-studio/data

#启动前须知
    #username：初始用户名；注意：用户名格式需要是邮箱格式，否则会无效
    #password：初始用户名对应的密码，可根据实际情况自定义
    #port：服务监听端口。该端口需要和自定义端口中设置的容器内监听端口保持一致
    #data-dir：服务的数据保存目录


# 重置密码
# label-studio reset_password --username admin@mail.com --password 'xxx' --data-dir /label-studio/data

# 用户查询
# label-studio user --username admin@mail.com --data-dir /label-studio/data
```


##  Label Studio 使用
1. 在开发机详情页面的访问端口，选择对应的服务名称的内网访问指令或者外网访问指令进行复制，粘贴到浏览器打开

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=29952a6ded8047bcac4dd675102e56c2&docGuid=e87iEEt7zWA7l6 "")
2.  使用启动命令中设置的用户名密码登录后进行使用

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=ff9991592f5d4b1ca6210df1133ba4c1&docGuid=e87iEEt7zWA7l6 "")


3. 点击 Create Project 创建新项目，输入项目名如（猫狗分类）

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=3c1ff19eee784bbe9c6b30ff61cff2e5&docGuid=e87iEEt7zWA7l6 "")


4. 配置 Labeling Interface（标注界面）

点击进入项目，点击右上角 Setting 进入设置界面，在左边栏选择 Labeling Interface。配置分类标签，可以选择 XML 代码格式或者图形界面模式，也可以浏览模板来进行使用和修改。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=709fdca1868d43a5b60bb08719c87125&docGuid=e87iEEt7zWA7l6 "")


5. 上传数据进行标注

点击项目中右上角的 import，然后可以通过 URL 或者本地上传数据

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=80b8c693dc174758b6f2d62b0064d3cc&docGuid=e87iEEt7zWA7l6 "")


6. 数据标注

打开项目，系统会显示一张图片，只需要选择 cat 或者 dog，然后点击 Submit

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=94f48c80941945c080613ad934aa674f&docGuid=e87iEEt7zWA7l6 "")


7. 导出

标注完成后，在项目右上角点击 export 进行标注导出，支持多种格式如 CSV/JSON/COCO 等。导出的结果里会抱憾每张图片的标签

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=14df18ba5de44ce991ac3b323bc9ef8b&docGuid=e87iEEt7zWA7l6 "")

