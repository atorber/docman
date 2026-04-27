  
## 注意事项

* 在性能最优型和隔离最优型中H800均在GPU Manager版本为1.5.25开始支持，同时AI Job Scheduler版本需要升级到1.7.7。
* 使用性能最优型时，镜像不推荐设置LD_LIBRARY_PATH环境变量，如果需要设置，需要把/usr/lib64目录按照 LD_LIBRARY_PATH=/usr/lib64:$LD_LIBRARY_PATH 的形式添加进去

## 性能最优型适配支持

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-87hl{color:#1C1D1F;text-align:left;vertical-align:top}
.tg .tg-21qv{background-color:#F2F4F7;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-21qv">参数</th>
    <th class="tg-21qv" colspan="2">要求</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax">GPU卡类型</td>
    <td class="tg-87hl" colspan="2">支持的显卡类型包括：NVIDIA A10、A30、A100、A800、V100、T4、P4</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="6">CUDA &amp; cGPU Driver版本</td>
    <td class="tg-0lax">CUDA</td>
    <td class="tg-0lax">cGPU Driver</td>
  </tr>
  <tr>
    <td class="tg-0lax">10.2</td>
    <td class="tg-0lax">440</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.2</td>
    <td class="tg-0lax">460</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.4</td>
    <td class="tg-0lax">470.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.7</td>
    <td class="tg-0lax">515.76.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">12.1</td>
    <td class="tg-0lax">525.105.17</td>
  </tr>
</tbody>
</table>

## 隔离最优型适配支持

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-87hl{color:#1C1D1F;text-align:left;vertical-align:top}
.tg .tg-21qv{background-color:#F2F4F7;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-21qv">参数</th>
    <th class="tg-21qv" colspan="4">要求</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-87hl">GPU卡类型</td>
    <td class="tg-87hl" colspan="4">支持的显卡类型包括：NVIDIA A10、A30、A100、A800、V100、T4、P4</td>
  </tr>
  <tr>
    <td class="tg-87hl">操作系统</td>
    <td class="tg-87hl" colspan="4">支持的操作系统包括:Centos、Ubuntu、BaiduLinux</td>
  </tr>
  <tr>
    <td class="tg-87hl" rowspan="26">版本 &amp; GPU Manager版本&amp;内核版本</td>
    <td class="tg-21qv">操作系统版本</td>
    <td class="tg-21qv">GPU Manager版本</td>
    <td class="tg-21qv" colspan="2">内核版本</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="5">CentOS</td>
    <td class="tg-0lax">1.5.11</td>
    <td class="tg-0lax" colspan="2">3.10.0-957.21.3.el7.x86_64、3.10.0-1160.42.2.el7.x86_64<br>3.10.0-1160.62.1.el7.x86_64、3.10.0-1160.80.1.el7.x86_64<br>3.10.0-1160.81.1.el7.x86_64、4.17.11-1.el7.elrepo.x86_64<br>5.4.123-1.el7.elrepo.x86_64</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.12</td>
    <td class="tg-0lax" colspan="2">3.10.0-1160.42.2.el7.x86_64、3.10.0-1160.62.1.el7.x86_64<br>3.10.0-1160.80.1.el7.x86_64、3.10.0-1160.81.1.el7.x86_64<br>3.10.0-1160.83.1.el7.x86_64、3.10.0-957.21.3.el7.x86_64<br>5.4.123-1.el7.elrepo.x86_64、4.17.11-1.el7.elrepo.x86_64</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.14-1.5.24</td>
    <td class="tg-0lax" colspan="2">3.10.0-1160.71.1.el7.x86_64、3.10.0-1160.76.1.el7.x86_64<br>3.10.0-1160.80.1.el7.x86_64、3.10.0-1160.81.1.el7.x86_64<br>3.10.0-1160.41.1.el7.x86_64、3.10.0-1160.42.2.el7.x86_64<br>3.10.0-1160.45.1.el7.x86_64、3.10.0-1160.62.1.el7.x86_64<br>3.10.0-1160.83.1.el7.x86_64、3.10.0-1160.88.1.el7.x86_64<br>3.10.0-1160.90.1.el7.x86_64、3.10.0-957.21.3.el7.x86_64<br>5.4.123-1.el7.elrepo.x86_64</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.25</td>
    <td class="tg-0lax" colspan="2">3.10.0-1160.80.1.el7.x86_64、3.10.0-1160.81.1.el7.x86_64<br>3.10.0-1160.83.1.el7.x86_64、3.10.0-1160.88.1.el7.x86_64<br>3.10.0-1160.41.1.el7.x86_64、3.10.0-1160.42.2.el7.x86_64<br>3.10.0-1160.45.1.el7.x86_64、3.10.0-1160.62.1.el7.x86_64<br>3.10.0-1160.71.1.el7.x86_64、3.10.0-1160.76.1.el7.x86_64<br>4.18.0-348.7.1.el8_5.x86_64、4.18.0-348.el8.x86_64<br>3.10.0-1160.90.1.el7.x86_64、3.10.0-957.21.3.el7.x86_64<br>4.17.11-1.el7.elrepo.x86_64、4.18.0-348.2.1.el8_5.x86_64<br>4.18.0-348.2.1.el8_5.x86_64</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.27</td>
    <td class="tg-0lax" colspan="2">3.10.0-1160.11.1.el7.x86_64、3.10.0-1160.15.2.el7.x86_64<br>3.10.0-1160.2.1.el7.x86_64、3.10.0-1160.2.2.el7.x86_64<br>3.10.0-1160.21.1.el7.x86_64、3.10.0-1160.24.1.el7.x86_64<br>3.10.0-1160.25.1.el7.x86_64、3.10.0-1160.31.1.el7.x86_64<br>3.10.0-1160.36.2.el7.x86_64、3.10.0-1160.41.1.el7.x86_64<br>3.10.0-1160.42.2.el7.x86_64、3.10.0-1160.45.1.el7.x86_64<br>3.10.0-1160.49.1.el7.x86_64、3.10.0-1160.53.1.el7.x86_64<br>3.10.0-1160.59.1.el7.x86_64、3.10.0-1160.6.1.el7.x86_64<br>3.10.0-1160.62.1.el7.x86_64、3.10.0-1160.66.1.el7.x86_64<br>3.10.0-1160.71.1.el7.x86_64、3.10.0-1160.76.1.el7.x86_64<br>3.10.0-1160.80.1.el7.x86_64、3.10.0-1160.81.1.el7.x86_64<br>3.10.0-1160.83.1.el7.x86_64、3.10.0-1160.88.1.el7.x86_64<br>3.10.0-1160.90.1.el7.x86_64、3.10.0-1160.el7.x86_64<br>3.10.0-957.21.3.el7.x86_64、4.17.11-1.el7.elrepo.x86_64<br>4.18.0-348.2.1.el8_5.x86_64、4.18.0-348.7.1.el8_5.x86_64<br>4.18.0-348.el8.x86_64、5.4.123-1.el7.elrepo.x86_64</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="15">Ubuntu</td>
    <td class="tg-0lax">1.5.11</td>
    <td class="tg-0lax">4.4.0</td>
    <td class="tg-0lax">150</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="3">1.5.12</td>
    <td class="tg-0lax">4.4.0</td>
    <td class="tg-0lax">150</td>
  </tr>
  <tr>
    <td class="tg-0lax">4.15.0</td>
    <td class="tg-0lax">140、204</td>
  </tr>
  <tr>
    <td class="tg-0lax">5.4.0</td>
    <td class="tg-0lax">139</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="3">1.5.14-1.5.24</td>
    <td class="tg-0lax">4.4.0</td>
    <td class="tg-0lax">150</td>
  </tr>
  <tr>
    <td class="tg-0lax">4.15.0</td>
    <td class="tg-0lax">140、204</td>
  </tr>
  <tr>
    <td class="tg-0lax">5.4.0</td>
    <td class="tg-0lax">139、150</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="4">1.5.25</td>
    <td class="tg-0lax">4.4.0</td>
    <td class="tg-0lax">150</td>
  </tr>
  <tr>
    <td class="tg-0lax">4.15.0</td>
    <td class="tg-0lax">140、204</td>
  </tr>
  <tr>
    <td class="tg-0lax">5.4.0</td>
    <td class="tg-0lax">139、150</td>
  </tr>
  <tr>
    <td class="tg-0lax">5.15.0</td>
    <td class="tg-0lax">72</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="4">1.5.27</td>
    <td class="tg-0lax">4.4.0</td>
    <td class="tg-0lax">150</td>
  </tr>
  <tr>
    <td class="tg-0lax">4.15.0</td>
    <td class="tg-0lax">22~24、29、30、32~34、36、38、39、42~48、50~52、54、55、58、60、62、64~66、69、70、72、74、76、88、91、96、99、101、106、108、109、111、112、115、117、118、121~124、128~130、134~137、139~144、147、151、153、154、156、158、159、161、162、163、166、167、169、171、173、175~177、180、184、187~189、191~194、196、197、211、212</td>
  </tr>
  <tr>
    <td class="tg-0lax">5.4.0</td>
    <td class="tg-0lax">26、28、29、31、33、37、39、40、42、45、47、48、51~54、58、59、100、104、105、107、109、113、117、120~122、124~126、128、131、132、135~137、139、150、152、153、155、156、159、162~164</td>
  </tr>
  <tr>
    <td class="tg-0lax">5.15.0</td>
    <td class="tg-0lax">72、73、75、78、79、82~84、86、87</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="5">BaiduLinux3.0</td>
    <td class="tg-0lax">1.5.11</td>
    <td class="tg-0lax" colspan="2">5.10.0-3.0.1.3</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.12</td>
    <td class="tg-0lax" colspan="2">5.10.0-3.0.1.3</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.14-1.5.24</td>
    <td class="tg-0lax" colspan="2">5.10.0-3.0.1.3</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.25</td>
    <td class="tg-0lax" colspan="2">5.10.0-3.0.1.3</td>
  </tr>
  <tr>
    <td class="tg-0lax">1.5.27</td>
    <td class="tg-0lax" colspan="2">5.10.0-3.0.1.3</td>
  </tr>
  <tr>
    <td class="tg-0lax" rowspan="10">CUDA &amp; cGPU Driver版本</td>
    <td class="tg-21qv">CUDA</td>
    <td class="tg-21qv" colspan="3">cGPU Driver</td>
  </tr>
  <tr>
    <td class="tg-0lax">10.1</td>
    <td class="tg-0lax" colspan="3">418.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">10.2</td>
    <td class="tg-0lax" colspan="3">440.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.0</td>
    <td class="tg-0lax" colspan="3">450.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.2</td>
    <td class="tg-0lax" colspan="3">460.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.4</td>
    <td class="tg-0lax" colspan="3">470.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.7</td>
    <td class="tg-0lax" colspan="3">515.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">11.8</td>
    <td class="tg-0lax" colspan="3">520.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">12.1<br>12.0</td>
    <td class="tg-0lax" colspan="3">525.x</td>
  </tr>
  <tr>
    <td class="tg-0lax">12.2</td>
    <td class="tg-0lax" colspan="3">535.x</td>
  </tr>
</tbody>
</table>