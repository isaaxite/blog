>这call()、apply()两个方法作用是相同的，都是用来改变将要调用的函数的作用域。它们的区别在于接受参数的方式。
而bing()的作用是绑定作用域。

- apply()
接受两个参数。第一个参数是：作用域；第二个参数是：传入一个Array，元素是将调用的函数的参数,也可以直接传arguments对象[可选]
```
function sum(num1, num2){
    return num1 + num2;
}
function callSum(num1, num2){
return sum.apply(this, [num1, num2]);
//or
//return sum.apply(this, arguments);
}
```

- call()
和apply不同的是第二个参数开始，他不是传入一个Array，而是将参数逐个列出，即call的参数是不定的。
```
function callSum(num1, num2){
    return sum.call(this, num1, num2);
}
```

>PS：上面连个例子传入的作用域都是this，而这两个callSum函数都是在全局作用域下调用，即this对象引用的是window

```
window.color = "red";
var obj = { color: "blue" };
function sayColor(){
    console.log(this.color);
}

sayColor.call(this);    //red
sayColor.call(window);  //red
sayColor.call(obj);     //blue
```
>上面例子也看出call()和apply()方法最大的用还是，改变函数赖以运行的作用域

- bind()
```
var temp = sayColor.bind(obj);
temp();  //blue
```

>要注意的是：支持bind()方法的浏览器有，IE9+、Firefox4+、Safari5.1+、Opera12+、Chrome
