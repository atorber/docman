  

# 工具介绍

> ManiSkill是一个由SAPIEN支持的**开源机器人模拟与训练框架**，通过GPU并行化技术实现高吞吐仿真和数据采集，支持多样化机器人任务和仿真-现实闭环迁移，并提供丰富的预置学习算法。



![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_adc1cce.png)
ManiSkill是一个由SAPIEN支持的机器人**模拟**和**训练**开源框架。其特点包括：

1. **超高速数据采集。**基于 GPU 并行化技术，在 NVIDIA 4090 GPU 上可实现 30,000+ FPS 的 RGBD + 语义分割数据采集，大幅提升视觉数据生成效率。
2. **GPU 并行化异构仿真**
    1. **状态型合成数据生成**：支持高吞吐量的仿真数据采集（如物体位姿、物理状态）。
    2. **异构场景并行**：每个并行环境可运行**完全不同的物体场景**（如随机物体布局、多样化任务配置）。

3. **多样化任务覆盖**
    1. **机器人形态**：人形机器人、移动机械臂、单臂机器人等。
    2. **任务类型**：桌面操作（抓取/推挤）、清洁/绘图、灵巧操作（如精细物体操控）。

4. **开发者友好 API**
    1. 通过**面向对象设计**抽象 GPU 内存管理，提供简洁的任务构建接口，降低开发复杂度。

5. **仿真-现实闭环**
    1. **Real2Sim**：将真实策略部署到 GPU 仿真中，实现 **100 倍加速**的性能评估。
    2. **Sim2Real**：支持将在仿真中训练的策略无缝迁移到真实机器人。

6. **预置机器人学习基线**
    1. **强化学习**：PPO、SAC、TD-MPC2 等。
    2. **模仿学习**：行为克隆（BC）、扩散策略（Diffusion Policy）。
    3. **大模型支持**：视觉语言动作模型（VLAs），如 **Octo、RDT-1B、RT-x**。

**官方文档**：[https://maniskill.readthedocs.io/en/v3.0.0b21/user_guide/getting_started/quickstart.html#](https://maniskill.readthedocs.io/en/v3.0.0b21/user_guide/getting_started/quickstart.html#)



# 部署环境要求&最佳实践建议
||部署要求|最佳实践|
|-|-|-|
|CPU|按需|建议8核及以上|
|内存|按需|建议32GB及以上|
|GPU|按需|本案例主要以A800为实践（推荐）|
|CDS|按需|按需|
|其它|无|无|





# 使用说明
本文以GPU并行仿真和创建并启动自定义任务为例，介绍ManiSkill的使用过程

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置。

## **创建与登录开发机**
根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，打开/root/workspace/maniskill，即可看到给出的示例代码目录quick_start：

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_cb729fa.jpeg)


## 启动GPU并行化仿真任务
该示例主要介绍ManiSkill的并行化仿真功能，打开IDE终端，执行如下命令：

```
# 首先确保在正确的python环境下
# conda activate base
cd /root/workspace/maniskill/quick_start
python pick_cube.py
```
可以看到结果如下所示，具体地，对于任务进行过程中的obs、reward等中间输出，可以自行修改代码查看：

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_10c7c2d.jpeg)


为了可视化地查看任务，可以直接执行如下命令：

```
# 首先确保在正确的python环境下
# conda activate base
python -m mani_skill.examples.benchmarking.gpu_sim --num-envs=16 --save-video
```
任务完成/超时后，可看到渲染得到的.mp4视频，点击播放即可查看：

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_53fbe67.jpeg)
![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_52b52b2.jpeg)
##  构建并启动自定义任务
示例代码quick_start/custom_task_def.py定义了一个简单的“推立方体”的任务，也即以强化学习的方式训练机械臂从立方体的后面将其推动到目标区域。代码中已经包含必要的注释以帮助理解一个自定义任务的构建，这里不再赘述。

quick_start/custom_task_start.py的代码逻辑与quick_start/pick_cube.py比较类似，可参考。

执行如下命令启动任务：

```
# 首先确保在正确的python环境下
# conda activate base
cd /root/workspace/maniskill/quick_start
python custom_task_start.py
```
![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_858cd03.jpeg)
具体对于任务进行过程中的obs、reward等中间输出，可以自行修改代码查看。





