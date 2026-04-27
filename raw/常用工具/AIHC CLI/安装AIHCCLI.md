支持Mac 、Linux、Windows 三种操作系统上使用

## 安装包下载
选择对应的版本，下载编译好的二进制可执行文件：

> 当前最新版本v1.3.2

|平台|下载地址|
|-|-|
|[windows-amd64](https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/windows-amd64/aihc.exe)|https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/windows-amd64/aihc.exe|
|[darwin-arm64](https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/darwin-arm64/aihc)|https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/darwin-arm64/aihc|
|[darwin-amd64](https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/darwin-amd64/aihc)|https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/darwin-amd64/aihc|
|[linux-amd64](https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/linux-amd64/aihc)|https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/linux-amd64/aihc|
|[linux-arm64](https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/linux-arm64/aihc)|https://aihc-public.bj.bcebos.com/cli/release/v1.3.2/linux-arm64/aihc|

## 操作步骤
### Windows环境
1. 将工具添加到系统环境变量$PATH 中

  a. 打开“系统属性”对话框（右键点击“此电脑”或“计算机”，选择“属性”，然后点击“高级系统设置”和“环境变量”）。
  
  b. 在“系统变量”区域找到`Path`变量，点击“编辑”，然后点击“新建”并输入工具可执行文件的路径。
  
  c. 点击“确定”保存更改。
  
  d. 重新打开一个命令行窗口使新的`PATH`设置生效。
  
2. **验证安装**

  a. 打开一个新的命令提示符窗口（可以通过按`Win + R`，输入`cmd`，然后按回车来打开）。
  
  b. 输入aihc -h 并按回车。如果工具正确安装并配置，它应该会显示一些帮助信息或启动该工具
  
### Linux环境

将工具存放路径添加到环境变量$PATH 中

```bash
$ echo $PATH

# 工具存放路径
$ export PATH="$PATH:/usr/local/bin"
$ mv aihc /usr/local/bin/ && cd /usr/local/bin/
$ chmod +x aihc

# 执行bash命令刷新终端以保证设置生效
$ bash 

# 检查指令是否生效，如果正常显示帮助信息则表示工具配置成功
$ aihc -h
```
### Mac环境

1. 将工具存放路径添加到环境变量$PATH中

```bash
# 查看当前环境变量
$ echo $PATH

# 将/usr/local/bin加入到环境变量，如果已经存在不需要重复执行
$ export PATH="$PATH:/usr/local/bin"

# 进入aihc可执行程序所在目录,将可执行程序移动到/usr/local/bin/路径下
$ cd /Users/xxx/Downloads/aihc
$ mv aihc /usr/local/bin/

# 进入/usr/local/bin/路径进行权限设置
$ cd /usr/local/bin/
$ chmod +x aihc

# 检查指令是否生效，如果正常显示帮助信息则表示工具配置成功
$ aihc -h
```
2. 设置执行权限（可选），如果遇到「未打开“aihc”，Apple无法校验....」提示，执行以下操作信任工具
```bash
# 移除aihc文件的隔离属性
$ sudo xattr -r -d com.apple.quarantine /usr/local/bin/aihc

# 添加执行权限（如果尚未授权）,执行完成后检测是否生效
$ sudo chmod +x /usr/local/bin/aihc

$ aihc -h
```
