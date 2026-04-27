Ray 是一款专为 AI 工作负载打造的开源分布式计算框架，能够统一基础设施，高效管理、执行和优化从数据处理、模型训练到模型服务的全流程 AI 计算需求，凭借对 Python 的天然友好性，让算法开发者可轻松在集群上扩展应用程序与机器学习工作负载。

百舸平台为用户提供了开箱即用的 Ray 环境，您无需进行任何的代码更改或调整任何资源，只需要使用预置的 Ray 镜像或者使用携带包含 Ray Runtime 的自定义镜像，提供入口命令（entrypoint）与依赖定义，即可一键运行 Ray 作业，平台会自动创建并管理 Ray 集群，完成节点检查、资源调度、日志与指标采集，并提供 Dashboard。

## 功能限制

1. 暂不支持容错&诊断，支持 Ray 原生的自动重试
2. Ray Dashboard 中 Metrics 功能的启用需要用户对接自己的 Grafana。可参考[自定义监控指标采集](https://cloud.baidu.com/doc/AIHC/s/imkayh3wr)实现 Ray Metrics 采集和监控。

## 准备工作

### 准备训练镜像

Ray 集群由 Head 管理节点与 Worker 计算节点两类核心节点构成。百舸将基于您指定的统一镜像，分别构建 Head 节点与 Worker 节点容器，自动完成 Ray 集群的部署与初始化；待集群就绪后，系统将自动启动一个同镜像的 Submitter 节点用于提交脚本，向该 Ray 集群提交您的脚本。

Ray 版本支持范围：平台已对Ray 2.7~2.49 版本完成验证，更高版本暂未验证

1. 使用百舸官方 Ray 镜像：百舸已经预置 Ray 官方镜像，您可以直接使用

![image-20260408143827127.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20260408143827127_41393b2.png)

2. 使用自定义的镜像：需要镜像中包含 Ray[default]关键依赖，建议您基于百舸预置的 Ray 镜像构建自定义的镜像



### 准备启动命令和训练脚本

百舸训练任务的执行命令，会被用作`ray job submit` 所提交的`entrypoint`命令。启动命令可以填写多行或单行，无需在执行命令里写 `ray start` 或 `ray job submit `。

例如 `python /workspace/sample.py`，其中`sample.py`为运行的Python脚本文件。示例内容如下

```
import ray
import os
import requests

ray.init()


@ray.remote
class Counter:
    def __init__(self):
        # Used to verify runtimeEnv
        self.name = os.getenv("counter_name")
        self.counter = 0

    def inc(self):
        print(f"current counter {self.counter} counter_name from runtimeENV is {self.name}")
        import time
        time.sleep(1)
        self.counter += 1

    def get_counter(self):
        return "{} got {}".format(self.name, self.counter)


counter = Counter.remote()

for _ in range(50000):
    ray.get(counter.inc.remote())
    print(ray.get(counter.get_counter.remote()))
```



## 使用步骤

### 提交 Ray 任务

1. 登录[百舸AI计算平台AIHC控制台](https://console.bce.baidu.com/aihc/resources)； 
2. 进入**训练任务**列表页面，点击**创建任务**。  
3. 在新建任务页面配置以下关键参数：

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
            text-align: left;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px 15px;
            vertical-align: top;
        }
        th {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>

<table border="1" cellpadding="6" cellspacing="0" style="width:100%; border-collapse:collapse;">
  <tr>
    <th colspan="2">参数</th>
    <th>说明</th>
  </tr>
  <tr>
    <!-- 合并：环境信息 + 执行命令 共用 1 个单元格 -->
    <td rowspan="2">环境信息<br/></td>
    <td>镜像地址</td>
    <td>可以选择百舸预置的 Ray 镜像，也可以使用自定义镜像</td>
  </tr>
  <tr>
    <td>执行命令</td>
    <td>本任务需要执行的命令。如 python /workspace/sample.py </td>
  </tr>
  <tr>
    <!-- 合并：资源配置 3 行共用 1 个单元格 -->
    <td rowspan="3">资源配置</td>
    <td>训练框架</td>
    <td>选择 Ray</td>
  </tr>
  <tr>
    <td>计算资源</td>
    <td>
      可配置任务的节点类型为 Head 和 Worker。
      <ul>
        <li>Head 节点个数限制为 1，仅用于运行entrypoint脚本。</li>
        <li>支持自定义 Worker 类型名称，支持设置多组 Worker。</li>
        <li>每个 Ray 任务会自动生成一个 Submitter 节点执行启动命令，可以通过 Submitter 节点查看任务运行日志。</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>RuntimeENV</td>
    <td>RuntimeEnv用于动态安装Ray任务所需的软件依赖、配置环境变量或工作目录等，详见<a href="https://docs.ray.io/en/latest/ray-core/handling-dependencies.html#runtime-environments" target="_blank">Ray官方文档</a>，<br/>在生产环境中，建议使用已经打包好的镜像来执行任务，避免因为临时安装依赖库造成的任务失败。</td>
  </tr>
</table>

### 日志&监控

平台提供任务运行日志以及 Ray 集群系统日志的查询，可通过 submitter 节点的标准输出查询任务运行日志，可通过 Head/Worker 节点的文本日志查询 Ray 集群的系统日志

Ray Metrics 支持通过[自定义监控指标采集](https://cloud.baidu.com/doc/AIHC/s/imkayh3wr) 对接 Cprom实现指标采集 & 查询



## 常见问题

### 我还需要在执行命令中写 ray start 或 ray job submit 吗？

不需要。

在平台提交 Rayjob 时：

- 平台会在 **Head 节点** 容器内自动执行 `ray start --head ...` 启动 Ray 集群；

- 在 **Worker 节点** 容器内自动执行 `ray start --address=＜head-service＞:6379 --block` 将 Worker 加入集群；

- Ray集群就绪后，系统将自动启动一个 Submitter 节点用于向 Ray 集群提交脚本。

  

### 1 个Rayjob 会创建几个 Ray 集群，集群什么时候销毁

1 个 Rayjob 对应 1 个 独立的 Ray 集群。Rayjob结束之后，对应的 Ray 集群会自动销毁。





### Rayjob 结束之后，是否可以查询 Ray Dashboard

目前仅支持在Rayjob 处于运行中的状态，查看 Ray Dashboard。Rayjob 结束后支持 Ray dashboard 在功能开发中，敬请期待。
