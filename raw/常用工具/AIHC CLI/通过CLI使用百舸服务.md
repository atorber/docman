使用命令行工具操作百舸与用户在百舸操作具有相同的权限控制，AK/SK所属用户需要在百舸控制台获得对应的操作权限（如资源池、队列、训练任务的开发权限、管理员权限）才能对资源池、队列、训练任务进行管理操作

## 通用语法和参数
```bash
$ aihc [资源] <command> [flags] [options]
```
* 全局通用参数
--help/-h：所有命令可以通过此参数获得帮助信息，查看使用说明

* 列表页通用参数
--order ：列表页接口支持排序参数，可选值asc, desc，默认值desc

--orderBy：设置排序字段，默认值createTime

--page：支持分页的接口可以指定页数，默认值1

-s, --size：分页大小，默认值100

p/n/q：带有翻页的命令，输p/n/q可以实现翻页或退出（上一页：p；下一页：n；退出：q）

## 查看参数说明
在输入任何命令之后添加 -h ，即可查看对应命令的参数说明，例如 aihc job list -h

```bash
# 获取任务列表命令的参数说明
$ aihc job list -h  
列出所有的训练任务。

Usage:
  aihc job list [flags]

Aliases:
  list, ls

Flags:
  -h, --help              help for list
  -n, --name string       任务名称关键字
      --order string      排序方式(asc/desc) (default "desc")
  -o, --order-by string   排序字段 (default "createdAt")
      --page int          页码 (default 1)
  -p, --pool string       资源池ID
  -q, --queue string      队列ID
      --size int          每页显示数量 (default 100)

Global Flags:
  -C, --config string   Global configuration file. (default "/Users/luyuchao/.aihc/config")
```

## 资源池相关操作
### 获取资源池列表
```bash
$ aihc pool list [flags]
 Flags:
  -h, --help                      help for list
  -w, --keyWord string            keyWord
  -k, --keyWordType string        keyWordType (default "resourcePoolName")
  -l, --limit int                 Number of resource pools to return (default 100)
      --offset int                Offset of the first resource pool to return
      --order string              Sort order (asc, desc) (default "ASC")
  -o, --orderBy string            Order by field (name, createTime) (default "createTime")
  -p, --pageNo int                Page number (default 1)
  -s, --pageSize int              Page size (default 50)
  -t, --resourcePoolType string   (common-自运维资源池,dedicatedV2-全托管资源池) (default "common")
```
* 命令示例
```bash
# 当存在多页数据时，可以输入 p/n 进行上一页/下一页翻页；输入 q 退出当前命令
$ aihc pool list 

Page 1 of 1 (Total items: 4)

NAME                                              ID             STATUS         NODE_COUNT     GPU_COUNT      CREATED_AT               
---------------------------------------------------------------------------------------------------------------------------------------
jun-gateway                                   cce-mj***fzk   running        1/2            4/8            2025-03-06 06:41:33      
lingang-hpas-runtime-02                         cce-zq***i4dy   running        1/1            0/0            2025-02-10 13:44:45      
lingang-hpas-runtime                            cce-4k***u9u   running        4/4            0/0            2025-02-10 12:19:42      
workflow-lijipeng                                 cce-5u***vro   running        4/4            0/0            2025-01-21 11:22:09          

Navigation:
  q - Quit

Enter command (p/n/q): 
```
### 获取资源池详情
```bash
$ aihc pool get [flags]
-h, --help          help for get
-p, --pool string   Resource pool ID 指定资源池ID
```
* 命令示例（获取指定资源池详情）
```bash
$ aihc pool get -p cce-mjtzk

resourcePool:
    metadata:
        createdAt: "2025-03-06T06:41:33Z"
        id: cce-mjtzk
        name: jun-gateway
        updatedAt: "2025-03-06T08:34:59Z"
    spec:
        associatedCpromIds: []
        associatedPfsId: ""
        createdBy: unpeng
        description: ""
        forbidDelete: true
        k8sVersion: 1.24.4
        region: bj
    status:
        gpuCount:
            total: 8
            used: 4
        gpuDetail:
            - gpudescriptor: baidu.com/l20_cgpu
              total: 8
              used: 4
        nodeCount:
            total: 2
            used: 1
        phase: running
```

