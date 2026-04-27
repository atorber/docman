## 背景信息

BCCL（Baidu Collective Communication Library）是基于百度AI网络定制的高性能集合通信库。BCCL基于开源的 NCCL 进行扩展，关键特性如下：

* 集合通信操作性能优化
* 网络故障容错能力增强
* 支持集合通信 hang 时故障诊断能力
* 支持集合通信带宽实时统计功能

## 安装 BCCL
### 下载并安装BCCL库
#### CentOS系统
```
wget https://cce-ai-aihc.bj.bcebos.com/BCCL/Release/bccl-1.2.3-1.x86_64.rpm
rpm -ivh bccl-1.2.3-1.x86_64.rpm
```
#### Ubuntu系统
```
wget https://cce-ai-aihc.bj.bcebos.com/BCCL/Release/bccl-1.2.3-1.amd64.deb
dpkg -i bccl-1.2.3-1.amd64.deb
```
## 推荐配置BCCL环境变量


| 环境变量                               | 变量说明                                            |
|----------------------------------------|-----------------------------------------------------|
| NCCL_DEBUG=INFO                        | NCCL 日志级别。推荐 INFO                            |
| NCCL_DEBUG_SUBSYS=INIT,ENV,GRAPH       | NCCL 日志子系统配置                                 |
| NCCL_DEBUG_FILE=path/to/nccl.%h.%p     | NCCL 默认日志路径                                   |
| BCCL_ERROR_FILE=path/to/err.nccl.%h.%p | 对 NCCL ERROR 日志重定向到新路径，以便快速检索分析  |
| BCCL_IB_CONNECT_RETRY_CNT=15           | 增强任务初始化时网络连接容错能力。推荐取值：10 ~ 20 |
| BCCL_BUS_BW_CALCULATE_MODE=None/Verbose   |带宽统计功能开关：<br> 1、None 表示关闭带宽统计功能<br>  2、Verbose 表示打印详细带宽统计功能 <br> 3、default：None |
| BCCL_PROFILING_FILE=path/to/profiling.nccl.%h.%p | 不配置该环境变量时，带宽统计日志默认打印到 stdout |
| BCCL_TRACE_HANG_SIGNAL=10  | TraceHang 功能开关：<br>1、配置 TraceHang 触发 signal 为 10<br>2、任务 hang 时，所有进程执行 kill -10 \`pidof xxx` <br> 3、default value：-1 (关闭 TraceHang 功能)  |

## 使用bccl_perf

bccl_perf 是基于 nccl-tests 扩展的集合通信测试工具，提供更丰富的测试语义。


| 选项名称               	| 是否需要参数 	| 选项说明                                                                                                                                               	|
|------------------------	|--------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------	|
| -O &lt;collective_type>   	| 是           	| 指定需测试的通信操作，如allReduce、allGather、reduce、broadcast、reduceScatter、alltoall、sendRecv、gather、scatter                                    	|
| --split_mode           	| 否           	| 拆分多通信组测试。默认不开启                                                                                                                           	|
| --split_step           	| 是           	| 多通信组拆分策略，表明同一通信组 gpu rank 步长，默认为 1。例如，step=8 表示 gpu rank 0/8/16... 为一个通信组，gpu rank 1/9/17... 为一个通信组，以此类推 	|
| -b &lt;min size in bytes> 	| 是           	| 测试所用最小 message size，与 nccl-tests 保持一致                                                                                                      	|
| -e &lt;max size in bytes> 	| 是           	| 测试所用最大 message size，与 nccl-tests 保持一致                                                                                                      	|
| -i &lt;stepbytes>         	| 是           	| 最小到最大 message size 增长步长，与 nccl-tests 保持一致                                                                                               	|
| -f &lt;stepfactor>        	| 是           	| 最小到最大 message size增长的步长因子（倍数），与 nccl-tests 保持一致                                                                                  	|
| -n &lt;iters>             	| 是           	| 测试迭代的次数，与 nccl-tests 保持一致                                                                                                                 	|
| -w &lt;warmup_iters>      	| 是           	| warmup 迭代次数，与 nccl-tests 保持一致                                                                                                                	|
| -t &lt;nthreads>          	| 是           	| 每个进程起的线程数，与 nccl-tests 保持一致                                                                                                             	|
| -g &lt;ngpus>             	| 是           	| 每个线程管理的 gpu 数，与 nccl-tests 保持一致                                                                                                          	|
| -z &lt;blocking>          	| 是           	| 阻塞 NCCL 集合通信，确保通信组所有进程均完成集合通信操作，与 nccl-tests 保持一致                                                                       	|