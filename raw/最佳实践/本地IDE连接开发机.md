为了提供更高效的开发体验，百度百舸允许开发者使用本地熟悉的IDE（如VS Code）远程连接至云端开发机进行代码编写与调试。

通过这种方式，用户既能享受本地IDE丰富的插件与调试功能，又能直接利用云端开发机的高性能算力资源。本文档将详细介绍如何在百舸控制台创建支持公网访问的开发机，并配置本地SSH客户端及IDE插件，实现远程直连开发。

# 创建开发机
1. 在百舸控制台新建开发机

登录百舸控制台, 点击开发机
<br>

![image \(1\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%281%29_71ea092.png)

<br>
点击"新建实例"

![image \(2\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%282%29_37838ac.png)

2. 在新建实例页面, 首先选定 "资源池类型" 与 "资源池/队列"

![image \(3\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%283%29_f415e44.png)

3. 在本地命令行中生成密钥
```bash
ssh-keygen -t rsa -f ~/.ssh/id_baidu_aihc
cat ~/.ssh/id_baidu_aihc.pub
```
4. 页面下部"访问配置"中, 点击启用SSH, 并在公钥处添加上一步生成的.pub文件内容

![image \(4\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%284%29_fc413a9.png)
5. 绑定公网BLB

点击"绑定BLB"下拉列表, 可选择的BLB为黑色, 不可选择为灰色
此处需要选择带有 "支持公网" 标签的BLB实例, 并请确认所选BLB实例的安全组, 允许客户端远程访问

![image \(5\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%285%29_2c8832b.png)

<br>
选定BLB实例后, 将自动随机生成一个BLB可用监听端口, 也可在输入框内自行指定

![image \(6\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%286%29_5aac2e2.png)

6. 点击创建开发机, 并等待开发机进入"运行中状态"

# 配置IDE
目前仅支持基于vscodium的客户端, 如: VS Code, Trae等
<br>以下示例为使用VS Code<br>
1. 获取远程访问指令<br>
    a. 找到要连接的开发机, 点击开发机名称进入详情页

![image \(7\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%287%29_0d22815.png)
    b. 找到"访问配置"中的"外网访问指令"

![image \(8\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%288%29_58414fe.png)
2. 在IDE中安装ssh插件, 推荐使用微软推出的remote-ssh插件

![image \(9\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%289%29_46d71a6.png)
3. 安装完成后, 点击IDE左下角的><图标 或 打开命令面板, 选择Remote-SSH: Connect to Host

![image \(10\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2810%29_51bce0c.png)
![image \(11\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2811%29_3c56ad5.png)

4. 选择 "+ Add New SSH Host"

![image \(12\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2812%29_a70c710.png)

5. 填入第一步获取的远程访问指令

![image \(13\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2813%29_046898d.png)

6. 添加成功后, 再次打开远程连接, 选择"Connect to Host..."

![image \(14\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2814%29_21dfa20.png)

7. 选择刚刚添加的远端地址

![image \(15\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2815%29_50c46ca.png)

8. 弹出新窗口并左下角显示正常连接状态暨为成功连接
![image \(16\).png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image%20%2816%29_a4abf22.png)



