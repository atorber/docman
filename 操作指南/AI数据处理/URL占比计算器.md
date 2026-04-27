  

## 简介

URL占比计算器 - 基于URL字符占比的文本特征提取



### 功能描述

* URL占比计算：精确统计URL字符在文本中的占比
* 多协议支持：支持HTTP、HTTPS等多种URL协议
* 智能识别：使用正则表达式精确识别URL格式

## 算子参数

### 输入

| 输入 | 含义                                 |
| ---- | ------------------------------------ |
| text | 待处理的文本列，要求元素类型为字符串 |

### 输出

| 输出      | 含义                                        |
| --------- | ------------------------------------------- |
| url_ratio | 占比结果列，元素为浮点数，表示URL字符的占比 |



## 调用示例

```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.text.url_ratio_calculator import UrlRatioCalculator

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import ray
        ray.init(dashboard_host="0.0.0.0", ignore_reinit_error=True)
        daft.set_runner_ray()
    daft.set_execution_config(actor_udf_ready_timeout=6000, min_cpu_per_task=0)

    samples = {
        "text": [
            "今天天气很好",
            "请访问 https://baidu.com 获取更多信息",
            "官网 http://example.com 和镜像站 https://mirror.example.org 均可访问",
            "这段文字中没有任何链接",
            "联系我们：https://contact.us 或发邮件至 support@test.com",
            "http://a.com https://b.com https://c.com 三个链接",
            "",
        ]
    }

    ds = daft.from_pydict(samples)
    ds = ds.with_column(
        "url_ratio",
        aihc_udf(
            UrlRatioCalculator,
            construct_args={},
        )(col("text")),
    )
    ds.show()
```
