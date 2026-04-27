目前主流的训练容器镜像是基于 Ubuntu 构建的，本文将介绍在如何在ubuntu的环境中验证。

## 自定义镜像安装RDMA软件包
1. 执行如下命令安装测试软件包。

```
apt update && apt install -y infiniband-diags
```
2. 使用`ibstatus`命令查看网卡速率。这里我们测试的是A800实例。可以看到本例中网卡（mlx5_1）速率（rate）为`100Gb/s`，这是符合预期的。

```
# ibstatus
Infiniband device 'mlx5_0' port 1 status:
    default gid:     0000:0000:0000:0000:0000:0000:0000:0000
    base lid:     0x0
    sm lid:         0x0
    state:         4: ACTIVE
    phys state:     5: LinkUp
    rate:         100 Gb/sec (4X EDR)
    link_layer:     Ethernet

Infiniband device 'mlx5_1' port 1 status:
    default gid:     0000:0000:0000:0000:0000:0000:0000:0000
    base lid:     0x0
    sm lid:         0x0
    state:         4: ACTIVE
    phys state:     5: LinkUp
    rate:         100 Gb/sec (4X EDR)
    link_layer:     Ethernet

Infiniband device 'mlx5_2' port 1 status:
    default gid:     0000:0000:0000:0000:0000:0000:0000:0000
    base lid:     0x0
    sm lid:         0x0
    state:         4: ACTIVE
    phys state:     5: LinkUp
    rate:         100 Gb/sec (4X EDR)
    link_layer:     Ethernet
```
3. 执行如下命令检查是否安装 RDMA 相关库。

```
dpkg -l perftest ibverbs-providers libibumad3 libibverbs1 libnl-3-200 libnl-route-3-200 librdmacm1
```
输出示例

```
# dpkg -l perftest ibverbs-providers libibumad3 libibverbs1 libnl-3-200 libnl-route-3-200 librdmacm1
dpkg-query: no packages found matching perftest
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                    Version      Architecture Description
+++-=======================-============-============-===========================================================
ii  ibverbs-providers:amd64 39.0-1       amd64        User space provider drivers for libibverbs
ii  libibumad3:amd64        39.0-1       amd64        InfiniBand Userspace Management Datagram (uMAD) library
ii  libibverbs1:amd64       39.0-1       amd64        Library for direct userspace use of RDMA (InfiniBand/iWARP)
ii  libnl-3-200:amd64       3.5.0-0.1    amd64        library for dealing with netlink sockets
ii  libnl-route-3-200:amd64 3.5.0-0.1    amd64        library for dealing with netlink sockets - route interface
ii  librdmacm1:amd64        39.0-1       amd64        Library for managing RDMA connections
```
上述输出信息中包含了已安装（如`ibverbs-providers:amd64`、`libibumad3:amd64`等）和未安装（`perftest`）的软件。 如有软件包未安装，请继续执行第4步的操作安装软件；如已经安装全部软件，则可以直接验证是否支持RDMA

4. 执行命令安装上述软件包

```

apt update && apt install -y perftest ibverbs-providers libibumad3 libibverbs1 libnl-3-200 libnl-route-3-200 librdmacm1
```
5. 执行如下命令再次查看软件包安装情况

```
dpkg -l perftest ibverbs-providers libibumad3 libibverbs1 libnl-3-200 libnl-route-3-200 librdmacm1
```
输出示例

```
# dpkg -l perftest ibverbs-providers libibumad3 libibverbs1 libnl-3-200 libnl-route-3-200 librdmacm1
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                    Version      Architecture Description
+++-=======================-============-============-===========================================================
ii  ibverbs-providers:amd64 39.0-1       amd64        User space provider drivers for libibverbs
ii  libibumad3:amd64        39.0-1       amd64        InfiniBand Userspace Management Datagram (uMAD) library
ii  libibverbs1:amd64       39.0-1       amd64        Library for direct userspace use of RDMA (InfiniBand/iWARP)
ii  libnl-3-200:amd64       3.5.0-0.1    amd64        library for dealing with netlink sockets
ii  libnl-route-3-200:amd64 3.5.0-0.1    amd64        library for dealing with netlink sockets - route interface
ii  librdmacm1:amd64        39.0-1       amd64        Library for managing RDMA connections
ii  perftest                4.4+0.37-1   amd64        Infiniband verbs performance tests
```
