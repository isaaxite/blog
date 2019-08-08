# 前言
目标实现效果图如下：
>![image](https://user-images.githubusercontent.com/25907273/37703562-0e3d4126-2d31-11e8-858b-a26064adc055.png)

# 实现
```html
<i class="triangle triangle-up"></i>
<i class="triangle triangle-right"></i>
<i class="triangle triangle-down"></i>
<i class="triangle triangle-left"></i>
```
```css
.triangle{
  display: inline-block;
  font-size: 0;
  overflow: hidden;
}

.triangle:before{
  content: "";
  position: relative;
  display: inline-block;
  border: 25px solid transparent;
}

.triangle-up{
  position: relative;
  top: 2px;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
}
.triangle-up:before{
  bottom: 2px;
  border-top-width: 0;
  border-bottom-width: 50px;
  border-bottom-color: rgb(181, 181, 181);
}

.triangle-right{
  position: relative;
  right: 2px;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}
.triangle-right:before{
  left: 2px;
  border-right-width: 0;
  border-left-width: 50px;
  border-left-color: rgb(181, 181, 181);
}

.triangle-down{
  position: relative;
  bottom: 2px;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}
.triangle-down:before{
  top: 2px;
  border-bottom-width: 0;
  border-top-width: 50px;
  border-top-color: rgb(181, 181, 181);
}

.triangle-left{
  position: relative;
  left: 2px;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}
.triangle-left:before{
  right: 2px;
  border-left-width: 0;
  border-right-width: 50px;
  border-right-color: rgba(181, 181, 181, 1);
}
```

# 剖析
从以上代码中抽出一个`triangle`来剖析，就拿`triangle-down`来说。
一般css是不能画斜线的，因此得另辟蹊径。观以上实现代码，你会发现大量使用到border，其实这就是核心，也不复杂，一幅图便可说明
![image](https://user-images.githubusercontent.com/25907273/37704757-af6d62bc-2d34-11e8-9679-af9a877a5adc.png)
调整三角形的大小或形状可以通过调节不同方向的border-width的大小来达到此目的，比如说调整`triangle-down`的大小：
- 调整高度：`border-top-width: 100px;`;
- 调整宽度：`border-right-width: 50px;border-left-width: 50px;`
其他方向的`triangle`如此类推调节大小。

看“前言”中的`triangle-down`你会发现向下的角并不是尖锐的，而是有那么点“小弧度”。

这个“小弧度”实现并不难，其实也不是弧度，而是利用`overflow: hidden`将角“切去”一点点，放大便可发现过渡并不和谐，但由于此类三角形实际使用时尺寸会很小，因此肉眼对此不和谐并无感知，会误以为是小圆角，上面例子即是切去了2px。

另外一个可实现比较和谐的过渡的想法是，绘制一个足够大的圆形`overflow: hidden`区域，再将三角形放进去，三个角便会被切割得比较和谐，但此时三角形已经相当大，便可使用`transform: scale()`将它缩小。很麻烦是不是？事倍功半，我还是算了……
>![image](https://user-images.githubusercontent.com/25907273/37705460-0df21e3e-2d37-11e8-94fa-faea2b8cf7ce.png)


# 应用
>![image](https://user-images.githubusercontent.com/25907273/37703486-c5119146-2d30-11e8-9aaf-81fbd66dc317.png)
```html
<div class="bubble-box">
  <div class="bubble-box-hat">
    <i class="triangle triangle-up"></i>
  </div> 
  <div class="bubble-box-body">i am isaac!</div>
</div>
```
```css
.bubble-box{
  font-size: 0;
  margin-top: 50px;
}

.bubble-box-hat{
  text-align: center;
}

.bubble-box-body{
  color: #FFFFFF;
  background: rgb(181, 181, 181);
  font-size: 28px;
  border-radius: 10px;
  padding: 100px;
  text-align: center;
}
```

# 写在最后
把脑子里的记忆，笔述出来也是一种整理知识的方式！（这逼装得……）
