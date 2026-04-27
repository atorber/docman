为加速 BEV感知模型从研发到验证的闭环，Apollo 自动驾驶平台提供了一套**开箱即用**的工具链，涵盖**模型训练**（[Apollo-BEV-Train](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=3928100)） → **模型导出**（[Apollo-BEV-Model-Export](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=5599233)） → **模型验证**（[Apollo-Model-Deployment](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=9770074)）三大核心阶段。用户可按此顺序依次使用三个标准化环境，高效完成 BEV 模型的开发与评估。

# Apollo 自动驾驶开放平台介绍
Apollo (阿波罗)是一个开放的、完整的、安全的平台，将帮助汽车行业及自动驾驶领域的合作伙伴结合车辆和硬件系统，快速搭建一套 属于自己的自动驾驶系统。
<br>
开放能力、共享资源、加速创新、持续共赢是 Apollo 开放平台的口号。百度把自己所拥有的强大、成熟、安全的自动驾驶技术和数据开 放给业界，旨在建立一个以合作为中心的生态体系，发挥百度在人工智能领域的技术优势，为合作伙伴赋能，共同促进自动驾驶产业的发 展和创新。
<br>
Apollo 自动驾驶开放平台为开发者提供了丰富的车辆、硬件选择，强大的环境感知、高精定位、路径规划、车辆控制等自动驾驶软件能 力以及高精地图、仿真、数据流水线等自动驾驶云服务，帮助开发者从 0 到 1 快速搭建一套自动驾驶系统。

# 部署环境要求&最佳实践建议

| | 部署要求 | 最佳实践 |
| :--- | :--- | :--- |
| **CPU** | 按需 | 建议按表单默认值及以上 |
| **内存** | 按需 | 建议按表单默认值及以上 |
| **GPU** | 24G以上显存 | 建议24G以上显存 |
| **CDS** | 按需 | 按需 |
# 使用说明
## 创建与登录开发机
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，并打开VScode中的terminal
![d77c535f2d7c3a5ddcfef85a593ea4ee \(1\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/d77c535f2d7c3a5ddcfef85a593ea4ee%20%281%29_d77c535.png)
* 代码保存路径：/apollo_workspace
* 数据默认挂载路径：/mnt/pfs/nuscenes_data/bev_data/nuscenes

## Apollo环境中替换自己训练的ONNX文件
如果要替换为自己训练的onnx文件，则需要替换掉目录下的onnx文件
```bash
sudo rm -rf /apollo/modules/perception/data/models/apollo_bevnet_onnx/apollo_bevnet.onnx
sudo cp your-own-onnx.onnx /apollo/modules/perception/data/models/apollo_bevnet_onnx/apollo_bevnet.onnx
```
<br>

## Apollo中运行纯视觉模型
准备record数据
通过下面链接可以下载nuscenes record：

| id | link |
| :--- | :--- |
| 6f83169d067343658251f72e1dd17dbc | http://apollo-perception.bj.bcebos.com/nuscenes_occ_records/6f83169d067343658251f72e1dd17dbc.record?authorization=bce-auth-v1%2FALTAKr8RyUUttStVHwGaOsvJyP%2F2024-12-02T08%3A12%3A56Z%2F-1%2Fhost%2F15500778f03ba45f19e6a7818b3af88952a739cbd53761f166d8bd542347821b |
| 2fc3753772e241f2ab2cd16a784cc680 | http://apollo-perception.bj.bcebos.com/nuscenes_occ_records/2fc3753772e241f2ab2cd16a784cc680.record?authorization=bce-auth-v1%2FALTAKr8RyUUttStVHwGaOsvJyP%2F2024-12-02T08%3A11%3A30Z%2F-1%2Fhost%2Fb7b99869a804ed08c7f6804d8b724e15aebc3e1c13fde45b18b61e459b1b7ae5 |
| bebf5f5b2a674631ab5c88fd1aa9e87a | http://apollo-perception.bj.bcebos.com/nuscenes_occ_records/bebf5f5b2a674631ab5c88fd1aa9e87a.record?authorization=bce-auth-v1%2FALTAKr8RyUUttStVHwGaOsvJyP%2F2024-12-02T08%3A13%3A18Z%2F-1%2Fhost%2F1c25a91e913f512b8f188dc6e54bd07ffcbb301e1be2d92a3cc7b686e1456d80 |

选择车型环境使用,应用参数
```bash
aem profile use nuscenes_occ
```
打开dreamview_plus
```bash
aem bootstrap start --plus
```
网页显示dreamview_plus方式：
```bash
访问方式（选择其一）：

  方式1 - 百舸平台打开：
    1. 执行脚本后,点击ports,选择8888端口的Fowarded Address的链接使用鼠标右键选择“Open in Browser”

  方式2 - SSH端口转发
    1. 在本地电脑执行: ssh -L 8888:localhost:8888 -p ssh映射端口 user@server_ip
    2. 浏览器打开: http://localhost:8888
```
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_2a69f52.png)

