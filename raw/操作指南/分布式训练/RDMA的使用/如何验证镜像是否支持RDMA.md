## 概述
本文介绍了如何验证当前镜像是否支持 RDMA 能力，您可以根据下文中的步骤，确定某个镜像是否符合 RDMA 的使用条件。目前主流的训练容器镜像是基于 Ubuntu 构建的，本文将介绍在如何在ubuntu的环境中验证。

> 百舸分布式训练中，预置的Pytorch镜像已经默认支持RDMA能力，推荐基于百舸预置的Pytorch镜像构建您的自定义镜像。


## 步骤一：测试环境配置
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


## 步骤二：**验证镜像是否支持RDMA**
在分布式训练任务中，以调试的形式进入到容器中（webshell）。按以下步骤进行验证，如果报错或者结果不符合预期，则镜像不支持RDMA，可更换使用官方镜像或者重新安装相关软件包，检查是否有配置项的遗漏。

1. 在容器中执行以下脚本获取gid信息。

```
#!/bin/bash
#
# Copyright (c) 2016 Mellanox Technologies. All rights reserved.
#
# This Software is licensed under one of the following licenses:
#
# 1) under the terms of the "Common Public License 1.0" a copy of which is
#    available from the Open Source Initiative, see
#    http://www.opensource.org/licenses/cpl.php.
#
# 2) under the terms of the "The BSD License" a copy of which is
#    available from the Open Source Initiative, see
#    http://www.opensource.org/licenses/bsd-license.php.
#
# 3) under the terms of the "GNU General Public License (GPL) Version 2" a
#    copy of which is available from the Open Source Initiative, see
#    http://www.opensource.org/licenses/gpl-license.php.
#
# Licensee has the right to choose one of the above licenses.
#
# Redistributions of source code must retain the above copyright
# notice and one of the license notices.
#
# Redistributions in binary form must reproduce both the above copyright
# notice, one of the license notices in the documentation
# and/or other materials provided with the distribution.
#
# Author: Moni Shoua <monis@mellanox.com>
#

black='\E[30;50m'
red='\E[31;50m'
green='\E[32;50m'
yellow='\E[33;50m'
blue='\E[34;50m'
magenta='\E[35;50m'
cyan='\E[36;50m'
white='\E[37;50m'

bold='\033[1m'

gid_count=0

# cecho (color echo) prints text in color.
# first parameter should be the desired color followed by text
function cecho ()
{
        echo -en $1
        shift
        echo -n $*
        tput sgr0
}

# becho (color echo) prints text in bold.
becho ()
{
        echo -en $bold
        echo -n $*
        tput sgr0
}

function print_gids()
{
        dev=$1
        port=$2
        for gf in /sys/class/infiniband/$dev/ports/$port/gids/* ; do
                gid=$(cat $gf);
                if [ $gid = 0000:0000:0000:0000:0000:0000:0000:0000 ] ; then
                        continue
                fi
                echo -e $(basename $gf) "\t" $gid
        done
}

echo -e "DEV\tPORT\tINDEX\tGID\t\t\t\t\tIPv4  \t\tVER\tDEV"
echo -e "---\t----\t-----\t---\t\t\t\t\t------------  \t---\t---"
DEVS=$1
if [ -z "$DEVS" ] ; then
        DEVS=$(ls /sys/class/infiniband/)
fi
for d in $DEVS ; do
        for p in $(ls /sys/class/infiniband/$d/ports/) ; do
                for g in $(ls /sys/class/infiniband/$d/ports/$p/gids/) ; do
                        gid=$(cat /sys/class/infiniband/$d/ports/$p/gids/$g);
                        if [ $gid = 0000:0000:0000:0000:0000:0000:0000:0000 ] ; then
                                continue
                        fi
                        if [ $gid = fe80:0000:0000:0000:0000:0000:0000:0000 ] ; then
                                continue
                        fi
                        _ndev=$(cat /sys/class/infiniband/$d/ports/$p/gid_attrs/ndevs/$g 2>/dev/null)
                        __type=$(cat /sys/class/infiniband/$d/ports/$p/gid_attrs/types/$g 2>/dev/null)
                        _type=$(echo $__type| grep -o "[Vv].*")
                        if [ $(echo $gid | cut -d ":" -f -1) = "0000" ] ; then
                                ipv4=$(printf "%d.%d.%d.%d" 0x${gid:30:2} 0x${gid:32:2} 0x${gid:35:2} 0x${gid:37:2})
                                echo -e "$d\t$p\t$g\t$gid\t$ipv4  \t$_type\t$_ndev"
                        else
                                echo -e "$d\t$p\t$g\t$gid\t\t\t$_type\t$_ndev"
                        fi
                        gid_count=$(expr 1 + $gid_count)
                done #g (gid)
        done #p (port)
done #d (dev)

echo n_gids_found=$gid_count
```
输出示例

