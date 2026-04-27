  
## 安装SDK工具包

### 运行环境

JAVA SDK可以在Java1.7，Java1.8环境下运行。

### 前提条件

[**AK/SK**](https://cloud.baidu.com/doc/Reference/s/9jwvz2egb)：SDK 认证时必须传入 AK/SK 参数，在[安全认证页面](https://console.bce.baidu.com/iam/#/iam/accesslist) 获取 Access Key和Secret Key。

用户可以通过两种方式与百度智能云进行交互，包括认证方式和匿名方式。对于认证方式，需要通过使用Access Key / Secret Key加密的方法来验证某个请求的发送者身份。Access Key(AK) 用于标示用户，Secret Key(SK) 是用户用于加密认证字符串和百度智能云用来验证认证字符串的密钥。

### 安装SDK

**SDK目录结构**

```text
com.baidubce
├── auth                                      //BCE签名相关类
├── http                                      //BCE的Http通信相关类
├── internal                                  //SDK内部类
├── model                                     //BCE公用model类
├── services
│    └─ aihc                                   //AIHC服务相关类                             
│    └─ ...                                   //其它服务相关类          
├── util                                      //BCE公用工具类
├── BceClientConfiguration.class              //对BCE的HttpClient的配置
├── BceClientException.class                  //BCE客户端的异常类
├── BceServiceException.class                 //与BCE服务端交互后的异常类
├── ErrorCode.class                           //BCE通用的错误码
└── Region.class                              //BCE提供服务的区域
```

**使用Maven安装**

在Maven的pom.xml文件中添加bce-java-sdk的依赖：

```xml
<dependency>
    <groupId>com.baidubce</groupId>
    <artifactId>bce-java-sdk</artifactId>
    <version>{version}</version>
</dependency>
```

**直接使用JAR包**

1. 从[百度云SDK中心](https://cloud.baidu.com/doc/Developer/index.html)下载Java SDK压缩包。
2. 将下载的bce-java-sdk-version.zip解压后，复制到工程文件夹中。
3. 在Eclipse右键“工程 -> Properties -> Java Build Path -> Add JARs”。
4. 添加SDK工具包lib/bce-java-sdk-version.jar和第三方依赖工具包third-party/*.jar。
5. 其中，version为版本号，经过上面几步之后，用户就可以在工程中使用BCE Java SDK。

### 卸载SDK

预期卸载SDK时，删除下载的源码即可。
