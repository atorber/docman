robotics-diffusion-transformer/rdt-1b（简称rdt-1b）是一款基于扩散Transformer（Diffusion Transformer, DiT）​的双臂机器人操作基础模型，专为复杂双臂协调任务设计，是目前全球最大的双臂操作扩散模型之一。

目前百舸AI计算平台提供了 rdt-1b 模型的训练模版，内置训练代码和镜像，您可以在平台[分布式训练](https://console.bce.baidu.com/aihc/tasks)模块中，快速发起训练。



## 前置条件

### 算力和存储资源准备

#### 算力资源

下表给出了不同模型在百舸默认参数和数据集的情况下，训练所依赖的最低配置：

| 模型名称                              | 训练方式            | 训练资源配置  |
| :------------------------------------ | ------------------- | ------------- |
| robotics-diffusion-transformer/rdt-1b | Pretrain & Finetune | H800/A800*8卡 |

#### 存储资源

为保证训练的性能，推荐使用[并行文件存储PFS](https://cloud.baidu.com/product/pfs.html)。



### 数据准备

#### rdt-1b Pretrain

##### 多模态编码器准备

- ﻿`t5-v1_1-xxl`: [link](https://huggingface.co/google/t5-v1_1-xxl/tree/main)，可通过百舸平台的数据下载功能从huggingface导入并使用数据转储功能转存到PFS。
- ﻿`siglip`: [link](https://huggingface.co/google/siglip-so400m-patch14-384)，可通过百舸平台的数据下载功能从huggingface导入并使用数据转储功能转存到PFS。

百舸平台已经在对象存储BOS中预置上述编码器，方便用户使用。请参考[下载百舸平台预置的公共数据到PFS](https://cloud.baidu.com/doc/AIHC/s/Mmfjj3i9f)

```
t5-v1_1-xxl：
bos:/aihc-models-bj/robotics-diffusion-transformer/rdt-1b/google/t5-v1_1-xxl

siglip：
bos:/aihc-models-bj/robotics-diffusion-transformer/rdt-1b/google/siglip-so400m-patch14-384
```



##### 数据集准备

数据集要求：TFRecord格式，如果数据集不满足要求需要转换。

百舸平台已经在对象存储BOS中，预置训练数据集，方便用户快速开始。您可以从对应地域的BOS路径中下载数据。

```
bos:/aihc-rdw-bj/austin_sailor_dataset_converted_externally_to_rlds
```



##### 训练数据加载文件准备（可选）

根据需要自定义训练数据加载文件（L71和L72请不要修改），训练时修改`DATA_CONFIG`为该文件路径即可。

```
import tensorflow as tf

from data.utils import clean_task_instruction, euler_to_quaternion, rotation_matrix_to_ortho6d

def process_step(step: dict) -> dict:
    """
    Unify the action format and clean the task instruction.

    DO NOT use python list, use tf.TensorArray instead.
    """
    # Convert raw action to our action

    origin_action = step['action']
    step['action']={}
    action=step['action']
    action['terminate'] = step['is_terminal']

    eef_delta_pos = origin_action[:3]
    eef_ang=origin_action[3:6]
    eef_ang = euler_to_quaternion(eef_ang)
    # gripper_open: -1-open, 1-closed
    grip_open=tf.where(tf.equal(origin_action[6:],tf.constant(-1.0)),tf.constant(1.0),tf.constant(0.0))

    # No base found

    # Concatenate the action
    action['arm_concat'] = tf.concat([eef_delta_pos,eef_ang,grip_open],axis=0)

    # Write the action format
    action['format'] = tf.constant(
        "eef_delta_pos_x,eef_delta_pos_y,eef_delta_pos_z,eef_delta_angle_x,eef_delta_angle_y,eef_delta_angle_z,eef_delta_angle_w,gripper_open")

    # Convert raw state to our state
    state = step['observation']
    # Concatenate the state
    eef_mat = tf.transpose(tf.reshape(state['state'][8:], (4, 4)))
    eef_pos = eef_mat[:3, 3]
    rotaion_matrix = eef_mat[:3, :3]
    eef_ang = rotation_matrix_to_ortho6d(rotaion_matrix)
    joint_pos = state['state'][:7]
    grip_open = state['state'][7:8] * 12.5 # rescale to [0, 1]
    state['arm_concat'] = tf.concat([joint_pos,grip_open,eef_pos,eef_ang],axis=0)

    # Write the state format
    state['format'] = tf.constant(
        "arm_joint_0_pos,arm_joint_1_pos,arm_joint_2_pos,arm_joint_3_pos,arm_joint_4_pos,arm_joint_5_pos,arm_joint_6_pos,gripper_joint_0_pos,eef_pos_x,eef_pos_y,eef_pos_z,eef_angle_0,eef_angle_1,eef_angle_2,eef_angle_3,eef_angle_4,eef_angle_5")

    # Clean the task instruction
    # Define the replacements (old, new) as a dictionary
    replacements = {
        '_': ' ',
        '1f': ' ',
        '4f': ' ',
        '-': ' ',
        '50': ' ',
        '55': ' ',
        '56': ' ',
        
    }
    instr = step['language_instruction']
    instr = clean_task_instruction(instr, replacements)
    step['observation']['natural_language_instruction'] = instr

    return step


if __name__ == "__main__":
    import tensorflow_datasets as tfds
    from data.utils import dataset_to_path

    DATASET_DIR = 'data/datasets/openx_embod'
    DATASET_NAME = 'rdt_data'
    # Load the dataset
    dataset = tfds.builder_from_directory(
        builder_dir=dataset_to_path(
            DATASET_NAME, DATASET_DIR))
    dataset = dataset.as_dataset(split='all')

    # Inspect the dataset
    for episode in dataset:
        for step in episode['steps']:
            print(step)
```





#### rdt-1b Finetune

##### 数据集准备

用户数据集要求：HDF5格式，如果数据集不满足要求需要转换。

可使用官方数据集：https://huggingface.co/datasets/robotics-diffusion-transformer/rdt-ft-data

百舸平台已经在对象存储BOS中预置上述训练数据集，方便用户快速开始。您可以从对应地域的BOS路径中下载数据。

```
bos:/aihc-rdw-bj/rdt_ft_data
```

##### 多模态编码器准备

同pretrain 

##### 模型权重准备

百舸平台已经在对象存储BOS中预置模型权重，方便用户快速开始。您可以从对应地域的BOS路径中下载数据。

```
bos:/aihc-models-bj/robotics-diffusion-transformer/rdt-1b/ckpt/rdt-1b﻿
```



## 进行训练

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)。
2. 进入 **分布式训练** 列表页面，点击**创建任务**，填写任务配置信息：
   - 基础信息
     - 任务名称：输入您的自定义任务名称
     - 资源池&队列：选择已创建的资源池和队列
     - 优先级：默认 中 优先级，无需更改
     - 训练框架：选择Pytorch
     - 任务创建方式： 选择 基于开源模型训练模版创建 
     - 模型：选择对应的模型和训练方式
   - 环境配置
     - 镜像地址：无需更改，平台默认提供
     - 执行命令：系统已经默认训练的启动参数，需要替换`数据集`、`模型权重配置`等配置信息
     - 环境变量：无需更改
   - 资源配置
     - 实例数：这里我们选择的是rdt模型的微调，使用1台H800 8卡训练
     - 加速芯片：这里选择提前准备的GPU，单实例8卡
     - 共享内存：默认10Gi，pretrain训练，需要更新为80Gi
     - RDMA：默认开启，无需更改
   - 设置数据源
     - 存储类型：这里选择我们提前准备的PFS
     - PFS源路径：PFS的挂载路径，默认根目录，按实际情况填写
     - 挂载路径：容器内的挂载路径
3. 点击 **完成**，提交训练任务。

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_1628bae.png)



## 观察训练迭代

任务提交后，您可以通过任务日志观察训练的迭代情况

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_3e8cbea.png)





  
