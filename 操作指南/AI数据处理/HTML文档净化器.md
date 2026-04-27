
## 简介

HTML文档净化器: 去除文本中的 HTML 标签，只提取纯文本内容



### 功能描述

* 标题提取：自动识别`<h1>`-`<h6>`标签
* 正文抽取：智能识别文章主体内容
* 冗余过滤：移除`<script>`/`<style>`等非文本标签

## 算子参数

### 输入

| 输入  | 含义                                     |
| ----- | ---------------------------------------- |
| texts | 包含HTML内容的文本数组，元素类型为字符串 |

### 输出

| 输出         | 含义                               |
| ------------ | ---------------------------------- |
| cleaned_text | 清理后的文本数组，元素类型为字符串 |



### 参数

| 参数      | 类型 | 默认值 | 含义         |
| --------- | ---- | ------ | ------------ |
| separator | str  | \n     | 分隔符       |
| strip     | bool | True   | 是否去除空白 |



## 调用示例

```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.text.clean_html_tag import CleanHtmlTag

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import ray
        ray.init(dashboard_host="0.0.0.0", ignore_reinit_error=True)
        daft.set_runner_ray()
    daft.set_execution_config(actor_udf_ready_timeout=6000, min_cpu_per_task=0)

    samples = {
        "text": [
            """<!-- 这是 HTML 注释 -->
    <!DOCTYPE html>
    <html>
    <head>
        <!-- CSS -->
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <!--
            多行注释#1
            多行注释#2
            多行注释#3
        -->
        <div class="content" id="main-content">
            <p class="text">Hello World!</p>
        </div>
    </body>
    </html>""",
            None,
        ]
    }

    separator = "\n"
    strip = True
    ds = daft.from_pydict(samples)
    ds = ds.with_column(
        "cleaned_text",
        aihc_udf(
            CleanHtmlTag,
            construct_args={"separator": separator, "strip": strip},
        )(col("text")),
    )
    ds.show()
```


