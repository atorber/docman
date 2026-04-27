## 简介
<font style="color:rgb(0, 0, 0);">数据蒸馏（DataDistill）通过调用教师大模型API进行数据增强，提供精准、高质量的数据响应生成服务。可以即时生成响应数据，同时通过连续的验证机制保证数据的准确性，从而显著提升数据蒸馏的质量。</font>

## 主要特性
1. 响应数据生成：
    - 支持直接生成响应；
    - 支持生成相应数据进行答案验证，直到生成最终正确的响应, 提高蒸馏数据质量
2. 支持使用 DeepSeek-R1 进行蒸馏

## 使用说明
### 数据格式
1. 输入数据为需要蒸馏的题目与答案信息，支持json、jsonl格式
2. 输出数据为题目与推理结果，支持输出json、jsonl格式

### 数据准备
#### 输入格式
输入json格式示例：

```json
[
  {
    "instruction": " <题目1>",
    "output": "<可为带解析的标准答案>"
  },
  {
    "instruction": " <题目2>",
    "output": "<可为带解析的标准答案>"
  }
]
```

输入jsonl格式示例：

```json
{"instruction": " <题目1>","output": "<可为带解析的标准答案>"}
{"instruction": " <题目2>","output": "<可为带解析的标准答案>"}
```

#### 输出格式
输出json格式示例：

```json
[
  {
    "instruction": " <题目1>",
    "output": "<生成响应>",
    "False_flag": " <响应生成是否正确标识>"
  },
  {
    "instruction": " <题目2>",
    "output": "<生成响应>",
    "False_flag": " <响应生成是否正确标识>"
  }
]
```

输出jsonl格式示例：

```json
{"instruction": " <题目1>","output": "<生成响应>","False_flag": " <响应生成是否正确标识>"}
{"instruction": " <题目2>","output": "<生成响应>","False_flag": " <响应生成是否正确标识>"}
```

### **默认**蒸馏**prompt**
程序默认使用以下prompt进行数据蒸馏，快速开始可以使用默认prompt验证效果

```plain
你的任务是解一些问题，这些问题包含各种领域，请将你的答案放在boxed{{}}中。
# 你需要解决的问题{input}
请开始回答：
```

### 启动程序
```bash
# 进入程序目录
cd /workspace/DataEnhance/

# 设置环境变量，也可以直接传参
data_path="data/demo_data.jsonl"
model_name="DeepSeek-R1"
api_key="<api_key>"
api_url="https://api.deepseek.com/chat/completions"
python -m src.datagenerate.DataDistill.main \
--input_file $data_path \
--tag_mission distill_verify \
--model $model_name \
--api_key $api_key \
--api_url $api_url \
--save_as jsonl \
--batch_size 50
```

## 参数说明
| 参数名 | 取值类型 | 是否必选 | 默认值 | 枚举值 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| <font style="color:#1c1d1f;">tag_mission</font> | <font style="color:#1c1d1f;">str</font> | <font style="color:#1c1d1f;">是</font> | <font style="color:#1c1d1f;">distill</font> | <font style="color:#1c1d1f;">distill：直接生成响应</font> | <font style="color:#1c1d1f;">distill为直接生成响应， distill_verify生成响应后验证答案， 一共验证5轮， 直到最后一轮没有正确答案则采用答案提示的方式生成正确的思考过程与答案。</font> |
| <font style="color:#1c1d1f;">num_epochs</font> | <font style="color:#1c1d1f;">int</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">5</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">验证模式下，总验证轮数</font> |
| <font style="color:#1c1d1f;">model</font> | <font style="color:#1c1d1f;">str</font> | <font style="color:#1c1d1f;">是</font> | <font style="color:#1c1d1f;">Deepseek-R1</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">调用API的模型名称</font> |
| <font style="color:#1c1d1f;">api</font> | <font style="color:#1c1d1f;">bool</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">True</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">调用API模型</font> |
| <font style="color:#1c1d1f;">api_url</font> | <font style="color:#1c1d1f;">str</font> | <font style="color:#1c1d1f;">是</font> | https://api.deepseek.com/chat/completions | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">调用API URL</font> |
| <font style="color:#1c1d1f;">api_key</font> | <font style="color:#1c1d1f;">str</font> | <font style="color:#1c1d1f;">是</font> | | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">调用API KEY</font> |
| <font style="color:#1c1d1f;">input_file</font> | <font style="color:#1c1d1f;">str</font> | <font style="color:#1c1d1f;">是</font> | <font style="color:#1c1d1f;">data/ins_res.json</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">输入的文件地址</font> |
| <font style="color:#1c1d1f;">output_file</font> | <font style="color:#1c1d1f;">str</font> | <font style="color:#1c1d1f;">是</font> | <font style="color:#1c1d1f;">data/ins_res_output.jsonl</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">输出文件地址</font> |
| <font style="color:#1c1d1f;">batch_size</font> | <font style="color:#1c1d1f;">int</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">100</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">每次得到响应的批量大小</font> |
| <font style="color:#1c1d1f;">save_as</font> | <font style="color:#1c1d1f;">str</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">jsonl</font> | <font style="color:#1c1d1f;">jsonl</font> | <font style="color:#1c1d1f;">存储格式</font> |
| <font style="color:#1c1d1f;">max_tokens</font> | <font style="color:#1c1d1f;">int</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">8000</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">生成最大token数量,受使用API的限制</font> |
| <font style="color:#1c1d1f;">temperature</font> | <font style="color:#1c1d1f;">float</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">0.6</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">模型生成token随机性, 数值越小随机性越大，反之随机性越小，范围[0.0, 1.0]</font> |
| <font style="color:#1c1d1f;">repetition_penalty</font> | <font style="color:#1c1d1f;">float</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">1.0</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">生成token的重复性惩罚, 数值越大重复的token越少， 反之重复越多, 范围[1.0, 2.0]</font> |
| <font style="color:#1c1d1f;">n</font> | <font style="color:#1c1d1f;">int</font> | <font style="color:#1c1d1f;">否</font> | <font style="color:#1c1d1f;">1</font> | <font style="color:#1c1d1f;">NA</font> | <font style="color:#1c1d1f;">每次返回的响应数量</font> |
| <font style="color:#1c1d1f;">customize_prompt</font> | str | 否 | <font style="color:#1c1d1f;">你的任务是解一些问题，这些问题包含各种领域，请将你的答案放在boxed{{}}中。\n# 你需要解决的问题{input}\n请开始回答：</font> | NA | <font style="color:#1c1d1f;">自定义prompt</font> |


