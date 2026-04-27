百舸平台提供CLI工具，支持有开发习惯的用户使用CLI操作资源池、队列、任务等。

本文只介绍在开发机中使用CLI工具的步骤，CLI工具的详细使用方法请参考 [常用工具/CLI命令行工具](AIHC/常用工具/CLI命令行工具.md) 章节。

## 安装CLI工具

> 前置依赖：服务器上已经安装python（版本>=3.8）、pip工具

SSH连接开发机或打开开发机WebIDE,在开发机运行以下命令安装CLI工具

```bash
pip install https://bj.bcebos.com/v1/cce-ai-aihc/aihc-cli/aihc-1.3.0-py3-none-any.whl
```

## 配置CLI工具

```bash
# 替换为自己的配置信息，
aihc config --access-key <AccessKey> --secret-key <SecretKey> --region cn-beijing --username <Username> --
Configuration saved to: ~/.aihc/config
```

## 使用命令行提交训练任务

```bash
aihc job submit --pool cce-**** \
                --name test-pytorch \
                --priority high \
                --script-file /root/file.txt \
                --image registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release \
                --label key=value \
                --gpu baidu.com/a100_80g_cgpu=8 \
                --env CUDA_DEVICE_MAX_CONNECTIONS=1 \
                --ds-type pfs \
                --ds-name pfs-**** \
                --ds-mountpath /mnt/cluster
```

## 更多CLI操作

查阅 [常用工具/CLI命令行工具](AIHC/常用工具/CLI命令行工具.md) 文档，了解更多操作方法使用
