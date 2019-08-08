## 前言
用过jQuery的同学做上拉加载的同学都知道，加载第n(n>1)页数据时，都会使用`append`函数将新增的数据的html代码添加在到页面的最后。即是说，1~（n-1）页的数据都已经静态，不会在新增页面数据的时候重新渲染，但是你非要将1~（n-1）删除，再讲1~n页数据重新渲染，我也无话可说。

## vue数据变动的渲染方式
因为有以前jQuery的实现方式，我下意识也是认为vue也是如是做的。但开发过程中，我发现并非如此。而是，在每次数据变动后都会重新将整个数据数组，重新全部渲染。

## 实验
- html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.min.js"></script>
</head>
<style>
  li{ list-style-type: decimal-leading-zero; }
</style>  
<body>
  <div id="app">
    <button @click="addData">Add Data</button>
    <ul>
      <li v-for="item in options">
        <div>Random: {{randomNo()}}</div>
        <div>name: {{item.name}}</div> 
        <div>occupation: {{item.occupation}}</div> 
        <br>
      </li>
    </ul>
  </div>
</body>
</html>
```
- javascript
```javascript
new Vue({
  el: "#app",
  data: {
    options: []
  },
  beforeMount: function() {
    this.options = this.createData(2);
  },
  watch: {
    options: function(val) {
      console.log(val);
    }
  },
  methods: {
    createData: function(count) {
      var options = [];
    
      for(var i = 0; i < count; i++) {
        options.push({
          name: "isaac",
          occupation: "coder"
        });
      }
      
      return count > 1 ? options : options[0];
    },
    randomNo() {
      return Math.floor(Math.random() * 1000) + 1;
    },
    addData() {
      this.options.push(this.createData(1));
    }
  }
})
```
- output_01
初始页面
>![image](https://user-images.githubusercontent.com/25907273/35485689-22cf61fc-049e-11e8-98d2-f716f4bd37e7.png)


- output_02
新增一条数据
>![image](https://user-images.githubusercontent.com/25907273/35485678-fabc26fa-049d-11e8-8fb1-46839583b5c9.png)

- output_03
再次新增一条数据
>![image](https://user-images.githubusercontent.com/25907273/35485684-0c52162c-049e-11e8-8448-dc5bafe4e415.png)

## 小结
结果验证确实每次数据变动，页面都会重新将所有数据渲染，若果不是，那么已经渲染过的Random就会发生改变。这只是经验之谈，我还没有去看vue的源码实现，看过就再回来补坑。