<font style="color:#1c1d1f;">distill_verify：生成响应后验证答案</font>

json

## 自定义prompt
当给定的默认蒸馏prompt无法得到目标题目输出，可以通过自定义prompt

**使用方法：**

<font style="color:rgb(28, 29, 31);">在运行启动脚本时，指定</font><font style="color:#1c1d1f;">customize_prompt参数</font>

```bash
# 进入程序目录
cd /workspace/DataEnhance/

# 设置环境变量，也可以直接传参
data_path="data/demo_data.jsonl"
model_name="DeepSeek-R1"
api_key="<api_key>"
api_url="https://api.deepseek.com/chat/completions"
python -m src.datagenerate.DataDistill.main \
    --input_file $data_path \
    --tag_mission distill_verify \
    --model $model_name \
    --api_key $api_key \
    --api_url $api_url \
    --save_as jsonl \
    --batch_size 50 \
    --customize_prompt "请帮我解答下列问题， 答案请放在boxed{{}}中， 题目: {item}"
```

**<font style="color:#1c1d1f;">说明：</font>**<font style="color:#1c1d1f;"> 需要预留{item}占位符，程序会根据占位符拼接题目，如果缺少占位符则无法正确的到蒸馏的结果，</font>在自定义上传prompt时也要注意答案的输出格式，<font style="color:#1c1d1f;">建议放入boxed{{}}中， 目前程序提取答案逻辑为在boxed符号中提取，如果不规定输出有可能提取不出正确答案。</font>

## 模式设置
### <font style="color:#1c1d1f;">distill（蒸馏模式）</font>
该模式下，针对每一道输入的instruction会生成一条响应，响应会根据用户自定义prompt进行response。

### <font style="color:#1c1d1f;">distill_verify（验证模式）</font>
在该模式下，会根据用户自定义的验证轮数（<font style="color:#1c1d1f;">num_epochs</font>）进行验证，每一轮如果有验证与答案一致的响应则直接写入输出。

 如果在倒数第二轮还没有验证正确的响应，则会把答案添加入prompt中引导模型输出正确的解题过程与答案（如果<font style="color:#1c1d1f;">num_epochs</font>设置为1，则第一轮就会引<font style="color:#1c1d1f;">导模型输出标准答案）。</font>

<font style="color:#1c1d1f;">如果最后一轮验证还是无法得到正确的答案则会在输出json中添加一个</font>**<font style="color:#1c1d1f;">False_flag</font>**<font style="color:#1c1d1f;">字段，值为："Sorry {num_epochs} rounds verification, no correct answer"。 </font>

**最后一轮验证默认prompt:**

```plain
你的任务是通过给定的答案给出正确的推理过程。
# 要保证推理的步骤与最终的结果一致
# 除了推理结果和答案请不要输出其他任何多余的内容
题目:{input}
答案:{answer}
请输出你的回答：
```

**最后一轮的用户自定义prompt逻辑：**

```plain
<用户自定义的prompt>
<根据output字段获得的正确答案>
请根据答案给出正确的过程与最终答案:
```

