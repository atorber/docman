本文档用于介绍在百舸的环境下使用 RDMA 网络进行分布式训练。

## 概述

**RDMA**（Remote Direct Memory Access）是新一代的网络通信技术，它允许计算机之间直接进行内存对内存的数据传输，而不需要经过操作系统或中央处理器的处理。在大规模的分布式训练中，通过使用RDMA有效解决网络传输中服务器端数据处理的延迟问题，从而实现高吞吐、低延迟的网络通信，提升训练效率。

**NCCL**是NVIDIA的集合通信库，能实现Collective通信和点对点通信，NCCL内部已经实现了RDMA通信，同时NCCL可以根据环境中网卡类型和拓扑关系，自行选择一个最优的通信路径，目前主流的分布式训练框架都已支持NCCL。


## 使用前提

- 已经创建百舸，且集群中至少有2台具有RDMA网络的GPU实例。
- GPU实例镜像中包含ofed和nvidia驱动，这里推荐使用百度智能云提供的GPU镜像，已包含OFED驱动，无需手动安装。
- 业务镜像中需要使用 nccl 依赖库，这里推荐使用 [NVIDIA GPU Cloud](https://ngc.nvidia.com/)（NGC）提供的基础镜像。NGC 提供的基础镜像通常会包含 nccl 依赖库，并且已经预先配置和优化了许多常用的深度学习框架和工具。使用 NGC 基础镜像可以简化您的设置和配置过程，并确保您能够顺利使用 nccl 进行 GPU 加速计算和深度学习任务。



## 提交任务开启RDMA

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)
2. 进入**分布式训练**列表页面，点击**创建任务**， 进入创建任务的流程
3. 在 **创建任务 > 资源配置**模块，选择 **开启RDMA** 即可，开启后系统将训练实例自动调度任务到支持RDMA网络的节点上，启用RDMA加速



## **平台预置NCCL环境变量**

开启RDMA后，百舸平台基于百度智能云内部大规模分布式训练经验，在任务运行时会自动注入推荐的NCCL环境变量，无需手动填写。您也可以根据您的业务场景自定义调整。

> 强烈建议您使用平台预置系统内的NCCL默认变量， 可以获得较优性能和较高的稳定性



### A800/A100 NCCL预置环境变量

| **环境变量**                     | **网络类型**                |
| -------------------------------- | --------------------------- |
| NCCL_IB_HCA=动态值               | Roce/IB                     |
| NCCL_SOCKET_IFNAME=动态值        | Roce/IB                     |
| NCCL_IB_GID_INDEX=动态值         | Roce/IB                     |
| NCCL_TOPO_FILE=动态值            | Roce/IB (仅BCC形态自动注入) |
| NCCL_IB_TIMEOUT=22               | Roce/IB                     |
| NCCL_IB_QPS_PER_CONNECTION=8     | Roce/IB                     |
| NCCL_DEBUG=INFO                  | Roce/IB                     |
| NCCL_IB_ADAPTIVE_ROUTING=1       | IB                          |
| NCCL_DEBUG_SUBSYS=INIT,ENV,GRAPH | Roce/IB                     |

﻿

### H800 NCCL 预置环境变量

| 环境变量                         | **网络类型**                |
| -------------------------------- | --------------------------- |
| NCCL_IB_HCA=动态值               | Roce/IB                     |
| NCCL_SOCKET_IFNAME=动态值        | Roce/IB                     |
| NCCL_IB_GID_INDEX=动态值         | Roce/IB                     |
| NCCL_TOPO_FILE=动态值            | Roce/IB (仅BCC形态自动注入) |
| NCCL_IB_TIMEOUT=22               | Roce/IB                     |
| NCCL_IB_QPS_PER_CONNECTION=1     | Roce/IB                     |
| NCCL_DEBUG=INFO                  | Roce/IB                     |
| NCCL_IB_ADAPTIVE_ROUTING=1       | Roce/IB                     |
| NCCL_DEBUG_SUBSYS=INIT,ENV,GRAPH | Roce/IB                     |

### ﻿NCCL环境变量说明

NCCL关键环境变量的说明如下表所示，更多关于NCCL其他环境变量的说明，请参见[NCCL](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html#)。

| **环境变量**               | **解释**                                                     |
| -------------------------- | ------------------------------------------------------------ |
| NCCL_IB_HCA                | 环境中的RDMA网卡                                             |
| NCCL_SOCKET_IFNAME         | 指定用于通信的IP接口                                         |
| NCCL_IB_GID_INDEX          | 设置RDMA通信优先级                                           |
| NCCL_IB_DISABLE            | 是否关闭RDMA通信。<br/>0代表NCCL使用的IB/RoCE传输；1代表禁止NCCL使用的IB/RoCE传输。此时NCCL将退回到使用IP套接字 |
| NCCL_DEBUG                 | NCCL日志级别，此变量通常用于调试。                           |
| NCCL_IB_TIMEOUT            | 网络断点重连超时时间，计算公式：4.096 µs * 2 ^ timeout       |
| NCCL_IB_RETRY_CNT          | 网络断点重连重试次数                                         |
| NCCL_DEBUG_FILE            | 日志输出文件                                                 |
| NCCL_IB_QPS_PER_CONNECTION | 每个IB queue pair的并发连接数                                |
| NCCL_IB_ADAPTIVE_ROUTING   | NVIDIA NCCL是否使用 InfiniBand 的自适应路由功能的环境变量，默认是0或fasle，配置为1或true表示开启自适应路由。 |
| NCCL_TOPO_FILE             | 网络拓扑文件，NCCL 通信库会依据网络拓扑文件构建拓扑关系      |

﻿