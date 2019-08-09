# [转]移动web适配利器-rem

前言
提到rem，大家首先会想到的是em，px，pt这类的词语，大多数人眼中这些单位是用于设置字体的大小的，没错这的确是用来设置字体大小的，但是对于rem来说它可以用来做移动端的响应式适配哦。
 
兼容性

![](http://upload-images.jianshu.io/upload_images/2838289-97d1fe6f3fc3bc84.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 先看看兼容性，关于移动端
ios：6.1系统以上都支持
android：2.1系统以上都支持
大部分主流浏览器都支持，可以安心的往下看了。
 
rem设置字体大小
rem是（font size of the root element），官方解释
[![](http://upload-images.jianshu.io/upload_images/2838289-8f8453add68e9cd4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://7jpp2v.com1.z0.glb.clouddn.com/QQ%E5%9B%BE%E7%89%8720160313181850.png)
意思就是根据网页的根元素来设置字体大小，和em（font size of the element）的区别是，em是根据其父元素的字体大小来设置，而rem是根据网页的跟元素（html）来设置字体大小的，举一个简单的例子，
现在大部分浏览器IE9+，Firefox、Chrome、Safari、Opera ，如果我们不修改相关的字体配置，都是默认显示font-size是16px即
```
html {
    font-size:16px;
}
```
 
那么如果我们想给一个P标签设置12px的字体大小那么用rem来写就是

```
p {
    font-size: 0.75rem; //12÷16=0.75（rem）
}
```
 
基本上使用rem这个单位来设置字体大小基本上是这个套路，好处是假如用户自己修改了浏览器的默认字体大小，那么使用rem时就可以根据用户的调整的大小来显示了。 但是rem不仅可以适用于字体，同样可以用于width height margin这些样式的单位。下面来具体说一下
 
rem进行屏幕适配
在讲rem屏幕适配之前，先说一下一般做移动端适配的方法，一般可以分为： 
1. 简单一点的页面，一般高度直接设置成固定值，宽度一般撑满整个屏幕。
2. 稍复杂一些的是利用百分比设置元素的大小来进行适配，或者利用flex等css去设置一些需要定制的宽度。
3. 再复杂一些的响应式页面，需要利用css3的media query属性来进行适配，大致思路是根据屏幕不同大小，来设置对应的css样式。

上面的一些方法，其实也可以解决屏幕适配等问题，但是既然出来的rem这个新东西，也一定能兼顾到这些方面，下面具体使用rem：
**rem适配**
先看一个简单的例子：
```html
<style>
.con {
      width: 10rem;
      height: 10rem;
      background-color: red;
 }
</style>
<div class="con">
        
</div>
```
![](http://upload-images.jianshu.io/upload_images/2838289-351ff21f91cd3695.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这是一个div，宽度和高度都用rem来设置了，在浏览器里面是这样显示的，  可以看到，在浏览器里面width和height分别是160px，正好是16px * 10,那么如果将html根元素的默认font-size修改一下呢？
```html
<style>
html {
    font-size: 17px;
}
.con {
      width: 10rem;
      height: 10rem;
      background-color: red;
 }
</style>
<div class="con">
        
</div>
```
再来看看结果：
![](http://upload-images.jianshu.io/upload_images/2838289-966dfb0f55f54209.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这时width和height都是170px，这就说明了将rem应用与width和height时，同样适用rem的特性，根据根元素的font-size值来改变自身的值，由此我们应该可以联想到我们可以给html设定不同的值，从而达到我们css样式中的适配效果。
**rem数值计算**
如果利用rem来设置css的值，一般要通过一层计算才行，比如如果要设置一个长宽为100px的div，那么就需要计算出100px对应的rem值是 100 / 16 =6.25rem，这在我们写css中，其实算比较繁琐的一步操作了。
对于没有使用sass的工程：
为了方便起见，可以将html的font-size设置成100px，这样在写单位时，直接将数值除以100在加上rem的单位就可以了。
对于使用sass的工程：
前端构建中，完全可以利用scss来解决这个问题，例如我们可以写一个scss的function px2rem即：
```
@function px2rem($px){
    $rem : 37.5px;
    @return ($px/$rem) + rem;
}
```
这样，当我们写具体数值的时候就可以写成：
```
height: px2rem(90px);
width: px2rem(90px);;
```
看到这里，你可能会发现一些不理解的地方，就是上面那个rem:37.5px是怎么来的，正常情况下不是默认的16px么，这个其实就是页面的基准值，和html的font-size有关。

**rem基准值计算**
关于rem的基准值，也就是上面那个37.5px其实是根据我们所拿到的视觉稿来决定的，主要有以下几点原因：
**1** 由于我们所写出的页面是要在不同的屏幕大小设备上运行的
**2** 所以我们在写样式的时候必须要先以一个确定的屏幕来作为参考，这个就由我们拿到的视觉稿来定
**3** 假如我们拿到的视觉稿是以iphone6的屏幕为基准设计的
**4** iPhone6的屏幕大小是375px，

```
rem = window.innerWidth  / 10
```
 
这样计算出来的rem基准值就是37.5（iphone6的视觉稿），这里为什么要除以10呢，其实这个值是随便定义的,因为不想让html的font-size太大，当然也可以选择不除，只要在后面动态js计算时保证一样的值就可以，在这里列举一下其他手机的
>iphone3gs: 320px / 10 = 32px
iphone4/5: 320px  / 10 = 32px
iphone6: 375px  / 10 =37.5px

**动态设置html的font-size**
现在关键问题来了，我们该如何通过不同的屏幕去动态设置html的font-size呢，这里一般分为两种办法
**1** 利用css的media query来设置即
```
@media (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2){
      html{font-size: 37.5px;}
}
```
 
**2** 利用javascript来动态设置 根据我们之前算出的基准值，我们可以利用js动态算出当前屏幕所适配的font-size即：

```
document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
```

然后我们看一下之前那个demo展示的效果
```
<style>
.con {
      width: px2rem(200px);
      height: px2rem(200px);
      background-color: red;
}
</style>
<div class="con">
        
</div>
<script>
document.addEventListener('DOMContentLoaded', function(e) {
  document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
}, false);
</script>
````
 
iPhone6下，正常显示200px
![](http://upload-images.jianshu.io/upload_images/2838289-8cf6abd050c5f2bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在iphone4下，显示169px
![](http://upload-images.jianshu.io/upload_images/2838289-bfe203400bc0c632.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
由此可见我们可以通过设置不同的html基础值来达到在不同页面适配的目的，当然在使用js来设置时，需要绑定页面的resize事件来达到变化时更新html的font-size。
 
rem适配进阶
我们知道，一般我们获取到的视觉稿大部分是iphone6的，所以我们看到的尺寸一般是双倍大小的，在使用rem之前，我们一般会自觉的将标注/2，其实这也并无道理，但是当我们配合rem使用时，完全可以按照视觉稿上的尺寸来设置。
**1** 设计给的稿子双倍的原因是iphone6这种屏幕属于高清屏，也即是设备像素比(device pixel ratio)dpr比较大，所以显示的像素较为清晰。
**2** 一般手机的dpr是1，iphone4，iphone5这种高清屏是2，iphone6s plus这种高清屏是3，可以通过js的window.devicePixelRatio获取到当前设备的dpr，所以iphone6给的视觉稿大小是（*2）750×1334了。
**3** 拿到了dpr之后，我们就可以在viewport meta头里，取消让浏览器自动缩放页面，而自己去设置viewport的content例如（这里之所以要设置viewport是因为我们要实现border1px的效果，加入我给border设置了1px，在scale的影响下，高清屏中就会显示成0.5px的效果）
```
meta.setAttribute('content', 'initial-scale=' + 1/dpr + ', maximum-scale=' + 1/dpr + ', minimum-scale=' + 1/dpr + ', user-scalable=no');
```
 4 设置完之后配合rem，修改
```
@function px2rem($px){
    $rem : 75px;
    @return ($px/$rem) + rem;
}
```
 双倍75，这样就可以完全按照视觉稿上的尺寸来了。不用在/2了，这样做的好处是：
**1** 解决了图片高清问题。
**2** 解决了border 1px问题（我们设置的1px，在iphone上，由于viewport的scale是0.5，所以就自然缩放成0.5px）
在iphone6下的例子：
我们使用动态设置viewport，在iphone6下，scale会被设置成1/2即0.5，其他手机是1/1即1.
```
meta.setAttribute('content', 'initial-scale=' + 1/dpr + ', maximum-scale=' + 1/dpr + ', minimum-scale=' + 1/dpr + ', user-scalable=no');
```
 我们的css代码，注意这里设置了1px的边框
```
.con {
  margin-top: 200px;
  width: 5.3rem;
  height: 5.3rem;
  border-top:1px solid #000;
 }
```
 在iphone6下的显示：
![](http://upload-images.jianshu.io/upload_images/2838289-c0ce94d4bfc7a071.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在android下的显示：
![](http://upload-images.jianshu.io/upload_images/2838289-6e7bd61b58f5e87d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
rem进行屏幕适配总结
下面这个网址是针对rem来写的一个简单的demo页面，大家可以在不同的手机上看一下效果
![](http://upload-images.jianshu.io/upload_images/2838289-ffb4bad6b5a6abb6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
但是rem也并不是万能的，下面也有一些场景是不适于使用rem的
**1** 当用作图片或者一些不能缩放的展示时，必须要使用固定的px值，因为缩放可能会导致图片压缩变形等。
在列举几个使用rem的线上网站：
网易新闻：[http://3g.163.com/touch/news/subchannel/all?version=v_standard](http://3g.163.com/touch/news/subchannel/all?version=v_standard)
聚划算：[https://jhs.m.taobao.com/m/index.htm#!all](https://jhs.m.taobao.com/m/index.htm#!all)
 
 
参考资料：[http://www.nihaoshijie.com.cn/index.php/archives/593](http://www.nihaoshijie.com.cn/index.php/archives/593)

转载自AlloyTeam：[http://www.alloyteam.com/2016/03/mobile-web-adaptation-tool-rem/](http://www.alloyteam.com/2016/03/mobile-web-adaptation-tool-rem/)
