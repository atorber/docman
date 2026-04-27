RealSource World 是一个大规模的真实世界机器人操作数据集，使用 RS-02 双臂人形机器人采集。该数据集包含在真实环境中执行的各种长距离操作任务，并对每个操作的原子技能和质量评估进行了详细的标注。

## 主要特点
* **超过 1400 万**帧真实世界的双臂操作演示。
* **超过11,428**集，涵盖**35 项**不同的操控任务。
* **71维本体**感觉状态空间，包括关节位置、速度、加速度、力、扭矩和末端执行器姿态。
* **多摄像头**视觉观察（头部摄像头、左手摄像头、右手摄像头），分辨率为 720×1280，帧率为 30 FPS。
* 对每一集进行**精细的标注，包括原子技能分割和质量评估。**
* **场景多样，**包括厨房、会议室、便利店和家庭环境。
* **双臂协调**任务，展现复杂的双手操作技能。



如果您使用该数据集，请查看并遵守发布方声明的开源协议 [HuggingFace](https://huggingface.co/datasets/RealSourceData/RealSource-World)

```
@misc{realsourceworld,
  title={RealSource World: A Large-Scale Real-World Dual-Arm Manipulation Dataset},
  author={RealSource},
  howpublished={\url{https://huggingface.co/datasets/RealSourceData/RealSource-World}},
  year={2025}
}
```