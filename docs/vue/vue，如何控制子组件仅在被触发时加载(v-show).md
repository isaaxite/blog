![wechatimg947](https://user-images.githubusercontent.com/25907273/32830973-7dcd831c-c9bc-11e7-9ebd-2e038ddfb723.png)

### 前言
开发过一个简单基于Vue的微信单页H5（会用vue，很大程度上是我想玩玩vue，深入实践），就是一开始很简单，很多页面都是以子页的形式在一个页面（主页）中引入，在触发的时才展示出来。这样做就有个问题：主页加载时，其他子组件也会一样加载。这显然不是我想要的，也会引起一系列的问题。

### 场景
- home page
用户点击`home page`中的任一分类，切换到`selector page`查看当前分类的商品列表
```javascript
<ul>
  <li>分类1</li>
  <li>分类2</li>
  <li>分类3</li>
  ...
  <li>分类n</li>
</ul>
```

- selector page
用户查看商品列表
```javascript
<ul>
  <li>商品1</li>
  <li>商品2</li>
  <li>商品3</li>
  ...
  <li>商品n</li>
</ul>
```

### 逻辑
- 目标，我们想要达到的逻辑
![image](https://user-images.githubusercontent.com/25907273/32831330-9324a668-c9bd-11e7-8edb-ed42aad75d3e.png)
我希望的是，只有当用户点击’分类‘时触发子组件，才开始执行子组件内部的逻辑，其他情况下，都不需要执行子组件的逻辑。

- 实际，我们不想要的逻辑
![image](https://user-images.githubusercontent.com/25907273/32830934-6034a402-c9bc-11e7-8471-42adadf3f37f.png)
上面的逻辑，显然就不是我们想要的，从一开始进入主页，不但主页的逻辑开始了执行，连子页的逻辑也会被执行。用户点击分类的时候，只是显示子页，而不是显示并触发子页的逻辑。


### 目录结构
```
├ home.vue
├ _selector.vue
```

### 错误例子主要代码
- 主页(home)主要代码
```javascript
// home
<template>
  <div id="home" class="route">
    <a href="javascript:;" v-for="item in list"  @click="selectorData(item)">
      ...
    </a>
    ...
    <transition
    :enter-active-class="animated.selector.enterActive">
      <v-selector v-show="isSelector" :data="selector"></v-selector>
    </transition>
    ...
  </div>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      selector: {}
    };
  },
  methods: {
    selectorData(data) {
      const self = this;
      self.selector = data;
    }
  },
  ...
  components: {
    'v-selector': selector
  }
}
</script>
```
- 子页(selector)主要代码
```javascript
<template>
  <div id="selector" class="selector item">
    ...
  </div>
</template>
<script>

export default {
  name: 'selector',
  props: ['data'],
  ...
  mounted () {
    const self = this;
    self.list = self._getListAsync(self.data.id);
  },
  ...
}
</script>
```
（贴上面的代码好像有点鸡婆了）

- 简单梳理
在主页，你看见有以`component`形式引入`selector`(v-selecor)，并且在template区域用标签形式使用了selector组件，并且有`props`一个selector属性。细心观测初始这个`this.selector`属性初始是空的。只有在点击任一分类时，会更新该属性，并响应到子组件。
记得刚刚说的吧，初始`this.selector`是空的，而在渲染主页的时候，同时也渲染了子组件，那么就会执行子组件中，根据分类id拉取分类列表数据。

- 问题
初始没有分类id传到selector，因此拉取数据会失败并且报错。退一步，我添加默认分类id，拉取了默认数据成功，但是这不是一定就是我想要的数据，最可怕的是，我在此点选另外的分类进入selector中，不会再次拉取数据。

### 解决方案
看到这里，估计有人发现我是个傻逼了。为什么这么说呢？为什么不将子组件作为一个路由组件！最致命的是，这傻逼为什么不直接用`v-if`代替`v-show`！`v-if`是会根据状态重新渲染和销毁子组件的，这样就可以触发子组件的各个钩子，为让你认为我是傻逼，我有如下引用：

- 引用原文
>### v-if vs v-show 
>v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。
[原文链接](https://cn.vuejs.org/v2/guide/conditional.html#v-if-vs-v-show)

- 使用v-show的替代方案
1. 将控制子组件是否展示的状态`isSelector`传入selector组件；
2. 使用`watch`监听`isSelector`， 当i`sSelector`为`true`是执行拉取数据代码。

```javascript
// home page
...
<transition
:enter-active-class="animated.selector.enterActive">
  <v-selector v-show="isSelector" :data="selector" :data-launch="isSelector"></v-selector>
</transition>
...

// selector
...
watch: {
  dataLaunch() {
    const self = this;
    if(self.dataLaunch) {
      self.list = self._getListAsync(self.data.id);
    } else {
      // 执行相应退出逻辑
    }
  }
}
...
```

------------
补充

忽然想起，还有另外的方法可以让子组件销毁和重建，vue有暴露销毁和重建的接口（这不就是活脱脱的v-if吗[捂脸]）






### Menu
- [ [ Home ] ](https://issaxite.github.io)
- [ < Prev \] ](https://github.com/issaxite/issaxite.github.io/issues/60)
- [ \[ Next > ](https://github.com/issaxite/issaxite.github.io/issues/62)
