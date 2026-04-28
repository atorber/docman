全托管资源池支持物理队列CPU节点的弹性伸缩（基于CCE节点组能力）PRD

# 版本记录
|**版本**|**状态（新增/修改/删除）**|**简要说明**|**修订人**|**修订时间**|**审批人**|**审批时间**|
|-|-|-|-|-|-|-|
|v1.0|新增|全托管资源池物理队列增加CPU弹性伸缩能力|马庆丽|2025-12-25|||
|V1.1|修改|节点规格新增【弹性扩容节点】|马庆丽|2025-01-15|||
|V1.2|修改|1. 配置主、配机型（10种）改为第一期只支持配置一种机型2. 开启弹性伸缩能力，只能在创建队列或者空队列开启，开启弹性伸缩的队列不支持手动移入节点|马庆丽|2025-03-03|||
|V1.3 |修改|增加针对开启弹性伸缩能力的队列的删除逻辑|马庆丽|2026-04-08|||

# 关联卡片
[[aihc-dev-15320] 全托管队列支持弹性伸缩功能](https://console.cloud.baidu-int.com/devops/icafe/issue/aihc-dev-15320/show?source=copy-shortcut?t=mention&mt=doc&dt=sdk)

# 适用场景
当前百舸平台的**全托管资源池物理队列**仅支持**手动扩缩容**（需提前将节点购买到资源池，然后用户需显式添加/移出节点）。在以下典型业务场景中，用户亟需自动化能力：

* **任务排队积压**：当队列中待调度任务数量激增，人工响应滞后，影响业务 SLA。
* **资源利用率低谷**：夜间或业务低峰期存在大量空闲节点，造成成本浪费。
* **运维人力成本高**：需专人监控负载并手动操作，难以规模化管理。

> ✅ **核心价值**：通过自动扩缩容实现 **“按需用资源、不用即释放”**，提升资源利用率、降低运营成本、增强平台智能化水平。


**目前新石器和京东提出了明确的需求，需要弹性伸缩的能力。**

# 需求背景
## 名词解释
|名词|解释|
|-|-|
|**节点组（Node Group）**|CCE 中的逻辑节点集合，具备统一模板、批量运维、弹性伸缩能力。**百舸未向用户暴露此概念，但内部以节点组为扩缩容单位。**|
|**节点扩缩容**|向队列中添加（扩容）或移出（缩容）节点，改变实际可用节点数。|
|**弹性伸缩**|基于业务负载指标（如排队任务数、CPU /内存利用率）自动触发的扩缩容行为。|
|**节点组容量上限**|单个节点组允许的最大节点数（出于稳定性考虑设限）。|
|**单次扩容限制**|每次自动扩容最多新增的节点数（防误操作/成本爆炸，如 L1000/L3000/L5000 集群分级控制）。|
|**自动伸缩最大范围**|开启弹性后，节点组可自动扩展到的上限（≤ 容量上限）。|
|**单次操作**|一次完整的扩缩周期 = 1 次扩容 +  1 次缩容。|

## 业务需求与问题分析
#### 目标客群
* 使用百舸全托管资源池运行**批处理训练/推理任务**的企业客户。
* 对**成本敏感**、追求**高资源利用率**的 AI 团队。

#### 核心痛点
* 手动扩缩容响应慢、易遗漏，导致：
    * 任务排队延迟 → 影响模型迭代效率；
    * 空闲节点持续计费 → 成本不可控。


#### 产品升级思路
**以“节点组”为弹性单元，在****物理队列****层面集成自动扩缩容策略**，实现：

* 扩容：当触发扩容策略 → 自动购买 CPU /GPU（A10）节点加入队列；
* 缩容：当节点资源分配率（cce中被称为请求率，即单资源请求量÷单资源总量*100%） < 阈值 → 自动退订节点；
* 节点缩容保护机制：支持对关键节点开启“缩容保护”，避免误删；
* 记录弹性伸缩活动记录，方便审计；
* 用户在开启弹性伸缩的队列中提交工作负载的提示升级
* 针对CPU队列的监控升级

## 竞品分析
|阿里PAI|火山机器学习平台|
|-|-|
|[https://help.aliyun.com/zh/pai/user-guide/work-with-the-public-resource-group?spm=a2c4g.11186623.help-menu-search-30347.d_0](https://help.aliyun.com/zh/pai/user-guide/work-with-the-public-resource-group?spm=a2c4g.11186623.help-menu-search-30347.d_0)* 弹性方案    * 公共资源组 + 竞价实例    * EAS 服务支持“弹性资源池”* 特点    * 扩容不足时自动切到公共资源（按量付费）    * 缩容优先释放公共资源实例阿里PAI是通过**公共资源以及竞价实例（抢占式实例）**的形式实现的。![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=00e2aed7753445cc8e9f6b5edb30fdfe&docGuid=Y7gIFP3S5lhJ71)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=0846f9cdf330439e9298de4966cf07c7&docGuid=Y7gIFP3S5lhJ71)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=526ee9c6248b417e824df733f48d3dd6&docGuid=Y7gIFP3S5lhJ71)[https://help.aliyun.com/zh/pai/user-guide/elastic-resource-pool?spm=a2c4g.11186623.help-menu-30347.d_3_3_12_2.6e012838xdMItd](https://help.aliyun.com/zh/pai/user-guide/elastic-resource-pool?spm=a2c4g.11186623.help-menu-30347.d_3_3_12_2.6e012838xdMItd)EAS在线服务中支持开启【弹性资源池】，打开**弹性资源池**开关，并选择公共资源组**资源规格**，为部署在专属资源组中的服务开启弹性资源池能力。完成弹性资源池配置后，服务扩容时遇到机器资源不足，新扩出的实例会自动启动在已配置的按量付费公共资源上，并以公共资源组的方式进行计费。在缩容时，优先缩减公共资源组中的服务实例。![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=55af874af08a487eacd25b787fee648a&docGuid=Y7gIFP3S5lhJ71)|火山机器学习平台通过预约计划+后付费模式，支持弹性资源。支持周期型重复预约以及定时时段型预留资源，适合规律性负载。![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f53d812b375e40dcb7c39501a2b37e7d&docGuid=Y7gIFP3S5lhJ71)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=36e58652863b4a5c94316d05e3cd616f&docGuid=Y7gIFP3S5lhJ71)|
|||

[阿里云弹性节点池产品&技术调研](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/5QlZvzqzXY/uW5of8ErgZIYu0?t=mention&mt=doc&dt=doc)



CCE节点组弹性伸缩能力调研：

文档链接：

* [https://cloud.baidu.com/doc/CCE/s/0kisn2q5c](https://cloud.baidu.com/doc/CCE/s/0kisn2q5c) 
* [https://cloud.baidu.com/doc/CCE/s/3jwvy1gyu](https://cloud.baidu.com/doc/CCE/s/3jwvy1gyu)
* **集群资源水位触发弹性伸缩**

[流程图]
|* 支持针对节点组【配置弹性伸缩】；    * 创建节点组即可开启    * 对已有节点组进行开启* 针对本节点组设置伸缩范围 * 扩容优先级：在资源池多节点组之间生效* 节点组支持设置主备机型，支持按照主备机型扩容；支持多子网，支持按照子网分布均衡扩容|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=c19b21a48acc4ccbacea4cb2041a2215&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=58473b47a54849d09f09c76848601192&docGuid=Uu_BZHAE3xMM-O)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=9f60728544bb4244a60b926eef3321c5&docGuid=ib3qUzdKraFMrV)|
|-|-|
|支持手动伸缩；手动伸缩和弹性伸缩的能力是互斥的|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=c4fc22e21eed4c02b484d650d0122bda&docGuid=Uu_BZHAE3xMM-O)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=7cb10487fcdc48c9a5ee29858744f13c&docGuid=Uu_BZHAE3xMM-O)|
|支持基于资源池的所有节点组设置弹性伸缩功能；自动缩容的配置是资源池/集群粒度生效的|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=5ffd47e875c3418db94abf7dd8fadea2&docGuid=Uu_BZHAE3xMM-O)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=eb168ed117df46148246ca64deb32c4c&docGuid=Uu_BZHAE3xMM-O)|
|支持针对节点的缩容保护|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=925ee346670e4c97a56b7e443705c421&docGuid=Uu_BZHAE3xMM-O)|
|支持查看伸缩活动历史：包括手动伸缩&自动伸缩活动历史支持部分成功|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b0c45f132a304279983420348685b048&docGuid=Uu_BZHAE3xMM-O)|
|订单，生成BCC订单，包含云盘订单|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=5ad7139c0ab04ce79da56c7090d1949d&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f150610aca5f46b9901be331836cb7ae&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f084a8f702b843a9b35fd0eb183ef9dc&docGuid=ib3qUzdKraFMrV)|

