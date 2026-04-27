GR00T-Dreams是NVIDIA推出的一套创新的机器人合成数据生成与神经仿真框架，它旨在通过生成式AI和世界模型，为机器人训练创造海量的、高质量的数据，从而解决机器人学习过程中面临的数据稀缺瓶颈。



### 使用说明
整个流程包含以下三个主要阶段：

* **世界模型后训练**: 使用训练数据对Cosmos-Predict2进行微调与推理
*  **IDM 使用**: 使用 IDM 进行动作提取与数据转换
* **评分**: 通过开源 VLM 对模型进行评分

## 一、环境配置
||部署要求|最佳实践|
|-|-|-|
|CPU|32核|建议按表单默认值及以上|
|内存|384G|建议按表单默认值及以上|
|GPU|需要适合AI推理的多卡计算资源，如H20等，用于模型微调&IDM标注&评测等|本示例使用4卡H20开发机|
|存储|无|500G以上（需要下载模型及数据集）|
|其它|无|无|

## 二、数据准备
### 2.1 原始数据下载
bos 工具下载：

```
wget https://doc.bce.baidu.com/bos-optimization/linux-bcecmd-0.5.9.zip   #下载
unzip linux-bcecmd-0.5.9.zip   #解压
apt install unzip
ln linux-bcecmd-0.5.9/bcecmd /usr/sbin/  #设置为全局使用
```
使用 BOS 下载 checkpoint（请保证存储设备有至少 500G 空间或者使用 PFS 等存储挂载）：

```
bcecmd bos sync bos:/aihc-models-bj/Cosmos-Predict2/ /mnt/pfs/cosmos-predict2/
bcecmd bos sync bos:/aihc-rdw-bj/gr1-train/ /mnt/pfs/gr1-train/
```
## 三、Cosmos predict 微调与推理
### 3.1 环境验证
```
cd /workspace/cosmos-predict2
python ./scripts/test_environment.py
```
### 3.2 数据加载
将下载的 ckpt 放到指定文件夹：

```
rm -rf /workspace/cosmos-predict2/checkpoints
ln -s /mnt/pfs/cosmos-predict2/checkpoints /workspace/cosmos-predict2/checkpoints
```
将下载的数据集放置到指定文件夹：

```
rm -rf /workspace/cosmos-predict2/datasets/benchmark_train/gr1
mkdir -p /mnt/pfs/gr1/videos
ln -s /mnt/pfs/gr1 /workspace/cosmos-predict2/datasets/benchmark_train/gr1
cp /mnt/pfs/gr1-train/gr1/*mp4 /mnt/pfs/gr1/videos
cp /mnt/pfs/gr1-train/metadata.csv /mnt/pfs/gr1/
```
### 3.3 数据预处理
```
python -m scripts.get_t5_embeddings_from_groot_dataset --dataset_path datasets/benchmark_train/gr1/
```
处理后可查看 datasets/benchmark_train/gr1 目录，其中包含csv 及三个文件夹为处理正确

### 3.4 模型微调
通过以下指令进行模型微调：

```
torchrun --nproc_per_node=1 --master_port=12341 -m scripts.train --config=cosmos_predict2/configs/base/config.py -- experiment=predict2_video2world_training_2b_groot_gr1_480
```
### 3.5 模型推理
通过以下代码通过提示词生成视频（中英文均可）：

```
torchrun --nproc_per_node=4 --master_port=12341 -m examples.video2world_gr00t \
--model_size 14B --gr00t_variant gr1 \
--prompt "Use the right hand to pick up rubik's cube from from the bottom of the three-tiered wooden shelf to to the top of the three-tiered wooden shelf." \
--input_path assets/sample_gr00t_dreams_gr1/8_Use_the_right_hand_to_pick_up_rubik\'s_cube_from_from_the_bottom_of_the_three-tiered_wooden_shelf_to_to_the_top_of_the_three-tiered_wooden_shelf..png \
--num_gpus 4 --prompt_prefix ""  --disable_guardrail \
--save_path output/generated_video_gr1.mp4

torchrun --nproc_per_node=4 --master_port=12341 -m examples.video2world_gr00t \
--model_size 14B --gr00t_variant gr1 \
--prompt "用右手将魔方从底层木架底层移至第三层" \
--input_path assets/sample_gr00t_dreams_gr1/8_Use_the_right_hand_to_pick_up_rubik\'s_cube_from_from_the_bottom_of_the_three-tiered_wooden_shelf_to_to_the_top_of_the_three-tiered_wooden_shelf..png \
--num_gpus 4 --prompt_prefix ""  --disable_guardrail \
--save_path output/generated_video_gr1.mp4
```
### 3.5 使用拒绝采样提升生成视频评分
生成多个视频通过Cosmos-Reason 进行评分最后输出得分最高的视频：

