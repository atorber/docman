## 安装SDK工具包

### 运行环境
在开始安装前，请确保您的系统满足以下要求：
- **Python 版本**：SDK 当前仅支持 Python 3。为确保兼容性和安全性，我们强烈建议使用 **Python 3.7 或更高版本**的稳定发行版。
- **SDK 版本**：请确保安装的 SDK 版本大于 `0.9.50`，以包含您所需的功能和最新的安全更新。

> **提示**：您可以在命令行中运行 `python --version`（或 `python3 --version`）来检查您当前的 Python 版本。

### 安装SDK

您可以选择以下两种方式之一进行安装。我们**推荐使用 pip 源安装**，这是最简便的方法。

#### 方式一：pip源安装（推荐）
1.  打开终端/命令提示符。
2.  执行以下命令即可完成安装：
    ```bash
    pip install bce-python-sdk>0.9.50
    ```

#### 方式二：从SDK中心下载，手动安装
**安装步骤**

1.  **从SDK中心下载代码**：
    从百度智能云官方网站的[SDK中心](https://cloud.baidu.com/doc/Developer/index.html?sdk=python)下载Python SDK的源代码压缩包（`.zip`格式），并将其解压到您选择的本地目录。

2.  **打开终端/命令提示符**：
    打开命令行工具（如 Terminal、CMD 或 PowerShell），然后使用 `cd` 命令切换到 SDK 代码所在的根目录。该目录下应包含 `setup.py` 文件和 `baidubce` 文件夹。

3.  **执行安装命令**：
    在命令行中运行以下命令，该命令会自动处理所有依赖并完成安装：
    ```bash
    python setup.py install
    ```

#### 验证安装

无论使用哪种安装方式，安装完成后，都建议进行验证以确保SDK已正确安装。

1.  打开 Python 解释器或创建一个新的 Python 脚本文件。
2.  尝试导入 `baidubce` 模块：
    ```python
    # 在 Python 交互界面或脚本中运行
    import baidubce
    ```
3.  如果命令行没有报错，并成功打印出提示信息，则说明 SDK 已经准备就绪。

现在，您可以开始使用百度智能云 Python SDK 进行开发了。请参考官方文档获取详细的使用方法和示例代码。

### SDK目录结构
```plain
python/
├── baidubce/services/aihc/              # AIHC核心SDK模块
│   ├── base/                           # 基础模块
│   │   ├── __init__.py
│   │   ├── aihc_base_client.py        # 基础客户端类
│   │   └── aihc_common.py             # 公共工具函数
│   ├── modules/                        # 业务模块目录
│   │   ├── dataset/                   # 数据集模块
│   │   │   ├── __init__.py
│   │   │   ├── dataset_client.py      # 数据集相关接口
│   │   │   └── dataset_model.py       # 数据集模型定义
│   │   ├── job/                       # 训练任务模块
│   │   │   ├── __init__.py
│   │   │   ├── job_client.py          # 任务相关接口
│   │   │   └── job_model.py           # 任务模型定义
│   │   ├── resource_pool/             # 资源池模块
│   │   │   ├── __init__.py
│   │   │   └── resource_pool_client.py # 资源池相关接口
│   │   └── service/                   # 在线推理服务模块
│   │       ├── __init__.py
│   │       ├── service_client.py      # 服务相关接口
│   │       └── service_model.py       # 服务模型定义
├── sample/aihc/                       # AIHC示例代码目录
│   ├── aihc_dataset_sample.py        # 数据集操作示例
│   ├── aihc_job_sample.py            # 训练任务操作示例
│   ├── aihc_resource_pool_sample.py  # 资源池操作示例
│   ├── aihc_sample_conf.py           # 示例配置文件
│   ├── aihc_service_sample.py        # 在线推理服务操作示例
```

### 卸载SDK
使用pip uninstall bce-python-sdk即可卸载sdk工具包
