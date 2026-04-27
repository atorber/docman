GPU节点资源，包含占用GPU的Pod数量、GPU卡分配情况、GPU卡使用情况、GPU&Memory总量、GPU&Memory利用率、GPU卡平均利用率、GPU卡利用率、卡平均显存利用率、卡显存利用率、GPU利用率、Memory利用率和运行中的占GPU的Pod列表。
 
 ## 前提条件
* AI Job Scheduler版本 >= 1.7.9
* 已接入监控实例
* 需启用采集任务,具体参考文档：[接入监控实例并启用采集任务](https://cloud.baidu.com/doc/AIHC/s/9lqaohy01)

## 使用方法

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/)。
2. 在左侧导航栏**自运维资源池**中选择您想要查看监控大盘的**资源池名称**，并点击**监控**按钮。

![WX20250422-194954@2x.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/WX20250422-194954@2x_5beaa36.png)

3. 跳转至**资源观测**页面，选择**节点资源**。

节点资源如图所示：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ff9e7c6.png)

您可以点击右上角**按钮**，自行设定**监控时间**、**手动刷新**、**自动刷新**。

## 节点资源具体说明

### 占用卡的Pod数量

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
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">占用GPU的Pod数量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内占用GPU资源的Pod数量</span></td>
  </tr>
</tbody>
</table>

<img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/image_a7222a0.png" style="width:100px;height:auto;">

### 卡分配情况

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
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">总卡数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内全部GPU卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">分配数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内已分配的GPU卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡分配率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">分配率=已分配GPU卡数/总GPU卡数</span></td>
  </tr>
</tbody>
</table>

<img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/image_df11c75.png" style="width:250px;height:auto;">


### 卡使用情况

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
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有GPU卡平均利用率实时值，卡平均利用率=sum(所有GPU卡利用率)/所有GPU卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡显存平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有GPU卡显存平均利用率实时值，显存平均利用率=sum(所有GPU卡显存利用率)/所有GPU卡数</span></td>
  </tr>
</tbody>
</table>

<img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/image_effe1d5.png" style="width:250px;height:auto;">

### CPU&Memory总量/利用率

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
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">CPU核数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内CPU总核数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">CPU平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有CPU平均利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">内存总量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内存总量</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">内存利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有内存平均利用率实时值</span></td>
  </tr>
</tbody>
</table>

<img src="https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c807845.png" style="width:400px;height:auto;">


### 利用率

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
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有GPU卡平均利用率实时值，卡平均利用率=sum(所有GPU卡利用率)/所有GPU卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有GPU卡利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡平均显存利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有GPU卡显存平均利用率实时值，显存平均利用率=sum(所有GPU卡显存利用率)/所有GPU卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">卡显存利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有GPU卡显存利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">CPU利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有CPU利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">Memory利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点内所有内存利用率实时值</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_88f6317.png)

### 运行中的占GPU的Pod列表

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
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod所在工作负载名称</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">类型</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod任务类型</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">命名空间</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod所在命名空间</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">Pod名称</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod名称</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">GPU配给卡数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod的配给GPU卡数</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">GPU平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod内GPU卡平均利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">GPU显存平均利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod内GPU卡显存平均利用率实时值</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">内存使用量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod的内存使用量</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">CPU核数</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前节点运行中的占GPU的Pod的CPU核数</span></td>
  </tr>
</tbody>
</table>

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_f1b5659.png)