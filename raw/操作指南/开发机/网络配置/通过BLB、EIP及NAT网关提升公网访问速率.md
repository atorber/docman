# 介绍
在百舸平台进行AI开发时，开发存在机需要与公网进行交互的场景

1. 下载大型数据集、拉取Docker镜像、安装依赖包（pip/conda）等，需要百舸开发机从公网下载资源的场景，依赖于**弹性公网IP（EIP）** 以及**NAT网关**的组合。通过升级这两个组件的规格参数，可以显著提升网络带宽和并发处理能力。
2. 进行远程调试、开发机对外公开端口提供WEB服务等，需要百舸开发机通过端口输出数据的场景，依赖于**负载均衡（BLB）**以及**弹性公网IP（EIP）**的组合。通过升级这两个组件的规格参数，可以显著提升网络带宽和并发处理能力

## 原理
公网流量进入开发机的路径通常为：**公网请求 -> EIP -> BLB -> 开发机**。若您希望提升性能，需同步调大EIP的带宽和BLB的规格参数。

开发机下载公网资源：**开发机 -> 路由（NAT网关的SNAT设置）-> EIP**。若您希望提升这部分性能，提升带宽请调整EIP带宽设置，提升并发连接数/转发能力请调整NAT网关的CU设置。

如果场景对性能有较严格的需求，可以考虑使开发机独占EIP资源（通过设置路由和BLB），和其他开发机/推理服务隔离开来，追求获得最大网络性能。

## 前置条件
1. 开发机已启用自定义端口，并成功绑定支持公网的BLB，未绑定请参考文档[开发机实例开启访问公网](https://cloud.baidu.com/doc/AIHC/s/ymjshzeny)。

## 操作步骤
### 公网访问开发机
#### 调整 EIP 带宽
调整 EIP 带宽共有两种方式：
方式一：
1. 打开开发机实例详情，在访问配置中找到BLB配置，点击BLB地址进入弹性公网实例详情；
![image \(6\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%286%29_f8b751f.png)

2. 点击调整带宽；
![image \(7\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%287%29_0e30c99.png)

3. 根据需求调整公网带宽。

![image \(8\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%288%29_bc85af7.png)



方式二:

1. 打开开发机实例详情，在访问配置中找到EIP配置，点击EIP地址进入弹性公网实例详情；

![image \(9\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%289%29_95a27e1.png)
2. 复制实例id，返回上级菜单，进行检索找到具体实例，点击带宽调整，进入变更配置页面。

![image \(10\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2810%29_f0d1a7e.png)
![image \(11\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2811%29_8168f76.png)
![image \(12\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2812%29_63585c8.png)
3. 根据需求调整公网带宽。

![image \(13\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2813%29_bc85af7.png)

#### 调整 BLB 性能规格

1. 打开开发机实例详情，在访问配置中找到BLB配置，点击BLB地址进入弹性公网实例详情；

![image \(14\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2814%29_f8b751f.png)
2. 复制实例id，返回上级菜单，进行检索找到具体实例，点击性能调整，进入变更配置页面。

![image \(15\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2815%29_93fc592.png)
![image \(16\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2816%29_4e31a1f.png)
![image \(17\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2817%29_fb34946.png)
3. 根据需求变更配置。

![image \(18\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2818%29_2f583ce.png)


### 开发机访问公网
如何为开发机开通从公网下载： [容器实例开启访问公网](https://cloud.baidu.com/doc/AIHC/s/ymjshzeny)

#### 调整 EIP 带宽
同上述操作，参见上述内容。

#### 配置NAT网关
若您想提升连接数等性能，则需要调整NAT网关的设置
1. 新建NAT时，设置性能容量
![image \(19\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2819%29_66d096e.png)

2. 编辑NAT性能容量
    1. 左上角选中目标NAT所在的vpc
    2. 通过搜索等方式找到目标NAT
    3. 点击【更多】后选择【网关升级】即可进入性能界面


![image \(20\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2820%29_86e07f2.png)