百舸工作流使用YAML格式定义，通过编排YAML配置文件配置工作流任务参数、任务串行/并行/菱形等结构关系。

## 基本结构

工作流的定义包含三部分：

* 工作流全局配置：工作流全局生效的配置项，包括version、kind、inputs等
* 任务模板：任务的配置模板，工作流中的每个任务均作为一个[分布式训练任务](https://cloud.baidu.com/doc/AIHC/s/Tlib5k9l1)，任务模板中定义配置信息以及输入参数
* 任务编排：通过引用任务配置模板定义每个节点运行的内容，并编排节点的执行顺序与依赖关系

如下是一个工作流配置yaml的基本结构，其中：

* `inputs`定义了工作流的全局输入参数
* `taskTemplates` 定义任务的配置，详细参数说明参考 [API参考/分布式训练相关接口/创建训练任务](https://cloud.baidu.com/doc/AIHC/s/Hmayv96tj) 接口参数
* `tasks`中编排了工作流中任务的任务执行顺序与依赖关系，并定义了每个任务节点的输入值

```yaml
version: v1 
kind: PipelineTemplate  
inputs:
    ...
taskTemplates:
    ...
tasks:
    ...
```
## YAML配置文件示例

> 1. 所有示例中的queue（队列ID）等参数，使用时需要替换成工作流所在资源池下的某个队列ID
> 2. 为了方便说明，示例中的模板（taskTemplate）使用了最小化参数，完整的任务参数模板参考下方`通用任务模板`
> 3. 当前仅支持CustomTask一种工作流任务类型，即仅支持百舸分布式训练任务

### 创建一个单任务工作流

#### **定义任务模板**

```yaml
...
taskTemplates:
- name: hello_world_temp
  type: CustomTask
  spec: #任务参数信息，与创建分布式训练任务接口参数相同
    queue: aihc-g8u9xas #替换为实际的队列ID
    jobType: PyTorchJob
    command: sleep 30s
    jobSpec:
      replicas: 1
      image: registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release
      resources: []
      envs:
        - name: NCCL_DEBUG
          value: DEBUG
        - name: NCCL_IB_DISABLE
          value: '0'
    labels: []
    datasources: [] #存储挂载
    ...
...
```

#### 任务编排

```yaml
...
tasks:
- name: hello_world # 节点名
  taskTemplateName: hello_world_temp # 引用的任务模板名称
...
```

#### 完整工作流YAML

> 以下工作流包含一个任务节点（该任务在休眠30s后自动结束）

```yaml
version: v1 
kind: PipelineTemplate    
taskTemplates:
- name: hello_world_temp
  type: CustomTask
  spec:            
    queue: aihc-g8u9xas
    jobType: PyTorchJob
    command: /bin/bash -c "echo 'I am a aihc-workflow test job' && sleep 30s"
    jobSpec:
      replicas: 1
      image: registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release
      resources: []
      envs:
        - name: NCCL_DEBUG
          value: DEBUG
        - name: NCCL_IB_DISABLE
          value: '0'
    labels: []
    datasources: []
tasks:
- name: hello_world
  taskTemplateName: hello_world_temp
```

### 创建任务A串联任务B的线性工作流

#### 定义任务模板

```yaml
...
taskTemplates:
  - name: demo
    type: CustomTask
    spec:
        queue: aihc-g8u9xas
        jobType: PyTorchJob
        command: /bin/bash -c "echo 'I am a aihc-workflow test job' && sleep 30s"
        jobSpec:
          replicas: 1
          image: registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release
          resources: []
          envs:
            - name: NCCL_DEBUG
              value: DEBUG
            - name: NCCL_IB_DISABLE
              value: '0'
        labels: []
        datasources: []
        ...
...
```

#### **任务编排**

定义每个节点引用的任务模板，以及节点间的依赖关系

```yaml
...
tasks:
  - name: task_a             
    taskTemplateName: demo # 引用demo中定义的任务配置
  - name: task_b
    taskTemplateName: demo
    dependencies: # 指定任务上游依赖
    - task_a # 依赖 task_a 运行结束
...
```

#### 完整工作流YAML
```yaml
version: v1 
kind: PipelineTemplate    
taskTemplates:
  - name: demo
    type: CustomTask
    spec:
        queue: aihc-g8u9xas
        jobType: PyTorchJob
        command: /bin/bash -c "echo 'I am a aihc-workflow test job' && sleep 30s"
        jobSpec:
          replicas: 1
          image: registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release
          resources: []
          envs:
            - name: NCCL_DEBUG
              value: DEBUG
            - name: NCCL_IB_DISABLE
              value: '0'
        labels: []
        datasources: []
tasks:
- name: task_a             # A节点名称
  taskTemplateName: demo   # 引用的任务模板名称
- name: task_b             # B节点名称
  taskTemplateName: demo   # 引用的任务模板名称
  dependencies:            # 指定任务上游依赖
  - task_a                 # 依赖task_a运行结束后开始执行
```
### 配置工作流输入参数
以上我们知道工作流中的每一个任务节点必须引用某个任务模板（taskTemplate），在实际业务流程中当我们基于某个任务模版向工作流中添加任务节点，尤其复杂工作流中基于相同任务模板添加多个任务时，一般需要通过个性配置全局工作流输入参数，之后可以在子任务中引用工作流的输入作为个性化参数

> 一般简单工作流中也可以使用taskTemplate与task一对一的关系，在taskTemplate中直接定义任务参数，复杂工作流时则可使用输入参数简化操作
#### **定义全局输入参数**
在顶层的inputs字段定义参数，可以在全局被任务模板和任务引用

```yaml
...
# 定义 Pipeline 的输入参数
inputs:
- name: image_url  # 参数名
  type: string     # 参数类型
  hint: 镜像地址    # 参数描述
  defaultValue: registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release # 参数默认值
- name: command
  type: string
  hint: 启动命令
  ...
```
#### **定义任务模板输入参数**

在任务模板中定义任务输入参数，之后可以在不同的任务中通过输入参数设置不同的值

- 使用inputs.parameters索引模板中定义的input变量


```yaml
...
taskTemplates:
  ...
  # 定义工作流中的任务模板的输入参数
  inputs:
  - name: queue_id # 参数名
    type: string              # 参数类型
    hint: 队列ID             # 参数描述
    defaultValue: aihcq-xxxx    # 参数默认值
  - name: image_url  
    type: string     
    hint: 镜像地址   
  - name: command
    type: string
    hint: 启动命令
  spec:            
    queue: '{{inputs.parameters.queue_id}}'
    jobType: PyTorchJob
    command: '{{inputs.parameters.command}}'
    jobSpec:
      replicas: 1
      image: '{{inputs.parameters.image_url}}'
      resources: []
      envs:
        - name: NCCL_DEBUG
          value: DEBUG
        - name: NCCL_IB_DISABLE
          value: '0'
      enableRDMA: true
    labels: []
    datasources: []
    ...
    
  ...
  
...
```
#### **任务编排**

* 定义每个任务引用的任务模板，以及节点间的依赖关系
* 引用全局输入参数（使用pipeline.inputs.parameters索引全局input变量），传入子任务模版所需输入参数

```yaml
...
tasks:
- name: task_a                  
  taskTemplateName: task_demo 
  inputs:
  - name: image_url
    value: '{{pipeline.inputs.parameters.image_url}}' # 引用 Pipeline 定义的 name 为 image_url 的输入参数
  - name: command
    value: '{{pipeline.inputs.parameters.command}}'
  # 未声明的输入参数，将使用模板定义的默认值，如 resource_pool_id、queue_id
- name: task_b
  taskTemplateName: task_demo
  dependencies:                
  - task_a                     
  inputs:
  - name: image_url
    value: '{{pipeline.inputs.parameters.image_url}}'
  - name: command
    value: echo "task b!"     # 使用常量 重写模板定义的 name 为 command 的输入参数
  - name: queue_id # 重写模板定义的 name 为 queue_id 输入参数的默认值
    value: q-xxxxx
  ...
```

#### 完整工作流YAML

```yaml
version: v1
kind: PipelineTemplate
# 定义全局（Pipeline）的输入参数
inputs:
- name: image_url  # 参数名
  type: string     # 参数类型
  hint: 镜像地址    # 参数描述
  defaultValue: registry.baidubce.com/aihc-aiak/aiak-megatron:ubuntu20.04-cu11.8-torch1.14.0-py38_v1.2.7.12_release # 参数默认值
- name: command
  type: string
  hint: 启动命令
  defaultValue: echo "This is a globally defined command."
taskTemplates:
- name: task_demo
  type: CustomTask
  # 定义工作流中的节点模板的输入参数
  inputs:
  - name: queue_id # 参数名
    type: string # 参数类型
    hint: 队列ID # 参数描述
    defaultValue: aihcq-xxxx # 参数默认值  
  - name: image_url  
    type: string     
    hint: 镜像地址   
  - name: command
    type: string
    hint: 入口命令
  spec:
    queue: '{{inputs.parameters.queue_id}}'
    jobType: PyTorchJob
    command: '{{inputs.parameters.command}}'
    jobSpec:
      replicas: 1
      image: '{{inputs.parameters.image_url}}'
      resources: []
      envs:
        - name: NCCL_DEBUG
          value: DEBUG
        - name: NCCL_IB_DISABLE
          value: '0'
    labels: []
    datasources: []    
tasks:
- name: task_a                  
  taskTemplateName: task_demo 
  inputs:
  - name: image_url
    value: '{{pipeline.inputs.parameters.image_url}}' # 引用全局（Pipeline）定义的 name 为 image_url 的输入参数作为任务参数
  - name: command
    value: '{{pipeline.inputs.parameters.command}}'
  # 未声明的输入参数，将使用模板定义的默认值，如 queue_id
- name: task_b
  taskTemplateName: task_demo
  dependencies:                
  - task_a                     
  inputs:
  - name: image_url
    value: '{{pipeline.inputs.parameters.image_url}}'
  - name: command
    value: echo "This is a task b's command."     # 使用常量 重写模板定义的 name 为 command 的输入参数
  - name: queue_id # 重写模板定义的 name 为 queue_id 输入参数的默认值
    value: aihcq-xxxx2
```

### 任务编排示例
工作流支持串行、并行、菱形运行结构：

* 串行：串行关系的任务依次执行，上游任务执行完才会启动下游任务
* 并行：任务同时运行
* 菱形：上游任务执行完成开始并行执行多个任务，以上多个任务全部执行完成开始继续执行下游任务

#### **串行任务**

**定义一个包含三个任务节点的工作流，三个任务节点依次串行执行**

```yaml
version: v1 
kind: PipelineTemplate    
# 定义工作流中的任务模板
taskTemplates:
- name: demo
  type: CustomTask
  spec:
    ...
# 定义工作流中的子任务及运行结构
tasks:
- name: task_a             
  taskTemplateName: demo 
- name: task_b
  taskTemplateName: demo
  dependencies:            
  - task_a                 
- name: task_c
  taskTemplateName: demo
  dependencies:            
  - task_b                

# +---------+
# |  task_a |
# +----+----+
#      |
# +----v----+
# |  task_b |
# +----+----+
#      |
# +----v----+
# |  task_c |
# +---------+
```
#### **并行任务**

**定义一个包含三个任务节点的工作流，三个任务节点同时并行执行**

```yaml
version: v1 
kind: PipelineTemplate    
# 定义工作流中的任务模板
taskTemplates:
- name: demo
  type: CustomTask
  spec:
    ...
# 定义工作流中的子任务及运行结构
tasks:
- name: task_a             
  taskTemplateName: demo 
- name: task_b
  taskTemplateName: demo           
- name: task_c
  taskTemplateName: demo 

# +--------+   +--------+   +--------+
# | task_a |   | task_b |   | task_c |
# +--------+   +--------+   +--------+
```
#### **菱形任务**

**定义一个包含4个节点的菱形工作流**

task_a执行完之后并行执行task_b和task_c，两个并行任务都执行完之后执行task_d

```yaml
version: v1 
kind: PipelineTemplate    
# 定义工作流中的任务模板
taskTemplates:
- name: demo
  type: CustomTask
  spec:
    ...
# 定义工作流中的子任务及运行结构
tasks:
- name: task_a             
  taskTemplateName: demo
- name: task_b
  taskTemplateName: demo    
  dependencies:            
  - task_a                 
- name: task_c
  taskTemplateName: demo
  dependencies:            
  - task_a           
- name: task_d
  taskTemplateName: demo
  dependencies:            
  - task_b
  - task_c          

#       +--------+   
#       | task_a |  
#       +--------+   
#        /      \
# +--------+   +--------+
# | task_b |   | task_c |
# +--------+   +--------+
#        \      /
#       +--------+   
#       | task_d |  
#       +--------+
```
