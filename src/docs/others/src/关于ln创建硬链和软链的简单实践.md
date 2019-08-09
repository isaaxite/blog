# 关于ln创建硬链和软链的简单实践

![](http://upload-images.jianshu.io/upload_images/2838289-cd5b74ab424527b0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
##### 1 创建硬链接
硬链接会在目标目录生成一个大小相同的文件
```
// ln [源文件] [目标目录/自定义文件名]
ln /etc/node/bin/node /usr/sbin/node
```
使用 `ls -l` 命令可以查看
![](http://upload-images.jianshu.io/upload_images/2838289-4f8c160c3261a65c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 2 创建软连接
软连接只是在目标目录下创建一个镜像指向源文件，不占大小
```
// ln [源文件] [目标目录/自定义文件名]
ln -s /etc/node/bin/node /usr/sbin/node
```
![](http://upload-images.jianshu.io/upload_images/2838289-75f2d9c7f24e9a40.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 3 ln创建的链接的删除
```
// rm -rf [链接路径+名字]
rm -rf /usr/sbin/node
```
##### 4 还没有明白的问题

在上一个系统中，只需要在”/usr/bin”目录下创建链接，全局都可以使用。但是，在现在的新系统中，可以全局使用的目录确实变成了“/usr/sbin” 

关于软连接和硬链接的更多资料：http://www.cnblogs.com/peida/archive/2012/12/11/2812294.html
