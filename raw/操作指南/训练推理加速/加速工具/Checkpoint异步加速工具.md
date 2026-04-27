  
## 产品介绍
Checkpoint异步加速工具是基于Megatron训练框架，利用模型信息转储、模型对象反序列化等技术，近0开销的模型保存机制，实现大模型训练全过程精度无损的模型保存与恢复。
## 如何使用
### 使用限制
1）内存占用：单机所有GPU卡的Checkpoint内存会优先保存在内存，因此对于千亿参数规模模型建议预留200G内存以上。

2）框架支持：当前仅支持Megatron训练框架（<= 23.04版本），Pytorch/DeepSpeed支持中。

3）保存间隔：设置不能过小，建议大于30分钟（过小会导致异步Checkpoint耗时变长，目的是防止Checkpoint重入）。
### 通过代码包使用
AIAK镜像中已内置该工具，在AIAK中使用详见AIAK镜像使用说明

1. 进入百舸控制台，点击左侧【AI加速套件】找到工具包，点击【获取地址】可以得到工具包的下载地址，在容器镜像中先使用wget下载

> 注意：以下示例中的地址需替换为从控制台获取的地址

```bash
wget https://cce-ai-aihc.bj.bcebos.com/Checkpoint/aiak_tool_ckpt.zip
```

1. 解压

```bash
# 解压缩工具，注意查看.zip的文件名可能与示例中不一致
unzip aiak_tool_ckpt.zip
cd aiak_tool_ckpt
# 得到两个程序包AIDK_CentOS7-0.1.0-py3-none-any.whl、AIDK_Ubuntu20-0.1.0-py3-none-any.whl根据使用的系统选择
```

1. 安装加速包（以Ubuntu20为例）

```bash
pip3 install AIDK_Ubuntu20-0.1.0-py3-none-any.whl
```

1. 代码导入加速包，只需要修改2行代码
   1. 替换megatron的Checkpoint接口
   2. 在最后一次Checkpoint结束后，调用finish_checkpoint_process()通知Checkpoint，确保最后一次Checkpoint正常结束。

![ckpt1.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/ckpt1_4650c26.png)

### 观察效果
任务启动后，可以通过查询rank0的日志获取ckpt信息

![ckpt2.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/ckpt2_a05caa8.png)

未开启Checkpoint加速的日志对比

![ckpt3.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/ckpt3_8405b47.png)

## 参数说明
| **字段** | **解释** |
| --- | --- |
| **async save checkpoint at 6** | 当前Checkpoint采用的是异步Checkpoint，保存的是iteration 6. |
| **memory used** | 统计当前内存使用情况（系统整体内存使用情况，仅供参考） |
| **start timestamp** | 本次Checkpoint的开始时间戳 |
| **end timestamp** | 本次Checkpoint的结束时间戳（不包括Checkpoint保存到存储的时间） |
| **cost time** | 本次Checkpoint接口调用的总耗时（不包括Checkpoint保存到存储的时间） |

