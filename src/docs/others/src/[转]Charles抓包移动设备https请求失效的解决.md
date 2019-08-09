# [转]Charles抓包移动设备https请求失效的解决

#### 一、前言:
在 APP 整个开发流程中，Charles 是测试人员不可或缺的一个工具。关于 Charles 的详细使用教程，大家看这个文章就能掌握了。
[传送门：Charles 从入门到精通](http://blog.devtang.com/2015/11/14/charles-introduction/)

这里我写这个 tips 主要是针对 iOS 10.3 以及以上系统引起的 “SSLHandshake: Received fatal alert: unknown_ca” 问题，以及 HTTPS 抓包过成功中的注意事项进行解读。最近在使用 Charles 的时候出现了两个问题，这里进行下补充。
1.某一个三方库在开启用 Charles 抓 HTTPS 包的时候请求速度缓慢，影响抓包进程；2.新的 10.3 系统的手机抓 https 包失败。
#### 二、Tips
##### 2.1 忽略某个网址的记录
最近公司测试人员反馈，退出登录速度缓慢。最后查明原因恰好是用 Charles 抓包的时候速度缓慢，不抓包速度正常。我定位到了这个速度慢的三方库地址，而测试人员也用不到这个三方库请求的网络数据（加密数据没啥用），我决定直接给他忽略掉，提高测试人员效率。
例如现在速度缓慢的地址是 https://app.ianisme.com。那么我们可以将这个地址忽略掉。
###### 2.1.1 第一步
去 Charles 的菜单栏->Proxy->Recoding Settings
图1：[![](http://upload-images.jianshu.io/upload_images/2838289-95c0d67a44d75587.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://www.ianisme.com/wp-content/uploads/2017/05/charles1.png)
###### 2.1.2 第二步
Recording Settings->Exclude->Add
图2：[![](http://upload-images.jianshu.io/upload_images/2838289-8e5cf2e75c5c7b80.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://www.ianisme.com/wp-content/uploads/2017/05/charles2.png)
###### 2.1.3 第三步
Protocol 中选择 HTTPS，Host 填写 app.ianisme.com 。端口写443。OK保存后，在装包的时候就可以忽略掉这个地址，这样就不会受到这个地址的影响了。
图3：[![](http://upload-images.jianshu.io/upload_images/2838289-55e1b1f090824e38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://www.ianisme.com/wp-content/uploads/2017/05/charles3.png)
###### 2.1 在 iOS 10.3 中打开证书信任设置
如果你的手机现在是 10.3 以上系统，但是之前手机是 10.3 以下的系统，并且你以前用 Charles 调试过，那么你就不会出现“SSLHandshake: Received fatal alert: unknown_ca”的问题。如果你是第一次用 10.3 以上系统手机去调试，你就出问题了。当你按照正常步骤把一切证书安装好后，发现调试 HTTPS 的时候全是x，抓不到包。
图4：
[![](http://upload-images.jianshu.io/upload_images/2838289-81da8c8dbdc70e87.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://www.ianisme.com/wp-content/uploads/2017/05/charles4.png)
Charles 建议我们 “You may need to configure your browser or application to trust the Charles Root Certificate. See SSL Proxying in the Help menu”
我明明安装了 Charles 的证书，为什么抓 HTTPS 包会失败呢？因为 10.3 以上系统需要你在“证书信任设置”中信任 Charles 的证书。
通用 -> 关于本机 -> 证书信任设置 -> 选择 Charles 的证书打开
如图5：
[![](http://upload-images.jianshu.io/upload_images/2838289-320e070e44b5dc39.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://www.ianisme.com/wp-content/uploads/2017/05/charles5.png)
这样就可以解决 iOS 10.3以上系统的抓 HTTPS 包的问题了。

本文转自：[https://www.ianisme.com/ios/2502.html](https://www.ianisme.com/ios/2502.html)
