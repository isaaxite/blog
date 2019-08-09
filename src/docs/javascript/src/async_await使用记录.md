# async_await使用记录

## 配合promise使用async/await
1. 封装promise的函数，依然需要return一个promise对象；
2. vue的钩子一旦使用async/await（或者promise），都是被推进事件队列，放在主流程后执行（是指async函数相同机型环境，而async函数体内部，await代码和async函数体内部的同步代码效果相同），换言之，mounted函数体的同步代码不会等到使用async的beforeMount函数体内部的异步代码（使用await）执行完之后再执行~
千万不要因为有了async/await就以为等同同步代码，async/await的“同步”仅仅是指同时async/await的函数，并且这些async/await都是会推进时间队列，等到当前执行环境的同步代码执行完之后才会执行
```js
const delay = (...rest) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('setTimeout1');
      resolve(rest);
    }, 2000);
  })
};
const delayOfNoReturn = (...rest) => {
  new Promise((resolve) => {
    setTimeout(() => {
      console.log('setTimeout2');
      resolve(rest);
    }, 2000);
  })
};
const foo = async function() {
  console.log('start1');
  return await delay('isaacgan');
};
const bar = async function() {
  console.log('start2');
  return await delayOfNoReturn('isaacgan');
}
foo();
bar();
```
