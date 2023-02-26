---
title: canvas实现圆框图片
date: 2019-08-07 16:36:14
tags:
- canvas
- 前端
categories:
- JavaScript
---


# 前言

在html中做圆框图片很容易，只需要简单的 `border-radius: 50%;` 当然，为了兼容性，还有必要做带前缀的兼容性写法。但总的来说还是很简单。

<!-- more -->

```html
<style>
img {
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
</style>
```

<!-- ![](https://pbs.twimg.com/profile_images/588883654157291520/4DBMn6_A.jpg) -->

![](2838289-bd35ee9e30c8de53.png)

[[传送门：demo]](https://jsfiddle.net/issaxite/3gLaoLjy/)

但是在canvas上做起来就有点麻烦了，在canvas画布上画图片，可以使用canvas的 `drawImage` 接口，但是这个接口也仅仅是将图片画在画布上，并没有如css那样提供做圆角的接口。

网上google过一下，常看到这样的做法(最先是在[张鑫旭的blog上看到的](http://www.zhangxinxu.com/study/201406/image-border-radius-canvas.html))：

# 通过纹理实现

```html
<canvas id="canvas"></canvas>
<script>
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  var min_size = Math.min(w, h);
  if (r > min_size / 2) r = min_size / 2;
  // 开始绘制
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.stroke();
  this.closePath();
  return this;
}

var canvas = document.querySelector("#canvas");
var context = canvas.getContext("2d");
var img = new Image();
img.src = 'https://pbs.twimg.com/profile_images/588883654157291520/4DBMn6_A.jpg';
var pattern = context.createPattern(img, "no-repeat");
context.roundRect(0, 0, img.width, img.height, 0);
context.fillStyle = pattern;
context.fill(); 
</script>
```

这样做是可以的，这个做法的关键道具是`createPattern` 这是一个专门用来作纹理的API：

![](2838289-2ec590dc132f3067.png)

**但是，如果你将该形状右移50px就会发现问题所在，图片没有跟着形状（圆框）一起移动**：

![](2838289-9343063b631f3456.png)

其实，看第二个画布应该可以看出图片是对画布的左上角做定位的。如果图片没有移动，那么想办法移动图片就好啦！然而，可悲的是没有方法。因此，这是一种比较鸡肋的做法。


[[传送门：demo]](https://jsfiddle.net/issaxite/3gLaoLjy/1/)

# 通过裁剪画布部分区域实现

这是我最后使用的方法，这个方法的关键道具是`clip()`API，这个API，可以用你指定的形状在画布上裁剪一部分出来，然后，接下来你在画布上的操作只有在该形状区域内可见，如果还有后续还有对画布的其他地方有操作，可以使用`restore()`接口恢复，但是必须在使用clip接口前用 `save()` 接口保存canvas的状态。

```html
<canvas id="canvas" style="border: 1px solid;"></canvas>
<script>
  var canvas = document.querySelector("#canvas");
  var context = canvas.getContext("2d");
  var img = new Image();
  img.src = 'https://pbs.twimg.com/profile_images/588883654157291520/4DBMn6_A.jpg';
  // 首先是先画一个圆形，因为现在我们不是画圆角矩形，所以就不用“张鑫旭”画圆
  // 的做法，我们直接使用 `arc` 接口
  context.save();
  context.arc(100, 100, 50, 0, 2 * Math.PI);
  // 从画布上裁剪出这个圆形
  context.clip();
  context.drawImage(img, 50, 50, 100, 100);
</script>
```

![](2838289-6ae38ef8653024d8.png)

为此，还封装了个简单的方法：

```html
<canvas id="canvas" style="border: 1px solid;"></canvas>
<script>
  // 封装了一个简单的方法
  function circleImg(ctx, img, x, y, r) {
    ctx.save();
    var d =2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
  }

  var img = new Image();
  img.src = 'https://pbs.twimg.com/profile_images/588883654157291520/4DBMn6_A.jpg';
  var canvas1 = document.querySelector("#canvas1");
  var context1 = canvas1.getContext("2d");
  circleImg(context1, img, 100, 20, 50);
</script>
```


![](2838289-b8968aabf0bdc4cb.png)


正如你所见，这个做法可以随意移动圆框和图片的。

[[传送门：demo]](https://jsfiddle.net/issaxite/p56fkb9s/1/)

# 两个值得注意的点，比较容易让误解的API：

- clip()
[这是w3c的例子](http://www.w3school.com.cn/tiy/t.asp?f=html5_canvas_clip)，或许有部分人（在说自己），会误以为，在使用clip以后，接下来的操作都是相对于这个被剪切出来的部分做定位，特别是下面这张图：


![灰色框是画布](2838289-4cb61a8b9522b0ac.png)


更加容易让人误以为真是如此，其实不然，其实还是相对画布的左上角做定位，用了clip后只是变成，只有clip区域可见而已。

- arcTo 一个用来画弧线的api

关于这个API的参数说明是这样的：


[[传送门：demo]](http://www.w3school.com.cn/tags/canvas_arcto.asp)


![](2838289-619ed2977b158f5b.png)


上面的参数说明中的起点和终点，比较容易让人误以为是下面两个点：


![](2838289-37eba062c3666da0.png)

然而上面的(x1,y1)和(x2,y2)其实是分别指下图上的上面一点和下面一点：

![](2838289-ba345b172e3ad4b8.png)


继续看下图：

![](2838289-f38ace5dbf8d890b.png)


**顺道说一下，canvas的坐标，x轴由原点左到右从0开始递增，y轴由原点上到下，从0开始递增。**

A点是直线的末点，这个点一般是有lineTo接口写出，或者moveTo接口，比如moveTo(50,50)，而B点则是arcTo中的x1,x2，B(100, 50)， C点则是arcTo中的x2,y2，C(100, 100)，而arcTo中的r则是AB或者CD。


[[传送门：demo]](https://jsfiddle.net/issaxite/uqj700yo/)