## 产品建设目标
1. **功能目标**：在百舸全托管资源池的物理队列上，**支持基于 CPU 节点组的自动弹性伸缩**。
2. **体验目标**：用户可通过控制台一键开启/配置弹性策略，无需感知底层节点组概念。
3. **稳定性目标**：扩缩容操作幂等、可追溯，~~失败可告警（本期暂不支持，只在伸缩活动中查看即可）~~，不影响现有任务调度。

    * 在扩缩容场景下，“操作幂等”意味着：
        * 如果由于网络超时、系统重试等原因，**同一个扩容或缩容请求被多次提交**，
        * 系统应确保**不会重复创建或删除节点**，
        * 最终状态与只执行一次该操作的结果完全相同。


# 概要设计
## 产品架构设计
物理队列与节点组的关系 [弹性节点组实现思路](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/5QlZvzqzXY/AXUH82mvJi9jix?t=mention&mt=doc&dt=doc)

* 当前模型

[流程图]


* 目标模型
    * 物理队列 VS 节点组 => 1:1  ✅ 
        * 百舸物理队列：
            * 支持添加CPU、内存不一致的节点规格到同一个队列；
            * 必须是同可用区；
            * 预付费节点和按量付费节点支持添加到同一个队列中；
            * 只能购买AIHC的节点

        * CCE节点组：
            * 机型配置是同构的，备选机型必须与主机型规格（CPU、内存、架构、GPU卡数）相同，最多支持添加10个备选机型；
                * 支持为每一个机型配置子网

            * 节点计费必须一致（全部是预付费或按量付费）
            * 可以跨可用区
            * 当前仅支持购买BCC、EBC、BBC、HPAS等节点。

        * 开启弹性伸缩的物理队列：
            * 机型配置是同构的，备选机型必须与主机型规格（CPU、内存、架构~~、GPU卡数~~）相同，最多支持添加10个备选机型；
            * 节点计费必须一致（全部是预付费或按量付费）
            * 必须为同可用区
            * 需要支持购买AIHC的节点。
            * 节点的架构可以从bcc套餐中获取相关信息，可以支持。




[流程图]
    * 物理队列 VS 节点组 => 1:N
        * 支持异构节点加入同一个队列
        * 支持预付费节点和后付费节点同一个队列
        * 缺点：物理队列对接节点组的运维能力无法支持


[流程图]
    * 物理队列 VS 节点组 => 1:1（理想情况）
        * 节点组支持异构；支持不同计费模式的节点在同一个节点组
        * 百舸物理队列集成队列的更多运维能力


[流程图]


## 用户使用流程
[流程图]


2月27日沟通结论，注意其中✅和❌对应的线。

[流程图]


## 产品详细设计
## 功能列表
本期产品限制

1. 弹性扩缩容只支持CPU节点类型，GPU本期暂不考虑。
    1. 后续考虑GPU的话，优先考虑A10芯片机器。

2. 只有CPU队列支持弹性扩缩容，目前不支持CPU和GPU混合队列。
3. 库存只考虑百舸AIHC的CPU节点库存。
4. 本期资源模型：队列：节点组=1:1，方便后续以节点组为粒度进行运维等功能。
5. 队列节点数最大数受限于单资源池/单集群最大节点数；
6. 扩容上限受节点组中各子网剩余IP数量总和以及机型库存限制。
7. 扩容策略和缩容策略是以资源池粒度生效，不支持by 队列（节点组）生效。
8. 节点组的机型配置是同构的，备选机型必须与主机型规格（CPU、内存、架构、GPU卡数）相同，最多支持添加10个备选机型；备选机型不支持选择售罄的实例规格。
    1. **用户在百舸设置主备机型时：只支持选择购买百舸CPU套餐，CPU套餐需要做到**CPU、内存、架构相同**。**
    2. **第一期：仅支持一种主机型规格配置即可，先不支持备选机型。**

9. 弹性伸缩的节点只支持按量付费；不支持预付费。——本期中预付费节点和按量付费的节点不会在同一个队列中。
10. 扩容策略：本期只支持机型配置顺序，即队列（节点组）会根据用户配置的主备机型顺序进行扩缩容。若主机型无法扩容，则选择备选机型尝试扩容。
    1. 第一期只考虑根据主机型扩容
    2. 第一期不支持多子网均匀分布




|模块|功能名称|描述|限制|
|-|-|-|-|
|1|队列弹性伸缩开关|在创建物理队列/队列列表/详情页提供【开启/关闭弹性伸缩】入口；弹性策略配置——设置最小/最大节点数、扩缩容触发阈值|只能扩容同构的CPU节点；队列中不能有~~预付费~~手动移入的节点（即队列中的节点不支持来自资源池常驻节点组）。最大值 ≤ 资源池容量上限|
|2|资源池全局配置增加节点伸缩配置|* 支持针对某个队列开启弹性伸缩* 支持配置自动缩容||
|3|缩容保护|节点级别标记，禁止被自动缩容|支持批量操作|
|4|伸缩活动日志|队列详情页新增 Tab，展示历史扩缩记录|包含订单 ID（扩容）、状态、时间|
|5|提交负载|用户在开启弹性伸缩的队列提交负载的注意事项||
|6|监控|纯CPU队列的监控完善||

