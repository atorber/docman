
robotics-diffusion-transformer/rdt-1b（简称rdt-1b）是一款基于扩散Transformer（Diffusion Transformer, DiT）​的双臂机器人操作基础模型，专为复杂双臂协调任务设计，是目前全球最大的双臂操作扩散模型之一。

目前百舸异构计算平台提供了 rdt-1b 模型的训练模版，内置训练代码和镜像，支持Pretrain & Finetune。
您可以在快速开始模块中，快速发起训练

### 算力资源
下表给出了不同模型在百舸默认参数和数据集的情况下，训练所依赖的最低配置：

| 模型名称 | 训练方式 | GPU资源 |
| --- | --- | --- | 
| robotics-diffusion-transformer/rdt-1b	 | Pretrain	 | 8卡，H800/A800等资源|
| robotics-diffusion-transformer/rdt-1b |Finetune  | 1-8卡，H800/A800等资源 |


### 数据集

#### Pretrain

1. 要求数据集为TFRecord格式，如果数据集不满足要求需要转换。
2. 平台已经预置 Austin Sailor Dataset 数据集，可以直接使用
3. 如选择自定义数据训练。根据配置数据加载文件。模版如下,请注意：L71和L72请不要修改

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



#### Finetune

1. 要求数据集为HDF5格式，如果数据集不满足要求需要转换。
2. 平台已经预置 [rdt-ft-data](https://huggingface.co/datasets/robotics-diffusion-transformer/rdt-ft-data) 数据集，可以直接使用




### 训练任务管理
任务提交后，你可以进入**分布式训练**列表页面，管理该任务，观察任务的训练迭代

