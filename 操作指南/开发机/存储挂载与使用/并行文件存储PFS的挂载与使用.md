本文旨在帮助您熟悉并行文件存储PFS的挂载与使用

## 并行文件存储服务PFS简介
并行文件存储服务PFS (Parallel Filesystem Service)，是百度智能云提供的完全托管、简单可扩展的并行文件存储系统，针对高性能计算场景提供TBps级吞吐、千万级IOPS能力的同时还能保证亚毫秒级的延时。同时，百度智能云PFS提供简单、易操作的接口，免去部署、维护费用的同时，最大化提升您的业务效率。PFS与对象存储BOS深度联动，提供冷热数据分级存储能力，在保持海量数据在BOS中低成本存储的同时，获得高性能文件访问能力，适用于AI训练与推理、自动驾驶、高性能计算和视频渲染等场景。

了解更多：[并行文件存储服务PFS](https://cloud.baidu.com/doc/PFS/s/Gkrvq752q)

## 使用前提
百舸集群已关联目标并行文件存储PFS实例

如果没有并行文件存储PFS实例：

1. 新建并行文件存储PFS实例和挂载服务： [创建PFS](https://cloud.baidu.com/doc/PFS/s/fks8xeoud) -> [创建挂载服务](https://cloud.baidu.com/doc/PFS/s/Ym9e8sj1m#%E5%88%9B%E5%BB%BA%E6%8C%82%E8%BD%BD%E6%9C%8D%E5%8A%A1)->[为挂载服务绑定已创建的PFS实例](https://cloud.baidu.com/doc/PFS/s/Ym9e8sj1m#%E7%BB%91%E5%AE%9A%E5%AD%98%E5%82%A8%E5%AE%9E%E4%BE%8B)
2. 在资源池详情页面中，关联对应的挂载服务
![并行文件存储PFS的挂载与使用1.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%B9%B6%E8%A1%8C%E6%96%87%E4%BB%B6%E5%AD%98%E5%82%A8PFS%E7%9A%84%E6%8C%82%E8%BD%BD%E4%B8%8E%E4%BD%BF%E7%94%A81_f7e2ae7.png)


## 在开发机中挂载并行文件存储PFS
**步骤**：创建或更新开发机->选择对应的资源池/队列->存储挂载中"添加存储挂载"->存储类型选择PFS->即可在下拉框中找到已经被集群绑定的PFS->选择目标PFS实例->填写源路径、目标路径->设置读写权限->完成开发机创建或更新

本文以下图配置为例：
![并行文件存储PFS的挂载与使用2.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%B9%B6%E8%A1%8C%E6%96%87%E4%BB%B6%E5%AD%98%E5%82%A8PFS%E7%9A%84%E6%8C%82%E8%BD%BD%E4%B8%8E%E4%BD%BF%E7%94%A82_152d162.png)

**注意**：

* 需要确保填写的源路径在PFS中存在，不建议源路径以根目录挂载"/"
* 目标路径可选择默认路径，或者配置到/root/workspace/**工作目录下，方便被读写
* 如果勾选"只读"，将无法在目标路径下创建和修改文件

## 在开发机中使用并行文件存储PFS
1. 从开发机列表页，登录对应开发机，进入webIDE页面
2. 打开terminal，进入/root/workspace/pfs/test ，即可对应读写文件
![并行文件存储PFS的挂载与使用3.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%B9%B6%E8%A1%8C%E6%96%87%E4%BB%B6%E5%AD%98%E5%82%A8PFS%E7%9A%84%E6%8C%82%E8%BD%BD%E4%B8%8E%E4%BD%BF%E7%94%A83_bb890a4.png)

