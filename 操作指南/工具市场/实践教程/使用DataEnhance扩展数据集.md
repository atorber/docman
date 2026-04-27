DataEnhance 是集多种数据增强策略于一体的数据工具，通过数据增强策略的使能，扩展出更加丰富和复杂的数据集，提升 LLM 训练效果。在缺少或仅有少量业务数据的情况下，使用DataEnhance进行数据拓展可以有效提升自身业务场景下的模型效果

- 主要增强策略

| 策略名 | 介绍 | 适用领域 |
| --- | --- | --- |
| [agent_instruct](https://arxiv.org/pdf/2402.14830) | 基于大模型针对数据可扩展的方向给出建议，然后基于数据和建议用大模型生成新的数据 | 通用 |
| [evol_instruct](https://arxiv.org/pdf/2304.12244) | 基于大模型将种子数据从广度和深度两个维度进行数据扩展 | 通用 |
| [self_instruct](https://arxiv.org/pdf/2212.10560) | 通过迭代的方式，基于一个有限的手动编写的种子数据集，利用大模型指导生成更广泛的数据集 | 通用 |
| [mathscale](https://arxiv.org/pdf/2403.02884) | 基于种子数据，进行主题+知识点提取，然后形成知识图（主题-主题，主题-知识点，知识点-知识点），再根据知识图谱中的主题+知识点使用大模型生成数据 | 数学专用 |
## 资源准备
可根据资源规模、稳定性、灵活性等要求按需准备轻量计算实例或通用计算资源池，用于快速部署DataEnhance。
## 安装DataEnhance

1. 在百舸平台**工具市场**选择 DataEnhance模版，点击 **部署工具 **按钮；
2. 完成配置后点击**部署**，当**工具状态**从**创建中**变为**运行中**，表明工具已部署成功。
## 快速开始
### 配置大模型API
OpenAI API的使用需要配置两个参数：api_key 和 base_url，可以通过以下三种形式进行传递：
```bash
# 1. 命令行
python -m scripts.agent_instruct --api_key xxx --base_url xxx

# 2. 环境变量
export OPENAI_API_KEY=xxx
export OPENAI_BASE_URL=xxx

# 3. 配置文件
python -m scripts.agent_instruct examples/agent_instruct/config.yaml
```
### 数据准备
数据集文件目前仅支持两种格式：jsonl和json。目前各种增强策略支持的数据格式如下，若要支持其他数据格式，则需要对代码做相应的修改和适配。
同时，也可以使用 HuggingFace / ModelScope 上相似格式的数据集或加载本地数据集。

- agent instruct

样例数据集 data/agent_instruct/gsm8k.jsonl，其中数据格式如下
```json
{
    "instruction": "人类指令（必填）",
    "input": "人类输入（选填）",
    "output": "模型回答（必填）",
}
```

- evol instruct

样例数据集 data/evol_instruct/alpaca_en_demo.json，其中数据格式如下
```json
[
  {
    "instruction": "人类指令（必填）",
    "input": "人类输入（选填）",
    "output": "模型回答（必填）",
  }
]
```

- self instruct

样例数据集 data/evol_instruct/seed_tasks.jsonl，其中数据格式如下
```json
{
    "id": "任务id（必填）",
    "name": "任务名称（必填）",
    "instruction": "人类指令（必填）",
    "instances": [
        {
            "input": "人类输入（必填）",
            "output": "模型回答（必填）",
        }
    ],
    "is_classification": "是否分类任务（必填）",
}
```

- mathscale

样例数据集 data/mathscale/algebra.jsonl，其中数据格式如下
```json
{
    "problem": "数学问题（必填）",
    "level": "数学难度（必填）",
    "type": "题目类型（必填）",
    "solution": "数学答案（必填）",
}
```
### 拓展数据集
下面四行命令分别执行四种数据增强策略 **agent_instrut**、 **evol_instruct**、**self_instruct **和 **mathscale**。
```bash
# 1. 切换conda环境
conda activate base

# 2. 查看目录结构
ls

# 3. 策略执行
cd DataEnhance
python -m scripts.agent_instruct --strategy agent --source data/agent_instruct/gsm8k.jsonl
python -m scripts.evol_instruct --strategy evol --source data/evol_instruct/alpaca_en_demo.json
python -m scripts.self_instruct --strategy self --source data/self_instruct/seed_tasks.jsonl
python -m scripts.mathscale --strategy mathscale --source data/mathscale/algebra.jsonl
```
