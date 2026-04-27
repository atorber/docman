## 数据集描述
### 数据集简介
Mini ImageNet数据集是[ImageNet](https://ieeexplore.ieee.org/document/5206848)大规模视觉识别挑战(ILSVRC)的子数据集，它从ImageNet1K中随机选择100个类别，其中训练集每个类别包含600张带注释的图像，共计60000张，验证集 每个类别包含100张带注释的图像，共计10000张。整个数据集共6.4GB，可代替完整的ImageNet数据集，用于快速模型验证、性能评估、小数据集训练等。

### 数据集支持的任务
可代替完整的ImageNet数据集，用于快速模型验证、性能评估、小数据集训练等。

## 数据集的格式和结构
### 数据格式
数据集包括训练集train和验证集val，train和val文件夹之下按文件夹进行分类，共有100个子文件夹，同类别标签的图片在同一个文件夹下，图片格式为JPEG。同时包含与标注文件中label id相对应的类名文件classname.txt。



如果您使用该数据集，请查看并遵守发布方声明的开源协议，查看详情 [ModelScope](https://www.modelscope.cn/datasets/tany0699/mini_imagenet100)。