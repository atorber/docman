

## 简介

BOS 预签名 URL 生成处理器

### 功能描述

* 签名生成机制：基于对象存储BOS SDK 生成带时效性的预签名 URL
* URL schema 处理：
  * 原生支持 BOS/S3 协议路径的签名转换
  * 自动跳过包含 HTTP/HTTPS 协议的路径

* 安全控制：
  * 可配置签名有效期（默认 3600 秒）


## 算子参数

### 输入

| 输入 | 含义                                                        |
| ---- | ----------------------------------------------------------- |
| url  | BOS路径：string 类型，支持以下格式：bos://{bucket}/{object} |

### 输出

| 输出       | 含义          |
| ---------- | ------------- |
| signed_url | BOS预签名 URL |



### 参数

| 参数     | 类型 | 含义                                                         | 默认值 |
| -------- | ---- | ------------------------------------------------------------ | ------ |
| expires: | int  | 控制签名有效期（单位：秒），过短可能导致业务中断，过长存在安全风险 | 3600   |



## 调用示例

```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.text.pre_sign_url_for_bos import PreSignUrlForBOS

os.environ["BOS_ENDPOINT"] = "bj.bcebos.com"
os.environ["BOS_ACCESS_KEY_ID"] = "xxx"
os.environ["BOS_SECRET_ACCESS_KEY"] = "xxx"
os.environ["BOS_REGION"] = "bj"

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import ray
        ray.init(dashboard_host="0.0.0.0", ignore_reinit_error=True)
        daft.set_runner_ray()
    daft.set_execution_config(actor_udf_ready_timeout=6000, min_cpu_per_task=0)

    samples = {"url": [f"bos://test-bj-bucket/sample.mp4"]}

    ds = daft.from_pydict(samples)
    ds = ds.with_column(
        "signed_url",
        aihc_udf(
            PreSignUrlForBOS,
            construct_args={
                "expires": 3600,
            },
        )(col("url")),
    )
    ds.show()
```


