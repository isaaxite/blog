---
title: ElementUI源码分析-Scrolllbar组件
date: 2020-04-20 12:11:58
tags:
- JavaScript
- 旧文迁移
- 源码分析
categories:
- [JavaScript]
- [Element-UI]
---

scrollbar组件可以通过设置native属性，是否使用自定义的scrollbar视图，默认为`undefined`即使用自定义的，下面也是主要分析自定义scrollbar的构成。

<!-- more -->

scrollbar视图的html代码由来年两层元素构成：
1. 第一层：`el-scrollbar`，样式设为`overflow: hidden`主要用于隐藏原生scrollbar；
2. 第二层：`el-scrollbar__wrap`，用于存放内容的真实视图。
```jsx
nodes = ([
  wrap,
  <Bar
  	move={ this.moveX }
		size={ this.sizeWidth }></Bar>,
	<Bar
		vertical
		move={ this.moveY }
		size={ this.sizeHeight }></Bar>
]);
```

### scrollbar的主要逻辑

![](image-20200420222553641.png)

### 1,计算浏览器scrollbar默认宽度

```js
/ 通过离线创建一个容器，计算浏览器默认的scrollbar宽度
// 计算这个默认宽度是为了当出现默认scrollbar的时候隐藏掉
let gutter = scrollbarWidth();
```

计算方式是离线创建一个容器，并使之产生scrollbar，根据产生scrollbar前后容器的宽度计算宽度：

```js
import Vue from 'vue';

let scrollBarWidth;

export default function() {
  if (Vue.prototype.$isServer) return 0;
  // 使用缓存
  if (scrollBarWidth !== undefined) return scrollBarWidth;
	
  // 外层
  const outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  // 记录产生scrollbar前的视图宽度
  const widthNoScroll = outer.offsetWidth;
  // 强制显示scrollbar
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  // 记录产生scrollbar后的视图宽度
  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};
```

### 2.撑大`el-scrollbar__wrap`容器隐藏原生scrollbar

```js
if (gutter) {
  const gutterWith = `-${gutter}px`;
  const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

  if (Array.isArray(this.wrapStyle)) {
    style = toObject(this.wrapStyle);
    style.marginRight = style.marginBottom = gutterWith;
  } else if (typeof this.wrapStyle === 'string') {
    style += gutterStyle;
  } else {
    style = gutterStyle;
  }
}
```

### 3.添加自定义滑块模拟原生scrollbar

```jsx
nodes = ([
  wrap,
  <Bar
    move={ this.moveX }
    size={ this.sizeWidth }></Bar>,
  <Bar
    vertical
    move={ this.moveY }
    size={ this.sizeHeight }></Bar>
]);
```

### 4.注册scrollbar事件

主要用于更新自定义bar的偏移位置

```js
handleScroll() {
  const wrap = this.wrap;
  // 纵向偏移比例 = 内容纵向偏移量 / 视图高度
  this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
  // 横向偏移比例 = 内容横向偏移量 / 视图宽度
  this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
},
```

### 5.注册resize事件以及初始化滑块宽度

```js
methods: {
  // ...

  update() {
    let heightPercentage, widthPercentage;
    const wrap = this.wrap;
    if (!wrap) return;

    // 纵轴滑块的高度 = 元素高度 / 元素内容视图高度
    heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
    // 纵轴滑块的高度 = 元素宽度 / 元素内容视图宽度
    widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

    this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
    this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
  }
},
mounted() {
  if (this.native) return;
  // 初始化scrollbar的宽度
  this.$nextTick(this.update);
  // 注册resize事件，用于之后更新scrollbar的宽度
  !this.noresize && addResizeListener(this.$refs.resize, this.update);
},
```



## bar组件

bar组件是对原生滑块的模拟，滑块由滑块容器以及滑块本身组成！

bar组件负责的主要功能是：计算滑块的偏移距离与滑块容器高度的比例，以次比例计算Scrill-view的偏移值。

实现的交互功能分别有两个：

1. 点击滑块容器，移动scroll-view内容，通过给滑块容器绑定`mousedown`事件触发；
2. 拖动滑块使移动scroll-view内容，通过绑定三个事件实现：`mousedown`、`mousemove``mouseup`。

注意：
1. bar组建的滑块自身的偏移不是由bar组建自身直接改变，而是根据根据传入的两个props属性绑定到滑块的style上实现的；
```js
props: {
	vertical: Boolean,
	size: String,	// 滑块的长度
	move: Number	// 话快的偏移值
}
```
2. 滑块的偏移有css3的`tansfrom: translate()`实现
```js
export function renderThumbStyle({ move, size, bar }) {
  const style = {};
  const translate = `translate${bar.axis}(${ move }%)`;

  style[bar.size] = size;
  style.transform = translate;
  style.msTransform = translate;
  style.webkitTransform = translate;

  return style;
};
```