## 子功能-队列支持弹性伸缩详细设计
|功能模块|需求说明|示例图|历史参考图不用关注|
|-|-|-|-|
|创建物理队列|* 新增字段：【节点来源】    * 字段值：【从资源池添加】 & 【弹性扩容节点】    * 从资源池添加：        * 原有的创建队列添加节点的方式；将资源池已购买的节点添加到队列中。        * GPU虚拟化/多芯能力/空闲资源出借 —— 都是【从资源池添加】的队列才支持这个功能。    * 弹性扩容节点：        * 支持用户配置弹性伸缩，默认关闭，支持开启，配置参数。        * 如果选择了【弹性扩容节点】：GPU虚拟化/多芯能力/空闲资源出借 —— 都不展示![这些高级配置不受影响。](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=86612a5ddde54a3a82113c9a3ec1ae8f&docGuid=ib3qUzdKraFMrV "这些高级配置不受影响。")|![新增字段：节点来源](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b3e1b8f656c341a89fef5b269c24abe9&docGuid=ib3qUzdKraFMrV "新增字段：节点来源")![选择【弹性扩容节点】，弹性伸缩默认不开启](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=dce8c664fda2416b9009de4136b22cda&docGuid=ib3qUzdKraFMrV "选择【弹性扩容节点】，弹性伸缩默认不开启")|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=86310ef4a3e34e88bfcdad0bf9001147&docGuid=ib3qUzdKraFMrV)![选择扩容节点，弹性伸缩默认不开启](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=86f3c7c0d12a4585808c7ff8b9817f69&docGuid=ib3qUzdKraFMrV "选择扩容节点，弹性伸缩默认不开启")|
|配置弹性伸缩|* 配置弹性伸缩的提示信息：* 开启弹性伸缩后，队列将在资源不足时自动创建新节点，在资源富余时自动释放多余节点，既保障业务负载稳定运行，又有效降低资源成本。* 支持设置扩缩容的**最小/最大节点数**，确保弹性范围符合预期。* 平台支持对特定节点开启**缩容保护**，受保护的节点不会被自动释放。* 所有**扩缩容记录**均可在队列详情页的【**伸缩活动**】中查看。* 更多配置说明与限制，请参考[相关文档](https://cloud.baidu.com/doc/AIHC/s/nm799svmz)。* 注意：自动缩容功能需在 **资源池详情页 > 全局配置****  **中单独启用，该策略以资源池为单位统一生效。若未开启自动缩容，系统将不会自动释放节点。* 计费方式：只支持按量付费* 弹性伸缩：    * 默认关闭，支持打开设置；    * 最小节点数        * 创建队列时最小节点数可以为0。    * 最大节点数        * CCE有两层限制：集群等级维度，弹性伸缩维度。        * 目前控制台受限于集群等级维度，例如L50，L200。        * **百舸本期只暴露集群等级的限制，不暴露弹性伸缩的限制（0——2000）**        * 如果用户对弹性伸缩最大节点数有要求，需要升级集群等级。        * 提示信息~~开启弹性伸缩，将在该伸缩范围内自动调节期望节点数。  ~~~~当前最多可再添加 42 个节点（资源池总上限 50，含已有购买及系统节点）。~~开启弹性伸缩，将在该伸缩范围内自动调节期望节点数。  当前集群规模节点数量上限为50（含已购及系统节点），实际扩容数量将动态取决于**排队任务的资源需求**及**资源池现有节点状况**。![提示信息更新为上文。](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=faaa6c0363fa44928e850db27e644663&docGuid=ib3qUzdKraFMrV "提示信息更新为上文。")    * 最大节点数 >= 最小节点数        * 前端校验，如果最大节点数< 最小节点数，默认变更为最小节点数。![新石器CCE弹性节点组截图](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=7df6e8b7ba944abab5703a4e6655b8fd&docGuid=Uu_BZHAE3xMM-O "新石器CCE弹性节点组截图")---* 机型配置：2月27修订：—— 第一期只支持配置一种机型。    * 经讨论：在百舸侧目前基本只有一种机型。    * 添加机型，弹出相应弹框，支持机型选择和子网选择    * 节点列表默认展示百舸全部有库存的CPU节点。        * 售罄的可以直接过滤掉。        * 后续还可以继续增加校验，例如判断最大节点数和库存对比校验拦截等。* 设置节点子网：    * 增加节点子网和容器子网的拦截校验条件，参考现在往资源池购买节点的拦截校验。        * 按照最大节点数校验IP。校验拦截的判断逻辑见 [创建全托管资源池配置节点子网&容器子网的校验与拦截PRD](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/5QlZvzqzXY/_FyRtyuQP3HDZd?t=mention&mt=doc&dt=doc)    * 子网只能在资源池展示，不能在队列详情展示。* 机型和节点子网设置完成支持回显    * 支持编辑，编辑操作一直展示（无需鼠标hover上去）    * 编辑机型的弹窗和首次添加机型配置的弹窗保持一致，区别在于首次添加机型配置，没有机型选中，没有子网选中；编辑的话，回显上次选择的机型和子网---~~弹性伸缩设置回显，明确主机型和备选机型1、备选机型2……~~* ~~【+添加备选机型】操作需要计数~~* ~~鼠标hover到主机型上支持编辑。~~* ~~鼠标hover到备选机型上支持编辑、删除。~~* ~~主机型支持编辑，如果已有备选机型，主机型改配后，弹框提示信息：主机型与备选机型配置不同，需要重新添加备选机型。~~    * ~~点击确定回显时，只有主机型，备选机型被自动删除~~    * ---待讨论：单次扩容和缩容的步频，平台自己设置一个合理的数值，可以小一些，但是最好保证节点挂载pfs和卸载pfs没有问题，或者尽量减少因为一次操作太多节点而导致挂载&卸载pfs的问题，影响用户体验。现在新石器设置的最大并发缩容数是4。如果不用PFS，是否还有其他可以备用的存储方案，例如BOS，是否验证过。 —— 其他备用的存储方案，在第二期讨论。|![开启弹性伸缩，展示更多参数](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b956f6c1af9c451f9d093e5cfdfc6195&docGuid=ib3qUzdKraFMrV "开启弹性伸缩，展示更多参数")![添加弹性伸缩机型，第一期只支持一种，只展示AIHC支持的CPU资源](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=cf11c004f7c34945a3e282c3d502a748&docGuid=ib3qUzdKraFMrV "添加弹性伸缩机型，第一期只支持一种，只展示AIHC支持的CPU资源")![已配置机型回显，支持编辑；编辑弹窗和首次添加机型弹窗一致即可](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2353f936e3af45c7859b86aa36dfa213&docGuid=ib3qUzdKraFMrV "已配置机型回显，支持编辑；编辑弹窗和首次添加机型弹窗一致即可")|![开启弹性伸缩初始状态](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=ff8aaafbe68448d0acbe0b562349a3fa&docGuid=ib3qUzdKraFMrV "开启弹性伸缩初始状态")* 机型配置：交互和样式都参考CCE节点组的机型配置，但是参数简化。    * 添加主机型，弹出相应弹框，支持机型选择和子网选择    * 节点列表默认展示百舸全部有库存的CPU节点。—— 待讨论        * 后续还可以继续增加校验，例如判断最大节点数和库存对比校验拦截等。        * 售罄的可以直接过滤掉。    * 支持添加备选机型：        * 仅支持同CPU、同内存的节点——CCE节点组本身的限制。            * 节点组的机型配置是同构的，备选机型必须与主机型规格（CPU、内存、架构、~~GPU卡数~~）相同，最多支持添加10个备选机型；            * 主机型确认后，其他不同规格的套餐禁用，提示：备选机型必须与主机型规格（CPU、内存、架构）相同。——                 * 那是否就没有备选机型了？——待定。![添加主机型](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=e96c3631e72042d38dc5bef50a8eda5c&docGuid=ib3qUzdKraFMrV "添加主机型")![已配置机型回显](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=4084e4f8e2ad47feba65ef2f5f358990&docGuid=ib3qUzdKraFMrV "已配置机型回显")![添加备选机型](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=13fbd8b5b6d947adb05318a363108752&docGuid=ib3qUzdKraFMrV "添加备选机型")![编辑配置机型](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=157e569e695c4341945d68785bef579f&docGuid=ib3qUzdKraFMrV "编辑配置机型")![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=329f096e02114f5a9d1f7b859242ebd1&docGuid=ib3qUzdKraFMrV)![CCE样式与提示参考](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=0f922d4ac5424d428164a702d69f0522&docGuid=ib3qUzdKraFMrV "CCE样式与提示参考")![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=0f9a6cf1a7bb455fa6d18dd9c2a6f474&docGuid=ib3qUzdKraFMrV)![备选机型允许删除](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=410f5378e54c478ab312a2160d1b0974&docGuid=ib3qUzdKraFMrV "备选机型允许删除")![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=4c99beefed7a4f5b8d726ae21c38f429&docGuid=ib3qUzdKraFMrV)|
|物理队列列表页|1. 列表增加一列【弹性伸缩】    1. 默认【未开启】    2. 支持【已开启】        1. 【已开启】的队列，在【弹性伸缩】字段展示伸缩范围。如示例图所示。2. 操作增加：【配置弹性伸缩】    1. 队列状态为【可用】、【关闭】不影响【配置弹性伸缩】3. 队列状态：    1. 增加子状态：节点伸缩中    2. 处于【节点伸缩中】子状态的队列，【配置弹性伸缩】操作禁用，提示信息：队列正在扩缩容中，请稍后再试。---* 对于已有队列用户点击【配置弹性伸缩】：——3月更新    * ~~节点来源【从资源池添加】的队列不支持【配置弹性伸缩】，用户点击【配置弹性伸缩】提示：该队列不支持开启弹性伸缩。~~    * 已经关闭弹性伸缩的队列，或者创建队列时没有开启弹性伸缩的队列，不允许启用弹性伸缩，【配置弹性伸缩】禁用，提示信息：当前平台只支持创建队列时开启弹性伸缩。    * 已开启弹性伸缩        * 支持关闭该【弹性伸缩】        * 关闭后不支持重新开启。* ~~~~---自动缩容：    * 跳转到资源池全局配置中配置，这里只增加一个入口    * 只有开启弹性伸缩的队列【自动缩容】可用        * 否则禁用，提示信息：该队列没有开启弹性伸缩，无法自动缩容。|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=24708d6cba05493180c2b7faf1600516&docGuid=ib3qUzdKraFMrV)|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=36472447b56c4f989de254f72ccbc722&docGuid=Uu_BZHAE3xMM-O)* ~~对于已有队列【配置弹性伸缩】的限制条件：~~—— 废弃    * ~~队列中如果有GPU资源，队列【配置弹性伸缩】禁用，鼠标hover上去提示信息：~~        * ~~该队列包含 GPU 节点，无法开启弹性伸缩。~~    * ~~队列中如果有预付费资源，队列【配置弹性伸缩】禁用，鼠标hover上去提示信息：~~        * ~~该队列中有预付费节点，不支持~~~~开启~~~~弹性伸缩。~~    * ~~队列中已有节点不同构，~~~~队列【配置弹性伸缩】禁用，鼠标hover上去提示信息：~~        * ~~该队列已有节点不同构，不支持~~~~开启~~~~弹性伸缩。~~* ~~如果队列中已有后付费的同构CPU节点，主备机型需要和已有的CPU节点规格保持一致。~~|
|队列详情顶部区展示新增信息|* 开启弹性伸缩的队列顶部增加相关信息展示：如右图所示。* 队列详情顶部**操作区**增加操作【**配置弹性伸缩**】    * 该操作同列表中的操作完全一致    * 其功能性为增加一个操作入口，便于用户在查看节点时进行一些操作---* 已经开启弹性伸缩的队列，支持关闭弹性伸缩，关闭的限制条件：    * 队列不处于伸缩活动状态。    * 处于【节点伸缩中】子状态的队列，【配置弹性伸缩】操作禁用，提示信息：队列正在扩缩容中，请稍后再试。    * **关闭弹性伸缩：**        * 保留现有节点。* 已经开启的弹性伸缩队列，点击【配置弹性伸缩】，右侧弹窗默认回显已经配置的信息    * 支持编辑最小节点数&最大节点数    * ~~如果最大节点数有变化，需要重新校验节点子网与容器子网。~~    * 最大节点数只取决于集群等级，例如集群规模上限时50，最大节点数就最大时50开启弹性伸缩，将在该伸缩范围内自动调节期望节点数。  当前集群规模节点数量上限为50（含已购及系统节点），实际扩容数量将动态取决于**排队任务的资源需求**及**资源池现有节点状况**。|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=519795e4663b40d49667c371be82c2d0&docGuid=ib3qUzdKraFMrV)![已开启弹性伸缩，更新配置，或者关闭](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=29f66d42415f4c6caf24f35a22e37333&docGuid=ib3qUzdKraFMrV "已开启弹性伸缩，更新配置，或者关闭")|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=79425a9e3e594c4db1e0babc0b2ecae7&docGuid=Uu_BZHAE3xMM-O)* ~~对于已有队列【配置弹性伸缩】的限制条件：~~    * ~~队列中如果有GPU资源，队列【配置弹性伸缩】禁用，鼠标hover上去提示信息：~~        * ~~该队列包含 GPU 节点，无法开启弹性伸缩。~~    * ~~队列中如果有预付费资源，队列【配置弹性伸缩】禁用，鼠标hover上去提示信息：~~        * ~~该队列中有预付费节点，不支持~~~~开启~~~~弹性伸缩。~~    * ~~队列中已有节点不同构，~~~~队列【配置弹性伸缩】禁用，鼠标hover上去提示信息：~~        * ~~该队列已有节点不同构，不支持~~~~开启~~~~弹性伸缩。~~* ~~如果队列中已有后付费的同构CPU节点，主备机型需要和已有的CPU节点规格保持一致。~~    * ~~开启弹性伸缩时，可用区必须和已有节点规格可用区一致，其他可用区不支持修改。~~    * ~~添加主机型和备选机型按照已经机型进行筛选。~~|
|队列节点操作4月9日更新|* 添加节点：    * 开启过【弹性伸缩】（包括已经关闭的）的队列不支持手动添加节点。        * 【添加节点】禁用，鼠标hover提示：            * 本队列已配置弹性伸缩，不支持手动添加节点。* 封锁设置：不受影响* ~~移出节点：~~    * ~~开启缩容保护的节点也支持移出节点。~~        * ~~释放回资源池，而非退订，属于游离节点，支持从资源池退订。退订同其他购买的普通节点。~~    * ~~在缩容保护的详细设计中会详细说明。~~* 4月9日更新：开启过弹性伸缩的队列禁止移出节点：    * 鼠标hover提示：本队列已配置弹性伸缩，不支持移出节点。    * 目前没有途径产生游离节点。* 批量转让：    * 开启弹性伸缩的队列不支持转让节点，转让节点的操作禁用，提示信息：本队列已配置弹性伸缩，不支持转让节点。    * 不能将节点转让到开启【弹性伸缩】的队列中。直接在选择转入队列时禁用，提示信息为：该队列已配置弹性伸缩，不支持转入节点。        * ~~不可转让的备注信息：~~            * ~~待转入队列已开启弹性伸缩，不支持转入节点。~~|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=bfb3766549664976947a19227a6b3383&docGuid=Uu_BZHAE3xMM-O)![待转入队列禁用配置弹性伸缩的队列，以左侧需求说明为准。](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=9dd28b387a8f4f6d8b088ebdce080d93&docGuid=Uu_BZHAE3xMM-O "待转入队列禁用配置弹性伸缩的队列，以左侧需求说明为准。")||
||~~全托管资源池详情-全局配置Tab页面新增【节点伸缩配置】~~* ~~配置弹性伸缩~~    * ~~提示信息：~~~~平台管理员可以在此针对某个队列开启弹性伸缩，也可以在创建队列时同步开启弹性伸缩；开启弹性伸缩后，当触发自动扩缩容条件时，将根据预先设定的配置，在节点数量范围内自动调节。~~    * ~~选择某个队列开启，用户选择某个队列要判断，选择某个队列后进行校验：~~        * ~~对于已有队列【配置弹性伸缩】的限制条件：~~            * ~~队列中如果有GPU资源，提示：~~                * ~~该队列包含 GPU 节点，无法开启弹性伸缩。~~            * ~~队列中如果有预付费资源，提示：~~                * ~~该队列中有预付费节点，不支持~~~~开启~~~~弹性伸缩。~~            * ~~队列中已有节点不同构，~~~~提示：~~                * ~~该队列已有节点不同构，不支持~~~~开启~~~~弹性伸缩。~~    * ~~在这里针对已有队列设置弹性伸缩，和队列中的操作一样。~~    * ~~回显列表：仅展示开启弹性伸缩的队列，关闭后不展示~~|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=c9b4da4517b0434b83d00ee28373a9b2&docGuid=Uu_BZHAE3xMM-O)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=a31862741b2c4d69b7fef4de7b9a6908&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=e4f4413cc35a4e13a4d4ee9897a1a412&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=ee320baa1d994fa6997c42697377f24e&docGuid=ib3qUzdKraFMrV)||
|资源池全局配置-节点伸缩配置|* 全托管资源池详情-全局配置Tab页面新增【节点伸缩配置】——配置自动缩容* 自动缩容：默认关闭    * 提示信息：开启弹性伸缩后，系统将自动释放**由弹性扩容创建的按量付费节点**，并遵循以下规则：* 仅当队列中存在较多空闲节点时，才会触发缩容；* 已开启缩容保护的节点不会被释放；该策略在资源池级别统一生效，适用于本资源池内所有已开启弹性伸缩的队列。    * CPU/内存缩容阈值         * 原非GPU缩容阈值        * 当非 GPU 类型节点的 CPU、内存资源请求率（单资源请求量÷单资源总量*100%）低于该阈值时，可能会触发自动缩容。        * CPU 和内存任一低于即可（OR）触发缩容操作。        * 说明：非 GPU 类型节点的 CPU 或内存资源均达到缩容阈值时，才会触发该规则。        * 默认值 50%；允许用户修改；配置范围【0——100】> Cluster Autoscaler（CA）组件在节点组中设置的“缩容阈值”，其真实含义是**节点的资源请求率（Request）上限**。
> 具体来说，它衡量的是节点上所有 Pod 申请的 CPU 和内存资源（即 Request 值）占该节点总资源的比例。默认情况下，这个阈值通常设置为 **50%**（即 0.5）。这意味着，当一个节点上所有 Pod 申请的 CPU 和内存资源总和，低于该节点总资源的 50% 时，该节点就被 CA 判定为“资源利用率不足”，具备了被缩容的初步资格。
> 本次实现在缩容时，不支持驱逐pod，因此只会缩容节点资源利用率低于阈值，且没有pod的节点。* ~~10个节点：200CPU，总CPU200*10=2000~~* ~~8*100 = 800CPU在运行中，40%~~* ~~50% —— 缩容到1600个cpu~~* ~~500个CPU在排队中，调度中？~~~~100， 10~~~~100，  90~~~~40%~~        * 提示信息：当非 GPU 类型节点的 CPU、内存资源请求率（单资源请求量÷单资源总量*100%）低于该阈值时，可能会触发自动缩容。    * ~~**GPU缩容阈值**~~        * ~~**即GPU利用率阈值**~~        * ~~**百舸不支持，本期只支持CPU节点**~~    * 缩容触发时延：只展示不支持编辑修改        * 提示信息：当节点资源使用率低于阈值，并持续该时间段后，集群将触发自动缩容，当前不支持编辑。        * 默认值 10分钟；~~允许用户修改；配置范围【？？】~~    * 静默时间：只展示不支持编辑修改        * 提示信息：节点进行扩容后，能再次执行缩容所需等待的时间间隔，当前不支持编辑。        * 默认值 10分钟；~~允许用户修改；配置范围【？？】~~    * 最大并发缩容数：只展示不支持编辑修改节点缩容时，允许同时进行缩容的并发数目，当前不支持编辑。        * 默认值 10；~~允许用户修改；配置范围【？？】~~    * ~~Pod终止超时时间：~~        * ~~缩容节点时等待节点上Pod终止的最长时间~~    * ~~Pod最小副本数：~~        * ~~节点缩容前，允许每个副本集中 Pod 的最小数量~~    * ~~开启 DaemonSet Pod 排水：~~        * ~~开启DaemonSet Pod排水后，节点缩容时会驱逐节点上的DaemonSet Pod~~    * ~~不缩容节点：~~        * ~~包含本地存储的Pod~~        * ~~包含kube-system 命名空间下非DaemonSet管理的pod~~        * ~~开启后，当集群执行节点自动缩容操作时，可以忽略运行在所勾选的Pod所在的节点，确保这些节点不受缩容的影响~~自动缩容：涉及驱逐pod* 只驱逐训练任务和推理pod；* 开发机不支持驱逐；* 1. 能否提前检测节点上是否有开发机，有开发机的话，整个节点都不驱逐了。？？？* ~~2. 队列后续会支持工作负载的类型，支持了开发机的队列不支持自动缩容。——不太好。~~|![默认不开启](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=fc75f7464a9547aa9201860bed3831c0&docGuid=ib3qUzdKraFMrV "默认不开启")![开启后，只展示这4个字段，其中只有CPU/内存缩容阈值 支持编辑](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=0a5799ecdb2743a68ae58affc1604ce2&docGuid=ib3qUzdKraFMrV "开启后，只展示这4个字段，其中只有CPU/内存缩容阈值 支持编辑")![关闭后提示弹窗](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=46cd421a6bb8436eb5efd9f3366281eb&docGuid=ib3qUzdKraFMrV "关闭后提示弹窗")![跳转到资源池详情-全局配置-节点伸缩配置](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=52b4a6ad68484a2a88dfb7d83bed5eea&docGuid=ib3qUzdKraFMrV "跳转到资源池详情-全局配置-节点伸缩配置")![跳转到资源池详情-全局配置-节点伸缩配置](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=107b44b3483e42408bc288058927a944&docGuid=ib3qUzdKraFMrV "跳转到资源池详情-全局配置-节点伸缩配置")|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=02366dbd8f764d05a6a715b5ea871345&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=44ef14a71e3f4fa78c5cc438b354b48e&docGuid=Uu_BZHAE3xMM-O)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=3e58ff209c5148f2818b7f08860fd5ca&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=01be5c09312f42839a0525310b140685&docGuid=Uu_BZHAE3xMM-O)![支持回显](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=c9f437e25d484b5681b1672ae84d5da4&docGuid=Uu_BZHAE3xMM-O "支持回显")|
|扩容节点的label与taint等信息|技术默认设置|||
|权限|只有平台管理员（AIHCfullcontrol）支持开启或关闭【弹性伸缩】能力以及自动缩容配置因为弹性伸缩涉及购买机器和退订机器，所以从权限大原则上看只能平台管理员支持。这里可能会和现有的操作逻辑不太match。---非AIHCFullControlPolicy的权限的用户对于队列列表中的【配置弹性伸缩】操作或创建队列中的【配置弹性伸缩】开关，都是禁用的，鼠标hover上去提示信息：* 该功能涉及购买资源计费，当前仅限平台管理员AIHCFullControlPolicy权限用户开启或关闭。~~使用~~~~该功能需由平台管理员（AIHCFullControlPolicy）开启或关闭。如有需要，请联系平台管理员为您操作。~~---4.23更新：该功能的相关操作进行权限校验，提示信息：该功能涉及资源计费，当前仅限平台管理员AIHCFullControlPolicy权限用户开启或关闭。![资源池详情全局配置-节点缩容配置](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=e082a9aa77bb429d9ba157e1413ccb27&docGuid=ib3qUzdKraFMrV "资源池详情全局配置-节点缩容配置")![创建队列开启弹性伸缩](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=8dd63fa5b73b49d39700a652cc2728d1&docGuid=ib3qUzdKraFMrV "创建队列开启弹性伸缩")![队列操作：弹性伸缩配置](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=3d10e571b97d4a0283919a21a8b500bb&docGuid=ib3qUzdKraFMrV "队列操作：弹性伸缩配置")![队列详情操作：弹性伸缩配置](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=c7aab7df839e48eb86f3889b4f6d03d5&docGuid=ib3qUzdKraFMrV "队列详情操作：弹性伸缩配置")|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=d5769f28007243c9b60882b2b2f70905&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=48960f4b4bfa47ec98693fb93878a204&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=3f4fb34bf584459a8a140e1af6a9e777&docGuid=ib3qUzdKraFMrV)||
|||||
|2026-04-08 删除队列逻辑补充更新|~~删除队列的逻辑增加校验：~~1. ~~如果该队列开启弹性伸缩，用户点击删除队列提示：~~~~当前队列已开启弹性伸缩，无法删除。请先关闭弹性伸缩功能。~~删除队列的提示需要区分队列是否开启过弹性伸缩。2. 删除队列的温馨提示：温馨提示：* 删除队列前，请务必确认队列中已无任何开发机、训练任务及在线服务。* 删除过程中请勿向该队列提交新的任务或负载。* 请注意：队列删除后无法恢复，请谨慎操作，并确保不影响相关业务运行。3. 如果队列开启过弹性伸缩，需要手动勾选，需要将节点自动释放，停止计费。    1.  删除队列后，该队列弹性扩容的节点将自动移出资源池，释放资源。4. 如果是普通队列，需要手动勾选    1. 删除队列后，其关联的计算资源将自动返还至所属资源池，请移步资源池释放节点。![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=e053e7f7b3e64474a0d4b387403e4f47&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=6b57083d8df347c7ab5f7494d19f3536&docGuid=ib3qUzdKraFMrV)|![无负载的删除队列](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=58b4e848c3274415b54a50d05d558415&docGuid=ib3qUzdKraFMrV "无负载的删除队列")![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=1b910690e8d54dff8061596aeb2617fd&docGuid=ib3qUzdKraFMrV)![有负载删除](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2a3272cac87d4d439a37fb71e534607a&docGuid=ib3qUzdKraFMrV "有负载删除")![CCE删除节点组弹窗声明](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=d37d5e32c6464c2abfeb916aa32afa33&docGuid=ib3qUzdKraFMrV "CCE删除节点组弹窗声明")||



