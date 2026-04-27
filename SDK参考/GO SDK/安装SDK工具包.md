## 运行环境
GO SDK可以在go1.11及以上环境下运行。

## 安装SDK
### 直接从github下载
使用go get工具从github进行下载：

`go get github.com/baidubce/bce-sdk-go`

### SDK目录结构
```plain
bce-sdk-go
       ├── auth                                         //BCE签名相关类
       ├── http                                         //BCE的Http通信相关类
       ├── services
       │       └── aihc                                  //aihc 服务相关类
       ├── util                                         //BCE公用工具类 
       ├── examples
               └── aihc                                  //aihc 各种对象 SDK 使用示例
```

## 卸载SDK
卸载SDK时，删除下载的源码即可。