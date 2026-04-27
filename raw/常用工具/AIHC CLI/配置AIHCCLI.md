使用AIHCCLI需先配置百度智能云accesskey、secretkey以及服务地域（region ）等信息

## 基础配置
### 使用命令配置
将命令安装好之后，就可以使用命令来配置，执行 aihc config 回车，会将需要配置的字段弹出来，按照提示操作

1. 获取帮助信息，在帮助信息中可以查看支持的region：cn-bj、cn-gz、cn-su、cn-bd、cn-fwh、cn-yq
* 命令示例
```bash
$ aihc config -h
Configure Client credentials and settings. You can:
1. Run without flags for interactive mode
2. Set specific values using flags:
   - Set credentials: aihc config --ak <AccessKey> --sk <SecretKey>
   - Set region: aihc config --region <region>
   - Set CCR account: aihc config --username <Username> --password <Password>

Available Regions:
  "cn-bj":   华北-北京
  "cn-gz":   华南-广州
  "cn-su":   华东-苏州
  "cn-bd":   华北-保定
  "cn-fwh":  华中-武汉
  "cn-yq":   华北-阳泉

Usage:
  aihc config [flags]
  aihc config [command]

Available Commands:
  get         Get current configuration
  set         Set configuration values

Flags:
      --access-key string      Access Key ID
      --aihc-username string   Job creator
      --ak string              Access Key ID
  -h, --help                   help for config
      --password string        CCR Password
      --region string          Region
      --secret-key string      Secret Access Key
      --sk string              Secret Access Key
      --username string        CCR Username

Global Flags:
  -C, --config string   Global configuration file. (default "/Users/xxx/.aihc/config")

Use "aihc config [command] --help" for more information about a command.
```
2. 设置配置参数，输入 aihc config 后按提示输入配置信息
* 命令示例
```bash
$ aihc config

Current configuration:
region: cn-beijing
credentials:
    accesskey: ""
    secretkey: ""
    sessionToken: ""
ccraccount:
    username: ""
    password: ""
endpoint: ""
useragent: ""
retry: 0
defaultpool: ""
defaultqueue: ""

Press Enter to keep current value or input new value:
Access Key ID  [""]: 在此输入AK后回车...
Secret Access Key [""]: 
Region [cn-bj]: 
```
3. 查看配置信息
* 命令示例
```bash
$ aihc config get

region: cn-beijing
credentials:
    accesskey: ALTAKeB***************csC9GO
    secretkey: b903d4*************c7c315063
    sessionToken: ""
ccraccount:
    username: ""
    password: ""
endpoint: aihc.bj.baidubce.com
useragent: aihc-cli/golang/v1.0.0
retry: 3
defaultpool: ""
defaultqueue: ""
```
### 直接修改配置文件
可以使用命令行（vim/nano等）或记事本打开配置文件直接修改对应参数，保存文件后重启命令行工具后生效

```bash
vim ~/.aihc/config
region: #必填  格式： cn-beijing
credentials:
    accesskey: #必填
    secretkey: #必填
    sessionToken: ""
ccraccount:
    username: ""
    password: ""
endpoint: #自动生成
useragent: 
retry: 
defaultpool: "" #默认资源池ID
defaultqueue: "" #默认队列名称
```
## 设置默认资源池
设置一个默认资源池/队列，之后操作如果不指定资源池/队列则默认使用此资源池/队列，后续命令直接使用默认资源池可以在命令中省略 -p/--pool 参数

* 命令示例
```bash
# 根据提示输入需要设置资源池、队列的序号，回车后生效
$ aihc pool set

Available pools:
1. hpas-runtime-02 (cce-rdy)
2. hpas-runtime (cce-4kvu)
3. workflow (cce-5uvro)

Select pool (enter number): 3

Available queues:
1. test
2. 63a9f0ea7bb96b649e85481845
3. default

Select queue (enter number): 3
```