```
# sh cmd.sh
DEV    PORT    INDEX    GID                    IPv4          VER    DEV
---    ----    -----    ---                    ------------      ---    ---
mlx5_0    1    44    0000:0000:0000:0000:0000:ffff:ac10:0942    172.16.9.66      v1    eth0
mlx5_0    1    45    0000:0000:0000:0000:0000:ffff:ac10:0942    172.16.9.66      v2    eth0
mlx5_1    1    4    0000:0000:0000:0000:0000:ffff:1912:0106    25.18.1.6      v1    roce1
mlx5_1    1    5    0000:0000:0000:0000:0000:ffff:1912:0106    25.18.1.6      v2    roce1
mlx5_2    1    4    0000:0000:0000:0000:0000:ffff:1912:0116    25.18.1.22      v1    roce2
mlx5_2    1    5    0000:0000:0000:0000:0000:ffff:1912:0116    25.18.1.22      v2    roce2
mlx5_3    1    4    0000:0000:0000:0000:0000:ffff:1912:0126    25.18.1.38      v1    roce3
mlx5_3    1    5    0000:0000:0000:0000:0000:ffff:1912:0126    25.18.1.38      v2    roce3
mlx5_4    1    4    0000:0000:0000:0000:0000:ffff:1912:0136    25.18.1.54      v1    roce4
mlx5_4    1    5    0000:0000:0000:0000:0000:ffff:1912:0136    25.18.1.54      v2    roce4
mlx5_5    1    4    0000:0000:0000:0000:0000:ffff:1912:0166    25.18.1.102      v1    roce5
mlx5_5    1    5    0000:0000:0000:0000:0000:ffff:1912:0166    25.18.1.102      v2    roce5
mlx5_6    1    4    0000:0000:0000:0000:0000:ffff:1912:01c6    25.18.1.198      v1    roce6
mlx5_6    1    5    0000:0000:0000:0000:0000:ffff:1912:01c6    25.18.1.198      v2    roce6
mlx5_7    1    4    0000:0000:0000:0000:0000:ffff:1912:0216    25.18.2.22      v1    roce7
mlx5_7    1    5    0000:0000:0000:0000:0000:ffff:1912:0216    25.18.2.22      v2    roce7
mlx5_8    1    4    0000:0000:0000:0000:0000:ffff:1912:0246    25.18.2.70      v1    roce8
mlx5_8    1    5    0000:0000:0000:0000:0000:ffff:1912:0246    25.18.2.70      v2    roce8
n_gids_found=18
```
2. 在容器中输入以下测试命令

```

# ib_write_bw -d mlx5_1 -x <gid>  -p 18516
```
* 信息从上述第一步的返回中获取，这里我们测试 mlx5_1网卡，选择v2版本，这里 gid 为 5

返回示例如下

```
# ib_write_bw -d mlx5_1 -x 5  -p 18516
************************************
* Waiting for client to connect... *
************************************
```
3. 在同一容器内继续输入如下命令。

```
Go复制
ib_write_bw -d mlx5_1 127.0.0.1 -x <gid> -p 18516 --report_gbits //<gid>:请求端gid需和服务端一致
```
示例如下：

```
# ib_write_bw -d mlx5_1 127.0.0.1 -x 5 -p 18516 --report_gbits
---------------------------------------------------------------------------------------
                    RDMA_Write BW Test
 Dual-port       : OFF        Device         : mlx5_1
 Number of qps   : 1        Transport type : IB
 Connection type : RC        Using SRQ      : OFF
 PCIe relax order: ON
 ibv_wr* API     : ON
 TX depth        : 128
 CQ Moderation   : 1
 Mtu             : 4096[B]
 Link type       : Ethernet
 GID index       : 5
 Max inline data : 0[B]
 rdma_cm QPs     : OFF
 Data ex. method : Ethernet
---------------------------------------------------------------------------------------
 local address: LID 0000 QPN 0xb1e5 PSN 0x893dde RKey 0x016006 VAddr 0x007efdfae11000
 GID: 00:00:00:00:00:00:00:00:00:00:255:255:25:18:01:06
 remote address: LID 0000 QPN 0xb1e4 PSN 0x344ea9 RKey 0x007905 VAddr 0x007f9f69f3d000
 GID: 00:00:00:00:00:00:00:00:00:00:255:255:25:18:01:06
---------------------------------------------------------------------------------------
 #bytes     #iterations    BW peak[Gb/sec]    BW average[Gb/sec]   MsgRate[Mpps]
 65536      5000             100.77             100.77            0.192207
---------------------------------------------------------------------------------------
```
带宽值（`BW peak`、`BW average`）在`100Gb/s`左右，符合预期。

这里不同GPU机型的RDMA带宽规格不同，您可以从机器套餐规格中获取。

如无输出或报错说明镜像不支持RDMA，请重新安装相关软件包，检查是否有配置项的遗漏。