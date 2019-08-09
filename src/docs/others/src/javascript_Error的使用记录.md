# javascript_Error的使用记录

## 前言
最近开始写nodeJs，很开心，就算是在写Koa1，等了差不多半年了，终于开始有机会参与后端的开发。
在错误处理机制上有了点小小的收获～

## 正文
不是说以前没有用过js的原生的错误处理，很多以后都是自定义的错误处理！
```js
# 在写前端的时候，大多时候会直接return 一个错误处理的对象，比如
// 产生错误
return {
  status: false,
  message: 'this is a error'
}
// 正确返回
reutrn {
  status: true,
  message: 'success',
  data: dataList
}

# 又或者直接将错误处理对象封装成一个class
function ErrorExtension(status, message, data) {
  this.status = status;
  this.message = message;
  this.data = data;
}

throw new ErrorExtension(false, 'this is a error');
```
会自定义错误对象或者class都是大多时候我觉得这样更加灵活！

但是，其实也有点不好的弊端，大家一起开发的时候如果都是自定义错误处理对象的话，画面太美无法想象，而且还有如果不是一开始就是一起开发，没有参与带最初的开发，一些前辈在catch的时候大多时候会在项目中添加错误的中间件，catch带错误，直接获取error.message作为错误相应的信息
```js
try {
  throw new Error('this is a error');
} catch((error) => {
  errorHandle(error.message);
});
```
再说，现在多人开发大多会用JSElint来约束开发者，规范化开发益发重要！

