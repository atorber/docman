  GPUManager组件，包含异常pod 统计、cpu利用率和memory使用量。
  
## 前提条件
* 已接入监控实例
* 需启用采集任务,具体参考文档：[接入监控实例并启用采集任务](https://cloud.baidu.com/doc/AIHC/s/9lqaohy01)

## 使用方法

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/)。

2.  在左侧导航栏**资源池**中选择您想要查看监控大盘的**资源池名称**，并点击右侧操作中的**资源观测**。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1d68ae2.png)

3. 跳转至**资源观测**页面，选择**GPUManager组件**。

GPUManager组件如图所示：

![截屏2024-07-16 下午4.05.53.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E6%88%AA%E5%B1%8F2024-07-16%20%E4%B8%8B%E5%8D%884.05.53_71d14b5.png)

您可以点击右上角**按钮**，自行设定**监控时间**、**手动刷新**、**自动刷新**。

## GPUManager稳定性具体说明

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
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">异常pod数量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前集群GPUManager相关组件有异常的Pod数量。</span><br><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">指标异常：异常Pod数量大于0则为异常，需要查看异常原因。</span></td>
  </tr>
  
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">异常Pod率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前集群GPUManager相关各组件有异常的Pod的比率。</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">CPU利用率</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前集群GPUManager相关各组件的CPU利用率</span></td>
  </tr>
  <tr>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">Memory使用量</span></td>
    <td class="tg-1c0k"><span style="font-weight:400;color:rgba(34, 34, 34, 0.9)">当前集群GPUManager相关各组件的Memory使用量</span></td>
  </tr>
</tbody>
</table>
