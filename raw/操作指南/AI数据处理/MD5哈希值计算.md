 

## 简介

MD5哈希值计算器



### 功能描述

* 针对每条文本数据生成对应的MD5哈希值
* 输出固定长度（32位小写十六进制）指纹
* 支持批量处理

## 算子参数

### 输入

| 输入列名 | 说明                                 |
| -------- | ------------------------------------ |
| text     | 待处理的文本列，要求元素类型为字符串 |

### 输出

| 输出     | 含义           | 示例 |
| -------- | -------------- | ---- |
| md5_hash | 计算后的哈希值 |      |





## 调用示例

```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.text.md5_calculator import Md5Calculator

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import ray
        ray.init(dashboard_host="0.0.0.0", ignore_reinit_error=True)
        daft.set_runner_ray()
    daft.set_execution_config(actor_udf_ready_timeout=6000, min_cpu_per_task=0)

    samples = {
        "text": [
            'Hello, World!',
            "Hello, World !",
            'Hello,World!',
        ]
    }

    ds = daft.from_pydict(samples)
    ds = ds.with_column(
        "md5_hash",
        aihc_udf(Md5Calculator)(col("text")),
    )

    ds.show()
```