* 命令示例（获取默认资源池详情）

```bash
# 当设置了默认资源池时，可以省略 -p/--pool 参数，工具直接使用默认资源池作为 -p/--pool参数
$ aihc pool get

resourcePool:
    metadata:
        createdAt: "2023-09-17T15:48:04Z"
        id: cce-4h***1m
        name: IAT-Regression-pei
        updatedAt: "2025-02-11T08:21:50Z"
    spec:
        associatedCpromIds:
            - cprom-xm1***3k3s7
        associatedPfsId: pfs-p***jz
        createdBy: ""
        description: ""
        forbidDelete: true
        k8sVersion: 1.20.8
        region: bj
    status:
        gpuCount:
            total: 16
            used: 1
        gpuDetail:
            - gpudescriptor: baidu.com/xpu
              total: 8
              used: 0
            - gpudescriptor: baidu.com/a800_80g_cgpu
              total: 8
              used: 1
        nodeCount:
            total: 3
            used: 1
        phase: running
```

## 队列相关操作
### 获取队列列表
```bash
aihc queue list/ls [flags]
Flags:
  -h, --help                 help for list
  -k, --keyword string       Keyword
  -t, --keywordtype string   Keyword type
  -r, --order string         Sort order
  -o, --orderby string       Sort field (default "dec")
  -n, --pagenumber int       Page number (default 3)
  -s, --pagesize int         Page size (default 100)
  -p, --pool string          Resource pool ID
```
* 命令示例（获取指定资源池的队列列表）
```bash
 $ aihc queue list -p cce-mjtzk
 
name                                state     queueType    reclaimable    disableOversell    createdTime              
openapi-regular--dtea               Open      Elastic      True           False              2025-03-16T19:47:18Z     
63a9f0ea7bb98050796b649e85481845    Open      Elastic      True           False              2025-03-14T03:47:13Z     
default                             Open      Elastic      True           False              2025-03-14T03:47:12Z         
```
* 命令示例（获取默认资源池队的列列表）

```bash
# 当设置了默认资源池时，可以省略 -p/--pool 参数，工具直接使用默认资源池作为 -p/--pool参数
$ aihc queue list

name                                state     queueType    reclaimable    disableOversell    createdTime              
openapi-regular--dtea               Open      Elastic      True           False              2025-03-16T19:47:18Z     
63a9f0ea7bb98050796b649e85481845    Open      Elastic      True           False              2025-03-14T03:47:13Z     
default                             Open      Elastic      True           False              2025-03-14T03:47:12Z 
```
### 获取队列详情
```bash
$ aihc queue get queueID [flags]
-h, --help          help for get
-p, --pool string   Resource pool ID 指定资源池ID
```
* 命令示例
```bash
$ aihc queue get 63a9f0ea7bb98050796b649e85481845 -p cce-2k9sw0cjaihc

$ aihc queue get 63a9f0ea7bb98050796b649e85481845 
```
## 任务相关操作
### 获取任务列表
```bash
$ aihc job list/ls [flags]
 
 Flags:
  -h, --help              help for list
  -n, --name string       任务名称关键字
      --order string      排序方式(asc/desc) (default "desc")
  -o, --order-by string   排序字段 (default "createdAt")
      --page int          页码 (default 1)
  -p, --pool string       资源池ID
  -q, --queue string      队列ID
      --size int          每页显示数量 (default 100)
```

* 命令示例（指定全托管资源池）

> 查询托管资源池下任务需指定 -p aihc-serverless

