  
通过在线服务部署的自定义服务支持通过公网或VPC内地址调用两种方式，本文档将详细介绍如何调用百舸平台部署的在线服务
## 调用方式
部署服务时，您可以选择网络接入方式。默认的云原生AI网关相对BLB负载均衡具备服务鉴权能力并提供流量可观测监控大盘。如果您需要部署WebUI、非HTTP网络协议，以及为服务提供独享网络接入时，请关闭云原生AI网关切换到BLB负载均衡。
### 公网访问
您可以直接通过公共网络访问部署在线服务，部署服务时需开启公网访问。为满足安全隔离和访问控制的要求，您可以配置AI网关。通过AI网关，您可以将请求转发至在线服务部署，从而确保客户端与服务器之间实现稳定且可靠的网络连接。
### VPC内访问
同一region的两个VPC网络支持建立VPC连接，您可以访问同一地域中部署在资源池中的服务。
## API调用说明
在百舸平台部署在线服务后，系统会自动生成调用服务地址。您可以在服务列表页或详情页查看调用信息，通过该调用信息可以进行调用测试。 
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_78ae669.png)

### AI网关 
AI网关集成 Token 鉴权机制，显著增强了服务的安全性。所有未经授权的请求将被网关自动拦截，能有效保护推理服务免受未授权访问。
#### 使用curl访问

在 URL 后需拼接镜像内服务的路由路径/v1/chat/completions。 

```
curl 
--location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: <TOKEN>' \
--data '{
    "model": "deeepseek-r1",
    "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}],
    "max_tokens": 1024,
    "temperature": 0
}'
```
#### 使用Python访问

```
from openai import OpenAI

def get_response():
    client = OpenAI(
        api_key="<TOKEN>",   #需要您将Token的"Bearer"去掉，该SDK会自动补齐
        base_url="<访问地址>",
    )

    completion = client.chat.completions.create(
        model="deeepseek-r1",
        messages=[{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}]
    )

    print(completion.model_dump_json())

if __name__ == '__main__':
    get_response()

```
### BLB负载均衡

#### 使用curl访问

```
curl --location '<访问地址>/v1/chat/completions' \
--header 'Content-Type: application/json' \
-d '{
  "model": "deeepseek-r1",
  "messages": [{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}]
}'
```
#### 使用Python访问

```
from openai import OpenAI

def get_response():
    client = OpenAI(
        api_key="",  #  BLB负载均衡无需填写api_key，可以按照您的镜像配置
        base_url="<访问地址>",
    )

    completion = client.chat.completions.create(
        model="deeepseek-r1",
        messages=[{"role": "system", "content": "你是一名天文学家,请回答用户提出的问题。"}, {"role": "user", "content": "人类是否能登上火星?"}, {"role": "assistant", "content": "目前来看,人类登上火星是完全可能的..."}]
    )

    print(completion.model_dump_json())

if __name__ == '__main__':
    get_response()
```