<font style="color:#1c1d1f;">随着模型参数量不断增加，单台GPU服务器已经无法满足大规模模型的推理需求。分布式多机推理可以将单实例分配到多台服务器部署，利用并行计算加速推理过程，提高大规模模型和高并发场景的推理效率。本文将介绍如何通过百舸平台在H20 2机分布式部署DeepSeek R1模型。</font>

## 前置条件 
### 准备资源
1. 购买2台支持RDMA的H20机器创建百舸自运维资源池（H20需开通白名单，请联系百度售前工程师）
2. 开通PFS或CFS存储并与资源池绑定

### 准备数据
平台已提供DeepSeek R1模型权重文件存储在BOS对象存储中，您可以从对应地域的BOS路径中下载模型。

1. 登录节点安装BOSCMD[<font style="color:#3f83f8;">https://cloud.baidu.com/doc/BOS/s/qjwvyqegc</font>](https://cloud.baidu.com/doc/BOS/s/qjwvyqegc)并完成BOSCMD配置[<font style="color:#3f83f8;">https://cloud.baidu.com/doc/BOS/s/Ejwvyqe55</font>](https://cloud.baidu.com/doc/BOS/s/Ejwvyqe55)
2. 从平台提供的BOS地址中拷贝权重文件到PFS或CFS存储中：

```
./bcecmd bos sync bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1 /mnt/model/DeepSeek-R1
```

| **地域** | **BOS路径** |
| --- | --- |
| 北京 | bos:/aihc-models-bj/deepseek-ai/DeepSeek-R1  |
| 苏州 | bos:/aihc-models-su/deepseek-ai/DeepSeek-R1  |
| 广州 | bos:/aihc-models-gz/deepseek-ai/DeepSeek-R1  |


### 镜像准备
仅支持vllm和sglang推理框架，vllm 版本 >= 0.7.3 sglang版本 >= 0.4.3，平台已预置vllm和sglang 官方镜像，建议直接使用平台提供的镜像。

## 部署服务
1. <font style="color:rgb(24, 24, 24);">登录</font>**<font style="color:rgb(24, 24, 24);">百舸在线服务部署</font>**<font style="color:rgb(24, 24, 24);">控制台，选择</font>**<font style="color:rgb(24, 24, 24);">自定义部署</font>**<font style="color:rgb(24, 24, 24);">，点击</font>**<font style="color:rgb(24, 24, 24);">部署服务；</font>**
2. 输入服务名称、选择资源池/队列；
3. 开启分布式推理，单实例Pod数设置为2，开启RDMA；

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_624871a.png)

4. **服务镜像：**选择百舸预置镜像中的 sglang v0.4.3.post4-cu125 或 vllm 0.7.3
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_8f0e8f0.png)

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_94b682e.png)

5. **设置启动命令：**根据选择的镜像填写对应的启动命令

 sglang启动命令：

```
MASTER_IP=$(cut -d ',' -f 1 $FED_MEMBER_FILE)
python3 -m sglang.launch_server \
    --model-path /mnt/pfs/deepseek-ai/DeepSeek-R1 \
    --tp 16 \
    --dist-init-addr $MASTER_IP:5000 \
    --nnodes $FED_POD_NUM \
    --node-rank $FED_POD_INDEX \
    --trust-remote-code \
    --host 0.0.0.0 \
    --port 8088
```

vllm 启动命令

```
MASTER_IP=$(cut -d ',' -f 1 $FED_MEMBER_FILE)
if [ "$FED_POD_INDEX" -eq 0 ]; then
    /vllm-workspace/ray_init.sh leader --ray_cluster_size=$FED_POD_NUM
    python3 -m vllm.entrypoints.openai.api_server \
        --port 8088 \
        --model /mnt/model/DeepSeek-R1 \
        --tensor-parallel-size 16 \
        --trust_remote_code
else
    echo "Master IP: $MASTER_IP"
    /vllm-workspace/ray_init.sh worker --ray_address=$MASTER_IP
fi
```

6. **资源申请：**加速芯片数量设置为8卡
7. **存储挂载：**建议您使用PFS L2存储类型，提高模型加载和服务异常恢复速度；以PFS存储类型为例，填写存储模型权重文件的PFS或CFS源路径和容器目标路径，启动命令中的路径会根据目标路径动态更新；

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_88e1ea2.png)

8. **流量接入：**
+ 设置服务端口设置为8088，启动命令会根据此配置动态更新
+ 开启云原生AI网关（云原生AI网关仅支持http请求）
9. **健康检查：**若部署生产服务建议开启健康检查配置探针
+  参考以下配置设置启动探针
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_103ecd9.png)

+ 参考以下配置就绪探针和存活探针

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_62c646a.png)

## 发送请求
服务部署成功后，可在列表查看，服务状态均为“运行中”即可调用；在调用信息中可获取HTTP调用地址和Token信息；
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_ae6a9d2.png)

请求示例：

```
curl --location '180.76.137.48/auth/ap-f6d303295/8088' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImNzbSIsInR5cCI6IkpXVCJ9.eyJpYXQiO***' \
--data '{
    "model": "deepseek r1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 10,
    "temperature": 0
}'
```

## 查看服务监控
可在服务详情中查看服务资源、流量监控
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_d81a8d6.png)

