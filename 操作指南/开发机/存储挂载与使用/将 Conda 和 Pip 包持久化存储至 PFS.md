云上的AI开发环境中，您可能经常通过 conda install 或 pip install 安装 Python 依赖包。直接在容器内安装，这些包会写入容器的可写层，导致以下问题：

* 镜像过大：提交镜像时包含大量临时文件和缓存；
* 环境不可复现：新开发机实例启动后需重新安装依赖；
* 资源浪费：重复下载相同包，浪费时间和网络开销。


本文将为您介绍在百舸平台使用开发机时，如何通过挂载PFS或数据集实现 Conda 开发工具的持久化，开发环境快速复用与迁移。

## PFS目录结构规范

挂载目录规范命名，保持一致，如使用` /mnt/pfs/<project>/<user>`

## 在 PFS 上安装Conda
### 创建开发机
1. 使用预置的镜像创建开发机，如选择镜像 `registry.baidubce.com/inference/aibox-pytorch:v1.0-torch2.7.1-cu12.8`
2. 添加存储挂载，挂载 PFS，设置目标路径为` /mnt/pfs/project1`
3. 通过 WebIDE 登录使用开发机


### 安装 Miniconda 到 PFS

```
# 进入 pfs 挂载目录，创建 conda 安装目录
cd /mnt/pfs/project1 & mkdir -p user1/conda
# 获取安装脚本
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
# 安装
bash Miniconda3-latest-Linux-x86_64.sh -b -p /mnt/pfs/project1/user1/conda/miniconda
```

### 初始化 Conda

```
source /mnt/pfs/project1/user1/conda/miniconda/etc/profile.d/conda.sh
```


### 验证 Conda 安装

```
conda info | grep 'root prefix'
# 期望输出
# root prefix : /mnt/pfs/project1/user1/conda/miniconda
```


### 创建开发环境
```
conda create -n py310 python=3.10 -y
# 默认路径
# /mnt/pfs/project1/user1/conda/miniconda/envs/py310
# 激活环境
conda activate py310

# 根据需求安装一些需要的环境
pip install numpy -i http://mirrors.baidubce.com/pypi/simple/ --trusted-host mirrors.baidubce.com
pip install torch -i http://mirrors.baidubce.com/pypi/simple/ --trusted-host mirrors.baidubce.com
```


## 通过挂载 PFS 使用开发环境
创建开发机或者训练任务挂载 PFS，目标路径 /mnt/pfs/project1。

**注意**

1. 镜像选择需要与之前操作安装的开发机镜像同架构（x86_64），且必须包含`glibc`以及`/bin/bash`
2. PFS 挂载路径需要和之前安装 Conda 时的开发机 PFS挂载路径一致



### 在开发机中使用

通过 WebIDE 或者  SSH 登录，开启 Terminal 执行

```
# 初始化 conda
source /mnt/pfs/project1/user1/conda/miniconda/etc/profile.d/conda.sh
# 激活环境
conda activate py310
# 查看之前安装的包
pip show torch
```


### 在训练任务中使用

在** <执行命令> ** 处设置启动命令

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ca03481.png)
```
# 初始化 conda
source /mnt/pfs/project1/user1/conda/miniconda/etc/profile.d/conda.sh
# 激活环境
conda activate py310
# 后续添加训练任务命令等
# ...
```





