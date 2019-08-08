## 前言
先说结果，再来实验：使用props传入数组数据，然后用computed来对传入的数据进行处理，然后之后对computed的属性进行修改，数据的改变并没有响应到页面上。

## 实验
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
    <child message="123"></child>
  </div>
</body>
</html>
```

```javascript
new Vue({
  el: "#app",
  components: {
    'child': {
      props: ['message'],
      template: "\
        <div>\
          <input type='text' :value='currentMessage'><br>\
          <button @click='changeCurrentMessage'>change computed</button>\
        </div>",
      computed: {
        currentMessage() {
          return this.message;
        }
      },
      methods: {
        changeCurrentMessage: function() {
          this.currentMessage = 456;
          console.log(this.currentMessage);
        }
      }
    }
  }
})
```
初始结果
![image](https://user-images.githubusercontent.com/25907273/35482474-e31f7c54-0470-11e8-86f6-af3ca3877d36.png)

点击`change computed`后结果
![image](https://user-images.githubusercontent.com/25907273/35482479-fd7bedc6-0470-11e8-8b74-de28053fea6d.png)

