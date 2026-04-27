  
## 概述
本文档主要介绍使用百舸AI计算平台部署自定义在线服务Java SDK的安装和使用。在阅读本文档前，您需要先了解百舸自定义部署的一些基本知识，并已经开通了百舸相关服务。若您还不了解百舸自定义部署，可以参考[自定义服务部署](https://cloud.baidu.com/doc/AIHC/s/Dm1j2lqo6)    

## 安装SDK工具包
### 运行环境
Java SDK工具包可在jdk8及以上环境下运行。

### 使用Maven安装
在Maven的pom.xml文件中添加bce-java-sdk的依赖：

```plain
<dependency>
    <groupId>com.baidubce</groupId>
    <artifactId>bce-java-sdk</artifactId>
    <version>{version}</version>
</dependency>
```

其中，`{version}`为版本号，可以在**版本说明**里找到。

### SDK目录结构
```plain
com.baidubce
  ├── auth                                        //BCE签名相关类
  ├── http                                        //BCE的Http通信相关类
  ├── internal                                    //SDK内部类
  ├── model                                       //BCE公用model类
  ├── services
  │    └─ aihc                                  //百舸服务相关类
  │       ├─ model                              //百舸服务相关model目录
  |          └─ inference                       //百舸推理相关model类     
  │       └─ AihcInferenceClient.class          //推理相关客户端入口
  ├── util                                      //BCE公用工具类
  ├── AbstractBceClient.class                   //BCE公共基础客户端类
  ├── BceClientConfiguration.class              //对BCE的HttpClient的配置
  ├── BceClientException.class                  //BCE客户端的异常类
  ├── BceConstants.class                        //SDK通用常量              
  ├── BceErrorResponse.class                    //BCE通用错误类型返回
  ├── BceResponseMetadata.class                 //BCE响应中的其他元数据
  ├── BceServiceException.class                 //与BCE服务端交互后的异常类
  ├── ErrorCode.class                           //BCE通用的错误码
  ├── Protocol.class                            //BCE使用的通讯协议
  └── Region.class                              //BCE提供服务的区域
```

### 卸载SDK
预期卸载 SDK 时，删除 pom 依赖或源码即可。

## 初始化
### 确认Endpoint
在确认您使用SDK时配置的Endpoint时，可先参考阅读API参考中关于
[API服务域名](https://cloud.baidu.com/doc/EIP/s/Djwvz32x7)部分，理解Endpoint相关的概念。 百度智能云目前开放了多区域支持，请参考[区域选择说明](https://cloud.baidu.com/doc/Reference/s/2jwvz23xx)。

对于百舸服务来说，endpoint都为 **aihc.baidubce.com**，需要指定区域参数region来对应不同区域的访问，对应信息为：

| 访问区域 | 对应region参数 |
| --- | --- |
| 北京 | bj |
| 广州 | gz |
| 苏州 | su |
| 香港 | hkg |
| 武汉 | fwh |
| 保定 | bd |


### 获取密钥
要使用百度智能云<font style="color:rgba(34, 34, 34, 0.9);">百舸自定义部署服务</font>，您需要拥有一个有效的 AK（Access Key ID）和SK(Secret Access Key)用来进行签名认证。AK/SK是由系统分配给用户的，均为字符串，用于标识用户，为访问<font style="color:rgba(34, 34, 34, 0.9);">百舸自定义部署</font>服务做签名验证。 可以通过如下步骤获得并了解您的AK/SK信息：
[注册百度智能云账号](https://login.bce.baidu.com/reg.html?tpl=bceplat&from=portal)并
[创建AK/SK](https://console.bce.baidu.com/iam/?_=1513940574695#/iam/accesslist)

#### 新建AihcInferenceClient
AihcInferenceClient是百舸自定义部署服务的客户端，为开发者访问接口提供了一系列的方法。

##### 一、使用AK/SK新建AihcInferenceClient

通过AK/SK方式访问百舸自定义部署服务，用户可以参考如下代码新建一个Client：

```plain
public class Sample{
    public static void main(String[] args){
        String ACCESS_KEY_ID =<your-access-key-id>;// 用户的Access Key ID
        String SECRET_ACCESS_KEY =<your-secret-access-key>;// 用户的Secret Access Key
    
        // 初始化一个AihcInferenceClient
        BceClientConfiguration config =new BceClientConfiguration();
        config.setCredentials(new DefaultBceCredentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY));
        AihcInferenceClient client = new AihcInferenceClient(config);
    }
}
```

在上面代码中，`ACCESS_KEY_ID`对应控制台中的“Access Key ID”，`SECRET_ACCESS_KEY`对应控制台中的“Access Key Secret”，获取方式请参考[如何获取AKSK](https://cloud.baidu.com/doc/Reference/s/9jwvz2egb/)。

上面的方式使用默认域名作为的百舸自定义部署服务地址，如果用户需要自己指定域名，可以通过传入ENDPOINT参数来指定。

```plain
String ACCESS_KEY_ID = <your-access-key-id>;                   // 用户的Access Key ID
 String SECRET_ACCESS_KEY = <your-secret-access-key>;           // 用户的Secret Access Key
 String ENDPOINT = <domain-name>;                               // 用户自己指定的域名
 
 BceClientConfiguration config =new BceClientConfiguration();
 config.setCredentials(new DefaultBceCredentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY));
 config.setEndpoint(endpoint);
 AihcInferenceClient client = new AihcInferenceClient(config);
```

**注意**：`ENDPOINT`参数只能用指定的包含区域的域名来进行定义，不指定时默认为北京区域`[http://aihc.bj.baidubce.com](http://eip.bj.baidubce.com)`。

##### 二、使用STS创建AihcInferenceClient

* **申请STS token**

可以通过STS机制实现第三方的临时授权访问。STS（Security Token Service）是百度智能云提供的临时授权服务。通过STS，您可以为第三方用户颁发一个自定义时效和权限的访问凭证。第三方用户可以使用该访问凭证直接调用百度智能云的API或SDK访问百度智能云资源。

通过STS方式访问百舸服务，用户需要先通过STS的client申请一个认证字符串，申请方式可参见[百度智能云STS使用介绍](https://cloud.baidu.com/doc/BOS/s/Tjwvysda9/)。

*  **用STS token新建AihcInferenceClient**

申请好STS后，可将STStoken配置到AihcInferenceClient中，用户可以参考如下代码新建一个AihcInferenceClient：

```plain
public class StsExample {
    private static final String STS_ENDPOINT = "http://sts.bj.baidubce.com";
    private static final String ACCESS_KEY_ID = "your accesskey id";
    private static final String SECRET_ACCESS_KEY = "your secret accesskey";
    
    public static void main(String[] args) {
        BceCredentials credentials = new DefaultBceCredentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY);
        BceClientConfiguration config = new BceClientConfiguration();
        StsClient stsClient = new StsClient(
                new BceClientConfiguration().withEndpoint(STS_ENDPOINT).withCredentials(credentials)
        );
        GetSessionTokenResponse getSessionTokenResponse = stsClient.getSessionToken(new GetSessionTokenRequest());
        BceCredentials stsCredentials = new DefaultBceSessionCredentials(
                getSessionTokenResponse.getAccessKeyId(),
                getSessionTokenResponse.getSecretAccessKey(),
                getSessionTokenResponse.getSessionToken());
        config.setEndpoint(endpoint);
        config.setProtocol(Protocol.HTTPS);
        config.setCredentials(stsCredentials);
        AihcInferenceClient client = new AihcInferenceClient(config);
    }    
}
```

**注意**：<font style="color:rgba(34, 34, 34, 0.7);">目前使用STS配置client时，无论对应百舸服务的endpoint在哪里，endpoint都需配置为</font>`[http://sts.bj.baidubce.com](http://sts.bj.baidubce.com)`<font style="color:rgba(34, 34, 34, 0.7);">。</font>

##### 三、配置HTTPS协议访问

服务支持HTTPS传输协议，您可以通过如下两种方式在 Java SDK中使用HTTPS访问百舸自定义部署服务：

* ** 在endpoint中指明https:**

```plain
String endpoint = "aihc.baidubce.com";
 String ak = "ak";
 String sk = "sk";
 BceClientConfiguration config = new BceClientConfiguration();
 config.setCredentials(new DefaultBceCredentials(ak, sk));
 AihcInferenceClient client = new AihcInferenceClient(config);
```

*  **通过调用setProtocol方法设置https协议:**

```plain
String endpoint = "aihc.baidubce.com"; // endpoint中不包含protocol
 String ak = "ak";
 String sk = "sk";
 BceClientConfiguration config = new BceClientConfiguration();
 config.setCredentials(new DefaultBceCredentials(ak, sk));
 config.setEndpoint(endpoint);
 config.setProtocol(Protocol.HTTPS); // 如果不指明, 则使用http
 AihcInferenceClient client = new AihcInferenceClient(config);
```

**注意**：如果在endpoint中指明了protocol, 则endpoint中的生效, 另外单独再调用setProtocol()不起作用。

```plain
String endpoint = "http://aihc.baidubce.com";
 String ak = "ak";
 String sk = "sk";
 BceClientConfiguration config = new BceClientConfiguration();
 config.setCredentials(new DefaultBceCredentials(ak, sk));
 config.setEndpoint(endpoint);    
 config.setProtocol(Protocol.HTTPS); // endpoint中已经指明, 此为无效操作, 对http也是如此
 AihcInferenceClient client = new AihcInferenceClient(config);
```

##### 四、配置AihcInferenceClient
如果用户需要配置AihcInferenceClient的一些细节的参数，可以在构造AihcInferenceClient的时候传入BceClientConfiguration对象，可以为客户端配置代理，最大连接数等参数。

* **使用代理**

下面一段代码可以让客户端使用代理访问百舸自定义部署服务：

```plain
String ACCESS_KEY_ID = <your-access-key-id>;                   // 用户的Access Key ID
 String SECRET_ACCESS_KEY = <your-secret-access-key>;           // 用户的Secret Access Key
 String ENDPOINT = <domain-name>;                               // 用户自己指定的域名

 // 创建BceClientConfiguration实例
 BceClientConfiguration config = new BceClientConfiguration();

 // 配置代理为本地8080端口
 config.setProxyHost("127.0.0.1");
 config.setProxyPort(8080);

 // 创建客户端
 config.setCredentials(new DefaultBceCredentials(ACCESS_KEY_ID,SECRET_ACCESS_KEY));
 config.setEndpoint(ENDPOINT);
 AihcInferenceClient client = new AihcInferenceClient(config);
```

使用上面的代码段，客户端的所有操作都会通过127.0.0.1地址的8080端口做代理执行。

对于有用户验证的代理，可以通过下面的代码段配置用户名和密码：

```plain
// 创建BceClientConfiguration实例
 BceClientConfiguration config = new BceClientConfiguration();
    
 // 配置代理为本地8080端口
 config.setProxyHost("127.0.0.1");
 config.setProxyPort(8080);
    
 //设置用户名和密码
 config.setProxyUsername(<username>);                             //用户名
 config.setProxyPassword(<password>);                             //密码
```

* **设置网络参数**

用户可以用BceClientConfiguration对基本网络参数进行设置：

```plain
BceClientConfiguration config = newBceClientConfiguration();// 设置HTTP最大连接数为10
config.setMaxConnections(10);// 设置TCP连接超时为5000毫秒
config.setConnectionTimeout(5000);// 设置Socket传输数据超时的时间为2000毫秒
config.setSocketTimeout(2000);
```

**参数说明** 通过BceClientConfiguration能指定的所有参数如下表所示：

| 参数 | 说明 |
| --- | --- |
| UserAgent | 用户代理，指HTTP的User-Agent头 |
| Protocol | 连接协议类型 |
| ProxyDomain | 访问NTLM验证的代理服务器的Windows域名 |
| ProxyHost | 代理服务器主机地址 |
| ProxyPort | 代理服务器端口 |
| ProxyUsername | 代理服务器验证的用户名 |
| ProxyPassword | 代理服务器验证的密码 |
| ProxyPreemptiveAuthenticationEnabled | 是否设置用户代理认证 |
| ProxyWorkstation | NTLM代理服务器的Windows工作站名称 |
| LocalAddress | 本地地址 |
| ConnectionTimeoutInMillis | 建立连接的超时时间（单位：毫秒） |
| SocketTimeoutInMillis | 通过打开的连接传输数据的超时时间（单位：毫秒） |
| MaxConnections | 允许打开的最大HTTP连接数 |
| RetryPolicy | 连接重试策略 |
| SocketBufferSizeInBytes | Socket缓冲区大小 |


## 接口文档
### 创建服务
**函数声明**

```plain
public CreateAppResponse createApp(CreateAppRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档[创建服务](AIHC/API参考/自定义部署服务相关接口.md#创建服务)

### 查询服务列表
**函数声明**

```plain
public ListAppResponse listApp(ListAppRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询服务列表](AIHC/API参考/自定义部署服务相关接口.md#查询服务列表)    

### 查询服务状态
**函数声明**

```plain
public ListStatsResponse listStats(ListStatsRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询服务状态](AIHC/API参考/自定义部署服务相关接口.md#查询服务状态) 

### 查询服务详情
**函数声明**

```plain
public AppDetailsResponse appDetails(AppDetailsRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询服务详情](AIHC/API参考/自定义部署服务相关接口.md#查询服务详情) 

### 更新服务
**函数声明**

```plain
public UpdateAppResponse updateApp(UpdateAppRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [更新服务](AIHC/API参考/自定义部署服务相关接口.md#更新服务)

### 扩缩容实例
**函数声明**

```plain
public ScaleAppResponse scaleApp(ScaleAppRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [扩缩容实例](AIHC/API参考/自定义部署服务相关接口.md#扩缩容实例) 

### 配置公网访问
**函数声明**

```plain
public PubAccessResponse pubAccess(PubAccessRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [配置公网访问](AIHC/API参考/自定义部署服务相关接口.md#配置公网访问) 

### 查询服务变更记录
**函数声明**

```plain
public ListChangeResponse listChange(ListChangeRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询服务变更记录](AIHC/API参考/自定义部署服务相关接口.md#查询服务变更记录) 

### 查询服务变更记录详情
**函数声明**

```plain
public AppChangeDetailResponse appChangeDetail(AppChangeDetailRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询服务变更记录详情](AIHC/API参考/自定义部署服务相关接口.md#查询服务变更记录详情) 

### 删除服务
**函数声明**

```plain
public DeleteAppResponse deleteApp(DeleteAppRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [删除服务](AIHC/API参考/自定义部署服务相关接口.md#删除服务) 

### 查询实例列表
**函数声明**

```plain
public ListPodResponse listPod(ListPodRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询实例列表](AIHC/API参考/自定义部署服务相关接口.md#查询实例列表) 

### 实例摘流
**函数声明**

```plain
public BlockPodResponse blockPod(BlockPodRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [实例摘流](AIHC/API参考/自定义部署服务相关接口.md#实例摘流) 

### 删除实例重建
**函数声明**

```plain
public DeletePodResponse deletePod(DeletePodRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [删除实例重建](AIHC/API参考/自定义部署服务相关接口.md#删除实例重建) 

### 查询资源池列表
**函数声明**

```plain
public ListResPoolBriefResponse listResPoolBrief(ListResPoolBriefRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询资源池列表](AIHC/API参考/自定义部署服务相关接口.md#查询资源池列表) 

### 查询资源池详情
**函数声明**

```plain
public ResPoolDetailResponse resPoolDetail(ResPoolDetailRequest request, String region) {
    ...
}
```

**参数含义、返回值**

请参考OpenAPI文档 [查询资源池详情](AIHC/API参考/自定义部署服务相关接口.md#查询资源池详情) 

## 异常处理
百舸自定义部署服务异常提示有如下两种方式：

| 异常方法 | 说明 |
| --- | --- |
| BceClientException | 客户端异常 |
| BceServerException | 服务器异常 |


用户可以使用try获取某个事件所产生的异常，例如：

```plain
try {
    ListAppResponse response = client.listApp(request, region);
    System.out.println(response);
} catch (BceClientException e) {
    System.out.println(e.getMessage());
} catch (BceServiceException bce){
    System.out.println(bce.getMessage());
}
```

### 客户端异常
客户端异常表示客户端尝试向百舸服务发送请求以及数据传输时遇到的异常。 例如，当发送请求时网络连接不可用时，则会抛出 ClientException；当上传文件时发生IO异常时，也会抛出ClientException。

### 服务端异常
当百舸服务端出现异常时，百舸服务端会返回给用户相应的错误信息，以便定位问题。常见服务端异常可参见 xxx

### SDK日志
Java SDK发布版本中增加了logback作为slf4j的实现，如果用户没有自己的实现可以直接用，如果工程中有其他的如log4j则可以替代。

#### 默认日志
如果用户使用默认的logback，则需要配置logback.xml到classpath中。如果没有这个配置文件，日志级别默认为DEBUG。

```plain
<configuration>
    <property name="LOG_HOME" value="./log/"/>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- encoders are assigned the type
             ch.qos.logback.classic.encoder.PatternLayoutEncoder by default -->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${LOG_HOME}/AihcInferenceClientTest.%d{yyyy-MM-dd}.log</FileNamePattern>
            <MaxHistory>30</MaxHistory>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
    </appender>

    <root level="info">
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

#### 自有日志模块
若用户使用自己的日志实现模块，例如项目依赖于Maven，则可以类似下面的配置到pom.xml中来去除logback。

```plain
<?xml version="1.0" encoding="utf-8"?>

<dependency>      
  <groupId>com.baidubce</groupId>      
  <artifactId>bce-java-sdk</artifactId>      
  <version>${bce.sdk.version}</version>      
  <exclusions>        
    <exclusion>          
      <groupId>ch.qos.logback</groupId>          
      <artifactId>logback-classic</artifactId>        
    </exclusion>        
    <exclusion>          
      <groupId>ch.qos.logback</groupId>          
      <artifactId>logback-core</artifactId>        
    </exclusion>        
    <exclusion>          
      <groupId>org.slf4j</groupId>          
      <artifactId>jcl-over-slf4j</artifactId>        
    </exclusion>      
  </exclusions>    
</dependency>
```

## 版本说明

* Java SDK开发包[2024-10-23] 版本号 v0.10.344

百舸自定义部署服务第一次发布。支持创建服务、获取服务列表、获取服务状态、查询服务详情信息、更新服务、扩缩容服务、配置访问公网、获取服务变更记录、获取变更详情、删除服务、获取实例列表、摘除实例流量、删除实例触发重建、获取资源池列表、获取指定资源池的详情。

