创建大型、多样化、高质量的机器人操作数据集是实现更强大和鲁棒的机器人操作策略的重要基石。然而，创建此类数据集具有挑战性：在不同环境中收集机器人操作数据面临着后勤和安全问题，并且需要大量硬件和人力投入。因此，即使是目前最通用的机器人操作策略，也主要是在少数具有有限场景和任务多样性的环境中收集的数据上进行训练的。



在这项工作中，我们介绍了 DROID（分布式机器人交互数据集），一个多样化的机器人操作数据集，包含 76k 个演示轨迹或 350 小时的交互数据，由 50 名数据收集者在 12 个月内从北美、亚洲和欧洲的 564 个场景和 86 项任务中收集。我们证明了使用 DROID 进行训练可以带来性能更高、鲁棒性更强和泛化能力更好的策略。我们开源了完整的数据集、策略训练的代码以及一个详细的指南，用于重现我们的机器人硬件设置。



使用说明文档：[https://droid-dataset.github.io/droid/](https://droid-dataset.github.io/droid/)

代码：[https://github.com/droid-dataset/droid](https://github.com/droid-dataset/droid)



如果您使用该数据集，请查看并遵守发布方声明的开源协议 [droid-dataset.github.io](https://droid-dataset.github.io/)。



```text
@article{khazatsky2024droid,
    title   = {DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset},
    author  = {Alexander Khazatsky and Karl Pertsch and Suraj Nair and Ashwin Balakrishna and Sudeep Dasari and Siddharth Karamcheti and Soroush Nasiriany and Mohan Kumar Srirama and Lawrence Yunliang Chen and Kirsty Ellis and Peter David Fagan and Joey Hejna and Masha Itkina and Marion Lepert and Yecheng Jason Ma and Patrick Tree Miller and Jimmy Wu and Suneel Belkhale and Shivin Dass and Huy Ha and Arhan Jain and Abraham Lee and Youngwoon Lee and Marius Memmel and Sungjae Park and Ilija Radosavovic and Kaiyuan Wang and Albert Zhan and Kevin Black and Cheng Chi and Kyle Beltran Hatch and Shan Lin and Jingpei Lu and Jean Mercat and Abdul Rehman and Pannag R Sanketi and Archit Sharma and Cody Simpson and Quan Vuong and Homer Rich Walke and Blake Wulfe and Ted Xiao and Jonathan Heewon Yang and Arefeh Yavary and Tony Z. Zhao and Christopher Agia and Rohan Baijal and Mateo Guaman Castro and Daphne Chen and Qiuyu Chen and Trinity Chung and Jaimyn Drake and Ethan Paul Foster and Jensen Gao and Vitor Guizilini and David Antonio Herrera and Minho Heo and Kyle Hsu and Jiaheng Hu and Muhammad Zubair Irshad and Donovon Jackson and Charlotte Le and Yunshuang Li and Kevin Lin and Roy Lin and Zehan Ma and Abhiram Maddukuri and Suvir Mirchandani and Daniel Morton and Tony Nguyen and Abigail O'Neill and Rosario Scalise and Derick Seale and Victor Son and Stephen Tian and Emi Tran and Andrew E. Wang and Yilin Wu and Annie Xie and Jingyun Yang and Patrick Yin and Yunchu Zhang and Osbert Bastani and Glen Berseth and Jeannette Bohg and Ken Goldberg and Abhinav Gupta and Abhishek Gupta and Dinesh Jayaraman and Joseph J Lim and Jitendra Malik and Roberto Martín-Martín and Subramanian Ramamoorthy and Dorsa Sadigh and Shuran Song and Jiajun Wu and Michael C. Yip and Yuke Zhu and Thomas Kollar and Sergey Levine and Chelsea Finn},
    year    = {2024},
}
```