终端启动transform dag文件
```bash
mainboard -d /apollo/modules/transform/dag/static_transform.dag
```
终端启动感知 dag文件
```bash
mainboard -d /apollo/modules/perception/camera_detection_occupancy/dag/camera_detection_occupancy_nus.dag
```
等待模型进行序列化，当终端给出如下日志时表示序列化完成，可进行下面的步骤
![image \(1\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%281%29_2c5c78d.png)
打开终端播放record包
```bash
cyber_recorder play -f 包名.record
```

随后就可以在dreamview_plus页面上看到目标检测结果
<br>![f4fb5fdea71a78fa6369ee4a4dc0aebc.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/f4fb5fdea71a78fa6369ee4a4dc0aebc_f4fb5fd.png)

<br>

### 可视化occ结果
如果要查看occ结果，需要进行如下的步骤：
<br>将配置occ_det_nus.pb.txt中save_occ_result设置为true，同时设置保存路径occ_save_path（默认路径为/apollo/data/occ_results）

#### Web端OCC可视化（支持远程访问）工具使用：
```bash
cd /apollo_workspace/bev_tools
python3 occ_vis.py
```
**备注:**
查看其他occ文件效果
修改occ_vis.py代码
```bash
 #代码行数，470行
       # 检查数据文件路径
    possible_paths = [
        "/apollo/data/occ_results/1535489308.678113.bin"
    ]
```
![image \(2\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%282%29_ce1d2af.png)
打开网页方式：
```bash
访问方式（选择其一）：

  方式1 - 百舸平台打开：
    1. 执行脚本后,点击ports,选择9000端口的Fowarded Address的链接使用鼠标右键选择“Open in Browser”

  方式2 - SSH端口转发
    1. 在本地电脑执行: ssh -L 9000:localhost:9000 -p ssh映射端口 user@server_ip
    2. 浏览器打开: http://localhost:9000
```


**Web端OCC可视化功能**，支持远程实时访问与多维度场景分析。用户可通过浏览器访问服务端口（如localhost:9000），实现跨平台、跨网络的OCC渲染，无需依赖本地显示环境。该功能完整渲染**16类场景元素**（含车辆、行人、植被等），并为每类元素提供专属视觉标识。支持交互式视角操作（360°旋转/平移/缩放）、视角重置及截图保存（PNG格式），显著提升调试效率，实现“启动服务→实时验证模型效果”的闭环流程。
![image \(3\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%283%29_9d0447b.png)

<br>
完整颜色映射表

| 序号 | 类别名称 | 颜色 | 用途说明 |
| :---: | :--- | :--- | :--- |
| 1 | **Car** (轿车) | <span style="color: Orange">█████</span> Orange | 普通乘用车、小轿车 |
| 2 | **Truck** (卡车) | <span style="color: Tomato">█████</span> Tomato | 货车、厢式货车 |
| 3 | **Trailer** (拖车) | <span style="color: DarkOrange">█████</span> Dark Orange | 半挂车、拖挂车 |
| 4 | **Bus** (公交车) | <span style="color: OrangeRed">█████</span> Orange Red | 公交车、大巴 |
| 5 | **Construction Vehicle** (工程车) | <span style="color: DarkSalmon">█████</span> Dark Salmon | 挖掘机、推土机等工程车辆 |
| 6 | **Bicycle** (自行车) | <span style="color: Crimson">█████</span> Crimson | 自行车 |
| 7 | **Motorcycle** (摩托车) | <span style="color: Red">█████</span> Red | 摩托车、电动车 |
| 8 | **Pedestrian** (行人) | <span style="color: Blue">█████</span> Blue | 行人 |
| 9 | **Traffic Cone** (交通锥) | <span style="color: DarkSlateGray">█████</span> Dark Slate Grey | 交通锥、警示锥 |
| 10 | **Barrier** (障碍物) | <span style="color: SlateGray">█████</span> Slate Grey | 护栏、路障 |
| 11 | **Driveable Surface** (可行驶表面) | <span style="color: #00FA9A">█████</span> nuTonomy Green | 道路、可行驶区域 |
| 12 | **Other Flat** (其他平面) | <span style="color: DarkMagenta">█████</span> Dark Magenta | 其他平坦区域 |
| 13 | **Sidewalk** (人行道) | <span style="color: #4B0082">█████</span> Dark Purple | 人行道、步道 |
| 14 | **Terrain** (地形) | <span style="color: YellowGreen">█████</span> Yellow Green | 草地、土地等自然地形 |
| 15 | **Manmade** (人造物) | <span style="color: BurlyWood">█████</span> Burlywood | 建筑物、墙体等人造结构 |
| 16 | **Vegetation** (植被) | <span style="color: Green">█████</span> Green | 树木、灌木等植被 |
| - | **Ego Car** (自车) | <span style="color: Black">█████</span> Rainbow | 自动驾驶车辆本身 |


# 附：Apollo 11.0 BEV+OCC 模型训练使用
| 流程 |  使用方式 | 备注 |
| :--- |  :--- | :--- |
| Apollo-BEV-Train |  百舸平台 | 训练 Apollo BEV+OCC模型 |
| Apollo-BEV-Model-Export | 百舸平台 | 将训练好的BEV+OCC模型导出成onnx文件 |
| Apollo-Model-Deployment | 百舸平台或本地验证 | apollo环境镜像，验证bev模型效果以及仿真等apollo工具 |