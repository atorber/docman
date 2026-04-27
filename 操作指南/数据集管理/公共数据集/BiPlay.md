BiPlay 包含 9.7 小时的双手动数据，这些数据由 aloha 机器人在美国加州大学伯克利分校的 RAIL 实验室收集。它包含 7023 个片段，2000 个语言标注和 326 个独特场景。



为了解决现有双臂数据集任务单一、环境固定的问题，BiPlay数据集采用随机物体和背景，采集多样化双臂操作轨迹。数据由多段3.5分钟的机器人操作视频拆分成7023个带语言任务描述的剪辑，总计10小时数据，支持双臂操作泛化研究。



论文：[https://huggingface.co/papers/2410.10088](https://huggingface.co/papers/2410.10088)

代码：[https://github.com/sudeepdasari/dit-policy](https://github.com/sudeepdasari/dit-policy)



如果您使用该数据集，请查看并遵守发布方声明的开源协议 [HuggingFace](https://huggingface.co/datasets/oier-mees/BiPlay)。



```text
@inproceedings{jones25fuse,
  title={Beyond Sight: Finetuning Generalist Robot Policies with Heterogeneous Sensors via Language Grounding},
  author={Joshua Jones and Oier Mees and Carmelo Sferrazza and Kyle Stachowicz and Pieter Abbeel and Sergey Levine},
  booktitle = {Proceedings of the IEEE International Conference on Robotics and Automation (ICRA)},
  year={2025},
  address = {Atlanta, USA}
}
```
