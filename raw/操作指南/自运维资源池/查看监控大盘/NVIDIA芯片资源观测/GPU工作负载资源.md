 工作负载资源，包含任务属性、GPU卡数、GPU资源使用情况、GPU节点使用概要。
  
  ## 前提条件
* AI Job Scheduler版本 >= 1.7.9
* 已接入监控实例
* 需启用采集任务,具体参考文档：[接入监控实例并启用采集任务](https://cloud.baidu.com/doc/AIHC/s/9lqaohy01)
 

## 使用方法

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/)。
2. 在左侧导航栏**自运维资源池**中选择您想要查看监控大盘的**资源池名称**，并点击**监控**按钮。

![WX20250422-194954@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250422-194954@2x_5beaa36.png)

3. 跳转至**资源观测**页面，选择**工作负载资源**。


工作负载资源如图所示：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e3f7b88.png)

您可以点击右上角**按钮**，自行设定**监控时间**、**手动刷新**、**自动刷新**。

## 工作负载资源具体说明

### 任务属性

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-1c0k{background-color:#FFF;color:rgba(34, 34, 34, 0.9);text-align:left;vertical-align:top}
.tg .tg-8q05{background-color:rgba(34, 34, 34, 0.08);color:rgba(0, 0, 0, 0.85);font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-8q05"><span style="font-weight:700;color:#000;background-color:rgba(34, 34, 34, 0.08)">监控项</span></th>
    <th class="tg-8q05"><span style="font-weight:700;color:#000;background-color:rgba(34, 34, 34, 0.08)">说明</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">负载名称</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载的名称</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">类型</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载的类型</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">命名空间</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载所在命名空间</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">开始时间</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载的开始时间</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">运行时长</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载的运行时长</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_5f43414.png)

### 卡数&GPU资源使用情况

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-1c0k{background-color:#FFF;color:rgba(34, 34, 34, 0.9);text-align:left;vertical-align:top}
.tg .tg-8q05{background-color:rgba(34, 34, 34, 0.08);color:rgba(0, 0, 0, 0.85);font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-8q05"><span style="font-weight:700;color:#000;background-color:rgba(34, 34, 34, 0.08)">监控项</span></th>
    <th class="tg-8q05"><span style="font-weight:700;color:#000;background-color:rgba(34, 34, 34, 0.08)">说明</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载的GPU卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">GPU利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载所有GPU的平均利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">显存利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载所有显存的平均利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">显存使用量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载所有显存的使用量实时值</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_31f6d76.png)

### GPU节点使用概要

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-1c0k{background-color:#FFF;color:rgba(34, 34, 34, 0.9);text-align:left;vertical-align:top}
.tg .tg-8q05{background-color:rgba(34, 34, 34, 0.08);color:rgba(0, 0, 0, 0.85);font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-8q05"><span style="font-weight:700;color:#000;background-color:rgba(34, 34, 34, 0.08)">监控项</span></th>
    <th class="tg-8q05"><span style="font-weight:700;color:#000;background-color:rgba(34, 34, 34, 0.08)">说明</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">命名空间</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载中GPU节点所在命名空间</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">节点IP</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载中GPU节点IP</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">Pod名称</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载中GPU节点中运行Pod名称</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">GPU配给卡数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载中GPU节点的GPU配给卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">GPU平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载中GPU节点的GPU平均利用率</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">显存使用量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载中GPU节点的显存使用量</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">显存平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前工作负载中GPU节点的显存平均利用率</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_9085e2c.png)


