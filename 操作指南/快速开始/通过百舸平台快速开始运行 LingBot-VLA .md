> [https://technology.robbyant.com/lingbot-vla](https://technology.robbyant.com/lingbot-vla)
> 一个实用的 VLA 基础模型


## 模型概要
蚂蚁灵波团队开发了 LingBot-VLA 具身智能基座模型，其训练数据涵盖 9 种主流双臂机器人配置、总计约 20,000 小时的真实世界操作数据。团队在 3 种机器人构型上进行了系统性评估，每种构型设置 100 项任务，每项任务使用 130 条后训练数据进行适配。实验结果表明，LingBot-VLA 相较于现有方案具有显著优势，充分验证了其卓越的性能表现与广泛的泛化能力。与此同时，团队构建了一套高效的后训练工具链，在 8 卡 GPU 配置下实现了每秒 261 个样本的吞吐量，较现有 VLA 代码库提升了 1.5 至 2.8 倍（具体取决于所依赖的 VLM 基座模型）。上述特性使该模型能够充分满足实机部署需求。为推动机器人学习领域的持续发展，团队开源了全部代码、基座模型及评测基准数据，旨在为更具挑战性的任务研究提供支撑，并促进领域内评估标准的规范化建设。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=a73cee898d19497c87b96b28233eab29&docGuid=Uc3jpBiQivQ_fP)




## 真机 Scaling Law
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=ffe83d4da2af4b98b19527b3d2f985a2&docGuid=Uc3jpBiQivQ_fP)


基于在海量的真实世界数据上的预训练，团队第一次系统研究了 VLA 模型在真实机器人任务性能上随着数据规模增长时的 scaling law。该项目发现随着预训练数据规模从 3,000 小时扩展到 6,000、13,000、18,000，最终至20,000 小时，模型在下游任务的成功率获得持续且显著的提升。值得注意的是，预训练数据量达到 20,000 小时时，模型性能仍呈现上升趋势，表明 VLA 的性能仍然能够随着数据量的增加而提升。这些实验结果证明了 VLA 模型在用真实数据预训练时呈现了良好的可扩展性，为未来的 VLA 开发和大规模数据挖掘提供了重要启示。



## 大规模数据整理和高效训练代码库
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=ae8751874b9d4944be1df9adeb3e30a4&docGuid=Uc3jpBiQivQ_fP)
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=9bcfcb9c47ba41dcbfac0e8f3f6f3a6f&docGuid=Uc3jpBiQivQ_fP)
团队仔细构造了 20,000 小时的真实机器人训练数据，涵盖了 9 种主流的双臂机器人构型。为了进行精确的数据标注，数据里的视频由人工标注者按原子动作进行切分，并用大模型标注视频对应任务和子任务。在 codebase 的开发中，适配了 Fully Sharded Data Parallel (FSDP) 分布式、混合精度、算子融合等优化。高质量的海量数据和高效的训练 codebase 是 LingBot-VLA 优越性能的基础。





## 大规模多构型真机测试


![6-lQrYQqfdcf4AAAAAghAAAAgADkxfAQFr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/6-lQrYQqfdcf4AAAAAghAAAAgADkxfAQFr_5cfe78c.gif)


**团队在多构型机器人（Agibot G1, AgileX, Galaxea R1Pro）上进行了大规模真机实验验证：**

每个模型在各构型100个任务上进行评测，各任务分别采集130条轨迹用于模型训练。实验结果表明LingBot-VLA模型对比现有VLA模型表现出明显的优势，展现了LingBot-VLA强大的准确性和泛化性。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=fbe9fc69351b47f08307685fb0bdf107&docGuid=Uc3jpBiQivQ_fP)




## 深度信息辅助的机器人操作
### 真机实验结果
|Platform|π0.5||Ours w/o depth||Ours w/ depth||
|-|-|-|-|-|-|-|
||SR|PS|SR|PS|SR|PS|
|Agibot G1|7.77%|21.98%|12.82%|30.04%|11.98%|30.47%|
|AgileX|17.20%|34.82%|15.50%|36.31%|18.93%|40.36%|
|Galaxea R1Pro|14.10%|26.14%|18.89%|34.71%|20.98%|35.40%|
|Average|13.02%|27.65%|15.74%|33.69%|17.30%|35.41%|

### 仿真实验结果
#### (a). Clean Scenes
||π0.5|Ours w/o depth|Ours w/ depth|
|-|-|-|-|
|Average SR|82.74%|86.50%|88.56%|

#### (b). Randomized Scenes
||π0.5|Ours w/o depth|Ours w/ depth|
|-|-|-|-|
|Average SR|76.76%|85.34%|86.68%|

