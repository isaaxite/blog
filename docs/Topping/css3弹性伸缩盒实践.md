- 参考
>http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
http://www.ruanyifeng.com/blog/2015/07/flex-examples.html
- 设置弹性伸缩盒
>box：
将对象作为弹性伸缩盒显示。（伸缩盒最老版本）（CSS3）
inline-box：
将对象作为内联块级弹性伸缩盒显示。（伸缩盒最老版本）（CSS3）
flexbox：
将对象作为弹性伸缩盒显示。（伸缩盒过渡版本）（CSS3）
inline-flexbox：
将对象作为内联块级弹性伸缩盒显示。（伸缩盒过渡版本）（CSS3）
flex：
将对象作为弹性伸缩盒显示。（伸缩盒最新版本）（CSS3）
inline-flex：
将对象作为内联块级弹性伸缩盒显示。（伸缩盒最新版本）（CSS3）
PS：下面以flex为例子。

- 弹性伸缩盒示意图
>![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-7a18c491134f41f2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


弹性伸缩盒的6个属性：
>flex-direction
flex-wrap
flex-flow
justify-content
align-items
align-content

- flex-direction属性：决定主轴起点指向中终点的方向，（不要和排列方向搞混，不然在和justify-content属性混用的时候会混淆）
```
flex-direction: row | row-reverse | column | column-reverse;
```
>row（默认值）：主轴为水平方向，起点在左端。
row-reverse：主轴为水平方向，起点在右端。
column：主轴为垂直方向，起点在上沿。
column-reverse：主轴为垂直方向，起点在下沿。

- flex-wrap属性：是否换行/换行方式
```
flex-wrap: nowrap | wrap | wrap-reverse;
```
>nowrap（默认值）：不换行，会将所有子元素排列在一行，为了达到这个目的，在必要时会压缩width的值，以达到排在一列：

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-84ab6bc8790f32a7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-5b3e0aa8df684607.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>wrap:左起换行

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-410f08d7cc51ca27.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>wrap-reverse: 上下颠倒的左起换行

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-02d7e3f494df792f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- flex-flow属性，是flex-drirection和flex-wrap的简写方式
```
flex-flow: <flex-direction> || <flex-wrap>;
```
>flex-flow: row-reverse nowrap; 

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-33fc2a2eb816ab2c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- justify-content属性，定义主轴上（main）的对齐方式
```
justify-content: flex-start | flex-end | center | space-between | space-around;
```
>假设主轴方向为：从左到右。
>flex-start（默认值）：向主轴起点对齐
>flex-end：向主轴终点对齐
>center： 居中

>space-between：两端对齐，项目之间的间隔都相等。

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-eb26752fc860cfbb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-59a5b25d4b7ea186.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- align-item属性：定义交叉轴(cross)上的对齐方式
```
align-items: flex-start | flex-end | center | baseline | stretch;
```

>假设交叉轴的方向是顶部->底部
>flex-start：交叉轴的起点对齐。

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-8fddc1f4491450fd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>flex-end：交叉轴的终点对齐。

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-e1a8c5ed7e9d7c13.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>center：交叉轴的中点对齐。

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-44110348bee01066.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>baseline: 项目的第一行文字的基线对齐。

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-e1fe5f56fef0bca3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。


- align-content属性，只有在有多条主轴线的时候才会起效。
>每个盒子只有一条主轴线，但是一个盒子的项目也是盒子的话就可以认为这个盒子有多条主轴线。
```
<div class="box">
	  <div class="column">
	    <span class="item"></span>
	    <span class="item"></span>
	  </div>
	  <div class="column">
	    <span class="item"></span>
	    <span class="item"></span>
	  </div>
</div>
```

这个属性和justify-content属性的属性值类似。
```
align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```
>flex-start：与交叉轴的起点对齐。
flex-end：与交叉轴的终点对齐。
center：与交叉轴的中点对齐。
space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
stretch（默认值）：轴线占满整个交叉轴。
不详述。


- 项目（伸缩盒的子元素）的属性
 1. order属性，定义项目的排列顺序。数值越小，排列越靠前，默认为0。
```
order: 1; //支持负值
```
 2. flex-grow属性，属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
这是一个很微妙的属性，只能是在一定程度上做到方法，并不能完全在所有情况下适用。
>没有设定任何会让项目元素产生最小宽度的属性，只有在这种情况下是可以达到平均分的效果。其他情况下都会变得很难预料。

 3. flex-shrink属性
flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

 4. flex-basis属性
flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
```
flex-basis: <length> | auto; /* default auto */
```
 5. flex属性
flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
```
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```
 6. align-self属性
align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。
```
align-self: auto | flex-start | flex-end | center | baseline | stretch;
```

>PS：就目前弹性布局对于我来说，要做瀑布流的布局，我还是使用inline-block和float和mrgin搭配使用，如果换flex，还是要和margin搭配使用。本来我是认为使用space-between和不用使用margin的，但是换行后的效果不仅人意。所以现在我用得比较多的是在移动端使用flex来做垂直居中。
以及页头页脚。
