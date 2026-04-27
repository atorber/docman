  
## 概述
本文介绍如何开启并使用GPU显存共享功能，开启后支持多任务共享同一张卡的显存和算力资源。

## 前提条件
开启GPU显存共享功能的节点基础环境符合兼容性要求，详情参考https://cloud.baidu.com/doc/CCE/s/9lrrdyikg 。
如节点基础环境不符合要求，需要从资源池中移出，在BCC控制台进行操作系统重装。

节点基础环境建议版本：

* OS：Ubuntu 22.04
* CUDA：12.2
* Driver：535.x

2.  组件版本要求：
* CCE AI Job Scheduler：1.7.34以上
* CCE GPU Manager：1.5.46以上

## 创建物理队列并开启显存共享功能
1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)。 
2. 在左侧菜单栏选择**自运维资源池**，进入**资源池列表**页面，找到您想要查看的资源池，进入资源池详情。 
3. 进入**队列管理**页面，创建物理队列，并开启“显存共享”开关，选择要添加到队列的节点规格和数量。  

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_a197fa9.png)

4. 单击**确定**，完成队列创建。  
5. 队列列表页面能看到队列带有“显存共享”标签。
 
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c629923.png)

## 开启显存共享的物理队列创建子队列

平台支持在物理队列下继续创建子队列，从而实现更精细化的资源管理。

![whiteboard_exported_image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/whiteboard_exported_image_cd422d8.png)


用户在创建普通队列时，父队列可以选择开启【显存共享】的物理队列（需要确保父队列没有任务），支持给子队列分配小数卡，如下图所示。


![infoflow 2025-07-17 10-50-20.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/infoflow%202025-07-17%2010-50-20_63fe4a2.png)

用户可以在物理队列的子队列上提交开发机、训练任务和在线推理服务。


## 提交训练任务
1. 进入百舸分布式训练页面并创建任务 https://console.bce.baidu.com/aihc/tasks
 
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bd83d9e.png)

2. 选择开启了显存共享的资源池和队列

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_13ebb28.png)。

3. 资源配置中填写需要使用的算力资源，支持填写0-1之间的一位小数，如0.1即代表申请10%的算力和显存。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_4690a7e.png)