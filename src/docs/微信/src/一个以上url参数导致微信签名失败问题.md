# 一个以上url参数导致微信签名失败问题

# 写在前面
最近出现一个问题，微信首次分享可以调起自定义分享，二次分享就会失败。在微信开发工具抛出的异常是：
![image](https://user-images.githubusercontent.com/25907273/34972625-b4a61c6e-fabd-11e7-8407-d6bcd9a3b22d.png)

# 问题是什么？
- 接口有问题？
虽然抛出"config:fail,invalid signature"异常，但其实并不是获取signature的接口有问题，不然第一次分享也会抛出同样的异常，因此接口有问题的可能可以排除

- 传参不对？
获取wx-js-sdk配置，需要前端传过去的只有signUrl，即当前页面，微信推荐回去当前页面的写法是：
```javascript
location.href.split('#')[0]
```
首次分享前所在页面的link：
```
http://www.xxx.com?status=1
```
二次分享前所在页面的link：
```
http://www.xxx.com?status=1&from=singlemessage&isappinstalled=0
```
第二次调起微信配置的sgnUrl比首次多了`&from=singlemessage&isappinstalled=0`，难道这么一段就是万恶之源？

经过测试，去掉这段是可以的，并且就算已有一半(?status=1&from=singlemessage)也是不行。

最后得出的结论是：当前url带有一个以上url参数都会引起签名失败。

- 难道微信真的那么傻逼，只能带一个参数？
答案是绝对不可能的，不去考究微信是不是真的有这样的措施，从理论上就不合理，并且我也是有见过别人的微信page是可以带多个参数，并且依然可以调起微信wx-js-sdk的接口。

为了解决跨域等等问题，当前项目并不是直接ajax获取wx-js-sdk配置信息，而是通过同域的php获取。打印php端获取到的参数：
1）首次获取到的参数
```
url => http://www.xxx.com/?status=1
```
2）二次获取到的参数
```
url => http://www.xxx.com/?status=1&amp;from=singlemessage&amp;isappinstalled=0
```
看到这里我就大概知道什么问题了，`&amp;`正是`&`的html实体符号，为什么会被转义？说来惭愧，为了安全校验，每个请求的参数都会被`htmlspecialchars `过滤，防止非安全用户直接操作数据库。而被转义后的signUrl就与目标signUrl不同了，不同那么就会抛出异常。

那么就好办啦，对于该接口，不使用`htmlspecialchars`过滤就好。
最后，果然是成功了！

# 小结
我知道，我写的这篇不算什么有用文章，情况也是很特殊，基本上不会对别人起到作用，但是我还是打算记录下来，防止自己不知道什么时候就会犯二，毕竟我也不是第一次。




