Wan是一个开源的AI视频生成大模型，支持T2V（文本生成视频）和I2V（图像生成视频）两种模式。在ComfyUI中，百舸提供了定制化的JSON工作流和API调用方式，帮助您使用Wan模型生成高质量的视频内容。本文将以I2V（图像生成视频）为例，介绍如何通过ComfyUI部署Wan模型，并使用Wan生成视频。

## 限制条件
仅支持在全托管资源池，单机、单卡部署单实例服务。

## 部署Wan模型
1. 登录百舸AI计算平台，单击 **快速开始；**
2. 在左侧内容筛选区域的模型系列中，勾选 **通义万相**，搜索 Wan2.1-I2V-14B 模型；
3. 单击 **部署 **按钮，填写资源规格和流量接入方式；
4. 服务部署成功后可以在 **在线服务部署 **中查看服务的 API 调用地址和 WebUI 访问地址。

## WebUI使用
服务部署成功后，在服务列表的 **调用信息 **中获取 WebUI地址，在浏览器中打开。

### WebUI服务鉴权
首次登录WebUI，需要设置账户密码，本地会生成一个PASSWORD的文件用来保护密码信息。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=bceac9a57bd34522b0f422aa77bddfff&docGuid=KP65Rdpj2iQHBW "")
设置密码后可以在百舸控制台此服务的输出日志中查看Token信息。
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=2bae198d31b8492e86499a100c804e0a&docGuid=KP65Rdpj2iQHBW "")
#### 取消鉴权
如果不需要服务鉴权，可以更新服务，在启动命令中增加此参数`rm -r /root/workspace/ComfyUI/custom_nodes/ComfyUI-Login`

不支持鉴权的启动命令示例如下：

```
cd /root/workspace/ComfyUI/models/ && rm-r diffusion_models text_encoders vae
ln -s /mnt/aihc_model_dir/diffusion_models /root/workspace/ComfyUI/models/diffusion_models
ln -s /mnt/aihc_model_dir/text_encoders /root/workspace/ComfyUI/models/text_encoders
ln -s /mnt/aihc_model_dir/vae /root/workspace/ComfyUI/models/vae
rm -r /root/workspace/ComfyUI/custom_nodes/ComfyUI-Login
cd /root/workspace/ComfyUI/ && python3 main.py --listen 0.0.0.0 --port 8000
```
### 输入参数
#### **LoadImageNode （输入图片）**
方式一：从持久化存储中选择图片

平台默认从服务的`/root/workspace/ComfyUI/input`路径加载图片，您可以将输入的图片存储在持久化存储后挂载到此路径，在ComfyUI中选择该路径下任意一张图片。

方式二：填写URL 

可以直接填写图片URL，例如：

方式三：上传本地图片

点击选择要上传的文件会拉起本地资源管理器，上传本地图片即可

#### PromptNode（填写Prompt）
![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=de3226a49b1e43c98063411ff84f9d4a&docGuid=KP65Rdpj2iQHBW "")
### 生成视频
生成的视频默认保存在服务的容器`/root/workspace/ComfyUI/output`路径中，可以更新服务配置挂载具备写权限的PFS或BOS存储到该路径，生成的视频可以持久化保存。

## API调用
### 查看访问地址
服务部署成功后，可以在 **在线服务部署** 的服务列表点击服务的 **调用地址 **获取公网或VPC内网访问地址和Token信息。 

### **获取ComfyUI工作流 API**
ComfyUI的API请求体取决于工作流配置。平台会提供基于当前模型的默认工作流导出的API JSON，可以从WebUI中导出API，也可以直接使用文档中的API示例。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=40d928b64e784829bc1231d8df6a3a68&docGuid=KP65Rdpj2iQHBW "")
#### T2V
替换请求示例中body里prompt中的内容