```bash
$ aihc job list -p aihc-serverless

Page 1 of 1 (Total items: 6)


NAME                                          JOB_ID                                             STATUS               CREATED_AT               
aihc-createjob-test                           pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59    Created              2025-02-17T07:59:35Z     
qwen2-vl-test-4-copy1                         pytorchjob-a53c413c-8e96-416b-8d6a-bc3e1b16a406    Succeeded            2025-01-01T13:22:19Z     
qwen2-vl-test-4                               pytorchjob-0389039d-aae5-4601-8e9e-fb230867baa4    ManualTermination    2025-01-01T12:00:52Z     
qwen2-vl-test-one-copy1                       pytorchjob-c9ac1567-4306-4085-8432-5305f4dc600f    ManualTermination    2024-12-31T15:22:26Z     
qwen2-vl-test-2                               pytorchjob-5c6c22c4-2c8d-49e7-8c2e-46e5fc2caa24    ManualTermination    2024-12-31T14:26:05Z     
qwen2-vl-test-one                             pytorchjob-ba8b2830-06c6-462f-aaf7-8c2513733482    Succeeded            2024-12-31T14:18:47Z     

Navigation:
q - Quit

Enter command (p/n/q): 
```

* 命令示例（指定自运维资源池）
```bash
$ aihc job list -p cce-2k0cj

Page 1 of 1 (Total items: 6)


NAME                                          JOB_ID                                             STATUS               CREATED_AT               
aihc-createjob-test                           pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59    Created              2025-02-17T07:59:35Z     
qwen2-vl-test-4-copy1                         pytorchjob-a53c413c-8e96-416b-8d6a-bc3e1b16a406    Succeeded            2025-01-01T13:22:19Z     
qwen2-vl-test-4                               pytorchjob-0389039d-aae5-4601-8e9e-fb230867baa4    ManualTermination    2025-01-01T12:00:52Z     
qwen2-vl-test-one-copy1                       pytorchjob-c9ac1567-4306-4085-8432-5305f4dc600f    ManualTermination    2024-12-31T15:22:26Z     
qwen2-vl-test-2                               pytorchjob-5c6c22c4-2c8d-49e7-8c2e-46e5fc2caa24    ManualTermination    2024-12-31T14:26:05Z     
qwen2-vl-test-one                             pytorchjob-ba8b2830-06c6-462f-aaf7-8c2513733482    Succeeded            2024-12-31T14:18:47Z     

Navigation:
q - Quit

Enter command (p/n/q): 
```
* 命令示例（默认资源池）
```bash
$ aihc job list

Page 1 of 1 (Total items: 6)


NAME                                          JOB_ID                                             STATUS               CREATED_AT               
aihc-createjob-test                           pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59    Created              2025-02-17T07:59:35Z     
qwen2-vl-test-4-copy1                         pytorchjob-a53c413c-8e96-416b-8d6a-bc3e1b16a406    Succeeded            2025-01-01T13:22:19Z     
qwen2-vl-test-4                               pytorchjob-0389039d-aae5-4601-8e9e-fb230867baa4    ManualTermination    2025-01-01T12:00:52Z     
qwen2-vl-test-one-copy1                       pytorchjob-c9ac1567-4306-4085-8432-5305f4dc600f    ManualTermination    2024-12-31T15:22:26Z     
qwen2-vl-test-2                               pytorchjob-5c6c22c4-2c8d-49e7-8c2e-46e5fc2caa24    ManualTermination    2024-12-31T14:26:05Z     
qwen2-vl-test-one                             pytorchjob-ba8b2830-06c6-462f-aaf7-8c2513733482    Succeeded            2024-12-31T14:18:47Z     

Navigation:
q - Quit

Enter command (p/n/q): 
```
### 单任务创建

