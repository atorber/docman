为加速 BEV感知模型从研发到验证的闭环，Apollo 自动驾驶平台提供了一套**开箱即用**的工具链，涵盖**模型训练**（[Apollo-BEV-Train](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=3928100)） → **模型导出**（[Apollo-BEV-Model-Export](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=5599233)） → **模型验证**（[Apollo-Model-Deployment](https://console.bce.baidu.com/aihc/quickStart/detail?templateId=9770074)）三大核心阶段。用户可按此顺序依次使用三个标准化环境，高效完成 BEV 模型的开发与评估。

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
![d77c535f2d7c3a5ddcfef85a593ea4ee.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/d77c535f2d7c3a5ddcfef85a593ea4ee_d77c535.png)
* 代码保存路径：/root/Apollo-Vision-Net-Deployment
* 数据默认挂载路径：/mnt/pfs/nuscenes_data/bev_data/nuscenes


## 数据集挂载
开发机内数据集挂载(建议与Apollo-BEV-Train开发机pfs磁盘共用，不共用需要重新处理数据集)：
```bash
cd ~/Apollo-Vision-Net-Deployment/data

# 创建符号链接（注意使用正确的 -s 参数）
ln -s /mnt/pfs/nuscenes_data/bev_data/nuscenes nuscenes
ln -s /mnt/pfs/nuscenes_data/bev_data/occ_gt_release_v1_0 occ_gt_release_v1_0
ln -s /mnt/pfs/nuscenes_data/bev_data/can_bus can_bus
```
<br>

## 模型导出
### 生成onnx文件
运行下面的命令，提供pth文件，生成onnx文件
```bash
cd ~/Apollo-Vision-Net-Deployment/ 
python tools/pth2onnx.py configs/apollo_bev/bev_tiny_det_occ_apollo_trt.py bos路径/epoch_*.pth --opset_version 13 --cuda
#使用4090卡导出onnx模型需要去掉--cuda参数
```

# 附：Apollo 11.0 BEV+OCC 模型训练使用
| 流程 | 使用方式 | 备注 |
| :--- | :--- | :--- |
| Apollo-BEV-Train | 百舸平台 | 训练 Apollo BEV+OCC模型 |
| Apollo-BEV-Model-Export | 百舸平台 | 将训练好的BEV+OCC模型导出成onnx文件 |
| Apollo-Model-Deployment | 百舸平台或本地验证 | apollo环境镜像，验证bev模型效果以及仿真等apollo工具 |