NVIDIA Isaac Sim是基于NVIDIA Omniverse构建的机器人仿真平台。通过GPU加速物理引擎来实现精确仿真，并支持大规模、多传感器RTX渲染。集成数据生成、强化学习、ROS集成和数字孪生模拟等端到端工作流程。本文是对如何在开发机上开启和使用isaac sim进行摇操数据与 GR00T 微调的说明。

## 开发机配置 & 最佳实践建议
|组件类别|部署建议|
|-|-|
|CPU|32 核及以上|
|内存|64G 及以上|
|GPU|L20/H20|
|存储|按需|



## 使用说明
本文会先介绍如何【创建开发机】，然后详细介绍Isaac-GR00T项目的完整使用指南。

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置

### 创建与登录开发机
#### 1.1 步骤一：从快速开始创建一个预置 Isaac 的开发机实例：
在百度百舸.快速开始，找到该快速开始点击右侧【在开发机中打开】在右侧弹出菜单中填写开发机配置信息：

* 基本信息
    * 实例名称：输入您为开发机命名的名称，例如：dev-saac
    * 资源池类型/资源池/队列：根据您的资源池类型选择已创建的资源池和队列
    * 资源规格：建议选择 L20等带有RTcore的显卡计算资源并配置 32 核 64G 内存
    * 云磁盘：推荐预留100GiB保证开发机正常运行
    * 存储挂载：用于挂载云存储资源（PFS/BOS/CFS等），此处选择存储类型为PFS的资源，默认带出存储配置区，填写源路径与挂载路径，例如：源路径：/，挂载路径：/mnt/cluster/

* 访问配置&高级配置
    * 可以使用默认配置，此处不做修改


完成后点击确定，即可完成开发机创建。

#### 1.2 步骤二：登录开发机
填写完表单，提交后，在开发机列表可见创建的开发机，等待资源调度并部署成功后，点击登录，即可进入开发机NoteBook操作终端。

### 配置访问Isaac Sim环境
#### 2.1 设置RDP远程桌面登陆的账号密码
使用`chpasswd`工具设置RDP远程桌面登陆的账号密码

```
Plain Text复制
echo "root:xrdp-aihc" | chpasswd
```
其中，

* `root`：为设置用户名。
* `xrdp-aihc`：为登陆密码，请替换为你的密码。
* `chpasswd`：Linux 系统中一个用于**批量设置或者更新用户密码**的实用命令行工具，支持从标准输入或指定的文件中读取用户名和密码的组合，然后自动完成密码修改

#### 2.2 启动RDP服务
启动 RDP 服务

```
Plain Text复制
/usr/bin/supervisord -c /etc/supervisor/conf.d/xrdp.conf
```
#### 2.3 通过桌面客户端访问
在本地电脑或者需要连接开发机Isaac SIm环境的电脑，安装Windows App。以Mac为例，从app store安装Windows Apps(搜索 RDP 也可获得)

1. 在Windows APP 中依次点击右上角的****加号**** 和 ****添加电脑**** 菜单，新建远程连接
2. 将从开发机复制的 RDP 的公网地址加端口（公网地址可从开发机详情页的自定义端口配置区域获取）输入到访问地址栏
3. 输入2.1步骤中中设置的用户名和密码
4. 登陆远程桌面
5. 连接成功

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2a10392ebb4e463cabe4bdbf141e1ddd&docGuid=wDoRgsYtMvQlil "")
### 开始遥操数据集采集
#### 3.1 数据录制
在 RDP Terminal 执行如下指令以开始录制：