> 当前版本的AIHC CLI工具创建任务是基于百舸OpenAPI v1实现，支持的任务参数、校验规则、格式与API一致，建议客户首先阅读 [API参考(v1)/训练任务相关接口/创建训练任务](https://cloud.baidu.com/doc/AIHC/s/pmb0c0o9q) 有助于快速上手创建任务命令

#### 直接传参方式创建任务
```bash
# 直接传参方式创建任务
aihc job create [flags]

Flags:
      --code-dir string               代码在容器中的挂载路径，默认为 /workspace
      --code-url string               代码URL,使用代码上传命令返回的URL
      --command string                指定训练任务的入口命令 (与--script-file二选一)
      --ds-mountpath string           数据源挂载路径
      --ds-name string                数据源名称
      --ds-sourcepath string          数据源挂载路径
      --ds-type string                数据源类型
      --enable-bccl                   是否启用BCCL,默认false
      --enable-fault-tolerance        是否启用容错功能,默认false
      --enable-rdma                   是否启用RDMA,默认false
      --env strings                   环境变量 (key=value)
      --fault-tolerance-args string   容错功能的详细参数
      --framework string              任务框架类型 (default "pytorch")
      --gpu strings                   GPU资源 (type=count)
  -h, --help                          help for create
      --host-network                  是否启用主机网络,默认false
      --image string                  容器镜像
  -f, --job-file strings              任务配置文件路径json/yaml
      --label strings                 标签 (key=value)
      --local-code string             本地代码路径，创建任务时会先上传代码
      --name string                   任务名称
  -p, --pool string                   资源池ID (如未指定则使用配置文件中的默认值)
      --priority string               任务优先级 (low/normal/high) (default "normal")
      --privileged                    是否启用特权模式,默认false
      --replicas int32                任务副本数 (default 1)
      --script-file string            命令脚本的路径，以脚本的方式指定训练任务的入口命令 (与--command二选一)
```
* 命令示例
```bash
$ aihc job create --local-code Aihc \
  --name cli-codeupload-test \
  --image registry.baidubce.com/inf-qa/nginx:latest \
  --framework PyTorchJob \
  --command "sleep 1d" \
  --replicas 4 \
  --privileged=true \
  --fault-tolerance-args="--enable-replace=true --enable-hang-detection=true --hang-detection-log-timeout-minutes=7 --hang-detection-startup-toleration-minutes=15 --hang-detection-stack-timeout-minutes=3 --max-num-of-unconditional-retry=2 --unconditional-retry-observe-seconds=3600 --custom-log-patterns=timeout1 --custom-log-patterns=timeout2 --enable-use-nodes-of-last-job=true --enable-checkpoint-migration=true --internal-fault-tolerance-alarm-phone=10086,10010" \
  --priority high \
  --enable-bccl=false \ 
  --enable-fault-tolerance=true \ 
  --local-code /codeDir/file --code-dir /workspace #代码路径  #代码上传挂载目录
  -p cce-cm1jjxrq
```

#### 使用任务模板创建任务

* 命令示例（使用JSON格式模板）

```bash
# 支持使用json格式文件传递参数，详见参数模板，创建任务支持的参数详见创建任务接口参数：https://cloud.baidu.com/doc/AIHC/s/jm56inxn7
# 接口请求body参数的json文件，需将在命令行运行的主机上先创建好任务信息
$ aihc job create -f job_info.json

# 使用command文件保存启动命令
$ aihc job create -f job_info.json --script-file command.txt

#创建任务时上传代码

$ aihc job create -f job-info.yaml --local-code /file/path #本地代码路径
```

* 上传代码

```bash
# 使用命令上传代码
aihc code upload --folder /code/filepath

Usage:
  aihc code upload [flags]

Flags:
  -f, --folder string   指定要上传的代码文件夹路径
  -h, --help            help for upload
  -p, --pool string     指定资源池ID，如未指定则使用配置文件中的默认值
  -q, --queue string    指定队列ID
```
JSON格式任务参数参考模板：

```json
{
  "name": "qwen2-vl-test-4-copy2",
  "queue": "",
  "jobFramework": "pytorch",
  "jobSpec": {
    "command": "cd /data \u0026\u0026 mkdir qwen2-vl\n\ncp /mnt/ca-p800-poc/llava-en-zh-300k.tar.gz /data/qwen2-vl/\n#cp /mnt/ca-p800-poc/llava-en-zh-2k.tar.gz /data/qwen2-vl/\ncd /data/qwen2-vl\n\ntar -zxvf llava-en-zh-300k.tar.gz \u0026\u0026 rm llava-en-zh-300k.tar.gz\n#tar -zxvf llava-en-zh-2k.tar.gz \u0026\u0026 rm llava-en-zh-2k.tar.gz\n\n# code\ncp /mnt/ca-p800-poc/models/qwen2-vl.tar.gz /home/\ncd /home/\ntar -zxvf qwen2-vl.tar.gz \u0026\u0026 rm qwen2-vl.tar.gz\n\n# model weights\ncp /mnt/ca-p800-poc/Qwen2-VL-7B-Instruct.tar.gz .\ntar -zxvf Qwen2-VL-7B-Instruct.tar.gz \u0026\u0026 rm Qwen2-VL-7B-Instruct.tar.gz\n\n#train lora\ncd /home/qwen2-vl/\nconda activate llamafactory_env\nexport PATH=/root/miniconda/envs/llamafactory_env/bin:$PATH\nexport PYTHONPATH=$PYTHONPATH:/home/qwen2-vl/\n\napt-get install dnsutils -y\npip install deepspeed==0.14.5\n\nsource env.sh\nnohup bash dist_train.sh lora \u0026\n\nsleep 100000",
    "image": "ccr-2ccrtest-vpc.cnc.bj.baidubce.com/yetao04-ca-test/qwen2vl_p800_image:v1.0",
    "imageConfig": {
      "username": "",
      "password": ""
    },
    "replicas": 4,
    "resources": [
      {
        "name": "kunlunxin.com/xpu",
        "quantity": 8
      },
      {
        "name": "sharedMemory",
        "quantity": 1024
      }
    ],
    "envs": [
      {
        "name": "AIHC_JOB_NAME",
        "value": "qwen2-vl-test-4-copy1"
      },
      {
        "name": "NCCL_IB_DISABLE",
        "value": "0"
      }
    ],
    "enableRDMA": true,
    "hostNetwork": false
  },
  "faultTolerance": false,
  "labels": [
    {
      "key": "aijob.cce.baidubce.com/ai-user-id",
      "value": "ac3553acbb8d4c5e9b212fc0a04c8f7d"
    },
    {
      "key": "aijob.cce.baidubce.com/ai-user-name",
      "value": "daichaonan"
    },
    {
      "key": "aijob.cce.baidubce.com/create-from-aihcp",
      "value": "true"
    },
    {
      "key": "aijob.cce.baidubce.com/openapi-jobid",
      "value": "pytorchjob-a53c413c-8e96-416b-8d6a-bc3e1b16a406"
    }
  ],
  "priority": "high",
  "datasources": [
    {
      "type": "pfsl1",
      "sourcePath": "/yetao04",
      "mountPath": "/mnt",
      "name": "pfs-zesqWP",
      "options": {
        "sizeLimit": 1000,
        "medium": "",
        "readOnly": false,
        "pfsL1ClusterIp": "172.16.0.221",
        "pfsL1ClusterPort": "8888"
      }
    },
    {
      "type": "hostpath",
      "sourcePath": "/ssd1",
      "mountPath": "/data",
      "name": "hostpath-1",
      "options": {
        "sizeLimit": 0,
        "medium": "",
        "readOnly": false
      }
    }
  ],
  "faultToleranceConfig": {
    "enabledHangDetection": false,
    "hangDetectionTimeoutMinutes": 0,
    "faultToleranceLimit": 0,
    "customFaultTolerancePattern": null
  },
  "alertConfig": null,
  "enableBccl": false
}
```
* 命令示例（使用YAML格式模板）
```bash
支持使用yaml格式文件传递参数，详见参数模板，创建任务支持的参数详见创建任务接口参数：https://cloud.baidu.com/doc/AIHC/s/jm56inxn7
# 接口请求body参数的yaml文件
$ aihc job create -f ./job_info.yaml

# 创建任务时上传代码及使用command文件保存启动命令
$ aihc job create -f job_info.yaml --local-code folder --script-file command.txt
```
YAML格式任务参数参考模板：

```yaml
name: qwen2-vl-test-4-cli-test
queue: ""
jobFramework: pytorch
jobSpec:
  command: |
    sleep 100000
  image: ccr-2ccrtest-vpc.cnc.bj.baidubce.com/yetao04-ca-test/qwen2vl_p800_image:v1.0
  imageConfig:
    username: ""
    password: ""
  replicas: 4
  resources:
    - name: kunlunxin.com/xpu
      quantity: 8
    - name: rdma/hca
      quantity: 1
    - name: sharedMemory
      quantity: 1024
  envs:
    - name: AIHC_JOB_NAME
      value: qwen2-vl-test-4-copy1
    - name: NCCL_IB_DISABLE
      value: "0"
  enableRDMA: true
  hostNetwork: false
faultTolerance: true
labels:
  - key: aijob.cce.baidubce.com/ai-user-id
    value: ac3553acbb8d4c5e9b212fc0a04c8f7d
  - key: aijob.cce.baidubce.com/ai-user-name
    value: daichaonan
  - key: aijob.cce.baidubce.com/create-from-aihcp
    value: "true"
  - key: aijob.cce.baidubce.com/openapi-jobid
    value: pytorchjob-a53c413c-8e96-416b-8d6a-bc3e1b16a406
priority: high
codeSource:
  mountPath: /workspace
datasources:
  - type: hostpath
    sourcePath: /
    mountPath: /mnt/rapidfs
    name: rapidfs-p800
enableBccl: false
faultToleranceArgs: "--enable-replace=true --enable-hang-detection=true --hang-detection-log-timeout-minutes=7 --hang-detection-startup-toleration-minutes=15 --hang-detection-stack-timeout-minutes=3 --max-num-of-unconditional-retry=2 --unconditional-retry-observe-seconds=3600 --custom-log-patterns=timeout1 --custom-log-patterns=timeout2 --enable-use-nodes-of-last-job=true --enable-checkpoint-migration=true --internal-fault-tolerance-alarm-phone=10086,10010"
```
### 批量任务提交
```bash
aihc job create -f job-1.yaml -f job-2.yaml ..-f ..
```
* 命令示例
```bash
$ aihc job create -f ./job-1.yaml -f ./job-2.yaml
```
### 删除训练任务
```bash
aihc job delete jobID [flags]
  -h, --help          help for delete
  -p, --pool string   资源池ID
```
* 示例命令
```bash
# 删除指定资源池下任务
$ aihc job delete pytorchjob-c0d3504cfd-b44b-6dd7c39dde59 -p cce-2k0cj

# 删除默认资源池下任务
$ aihc job delete pytorchjob-c0d3504cfd-b44b-6dd7c39dde59
```
### 停止训练任务
```bash
aihc job stop jobID [flags]

Flags:
  -h, --help          help for stop
  -p, --pool string   资源池ID
```
* 示例命令
```bash
# 停止指定资源池下任务
$ aihc job stop pytorchjob-c0d3504cfd-b44b-6dd7c39dde59 -p cce-2k0cj

# 停止默认资源池下任务
$ aihc job stop pytorchjob-c0d3504cfd-b44b-6dd7c39dde59
```
### 获取任务详情
```bash
aihc job get jobID [flags]
Flags:
  -h, --help          help for get
      --pods          是否展示作业的实例信息
  -p, --pool string   资源池ID
  -s, --status        显示任务状态简要信息
```
* 示例命令
```bash
# 获取默认资源池下指定任务详情
$ aihc job get pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59

# 获取指定资源池下指定任务详情
$ aihc job get pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59 -p cce-2k9sw0cj

Using default pool ID from config: cce-4hw7gn1m
failed to get job details: [Code: cce.warning.GetAIJobByJobIdFailed; Message: get job by jobid failed, err: pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59 not found job; RequestId: a17a6ab1-9045-4346-9f1a-53733c621321]
(base) luyuchao@luyuchaodeMacBook-Pro ~ % aihc job get pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59 -p cce-2k9sw0cj
openapigetjobresponseresult:
    jobid: pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59
    name: aihc-createjob-test
    resourcepoolid: cce-2k9sw0cj
    command: sleep 100
    createdat: "2025-02-17T07:59:35Z"
    finishedat: ""
    runningat: ""
    scheduledat: ""
    datasources: []
    enablefaulttolerance: false
    customfaulttolerancepattern: []
    labels:
        - key: aijob.cce.baidubce.com/ai-user-id
          value: eca97e148cb74e9683d7b7240829d1ff
        - key: aijob.cce.baidubce.com/ai-user-name
          value: root
        - key: aijob.cce.baidubce.com/create-from-aihcp-api
          value: "true"
        - key: aijob.cce.baidubce.com/openapi-jobid
          value: pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59
        - key: key
          value: value
    priority: high
    queue: default
    status: Created
    image: registry.baidubce.com/aihc-aiak/aiak-training-llm
    resources:
        - name: baidu.com/a100_80g_cgpu
          quantity: 8
    enablerdma: false
    hostnetwork: false
    replicas: 2
    envs:
        - name: AIHC_JOB_NAME
          value: aihc-createjob-test
        - name: AIHC_TENSORBOARD_LOG_PATH
          value: ""
        - name: CUDA_DEVICE_MAX_CONNECTIONS
          value: "1"
        - name: NCCL_DEBUG
          value: INFO
    jobframework: pytorch
    queueingsequence: null
    enablebccl: false
    enablebcclstatus: unknown
    enablebcclerrorreason: ""
    k8suid: 3168a331-b584-46c6-b6cc-b01214e217a7
    k8snamespace: default
podlist:
    listmeta:
        totalitems: 0
    pods: []

```
### 查询任务状态
```bash
aihc job get jobID --status/-s 
```
* 示例命令
```bash
$ aihc job get pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59 -p cce-2k9sw0cj -s
name                           priority             pool/queue           replicas             status               runningAt            scheduledAt          createdAt           
aihc-createjob-test            high                 cce-2k9sw0cj/default 2                    Created                                                        2025-02-17T07:59:35Z
```
### 查询任务实例列表
```bash
aihc pod list jobID
```
* 示例命令
```bash
# 查询指定资源池下指定任务的实例列表
$ aihc pod list pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59 -p cce-2k9sw0cj

# 查询默认资源池下指定任务的实例列表
$ aihc pod list pytorchjob-a3a7f6cf-43c9-4792-b0e7-fdb454a7555b

replicaType    name                          namespace    podPhase    status    creationTimestamp
master         pxy-moe-48hours-cpu-master-0  default      Running     Running   2024-12-17T13:22:41Z
```
### 连接任务实例
```bash
aihc job exec jobID [flags]

Flags:
  -c, --container string   容器名称
  -h, --help               help for exec
  -i, --interactive        保持标准输入打开
  -n, --namespace string   命名空间 (默认为 default)
  -p, --pool string        资源池ID
  -t, --tty                分配伪终端
```
* 示例命令
```bash
$ aihc job exec pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59 -it pxy-moe-48hours-cpu-master-0  bin/bash
```
### 复制任务配置
```bash
aihc job export jobID [flags]

Flags:
  -h, --help          help for export
  -p, --pool string   资源池ID
```
* 示例命令
```bash
$ aihc job export pytorchjob-c0d35053-229d-4cfd-b44b-6dd7c39dde59
```
### 查询任务日志
```bash
aihc job logs jobID [flags]

Flags:
  -c, --chunk string        输出日志按着chunk数进行汇聚,例如将10行日志为1条记录,默认0
      --filepath string     日志文件路径
  -h, --help                help for logs
      --log-source string   日志来源,例如node
      --marker string       日志的起始位置,用于分页查询
  -m, --max-lines string    日志的最大行数
  -n, --namespace string    命名空间 (默认为 default)
      --podname string      Pod名称
  -p, --pool string         资源池ID
  -q, --queue string        队列ID
  -s, --start-time string   日志的起始时间,unix时间戳
```
* 示例命令
```bash
$ aihc job logs pytorchjob-a3a7f6cf-43c9-4792-b0e7-fdb454a7555b --podname ui-test-test-running-master-0 -p cce-hcuw9ybk
```