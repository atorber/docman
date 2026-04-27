  
大模型训练场景中，通常会使用并行训练的策略，降低训练过程中的通信开销，加速训练效率。为方便高效的观测和排查大模型并行训练通信中的问题，百舸平台提供了高精度的RDMA网络监控能力，最高支持10ms精度，为故障诊断排除、训练性能调优等提供数据支撑。



## 监控指标说明

<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>合并单元格的表格</title> <style>     table, th, td {         border: 1px solid black;         border-collapse: collapse;     }     th, td {         padding: 10px;         text-align: left;     } </style> </head> <body>  <table>     <tr>         <td>监控面板</td>         <td>指标</td>         <td>说明</td>     </tr>     <tr>         <td rowspan="2">RDMA网卡监控（250ms精度）</td>         <td>RDMA网卡发送数据速率（250ms精度）</td>         <td>指定任务的RDMA网卡的发送数据速率（250ms精度）</td>     </tr>     <tr>         <td>RDMA网卡接收数据速率（250ms精度）</td>         <td>指定任务的RDMA网卡的接收数据速率（250ms精度）</td>     </tr>     <tr>         <td rowspan="2">RDMA网卡监控（10ms精度）</td>         <td>RDMA网卡发送数据速率（10ms精度）</td>         <td>指定任务的RDMA网卡的发送数据速率（10ms精度）</td>     </tr>     <tr>         <td>RDMA网卡接收数据速率（10ms精度）</td>         <td>指定任务的RDMA网卡的接收数据速率（10ms精度）</td>     </tr> </table>  </body> </html>



## 使用前提


1. 资源池内 [CCE Deep Learning Frameworks Operator](https://cloud.baidu.com/doc/CCE/s/Dkp814hyo) 组件版本>=1.6.17。查询组件版本或者升级组件版本，可以通过 **百舸资源池详情** > **计算资源集群（CCE) ** > **组件管理 **中操作。
2. 资源池已经接入百度云[Prometheus监控服务](https://cloud.baidu.com/product/cprom.html)。请参考[资源池接入Prometheus监控实例](https://cloud.baidu.com/doc/AIHC/s/9lqaohy01)。



## 使用限制


1. 仅支持满足如下条件的任务开启高精度监控：
   - 任务实例数>=2个
   - 任务开启RDMA加速
2. RDMA网卡监控（250ms精度）的监控指标保留最近30天，RDMA网卡监控（10ms精度）仅保留最近1天

## 操作步骤

### 1.创建训练任务&开启高精度监控

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/)。
2. 点击 左侧菜单栏 **分布式训练** ，进入训练任务创建页面
3. 点击 **创建任务**，进入创建任务页面
4. 在 **创建任务** > **高级设置** 模块中，开启**RDMA高精度监控**
5. 点击 **完成 ** 即完成任务创建。

### 2 .查看高精度监控

1. 进入训练任务列表页面，选择需要查询的训练任务，单击 **监控 > 高精度监控**，即可查询该任务的高精度RDMA监控指标。