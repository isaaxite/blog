
![image](https://user-images.githubusercontent.com/25907273/33251558-2da9d40e-d2fd-11e7-831a-c7428483c8ee.png)

### 前言
```html
<div class="inline-box">
  <dl class="item"></dl>
  <dl class="item"></dl>
</div>
```
其实没什么好说，也不是什么新知识，也用了很久，众所周知，要消除个item的莫名间隔，需要将父元素的font-size设置0。但今天遇到一种情况，就算我将父元素的font-size设成0，同样还是有间隔。
![image](https://user-images.githubusercontent.com/25907273/33251439-380c446e-d2fc-11e7-8fb3-3c7ad9692d71.png)

### letter-space
今天发现的是letter也是会导致迷之间隔，只要和font-size一样价父元素的letter-space设成0就ok了。
```
.inline-box{
  ...
  letter-space: 0;
  ...
}
```
![image](https://user-images.githubusercontent.com/25907273/33251487-8710f2d0-d2fc-11e7-837e-3d598f8f612b.png)
