  
# 背景信息
用户在训练过程中，需要定期对模型进行推理效果验证，我们提供了基于AIAK的推理效果验证方案，便于客户快速进行效果验证。下文以LLaMA模型为例：

> **注意：**
> 您应自觉遵守“LLaMA”等第三方模型的用户协议、使用规范和相关法律法规，并就使用第三方模型的合法性、合规性自行承担相关责任。百度云不对第三方模型的合法性、安全性、准确性进行任何保证，百度云不对由此引发的任何损害承担责任。


# 使用方法
## 镜像源版本
```
[someone@host]docker pull registry.baidubce.com/cce-ai-native/aiak-megatron:0612
```

## 使用方法
使用镜像启动docker，准备推理测试环境：
```
# 使用镜像启动容器，并挂载模型CKPT目录
[someone@host]docker run -itd --name inference-test -v /path/to/model:/mnt/model -v /path/to/tokenizer:/mnt/tokenizer registry.baidubce.com/cce-ai-native/aiak-megatron:0612

# 进入容器测试推理
[someone@host]docker exec -it inference-test bash
```
推理脚本适配（以llama-7b为例）
```
[someone@host]cd Megatron-LM/
[someone@host]vim examples/run_text_generation_server_llama_7b.sh
# 配置1：CHECKPOINT位置(示例)：
CHECKPOINT_PATH=/mnt/model/megatron_llama_7b_checkpoint_tp2_pp2

# 配置2：TOKENIZER位置(示例)：
TOKENIZER_PATH=/mnt/tokenizer/tokenizer.model

# 配置3：llama-7b模型的参数设置：
GPUS_PER_NODE=4 #请根据ckpt的rank切分数设置

MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}
MASTER_PORT=${MASTER_PORT:-9999}
NNODES=${1:-1}
NODE_RANK=${2:-0}

DISTRIBUTED_ARGS="--nproc_per_node $GPUS_PER_NODE
                  --nnodes $NNODES
                  --node_rank $NODE_RANK
                  --master_addr $MASTER_ADDR
                  --master_port $MASTER_PORT"

CUDA_DEVICE_MAX_CONNECTIONS=1 torchrun $DISTRIBUTED_ARGS $ROOT_DIR/../tools/run_llama_text_generation_server.py   \
       --num-layers 32  \
       --hidden-size 4096  \
       --ffn-hidden-size 11008 \
       --disable-bias-linear \
       --num-attention-heads 32 \
       --max-position-embeddings 2048  \
       --no-position-embedding \
       --tokenizer-type LLaMASentencePieceTokenizer \
       --tokenizer-model ${TOKENIZER_PATH} \
       --fp16  \
       --micro-batch-size 1  \
       --seq-length 1024  \
       --out-seq-length 1024  \
       --temperature 0.1  \
       --top_p 0.9  \
       --tensor-model-parallel-size 2  \
       --pipeline-model-parallel-size 2  \
       --load ${CHECKPOINT_PATH}  \
       --swiglu \
       --use-rotary-position-embeddings \
       --untie-embeddings-and-output-weights \
       --attention-dropout 0 \
       --hidden-dropout 0 \
       --fused-rmsnorm \
       --rmsnorm-epsilon 1e-6 \
       --no-query-key-layer-scaling \
       --seed 42
```
启动模型的推理服务：
```
#启动推理服务：
[someone@host]nohup bash examples/run_text_generation_server_llama_7b.sh &> server.log &

使用Client测试推理效果：
[someone@host] python tools/text_generation_cli.py 127.0.0.1:5000
Enter prompt: 1+1=2,2+2=
Enter number of tokens to generate (default = 30):
Enter temperature (default = 0.1):
Megatron Response:
1+1=2,2+2=4,3+3=6,4+4=8,5+5=10,6+6=12
```
## 其他模型推理适配
为了支持其他模型的推理服务，只需修改run_text_generation_server_llama_7b.sh脚本，具体如下：

* llama-13b模型
```
[someone@host]cd Megatron-LM/
[someone@host]vim examples/run_text_generation_server_llama_7b.sh
# 配置1：CHECKPOINT位置(示例)：
CHECKPOINT_PATH=/mnt/model/megatron_llama_13b_checkpoint_tp2_pp4

# 配置2：TOKENIZER位置(示例)：
TOKENIZER_PATH=/mnt/tokenizer/tokenizer.model

# 配置3：llama-13b模型的参数设置：
GPUS_PER_NODE=8 #请根据ckpt的rank切分数设置

MASTER_ADDR=${MASTER_ADDR:-"127.0.0.1"}
MASTER_PORT=${MASTER_PORT:-9999}
NNODES=${1:-1}
NODE_RANK=${2:-0}

DISTRIBUTED_ARGS="--nproc_per_node $GPUS_PER_NODE
                  --nnodes $NNODES
                  --node_rank $NODE_RANK
                  --master_addr $MASTER_ADDR
                  --master_port $MASTER_PORT"

CUDA_DEVICE_MAX_CONNECTIONS=1 torchrun $DISTRIBUTED_ARGS $ROOT_DIR/../tools/run_llama_text_generation_server.py   \
       --num-layers 40  \
       --hidden-size 5120  \
       --ffn-hidden-size 13824 \
       --disable-bias-linear \
       --num-attention-heads 40 \
       --max-position-embeddings 2048  \
       --no-position-embedding \
       --tokenizer-type LLaMASentencePieceTokenizer \
       --tokenizer-model ${TOKENIZER_PATH} \
       --fp16  \
       --micro-batch-size 1  \
       --seq-length 2048  \
       --out-seq-length 2048  \
       --temperature 0.1  \
       --top_p 0.9  \
       --tensor-model-parallel-size 2  \
       --pipeline-model-parallel-size 4  \
       --load ${CHECKPOINT_PATH}  \
       --swiglu \
       --use-rotary-position-embeddings \
       --untie-embeddings-and-output-weights \
       --attention-dropout 0 \
       --hidden-dropout 0 \
       --fused-rmsnorm \
       --rmsnorm-epsilon 1e-6 \
       --no-query-key-layer-scaling \
       --seed 42
```