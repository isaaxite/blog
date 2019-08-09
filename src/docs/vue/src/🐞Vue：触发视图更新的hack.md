# 🐞Vue：触发视图更新的hack

## 前言
触发视图更新的hack，hack的是什么？hack那些数据改变却没有被vue检测到的更新！那么vue有哪些情况是检测不到数据的变动的？
官方说明的有下面两大类：
- 数组
1. 使用下标更新数组元素；
2. 使用赋值方式改变数组长度；
3. 使用下标增删数组元素；

- 对象
1. 对象的增删

- 其他
1. 比如props到子组件的原始属性
……
具体看另外一篇文章: [\[传送门: Vue：不能检测到Object/Array更新的情况\]]


## 正文
那么要怎么hack？！

原理也很简单~

既然vue检测不到数据的变化，那么就强制触发vue去更新！但是vue并没有提供这样的接口（我是说统一的接口，不是官方提供的解决方案），如果有提供就不叫hack了对吧！

是这样的：对于每次vue可以检测到的数据变动，vue都会重新去渲染整个视图上的变动，整个，注意是整个，并不是说，data里面那个对象或列表的数据变动了，就仅仅更新对应的视图区域，不是这样的，是整个，ok！所以可以利用这一点！

具体的做法就是：
**在修改vue检测不到的数据后，再变动一下vue可以检测到的数据，比如更新一下一个随机数**

## 实践
```html
<div id="app" v-cloak :data-counter="counter">
  <dl>
    <span v-for="(item, index) in arrs">{{ index === 0 ? '' : ', ' }}{{ item }}</span>
  </dl>
  <dl v-for="(item, key) in items">{{key}}: {{item}}</dl>
  <button @click="operate('add')">add</button>
  <button @click="operate('delete')">delete</button>
  <button @click="operate('update')">update</button>
  <button @click="operate('updateArrs')">update arrs</button>
</div>
```

```js
new Vue({
  el: '#app',
  data: {
    useCounter: true,
    counter: 0,
    arrs: [0, 1, 2, 3, 4],
    items: {
      name: 'isaac',
      position: 'coder'
    }
  },
  watch: {
    items: {
      deep: true,
      handler(val, oldVal) {
      	console.log({ val, oldVal });
      }
    }
  },
  methods: {
    env(callback) {
      callback && callback();
      this.useCounter && this.counter++;
    },
    operate(order) {
      if(order === 'add') {
      	this.env(() => {
          this.items.goodAt = 'javascript';
        });
      } else if(order === 'delete') {
        this.env(() => {
          delete this.items.goodAt;
        });
      } else if(order === 'update'){
      	this.items.name = Math.random();
      } else if(order === 'updateArrs') {
      	this.env(() => {
          this.arrs[0] = Math.round(Math.random() * 100);
        });
      }
    }
  }
});
```
正如前言中说的几种情况，都会在之后更新一个`data.counter`，而`data.counter`则是可以检测被检测到的！

## 缺点
虽然这样hack确实出发了视图的更新，但是有个缺点：
- 对应的watch是检测不到数据的变动！

所以说，最好还是使用官方提供的解决方案！

## 最后说一句
上面的hack是我在实践中发现的，应该在说debug的时候！因为自己清洗知道数组和对象那些情况下是触发不到视图更新的，但是某次却神奇地更新了视图！然后就开始慢慢地测试~

