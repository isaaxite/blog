### 前言

**旧博客迁移，[\[原链接\]]**

### 参考：

>[1. http://www.chinaz.com/web/2017/0105/639110.shtml](http://www.chinaz.com/web/2017/0105/639110.shtml)
[2. https://yundun.console.aliyun.com/?spm=5176.2020520110.all.11.KlZkV7&p=cas#/cas/download/214022174970439](https://yundun.console.aliyun.com/?spm=5176.2020520110.all.11.KlZkV7&p=cas#/cas/download/214022174970439)

>最近在做小程序，api也是自己写的，开发的时候都是放在本地。开发的时候还是没有问题，但当我要真机测试的时候，api发布到云主机上面问题就暴露了：小程序只能请求https协议的站点，然而我的服务器是走http协议的。


 
>一开始我自己证书的，然而都是不安全的证书，期间还发生了各种稀奇古怪的问题，就不累述，最后发现在阿里云上面是有免费的ssl证书的，并且他是有教程叫你怎么添加ssl证书到你的服务器。
购买证书
 

 
登入阿里云-个人中心-证书服务，右上角购买证书。
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-519c73c4a13c5ec5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
没钱的孩子就自然选择免费的ssl证书，然后接下来就傻瓜式操作
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-16bc095e22409eac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
点“补全”，填写你需要添加ssl证书的域名等等资料
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-0f0ad865983d6e5c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-10deadb7601b2fd3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后，第一次操作的话还是选择系统生成的好，虽然要等一等，但是也就那一整子的事。
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-b38a5977ea7e9a57.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
创建，并提交后，会有一段审核的时间，审核过户，就到“我的证书”哪里，点“下载”。
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-34c60edf2a01eb50.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后，显示下载证书，然后下面是有详细的教程的，简单说就是，ssh登录进你的云主机，改服务器配置，开启服务器的ssl模块，上传你刚刚下载的证书，并在服务器配置中引入。
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-8a2f82bb936315a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[\[原链接\]]:https://www.jianshu.com/p/301207261e65