```
{
  "1": {
    "inputs": {
      "model_name": "wan2.1_t2v_14B_fp16.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "ModelLoaderNode",
    "_meta": {
      "title": "ModelLoaderNode"
    }
  },
  "3": {
    "inputs": {
      "vae_name": "Wan2.1_VAE.pth"
    },
    "class_type": "VAELoaderNode",
    "_meta": {
      "title": "VAELoaderNode"
    }
  },
  "4": {
    "inputs": {
      "negative_prompt": "low quality, blurry, ugly, poorly drawn hands, deformed face, extra limbs, bad anatomy, low resolution, disfigured, unrealistic, cartoonish, watermark, text, signature, distorted proportions, creepy, glitch, jpeg artifacts"
    },
    "class_type": "NegativePromptNode",
    "_meta": {
      "title": "NegativePromptNode"
    }
  },
  "5": {
    "inputs": {
      "positive_prompt": "A graceful ancient Chinese beauty in flowing white hanfu stands on a moss-covered stone altar within a ruined forest temple under a starlit sky. Glowing magical symbols and celestial energy swirl around her as she gracefully casts a spell, her long black hair cascading like silk, adorned with delicate jade hairpins. She holds an ornate fan with glowing patterns, ethereal light illuminating her serene face. Cinematic lighting and volumetric fog enhance the mystical atmosphere, with her embroidered robe billowing elegantly in the wind. Ultra-detailed, 4K, highly realistic, in the style of greg rutkowski, artgerm, cinematic fantasy. Animation of magical energy swirling, slow motion aura forming, glowing runes pulsing, hanfu sleeves fluttering with every movement."
    },
    "class_type": "PositivePromptNode",
    "_meta": {
      "title": "PositivePromptNode"
    }
  },
  "6": {
    "inputs": {
      "prompt": [
        "5",
        0
      ],
      "negative_prompt": [
        "4",
        0
      ],
      "model": [
        "1",
        0
      ],
      "text_encoder": [
        "8",
        0
      ],
      "vae": [
        "3",
        0
      ],
      "num_inference_steps": 30,
      "seed": 1428,
      "tiled": true,
      "fps": 25,
      "num_frames": 81
    },
    "class_type": "ExVideoNode",
    "_meta": {
      "title": "ExVideoNode"
    }
  },
  "7": {
    "inputs": {
      "video-preview": "",
      "video": [
        "6",
        0
      ]
    },
    "class_type": "PreViewVideo",
    "_meta": {
      "title": "PreViewVideo"
    }
  },
  "8": {
    "inputs": {
      "text_encoder_name": "models_t5_umt5-xxl-enc-bf16.pth",
      "type": "stable_diffusion",
      "device": "default"
    },
    "class_type": "TextEncoderLoaderNode",
    "_meta": {
      "title": "TextEncoderLoaderNode"
    }
  }
}
```
#### **I2V **
替换请求示例中body里prompt中的内容

```
{
  "1": {
    "inputs": {
      "model_name": "wan2.1_i2v_480p_14B_fp16.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "ModelLoaderNode",
    "_meta": {
      "title": "ModelLoaderNode"
    }
  },
  "2": {
    "inputs": {
      "clip_name": "models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth",
      "type": "stable_diffusion",
      "device": "default"
    },
    "class_type": "CLIPLoaderNode",
    "_meta": {
      "title": "CLIPLoaderNode"
    }
  },
  "3": {
    "inputs": {
      "text_encoder_name": "models_t5_umt5-xxl-enc-bf16.pth",
      "type": "stable_diffusion",
      "device": "default"
    },
    "class_type": "TextEncoderLoaderNode",
    "_meta": {
      "title": "TextEncoderLoaderNode"
    }
  },
  "4": {
    "inputs": {
      "vae_name": "Wan2.1_VAE.pth"
    },
    "class_type": "VAELoaderNode",
    "_meta": {
      "title": "VAELoaderNode"
    }
  },
  "5": {
    "inputs": {
      "image": "example.png",
      "url": ""
    },
    "class_type": "LoadImageNode",
    "_meta": {
      "title": "LoadImageNode"
    }
  },
  "6": {
    "inputs": {
      "prompt": [
        "7",
        0
      ],
      "negative_prompt": [
        "8",
        0
      ],
      "model": [
        "1",
        0
      ],
      "text_encoder": [
        "3",
        0
      ],
      "clip": [
        "2",
        0
      ],
      "vae": [
        "4",
        0
      ],
      "num_inference_steps": 30,
      "seed": 430,
      "tiled": true,
      "fps": 25,
      "num_frames": 81,
      "image": [
        "5",
        0
      ]
    },
    "class_type": "ExImageToVideoNode",
    "_meta": {
      "title": "ExImageToVideoNode"
    }
  },
  "7": {
    "inputs": {
      "positive_prompt": "The Little Prince, fox, simple poses, gentle movement, Van Gogh style, starry sky, glowing stars, soft focus, dreamy bokeh, fluffy felt textures, vibrant colors, magical lighting, warm glow, minimalistic action, subtle animation, flowing yellow scarf, peaceful atmosphere, glowing lights, 3D felt figurines, enchanting fantasy, serene, soft swirling vortex"
    },
    "class_type": "PositivePromptNode",
    "_meta": {
      "title": "PositivePromptNode"
    }
  },
  "8": {
    "inputs": {
      "negative_prompt": "Fast movement, chaotic, complex actions, modern, technology, industrial, harsh lighting, dark, dystopian, unrefined, unnatural, flat, lifeless, no star effect"
    },
    "class_type": "NegativePromptNode",
    "_meta": {
      "title": "NegativePromptNode"
    }
  },
  "9": {
    "inputs": {
      "video-preview": "",
      "video": [
        "6",
        0
      ]
    },
    "class_type": "PreViewVideo",
    "_meta": {
      "title": "PreViewVideo"
    }
  }
}
```
### 发送推理请求
 参考发送示例，在示例中输入访问地址、Token、Prompt 发送POST请求启动工作流，会返回此工作流执行的prompt_id。

