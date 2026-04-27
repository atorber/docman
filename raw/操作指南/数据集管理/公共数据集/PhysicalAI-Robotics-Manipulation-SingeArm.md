  

PhysicalAI-Robotics-Manipulation-SingeArm 是一组自动生成动作的数据集，用于 Franka Panda 机器人执行诸如堆叠积木、打开橱柜和抽屉等操作。该数据集是在 IsaacSim 中生成的，利用任务和运动规划算法自动找到任务的解决方案 。环境是桌面场景，其中对象布局和资产纹理由程序生成 。


如果您使用该数据集，请查看并遵守发布方声明的开源协议 [HuggingFace](https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-Manipulation-SingleArm)

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