为了显式捕捉操控环境中的空间感知能力，并进一步提升机器人执行的鲁棒性，团队采用了一种基于查询向量（query）的深度蒸馏方法。具体而言，团队引入了与三视角操作图像相对应的可学习 queries，这些 queries 经 VLM 处理后，与 LingBot-Depth 输出的 depth embeddings 进行对齐。这种对齐机制在维持模型训练与推理的效率的同时，有效将深度信息集成到 LingBot-VLA 中。在真实机器人平台和仿真环境下进行的广泛实验证明，深度信息的融入提升了 LingBot-VLA 的操控性能。





## 机器人操作任务的高效迁移
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f2c858ed467648798a1949ea23c3f0d4&docGuid=Uc3jpBiQivQ_fP)


得益于涵盖主流构型和详尽任务的大规模预训练，LingBot-VLA 具备强大的通用操控能力，并且能够将其高效迁移到多样的下游机器人任务中。实验表明，LingBot-VLA 在下游任务中能够使用更少的数据，达到超越 π0.5 的性能；并且性能优势会随着数据量的增加而持续扩大。



## 与透明物体交互
![7-u4JPRqVyFC0AAAAAgSAAAAgAfoeUAQBr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/7-u4JPRqVyFC0AAAAAgSAAAAgAfoeUAQBr_5ffe351.gif)


引入深度信息后，团队的模型可以更好得感知场景内透明物体，如玻璃花瓶，并依照指令“插花”，完成指定动作。



## 复杂精细化操作

![8-zoUOSojWLBQAAAAAgOAAAAgAfoeUAQBr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/8-zoUOSojWLBQAAAAAgOAAAAgAfoeUAQBr_ae3afe0.gif)

![9-9hQeSpgki8oAAAAAgXAAAAgAfoeUAQBr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/9-9hQeSpgki8oAAAAAgXAAAAgAfoeUAQBr_9cc1f82.gif)