```
curl --location --request POST '<访问地址>/prompt' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prompt":{
       "1": {
        "inputs": {
          "model_name": "wan2.1_t2v_14B_fp16.safetensors",
          "weight_dtype": "default"
        },
        "class_type": "ModelLoaderNode",
        "_meta": {
          "title": "ModelLoaderNode"
        }
      },
      "3": {
        "inputs": {
          "vae_name": "Wan2.1_VAE.pth"
        },
        "class_type": "VAELoaderNode",
        "_meta": {
          "title": "VAELoaderNode"
        }
      },
      "4": {
        "inputs": {
          "negative_prompt": "low quality, blurry, ugly, poorly drawn hands, deformed face, extra limbs, bad anatomy, low resolution, disfigured, unrealistic, cartoonish, watermark, text, signature, distorted proportions, creepy, glitch, jpeg artifacts"
        },
        "class_type": "NegativePromptNode",
        "_meta": {
          "title": "NegativePromptNode"
        }
      },
      "5": {
        "inputs": {
          "positive_prompt": "A graceful ancient Chinese beauty in flowing white hanfu stands on a moss-covered stone altar within a ruined forest temple under a starlit sky. Glowing magical symbols and celestial energy swirl around her as she gracefully casts a spell, her long black hair cascading like silk, adorned with delicate jade hairpins. She holds an ornate fan with glowing patterns, ethereal light illuminating her serene face. Cinematic lighting and volumetric fog enhance the mystical atmosphere, with her embroidered robe billowing elegantly in the wind. Ultra-detailed, 4K, highly realistic, in the style of greg rutkowski, artgerm, cinematic fantasy. Animation of magical energy swirling, slow motion aura forming, glowing runes pulsing, hanfu sleeves fluttering with every movement."
        },
        "class_type": "PositivePromptNode",
        "_meta": {
          "title": "PositivePromptNode"
        }
      },
      "6": {
        "inputs": {
          "prompt": [
            "5",
            0
          ],
          "negative_prompt": [
            "4",
            0
          ],
          "model": [
            "1",
            0
          ],
          "text_encoder": [
            "8",
            0
          ],
          "vae": [
            "3",
            0
          ],
          "num_inference_steps": 30,
          "seed": 1428,
          "tiled": true,
          "fps": 25,
          "num_frames": 81
        },
        "class_type": "ExVideoNode",
        "_meta": {
          "title": "ExVideoNode"
        }
      },
      "7": {
        "inputs": {
          "video-preview": "",
          "video": [
            "6",
            0
          ]
        },
        "class_type": "PreViewVideo",
        "_meta": {
          "title": "PreViewVideo"
        }
      },
      "8": {
        "inputs": {
          "text_encoder_name": "models_t5_umt5-xxl-enc-bf16.pth",
          "type": "stable_diffusion",
          "device": "default"
        },
        "class_type": "TextEncoderLoaderNode",
        "_meta": {
          "title": "TextEncoderLoaderNode"
        }
      }
    }
}'

```
发起推理后可以通过服务日志查看进度。

![](https://rte.weiyun.baidu.com/wiki/attach/image/api/imageDownloadAddress?attachId=f22c830d065146c1b52bba86283585e9&docGuid=KP65Rdpj2iQHBW "")


### 查询推理结果
推理结束会返回状态、生成视频等信息。结果为空是推理还未结束，请耐心等待。

```
curl --location --request GET '<ENDPOINT>/history/<prompt_id>' \  #
     --header 'Authorization: <TOKEN>'
```



## ComfyUI各指定目录说明
|**路径**|**说明**|
|-|-|
|/ComfyUI|ComfyUI 项目的根目录。|
|/ComfyUI/output|ComfyUI 生成视频保存目录。|
|/ComfyUI/input|ComfyUI 输入图片的配置路径|
|/ComfyUI/custom_nodes|ComfyUI 自定义节点目录。|
|/ComfyUI/user/default/workflows|ComfyUI 工作流保存目录。|
|/ComfyUI/models/checkpoints|ComfyUI checkpoints 路径。|
|/ComfyUI/models/diffusion_models|ComfyUI 扩散模型配置路径|
|/ComfyUI/models/lora|ComfyUI LoRA 相关插件配置路径。|
|/ComfyUI/models/vae|ComfyUI VAE 模型配置路径。|
|/ComfyUI/models/clip|ComfyUI CLIP 模型配置路径。|