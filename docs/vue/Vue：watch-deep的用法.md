## 前言
查看vue官方文档可以发现watch中还存在一个deep属性，根据官方说明`deep: true`是深度watch。
并且此属性是为watch对象准备的：
>为了发现对象内部值的变化，可以在选项参数中指定 deep: true 。注意监听数组的变动不需要这么做。

还有一个注意：
>注意：在变异 (不是替换) 对象或数组时，旧值将与新值相同，因为它们的引用指向同一个对象/数组。Vue 不会保留变异之前值的副本。

## 正文
有时候我们不会直接更新整个对象（改变引用），而是改变对象的元素的值。而改变元素时候，对象的watch是检测不到变化的，如果想检测到就要用`[ObjectName.attr<.attr>...<.attr>]`，如下`items.name`的watch:
```js
mounted() {
  setTimeout(() => {
    this.items.name = 'frank';
  }, 3000);
},
data: {
  // ...
  items: { name: 'isaac', age: 25 },
},
watch: {
  items(val) {
    // 检测不到元素的变化
  },
  'items.name'(val, oldVal) {
     // 检测到name变化
     console.log(val, oldVal);
  }
}
```
虽然使用`[ObjectName.attr<.attr>...<.attr>]`的方式检测到了对象的变化。但是也常有这样的需求：就元素变化触发一个回调函数，无论是哪个元素的变化，这个时候总不能给每个元素构建一个watch回调吧！理论上可行，但是并不实际~

然后就到`watch-deep`出场了~

```js
watch: {
  items: {
    deep: true,
    handler(val, oldVal) {
      // 可以检测到items.name的变化
    }
  }
}
```
使用深度watch也是有点问题
如官方所说的，深度watch的newVal和oldVal是相同的，因为items的value确实没有变化，都是同一个引用，如果你想真的看见不同的newVal和oldVal，你可以试试通过改变引用的方式去更新items：
```js
this.items = Object.assign({}, this.items, {
  name: 'frank'
});
```

如果必须要获取`items.name`的newVal和oldVal，我认为只能用回`[ObjectName.attr<.attr>...<.attr>]`的方式了~

