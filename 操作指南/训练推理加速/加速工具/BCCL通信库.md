## 产品介绍

BCCL（Baidu Collective Communication Library）是基于百度 AI 网络定制的高性能集合通信库。BCCL 基于开源的 NCCL 进行扩展，关键特性如下：

- 集合通信操作性能优化
- 网络故障容错能力增强
- 支持集合通信 hang 时故障诊断能力
- 支持集合通信带宽实时统计功能

## 安装方法

1. 进入百舸控制台，点击左侧【AI加速套件】找到工具包，点击【获取地址】可以得到工具包的下载地址，使用wget下载工具包。

> 注意：以下示例中的地址需替换为从控制台获取的地址,具体版本以获得的安装包为准

```bash
# 下载工具
wget https://xxx.com/tools/bccl-1.x.x-x.x86_64.zip
```

2. 解压工具包，在bccl目录下有两个工具文件，按操作系统选择对应的工具包

```bash
# 先运行ls查看下载到.zip文件的具体名称，然后按文件名解压缩
unzip bccl-1.x.x-x.x86_64.zip
cd bccl-1.x.x-x.x86_64
```

- CentOS系统

```bash
rpm -ivh bccl-1.x.x-x.x86_64.rpm
```

- Ubuntu系统

```bash
dpkg -i bccl-1.x.x-x.x86_64.deb
```

> BCCL 需要安装在 `/usr/local/bccl`路径下

3. 切换使用 BCCL ，需要添加环境变量 `export LD_LIBRARY_PATH=/usr/local/bccl/lib:$LD_LIBRARY_PATH`



## 推荐环境变量配置

| 环境变量                                         | 变量说明                                                     |
| ------------------------------------------------ | ------------------------------------------------------------ |
| NCCL_DEBUG=INFO                                  | NCCL 日志级别。推荐 INFO                                     |
| NCCL_DEBUG_SUBSYS=INIT,ENV,GRAPH                 | NCCL 日志子系统配置                                          |
| NCCL_DEBUG_FILE=path/to/nccl.%h.%p               | NCCL 默认日志路径                                            |
| BCCL_ERROR_FILE=path/to/err.nccl.%h.%p           | 对 NCCL ERROR 日志重定向到新路径，以便快速检索分析           |
| BCCL_IB_CONNECT_RETRY_CNT=15                     | 增强任务初始化时网络连接容错能力。推荐取值：10 ~ 20          |
| BCCL_BUS_BW_CALCULATE_MODE=None/Verbose/Agg      | 带宽统计功能开关：None 表示关闭带宽统计功能<br>Verbose 表示打印带宽统计详细日志。每个集合通信操作对应一行日志<br>Agg 表示打印带宽统计聚合日志。配合 BCCL_BUS_BW_CALCULATE_AGG_INTERVAL 使用<br>default：None |
| BCCL_BUS_BW_CALCULATE_AGG_INTERVAL=15            | 带宽统计聚合功能 interval<br>表示统计 interval 时间内的集合通信带宽情况<br>default: 15s |
| BCCL_PROFILING_FILE=path/to/profiling.nccl.%h.%p | 不配置该环境变量时，带宽统计日志默认打印到 stdout            |
| BCCL_TRACE_HANG_ENABLE=1                         | - TraceHang 功能开关：任务 hang 时，通过下述方法触发 traceHang 日志信息打印：find /var/run/ -type s -name "bccl_socket_*" -exec sh -c 'echo "TraceHang" &#124; nc -U {}' \\;<br>- default value：0 |

## 特别说明

1. traceHang 开启后会额外占用约 2MB 的GPU 显存，这部分显存以统一内存（unified memory）进行分配，训练任务将显存打满时，不建议开启 traaceHang。如果训练任务将 GPU 显存打满，traceHang 在访问统一内存时，会因统一内存页无法调入 GPU 显存，出现非法内存访问，即 "CUDA error: an illegal memory access was encountered" 
2. traceHang 开启后，请不要再启动其他占用 GPU 显存的任务。原因：模型训练时，大部分时间在计算，通信占比很小，traceHang 申请的统一内存只有在通信时使用。统一内存在不使用时，会被调出 GPU 显存，使用时再调入。如果后台启动其他 GPU 任务，可能会导致 GPU 显存打满，而显存打满后，统一内存页无法调入 GPU 显存，访问该内存空间时出现非法内存访问，即 "CUDA error: an illegal memory access was encountered" 

## 测试工具

bccl_perf 是基于 nccl-tests 扩展的集合通信测试工具，提供更丰富的测试语义。

| 选项名称               | 是否需要参数 | 选项说明                                                     |
| ---------------------- | ------------ | ------------------------------------------------------------ |
| -O <collective_type>   | 是           | 指定需测试的通信操作，如allReduce、allGather、reduce、broadcast、reduceScatter、alltoall、sendRecv、gather、scatter |
| --split_mode           | 否           | 拆分多通信组测试。默认不开启                                 |
| --split_step           | 是           | 多通信组拆分策略，表明同一通信组 gpu rank 步长，默认为 1。例如，step=8 表示 gpu rank 0/8/16... 为一个通信组，gpu rank 1/9/17... 为一个通信组，以此类推 |
| -b <min size in bytes> | 是           | 测试所用最小 message size，与 nccl-tests 保持一致            |
| -e <max size in bytes> | 是           | 测试所用最大 message size，与 nccl-tests 保持一致            |
| -i <stepbytes>         | 是           | 最小到最大 message size 增长步长，与 nccl-tests 保持一致     |
| -f <stepfactor>        | 是           | 最小到最大message size增长的步长因子（倍数），与 nccl-tests 保持一致 |
| -n <iters>             | 是           | 测试迭代的次数，与 nccl-tests 保持一致                       |
| -w <warmup_iters>      | 是           | warmup 迭代次数，与 nccl-tests 保持一致                      |
| -t <nthreads>          | 是           | 每个进程起的线程数，与 nccl-tests 保持一致                   |
| -g <ngpus>             | 是           | 每个线程管理的 gpu 数，与 nccl-tests 保持一致                |
| -z <blocking>          | 是           | 阻塞 NCCL 集合通信，确保通信组所有进程均完成集合通信操作，与 nccl-tests 保持一致 |