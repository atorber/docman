## 概述
TensorBoard是一个用于可视化TensorFlow模型训练过程和结果的工具。它可以帮助开发人员和研究人员更好地理解和调试他们的模型，从而提高模型的性能和效率。百舸AI计算平台AIHC中集成了Tensorboard的能力，本文将介绍如何在百舸平台使用Tensorboard。

## 功能说明

1.  百舸Tensorboard服务使用百度云的鉴权体系进行安全访问限制，保证数据的安全。
2. 为避免资源池残留大量的Tensorboard实例，百舸对Tensorboard实例采用定时回收机制，默认保留24小时。如已经被回收，Tensorboard实例会在下次查询时触发实时创建，预计需要1分钟。
  
## 使用限制

已经创建的训练任务，暂不支持开启Tensorboard

## 操作步骤

### 创建任务开启Tensorboard服务

1. 登录百舸AI计算平台AIHC控制台.
2. 进入 **分布式训练** 页面，点击 **创建任务** 按钮
3. 在高级配置模块选择开启Tensorboard。如未安装Tensorboard依赖组件，则需要先安装后，才能开启Tensorboard。

> 说明：资源池内的训练任务，首次开启Tensorboard，需要资源池安装 CCE Ingress NGINX Controller  组件，并会自动创建一个BLB作为Tensorboard服务的访问入口。后续此资源池内其他训练任务开启Tensorboard，可以复用此BLB

4.Tensorboard日志读取路径，百舸会自动生成

> 注意：请保持该路径与代码中的Tensorboard日志路径一致，否则Tensorboard无法获取数据。

5.点击 完成，完成训练任务创建以及Tensorboard的开启

### 查询Tensorboard

训练任务开启Tensorboard后，百舸控制台进入任务关联的Tensorboard实例。
1. 进入训练任务页面，点击更多>Tensorboard，跳转至Tensorboard面板
2. 进入Tensorboard面板后，您可以在页面查看分析报告

> 已失败/成功/运行中的任务均支持通过tensorboard查询训练效果。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6be68c0.png)


