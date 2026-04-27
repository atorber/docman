  
Robotwin 2.0 快速实践

RoboTwin2.0 是一款面向机器人学习的仿真与数据工具集，可快速构建虚拟机器人环境、生成高质量训练数据，并支持模仿学习等算法的开发与验证。



## 工具介绍
RoboTwin2.0 是一款面向机器人学习的仿真与数据工具集，可快速构建虚拟机器人环境、生成高质量训练数据，并支持模仿学习等算法的开发与验证。



## 开发机配置 & 最佳实践建议
|组件类别|部署建议|
|-|-|
|CPU|8 核及以上|
|内存|64G 及以上|
|GPU|L20等带有rtx core的芯片|
|存储|按需|



## 使用说明
本文会先介绍如何【创建开发机】，然后以【DP】、【ACT】模型部署为例，简单介绍Robotwin 2.0的使用。

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置

### 创建与登录开发机
1.1 步骤一：从快速开始创建一个【Robotwin 2.0】开发机实例：
在百度百舸.快速开始，找到 RoboTwin 2.0点击右侧【在开发机中打开】在右侧弹出菜单中填写开发机配置信息：

* 基本信息
    * 实例名称：输入您为开发机命名的名称，例如：dev-RoboTwin
    * 资源池类型/资源池/队列：根据您的资源池类型选择已创建的资源池和队列
    * 资源规格：建议选择 A800 显卡并配置 8 核 64G 内存
    * 云磁盘：推荐预留100GiB保证开发机正常运行
    * 存储挂载：用于挂载云存储资源（PFS/BOS/CFS等），此处选择存储类型为PFS的资源，默认带出存储配置区，填写源路径与挂载路径，例如：源路径：/RoboTwin，挂载路径：/mnt/pfs/

* 访问配置&高级配置
    * 可以使用默认配置，此处不做修改


完成后点击确定，即可完成开发机创建。

1.2 步骤二：登录开发机
填写完表单，提交后，在开发机列表可见创建的开发机，等待资源调度并部署成功后，点击登录，即可进入开发机NoteBook操作终端。

### 进入切换环境并预载数据资产
2.1 切换至 RoboTwin 环境，并进入预置 RoboTwin 目录：

```
conda activate RoboTwin
cd /root/RoboTwin/
```
2.2 下载 RoboTwin 资产（因为网络因素，请使用 http_proxy 保证下载，后续涉及下载出现问题都可以使用此方法）：

```
export http_proxy=http://10.0.7.40:18000
export https_proxy=http://10.0.7.40:18000
bash script/_download_assets.sh
unset http_proxy
unset https_proxy
```
2.3 （可选）数据生成

RoboTwin 官方虽然在 HuggingFace 上传了数据，但仍建议用户生成视频来作为数据集，可执行如下代码生成：

```
# 生成数据工具加载
apt-get update
apt-get install -y xvfb
apt-get install -y libglvnd0 libglvnd-dev
# 参考格式 xvfb-run -s "-screen 0 1400x900x24" bash collect_data.sh ${task_name} ${task_config} ${gpu_id}
# beat_block_hammer意为由机械臂举起锤子敲击桌子上生成方块
# task_config 必须是 'demo_clean' 或者 'demo_randomized'
xvfb-run -s "-screen 0 1400x900x24" bash collect_data.sh beat_block_hammer demo_randomized 0
```
最终结果会生成于data/${task_name}/${task_config}文件夹下，生成视频如下：

[附件]
后续训练都是用此步骤生成数据进行验证，task_name填写说明可见文末附录，task_config 配置可参考/root/RoboTwin/task_config/路径下相关文件

### 使用 RoboTwin 进行模型训练
RoboTwin 2.0 中已经预置了一些模型，用户可以快速进行训练，部署与验证相关模型。

### 3.1 ACT
3.1.1 进入ACT 目录并安装相关环境

```
cd policy/ACT

pip install pyquaternion pyyaml rospkg pexpect mujoco==2.3.7 dm_control==1.0.14 opencv-python matplotlib einops packaging h5py ipython

cd detr && pip install -e . && cd ..
```
3.1.2 数据预处理，将RoboTwin 2.0 的数据转换为 ACT 训练用格式

```
# bash process_data.sh ${task_name} ${task_config} ${expert_data_num}
bash process_data.sh beat_block_hammer demo_randomized 50
```
 3.1.3 训练

运行如下代码进行训练：

