# 工具介绍

> Isaac Lab 是由 NVIDIA 推出的基于Isaac Sim的开源机器人研究框架，基于 GPU 加速实现精确仿真，统一和简化强化学习、模仿学习和运动规划等机器人研究工作流程，推动机器人 sim-to-real（仿真到现实）的高效迁移。



Isaac Lab 是由 NVIDIA 推出的基于Isaac Sim的开源机器人研究框架，基于 GPU 加速实现精确仿真，统一和简化强化学习、模仿学习和运动规划等机器人研究工作流程，推动机器人 sim-to-real（仿真到现实）的高效迁移。

其优势主要包括：

1. **机器人形态支持全面：**兼容**16+ 主流机器人形态**，涵盖机械臂（如 Franka）、四足（如 ANYmal）、人形机器人（如 Atlas）等；
2. **训练环境丰富：**提供 **30+ 开箱即用环境**，这些环境支持主流强化学习框架训练，如RSL RL、SKRL、RL Games或Stable Baselines等；
3. **支持复杂对象仿真：**支持刚体、铰接系统和柔性物体等复杂仿真对象；
4. **多传感器系统支持：**支持RGB/深度/分割相机、相机注释、IMU、接触传感器、光线投射器。


![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e8ef09f.png)

# 部署环境要求&最佳实践建议

|      | 部署要求                                                     | 最佳实践               |
| ---- | ------------------------------------------------------------ | ---------------------- |
| CPU  | 8核                                                          | 建议按表单默认值及以上 |
| 内存 | 64G                                                          | 建议按表单默认值及以上 |
| GPU  | **Isaac Lab 2.1.0 :** A10 / A100 / A800 / H20 / H800 / L20 / 支持RT Core的GPU卡 ×1 <br/>**Isaac Lab 2.2.0 :**  L20/支持RT Core的GPU卡 ×1 | 按需                   |
| CDS  | 按需                                                         | 按需                   |
| 其它 | 无                                                           | 无                     |

**注意：**部署该实例的集群需要具备访问公网的能力，配置方式见：[https://cloud.baidu.com/doc/CCE/s/plmk196bx](https://cloud.baidu.com/doc/CCE/s/plmk196bx)

> Isaac Lab 2.2.0 依赖于 Isaac Sim 5.0，该仿真环境在渲染时使用了 DLSS（超采样技术，Deep Learning Super Sampling），因此推荐使用支持RT Core的GPU卡。

### 服务网卡配置

由于该工具的较多场景需要访问外网，可以通过设置服务网卡，并设置HTTP & HTTPS网络代理支持。[服务网卡配置参考](https://cloud.baidu.com/doc/VPC/s/Plztid5es#2-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E7%BD%91%E5%8D%A1)







# 使用说明

本文以 **快速启动预定义训练任务**和**创建Project并训练推理 **两个案例，介绍Isaac Lab的使用过程。

在试用案例之前，请确保已挂载了案例所需的数据集，否则脚本无法正常运行，可在脚本内更改数据集地址配置

## **创建与登录开发机**

根据部署环境要求成功创建开发机后，点击登录开发机，进入开发机webIDE，打开Terminal界面：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d77c535.png)
主要路径介绍

* isaac lab源码路径：/workspace/isaaclab



## 快速启动训练任务

Isaac Lab官方提供了丰富的[Tutorials](https://isaac-sim.github.io/IsaacLab/main/source/tutorials/index.html) 供用户学习和试用，执行如下命令，展示 Isaac Lab 中所有可用的强化学习 (RL) 和指令学习 (IL) 任务

```
cd /workspace/isaaclab
./isaaclab.sh -p scripts/environments/list_envs.py --keyword <search_term>
```

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_6939d6b.jpeg)


以预定义环境Isaac-Ant-v0为例，执行如下命令启动训练。这里设置的num_envs和max_iterations仅为了快速验证，--headless确保代码在无GUI的环境下正常运行：

```
python scripts/reinforcement_learning/skrl/train.py --task=Isaac-Ant-v0 --headless --num_envs=1 --max_iterations=1
```

训练输出包含运行环境、仿真场景配置、观测空间、终止条件、奖励函数、强化学习模型定义，以及日志保存路径等信息，如下所示：

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c23454c.jpeg)





