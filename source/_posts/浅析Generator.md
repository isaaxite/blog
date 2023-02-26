---
title: 浅析Generator
date: 2020-04-25 10:59:28
tags:
- JavaScript

categories:
- JavaScript

excerpt: " "
---

Generator 函数就是遍历器生成函数



```js
function* foo () {
    console.log(1);
    yield 1;
    console.log(2);
    yield 2;
    console.log(3);
    yield 3;
};
```

调用`foo()`会生成迭代器对象。

```js
const generator = foo();
```



第一次执行`generator.next()`，指针指向的是`yield 1;`的执行结果。

**而`console.log(1)`则是会被放在`next`中执行，这是猜想！**

迭代器对象的原理可以参考：

```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```



Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。

```js
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true
```



在调用`next`方法时会返回一个对象，但是在generator内部，`yield`表达式是不会有返回值（或者说是返回`undefind`）。

但是想起在koa的时候，下面的方法又是可以有返回值：

```js
module.exports = {
  url: '/detail',
  method: 'GET',
  * handler() {
    const id = this.headers[setting.bizHeader];
    if (!id) { return; }
    const out = yield model.Business.findOne({
      raw: true,
      attributes: ['name', 'desc', 'avatar'],
      where: { bizId: id & 65535, CompanyId: id >> 16 }
    });
    return out;
  }
};

// out 会储存一个Business的对象
```

**`next`方法可以带一个参数，该参数就会被当作上一个`yield`表达式的返回值。**

比如上面的handler generator函数，只要如是操作：

```js
const generator = handler();
// 计算 const out = yield model.Business.findOne({ /* ... */ })
const res = generator.next();		// { value: /* Business对象 */, done: false }
// res.value就会赋值给out
generator.next(res.value);
// 最终就return out
```



从语义上讲，第一个`next`方法用来启动遍历器对象，所以不用带有参数





## generator的throw方法

```js
function* foo() {
  try {
  	yield 'isaac'; 
  } catch (e) {
    console.log(`inner error:`, e.message);
  }
}

try {
 	const generator = foo();
  // 必须先启动，调用throw方法才有效
  generator.next();
  generator.throw('i am a error'); 
} catch (e) {
  console.log('outer error:', e.message);
}

// output
// inner error: i am a error
```

正如上面例子，使用`generator.throw`方法抛出的错误会被`generator`函数内部的`try...catch`捕获到，当然如果`generator`函数内部没有使用`try...catch`则会冒泡想外层抛出。



## yield*的本质

```js
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

遍历迭代器的同时再生成迭代器



Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实





## generator对异步任务的封装

```js
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```
