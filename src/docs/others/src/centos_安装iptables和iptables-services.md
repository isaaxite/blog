# centos_安装iptables和iptables-services

查看当前系统是否安装防火墙
```
service iptables status 
```

![](http://upload-images.jianshu.io/upload_images/2838289-9377079fbfc5f587.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装 iptables 
```
yum install -y iptables
```
![](http://upload-images.jianshu.io/upload_images/2838289-9bb9c63aa0886d22.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
// 假如有必要更新的话
yum update iptables
```

安装 iptables-services 
```
yum install iptables-services
```
![](http://upload-images.jianshu.io/upload_images/2838289-9c14c67ff6fccd33.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

查看iptables现有规则  
```
iptables -L -n  
```
![](http://upload-images.jianshu.io/upload_images/2838289-8e35884fbff3e7fb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
防火墙是需要开启80端口，不然外网就不能访问到主机资源。

开启相关规则的命令：
```
//先允许所有,不然有可能会杯具  
iptables -P INPUT ACCEPT  
// 清空所有默认规则  
iptables -F  
// 清空所有自定义规则  
iptables -X  
// 所有计数器归0  
iptables -Z  
// 允许来自于lo接口的数据包(本地访问)  
iptables -A INPUT -i lo -j ACCEPT  
// 开放22端口  
iptables -A INPUT -p tcp --dport 22 -j ACCEPT  
// 开放21端口(FTP)  
iptables -A INPUT -p tcp --dport 21 -j ACCEPT  
// 开放80端口(HTTP)  
iptables -A INPUT -p tcp --dport 80 -j ACCEPT  
// 开放443端口(HTTPS)  
iptables -A INPUT -p tcp --dport 443 -j ACCEPT  
// 允许ping  
iptables -A INPUT -p icmp --icmp-type 8 -j ACCEPT  
// 允许接受本机请求之后的返回数据 RELATED,是为FTP设置的  
iptables -A INPUT -m state --state  RELATED,ESTABLISHED -j ACCEPT  
// 其他入站一律丢弃  
iptables -P INPUT DROP  
// 所有出站一律绿灯  
iptables -P OUTPUT ACCEPT  
// 所有转发一律丢弃  
iptables -P FORWARD DROP  
```

保存配置，并重启：
```
service iptables save  
systemctl restart iptables.service  
```



