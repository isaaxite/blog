# vue__filters中this指针指向window

## 前言
不知道有没有人有过这样的需求：在filters里面调用methods定义的方法。我是有遇到过，按着惯性思维，在vue里，this指针默认执行vue（当然大家都知道，是vue做过bind做过处理的）。因此，直接在filters里面使用this调用menthos方法，结果，可想而知。

## 实验
filters里的this当然不是指向vue了，不然也不会有这文章。它如标题所说，指向的是window。

- html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.min.js"></script>
</head>
<body>
  <div id="app">
    <label for="">Name:</label>
    <span>{{name}}</span>
    <br>
    <label for="">Sex:</label>
    <span>{{sex|formatSex}}</span>
  </div>
</body>
</html>
```
- javascript
```javascript
new Vue({
  el: "#app",
  data: {
    name: 'isaac',
    sex: 1
  },
  filters: {
    formatSex: function(sexNum) {
      var SEX = ["女", "男"];
      sexNum = typeof (SEX[sexNum]) === 'undefined' ? 1 : sexNum;
      
      console.log(this);
      
      return SEX[sexNum];
    }
  }
})
```
- console
>![image](https://user-images.githubusercontent.com/25907273/35484610-3636b9ae-048d-11e8-9f62-aeed0e4ef475.png)

## 最后说两句
当然我知道我这样使用是不符合vue的最佳实践的，但是遇到了，还是记录一下，毕竟有时候记录比脑子好用。



[reference](https://cn.vuejs.org/v2/guide/filters.html#ad)