### 举例：使用强化学习训练智能体

我们从 Stable-Baselines3 训练一个 PPO 智能体来解决倒立平衡任务.官方链接:[Training with an RL Agent](https://isaac-sim.github.io/IsaacLab/main/source/tutorials/03_envs/run_rl_training.html)

```
cd /workspace/isaaclab
## 执行训练（ --headless指定无gui，--video指定渲染视频,录制智能体在训练过程中行为视频）
./isaaclab.sh -p scripts/reinforcement_learning/sb3/train.py --task Isaac-Cartpole-v0 --num_envs 64 --headless --video
```

视频已保存到该`./logs/sb3/Isaac-Cartpole-v0/<run-dir>/videos/train`目录。您可以使用任何视频播放器打开这些视频。

可视化结果如下：

优化前：

![rl-video-step-0-ezgif.com-video-to-gif-converter.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/rl-video-step-0-ezgif.com-video-to-gif-converter_ea6160f.gif)

优化后：

![rl-video-step-14000-ezgif.com-video-to-gif-converter.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/rl-video-step-14000-ezgif.com-video-to-gif-converter_0e95e21.gif)


##  创建新的Project

提示：新建Project的train.py和play.py都提供了丰富的参数设置，可以通过--help查看，其中，--info可以看到更详细的输出信息，可用于运行环境错误分析。

### 环境创建&注册

执行如下命令，选择任务类型、Project属性和工作流等即可完成一个Project的创建。

```
./isaaclab.sh --new
```

以当前创建的project为例，task type选择external，workslow选择轻量的Direct | single-agent，然后确定RL库和算法等。这里我们将Project name设置为test，下文如无特殊说明，test一般指代Project name。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_560d03e.png)
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_157f291.png)


按照如上方式，会创建一个cartpole（倒立摆）基准测试，可用于快速确认环境配置的正确性。在路径test/source/test/test/tasks/direct/test下可以看到__init__.py，该初始化函数用于自定义环境的注册：

```
import gymnasium as gym

from . import agents

gym.register(
    id="Template-Test-Direct-v0",
    entry_point=f"{__name__}.test_env:TestEnv",
    disable_env_checker=True,
    kwargs={
        "env_cfg_entry_point": f"{__name__}.test_env_cfg:TestEnvCfg",
        "skrl_amp_cfg_entry_point": f"{agents.__name__}:skrl_amp_cfg.yaml",
        "skrl_cfg_entry_point": f"{agents.__name__}:skrl_ppo_cfg.yaml",
    },
)
```

然后，执行如下命令将其安装为python模块，便于后续启动训练和推理：

```
cd /workspace/test
python -m pip install -e source/test
```

成功安装后，使用如下命令可以看到该环境已经注册到环境列表中，后面会使用Task Name作为task参数启动训练和推理：

```
cd /workspace/test
python scripts/list_envs.py
```

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d9d9bb9.jpeg)


### 启动训练

执行如下命令启动训练，类似地，这里设置的num_envs和max_iterations仅为了快速验证。训练结束后，checkpoints会保存在logs目录下。

```
cd /workspace/test
python scripts/skrl/train.py --task=Template-Test-Direct-v0 --headless --num_envs=1 --max_iterations=1
```

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_e4fba26.jpeg)
![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d9f6a0d.jpeg)

### 启动推理

执行如下命令启动训练后模型的推理。参数 --video 可以确保在推理任务结束后，在logs/videos目录下保存一个仿真视频：

```
cd /workspace/test
python scripts/skrl/play.py --task=Template-Test-Direct-v0 --headless --num_envs=1 --video
```

![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_473c36c.jpeg)
![image.jpeg](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_7a426cf.jpeg)



