## 准备资源
可根据资源规模、稳定性、灵活性等要求，在**AI计算资源**中按需准备轻量计算实例或自运维资源池，用于快速部署opencompass。[AI计算资源](https://cloud.baidu.com/doc/AIHC/s/Xlzkvayzs)
## 部署opencompass
1. 在 **工具市场>工具模版** 中选择opencompass模版，点击** 部署工具** 按钮，完成快速部署。

![jietu-1732689075110.jpg](https://bce.bdstatic.com/doc/bce-doc/AIHC/jietu-1732689075110_af9bee2.jpg)

2. 根据模型开发调试需求，选择实例类型和加速芯片设置。点击** 确定 ** 启动工具。
## 通过浏览器访问opencompass
在** 我的工具 ** 中找到创建的工具，进入详情页。

![jietu-1732689372940.jpg](https://bce.bdstatic.com/doc/bce-doc/AIHC/jietu-1732689372940_ac3ca6b.jpg)

在详情页点击资源实例下的 **登录** ，选择 **JupyterLab** 访问地址即可访问

![jietu-1732689747046.jpg](https://bce.bdstatic.com/doc/bce-doc/AIHC/jietu-1732689747046_4fbd83d.jpg)

## 前置准备
### 模型和数据集准备
示例将以命令行的形式，给出对话模型Qwen2-1.5B-Instruct在C-EVAL下的评估。C-Eval是一个全面的中国基础模型评估套件。它由13948道多项选择题组成，涵盖52个不同学科和4个难度级别。

* **模型准备：**Qwen2.5-1.5B-Instruct需从modelscope或huggingface等自行下载，并导入容器实例的/root/opencompass/Qwen下；
* **数据集准备：**opencompass会自动下载评估过程中的部分预置数据集，详见https://github.com/open-compass/opencompass/blob/main/README.md。

### 环境准备
```shell
cd /root/opencompass
conda activate opencompass
# 数据集下载源
export DATASET_SOURCE=ModelScope
```
## 使用示例
### 模型和数据集配置查看
openCompass预置的模型和数据集可分别在configs/models和configs/datasets下找到。想查看某模型/数据集的配置文件时，以qwen系列为例，使用如下命令：
```shell
python tools/list_configs.py qwen
```
结果输出如下：

![image1.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image1_03ce148.png)

以configs/models/qwen/vllm_qwen2_1_5b_instruct.py为例，预置了模型路径、最大输出长度、batch大小等配置，如下所示：
```python
models = [
    dict(
        type=VLLMwithChatTemplate,
        abbr='qwen2-1.5b-instruct-vllm',
        path='Qwen/Qwen2-1.5B-Instruct',
        model_kwargs=dict(tensor_parallel_size=1),
        max_out_len=1024,
        batch_size=16,
        generation_kwargs=dict(temperature=0),
        run_cfg=dict(num_gpus=1),
    )
]
```
### 模型本地评测
执行如下命令：
```shell
python run.py --models hf_qwen2_1_5b_instruct --datasets ceval_gen --debug
```
在debug模式下，任务将按顺序执行，并实时打印输出，非必需。正常模式下，评估任务将在后台并行执行，其输出将被重定向到输出目录output/default/{TIMESTAMP}，任何后端任务失败都只会在终端触发警告消息。

评测完成后，opencompass会给出评测结果，详细的评测记录保存在目录outputs/default/{TIMESTAMP}下，如下所示：

![image2.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image2_24f9a3e.png)

![image3.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image3_efbc596.png)

### 部署后评测
仍然以Qwen2-1.5B-Instruct为例，
#### 推理服务实例A

使用如下命令部署vllm推理引擎：
```shell
export VLLM_USE_MODELSCOPE=True
# 用于控制内存分配的参数，可以帮助减少内存碎片化问题
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128
# 降低gpu_memory_utilization参数，可以限制 CUDA 图对显存的预分配，从而减少显存压力
export GPU_MEMORY_UTILIZATION=0.5

vllm serve Qwen/Qwen2-1.5B-Instruct --dtype auto --host 0.0.0.0 --port 3456 --served-model-name myQwen
```
部署成功后，终端可看到相关信息：

![image4.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image4_67b05b2.png)
#### 推理请求实例B
推理请求实例可部署在无可用cuda的环境下。

复制推理请求配置代码到configs/models/qwen/qwen_remote_test.py：
```python
from opencompass.models import OpenAISDK

api_meta_template = dict(
    round=[
        dict(role='HUMAN', api_role='HUMAN'),
        dict(role='BOT', api_role='BOT', generate=True),
    ],
    reserved_roles=[dict(role='SYSTEM', api_role='SYSTEM')],
)

models = [
    dict(
        abbr='Qwen2-1.5B-Instruct',
        type=OpenAISDK,
        key='EMPTY', # API key
        openai_api_base='http://192.168.0.4:3456/v1', # 服务内网IP
        path='myQwen', # 请求服务时的 model name
        tokenizer_path='Qwen/Qwen2-1.5B-Instruct', # 请求服务时的 tokenizer name 或 path, 为None时使用默认tokenizer gpt-4
        rpm_verbose=True, # 是否打印请求速率
        meta_template=api_meta_template, # 服务请求模板
        query_per_second=10, # 服务请求速率
        max_out_len=1024, # 最大输出长度
        max_seq_len=4096, # 最大输入长度
        temperature=0.01, # 生成温度
        batch_size=8, # 批处理大小
        retry=3, # 重试次数
    )
]
```
执行`python tools/list_configs.py qwen`验证是否已在配置文件中，

![image5.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image5_c73a411.png)

然后，执行如下命令启动评测：
```shell
python run.py --models qwen_remote_test --datasets ceval_gen --debug
```
出现类似如下输出表明推理请求执行成功：

![image6.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image6_3c47fa3.png)

评测完成后，详细的记录会保存在目录outputs/default/{TIMESTAMP}下。

### 数据并行推理加速评测
使用如下命令实现数据并行推理，以加速推理过程。实际的运行任务数受到可用GPU资源和max_num_workers的限制。
```shell
CUDA_VISIBLE_DEVICES=0,1 python run.py --models hf_qwen2_1_5b_instruct --datasets ceval_gen --max-num-workers 2
```
评测完成后，opencompass会给出评测结果，详细的评测记录保存在目录outputs/default/{TIMESTAMP}下。
### vllm推理引擎加速评测
使用如下命令利用推理引擎vllm，以加速推理过程。
```shell
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128
export GPU_MEMORY_UTILIZATION=0.5

python run.py --models hf_qwen2_1_5b_instruct --datasets ceval_gen --debug -a vllm
```
评测完成后，opencompass会给出评测结果，详细的评测记录保存在目录outputs/default/{TIMESTAMP}下。