## 子功能-节点缩容保护详细设计
|功能模块|需求说明|示例图|历史参考图|
|-|-|-|-|
|队列详情-节点管理支持缩容保护|* ~~节点列表增加两列：~~    * ~~添加方式：—— 待讨论~~        * ~~手动添加：缩容保护字段值为【-】，增加提示信息：~~            * ~~该节点为用户手动添加，不支持自动缩容。~~            * ~~已有队列开启弹性伸缩时，最小节点数 ≥ 手动添加节点数~~        * ~~弹性伸缩~~            * ~~只有【弹性伸缩】扩容增加的节点支持【缩容保护】操作~~* 队列详情中的节点管理列表增加字段：缩容保护        * 已开启：~~手动添加的节点默认开启【缩容保护】~~        * 未开启* 节点列表操作中新增操作“【**节点缩容保护】**”、【批量操作】中新增操作“【**节点缩容保护】**”；    * 弹性伸缩未开启和已关闭的队列，该操作要禁用，提示信息：本队列未开启弹性伸缩，不支持该操作。    * 支持批量选中“可用”或“可用（已封锁）”节点开启【节点缩容保护】    * 其余状态该操作禁用，鼠标hover上去提示信息：该节点当前状态下不支持节点缩容保护设置。* 节点缩容保护弹窗提示信息~~温馨提示：~~* 节点开启缩容保护后不受队列自动缩容的影响。只有可用、可用（已封锁）的节点支持开启缩容保护。* ~~开启缩容保护的节点支持手动移出队列（释放回资源池）。~~* ~~开启缩容保护的节点支持转让到未开启弹性伸缩的队列。~~    * 下方二次确认勾选框：我已了解上述说明，确认执行所选操作。        * 默认不勾选，不勾选则确定按钮点击报错；* 节点批量开启缩容保护后，出现部分成功部分失败的场景时，需要右上角报错|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=6c84b8ffce80420e95596e64d33dac5e&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=75b61162a6b0405ca7780629b8d8d58f&docGuid=ib3qUzdKraFMrV)||
|弹性伸缩相关|如果队列的节点都开启了**缩容保护**，同时开启了弹性伸缩，此时队列不会缩容节点，也不会产生伸缩记录；* 节点缩容保护配置以用户手动配置为准* 如果队列的部分节点开启了缩容保护，同时开启了弹性伸缩，此时队列不会缩容开启缩容保护的节点，会从未开启缩容保护的节点，按照用户配置缩容策略选择剩余节点进行缩容；* 待讨论：最小节点数是否>=开启缩容保护的节点数？——和CCE逻辑保持一致。    * CCE逻辑：没有强制约束|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b14208165d35493b98612122fdbf87c2&docGuid=ib3qUzdKraFMrV)|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=3e31997e532843a4af081141f87d28e5&docGuid=ib3qUzdKraFMrV)|
|移出节点相关|* 从队列进行节点移出，进行弹窗优化：    * 节点列表新增：**是否开启缩容保护**的字段：        * 值：是、否温馨提示：从队列移出的节点依然保留在资源池中，如需退订，请到资源池资源管理页面进行退订* 开启缩容保护的节点也支持手动移出节点，手动移出节点会产生伸缩记录；* 下方二次确认勾选框：我已了解上述说明，确认执行所选操作。    * 默认不勾选，不勾选则确定按钮点击报错；* 节点批量移出，出现部分成功部分失败的场景时，需要右上角报错* 手动移除的节点没有伸缩记录|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=ff74b4f5b43d4e40bb600b6fdead55bd&docGuid=ib3qUzdKraFMrV)![这是单个节点的移出，请和批量节点的移出样式保持一致](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2cbf145bec4d4952a58832a4d951a511&docGuid=ib3qUzdKraFMrV "这是单个节点的移出，请和批量节点的移出样式保持一致")||