```
# 需要设置生成数据集输出路径，比如设置 /root/
OUTPUT_PATH="/root/"

cd /workspace/RobotLearningLab && ./isaaclab.sh -p usecase/scripts/record_demos.py \
--task Isaac-Stack-Cube-Galbot-Left-Arm-RmpFlow-Rel-v0 \
--teleop_device keyboard \
--dataset_file $OUTPUT_PATH/dataset.hdf5 \
--num_demos 10

# 键盘控制说明:
# 重置所有命令: R
# 切换夹爪(开/关): K
# 沿x轴移动机械臂: W/S
# 沿y轴移动机械臂: A/D
# 沿z轴移动机械臂: Q/E
# 沿x轴旋转机械臂: Z/X
# 沿y轴旋转机械臂: T/G
# 沿z轴旋转机械臂: C/V

# 录制说明:
# • 立方体的堆叠顺序应该是: 蓝色(底部) -> 红色(中间) -> 绿色(顶部)
# • 大约需要10个成功的演示

# 提示:
# • 保持演示简短，较短的演示意味着策略需要做出的决策更少
# • 采取直接路径，不要沿任意轴移动，而是直接朝向目标
# • 不要暂停，执行平滑、连续的运动
# • 如果演示过程中出错，按'R'键丢弃当前演示并重置到新位置
```
运行成功后用户可通过键盘控制机器人，录制数据将自动保存至"$OUTPUT_PATH/dataset.hdf5"。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=7fdbe161136d44058489d4a2068728ae&docGuid=wDoRgsYtMvQlil "")
#### 3.2 数据播放
如果需要重放录制视频，可以通过如下指令进行重放：

```
# 需要重放的路径，镜像中预制了几条采集好的镜像，位置在/workspace/RobotLearningLab/datasets/galbot_demo.hdf5，可使用此数据
REPLAY_PATH="/workspace/RobotLearningLab/datasets/galbot_demo.hdf5"

cd /workspace/RobotLearningLab && ./isaaclab.sh -p usecase/scripts/replay_demos.py \
--task Isaac-Stack-Cube-Galbot-Left-Arm-RmpFlow-Rel-v0 \
--dataset_file $REPLAY_PATH \
--task_suit=None \
--num_envs 10
```
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=645f124d633240dcb1008a098209a316&docGuid=wDoRgsYtMvQlil "")
#### 3.3 子任务自动标注
使用如下代码进行子任务自动标注（可以使用3.2 中数据替代 3.1 数据，可将其复制入 OUTPUT_PATH并更名为dataset.hdf5）：

```
# 需要设置生成数据集输出路径，比如设置 /root/
# input_file 对应上述3.1生成的数据文件
OUTPUT_PATH="/root/"

cd /workspace/RobotLearningLab && ./isaaclab.sh -p usecase/scripts/annotate_demos.py \
--task Isaac-Stack-Cube-Galbot-Left-Arm-RmpFlow-Abs-Mimic-v0 \
--device cuda \
--auto \
--input_file $OUTPUT_PATH/dataset.hdf5 \
--output_file $OUTPUT_PATH/dataset_annotate.hdf5 \
--headless
```
#### 3.4 本地单机扩增
使用如下代码可以将以自动标注内容实现自动扩增。

```
# 需要设置生成数据集输出路径，比如设置 /root/
OUTPUT_PATH="/root/"

cd /workspace/RobotLearningLab && ./isaaclab.sh -p usecase/scripts/generate_dataset.py \
--task Isaac-Stack-Cube-Galbot-Left-Arm-RmpFlow-Abs-Mimic-v0 \
--device cuda \
--num_envs 10 \
--generation_num_trials 10000 \
--input_file $OUTPUT_PATH/dataset_annotate.hdf5 \
--output_file $OUTPUT_PATH/dataset_generate.hdf5 \
--headless
```
#### 3.5 数据预处理
通过以下代码将数据replay并生成视频：

这一步16U 都可以打满，推荐 32 核以上运行

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=1ea99bd45d97438e94e5ec16630d7b43&docGuid=wDoRgsYtMvQlil "")
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=78f069d29d264b47b55e7474df6d13e5&docGuid=wDoRgsYtMvQlil "")
```
# 需要设置生成数据集输出路径，比如设置 /root/
OUTPUT_PATH="/root/"
VIDEO_OUTPUT_PATH=$OUTPUT_PATH/datasets


cd /workspace/RobotLearningLab && ./isaaclab.sh -p usecase/scripts/replay_demos_with_camera.py \
--task Isaac-Stack-Cube-Galbot-Left-Arm-Image-Based-v0 \
--dataset_file $OUTPUT_PATH/dataset_generate.hdf5 \
--num_envs 10 \
--video \
--video_path $VIDEO_OUTPUT_PATH \
--camera_view_list ego left_wrist right_wrist \
--headless
```
#### 3.6 格式转换
通过如下代码将视频转换为 lerobot 格式：

