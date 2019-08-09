# 用回调函数解析async函数体内部的代码执行流程

# 前言
示例代码如下：
```js
function async01() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('step_01');
      return resolve();
    });
  });
}
function async02() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('step_02');
      return resolve();
    });
  });
}
async function foo() {
  console.log('async  start');
  await async01();
  await async02();
  console.log('async  end');
}

(function __main() {
  console.log('start');
  foo();
  console.log('start');
})();
```
输出结果：
```
start
async  start
end
step_01
step_02
async  end
```

# 正文
