  
<font style="color:rgb(64, 64, 64);">平台提供SSH远程连接开发机的方式，您可以通过SSH安全的连接到开发机，进行文件传输、代码编辑等操作。</font> 

## 前置条件
+ 确保开发机已经开启了SSH服务，并绑定BLB和端口映射；自定义镜像需要提前安装好sshd
+ 如果要使用公网连接，需要开发机实例绑定带EIP(弹性公网IP)的负载均衡BLB
+ 开发机处于“运行中”状态


## 具体操作步骤
#### **1. 生成 SSH 密钥对**
```
ssh-keygen -t rsa -b 2048 -C "your_email@example.com"

```
* **参数说明**：
    * `-t rsa`：指定使用 RSA 算法。
    * `-b 2048`：密钥长度为 2048 位。
    * `-C "your_email@example.com"`：添加注释（通常为邮箱，便于识别密钥用途）。


#### **2. 指定密钥对保存位置（可选）**
执行命令后，系统会提示输入保存路径，默认位置为：

```
~/.ssh/id_rsa          # 私钥
~/.ssh/id_rsa.pub      # 公钥
```
若需保存到其他路径，可在提示时输入自定义路径（如`/path/to/your_key`）。



#### **3. 开发机ssh开启配置，并绑定BLB**

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_68f336a.png)

* 在开发机访问配置中，打开ssh开关，如果镜像为自定义镜像，请确保安装了sshd
* 将创建好的公钥文件，内容完整复制到公钥输入框
* 选择负载均衡BLB，开发机通过负载均衡BLB对外提供流量访问，支持多个开发机复用一个BLB
* 为ssh服务映射对应的负载均衡BLB端口，可以通过自动分配空闲端口，确保端口未被其它开发机或服务占用，每个BLB最多支持映射50个端口

完成以上配置生效后，开发机即成功开启ssh服务



#### **4.  使用 SSH 密钥访问开发机**


```
ssh -i /这里填私钥地址 username@ip_address -p port_number
```
* 私钥地址如果未自定义修改过，默认 -i /私钥地址 可以省略
* username默认为root
* 内网访问时，ip_address为BLB内网IP，公网访问时ip_address为BLB绑定的EIP（弹性公网IP）
* port_number为配置的BLB监听端口