```html
<div
     class={ ['el-scrollbar__bar', 'is-' + bar.key] }
     onMousedown={ this.clickTrackHandler } >
  <div
       ref="thumb"
       class="el-scrollbar__thumb"
       onMousedown={ this.clickThumbHandler }
       style={ renderThumbStyle({ size, move, bar }) }>
  </div>
</div>
```

由滑块容器`el-scrollbar__bar`和滑块`el-scrollbar__thumb`组成。



### 点击容器移动滑块

容器元素监听`onMousedown`

```js
// 点击滑块容器，移动父元素的内容移动`$parent.wrap`的scrollTop/scrollLeft
clickTrackHandler(e) {
  // e.target.getBoundingClientRect()：获取元素大小与位置信息，返回一个DOMRect对象
  // x: 390 // 左边距离视窗左边距离
  // y: 91  // 上边距离视窗上边距离
  // width: 240 // 元素宽度
  // height: 26 // 元素高度
  // top: 91  // 上边距离视窗上边距离
  // right: 630 // 右边距离视窗左边距离
  // bottom: 117  // 低边距离视窗上边距离
  // left: 390  // 左边距离视窗左边距离

  // 以纵向滚轴为例子
  // offset：计算点击位置在元素矩形内纵向的偏移数值
  const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);   // e[this.bar.client]点击的横纵/坐标值
  // thumbHalf：滑块高度的一半
  const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
  const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

  // this.wrap: this.$parent.wrap
  this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
}
```

###  拖动滑块移动父容器内容

涉及到三个事件的监听：

1. `onMousedown`事件：负责触发事件；
2. `mousemove`事件：负责计算滑块移动距离与容器高度的比例，以此更新父容器的scrollTop
3. `mouseup`事件：负责移除`mousemove`事件的监听和整个功能结束的收尾。

#### 点击触发，动态绑定mousemove和mouseup事件

```js
clickThumbHandler(e) {
  // e.ctrlKey 
  // 鼠标事件ctrlKey是只读属性，可返回一个布尔值，当ctrl键被按下，返回true，否则返回false
  // 
  // e.button:
  // 0：主按键被按下，通常指鼠标左键 or the un-initialized state
  // 1：辅助按键被按下，通常指鼠标滚轮 or the middle button (if present)
  // 2：次按键被按下，通常指鼠标右键
  // 3：第四个按钮被按下，通常指浏览器后退按钮
  // 4：第五个按钮被按下，通常指浏览器的前进按钮
  // prevent click event of right button
  if (e.ctrlKey || e.button === 2) {
    return;
  }
  this.startDrag(e);
  // 点击位置距离滑块下边的距离
  this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (
    // 1.点击位置的纵坐标：e[this.bar.client]
    // 2.滑块元素上边的纵坐标：e.currentTarget.getBoundingClientRect()[this.bar.direction])
    // 点击位置到滑块上边的高度 = 1 - 2
    e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction])
                        );
},
startDrag(e) {
  e.stopImmediatePropagation();
  this.cursorDown = true;

  // addEventListener监听mousemove事件
  // addEventListener监听mouseup事件
  on(document, 'mousemove', this.mouseMoveDocumentHandler);
  on(document, 'mouseup', this.mouseUpDocumentHandler);
	document.onselectstart = () => false;
},
```

#### 动态计算父容器内容的偏移

此时鼠标右键已经被按下且未放开

```js
// 移动鼠标，同步移动父元素容器的内容
mouseMoveDocumentHandler(e) {
  if (this.cursorDown === false) return;
  const prevPage = this[this.bar.axis];

  if (!prevPage) return;

  // offset：点击位置到滑块容器顶部的距离
  const offset = ((
    // 1.滑块容器上边距离视窗上边距离：this.$el.getBoundingClientRect()[this.bar.direction]
    // 2.当前点击的纵轴坐标
    // 点击位置距离容器上边的长度 = 1 - 2
    this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]
  ) * -1);
  // 点击位置距离滑块上边的距离
  const thumbClickPosition = (
    // 1.this.$refs.thumb[this.bar.offset]：滑块高度
    // 2.prevPage：点击位置距离下边的距离
    // 点击位置距离滑块上边的距离 = 1 - 2
    this.$refs.thumb[this.bar.offset] - prevPage
  );
  // 计算“滑块上边到容器上边距离”占容器高度的百分比
  const thumbPositionPercentage = ((
    // 计算滑块上边到容器上边的距离
    offset - thumbClickPosition
  ) * 100 / this.$el[this.bar.offset]);
  
  console.log({
  '计算滑块上边到容器上边的距离': offset - thumbClickPosition,
  '容器的高度': this.$el[this.bar.offset]
  });

  // 通过thumbPositionPercentage计算夫容器移动的距离
  this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
},
```

