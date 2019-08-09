# CSS3开启硬件加速的使用和坑

![](http://upload-images.jianshu.io/upload_images/2838289-e52975abb2696158.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
#### 前言
最近在看在github上看iscroll的文档。虽然是英文的，但是为了装逼，没办法硬着头皮看完了，觉得作者写得不错（我有那么好耐心写那么长的文档就好了[捂脸]），然后为了更好地装逼，有看了一遍，其中是发现了不少好东西的，比如说 `CCS3硬件加速` 就是在上面被我扩展出来的。为了大家可以一起愉快地玩耍，我就先附上iscroll的Github Link：[https://github.com/issaxite/iscroll](https://github.com/issaxite/iscroll)

#### 开启CSS3加速
平时我们写的css3动画（没有触发硬件加速的）都是使用浏览器缓慢的软件渲染引擎来执行，字面上意思就是没有开启硬件加速。比如有时候写的移动端网页的动画（比如最简单的模态框）在安卓手机上会出现卡帧的现象，有很大可能就是使用浏览器软件渲染引擎来执行，性能跟不上导致的。上面说到 `硬件加速` 就可以解决这个问题，性能跟不上嘛，那就Spider Man上（能力越大，责任越大）——来硬件加速，性能提上去呀（我知道这又是一个烂gag），其实所谓硬件加速就是告诉浏览器，让它使用GPU进行渲染，切换到GPU模式，发挥GPU的一系列功能。
>##### 举个例子：
>　　**CSS的  `animations`,  `transforms` 以及 `transitions` 不会自动开启GPU加速，而是由浏览器的缓慢的软件渲染引擎来执行。为了性能，这个时候或许你就需要开启硬件加速功能。那我们怎样才可以切换到GPU模式呢，很多浏览器提供了某些触发的CSS规则。
Chrome, FireFox, Safari, IE9+和最新版本的Opera都支持硬件加速，当它们检测到页面中某个DOM元素应用了某些CSS规则时就会开启，最显著的特征的元素的3D变换。**

在其他的文章上看到的几个可以切换到GPU模式的几个3d属性：
```
.isaax{
   -webkit-transform: translate3d(250px,250px,250px)
   rotate3d(250px,250px,250px,-120deg)
   scale3d(0.5, 0.5, 0.5);
}
```
在iscroll的文档上看到的是下面这个：
![](http://upload-images.jianshu.io/upload_images/2838289-ea6e59359fc1c30e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
.isaax {
   -webkit-transform: translateZ(0);
   -moz-transform: translateZ(0);
   -ms-transform: translateZ(0);
   -o-transform: translateZ(0);
   transform: translateZ(0);
}
```
据说使用以上样式触发硬件加速后会出现 “页面可能会出现闪烁的效果“ 的问题，我是还没有发现，在网上是找到两个可以解决的方法：
###### 方法一
```
.isaax {
   -webkit-backface-visibility: hidden;
   -moz-backface-visibility: hidden;
   -ms-backface-visibility: hidden;
   backface-visibility: hidden;
 
   -webkit-perspective: 1000;
   -moz-perspective: 1000;
   -ms-perspective: 1000;
   perspective: 1000;
}
```
- `backface-visibility` （ie10+）是用来隐藏被旋转元素的背面，`translateZ` 导致的？;
- 而当为元素定义 `perspective` 属性时，其子元素会获得透视效果。
换言之，并不是去掉闪烁，而是设成透明[技术太渣根本不敢说话]
 
###### 方法二
如果是webkit内核，还有一种方式可以解决：
```
.isaax {
   -webkit-transform: translate3d(0, 0, 0);
   -moz-transform: translate3d(0, 0, 0);
   -ms-transform: translate3d(0, 0, 0);
   transform: translate3d(0, 0, 0);
}
```
 

------
 
##### 硬件加速的坑
看了大神的文章才知道，握草，这东西也不是万金油啊，用得不好，狠起来你那女票还狠，看了打开大神的例子又再次感受到深深的恶意。在这里我就不再贴人家的文章，直接附上文章地址，让大神告诉你坑在哪：[http://www.th7.cn/web/html-css/201509/121970.shtml](http://www.th7.cn/web/html-css/201509/121970.shtml)
然后说一下怎么打开查看【复合层】元素选项的方式，好像上面文章提到的方法有点过时：

`打开控制台`
![](http://upload-images.jianshu.io/upload_images/2838289-884b9ad2445ec8f9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`勾选Layer Borders选项，你会发现世界突然清晰了许多`
![](http://upload-images.jianshu.io/upload_images/2838289-ed4e4fa3695794b1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 最后，附上跳过坑的方法：
>使用3D硬件加速提升动画性能时，最好给元素增加一个z-index属性，人为干扰复合层的排序，可以有效减少chrome创建不必要的复合层，提升渲染性能，移动端优化效果尤为明显。

```
.isaax{
  position: relative;
  z-index: 1;  // 可以设大点，尽量设得比后面元素的z-index值高
}
```
