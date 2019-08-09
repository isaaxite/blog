# vue的$refs屬性

## 前言
ref是什么？直到前几天我都不知道是什么鬼，看着别人的源码上写着个ref，我只是单纯认为是自定义的属性，还比较鄙夷人家自定义前缀不就`-data`（对力量一无所知的我）。

在没有vue这类前端开发框架前，是怎么给每个列表元素绑定属性的？别人我不知道，我会在用自定义属性，比如`data-id=""`。在我需要用到的时候，直接那就好，也不需要再去遍历数组获取，比如，点击列表元素触发一个删除操作，只需要`this.getAttribute("data-id")`（这里我简单写一下）就能拿到对应的id。

到使用vue，vue貌似不怎么鼓励开发者直接元素上使用自定义属性，至少我是看到很多人的vue代码上没有（可能我眼界太窄[捂脸]）

## 正文
在vue里面我还是会时不时会使用自定义属性，只要我认为有必要。那么我是怎么用的？
- event.target;
- document.querySelector(ele);

我喜欢原生的东西，they are the true one！

那么$refs是什么？
>ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例：
```html
<p ref="p">hello</p>

<!-- `vm.$refs.child` will be the child component instance -->
<child-component ref="child"></child-component>
```
好像已经一目了然！

可以直接通过ref属性值来获取对应的dom节点~



