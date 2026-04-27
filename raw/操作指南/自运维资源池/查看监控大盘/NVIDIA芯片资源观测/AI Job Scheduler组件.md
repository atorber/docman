AI Job Scheduler组件，包含关键指标总览、队列排队总览、集群/队列超限总览、Pod调度性能总览、任务调度性能总览和调度器调度阶段延迟总览。

## 前提条件
* AI Job Scheduler版本 >= 1.7.9
* 已接入监控实例
* 需启用采集任务,具体参考文档：[接入监控实例并启用采集任务](https://cloud.baidu.com/doc/AIHC/s/9lqaohy01)
 

## 使用方法

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/)。
2. 在左侧导航栏**资源池**中选择您想要查看监控大盘的**资源池名称**，并点击右侧操作中的**资源观测**。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1d68ae2.png)

3. 跳转至**资源观测**页面，选择**AI Job Scheduler组件**。

AI Job Scheduler组件如图所示：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_14f196d.png)

您可以点击右上角**按钮**，自行设定**监控时间**、**手动刷新**、**自动刷新**。

## AI Job Scheduler组件具体说明

### 组件健康度总览

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-1c0k{background-color:#FFF;color:rgba(34, 34, 34, 0.9);text-align:left;vertical-align:top}
.tg .tg-poro{background-color:rgba(34, 34, 34, 0.08);color:#1C1D1F;font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">监控项</span></th>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">说明</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器实例数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">AI Job Scheduler Pod实例数，默认为3副本。</span><br><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">指标异常：调度器实例数为1-3为正常，为0为异常。</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">CPU利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">AI Job Scheduler master实例的CPU利用率</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">内存占用量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">AI Job Scheduler master实例的内存占用量</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">Pod 调度吞吐 CPM (次数/分钟)</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器每分钟调度的Pod个数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">任务调度吞吐 CPM (次数/分钟)</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器每分钟调度的任务个数</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_b9cc891.png)

### 待调度Pod/任务排队总览

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-1c0k{background-color:#FFF;color:rgba(34, 34, 34, 0.9);text-align:left;vertical-align:top}
.tg .tg-poro{background-color:rgba(34, 34, 34, 0.08);color:#1C1D1F;font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">监控项</span></th>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">说明</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">集群调度排队情况</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">集群中调度任务排队情况，展示了集群待调度任务数、集群排队任务数、集群调度总任务数、集群Pending Pod数、集群任务排队率。</span><br><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)"></span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">集群卡分配情况</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">集群中GPU卡分配情况，展示了GPU总卡数、已分配GPU卡数、空闲GPU卡数、不可用GPU卡数、GPU卡分配率。</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">集群待调度Pod/任务趋势图</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">详细的集群中待调度Pod/任务趋势，展示了待调度Pod数、待调度任务数、排队任务数、总任务数等数据的排队任务率。</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡分配率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">详细的集群中GPU卡分配率。</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">任务重试调度次数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器持续调度任务的次数，还包含任务类型、任务名称、命名空间、排队状态。</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_a2bf1dd.png)

### Pod/任务调度性能总览

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-1c0k{background-color:#FFF;color:rgba(34, 34, 34, 0.9);text-align:left;vertical-align:top}
.tg .tg-poro{background-color:rgba(34, 34, 34, 0.08);color:#1C1D1F;font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">监控项</span></th>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">说明</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">任务调度延迟</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">从任务创建时间开始，至任务调度完成的时间</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">Pod 总调度延迟</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">从pod创建时间开始，至pod调度完成的时间</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_8081fa7.png)

### 调度延迟action总览

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-1c0k{background-color:#FFF;color:rgba(34, 34, 34, 0.9);text-align:left;vertical-align:top}
.tg .tg-poro{background-color:rgba(34, 34, 34, 0.08);color:#1C1D1F;font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">监控项</span></th>
    <th class="tg-poro"><span style="font-weight:700;color:#1C1D1F;background-color:rgba(34, 34, 34, 0.08)">说明</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器各阶段延迟分布</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器各阶段延迟分布范围</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">Pod 调度延迟</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">从pod调度算法+绑定阶段时间之和</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器各阶段延迟</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">调度器各个调度阶段的调度时间</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_60a686f.png)