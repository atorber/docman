本文档将使用系统自带CMD工具和BCC SmartTerm两种方式指导您使用SSH登录实例进行调试，您也可以选择使用XShell、MobaXterm、Teraminal等其他工具。

## 获取登录指令和密码

1. 登陆百度百舸·AI计算平台。
2. 进入**工具市场>工具模版** ，点击工具模版详情页；
3. 在工具模版详情页中，点击需要登录的对应实例的 **登录 **按钮，查看SSH登录密码。

![64e5b93dc4b1ff7976bb92d752c7213f.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/64e5b93dc4b1ff7976bb92d752c7213f_64e5b93.png)

![2.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/2_96fec0b.png)

## 登录实例
### 使用本地CMD工具登录实例
复制登录指令到本地CMD窗口或其他远程终端工具中，例如：
```
$ ssh user_namespace@ip_address # 默认端口22
$ ssh user_namespace@ip_address -p 8001 # 特定端口上建立连接
```
复制登录密码到窗口中确认，成功登录资源实例。

![3.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/3_cb3ac0f.png)

### 使用SmartTerm登录资源实例
 1. 点击实例的 **所属节点**，跳转到BCC云服务器详情页；
 
![4.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/4_f42b497.png)

2. 点击 **远程登录 **，选择通过SmartTerm登录；

![5.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/5_8c8e64c.png)

3. 在SmartTerm登录页面中，使用登录凭证先登录BCC云服务器；
4. 登录成功后，进入BCC云服务器；

![6.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/6_ba21756.png)

5. 复制实例ID后使用docker命令进入容器，输入登录密码，实例ID可在工具详情中查看。


```
docker exec -it container-ID bash # 或者替换为/bin/bash
```
