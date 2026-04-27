
## 简介

将LeRobotV2.1格式数据集转换为LeRobotV3.0



### 功能描述

支持多个数据集粒度并行处理



## 输入

| 输入         | 含义                 |
| ------------ | -------------------- |
| input_repoid | 原始数据集repoid     |
| input_path   | 原始v2.1数据集path   |
| output_path  | 转换后v3.0数据集path |

## 输出

| 输入           | 含义                                                         |
| -------------- | ------------------------------------------------------------ |
| output_path    | 单个数据集转换后输出path                                     |
| convert_result | 数据集转换状态:SUCCESS: 成功转换SKIP: 跳过, 当前数据集已经是v3.0格式或已经有转换好的3.0格式数据集在output_path下FAILED: 转换失败 |

## 示例

```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.embodied.convert_dataset_v21_to_v30_udf import ConvertDatasetV21ToV30

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import ray
        ray.init(dashboard_host="0.0.0.0", ignore_reinit_error=True)
        daft.set_runner_ray()
    daft.set_execution_config(actor_udf_ready_timeout=6000, min_cpu_per_task=0)

    tasks = {
        "input_repoid": [
            "lerobot/aloha_sim_insertion_human/", 
            "lerobot/pusht/",
            "lerobot/pusht2/"   
        ],
        "input_path": ["/mnt/pfs/xxx/dataset/lerobot_v2/"] * 3,
        "output_path": ["/mnt/pfs/xxx/dataset/lerobot_v3_output/"] * 3
    }
    num_datasets = len(tasks)
 
    ds = daft.from_pydict(tasks)
    ds = ds.into_partitions(num_datasets)

    ds = ds.with_column(
        "convert_result",
        aihc_udf(
            ConvertDatasetV21ToV30,
            construct_args={
            },
            num_cpus=1,
            batch_size=1,
            concurrency=num_datasets,
            use_process=True
        )(col("input_repoid"), col("input_path"), col("output_path")),
    )

    ds.show()
```




## 使用方式

#### 基于ray框架: 

```
#启动命令
#v2tov3_udf.py 为以上的示例代码

#!/bin/bash
echo "Start Execution."
python /mnt/pfs/cxy/test/aihc/embodied_ai/v2_to_v3/v2tov3_opreator.py
echo "Execution completed."
```

#### 基于pytorch:

[使用百舸pytorch框架 执行算子](  
