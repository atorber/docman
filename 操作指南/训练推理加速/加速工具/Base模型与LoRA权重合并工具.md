目前仅支持Merge Huggingface权重格式的数据，如果需要对Megatron格式数据进行操作，需要做格式转换


| **参数** | **参数类型** | **参数英文** | **说明** |
| --- | --- | --- | --- |
| **Base模型权重路径** | str | base_model_path | 模型的Base部分权重路径 |
| **LoRA权重路径** | str | lora_path | 模型的LoRA部分权重路径 |
| **合并权重输出路径** | str | output_path | 合并结果的输出路径 |


```python
import fire
 
import torch
 
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig
from peft import PeftModel
 
def lora(base_model_path: str, lora_path: str, output_path: str):
    print(f'base_model_path: {base_model_path}')
    print(f'lora_path: {lora_path}')
    print(f'output_path: {output_path}')
 
    # merge and save model
    config = AutoConfig.from_pretrained(base_model_path, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(base_model_path,
                                                 config=config,
                                                 device_map="auto",
                                                 torch_dtype=torch.float16,
                                                 trust_remote_code=True)
    model = PeftModel.from_pretrained(model, lora_path, device_map="auto")
    model = model.eval()
 
    model = model.merge_and_unload()
    model.save_pretrained(output_path)
 
    # save_tokenizer
    tokenizer = AutoTokenizer.from_pretrained(base_model_path, trust_remote_code=True)
    tokenizer.save_pretrained(output_path)
 
if __name__ == '__main__':
    fire.Fire()
```
