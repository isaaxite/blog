# 你以为background和border是堆叠还是拼接在一起的？！

## 前言
偶然在书上看到一个效果，类似这样的效果：
![image](https://user-images.githubusercontent.com/25907273/37655826-4b310672-2c81-11e8-8a45-b2d629be56d7.png)
一个有趣的写法实现的
```css
.container{ padding: 70px;background: url("http://p.pptfans.cn/2014/12/05/pptfans_2ebd777bfe22d791.png"); }
.content{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  box-sizing: border-box;
  border: 70px solid rgba(151, 151, 151, 0.3);
  background: #FFFFFF;
  background-clip: padding-box;
}
```
这个效果不难实现，我首先看到的思路是：套三层元素，第一层放背景图，第二层做半透明色，第三层即是内容区域。

## 来解析解析
上面css代码的关键几个描述是：
- 使用半透明的border
```css
border: 70px solid rgba(151, 151, 151, 0.3);
```
- 把内容区域的`background`的裁剪描述成`padding-box`
```css
background-clip: padding-box;
```

最开始，看到源码没有留意到`background-clip: padding-box;`，觉得也就那样，只不过是另一种实现方案而已。然后我开始实践，如下写：
```css
.container{ padding: 70px;background: url("http://p.pptfans.cn/2014/12/05/pptfans_2ebd777bfe22d791.png"); }
.content{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  box-sizing: border-box;
  border: 70px solid rgba(151, 151, 151, 0.3);
  background: #FFFFFF;
  /* background-clip: padding-box; */
}
```
一脸懵逼了吧：
![image](https://user-images.githubusercontent.com/25907273/37656405-eeed89a6-2c82-11e8-93a0-0594da4f0455.png)
你会发现背景图并没有因为我将border设成半透明而透上来，那么邪门！！！

果断极端如下：
```css
border: 70px solid rgba(151, 151, 151, 0);
```
变成这样了
![image](https://user-images.githubusercontent.com/25907273/37656526-3c6c4abe-2c83-11e8-9290-91a3a41f47c0.png)

看到这个有没有点眉目？！

border和background并不是独立的两部分，你以为background延伸到border的内边界就停止了？并不是，他异常贪心，连border下面的区域都占了，就算你看不见他也要占！！！

还不懂我说什么鬼？

看上面代码，`height: 400px`是吧！background所占有的高度，并不会因为设了`border: 70px solid rgba(151, 151, 151, 0.3);`backgroun所占有的高度变成330px，border只不过相当于“浮在”background上面。

接下是重头戏，就是主角['background-clip: padding-box;']， 
>background-clip  设置元素的背景（背景图片或颜色）是否延伸到边框下面。
>
>如果没有设置背景颜色或图片，那么这个属性只有在边框（border）设置为透明或半透明时才能看到视觉>效果（查看 border-style 或 border-image），不然的话，这个属性造成的样式变化会被边框覆盖住。

再看看它的取值：
![image](https://user-images.githubusercontent.com/25907273/37656986-a21dc026-2c84-11e8-95ab-3317a3d444ad.png)

['background-clip: padding-box;']: https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip

**PS: 默认是border-box**

以上代码将background-clip设成padding-box，即是将background所占有的高度变成330px（当然宽度也是会响应减少70px）

## 最后
表演到此完毕~突然想起以前做过的一个呼吸球动画，就是用到border做半透明层，结果……
