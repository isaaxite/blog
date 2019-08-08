![image](https://user-images.githubusercontent.com/25907273/33619905-598c36ea-da21-11e7-8c40-045daac3b9a8.png)

### 前言
`margin-top`出现溢出也不是什么新鲜事了，老生常谈，我也不是第一次见到了，但是以前经常会以各种理由安慰自己（比如赶进度）会投机取巧使用`padding-top`来代替。过后也没有去找解决溢出的方法，甚至，一度认为是无法解决的，想想以前面试，就让人羞红脸，万恶的面试官。

### 什么是margin溢出
我也不多解析，正好在碰到时我也事先截图了，一目了然：
- 先上一张容器的图（灰色背景即为容器的区域）
![image](https://user-images.githubusercontent.com/25907273/33428528-2f2f4ff2-d604-11e7-8f81-e4168272d234.png)

- 然后看最上面一个item
![image](https://user-images.githubusercontent.com/25907273/33617587-0c65d48a-da1b-11e7-8445-c0b60a684ebc.png)
红框部分即为item的大小，而橙色的部分即为溢出的部分

### 问题
其实如果是平时简单布局做样式，这么点高度也无伤大雅，说不定做出来产品页不会有感知，或者向我以往做的那样，可以用padding-top补回这部分溢出。

但是，在做底部上拉加载更多（还没有想到其他场景）的时候，就会出现问题。
要实现这功能，一般是使用scroll事件，然后监听，`scrollTop`, `容器的高度：clientHeight`, `产生滚轴body的高度：clientHeight`
```html
<div id="container">
  <ul class="body">
    <li class="item">item_0</li>
    <li class="item">item_1</li>
    <li class="item">item_2</li>
    ...
    <li class="item">item_n</li>
  </ul>
</div>
```
然后，通过判断是否到达底部然后出发加载更多逻辑
```javascript
document.querySelector('#container').
addEventListener('scroll', function(e) {
  const container = this;
  const body = container.querySelector('ul.body');
  const scrollTop = container.scrollTop;
  const containerHeight = container.clientHeight;
  const bodyHeight = body.clientHeight;
  const isBottom = scrollTop + containerHeight >= bodyHeight;
  
  isBottom && !function(){
    // load more logic
  }();
}, false);
```
由于溢出，你可知道，body的高度由于首个item有部分溢出，那么body的高度就会少了一部分。那么就算将滚轴拉倒底部，scrollTop和containerHeight的总高度总是比bodyHeight的高度要小。换言之，滚轴还没有到达底部就会触发加载更多的逻辑。当然是还是可以使用给body添加padding-top补全margin-top溢出部分，然而有代码洁癖的你会愿意一直如此屈服？

那么关于怎么清除margin的溢出就提上日程。

### 清除溢出
上面说那么多废话，其实消除溢出很简单，简单得比清除浮动还要简单[捂脸]，然后我之前竟然不知道。
很简单！
很简单！
很简单！
重要的事说三遍
```css
ul.body{
   border: 1px solid transparent;
   // or
   border-top: 1px solid transparent;
}
```
就是这么简单……
- 这是为加border前的`ul.body`：
![image](https://user-images.githubusercontent.com/25907273/33428562-45e73ade-d604-11e7-8822-bff06dfc82b0.png)

- 这是加了border后的`ul.body`
![image](https://user-images.githubusercontent.com/25907273/33428586-5813e4fa-d604-11e7-8e17-94abc7156a69.png)

### 小结
俗话说：路走多了，路边出来了；坑遇多了，经验便来了[捂脸]

### 导航
- [主页](https://issaxite.github.io)
- 上一篇：[微信二次分享配置失败问题](https://github.com/issaxite/issaxite.github.io/issues/87)
- 下一篇：[多层元素实现的委托](https://github.com/issaxite/issaxite.github.io/issues/89)