```
# 需要设置生成数据集输出路径，比如设置 /root/
OUTPUT_PATH="/root/"

cd /workspace/RobotLearningLab &&  ./isaaclab.sh -p benchmarks/gr00t/convert_hdf5_to_lerobot_joint_space.py \
--data_root $OUTPUT_PATH \
--hdf5_filename dataset_generate.hdf5 \
--hdf5_file_path $OUTPUT_PATH/dataset_generate.hdf5 \
--lerobot_data_dir $OUTPUT_PATH/lerobot_joint_space
```
#### 3.7 直接下载数据集（可选）
对于想要快速体验训练功能的用户，可以直接在开发机运行如下指令快速从 BOS 下载数据集：

```
bcecmd bos sync bos:/aihc-rdw-bj/huggingface.co/datasets/RobotLearningLab  /mnt/cluster/GR00T-dataset
```
### 模型训练
#### 4.1 模型下载
用户可以直接从 BOS 下载模型：

```
bcecmd bos sync bos:/aihc-models-bj/nvidia/GR00T-N1.5-3B /mnt/cluster/GR00T-N1.5-3B
```
#### 4.2 Isaac-GR00T参数微调
训练：

```
source activate base && conda activate gr00t && export WANDB_MODE=offline && python /workspace/Isaac-GR00T/scripts/gr00t_finetune.py --dataset-path /mnt/cluster/GR00T-dataset/usecase/galbot_stack_cube/lerobot_joint_space --data-config galbot_joint_space --num-gpus 8 --base-model-path /mnt/cluster/GR00T-N1.5-3B --output-dir /mnt/cluster/GR00T-output --save-steps 10000  --report-to wandb --max-steps 10000
```
#### 4.3 模型验证
通过如下启动命令建立训练任务即可实现模型验证：

```
source activate base && conda activate gr00t && export WANDB_MODE=offline && python scripts/eval_policy.py --plot --embodiment_tag new_embodiment --model_path /mnt/cluster/GR00T-output --data-config galbot_joint_space --dataset_path /mnt/cluster/GR00T-dataset/usecase/galbot_stack_cube/lerobot_joint_space --video_backend decord --modality_keys left_arm left_hand
```
#### 4.4 闭环验证
##### 4.4.1在同网段创建开发机：
* 基本信息
    * 实例名称：输入您为开发机命名的名称，例如：dev-saac-gr00t
    * 资源池类型/资源池/队列：根据您的资源池类型选择已创建的资源池和队列
    * 资源规格：建议选择 建议使用AI计算显卡计算资源如 H20，并配置 32 核 64G 内存
    * 云磁盘：推荐预留100GiB保证开发机正常运行
    * 存储挂载：用于挂载云存储资源（PFS/BOS/CFS等），此处选择存储类型为PFS的资源，默认带出存储配置区，填写源路径与挂载路径（同 1.1 中路径），例如：源路径：/，挂载路径：/mnt/cluster/
    * 镜像：registry.baidubce.com/cce-ai-native/isaac-gr00t:1201-cuda12.8-galbot_joint_space

* 访问配置&高级配置
    * 可以使用默认配置，此处不做修改


完成后点击确定，即可完成开发机创建。

##### 4.4.2 获取私网 IP：
通过如下代码获取私网 ip：

```
PRI_IP=$(ifconfig eth0 | grep 'inet ' | awk '{print $2}')
echo "我的私网IP是: $PRI_IP"
```
##### 4.4.3 启动GR00T推理服务
通过如下代码启动服务：

```
# 模型checkpoint 路径
MODEL_PATH=""

/root/miniforge/envs/gr00t/bin/python /workspace/Isaac-GR00T/gr00t_inference_server.py --port 5555 \
  --model_path $MODEL_PATH \
  --data_config galbot_joint_space
```
##### 4.4.4 RDP 验证
通过 RDP 连接当前开发机并通过如下代码进行验证：

```
# 
PRI_IP=""

cd /workspace/RobotLearningLab &&  ./isaaclab.sh -p benchmarks/gr00t/gr00t_inference_client.py \
--server_port 5555 \
--server_host $PRI_IP \
--num_total_experiments 100 \
--num_success_steps 8 \
--policy_type joint_space \
--task Isaac-Stack-Cube-Galbot-Left-Arm-Joint-Position-Image-Based-v0
```
程序自动运行即可验证效果

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=e797305cadfa47c4b445ba0937b1d4f0&docGuid=wDoRgsYtMvQlil "")