#### 结束滑块移动

鼠标右键放开，结束事件重置基本变量，解绑mousemove事件

```js
mouseUpDocumentHandler(e) {
  this.cursorDown = false;
  this[this.bar.axis] = 0;
  off(document, 'mousemove', this.mouseMoveDocumentHandler);
  document.onselectstart = null;
}
```

#### 组件生命周期结束解绑mouseup事件

```js
destroyed() {
  off(document, 'mouseup', this.mouseUpDocumentHandler);
}
```





## 附录

### bar源码注释

```js
import { on, off } from 'zhuiyi-ui/src/utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    // 滑块的长度
    size: String,
    // 滑块的偏移量
    move: Number
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },

    wrap() {
      return this.$parent.wrap;
    }
  },

  render(h) {
    const { size, move, bar } = this;

    return (
      <div
        class={ ['el-scrollbar__bar', 'is-' + bar.key] }
        onMousedown={ this.clickTrackHandler } >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar }) }>
        </div>
      </div>
    );
  },

  methods: {
    clickThumbHandler(e) {
      // e.ctrlKey 
      // 鼠标事件ctrlKey是只读属性，可返回一个布尔值，当ctrl键被按下，返回true，否则返回false
      // 
      // e.button:
      // 0：主按键被按下，通常指鼠标左键 or the un-initialized state
      // 1：辅助按键被按下，通常指鼠标滚轮 or the middle button (if present)
      // 2：次按键被按下，通常指鼠标右键
      // 3：第四个按钮被按下，通常指浏览器后退按钮
      // 4：第五个按钮被按下，通常指浏览器的前进按钮
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      this.startDrag(e);
      // 点击位置距离滑块下边的距离
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (
        // 1.点击位置的纵坐标：e[this.bar.client]
        // 2.滑块元素上边的纵坐标：e.currentTarget.getBoundingClientRect()[this.bar.direction])
        // 点击位置到滑块上边的高度 = 1 - 2
        e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction])
      );
    },

    // 点击滑块容器，移动父元素容器的内容（scrollTop/scrollLeft）
    clickTrackHandler(e) {
      // e.target.getBoundingClientRect()：获取元素大小与位置信息，返回一个DOMRect对象
      // x: 390 // 左边距离视窗左边距离
      // y: 91  // 上边距离视窗上边距离
      // width: 240 // 元素宽度
      // height: 26 // 元素高度
      // top: 91  // 上边距离视窗上边距离
      // right: 630 // 右边距离视窗左边距离
      // bottom: 117  // 低边距离视窗上边距离
      // left: 390  // 左边距离视窗左边距离

      // 以纵向滚轴为例子
      // offset：计算点击位置在元素矩形内纵向的偏移数值
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);   // e[this.bar.client]点击的横纵/坐标值
      // thumbHalf：滑块高度的一半
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      // addEventListener监听mousemove事件
      // addEventListener监听mouseup事件dsfsdf sdfsdfsdfsdfsdfdsfds
      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    // 移动鼠标，同步移动父元素容器的内容
    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;

      // offset：点击位置到滑块容器顶部的距离
      const offset = ((
        // 1.滑块容器上边距离视窗上边距离：this.$el.getBoundingClientRect()[this.bar.direction]
        // 2.当前点击的纵轴坐标
        // 点击位置距离容器上边的长度 = 1 - 2
        this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]
      ) * -1);
      // 点击位置距离滑块上边的距离
      const thumbClickPosition = (
        // 1.this.$refs.thumb[this.bar.offset]：滑块高度
        // 2.prevPage：点击位置距离下边的距离
        // 点击位置距离滑块上边的距离 = 1 - 2
        this.$refs.thumb[this.bar.offset] - prevPage
      );
      // 计算“滑块上边到容器上边距离”占容器高度的百分比
      const thumbPositionPercentage = (
        (
          // 计算滑块上边到容器上边的距离
          offset - thumbClickPosition
        ) * 100 / this.$el[this.bar.offset]
      );
      console.log({
        '计算滑块上边到容器上边的距离': offset - thumbClickPosition,
        '容器的高度': this.$el[this.bar.offset]
      });

      // 通过thumbPositionPercentage计算夫容器移动的距离
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
};
```