```
torchrun --nproc_per_node=2 --master_port=12341   -m examples.video2world_bestofn   \
--model_size 14B   --gr00t_variant gr1   \
--prompt "Use the right hand to pick up rubik's cube from from the bottom of the three-tiered wooden shelf to to the top of the three-tiered wooden shelf."   \
--input_path assets/sample_gr00t_dreams_gr1/8_Use_the_right_hand_to_pick_up_rubik\'s_cube_from_from_the_bottom_of_the_three-tiered_wooden_shelf_to_to_the_top_of_the_three-tiered_wooden_shelf..png   \
--num_gpus 2   --num_generations 4   --prompt_prefix ""   \
--disable_guardrail   --save_path output/best-of-n-gr00t-gr1
```
## 四、IDM 动作提取与数据转换
下载 IDM 模型：

```
hf download seonghyeonye/IDM_gr1
cp -r /mnt/pfs/IDM_gr1/ /workspace/GR00T-Dreams/IDM_dump/data
cd /workspace/GR00T-Dreams/
```
相关脚本位于`IDM_dump/scripts/preprocess`目录下。每个脚本针对特定的**embodiment**进行设计。我们使用**gr1**（Fourier GR1 人形机器人）具身进行演示：

**提取视频对应指令**:

```
python IDM_dump/split_video_instruction.py \
    --source_dir "/workspace/cosmos-predict2/output/best-of-n-gr00t-gr1" \
    --output_dir "IDM_dump/data/gr1_data" 
```
**视频帧统一化处理**:

```
python IDM_dump/preprocess_video.py \
    --src_dir "IDM_dump/data/gr1_data" \
    --dst_dir "IDM_dump/data/gr1_data_split" \
    --dataset gr1 
```
**转换为 LeRobot 格式:**

```
python IDM_dump/raw_to_lerobot.py \
    --input_dir "IDM_dump/data/gr1_data_split" \
    --output_dir "IDM_dump/data/gr1_unified.data" \
    --cosmos_predict2 
```
**提取机器人动作序列：**

```
# 如果直接调用hf不通的话可以使用如下代码尝试镜像
# export HF_ENDPOINT=https://hf-mirror.com

PYTHONPATH=. CUDA_VISIBLE_DEVICES=0,1 python IDM_dump/dump_idm_actions.py \
    --checkpoint "seonghyeonye/IDM_gr1" \
    --dataset "IDM_dump/data/gr1_unified.data" \
    --output_dir "IDM_dump/data/gr1_unified.data_idm" \
    --num_gpus 1 \
    --video_indices "0 8"
```
**提取结果验证：**

```
uv pip install parquet-tools
parquet-tools csv IDM_dump/data/gr1_unified.data_idm/data/chunk-000/episode_000000.parquet
```
## 五、DreamGen Benchmark 评估
**配置路径：**

```
video_dir="/workspace/cosmos-predict2/output/dream_gen_benchmark/cosmos_predict2_14b_gr1_object"
csv_path="/workspace/cosmos-predict2/output/dream_gen_benchmark/result.csv"
device="cuda:0"
```
以下调用方式为 HF 模型库直接下载调用，您也可以直接将模型下载至/root/.cache/huggingface/hub路径下直接运行

**评分：**

```
python -m dreamgenbench.eval_sr_qwen_whole \
    --video_dir "$video_dir" \
    --output_csv "$csv_path" \
    --device "$device"
    
# 您可以通过添加--zeroshot true来声明未微调模型
```
如果您拥有 GPT API key，也可以使用 GPT 4o 进行评分：

```
python -m dreamgenbench.eval_sr_gpt4o_whole \
    --video_dir "$video_dir" \
    --output_csv "$csv_path" \
    --api_key "$api_key"
```
**一致性测评 PA Score：**

```
python -m dreamgenbench.eval_qwen_pa \
    --video_dir "$video_dir" \
    --output_csv "$csv_path" \
    --device "$device"
```
## 