```
# bash train.sh ${task_name} ${task_config} ${expert_data_num} ${seed} ${gpu_id}
bash train.sh beat_block_hammer demo_randomized 50 0 0
```
可以通过调整/root/RoboTwin/policy/ACT/train.sh中参数修改训练参数

```
#!/bin/bash
task_name=${1}
task_config=${2}
expert_data_num=${3}
seed=${4}
gpu_id=${5}

DEBUG=False
save_ckpt=True

export CUDA_VISIBLE_DEVICES=${gpu_id}

python3 imitate_episodes.py \
    --task_name sim-${task_name}-${task_config}-${expert_data_num} \
    --ckpt_dir ./act_ckpt/act-${task_name}/${task_config}-${expert_data_num} \
    --policy_class ACT \
    --kl_weight 10 \
    --chunk_size 50 \
    --hidden_dim 512 \
    --batch_size 8 \
    --dim_feedforward 3200 \
    --num_epochs 6000 \
    --lr 1e-5 \
    --save_freq 2000 \
    --state_dim 14 \
    --seed ${seed}

```
3.1.4 评估

```
# bash eval.sh ${task_name} ${task_config} ${ckpt_setting} ${expert_data_num} ${seed} ${gpu_id}
bash eval.sh beat_block_hammer demo_randomized demo_randomized 50 0 0
```
评估文件在eval_result文件夹下：

[附件]
### 3.2 DP
3.2.1 安装环境

```
cd policy/DP
pip install zarr==2.12.0 wandb ipdb gpustat dm_control omegaconf hydra-core==1.2.0 dill==0.3.5.1 einops==0.4.1 diffusers==0.11.1 numba==0.56.4 moviepy imageio av matplotlib termcolor sympy
pip install -e .
```
3.2.2 数据预处理，将RoboTwin 2.0 的数据转换为 DP 训练用格式

```
# bash process_data.sh ${task_name} ${task_config} ${expert_data_num}
bash process_data.sh beat_block_hammer demo_randomized 50
```
3.2.3 训练

action_dim为维度，此处aloha-agilex为双臂 6 自由度+夹爪，共 14 维度。

```
# bash train.sh ${task_name} ${task_config} ${expert_data_num} ${seed} ${action_dim} ${gpu_id}
bash train.sh beat_block_hammer demo_randomized 50 0 14 0
```
3.2.4 评估
使用如下代码进行评估
```
bash eval.sh beat_block_hammer demo_randomized demo_clean 50 0 0
```

