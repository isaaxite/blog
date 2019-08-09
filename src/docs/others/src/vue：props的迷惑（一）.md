# vue：props的迷惑（一）

## 前言
```html
<div id="app">
  <date-test :data-time="time"></date-test>
  <button @click="resetTimeHandler">
    Reset Time
  </button>
</div>
```

父组件
```js
new Vue({
  el: "#app",
  mounted() {
  	console.log(this.time)
  },
  data: {
  	time: [
    	formatTime(Date.now()), 
      formatTime(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ]
  },
  methods: {
  	resetTimeHandler() {
    	const day = 24 * 60 * 60 * 1000;
      const newTime = Date.now() + Math.floor(Math.random() * 20) * day;
      
    	this.time = [formatTime(newTime), formatTime(newTime - 7 * day)];
      console.log("resetTimeHandler:", this.time);
    }
  }
});
```
子组件
```js
Vue.component('date-test', {
	props: ["dataTime"],
  mounted() {
  	console.log(this.dataTime, this.time);
  },
  data: function () {
    return {
      count: 0,
      time: this.dataTime
    }
  },
  watch: {
  	time(val) {
    	console.log({ time: val });
    },
    dataTime(val) {
    	console.log({ dataTime: val });
    }
  },
  template: `
    <div>
    	<span>{{ time }}</span>
    </div>
  `
});
```

在vue中不提倡我们直接对props的属性进行读写，而是鼓励基于props创建计算属性，或者基于props在data方法中穿件对应的alias。比如上面的子组件中，对传入的time，就是使用后者。[传送门](http://jsfiddle.net/soxv8a6b/)

[传送门](http://jsfiddle.net/soxv8a6b/1/)


- 父组件不能直接改变子组件中基于props的data属性，不能响应到子组件的html中，虽然是改变props已经起效；
父组件的props属性不论是常量，还是计算出来的（比如说Date.now()）
解法1是直接在子组件的html中绑定props传入的属性，而不是基于props的data属性；
解法2是不使用data属性，而转而使用computed属性，创建基于props的计算属性；
解法3是在子组件中通watch监听属性的变化，然后直接手动去改变基于props的属性，另外，要说明的是：虽然基于props的data属性不同响应到props的变化，但是在子组件中改变基于props的属性是可以响应到子组件的html中的。但是watch也是有注意的地方的：比如传入的属性是dataNumber，基于dataNumber的data属性是number，watch number确实是可以看见number变化了，但是直接this.number = val;是无效的，只能watch dataNumber才会响应到子组件的html中。
```js
watch: {
  number(val) {
    // 无效
    this.number = val;
  },
  dataNumber(val) {
    // 有效
    this.number = val;
  }
}
```



