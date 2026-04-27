  

**OpenPI（Open Physical Intelligence）** 是由Physical Intelligence团队开发的开源机器人基础模型项目，专注于**视觉-语言-动作（VLA）**的联合建模，旨在实现通用机器人控制。

目前百舸AI计算平台提供了openpi/π0及π0-fast 模型的训练模版，内置训练代码和镜像，您可以在平台[分布式训练](https://console.bce.baidu.com/aihc/tasks)模块中，快速发起训练。



## 前置条件

### 算力和存储资源准备

#### 算力资源

下表给出了不同模型在百舸默认参数和数据集的情况下，训练所依赖的最低配置：

| 模型名称       | 训练方式 | 训练资源配置  |
| :------------- | -------- | ------------- |
| openpi/π0      | Finetune | H800/A800*1卡 |
| openpi/π0-fast | Finetune | H800/A800*1卡 |

#### 存储资源

为保证训练的性能，推荐使用[并行文件存储PFS](https://cloud.baidu.com/product/pfs.html)。



### 数据准备

#### 数据集准备

可使用官方数据集：https://huggingface.co/datasets/openvla/modified_libero_rlds﻿

百舸平台已经在对象存储BOS中预置上述训练数据集。您可以从对应地域的BOS路径中下载数据。请参考[下载百舸平台预置的公共数据到PFS](https://cloud.baidu.com/doc/AIHC/s/Mmfjj3i9f)

```
bos:/aihc-rdw-bj/openpi/pi0-fast/data/modified_libero_rlds
```

#### 数据转换为LeRobot dataset

将自定义的数据集转换为LeRobot dataset。可以使用[官方脚本](https://github.com/Physical-Intelligence/openpi/blob/main/examples/libero/convert_libero_data_to_lerobot.py)进行转换。

百舸平台已经在对象存储BOS中预置转换后数据集，您可以从对应地域的BOS路径中下载数据.

```
bos:/aihc-rdw-bj/openpi/pi0-fast/data/libero
```

#### 准备数据映射文件和训练配置文件（可选）

如需要使用自定义的数据集微调模型，需要重新定义数据处理和训练的配置。以下Libero 数据集作为示例，您可以针对自己的数据集进行修改

- 定义从 Libero 环境到模型的数据映射的配置，[示例参考](https://github.com/Physical-Intelligence/openpi/blob/main/src/openpi/policies/libero_policy.py)，如需要自定义，可以在训练代码中指定`DATA_CONFIG`文件路径替换。

- 定义微调超参数、数据配置和权重加载器配置。如需要自定义，可以在训练代码中指定`TRAINING_CONFIG`文件即可

  config文件参考示例：

  ```
  bos:/aihc-rdw-bj/openpi/pi0-fast/training_config.py
  ```

  

#### 模型权重& tokenizer准备

百舸平台已经在对象存储BOS中预置模型权重,您可以从对应地域的BOS路径中下载数据。

openpi/π0 模型权重

```
bos:/aihc-models-bj/openpi/pi0/ckpt/pi0_base
```

openpi/π0-fast 模型权重

```
bos:/aihc-models-bj/openpi/pi0-fast/ckpt/pi0_fast_base
```

Tokenizer：

```
bos:/aihc-models-bj/openpi/pi0-fast/tokenizer/paligemma_tokenizer.model
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
     - 执行命令：系统已经默认训练的启动参数，需要替换`DATA_PATH`、`TRAINING_CONFIG`等配置信息
         - `DATA_PATH`:数据集的路径
         - `DATA_CONFIG`:如使用上述平台提供的libero数据集，这里则不填写，使用默认的DATA_CONFIG。如自定义数据集，则需要配置此文件
         - `TRAINING_CONFIG`:如使用平台预置的数据集、训练配置等，无需填写，使用默认的TRAINING_CONFIG；如需要自定义更多的训练参数等配置，则需要配置此文件
         - `TRAINING_CONFIG_NAME`:如使用上述平台提供的libero数据集，则无需填写；如自定义数据集，则需要自定义填写
         - `PALIGEMMA_TOKENIZER_PATH`: 模型的tokenizer路径
         - `REPO_ID`:如使用上述平台提供的libero数据集，则无需填写；如自定义数据集，则需要自定义填写
         - `BASE_CHECKPOINT_LOAD_PATH`:模型原始权重的路径
         - `CHECKPOINT_SAVE_BASEDIR`:模型训练后权重的保存路径
         - `CHECKPOINT_SAVE_INTERVAL`:模型训练权重的保存间隔，如1000
     - 环境变量：无需更改
   - 资源配置
     - 实例数：这里我们选择的是openpi模型的微调，使用H800训练
     - 加速芯片：这里选择提前准备的GPU，单实例1/8卡
     - 共享内存：默认10Gi
     - RDMA：默认开启，无需更改
   - 设置数据源
     - 存储类型：这里选择我们提前准备的PFS
     - PFS源路径：PFS的挂载路径，默认根目录，按实际情况填写
     - 挂载路径：容器内的挂载路径
3. 点击 **完成**，提交训练任务。
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_da57701.png)




## 观察训练迭代

任务提交后，您可以通过任务日志观察训练的迭代情况
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_c51a93e.png)






  
