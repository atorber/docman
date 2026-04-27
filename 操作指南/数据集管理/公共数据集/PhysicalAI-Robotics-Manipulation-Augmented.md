
这是一个完全注释的合成数据集，包含 1,000 个示例，演示了单个 Franka Panda 机械臂在 Isaac Lab 中执行固定顺序的三块立方体堆叠任务。机器人始终按照以下顺序堆叠立方体：蓝色（底部）→红色（中间）→绿色（顶部）。

数据集是使用以下管道生成的：

* 收集了 10 个堆叠任务的人类远程操作演示。
* 使用 Isaac Lab 的**Mimic**工具 [1] 在 Isaac Sim 中模拟了 1,000 条高质量轨迹。
* 应用**Cosmos Transfer1**模型 [2]，通过照片级真实感域自适应增强桌面相机的 RGB 视觉效果。

每个演示都包括同步的多模式数据：

* 来自桌面和腕戴式摄像机的 RGB 视频。
* 来自桌面相机的深度、分割和表面法线图。
* 完整的低级机器人和物体状态（关节、末端执行器、夹持器、立方体姿势）。
* 机器人执行的动作序列。

该数据集非常适合行为克隆、策略学习和通用机器人操作研究。



如果您使用该数据集，请查看并遵守发布方声明的开源协议 [HuggingFace](https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-Manipulation-Augmented)
```
[1] @inproceedings{mandlekar2023mimicgen,
    title={MimicGen: A Data Generation System for Scalable Robot Learning using Human Demonstrations},
    author={Mandlekar, Ajay and Nasiriany, Soroush and Wen, Bowen and Akinola, Iretiayo and Narang, Yashraj and Fan, Linxi and Zhu, Yuke and Fox, Dieter},
    booktitle={7th Annual Conference on Robot Learning},
    year={2023}
    }
[2] @misc{nvidia2025cosmostransfer1conditionalworldgeneration,
      title = {Cosmos-Transfer1: Conditional World Generation with Adaptive Multimodal Control},
      author = {NVIDIA and Abu Alhaija, Hassan and Alvarez, Jose and Bala, Maciej and Cai, Tiffany and Cao, Tianshi and Cha, Liz and Chen, Joshua and Chen, Mike and Ferroni, Francesco and Fidler, Sanja and Fox, Dieter and Ge, Yunhao and Gu, Jinwei and Hassani, Ali and Isaev, Michael and Jannaty, Pooya and Lan, Shiyi and Lasser, Tobias and Ling, Huan and Liu, Ming-Yu and Liu, Xian and Lu, Yifan and Luo, Alice and Ma, Qianli and Mao, Hanzi and Ramos, Fabio and Ren, Xuanchi and Shen, Tianchang and Tang, Shitao and Wang, Ting-Chun and Wu, Jay and Xu, Jiashu and Xu, Stella and Xie, Kevin and Ye, Yuchong and Yang, Xiaodong and Zeng, Xiaohui and Zeng, Yu},
      journal = {arXiv preprint arXiv:2503.14492},
      year = {2025},
      url = {https://arxiv.org/abs/2503.14492}
    }
```