本文旨在帮助您熟悉对象存储BOS在开发机中的使用。

## 对象存储BOS在开发机中的使用
以如下配置为例，验证工作目录挂载和只读权限
![对象存储BOS的使用1.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8BOS%E7%9A%84%E4%BD%BF%E7%94%A81_336e884.png)
### 步骤一、 登录开发机
从开发机列表中，登录开发机，打开terminal

因为第一个bos文件挂载在workspace下，故而可以直接在工作目录下可视化操作
![对象存储BOS的使用2.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8BOS%E7%9A%84%E4%BD%BF%E7%94%A82_9c4491b.png)


### 步骤二、 挂载目录下读写
* 进入/root/workspace/bos/test 目录下，可正常读写（有读写权限）
* 进入/mnt/bos/dvrg2s 目录下，尝试touch file.txt ，报错，符合预期（只有只读权限）
![对象存储BOS的使用3.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8BOS%E7%9A%84%E4%BD%BF%E7%94%A83_8e5bb5d.png)


## 高级功能
BOS提供了命令行工具BCE CMD，帮助开发者更好地在容器内使用BOS。

BCE CMD提供了丰富的功能，您不仅可以通过BCE CMD完成Bucket的创建和删除，Object的批量上传、下载、删除和拷贝等, 当您从BOS下载文件或者上传文件到BOS遇到问题时，还可以使用BCE CMD的子命令bosprobe进行错误检查。

相关功能参见 [ BOS命令行工具使用指南](https://cloud.baidu.com/doc/BOS/s/Sjwvyqetg)