## 附录：task_name
参考：[官网说明文档](https://robotwin-platform.github.io/doc/tasks/index.html)

|task_name|task_description|中文翻译|
|-|-|-|
|beat_block_hammer|Pick up the hammer and use it to beat the block on the table once. The hammer is placed at a fixed position on the table, but the block is generated randomly on the table. If the block's x coordinate(dim 0) is greater than 0, use the right arm to grasp the hammer, else use the left arm. To beat the block, you should place the hammer on the block's functional point(i.e., use the place_actor API to align the hammer's contact point with the block's functional point). Note: You don't need to Lift the hammer after beating the block, and you don't need to open the gripper or return the arm to origin position.|拿起锤子并用它敲击桌子上的方块一次。锤子固定在桌子上的某个位置，但方块在桌子上随机生成。如果方块的x坐标大于0，使用右臂抓取锤子，否则使用左臂。要敲击方块，应将锤子放置在方块的功能点上（即使用place_actor API将锤子的接触点与方块的功能点对齐）。注意：敲击方块后不需要抬起锤子，也不需要打开夹爪或将手臂返回初始位置。|
|pick_dual_bottles|Use both arms to simultaneously pick up the bottle1 and bottle2 and move them to the front target locations, with the bottle1 on the left and the bottle2 on the right. Note: You don't need to open gripper and don't put down the bottles at the end.|使用双臂同时拿起bottle1和bottle2，并将它们移动到前方的目标位置，bottle1在左边，bottle2在右边。注意：不需要打开夹爪，最后也不需要放下瓶子。|
|pick_diverse_bottles|Use both arms to simultaneously pick up the diverse bottles and move them to the front target locations, with the bottle1 on the left and the bottle2 on the right. No need to put the bottles down. In which the bottles may be lying down. Note: You don't need to open gripper and don't put down the bottles at the end.|使用双臂同时拿起不同的瓶子，并将它们移动到前方的目标位置，bottle1在左边，bottle2在右边。不需要放下瓶子。瓶子可能是倒下的状态。注意：不需要打开夹爪，最后也不需要放下瓶子。|
|handover_block|There are two blocks on the desk. Use the left arm to grab the block and move it to the handover point, then use right arm to grab the block and open the gripper of left arm simulaniously. Use right arm move block on the target block. Note: You should first pass the block to the right gripper and close right gripper, then open the left gripper.|桌上有两个方块。使用左臂抓取方块并移动到交接点，然后使用右臂抓取方块并同时打开左臂夹爪。使用右臂将方块移动到目标方块上。注意：应先将方块传递给右夹爪并关闭右夹爪，然后打开左夹爪。|
|stack_blocks_two|Use the gripper to pick up block1 and move block 1 to the target position. Then pick up block 2 and place it on the block 1. If block1's x coordinate(dim 0) is greater than 0, use right arm to stack the block1, else use the left arm, and same for the block2. Note: You need to call the get_avoid_collision_pose function to avoid collisions when the left and right arms move alternately. For example, if the previous action uses the left arm and the next action uses the right arm, you need to move the left arm after release gripper to avoid collisions, vice versa. The pre-dis of stacked blocks may be smaller.|使用夹爪拿起block1并将block1移动到目标位置。然后拿起block2并将其放置在block1上。如果block1的x坐标大于0，使用右臂堆叠block1，否则使用左臂，block2同理。注意：当左右臂交替移动时，需要调用get_avoid_collision_pose函数避免碰撞。例如，如果前一个动作使用左臂，下一个动作使用右臂，需要在释放夹爪后移动左臂以避免碰撞，反之亦然。堆叠方块的预抓取距离可能较小。|
|stack_blocks_three|Use the gripper to pick up block1 and move block 1 to the target position. Then pick up block 2 and place it on the block 1, and finally pick up block3 and place it on the block2. If block1's x coordinate(dim 0) is greater than 0, use right arm to stack the block1, else use the left arm. And same for the block2 and block3. Note: You need to call the get_avoid_collision_pose function to avoid collisions when the left and right arms move alternately. For example, if the previous action uses the left arm and the next action uses the right arm, you need to move the left arm after release gripper to avoid collisions, vice versa. The pre-dis of stacked blocks may be smaller.|使用夹爪拿起block1并将block1移动到目标位置。然后拿起block2并将其放置在block1上，最后拿起block3并将其放置在block2上。如果block1的x坐标大于0，使用右臂堆叠block1，否则使用左臂，block2和block3同理。注意：当左右臂交替移动时，需要调用get_avoid_collision_pose函数避免碰撞。例如，如果前一个动作使用左臂，下一个动作使用右臂，需要在释放夹爪后移动左臂以避免碰撞，反之亦然。堆叠方块的预抓取距离可能较小。|
|place_container_plate|Use both arms to pick up the container and place it in the plate. If the container's x coordinate(dim 0)is greater than 0, use right arm to grasp the right side of the container, then pick up the container and place it in the plate. Else use the left arm grasp the left side of the container, then pick up the container and place it in the plate. Note: You may need to close the jaws tightly to pick up the container.|使用双臂拿起容器并将其放入盘子中。如果容器的x坐标大于0，使用右臂抓取容器的右侧，然后拿起容器并将其放入盘子中。否则使用左臂抓取容器的左侧，然后拿起容器并将其放入盘子中。注意：可能需要紧紧关闭夹爪来拿起容器。|
|place_empty_cup|Use both arms to pick up the empty cup and place it on the coaster. If the cup's x coordinate(dim 0) is greater than 0, use right arm to grasp the cup, then pick up the cup and place it on the coaster, else use the left arm grasp the the cup, then pick up the cup and place it on the coaster. Note: You may need to close the jaws tightly to pick up the cup. Pre-dis for grabbing and placing cups may be smaller. The distance of lifting the cup may be smaller.|使用双臂拿起空杯子并将其放在杯垫上。如果杯子的x坐标大于0，使用右臂抓取杯子，然后拿起杯子并将其放在杯垫上，否则使用左臂抓取杯子，然后拿起杯子并将其放在杯垫上。注意：可能需要紧紧关闭夹爪来拿起杯子。抓取和放置杯子的预抓取距离可能较小。抬起杯子的距离可能较小。|
|place_shoe|Pick up the shoe and place it on the target block. And the head of the shoe should be towards the left side. The shoe is randomly placed on the table, if the shoe's x coordinate(dim 0) is greater than 0, use right arm to grasp the shoe, else use the left arm grasp the shoe.|拿起鞋子并将其放在目标方块上。鞋头应朝向左侧。鞋子随机放置在桌子上，如果鞋子的x坐标大于0，使用右臂抓取鞋子，否则使用左臂抓取鞋子。|
|place_dual_shoes|Left shoe and right shoe are randomly generated on the desktop, one on the left and one on the right. Use left and right arms to pick up two shoes simultaneously. And put down them on the shoe box respectively. The head of the shoe should be towards the left side. Left shoe should be placed on the point0 of shoe box, and right shoe should be placed on the point1 of shoe box. Note: You may need to put the shoes in order to avoid left and right arm collisions. Avoiding collisions needs to be done before place shoes. Pre-dis for grabbing and placing shoes may be smaller.|左鞋和右鞋随机生成在桌面上，一只在左边，一只在右边。使用左右臂同时拿起两只鞋子，并分别将它们放在鞋盒上。鞋头应朝向左侧。左鞋应放置在鞋盒的point0上，右鞋应放置在鞋盒的point1上。注意：可能需要按顺序放置鞋子以避免左右臂碰撞。避免碰撞需要在放置鞋子之前完成。抓取和放置鞋子的预抓取距离可能较小。|
|adjust_bottle|Pick up the bottle on the table headup with the correct arm. Move the arm upward by 0.1 meters along z-axis, and place the bottle at target pose. Note: You should keep gripper closed when placing the bottle.|使用正确的手臂拿起桌子上的瓶子（瓶口朝上）。沿z轴向上移动手臂0.1米，并将瓶子放置在目标姿态。注意：放置瓶子时应保持夹爪关闭。|
|blocks_ranking_rgb|Place the red block, green block, and blue block in the order of red, green, and blue from left to right, placing in a row. Pick and place each block to their target positions. Note: You should move end effector back to origin after placing each block to avoid collisions. You can place the red block, the green block, and the blue block in the order.|将红色方块、绿色方块和蓝色方块按照红、绿、蓝的顺序从左到右排成一行。逐个拿起并放置每个方块到其目标位置。注意：放置每个方块后应将末端执行器移回原点以避免碰撞。可以按照红色方块、绿色方块、蓝色方块的顺序放置。|
|blocks_ranking_size|There are three blocks on the table, the color of the blocks is random, move the blocks to the center of the table, and arrange them from largest to smallest, from left to right. Pick and place each block to their target positions. Note: You should move end effector back to origin after placing each block to avoid collisions. You can place the smallest block, the middle block, and the largest block in the order.|桌上有三个方块，方块颜色随机，将方块移动到桌子中央，并按从大到小、从左到右的顺序排列。逐个拿起并放置每个方块到其目标位置。注意：放置每个方块后应将末端执行器移回原点以避免碰撞。可以按照最小方块、中间方块、最大方块的顺序放置。|
|click_bell|Click the bell's top center on the table. Move the top of bell's center and close gripper. And move the gripper down to touch the bell's top center. Note: You can change some API parameters to move above the bell's top center and close the gripper. You can use self. grasp_actor() to simulate the action of touch and click. self.grasp_actor() is only used to move the top center of the bell and close the gripper. So you must use same pre_grasp_dis and grasp_dis as the click_bell task. You don't need to lift the bell after clicking it, and you don't need to open the gripper or return the arm to origin position.|点击桌子上铃铛的顶部中心。移动到铃铛顶部中心并关闭夹爪。然后向下移动夹爪接触铃铛顶部中心。注意：可以更改一些API参数移动到铃铛顶部中心上方并关闭夹爪。可以使用self.grasp_actor()模拟触摸和点击动作。self.grasp_actor()仅用于移动到铃铛顶部中心并关闭夹爪。因此必须使用与click_bell任务相同的pre_grasp_dis和grasp_dis。点击铃铛后不需要抬起铃铛，也不需要打开夹爪或将手臂返回初始位置。|
|grab_roller|Use both arms to grab the roller on the table. Grasp the roller with both arms simultaneously at different contact points. And lift the roller upper by 0.15 meters by moving both arms upward simultaneously.|使用双臂抓取桌子上的滚筒。同时用双臂在不同接触点抓取滚筒。通过同时向上移动双臂将滚筒抬起0.15米。|
|lift_pot|Use both arms to lift the pot. Grasp the pot with both arms at specified contact points. And lift the pot by moving both arms upper by 0.15 meters. Note: The pre_grasp_dis is very small when grasping the pot.|使用双臂抬起锅。在指定接触点用双臂抓取锅。通过向上移动双臂将锅抬起0.15米。注意：抓取锅时预抓取距离非常小。|
|move_can_pot|There is a can and a pot on the table. Use one arm to pick up the can and move it to beside the pot. Grasp the can, and move the can upward. Place the can near the pot at target pose. Note: You don't need to return the arm to origin position.|桌子上有一个罐子和一个锅。使用一只手臂拿起罐子并将其移动到锅旁边。抓取罐子，向上移动罐子。将罐子放置在锅附近的目标姿态。注意：不需要将手臂返回初始位置。|
|move_playingcard_away|Use the arm to pick up the playing card and move it to left or right. Grasp the playing cards with specified arm, and then move the playing cards horizontally(right if right arm, left if left arm). Note: You should open gripper to release the playing cards after moving them.|使用手臂拿起扑克牌并将其向左或向右移动。用指定手臂抓取扑克牌，然后水平移动扑克牌（右臂向右移动，左臂向左移动）。注意：移动扑克牌后应打开夹爪释放扑克牌。|
|move_stapler_pad|Use appropriate arm to move the stapler to a colored mat. Grasp the stapler with specified arm, and move the arm upward. Place the stapler at target pose with alignment constraint.|使用适当的手臂将订书机移动到彩色垫子上。用指定手臂抓取订书机，向上移动手臂。将订书机放置在具有对齐约束的目标姿态上。|
|click_alarmclock|Click the alarm clock's center of the top side button on the table. Move the top of bell's center and close gripper. And move the gripper down. Note: You can change some API parameters to move above the alarm clock's top center and close the gripper(grasp_actor). You can use self.grasp_actor() to simulate the action of touch and click|点击桌子上闹钟顶部按钮的中心。移动到闹钟顶部中心并关闭夹爪。然后向下移动夹爪。注意：可以更改一些API参数移动到闹钟顶部中心上方并关闭夹爪（grasp_actor）。可以使用self.grasp_actor()模拟触摸和点击动作。|
|dump_bin_bigbin|Grab the small bin and pour the balls into the big bin. If the small bin is on the right side of the table, grasp the deskbin with right arm, and place the deskbin at middle pose. Then return right arm to origin while simultaneously grasping with left arm. If deskbin is on left side, directly grasp with left arm. Perform pouring actions 3 times. Note: The gripper should be closed when pouring the balls into the big bin. You should use self.delay(6) in the end of the task to wait for the pouring actions to complete. Don't use functional point for the deskbin, use self.place_actor()to place the deskbin at middle pose.|抓起小垃圾桶将球倒入大垃圾桶中。如果小垃圾桶在桌子右侧，用右臂抓取桌面垃圾桶，将其放置在中介姿态。然后同时用左臂抓取时将右臂返回原点。如果桌面垃圾桶在左侧，直接用左臂抓取。执行倒球动作3次。注意：将球倒入大垃圾桶时应关闭夹爪。应在任务结束时使用self.delay(6)等待倒球动作完成。不要使用桌面垃圾桶的功能点，使用self.place_actor()将桌面垃圾桶放置在中介姿态。|
|handover_mic|Use one arm to grasp the microphone on the table and handover it to the other arm. Move the grasping arm to the microphone's position and grasp it. Move the handover arm to the middle position for handover. Move the handover arm to grasp the microphone from the grasping arm. Move the grasping arm to open the gripper.|使用一只手臂抓取桌子上的麦克风并将其交接给另一只手臂。移动抓取手臂到麦克风位置并抓取。移动交接手臂到中介位置进行交接。移动交接手臂从抓取手臂处抓取麦克风。移动抓取手臂打开夹爪。|
|hanging_mug|Use left arm to pick the mug on the table, rotate the mug and put the mug down in the middle of the table, use the right arm to pick the mug and hang it onto the rack. Move the grasping arm to the mug's position and grasp it. Move the grasping arm to a middle position before hanging. Grasp the mug with the hanging arm, and move the grasping arm back to its origin. Move the hanging arm to the target pose and hang the mug. Note: grasping arm is left arm, hanging arm is right arm. The target pose for hanging the mug is the functional point of the rack.|使用左臂拿起桌子上的杯子，旋转杯子并将杯子放在桌子中央，使用右臂拿起杯子并将其挂在架子上。移动抓取手臂到杯子位置并抓取。在悬挂前移动抓取手臂到中介位置。用悬挂手臂抓取杯子，并将抓取手臂移回原点。移动悬挂手臂到目标姿态并悬挂杯子。注意：抓取手臂是左臂，悬挂手臂是右臂。悬挂杯子的目标姿态是架子的功能点。|
|move_pillbottle_pad|Use one arm to pick the pillbottle and place it onto the pad. Grasp the pillbottle. Get the target pose for placing the pillbottle, and place the pillbottle at the target pose.|使用一只手臂拿起药瓶并将其放在垫子上。抓取药瓶。获取放置药瓶的目标姿态，并将药瓶放置在目标姿态。|
|place_a2b_left|Use appropriate arm to place object on the left of target object. Grasp the object with specified arm. And get target pose and adjust x position to place object to the left of target object. Place the object at the adjusted target object position. Note: You can decrease the x position of target pose by 0.13 to place object to the left of target object.(target_pose[0]-= 0.13)|使用适当的手臂将物体放置在目标物体的左侧。用指定手臂抓取物体。获取目标姿态并调整x位置将物体放置在目标物体左侧。将物体放置在调整后的目标物体位置。注意：可以将目标姿态的x位置减少0.13来将物体放置在目标物体左侧。|
|place_a2b_right|Use appropriate arm to place object on the right of target object. Grasp the object with specified arm. And get target pose and adjust x position to place object to the right of target object. Place the object at the adjusted target object position. Note: You can increase the x position of target pose by 0.13 to place object to the right of target object.(target_pose[0]+= 0.13)|使用适当的手臂将物体放置在目标物体的右侧。用指定手臂抓取物体。获取目标姿态并调整x位置将物体放置在目标物体右侧。将物体放置在调整后的目标物体位置。注意：可以将目标姿态的x位置增加0.13来将物体放置在目标物体右侧。|
|place_bread_basket|If there is one bread on the table, use one arm to grab the bread and put it in the basket. If there are two breads on the table, use two arms to simultaneously grab up two breads and put them in the basket. Grasp the bread. If there is one bread, place the bread into the basket. If there is two breads, place left bread into the basket, and place right bread into the basket when move left arm back to origin. Note: You should move the arm back to origin after placing the bread to avoid collisions.|如果桌子上有一个面包，使用一只手臂抓起面包放入篮子中。如果桌子上有两个面包，使用双臂同时抓起两个面包放入篮子中。抓取面包。如果有一个面包，将面包放入篮子中。如果有两个面包，将左面包放入篮子中，并在移动左臂回原点时将右面包放入篮子中。注意：放置面包后应将手臂移回原点以避免碰撞。|
|place_bread_skillet|If there is one bread on the table, use one arm to grab the bread and put it into the skillet. Grasp the skillet and bread simultaneously with dual arms. Get the functional point of the skillet as placement target for the bread. Place the bread onto the skillet.|如果桌子上有一个面包，使用一只手臂抓起面包放入煎锅中。同时用双臂抓取煎锅和面包。获取煎锅的功能点作为面包的放置目标。将面包放在煎锅上。|
|place_can_basket|Use one arm to pick up the can and place it into the basket. Use the other arm to lift up the basket. Grasp the can with the specified arm. Place the can at the selected position into the basket. Lift the basket with the opposite arm. The height of lifting the basket is 5 cm.|使用一只手臂拿起罐子并将其放入篮子中。使用另一只手臂抬起篮子。用指定手臂抓取罐子。将罐子放置在篮子中的选定位置。用另一只手臂抬起篮子。抬起篮子的高度为5厘米。|
|place_cans_plasticbox|Use dual arm to pick and place cans into plasticbox. Grasp both objects with dual arms. Place left object into plastic box at target point 1, and then left arm moves back to origin while right arm places object into plastic box at target point 0. Grasp the second can with the right arm and place it into the plastic box at target point 0. Right arm moves back to original position. Note: You should use left arm to grasp object 1 and right arm to grasp object 2. Don't set pre_dis_axis to fp, because the pre_dis_axis is not used in this task.|使用双臂拿起罐子并将其放入塑料盒中。用双臂抓取两个物体。将左物体放入塑料盒的目标点1，然后左臂移回原点同时右臂将物体放入塑料盒的目标点0。用右臂抓取第二个罐子并将其放入塑料盒的目标点0。右臂移回原始位置。注意：应使用左臂抓取物体1，右臂抓取物体2。不要将pre_dis_axis设置为fp，因为此任务中不使用pre_dis_axis。|
|place_fan|Grab the fan and place it on a colored pad. Grasp the fan with the selected arm. Place the fan to the target pose. Note: The height of lifting the fan is small. Fan have front and back, so you should use constraint'align'to align the fan's front with the pad's front.|抓起风扇并将其放在彩色垫子上。用选定手臂抓取风扇。将风扇放置到目标姿态。注意：抬起风扇的高度较小。风扇有前后之分，因此应使用'align'约束将风扇的前部与垫子的前部对齐。|
|place_burger_fries|Use dual arm to pick the hamburg and frenchfries and put them onto the tray. Dual grasp of hamburg and french fries. Get target poses from tray for placing. And place hamburg on tray, then place french fries on tray while moving the arm that placed hamburg back to origin. Note: Use left arm to grasp hamburg and right arm to grasp french fries. The target pose for placing hamburg and french fries is the functional point 0 and 1 of the tray respectively.|使用双臂拿起汉堡和薯条并将它们放在托盘上。同时抓取汉堡和薯条。从托盘获取放置的目标姿态。将汉堡放在托盘上，然后在移动放置汉堡的手臂回原点的同时将薯条放在托盘上。注意：使用左臂抓取汉堡，右臂抓取薯条。放置汉堡和薯条的目标姿态分别是托盘的功能点0和1。|
|place_mouse_pad|Grasp the mouse and place it on a colored pad. Grasp the mouse with the selected arm. Place the mouse at the target location. Note: The mouse have front and back, so you should use constraint'align'to align the mouse's front with the pad's front.|抓取鼠标并将其放在彩色垫子上。用选定手臂抓取鼠标。将鼠标放置在目标位置。注意：鼠标有前后之分，因此应使用'align'约束将鼠标的前部与垫子的前部对齐。|
|place_object_basket|Use one arm to grab the target object and put it in the basket, then use the other arm to grab the basket, and finally move the basket slightly away. Grasp the object with the specified arm. Place the object at the selected position into the basket. Lift the basket with the opposite arm. Note: You should not open the gripper after lifting the basket. The height of lifting the basket is 5 cm.|使用一只手臂抓起目标物体放入篮子中，然后使用另一只手臂抓起篮子，最后将篮子稍微移开。用指定手臂抓取物体。将物体放置在篮子中的选定位置。用另一只手臂抬起篮子。注意：抬起篮子后不应打开夹爪。抬起篮子的高度为5厘米。|
|place_object_scale|Use one arm to grab the object and put it on the scale. Grasp the object with the selected arm. Place the object on the scale. Note: Don't use functional point_id and pre_dis_axis='fp', because the object can be any object that is specified in the task.|使用一只手臂抓起物体并将其放在秤上。用选定手臂抓取物体。将物体放在秤上。注意：不要使用functional point_id和pre_dis_axis='fp'，因为物体可以是任务中指定的任何物体。|
|place_object_stand|Use appropriate arm to place the object on the stand. Grasp the object with the specified arm. Place the object onto the display stand. Note: Don't use functional_point_id and pre_dis_axis='fp', because the object can be any object that is specified in the task.|使用适当的手臂将物体放置在架子上。用指定手臂抓取物体。将物体放置在展示架上。注意：不要使用functional_point_id和pre_dis_axis='fp'，因为物体可以是任务中指定的任何物体。|
|place_phone_stand|Pick up the phone and put it on the phone stand. Grasp the phone with specified arm. Place the phone onto the stand's functional point and align the points.|拿起电话并将其放在电话架上。用指定手臂抓取电话。将电话放置在架子的功能点上并对齐点。|
|press_stapler|Use one arm to press the stapler. Move arm to the position of the stapler and close the gripper. Move the stapler down slightly. Note: You can use self.grasp_actor() to simulate the action of move to the position of stapler or pressing the stapler. The stapler should be pressed at the top center.|使用一只手臂按压订书机。移动手臂到订书机位置并关闭夹爪。将订书机稍微向下移动。注意：可以使用self.grasp_actor()模拟移动到订书机位置或按压订书机的动作。订书机应在顶部中心被按压。|
|rotate_qrcode|Use arm to catch the qrcode board on the table, pick it up and rotate to let the qrcode face towards you. Grasp the QR code with specified pre-grasp distance. Place the QR code at the target position. Note: The QR code have front and back, so you should use constraint'align'to align the QR code's front with the target position. Don't use functional point of the QR code when placing it.|使用手臂抓取桌子上的二维码板，拿起并旋转让二维码面向你。用指定的预抓取距离抓取二维码。将二维码放置在目标位置。注意：二维码有正反面之分，因此应使用'align'约束将二维码的正面与目标位置对齐。放置二维码时不要使用其功能点。|
|scan_object|Use one arm to pick the scanner and use the other arm to pick the object, and use the scanner to scan the object. Move the scanner and object to the gripper. Get object target pose and place the object. Move the scanner to align with the object. Note: The object target pose is dependent on the arm used to grasp the object. The scanner should be placed at a distance of 0.05 meters from the functional point of the object. You should not open the gripper after placing the object and scanner.|使用一只手臂拿起扫描器，另一只手臂拿起物体，然后用扫描器扫描物体。将扫描器和物体移动到夹爪处。获取物体目标姿态并放置物体。移动扫描器与物体对齐。注意：物体目标姿态取决于用于抓取物体的手臂。扫描器应放置在距离物体功能点0.05米处。放置物体和扫描器后不应打开夹爪。|
|stack_bowls_three|Stack the three bowls on top of each other. Move bowl 1 to the target pose, then move bowl 2 above bowl 1, and finally move bowl 3 above bowl 2. Note: The target pose of bowl 2 is at 5 cm above bowl 1, and the target pose of bowl 3 is at 5 cm above bowl 2. All target pose is np.ndarray([x, y, z]), so you should concatenate the quaternion later.|将三个碗叠放在一起。将碗1移动到目标姿态，然后将碗2移动到碗1上方，最后将碗3移动到碗2上方。注意：碗2的目标姿态在碗1上方5厘米处，碗3的目标姿态在碗2上方5厘米处。所有目标姿态都是np.ndarray([x, y, z])，因此稍后应连接四元数。|
|stack_bowls_two|Stack the two bowls on top of each other. Move bowl 1 to the target pose, then move bowl 2 above bowl 1. Note: The target pose of bowl 2 is at 5 cm above bowl 1. All target pose is np.ndarray([x, y, z]), so you should concatenate the quaternion later.|将两个碗叠放在一起。将碗1移动到目标姿态，然后将碗2移动到碗1上方。注意：碗2的目标姿态在碗1上方5厘米处。所有目标姿态都是np.ndarray([x, y, z])，因此稍后应连接四元数。|
|stamp_seal|Use one arm to pick the stamp and place it on the target block. Grasp the seal with specified arm. Place the seal on the target block. Note: Don't set pre_dis_axis to fp, because the pre_dis_axis is not used in this task.|使用一只手臂拿起印章并将其放在目标方块上。用指定手臂抓取印章。将印章放置在目标方块上。注意：不要将pre_dis_axis设置为fp，因为此任务中不使用pre_dis_axis。|
|shake_bottle_horizontally|Shake the bottle horizontally with proper arm. Grasp the bottle with specified arm. Shake the bottle horizontally by moving the arm left and right.|用适当的手臂水平摇晃瓶子。用指定手臂抓取瓶子。通过左右移动手臂水平摇晃瓶子。|
|shake_bottle|Shake the bottle with proper arm. Grasp the bottle with specified arm. Shake the bottle by moving the arm up and down.|用适当的手臂摇晃瓶子。用指定手臂抓取瓶子。通过上下移动手臂摇晃瓶子。|
|put_bottles_dustbin|Use one arm to pick the bottle and put it into the dustbin. Grasp the bottle with specified arm. Place the bottle into the dustbin. Note: Don't set pre_dis_axis to fp, because the pre_dis_axis is not used in this task.|使用一只手臂拿起瓶子并将其放入垃圾桶中。用指定手臂抓取瓶子。将瓶子放入垃圾桶中。注意：不要将pre_dis_axis设置为fp，因为此任务中不使用pre_dis_axis。|
|turn_switch|Use one arm to click the switch. Close the gripper before clicking the switch. Then move the arm to the switch and click it. Note: You can use grasp_actor() to simulate the action of clicking the switch.|使用一只手臂点击开关。点击开关前关闭夹爪。然后移动手臂到开关处并点击它。注意：可以使用grasp_actor()模拟点击开关的动作。|
|open_laptop|Open the laptop with one proper arm. Grasp the laptop with specified arm. Open the laptop by moving the arm up.|用适当的手臂打开笔记本电脑。用指定手臂抓取笔记本电脑。通过向上移动手臂打开笔记本电脑。|
|open_microwave|Open the microwave with one proper arm. Grasp the handle of the microwave with specified arm. Pull the handle to open the microwave.|用适当的手臂打开微波炉。用指定手臂抓取微波炉把手。拉动把手打开微波炉。|
|put_object_cabinet|Use one arm to open the cabinet, and use another arm to pick the object and put it into the cabinet. Grasp the cabinet handle with one arm and open the cabinet. Grasp the object with the other arm and place it into the cabinet.|使用一只手臂打开柜子，另一只手臂拿起物体并将其放入柜子中。用一只手臂抓取柜子把手并打开柜子。用另一只手臂抓取物体并将其放入柜子中。|

