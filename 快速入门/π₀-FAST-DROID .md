π₀- FAST-DROID 是由 Physical Intelligence 团队开发的开源视觉-语言-动作（VLA） 模型，旨在实现通用机器人控制。采用自回归预测 + FAST（Frequency-space Action Sequence Tokenization）动作分词器，将连续动作离散化为 token 序列，能根据语言指令和多视角 RGB 图像 预测 64 个机器人动作，适用于DROID机器人。
* 更擅长语言指令跟随（如“从烤面包机取出面包”）
* 适合需要 快速迭代训练 但可接受较高推理延迟的任务
  
  
## API调用

* 服务部署成功后，可在服务列表查看调用信息
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_fc5b311.png)

* 请求脚本

```
import dataclasses
import enum
import logging
import time

import numpy as np
from openpi_client import websocket_client_policy as _websocket_client_policy
import tyro


class EnvMode(enum.Enum):
    """Supported environments."""

    ALOHA = "aloha"
    ALOHA_SIM = "aloha_sim"
    DROID = "droid"
    LIBERO = "libero"


@dataclasses.dataclass
class Args:
    # 修改成server服务的host、端口地址、及鉴权Token
    host: str = "{host_ip}:{host_port}/"
    header = {"Authorization":"{token}"}

    # 指定要使用的推理服务环境，要server保持一致
    env: EnvMode = EnvMode.ALOHA_SIM
    # 推理次数
    num_steps: int = 10


def main(args: Args) -> None:
    # 预置推理指令：包含机器人视觉数据和运行指令
    obs_fn = {
        EnvMode.ALOHA: _random_observation_aloha,
        EnvMode.ALOHA_SIM: _random_observation_aloha,
        EnvMode.DROID: _random_observation_droid,
        EnvMode.LIBERO: _random_observation_libero,
    }[args.env]

    policy = _websocket_client_policy.WebsocketClientPolicy(
        host=args.host,
        header=args.header,
    )
    logging.info(f"Server metadata: {policy.get_server_metadata()}")

    # Send 1 observation to make sure the model is loaded.
    policy.infer(obs_fn())

    start = time.time()
    for _ in range(args.num_steps):
        res = policy.infer(obs_fn())
        print(res)
    end = time.time()

    print(f"Total time taken: {end - start:.2f} s")
    print(f"Average inference time: {1000 * (end - start) / args.num_steps:.2f} ms")

# 修改ALOHA指令参数
def _random_observation_aloha() -> dict:
    return {
        "state": np.ones((14,)),
        "images": {
            "cam_high": np.random.randint(256, size=(3, 224, 224), dtype=np.uint8),
            "cam_low": np.random.randint(256, size=(3, 224, 224), dtype=np.uint8),
            "cam_left_wrist": np.random.randint(256, size=(3, 224, 224), dtype=np.uint8),
            "cam_right_wrist": np.random.randint(256, size=(3, 224, 224), dtype=np.uint8),
        },
        "prompt": "do something",
    }

# 修改DROID指令参数
def _random_observation_droid() -> dict:
    return {
        "observation/exterior_image_1_left": np.random.randint(256, size=(224, 224, 3), dtype=np.uint8),
        "observation/wrist_image_left": np.random.randint(256, size=(224, 224, 3), dtype=np.uint8),
        "observation/joint_position": np.random.rand(7),
        "observation/gripper_position": np.random.rand(1),
        "prompt": "do something",
    }

# 修改LIBERO指令参数
def _random_observation_libero() -> dict:
    return {
        "observation/state": np.random.rand(8),
        "observation/image": np.random.randint(256, size=(224, 224, 3), dtype=np.uint8),
        "observation/wrist_image": np.random.randint(256, size=(224, 224, 3), dtype=np.uint8),
        "prompt": "do something",
    }


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main(tyro.cli(Args))
 ```

* Client请求脚本启动命令

 ```
 uv run client.py --env DROID 
 ```
  
  
