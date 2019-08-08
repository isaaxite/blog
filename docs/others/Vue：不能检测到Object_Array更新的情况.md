## 前言
看文档不认真，开发也没有多注意，总是hack。忽悠忽悠就过去，但怎么说，歪门邪道还是不太好，现在就亡羊补牢，总结总结。

## 数组
#### 索引
1. 使用下标更新数组元素；
2. 使用赋值方式改变数组长度；
3. 使用下标增删数组元素；

#### 正文
- 使用下标更新数组元素
```
data: {
   arrs: [0, 1, 2, 3]
}
```
直接使用`this.arrs[0] = 'zero';`虽然数组确实是被更新了，但是更新不会被渲染到视图（html页面）上。因为Vue没有检测到数组的更新。
>由于 JavaScript 的限制，Vue 不能检测以下变动的数组：
>
>当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
>当你修改数组的长度时，例如：vm.items.length = newLength

官方应对方法：

1. Vue.set( target, key, value )
```js
Vue.set(this.arrs, 0, 'zero');
```
2.vm.items.splice(indexOfItem, 1, newValue)
![image](https://user-images.githubusercontent.com/25907273/41549212-adabf358-7357-11e8-8ca2-7e59e3e6cbb5.png)

```js
this.arrs.splice(0, 1, 'zero');
```

- 使用赋值方式改变数组长度
即`this.arrs.length = 100;`无效！

官方应对方法：

1. vm.items.splice(newLength)
```js
this.arrs.splice(100);
```

- 使用下标增删数组元素
即一下操作无效：
```js
this.arrs[this.arrs.length] = this.arrs.length;
```
官方应对方法：变异方法。
1. push()
2. pop()
3. shift()
4. unshift()
5. splice()
6. sort()
7. reverse()
```js
this.arrs.push(this.arrs.length);
```
8. 替换数组(改变引用)
如官方所言：filter(), concat() 和 slice()都是会返回一个新数组
```js
this.arrs = this.arrs.contact(this.arrs.length);
// or
// this.arrs = this.arrs.contact([this.arrs.length]);
```
官方对性能问题的回应：
>你可能认为这将导致 Vue 丢弃现有 DOM 并重新渲染整个列表。幸运的是，事实并非如此。Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的、启发式的方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。

## 对象
#### 索引
1. 增删元素；

#### 正文
```js
data: {
  foo: { name: 'isaac' }
}
```
- 增删元素
```js
this.foo.job = 'coder';
delete this.foo.name;
```
如上增删元素是无效的。

官方的解决方法：
```js
// 新增
Vue.set(this.foo, 'job', 'coder');

// 删除
Vue.delete(this.foo, 'name');
```
Vue.delete对数组也是有效[传送门](https://cn.vuejs.org/v2/api/#Vue-delete)