![10-7_dcSrrlsXgAAAAAgPAAAAgAfoeUAQBr.gif](https://bce.bdstatic.com/doc/bce-doc/AIHC/10-7_dcSrrlsXgAAAAAgPAAAAgAfoeUAQBr_07355f1.gif)

经过快速微调后，团队的模型可以完成相对复杂，包含较多精细化操作的指令，比如清洁餐具，并将餐具摆放到指定位置

# 在百舸平台上快速开始


## 部署环境要求
||部署要求|最佳实践|
|-|-|-|
|CPU|32核|64核|
|内存|320G|建议按表单默认值及以上|
|GPU|A800 * 4|本示例中使用8卡A800|
|CDS|按需|按需|
|其它|无|无|

**镜像**

请使用百舸官方镜像：`ccr-2hpgw1bh-pub.cnc.bj.baidubce.com/aihc-private/lingbot-vla:v0.1-0312-main-16ac002`

本镜像使用基础镜像：`registry.baidubce.com/inference/aibox-cuda:v2.0-cu12.8-cudnn9-ubuntu22.04`

如果不使用本示例提供的`lingbot-vla:v0.1-0312-main-16ac002`镜像，安装方法参考下文【依赖配置过程参考】



### 依赖配置过程参考（镜像中已完成配置）
```bash
# 安装 PyTorch 2.8.0
pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cu128

# 克隆 LeRobot
GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/huggingface/lerobot.git
cd lerobot
git checkout 0cf864870cf29f4738d3ade893e6fd13fbd7cdb5
pip install -e .

# 安装 flash attention（需提前下载 wheel 文件）
pip install /path/to/flash_attn-2.8.3+cu12torch2.8cxx11abiTRUE-cp312-cp312-linux_x86_64.whl

# 克隆 lingbot-vla
git clone https://github.com/robbyant/lingbot-vla.git
cd lingbot-vla/
git submodule update --remote --recursive
pip install -e .
pip install -r requirements.txt

# 安装 LingBot-Depth 依赖
cd ./lingbotvla/models/vla/vision_models/lingbot-depth/
pip install -e . --no-deps
cd ../MoGe
pip install -e .
```
## 获取基座模型checkpoint
## 【方式1】从百度BOS获取
拷贝模型

```python
!set -e && \
wget -q https://doc.bce.baidu.com/bos-optimization/linux-bcecmd-0.5.10.zip && \
unzip -q linux-bcecmd-0.5.10.zip && \
chmod +x linux-bcecmd-0.5.10/bcecmd && \
mv linux-bcecmd-0.5.10/bcecmd /usr/local/bin/bcecmd && \
rm -rf linux-bcecmd-0.5.10 linux-bcecmd-0.5.10.zip

!bcecmd -v
```
```python
bcecmd bos cp -r bos:/aibox-private/LingBot/LingBot-VLA/Qwen2.5-VL-3B-Instruct/ ~/workspace/lingbot-vla/Qwen2.5-VL-3B-Instruct
bcecmd bos cp -r bos:/aibox-private/LingBot/LingBot-VLA/lingbot-vla-4b-depth/ ~/workspace/lingbot-vla/lingbot-vla-4b-depth
bcecmd bos cp -r bos:/aibox-private/LingBot/LingBot-VLA/lingbot-vla-4b/ ~/workspace/lingbot-vla/lingbot-vla-4b

cd ~/workspace/lingbot-va
```
### 【方式2】从HuggingFace获取
```bash
# 配置网络代理
export HF_ENDPOINT=https://hf-mirror.com
export http_proxy=http://<你使用的网络代理>
export https_proxy=http://<你使用的网络代理>

# 下载 VLA 模型
python3 scripts/download_hf_model.py --repo_id robbyant/lingbot-vla-4b --local_dir .

# 下载带深度的 VLA 模型
python3 scripts/download_hf_model.py --repo_id robbyant/lingbot-vla-4b-depth --local_dir .

# 下载 Qwen2.5-VL-3B-Instruct（Tokenizer 需要）
python3 scripts/download_hf_model.py --repo_id Qwen/Qwen2.5-VL-3B-Instruct --local_dir .
```
## 训练命令
### 无深度版本
```bash
cd ~/workspace/lingbot-vla

# 配置网络代理（可选）
export http_proxy=http://10.0.7.40:18000
export https_proxy=http://10.0.7.40:18000
export HF_ENDPOINT=https://hf-mirror.com

# 运行训练
bash train.sh tasks/vla/train_lingbotvla.py ./configs/vla/robotwin_load20000h.yaml \
  --model.model_path ./lingbot-vla-4b \
  --data.train_path lerobot/aloha_static_fork_pick_up \
  --train.output_dir /root/workspace/output/lingbot_robotwin5tasks \
  --model.tokenizer_path ./Qwen2.5-VL-3B-Instruct \
  --train.micro_batch_size 1 \
  --train.global_batch_size 8
```
### 有深度版本
```bash
cd ~/workspace/lingbot-vla

# 配置网络代理（可选）
export http_proxy=http://10.0.7.40:18000
export https_proxy=http://10.0.7.40:18000
export HF_ENDPOINT=https://hf-mirror.com

# 运行训练
bash train.sh tasks/vla/train_lingbotvla.py ./configs/vla/robotwin_load20000h_depth.yaml \
  --model.model_path /root/workspace/lingbot-vla/lingbot-vla-4b-depth \
  --data.train_path lerobot/aloha_static_fork_pick_up \
  --train.output_dir /root/workspace/output/lingbot_depth_robotwin5tasks \
  --model.tokenizer_path ./Qwen2.5-VL-3B-Instruct \
  --model.moge_path /root/workspace/lingbot-vla/lingbot-vla-4b-depth/moge2-vitb-normal.pt \
  --model.morgbd_path /root/workspace/lingbot-vla/lingbot-vla-4b-depth/LingBot-Depth \
  --train.micro_batch_size 1 \
  --train.global_batch_size 8
```
### 参数说明
|参数|说明|示例值|
|-|-|-|
|`--model.model_path`|预训练 VLA 模型路径|`/root/workspace/lingbot-vla/lingbot-vla-4b`|
|`--model.tokenizer_path`|Qwen2.5-VL-3B-Instruct 路径|`/root/workspace/lingbot-vla/Qwen2.5-VL-3B-Instruct`|
|`--data.train_path`|训练数据路径|`path/to/mixed_robotwin_5tasks`|
|`--train.output_dir`|输出目录|`/root/workspace/output/lingbot_robotwin5tasks`|
|`--train.micro_batch_size`|单卡 batch size|`1`|
|`--train.global_batch_size`|全局 batch size|`8`（8卡）|
|`--model.moge_path`|MoGe 模型路径（深度版本）|`.../lingbot-vla-4b-depth/moge2-vitb-normal.pt`|
|`--model.morgbd_path`|LingBot-Depth 路径（深度版本）|`.../lingbot-vla-4b-depth/LingBot-Depth`|

## 评估
```bash
# robotwin2.0 评估
export QWEN25_PATH=./Qwen2.5-VL-3B-Instruct
python -m deploy.lingbot_robotwin_policy \
 --model_path /root/workspace/output/lingbot_depth_robotwin5tasks \		# 填写你需要评估的模型的路径
 --use_length 50 \
 --port port
```
## 目录结构
```
lingbot-vla/
├── lingbot-vla-4b/           # VLA 模型（无深度）
├── lingbot-vla-4b-depth/     # VLA 模型（有深度）
├── Qwen2.5-VL-3B-Instruct/  # Tokenizer
├── configs/vla/              # 训练配置
│   ├── robotwin_load20000h.yaml
│   └── robotwin_load20000h_depth.yaml
├── tasks/vla/               # 训练脚本
│   └── train_lingbotvla.py
├── deploy/                   # 部署脚本
├── scripts/                  # 工具脚本
└── train.sh                  # 训练入口脚本
```