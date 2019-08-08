来自官网的说明
>这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

凡夫俗子如我第一遍看不懂这是什么意思~

实践是检验自己确实是凡夫俗子的唯一方法~

在使用script标签引入vuejs的时候，经常会出现这样一种情况：
vue的未被渲染的代码会直接暴露在页面上，知道vuejs对页面渲染完毕。比如：
```html
<p>i am {{ name }}</p>
```
```js
data: {
  name: "isaac"
}
```
在页面加载之初，就可能会出现：
> i am {{ name }}

的样子，过一阵子才会变成：

> i am isaac

v-cloak就用来解决这情况的！

首先要先定义[v-cloak]的样式，比如解决上面的情况就可以在css中定义：
```css
[v-cloak] {
  display: none;
}
```
然后：
```html
<p v-colak>i am {{ name }}</p>
```
完美解决！
