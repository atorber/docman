## RoboMIND 概述 
### RoboMIND 组成


RoboMIND（多体智能规范数据集和机器人操作基准），这是一个综合数据集，包含 107k 条真实世界演示轨迹，涵盖 479 项不同任务和 96 个独特物体类别。



RoboMIND 数据集集成了来自多个机器人实体的远程操作数据，包括来自 Franka Emika Panda 单臂机器人的 52,926 条轨迹，来自 Tien Kung 仿人机器人的 19,152 条轨迹，来自 AgileX Cobot Magic V2.0 双臂机器人的 10,629 条轨迹，以及来自 UR-5e 单臂机器人的 25,170 条轨迹。



RoboMIND 为研究人员和开发者提供了一个宝贵资源，通过涵盖广泛的任务类型和多样化的物体类别，推动机器人学习和自动化技术的发展。该数据集因其巨大的规模和卓越的质量而脱颖而出，确保其在实际应用中的有效性和可靠性。



### 轨迹长度分布


不同的机器人形态表现出不同的轨迹长度分布。Franka 和 UR 机器人通常具有较短的轨迹，步数少于 200 步，非常适合训练基础操作技能。相比之下，Tien Kung 和 AgileX 机器人通常表现出超过 500 步的较长轨迹，这使得它们更适合训练长时程任务和复杂技能组合。


任务类别 

根据自然语言描述，并考虑物体大小、使用场景和操作技能等因素，我们将数据集任务分为六大类：1) 机构化操作（机构操作）。2) 协调操作（协调操作）。3) 基础操作（基础操作）。4) 多物体交互（物体交互）。5) 精密操作（精密操作）。6) 场景理解（场景理解）。除了基础操作外，数据集还包括大量复杂任务，为训练通用机器人策略提供丰富的数据支持。


物品种类多样性 

该数据集包含 96 种不同的物体类别。在厨房场景中，它包括草莓、鸡蛋、香蕉和梨等常见食物，以及烤箱和面包机等复杂的可调节电器。在家庭环境中，数据集既包含网球等刚性物体，也包含玩具等可变形物体。办公和工业场景包括需要精确控制的微小物体，如电池和齿轮。这种多样的物体范围增强了数据集的复杂性，并支持训练适用于各种环境的通用操作策略。



## 数据描述


构建高质量的机器人训练数据集对于开发具有强大泛化能力的端到端具身人工智能模型至关重要。一个理想的数据集应涵盖多样化的场景、任务类型和机器人形态，使模型能够适应不同的环境并可靠地执行各种任务。我们的团队构建了一个大规模、真实世界的机器人学习数据集，记录了在复杂环境中执行长期任务过程中的交互数据，支持具有通用操作能力的模型训练。



如果您使用该数据集，请查看并遵守发布方声明的开源协议 [HuggingFace](https://huggingface.co/datasets/x-humanoid-robomind/RoboMIND)。



```text
@inproceedings{wu2025robomind,
              title={Robomind: Benchmark on multi-embodiment intelligence normative data for robot manipulation},
              author={Wu, Kun and Hou, Chengkai and Liu, Jiaming and Che, Zhengping and Ju, Xiaozhu and Yang, Zhuqin and Li, Meng and Zhao, Yinuo and Xu, Zhiyuan and Yang, Guang and others},
              booktitle={Robotics: Science and Systems (RSS) 2025}, 
              year={2025},
              publisher={Robotics: Science and Systems Foundation}, 
              url={https://www.roboticsproceedings.org/rss21/p152.pdf} 
}
```
