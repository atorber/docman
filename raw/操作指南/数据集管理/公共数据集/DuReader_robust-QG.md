## 概述：
DuReader数据集属于下游question generation 问题生成类任务，可以用于训练问题生成模型，用于下游的FAQ挖掘等场景。

## 数据集描述：
本数据集包括训练集（14520）验证集（1417）测试集（1962）。其中，每一条数据有两个属性，分别是输入句子text1和输出句子text2。其中输入句子是答案和相关的段落，输出句子为相应的问题。

## 范例：
{"text1":"15个[SEP]迈克尔.乔丹在NBA打了15个赛季。他在84年进入nba，期间在1993年10月6日第一次退役改打棒球，95年3月18日重新回归","text2":"乔丹打了多少个赛季"}

## Clone with HTTP
* [http://www.modelscope.cn/datasets/modelscope/DuReader_robust-QG.git](http://www.modelscope.cn/datasets/modelscope/DuReader_robust-QG.git)



如果您使用该数据集，请查看并遵守发布方声明的开源协议，查看详情 [ModelScope](https://www.modelscope.cn/datasets/modelscope/DuReader_robust-QG)