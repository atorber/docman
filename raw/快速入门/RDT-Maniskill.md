RDT是由清华大学TSAIL小组研究开发的模仿学习模型 ，已在超过 100 万个多机器人场景上进行预训练。给定语言指令和最多三个视角的 RGB 图像，RDT 可以预测 64 个机器人动作。RDT 几乎兼容所有现代移动机械手，从单臂到双臂、从关节到 EEF、从位置到速度，甚至轮式运动。
* 单臂（single-arm）和双臂（dual-arm）系统
* 关节空间（joint）和末端执行器空间（EEF）控制
* 位置（position）和速度（velocity）指令模式
* 轮式移动（wheeled locomotion）


## API调用

* 服务部署成功后，可在服务列表查看调用信息

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_bd392fb.png)

* 请求脚本

```
import asyncio
import websockets.sync.client
import json
import time
import dataclasses
import tyro
import logging
from eval_sim import msgpack_numpy

@dataclasses.dataclass
class Args:
    # 修改成server服务的host、端口地址、及鉴权Token
    host: str = "{host_ip}:{host_port}/"
    header = {"Authorization":"{token}"}

    # 指定要使用的ManiSkill环境，默认: "PickCube-v1"
    env_id: str = "PickCube-v1"
    # 指定指令重试次数
    num_traj: int = 2
    # （可选）指定请求指令，默认使用官方eval_rdt_maniskill.py中的环境指令
    instruction: str = ""

def run_evaluation(args: Args):
    packer = msgpack_numpy.Packer()

    uri = "ws://%s" % (args.host)
    logging.info(f"Waiting for server at {uri}...")

    
    conn = websockets.sync.client.connect(uri, additional_headers=args.header)
    start = time.time()
    for i in range(args.num_traj):
        # 发送评估请求
        request = {
            "env_id": args.env_id,
            "instruction": args.instruction
        }
        conn.send(packer.pack(request))
        response = conn.recv()
        # 接收并处理响应
        if isinstance(response, str):
            # we're expecting bytes; if the server sends a string, it's an error.
            raise RuntimeError(f"Error in inference server:\n{response}")

        data = msgpack_numpy.unpackb(response)  
        print(f"Result {i}: Actions: {data['actions']}, Success Rate: {data['success_rate']:.2f}%")

    end = time.time()
    print(f"Total time taken: {end - start:.2f} s")
    print(f"Average inference time: {1000 * (end - start) / args.num_traj:.2f} ms")
                
def main(args: Args) -> None:
    run_evaluation(args)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main(tyro.cli(Args))
```

* Client启动命令
```
python client.py --env_id PickCube-v1
```