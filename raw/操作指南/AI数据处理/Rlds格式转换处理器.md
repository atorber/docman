  


### 简介

将常用的 Open X-Embodiment (OXE) 标准的 RLDS 数据集转换为 LeRobot v3.0 格式

### 功能描述

* 将 Open X-Embodiment (OXE) 标准的 RLDS 数据集转换为 LeRobot v3.0 格式
* 支持按 split 数量自动划分 episode 范围，分布式并行转换
* 自动从 OXE_DATASET_CONFIGS 推导 fps、robot_type、version 等参数
* 支持视频编码（SVT-AV1）和图像模式
* 每次转换前清理旧目录，保证数据一致性
* 提供独立的 `merge_splits` 函数，将多个 split 结果合并为完整数据集

### 已知限制

* **仅支持 OXE 标准的 RLDS 数据集**：数据集需符合 Open X-Embodiment 的 episode/steps 结构，包含 `observation`、`action`、`language_instruction` 字段
* **仅读取 train split**：TFDS 数据源固定使用 `train` split（`builder.as_dataset(split="train[start:end]")`），不支持 val/test
* **深度图像不转换**：图像 key 过滤规则为包含 `image` 或 `rgb` 且不包含 `depth`，深度通道会被跳过
* **状态维度固定为 8**：proprio 向量拼接为 8 维，缺失的 key 用零填充
* **单 episode 全量加载**：每个 episode 的所有 steps 通过 `.batch(cardinality())` 一次性加载到内存，单个 episode 步数过多或图像分辨率过高时可能导致内存压力
* **视频编码为软件编码**：使用 SVT-AV1 软件编码器（libsvtav1），不支持 GPU 硬件加速
* **split 合并需单独调用**：算子只负责分片转换，合并步骤需在 `ds.show()` 之后显式调用 `merge_splits`
* **重跑会清除旧数据**：每次转换前自动删除对应 split 输出目录，不支持断点续传
* **不支持 ArrayRecord 格式**：仅支持 TFRecord 格式的 RLDS 数据集。TFDS 新版引入的 ArrayRecord 存储格式无法读取，需先转换为 TFRecord 或使用 TFRecord 版本的数据

## 输入

| 输入      | 含义                      | 样例          |
| --------- | ------------------------- | ------------- |
| split_idx | 当前分片索引（从 0 开始） | [0, 1, 2, ..] |



## 输出

| 输入           | 含义           |                                              |
| -------------- | -------------- | -------------------------------------------- |
| convert_result | 转换结果字符串 | SUCCESS:/path/to/output_split_0:120.5s       |
|                |                | FAILED:/path/to/output_split_1:error message |

#### 构造参数（construct_args）

| 参数                     | 类型   | 含义                                            | 默认值                |
| ------------------------ | ------ | ----------------------------------------------- | --------------------- |
| `dataset_name`           | `str`  | RLDS 数据集名称                                 | **必填**              |
| `data_dir`               | `str`  | RLDS 数据集所在目录（tfds builder 的 data_dir） | **必填**              |
| `output_path`            | `str`  | 转换输出目录路径                                | **必填**              |
| `num_splits`             | `int`  | 并行分片数量                                    | **必填**              |
| `version`                | `str`  | 数据集版本号，空字符串则自动探测                | `""`                  |
| `repo_id`                | `str`  | HuggingFace repo ID                             | 默认同 `dataset_name` |
| `fps`                    | `int`  | 帧率，None 则从 OXE_DATASET_CONFIGS 获取        | `None`（自动）        |
| `robot_type`             | `str`  | 机器人类型，None 则从 OXE_DATASET_CONFIGS 获取  | `None`（自动）        |
| `use_videos`             | `bool` | 是否将图像编码为视频                            | `True`                |
| `image_writer_processes` | `int`  | 图像/视频写入进程数                             | `5`                   |
| `image_writer_threads`   | `int`  | 图像/视频写入线程数                             | `10`                  |

#### merge_splits 函数参数

| 参数          | 类型   | 含义                             | 默认值   |
| ------------- | ------ | -------------------------------- | -------- |
| `output_path` | `str`  | 合并后的输出目录（与转换时一致） | **必填** |
| `repo_id`     | `str`  | HuggingFace repo ID              | **必填** |
| `num_splits`  | `int`  | 分片数量（与转换时一致）         | **必填** |
| `cleanup`     | `bool` | 合并后是否删除 split 子目录      | `True`   |

## 示例

```
from __future__ import annotations

import os
import daft
from daft import col

from daft.aihc.common.udf import aihc_udf
from daft.aihc.functions.embodied.convert_rlds_to_lerobot_udf import ConvertRldsToLerobot

os.environ["DAFT_RUNNER"] = "ray"

if __name__ == "__main__":
    if os.getenv("DAFT_RUNNER", "native") == "ray":
        import logging
        import ray

        try:
            ray.init(address="auto", ignore_reinit_error=True)
        except ConnectionError:
            ray.init(ignore_reinit_error=True)

    daft.set_execution_config(
        actor_udf_ready_timeout=6000,
        min_cpu_per_task=0,
    )

    # === 配置 ===
    DATASET_NAME = "cmu_play_fusion"
    DATA_DIR = "/mnt/pfs/data/oxe/"
    OUTPUT_PATH = "/mnt/pfs/data/v3_output/cmu_play_fusion_lerobot"
    NUM_SPLITS = 5

    # 输入: split_idx 列表
    tasks = {
        "split_idx": list(range(NUM_SPLITS)),
    }

    ds = daft.from_pydict(tasks)
    ds = ds.into_partitions(NUM_SPLITS)

    ds = ds.with_column(
        "convert_result",
        aihc_udf(
            ConvertRldsToLerobot,
            construct_args={
                "dataset_name": DATASET_NAME,
                "data_dir": DATA_DIR,
                "output_path": OUTPUT_PATH,
                "num_splits": NUM_SPLITS,
                "use_videos": True,
                "image_writer_processes": 5,
                "image_writer_threads": 10,
            },
            num_cpus=1,
            batch_size=1,
            concurrency=NUM_SPLITS,
            use_process=True,
        )(col("split_idx")),
    )

    ds.show()

    # === 合并所有 split 子集 ===
    if NUM_SPLITS > 1:
        from daft.aihc.functions.embodied.convert_rlds_to_lerobot_udf import merge_splits
        merge_splits(
            output_path=OUTPUT_PATH,
            repo_id=DATASET_NAME,
            num_splits=NUM_SPLITS,
            cleanup=True,
        )
```

