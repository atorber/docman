> [https://technology.robbyant.com/lingbot-world](https://technology.robbyant.com/lingbot-world)
> 世界模型的开放前沿


![1-8BJMTq46GEMAAAAAggAAAAgAfoeUAQBr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/1-8BJMTq46GEMAAAAAggAAAAgAfoeUAQBr_0e68c44.gif)


LingBot-World 是一个专为交互式世界模型设计的开源框架。其核心** LingBot-World-Base **致力于提供高保真、可控制且逻辑一致的模拟环境。该模型由一个可扩展数据引擎（Scalable Data Engine）驱动，通过从大规模游戏环境中学习物理规律与因果关系，超越了传统的被动式视频合成，实现了与生成世界的交互。



## 高保真模拟与精准控制
![2-cvsdT70t3EwAAAAAgMAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/2-cvsdT70t3EwAAAAAgMAAAAgADkxfAQFr_ec06c79.gif)

![3-XpAATLPVuJ0AAAAAgHAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/3-XpAATLPVuJ0AAAAAgHAAAAgADkxfAQFr_0478adb.gif)

![4-OW0PTYTEOwAAAAAAgOAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/4-OW0PTYTEOwAAAAAAgOAAAAgADkxfAQFr_709cfaa.gif)

LingBot-World 告别了随机的“幻觉”式生成。它支持精细化的、由动作驱动的生成（action-conditioned generation），能够精确响应用户指令，渲染出高质量且符合物理真实感的动态场景。







## 长时序一致性与记忆
![5-W9saRbhbS30AAAAAgFAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/5-W9saRbhbS30AAAAAgFAAAAgADkxfAQFr_b6c7459.gif)

![6-iIIBSbISntUAAAAAgSAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/6-iIIBSbISntUAAAAAgSAAAAgADkxfAQFr_eaf4db1.gif)

![7-gI1wR7SzNtoAAAAAgUAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/7-gI1wR7SzNtoAAAAAgUAAAAgADkxfAQFr_048a50d.gif)

凭借增强的上下文记忆能力，LingBot-World 能够在长达数分钟的轨迹中，持续保持结构的完整性、物体恒存性（object permanence）以及叙事逻辑的连贯性。







## 统一物理世界与游戏世界的建模
![8-Wx59S7vcKr0AAAAAgYAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/8-Wx59S7vcKr0AAAAAgYAAAAgADkxfAQFr_5d7e265.gif)

![9-adu2Q59lPA4AAAAAgQAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/9-adu2Q59lPA4AAAAAgQAAAAgADkxfAQFr_2229ade.gif)

![10-S_ksQIgsFSoAAAAAhTAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/10-S_ksQIgsFSoAAAAAhTAAAAgADkxfAQFr_25958d8.gif)

团队利用专有的可扩展数据引擎，将游戏引擎视为无限的数据生成器。该模型统一了物理世界与游戏世界的内在逻辑，使其能够从合成数据中获得强大的泛化能力，并成功应用于真实世界场景。







## 涌现能力
随着世界模型规模不断扩展，团队观察到一系列超越简单视频生成的复杂行为开始涌现，这表明模型对空间逻辑、时间持续性和物理约束具备了真正的理解。



**动态的屏外记忆**

![11-n9AXQq9vrGcAAAAAgIAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/11-n9AXQq9vrGcAAAAAgIAAAAgADkxfAQFr_350efda.gif)

模型不仅实现了简单的物体恒存性，还能对离开画面的智能体（例如视频中的猫）保持持续的记忆，并推断其在屏外的行为。这确保了当视角切回时，世界状态是自然演进的，而非静止冻结。



**探索生成边界**
![12-T3zuToQo5SEAAAAAjQAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/12-T3zuToQo5SEAAAAAjQAAAAgADkxfAQFr_ea22d42.gif)

团队的模型突破了时间连贯性的限制，现已能够生成超长时序的视频，并维持稳定、高保真的环境质量而不发生衰减。



**基于物理的真实约束**

![13-wOdsSpGc8GYAAAAAgKAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/13-wOdsSpGc8GYAAAAAgKAAAAgADkxfAQFr_d3e85d2.gif)

模型能够执行真实的碰撞动力学，防止智能体出现“穿模”或无视固体障碍等不符合物理规律的行为。这种对空间逻辑的严格遵循，确保了所有运动都具备物理真实感，而非单纯的视觉幻觉。

> 更多特性说明请参考蚂蚁灵波官网：[https://technology.robbyant.com/lingbot-world](https://technology.robbyant.com/lingbot-world)

## 局限性与未来方向
尽管 LingBot-World 模型展现了巨大的潜力，但仍面临若干技术瓶颈。首先，高昂的推理成本目前需要企业级 GPU 支持，这使得该技术难以在消费级硬件上普及。其次，由于模型的记忆能力是从上下文窗口中涌现的，而非来自一个显式的存储模块，模拟缺乏长期稳定性，常常导致“环境漂移”（environmental drifting）——即场景在长时间运行后逐渐失去结构完整性。此外，当前的控制能力仅限于基础的导航，尚不具备复杂交互或特定物体操控所需的精细控制精度。最后，通过因果蒸馏（causal distillation）来实现实时性能，目前不得不在一定程度上牺牲视觉保真度。

展望未来，团队的技术路线图将优先扩展动作空间和物理引擎，以支持更多样化、更复杂的交互。为了确保长期稳定性，团队计划引入显式的记忆模块，而不是依赖于涌现的上下文。此外，团队正致力于消除“生成漂移”（generation drift），为实现稳健的、可无限运行的游戏体验和更强大的模拟功能铺平道路。




# 在百舸平台上快速开始
## 部署环境要求
||部署要求|最佳实践|
|-|-|-|
|CPU|32核|64核|
|内存|320G|建议按表单默认值及以上|
|GPU|A800 * 4|本示例中使用8卡A800|
|CDS|按需|建议挂载云盘大小 100G 以上|
|其它|无|无|

**镜像**

请使用百舸官方镜像：`ccr-2hpgw1bh-pub.cnc.bj.baidubce.com/aihc-private/lingbot-world:v0.1`

本镜像使用基础镜像：`registry.baidubce.com/inference/aibox-cuda:v2.0-cu12.8-cudnn9-ubuntu22.04`



### 数据准备与系统依赖配置
```python
!set -e && \
wget -q https://doc.bce.baidu.com/bos-optimization/linux-bcecmd-0.5.10.zip && \
unzip -q linux-bcecmd-0.5.10.zip && \
chmod +x linux-bcecmd-0.5.10/bcecmd && \
mv linux-bcecmd-0.5.10/bcecmd /usr/local/bin/bcecmd && \
rm -rf linux-bcecmd-0.5.10 linux-bcecmd-0.5.10.zip

!bcecmd -v
```
```bash
apt-get update && apt-get install -y build-essential cmake

cd lingbot-world
source .venv/bin/activate

bcecmd bos cp -r bos:/aibox-private/LingBot/LingBot-World/lingbot-world-base-cam ./lingbot-world-base-cam
bcecmd bos cp -r bos:/aibox-private/LingBot/LingBot-World/lingbot-world-base-act ./lingbot-world-base-act
```


## 推理命令
### LingBot-World-Base (Cam) - 480P
```bash
torchrun --nproc_per_node=8 generate.py \
    --task i2v-A14B \
    --size 480*832 \
    --ckpt_dir ./lingbot-world-base-cam \
    --image examples/00/image.jpg \
    --action_path examples/00 \
    --dit_fsdp \
    --t5_fsdp \
    --ulysses_size 8 \
    --frame_num 161 \
    --prompt "The video presents a soaring journey through a fantasy jungle."
```
### LingBot-World-Base (Cam) - 720P
```bash
torchrun --nproc_per_node=8 generate.py \
    --task i2v-A14B \
    --size 720*1280 \
    --ckpt_dir ./lingbot-world-base-cam \
    --image examples/00/image.jpg \
    --action_path examples/00 \
    --dit_fsdp \
    --t5_fsdp \
    --ulysses_size 8 \
    --frame_num 161 \
    --prompt "The video presents a soaring journey through a fantasy jungle."
```
### 无控制信号运行
```bash
torchrun --nproc_per_node=8 generate.py \
    --task i2v-A14B \
    --size 480*832 \
    --ckpt_dir ./lingbot-world-base-cam \
    --image examples/00/image.jpg \
    --dit_fsdp \
    --t5_fsdp \
    --ulysses_size 8 \
    --frame_num 161 \
    --prompt "The video presents a soaring journey through a fantasy jungle."
```
### LingBot-World-Base (Act)
```bash
torchrun --nproc_per_node=8 generate.py \
    --task i2v-A14B \
    --size 480*832 \
    --ckpt_dir ./lingbot-world-base-act \
    --image examples/00/image.jpg \
    --action_path examples/00 \
    --dit_fsdp \
    --t5_fsdp \
    --ulysses_size 8 \
    --frame_num 161 \
    --prompt "Your prompt here"
```
## 参数说明
|参数|说明|
|-|-|
|`--task`|任务类型，使用 `i2v-A14B`|
|`--size`|输出分辨率，如 `480*832` 或 `720*1280`|
|`--ckpt_dir`|模型权重目录|
|`--image`|输入图像路径|
|`--action_path`|控制信号路径（包含 intrinsics.npy, poses.npy）|
|`--dit_fsdp`|DiT 模型使用 FSDP 分布|
|`--t5_fsdp`|T5 编码器使用 FSDP 分布|
|`--ulysses_size`|Ulysses 并行度，通常等于 GPU 数量|
|`--frame_num`|生成帧数，161帧约10秒（16 FPS）|
|`--prompt`|文本提示|
|`--t5_cpu`|可选，将 T5 放到 CPU 以节省显存|

## 生成更长时间视频
如果显存充足，可以增加 `frame_num` 生成1分钟视频：

```bash
--frame_num 961  # 1分钟视频 @ 16FPS
```
如果显存不足，使用 `--t5_cpu` 减少显存占用。

## 输入格式
### 控制信号（可选）
* `intrinsics.npy`: Shape `[num_frames, 4]`，格式 `[fx, fy, cx, cy]`
* `poses.npy`: Shape `[num_frames, 4, 4]`，OpenCV 坐标系下的变换矩阵

控制信号可以使用 [ViPE](https://github.com/nv-tlabs/vipe) 从视频中提取。

## 模型版本
|模型|控制信号|分辨率|下载链接|
|-|-|-|-|
|**LingBot-World-Base (Cam)**|相机姿态|480P & 720P|HuggingFace / ModelScope|
|**LingBot-World-Base (Act)**|动作|480P & 720P|HuggingFace|
|**LingBot-World-Fast**|-|-|*待发布*|

## 量化模型
对于显存有限的用户，可以使用 4-bit 量化版本：

下载链接：[https://huggingface.co/cahlen/lingbot-world-base-cam-nf4](https://huggingface.co/cahlen/lingbot-world-base-cam-nf4)

> ⚠️ 注意：量化模型仅用于推理，视觉质量和时间一致性可能略有下降。