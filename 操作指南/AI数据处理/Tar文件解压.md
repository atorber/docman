
## 简介

解压tar文件算子



### 功能描述

tar文件解压, 支持批量处理





## 输入

| 输入      | 含义                                                         | 默认值 |
| --------- | ------------------------------------------------------------ | ------ |
| base_path | 支持传入base_path目录, 该目录下有多个子目录, 每个子目录有若干tar文件, 配合discover_datasets和create_tasks_from_datasets方法可便捷的将多个子目录数据集创建为多个task, 并发执行 | 无     |
|           |                                                              |        |

## 输出

| 输入        | 含义                                             |      |
| ----------- | ------------------------------------------------ | ---- |
| output_path | 解压后目录输出                                   |      |
| result      | 数据集转换状态:SUCCESS: 解压成功FAILED: 解压失败 |      |



## 调用示例


```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.process.tar_extractor_udf import TarUncompress
from daft.aihc.functions.process.tar_extractor_udf import discover_datasets
from daft.aihc.functions.process.tar_extractor_udf import create_tasks_from_datasets

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import ray
        ray.init(dashboard_host="0.0.0.0", ignore_reinit_error=True)
        daft.set_runner_ray()
    daft.set_execution_config(actor_udf_ready_timeout=6000, min_cpu_per_task=0)

    base_path = "/path/dataset/lerobot/"
    datasets = discover_datasets(base_path, None, None)
    tasks = create_tasks_from_datasets(datasets)
    num_datasets = len(datasets)

    ds = daft.from_pydict(tasks)
    ds = ds.into_partitions(num_datasets)
    
    ds = ds.with_column(
        "result",
        aihc_udf(
            TarUncompress,
            construct_args={
            },
            num_cpus=1,
            num_gpus=0,
            batch_size=1,
            concurrency=num_datasets,
            use_process=True,
        )(col("input_path"), col("output_path")),
    )
    ds.show()
```