## 子功能-伸缩活动详细设计
全托管资源池的队列详情中新增【伸缩活动】Tab页面，在队列发生扩缩容后，用户可以查看队列详情中的伸缩记录和详细信息了解每次扩缩容的基本信息。

开启弹性伸缩的队列扩容时，通过订单购买资源，可以支持部分成功：

* 当百舸库存充足，下订单成功，但是装机资源不足会导致扩容失败，这时如果一次性扩容10台机器，一台失败不会导致全部失败，可以支持9台扩容成功；
* 当百舸库存不足，机器库存数小于扩容数，按剩余库存数量进行队列扩容，超出库存的部分实例失败；
* 当 Cluster Autoscaler (CA) 在扩容过程中出现部分成功（例如期望扩容 10 个节点，仅成功 5 个）的情况时，它的处理机制并不是简单地“重试剩下的 5 个”，而是基于**“周期性重新评估”**和**“冷却期（退避）”**相结合的策略。
    * CA 会不断评估集群中仍然处于 Pending（待调度）状态的 Pod 需求，并重新触发扩容逻辑。




|功能模块|需求说明|示例图|
|-|-|-|
|队列详情-增加伸缩活动|* 队列详情页面新增【伸缩活动】Tab页面* 页面提示信息：开启**弹性伸缩**功能的队列会产生伸缩活动记录。* 列表字段：    * 活动ID：        * 注意示例图中是cce的活动ID，百舸需要有自己的活动ID，隐藏cce相关字段        * 例如考虑：task-aihc-ig-scazexla-repair-fbpn4iss    * 伸缩节点数        * 根据伸缩规则本次伸缩活动的目标节点数。        * 例如一次扩容20个节点，或者缩容20个节点，则伸缩节点数就是20。        * 支持查看状态，用户点击查看状态，弹出弹框展示本次伸缩节点的列表信息。    * 活动描述：        * **弹性扩容：**自动匹配资源需求，创建XX个节点        * **弹性缩容：**自动匹配资源需求，移出xx个节点        * **注意：**            * 弹性扩容会由于库存等原因扩容部分成功，与期望节点数不符合，会再次发起扩容活动；            * xx节点数量是每次伸缩活动计划伸缩的节点数量；    * ~~订单ID：~~        * ~~只有扩容的活动有订单ID，支持点击订单ID跳转到订单详情~~        * ~~缩容的活动没有订单ID，展示【-】~~        * ~~受限于单次扩容步频或库存不足等原因，一次扩容可能会有多个订单，~~~~默认展示3个，超过3个折叠展示，点击支持展开；~~    * 3月3日更新：经沟通用户在百舸上自动扩容的节点不会给用户账号下订单，用的是百舸的账号下的单，只会给用户出账单。        * 可能会出现对账非常麻烦的情况。需要再次沟通确认。？> 用户设置了节点伸缩范围：最小节点数&最大节点数，组件根据pending的pod数会触发一次扩容节点数，例如组件判断扩容需要20个节点，但根据扩容步频，一次只能扩容5个节点，则会扩容4次，拆分成4个订单。
> 或者由于库存受限，第一次扩容了10个节点，另外10个节点等库存充裕了又扩容了1次，生成两个订单。    * 活动状态：**执行中、已执行、**~~**已中止？？**~~**：**        * 列表支持按照状态筛选过滤；        * 伸缩活动执行中的状态需要活动的当前进度，如：**执行中；**    * 活动未完成执行原因：展示伸缩活动失败/中止的原因，中文展示失败原因，任务执行成功时展示—，失败原因例如：        * 本期follow cce的实现方案，直接将原始的错误英文信息提示出来，对于具体失败原因的枚举映射放在下一期优化中实现。        * ~~当前可用区百舸库存不足。~~        * ~~您的账户余额不足。~~        * ~~在当前地域选择的实例规格创建的BCC/EBC数量超出配额上限。？？？~~        * ~~节点子网IP不足。—— 百舸理论上不会出现这个问题~~        * ~~扩容任务超时。~~        * ~~当前可用区部署集配额不足。？？？~~        * ~~任务删除。~~    * 开始时间        * 样式：参考示例图        * 默认按照开始时间倒序排序        * 支持按照开始时间排序：正序排序 & 倒序排序    * 结束时间        * 样式：参考示例图* 支持平台默认的分页模式|![注意：没有订单ID](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=8d1d919a9d8d4e21852ef7bb94c3356a&docGuid=Uu_BZHAE3xMM-O "注意：没有订单ID")|
||查看伸缩活动状态：* 点击【查看状态】弹框列表字段：    * 节点IP、节点ID    * 伸缩状态：        * 扩容状态：扩容中，扩容成功，扩容失败        * 缩容状态：缩容中，缩容成功，缩容失败    * ~~这里的状态能否和托管节点的状态机保持一致？~~    * 失败原因：本期不做~~CCE伸缩活动的节点状态： —— ~~~~节点到期自动退出，是否算自动缩容，在活动中查看？~~* ~~节点状态：已有字段信息~~    * ~~展示节点的状态信息：创建失败、可用、已删除、创建中、删除中、已到期、抢占中；~~        * ~~针对移除节点状态有：~~~~删除中、已删除、删除失败~~        * ~~针对添加新节点/已有节点：：创建失败、可用、创建中、已到期、抢占中；~~* ~~失败原因~~    * ~~针对失败（扩容失败、缩容失败）的节点，展示失败原因~~    * ~~失败原因中文展示：，如~~        * ~~百舸资源库存不足，请提交工单~~        * ~~节点子网不足，请提交工单~~|![状态名称展示以左侧文档说明为准，失败原因本期不做](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=bc062ab11a3642f1884814a84a4af472&docGuid=ib3qUzdKraFMrV "状态名称展示以左侧文档说明为准，失败原因本期不做")|
|资源池详情增加伸缩活动|1. 弹性伸缩活动和变更记录无法一一对应2. 资源池的弹性伸缩和队列的区别在于增加队列名称和队列ID这两个字段。3. 资源池变更记录中同步记录弹性伸缩的节点的状况    1. 变更类型：弹性伸缩    2. 变更原因：~~节点扩容/节点释放     ~~添加节点/释放节点    3. 状态    4. 发起人——root|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=4a3e753261534844b03826ee3bcf6141&docGuid=Uu_BZHAE3xMM-O)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=087dc3673b3c44eeb75d3b5d990f8df9&docGuid=Uu_BZHAE3xMM-O)|
|订单|~~产生AIHC的订单，只有节点的订单，没有云磁盘的订单。~~~~产生后付费买CPU节点的订单。~~~~对比与CCE的区别，是否需要进行适配改造？~~没有订单信息，只能查看对应账单。自动扩容的节点是后付费节点，每个小时出一个账单。|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=d457ff59656a4d679efbe02d69cbc338&docGuid=Uu_BZHAE3xMM-O)![百舸的扩容订单：后付费买节点](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=0a9b2a2c0b1d4035a8112af3b56e2a47&docGuid=Uu_BZHAE3xMM-O "百舸的扩容订单：后付费买节点")![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=e28dae3ac7024aa884c20a05ecd22a88&docGuid=Uu_BZHAE3xMM-O)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=5e6cf4f4c3a1487795b77c59888024b5&docGuid=Uu_BZHAE3xMM-O)![CCE的扩容订单](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=6104ceface7c4b0c9903c848fb496680&docGuid=Uu_BZHAE3xMM-O "CCE的扩容订单")![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=cdd96cbabb6b4b10b3f3f4c83250c161&docGuid=Uu_BZHAE3xMM-O)|



