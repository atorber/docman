## 适用场景 
为了确保分布式训练等依赖大规模并行计算的任务能高效、稳定运行，在启动任务前，可通过nccl-test来验证多GPU/多节点分布式系统中“集体通信”的性能与可靠性。

## 前置说明
### 全托管资源池
为了保证测试质量，建议创建一个专用于nccl-test的空队列，将需要进行nccl-test的节点移入该队列中，再在该队列上创建nccl-test分布式训练任务进行测试。

   ![全托管创建队列1.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%85%A8%E6%89%98%E7%AE%A1%E5%88%9B%E5%BB%BA%E9%98%9F%E5%88%971_8a90dad.png)![全托管节点加入队列.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%85%A8%E6%89%98%E7%AE%A1%E8%8A%82%E7%82%B9%E5%8A%A0%E5%85%A5%E9%98%9F%E5%88%97_d8679b6.png)

### 自运维资源池
对于新购入的节点，为了防止被自动归入默认队列被调用，需要在购入节点时开启封锁设置。
![封锁节点.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%B0%81%E9%94%81%E8%8A%82%E7%82%B9_d899c8d.png)

创建物理队列用于nccl-test，可指定节点加入该队列。

![自运维创建队列.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E8%87%AA%E8%BF%90%E7%BB%B4%E5%88%9B%E5%BB%BA%E9%98%9F%E5%88%97_13095f1.png)

注意：如果节点设置了封锁，加入该队列后须取消封锁设置。

![取消封锁节点.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%8F%96%E6%B6%88%E5%B0%81%E9%94%81%E8%8A%82%E7%82%B9_b395a48.png)

## 操作步骤

### 1. 创建分布式训练任务

您可以在百舸平台[分布式训练](https://console.bce.baidu.com/aihc/tasks)模块中，快速发起训练任务。nccl-test参数配置如下：

#### 1.1 基本信息

* 创建方式：选择“自定义创建”

![基本信息.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF_590d280.png)

#### 1.2 环境配置

* 镜像地址：registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310-bccl1.2.7.2_v2.1.5.1_release
* 执行命令为：
```
export OMPI_ALLOW_RUN_AS_ROOT=1
export OMPI_ALLOW_RUN_AS_ROOT_CONFIRM=1
export NCCL_DEBUG=INFO
export NCCL_IB_DISABLE=0

mpirun \
  -x UCX_NET_DEVICES=mlx5_1:1 \
  -x NCCL_IB_QPS_PER_CONNECTION=8 \
  -x LD_LIBRARY_PATH \
  -x NCCL_NET_PLUGIN=none \
  -x NCCL_IB_DISABLE=0 \
  -x NCCL_DEBUG=INFO \
  -x NCCL_ALGO=Ring \
  /usr/local/bin/all_reduce_perf_mpi -b 32M -e 16G -f 2 -g 1 -n 20
```
* 环境变量：执行命令中已设置，可跳过该配置

![环境配置.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE_793a805.png)

#### 1.3 资源配置
* 资源池类型：全托管资源池
* 队列：选择前面创建的nccl-test队列
* 优先级：按需选择
* 训练框架：选择 MPI
* 资源配额：填写nccl-test队列中全部的资源配额（为了对节点充分测试）
* RDMA：开启

![资源配置.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E8%B5%84%E6%BA%90%E9%85%8D%E7%BD%AE_8dddd20.png)
### 2. 分布式训练任务启动后查看日志结果
点击分布式训练任务名称，进入任务详情，切换到日志页面，选择launcher实例查看日志。通过日志中bus bandwidth的数值，判断节点性能。

![日志.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E6%97%A5%E5%BF%97_14d66b9.png)