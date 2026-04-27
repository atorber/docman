## 产品概述

通过虚拟化技术将一张物理 GPU 卡切分为多个相互隔离的实例，支持开发机、训练任务、推理服务以 0.x 卡 的粒度申请资源，从而实现算力与显存的精细化分配。

![63889571-d3db-4867-9fa2-f5fd96181c20.svg](https://bce.bdstatic.com/doc/bce-doc/AIHC/63889571-d3db-4867-9fa2-f5fd96181c20_905124d.svg)

### 核心价值
* 成本优化：支持单卡多任务并行，显著提升碎片化资源的利用率。
* 强隔离性：提供显存隔离与算力限制，确保任务间互不干扰。
* 场景覆盖：全面支持开发、训练、推理全流程业务。

## 虚拟化方案对比
百舸当前提供两种主流的虚拟化方案，您可以根据具体的芯片型号和隔离需求进行选择：

| 特性 | GPU 虚拟化 (sGPU) | MIG 虚拟化 |
| :--- | :--- | :--- |
| **技术实现** | 百度自研内核态虚拟化方案 | NVIDIA 硬件级多实例切分 |
| **主要功能** | 提供显存硬限制，算力时分复用 | 提供硬件级的显存与算力完全隔离 |
| **支持芯片** | A100、A800、V100、H800、A30、A10 等 | A800、A100、A30、H800<br>[Nvidia支持的GPU列表](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/supported-gpus.html)  |
| **切分粒度** | 百分比切分 | 固定比例切分（2/4/7 份） |
| **核心优势** | 兼容性广，部署灵活 | 隔离性最强，任务间零干扰 |

## 使用说明
### 队列管理
**混合部署：**同一个资源池内可以同时存在普通队列、sGPU 队列和 MIG 队列。

**操作限制：**

**1. MIG 虚拟化：**

* 开启 MIG 的队列不支持节点移入、移出或转让操作。
* 开启 MIG 的队列不支持碎片治理功能。
* 同一个队列中所有节点的所有卡，必须保持一致的切分比例。
* 指定物理队列开启虚拟化功能，仅支持添加开启了虚拟化的节点，加入虚拟化队列后节点不支持关闭虚拟化，仅将节点移出队列后支持关闭。
    * 只有当前队列中所有节点均开启虚拟化后，该物理队列才支持开启虚拟化。

**2. GPU 虚拟化：**
* 指定物理队列开启虚拟化功能，仅支持添加开启了虚拟化的节点，加入虚拟化队列后节点不支持关闭虚拟化，仅将节点移出队列后支持关闭。
    * 只有当前队列中所有节点均开启虚拟化后，该物理队列才支持开启虚拟化。


### 任务限制

在提交工作负载时，请注意以下差异：

**队列选择：**虚拟化任务仅支持提交到虚拟化物理队列及其子队列上

**资源配额：**

* sGPU 任务：支持输入显存和算力的百分比。
    
* MIG 任务：申请的“卡数”对应切分后的 GPU 实例数量（例如 1 份代表 1/4 卡）。
    
**监控数据：**开启虚拟化后，部分监控指标（如 GPU 利用率、显存利用率）在初期阶段可能存在展示不准确或暂不显示的情况，平台将持续迭代校准。

**禁用功能：**

* 使用 MIG 的任务暂不支持开启 RDMA。
    
* MIG 虚拟化仅支持标准推理服务，暂不支持多角色服务组、分布式推理及 PD 分离部署。



## 操作指南

### GPU虚拟化

**创建虚拟化队列**

1.登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)。

2.在左侧菜单栏选择全托管资源池，上方标签选择 “资源队列” 。

3.单击【创建资源队列】。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f82ad70.png)

4.在【资源信息栏】-【GPU虚拟化】，点击开启，完成队列创建，即可创建GPU虚拟化队列。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_7adb36a.png)

5.可以在队列列表中的 “GPU虚拟化” 列查看开启GPU虚拟化的队列。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1b91614.png)

也可以点击进具体队列查看。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_525e5cb.png)

**创建虚拟化训练任务**

1.登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)。

2.在左侧菜单栏选择在线服务部署，单击【+ 部署服务】。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_71f9685.png)

3.在 【资源队列】 配置中，请从列表中选择带有 “**GPU 虚拟化**” 标签的队列。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_5012dfa.png)

4.在 【资源规格】 配置中，填写0-1之间1位小数。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f813f5e.png)

5.完成相关配置后点击确定，即可完成创建虚拟化训练任务。

### MIG 虚拟化

**创建虚拟化队列**

请提工单创建 MIG 虚拟化队列。

**创建虚拟化训练任务**

1.登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)。

2.在左侧菜单栏选择在线服务部署，单击【+ 部署服务】。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_71f9685.png)

3.在【资源队列】配置中，请从列表中选择带有 “**MIG 虚拟化**” 标签的队列。如图所示，“加速芯片型号”列中若包含 MIG-1g.10gb 等格式，即表示为 MIG 实例。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_0b449ae.png)


4.在 【资源规格】 配置中，填写大于等于1的正整数，1卡代表一个MIG实例。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_2a13ee3.png)

5.完成相关配置后点击确定，即可完成创建虚拟化训练任务。


