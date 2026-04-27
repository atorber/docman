![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=17721a68f38b4dcbb1befa106ca88b11&docGuid=SUYQ1bwWGJqDt5 "")
10Kh RealOmni-Open DataSet该数据集累计拥有超10000小时数据、100万+片段，完整记录复杂家务和清洁的全流程，采用GenDAS Gripper完成数据采集,是行业内最大的开源具身智能数据集。



#### 相比其他数据集的优势
1. **充足的数据量 & 强泛化性**

每项技能都有充足数据支撑，数据采集自3000+家庭、近10000个不同细粒度目标，避免简单重复，确保鲁棒的泛化能力。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=b9fdca43509c40318a25b06de84070fe&docGuid=SUYQ1bwWGJqDt5 "")

2. **真实场景 & 聚焦核心技能**

数据源自真实家庭的自然操作，避免损害质量的技能碎片化问题，聚焦10个核心家庭场景、30项核心技能。

3. **双机械臂 & 长时长任务**

完整记录复杂家务和清洁的全流程，采用GenDAS Gripper完成数据采集。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=47d5c566613c4b6dbf21c179d3e015a8&docGuid=SUYQ1bwWGJqDt5 "")

4. **多模态 & 高质量数据**

包含大视场原始图像、轨迹、标注和关节运动数据；轨迹重建精度与质量达到行业领先水平。

#### 数据集统计
|属性|数值|
|-|-|
|片段时长中位数|210.0 秒|
|存储大小|95 TB|
|格式|mcap|
|分辨率|1600*1296|
|帧率|30 fps|
|相机类型|大视场鱼眼相机|
|IMU|支持（6轴）|
|触觉阵列空间|支持|
|阵列空间分辨率|1 mm|
|设备|Gen DAS Gripper|



#### 第一阶段内容
> 我们已上传第一阶段数据（仅占总量一小部分），剩余技能的更新将尽快完成。
第一阶段覆盖4大类场景任务下的12项技能，总时长950小时、片段数39761个、存储大小3.45TB。

|任务类别|技能名称|
|-|-|
|衣物折叠与拉链操作|fold_and_store_clothes（折叠收纳衣物）|
||zip_clothes（拉合衣物拉链）|
|烹饪与厨房清洁|clean_container（清洁容器）|
||unscrew_bottle_cap_and_pour（拧瓶盖并倾倒）|
||clean_bowl（清洁碗具）|
|杂物整理|desktop_object_sorting（桌面物品整理）|
||fold_towel（折叠毛巾）|
||fold_and_store_shopping_bag（折叠收纳购物袋）|
||drawer_to_take_items（抽屉取物）|
||drawer_to_place_items（抽屉放物）|
|鞋子处理|lace_up_shoes_with_both_hands（双手系鞋带）|
||organize_scattered_shoes（整理散落鞋子）|



我们会在主流社交平台同步更新进度。除数据外，还提供格式转换、使用指导等配套支持，相关工具链接：[https://github.com/genrobot-ai/das-datakit](https://github.com/genrobot-ai/das-datakit)



#### 联系我们
使用过程中如有任何问题、建议，或希望新增数据采集的场景/技能，欢迎联系我们，共同建设“数字化人类所有技能”的项目：

* 邮箱：opendata@genrobot.ai
* 微信公众号、小红书：简智机器人
* X（原Twitter）：[https://x.com/GenrobotAI](https://x.com/GenrobotAI)
* 领英（LinkedIn）：[https://www.linkedin.com/company/108767412/admin/dashboard/](https://www.linkedin.com/company/108767412/admin/dashboard/)

#### 数据集结构
`mcap文件存储在文件目录结构的最终叶子文件夹中。注：每个mcap文件代表一份任务数据。`



#### 数据格式
双机械臂任务中：robot0、robot1 分别代表左、右抓手，每个抓手包含以下主题（Topics）：

```
/robot0/sensor/camera0/compressed   # 鱼眼相机图像数据 — H.264格式压缩编码
/robot0/sensor/camera0/camera_info  # 鱼眼相机内外参
/robot0/sensor/imu                  # 惯性测量单元（IMU）数据
/robot0/sensor/magnetic_encoder     # 磁编码器数据：抓手开合距离
/robot0/vio/eef_pose                # 轨迹数据
```
所有主题通过Protobuf序列化进行持久化存储。



##### /robot0/sensor/camera0/compressed 协议定义
```
// 压缩图像
message CompressedImage {
  // 图像时间戳
  google.protobuf.Timestamp timestamp = 1;

  // 帧ID
  string frame_id = 4;

  // 压缩图像数据（H264视频流）
  bytes data = 2;

  // 图像格式
  // 支持值：`webp`, `jpeg`, `png`, `h264`
  string format = 3;

  // 通用头部（包含时间戳）
  Header header = 8;
}

message Header {
  string module_name = 1;        // 模块名
  uint32 sequence_num = 2;       // 序列号
  uint64 timestamp = 3;          // 时间戳
  string topic_name = 4;         // 主题名
  double expect_hz = 5;          // 期望帧率
  repeated Input inputs = 6;     // 输入列表
}
```
