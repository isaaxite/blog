# canvas画布宽高描述的不可缺失

![image](https://user-images.githubusercontent.com/25907273/33238965-d335a77c-d25d-11e7-8456-6b7d8ad06983.png)
### 前言
使用canvas时，在js端会描述canvas的宽高，最直接就是直接写死宽高。写死明显是不是明智的，因为手机屏幕尺寸那么多，你写死了，会不会出bug，自行想象；

### 手记
为了适配，现在说的场景主页针对移动端。我使用的是rem布局，canvas的宽高我也是在css端使用rem描述：
```scss
.turntable{
    // border-radius: 50%

    box-shadow: 0 0 5px black;font-size: 0;
    width: px2rem(310px);height: px2rem(310px);

    canvas{ width: inherit;height: inherit; }
  }
```

在页面展示上，描述确实起效了，审查元素，看canvas标签确实是达到了`w=310px，h=310`，

但是啊！！！
但是啊！！！

在canvas绘图的时候就出bug了，具体问题代码如下：
```javascript
var canvas = document.getElementById("wheelcanvas");
const cwidth = canvas.clientWidth;
const cheight = canvas.clientHeight;
// canvas.width = cwidth;
// canvas.height = cheight;

if (canvas.getContext) {
  //根据奖品个数计算圆周角度
  var arc = Math.PI / (turnplate.restaraunts.length/2);
  var ctx = canvas.getContext("2d");
  //在给定矩形内清空一个矩形
  ctx.clearRect(0,0, cwidth, cheight);
  ctx.drawImage(turnplate.bg.obj, 0, 0, cwidth, cheight);
  // ...
}
```
具体页面表现如下：
![image](https://user-images.githubusercontent.com/25907273/33238838-427a2d18-d25b-11e7-8630-48a5f2643ca9.png)

为什么会这样？

原因是，初始canvas在我这个项目中个默认宽高（我并没有做默认的宽高描述）
![image](https://user-images.githubusercontent.com/25907273/33238872-fd2c2b20-d25b-11e7-8b45-158f87540c5f.png)

- css的起效了，但是他并没有起到了设置canvas的尺寸的效果，而是单单在样式层面将canvas标签进行了拉伸，因此canvas的实际尺寸并没有变化；

- 在js代码中获取canvas的clientWidth和clientHeight，获取的是css描述的宽度（w=310， h=310），然后，drawImage函数使用了这个尺寸画图，而canvas的实际宽度是`w=300, h=150`，因此会看见画布上只有“圆盘”的一部分，并且被拉伸了。

既然找到问题所在（css的canvas样式描述没有起到设置canvas尺寸的作用），那么解决就好办的了，只要早绘图前，设置一下canvas的尺寸就好，如上面的问题代码，只要取消上面的两个注释就ok了。
```javascript
canvas.width = cwidth;
canvas.height = cheight;
```
![image](https://user-images.githubusercontent.com/25907273/33238940-59cacb06-d25d-11e7-9467-04c29eae01b9.png)

