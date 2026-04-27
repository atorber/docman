

PhysicalAI-Robotics-Manipulation-Kitchen 是一个自动生成机器人动作的数据集，这些机器人执行诸如打开和关闭橱柜、抽屉、洗碗机和冰箱等操作。该数据集是在 IsaacSim 中生成的，利用推理算法和基于优化的运动规划来自动找到任务的解决方案 [1, 3]。该数据集包含一个由 Kinova Gen3 机械臂构建的双手机械手。环境是厨房场景，其中的家具和电器都是程序生成的 [2]。该数据集可供商业使用。



如果您使用该数据集，请查看并遵守发布方声明的开源协议 [HuggingFace](https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-Manipulation-Kitchen)



```
[1] @inproceedings{garrett2020pddlstream,
    title={Pddlstream: Integrating symbolic planners and blackbox samplers via optimistic adaptive planning},
    author={Garrett, Caelan Reed and Lozano-P{\'e}rez, Tom{\'a}s and Kaelbling, Leslie Pack},
    booktitle={Proceedings of the international conference on automated planning and scheduling},
    volume={30},
    pages={440--448},
    year={2020}
}
[2] @article{Eppner2024,
    title = {scene_synthesizer: A Python Library for Procedural Scene Generation in Robot Manipulation},
    author = {Clemens Eppner and Adithyavairavan Murali and Caelan Garrett and Rowland O'Flaherty and Tucker Hermans and Wei Yang and Dieter Fox},
    journal = {Journal of Open Source Software}
    publisher = {The Open Journal},
    year = {2024},
    Note = {\url{https://scene-synthesizer.github.io/}}
}
[3] @inproceedings{curobo_icra23,
    author={Sundaralingam, Balakumar and Hari, Siva Kumar Sastry and
        Fishman, Adam and Garrett, Caelan and Van Wyk, Karl and Blukis, Valts and
        Millane, Alexander and Oleynikova, Helen and Handa, Ankur and
        Ramos, Fabio and Ratliff, Nathan and Fox, Dieter},
    booktitle={2023 IEEE International Conference on Robotics and Automation (ICRA)},
    title={CuRobo: Parallelized Collision-Free Robot Motion Generation},
    year={2023},
    volume={},
    number={},
    pages={8112-8119},
    doi={10.1109/ICRA48891.2023.10160765}
}
```