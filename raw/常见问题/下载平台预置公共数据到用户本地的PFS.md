这里介绍如何基于开发机，使用BOSCMD工具，将平台公共的数据（模型权重、数据集等）下载到您的并行文件存储PFS

### 1. 创建开发机

这里我们创建一个百舸开发机，详见：[创建开发机](https://cloud.baidu.com/doc/AIHC/s/Tm6db1z9p)，主要配置：

1. 资源规格：4C8G即可，无需GPU
2. 镜像：推荐选择百舸预置镜像（已经预装BOSCMD工具），如aibox-cuda镜像。
3. 存储挂载：选择我们需要下载数据的PFS，挂载到开发机中。这里作为示例，我们将PFS的根目录(/)挂载到开发机的`mnt/pfs`目录

![image-20250914172148741.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image-20250914172148741_3add7c1.png)

### 2. 在开发机安装BOSCMD工具

> 开发机的预置镜像已经内置bcecmd工具，无需执行此步骤

开发机进入运行状态后，登陆开发机

1. 执行以下命令，验证BOSCMD工具是否已经安装。如出现下述提示，则表示已经安装，无需再次安装，直接进行步骤3下载数据

```
bcecmd
bcecmd: error: command not specified

usage: bcecmd  [--help] [--configure [""]] [--debug] [--conf-path CONF-PATH] [--multiupload-infos-path MULTIUPLOAD-INFOS-PATH] [--version] 

Optional flags:
      --help                 Show context-sensitive help (also try --help-long and --help-man).
  -c, --configure [""]       configure AK SK Region and Domain for bcecmd and will be written to CONF_PATH(the user's home director by default
  -d, --debug                cli debug
      --conf-path CONF-PATH  config path
      --multiupload-infos-path MULTIUPLOAD-INFOS-PATH  
                             multi upload info dir path
  -v, --version              show program's version number and exit

Commands:
  help
    Show help.
  bos
    bos service
  bosapi
    BOS API command.
  bosprobe
    bos probe
  completion
    Generate completion script
```



2. 如未安装，则执行以下的命令安装BOSCMD工具。更多版本详见[安装BOSCMD](https://cloud.baidu.com/doc/BOS/s/qjwvyqegc)。

这里以BOSCMD客户端0.5.9版本为例，在开发机上执行以下命令安装BOSCMD工具

```
wget https://doc.bce.baidu.com/bos-optimization/linux-bcecmd-0.5.9.zip   #下载
unzip linux-bcecmd-0.5.9.zip   #解压
ln linux-bcecmd-0.5.9/bcecmd /usr/sbin/  #设置为全局使用
```



### 3 . 下载数据

BOSCMD工具配置完成后，数据的上传下载等命令详见：[BCECMD-Object管理](https://cloud.baidu.com/doc/BOS/s/kmcn3zrup)。

这里我们下载openpi/pi0.5的模型权重为例：

```
bos:/aihc-models-bj/openpi/pi0.5/ckpt/pi05_base  #pi0.5权重的地址，无需执行
bcecmd bos sync bos:/aihc-models-bj/openpi/pi0.5/ckpt/pi05_base /mnt/pfs/pi0.5/ckpt/pi05_base  #下载pi0.5权重到开发机机/mnt/pfs/pi0.5/ckpt/pi05_base目录
```



更多示例

- **同步下载bos:/mybucket/pre/下文件到当前目录下的temp目录**

```
bcecmd bos sync bos:/mybucket/pre/ ./temp/
```

- **下载Object**

```
bcecmd bos cp bos:/mybucket/test.txt text.txt
```