## 子功能-提交负载详细设计
* 对于开启弹性伸缩的队列，用户创建负载时，需要提醒用户该队列已经开启弹性伸缩，平台将根据排队任务自动扩容，也会根据资源实际使用情况触发自动缩容，队列自动缩容时，可能会导致排队或运行的任务被驱逐释放。

|功能模块|需求说明|示例图|
|-|-|-|
|开发机/训练/推理|1. 选择队列：开启弹性伸缩的队列增加属性【弹性伸缩】2. 选中队列，在资源概览中提示：该队列已启用弹性伸缩：平台将根据排队任务自动扩容，并在资源空闲时自动缩容。缩容可能导致排队中的负载被终止，请知悉。3. 经RD确认：运行中的pod不会被终止。4. ~~队列已经支持负载类型设置：~~    1. ~~弹性伸缩的队列：开发机的处理如何处理？~~    2. ~~是否直接在队列创建的时候不支持开发机即可。~~    3. ~~~~[@王春峰](https://ku.baidu-int.com?t=mention&mt=contact&id=153197a0-2c30-11f1-9428-2572503cd2c7)~~缩容对运行中的开发机、训练、推理的影响~~5. 事前诊断的诊断结果去掉6. 事后诊断的诊断结果去掉7. ~~驱逐推理的pod是否受碎片治理的字段的影响？~~8. ~~驱逐pod后：负载侧的事件展示是什么？~~弹性伸缩的队列不支持pfd存储挂载，用户如果选择了pfs的存储挂载，会报错。——后续优化提示方式。![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=eab86ca218d54df48d675faea14dd1ce&docGuid=ib3qUzdKraFMrV)2026-04-21更新：开发机不允许使用弹性伸缩队列：用户创建开发机选择队列时，弹性伸缩队列禁用，鼠标hover上去提示：该队列已启用弹性伸缩，无法用于创建开发机。![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2abfd1c0cd824313baceaf35c31b54dc&docGuid=ib3qUzdKraFMrV)|![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f6bf35308451455484a2ea252d17d383&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=14422766562c478eb594f05e697bb75c&docGuid=ib3qUzdKraFMrV)![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=804c4bde32f14945b89d8072a0774858&docGuid=ib3qUzdKraFMrV)|

## 子功能-监控详细设计——单独拆分Story
|功能模块|需求说明|示例图||
|-|-|-|-|
|监控|考虑CPU的监控完善补充CPU节点监控|![当前百舸队列监控](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=d6b3de0de19a4f199057401d57f56214&docGuid=ib3qUzdKraFMrV "当前百舸队列监控")![更新后监控](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=276f5fef7e6f4a2187959f4e18355425&docGuid=ib3qUzdKraFMrV "更新后监控")||

## 待讨论：
* 依赖检查：用户提交弹性伸缩，是否需要校验费用，欠费或者金额少于XX元，直接不能提交。
    * billing有接口查账户余额。

* 自动扩容条件不透明，没有放开给用户使用，易导致用户无法适配自身业务峰值。
* PFS的限制问题：如果不用PFS，是否还有其他可以备用的存储方案，例如BOS，是否验证过。

## 产品OpenAPI设计（可选）—— 待定
*对于面向开发者需要提供API/SDK的产品为必须，其他产品结合业务发展状态按需提供*

*此部分应包括主要的接口操作对象，接口列表、接口核心参数等；*

*OpenAPI设计规范参考：*[2.3 百度云对外API 设计规范](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/0CaVMsnGQFpCF5?t=mention&mt=doc&dt=doc)



# 技术文档
[百舸全托管资源池-队列支持弹性伸缩方案设计](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/5QlZvzqzXY/5Zw6Oh2cYRnEvN?t=mention&mt=doc&dt=doc)

# 非功能性需求设计
## 公有产品
### 性能
*此部分描述性能需求*

### 效果
*此部分描述对于策略类产品的效果需求，包括评估方案，指标等*

### 安全
*此部分描述系统安全性需求或方案，需满足公司安全方面的要求，相关规范参考：*[ACG云产品安全准出标准（公开）](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/b_dB7xLNHi/zYp0PkE5Le/0fb4ccaf583544?t=mention&mt=doc&dt=doc)

### 兼容性
*此部分描述兼容性需求，包括浏览器，手机等*

**

### 埋点
*需统计页面级别的访问/点击情况，如有请详细描述*

### 公共组件接入
#### 登录、组织、权限
*此部分描述系统是否对接IAM进行登录认证、访问控制、权限管理，相关规范参考：*[(公有)登录&组织&权限](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/fuGWglfmflZ34v?t=mention&mt=doc&dt=doc)

#### 日志
*此部分描述系统是否对接BLS日志服务平台进行统一的日志存储和查询，相关规范参考：*[3.4 (公有)日志](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/FZJ66i39739LVo?t=mention&mt=doc&dt=doc)

#### 报表
*此部分描述系统是否对接Sugar实现统一的报表管理，相关规范参考：*[3.5 报表](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/LutR9uFXyK8uR7?t=mention&mt=doc&dt=doc)

#### 监控
*此部分描述系统是否对接云监控BCM进行统一的监控报警和数据可视化管理，相关规范参考：*[3.7 (公有)监控](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/wbckDRcRDacznG?t=mention&mt=doc&dt=doc)

#### 审计
*此部分描述系统是否对接云审计BCT系统，对云上用户或服务关键操作进行跟踪和设计，相关规范参考：*[3.8 (公有)审计](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/hMuXbbPAEtTdC-?t=mention&mt=doc&dt=doc)

#### 标签和资源组
*此部分描述系统是否对接统一的资源管理和标签管理系统，实现统一的资源分类管理和标签归类，相关规范参考：*[3.9 标签和资源组](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/vv5C7C0MWm9JPO?t=mention&mt=doc&dt=doc)

#### 配额管理
*此部分描述系统是否对接百度智能云控制台的配额管理功能，实现对配合使用情况的监控，以及在配额不足时自助申请配额，相关规范参考：*[3.10 配额管理](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/NMfBYtv-qM75dR?t=mention&mt=doc&dt=doc)

#### 订单账单
*此部分描述系统是否对接Billing系统实现客户线上购买、计费、出账的统一管理和统一的云上体验，相关规范参考：*[3.11 订单账单](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/RB2EPv7tDS/rfmPKCMVTqRygu?t=mention&mt=doc&dt=doc)

**

## 建设计划
*此部分描述产品核心功能、非功能建设优先级和计划*

# 附录
*此部分列出相关参考资料和说明文件*

节点组扩缩容常见问题 [https://cloud.baidu.com/doc/CCE/s/3jwvy1gyu](https://cloud.baidu.com/doc/CCE/s/3jwvy1gyu) 

[节点组支持设置缩容保护](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/Jk_2Ea1IJe/jFLv3m8XZn/gV3_ahOtU4qjfm?t=mention&mt=doc&dt=doc)

[节点组容量上限及单次扩容上限](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/Jk_2Ea1IJe/jFLv3m8XZn/8jiif9za0JvcBR?t=mention&mt=doc&dt=doc)

[节点组伸缩活动支持查看扩容部分成功等信息](https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/Jk_2Ea1IJe/jFLv3m8XZn/DD3LbnWmBpQ9QP?t=mention&mt=doc&dt=doc)
