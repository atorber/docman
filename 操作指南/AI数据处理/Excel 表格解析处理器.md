  

## 简介

Excel 表格解析处理器





### 功能描述

* 支持 xlsx/xls 格式解析
* 输出 markdown 或 html 格式
* 保留表格结构与数据关系
* 支持多工作表处理

## 算子参数

### 输入

| 输入     | 含义                       |
| -------- | -------------------------- |
| xlsx_col | 包含 xlsx/xls 文件路径的列 |

### 输出

| 输出          | 含义                                 |
| ------------- | ------------------------------------ |
| data_item_uri | 原始文件路径                         |
| text          | 合并后的 markdown/html 文本          |
| text_by_table | 每个 sheet 的 markdown/html 文本列表 |



### 参数

| 参数名称             | 类型 | 默认值 | 描述                                                         |
| -------------------- | ---- | ------ | ------------------------------------------------------------ |
| if_save_md_content   | bool | True   | 是否保存为 markdown 格式，默认 True                          |
| if_save_html_content | bool | False  | 是否保存为 html 格式，默认 False 当两者都为 True 时，仅保存 markdown |
| output_path          | str  |        | 处理后的文档输出位置                                         |





## 调用示例

```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.doc.xlsx_parse import XlsxParse

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import ray
        ray.init(dashboard_host="0.0.0.0", ignore_reinit_error=True)
        daft.set_runner_ray()
    daft.set_execution_config(actor_udf_ready_timeout=6000, min_cpu_per_task=0)

    samples = {
        "xlsx_path": [
            "file:///local/test_doc_01.xlsx",
            "file:///mnt/pfs/test_doc_02.xlsx",
            "file:///mnt/bos/test_doc_02.xlsx",
        ],
    }
    output_path = "file:///local/test_doc_output/",
    df = daft.from_pydict(samples)

    constructor_kwargs = {
        "if_save_md_content": True,
        "if_save_html_content": True,
        "output_path": output_path,
    }

    df = df.with_column(
        "result",
        aihc_udf(XlsxParse, construct_args=constructor_kwargs, concurrency=1)(col("xlsx_path")),
    )
    df = df.with_column("data_item_uri", col("result")["data_item_uri"])
    df = df.with_column("text", col("result")["text"])
    df = df.with_column("text_by_table", col("result")["text_by_table"])
    df.show()
```

