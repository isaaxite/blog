# 001
```js
new Promise((reslove, reject) => {
  console.log("new Promise");
  return resolve();
})
.then(() => {
  console.log("then01");
})
.then(() => {
  setTime(() => console.log("then02"), 2000);
})
.then(() => {
  console.log("then03");
})
.catch(errMsg => {
  console.log(errMsg);
});
```
我们理想的输出顺序是：`new Promise` => `then01` => delay 2s => `then02` => `then03`
以上输出：
```
// new Promise
// then01
// then03
// then02
```

将第2个`then`修改为：
```js
then(() => {
  setTime(() => {
    console.log("then02");
    return Promise.resolve();
  }, 2000);
})
```
同样输出：
```
// new Promise
// then01
// then03
// then02
```
再将第2个`then`修改为：
```js
then(() => {
  return new Promise((resolve, reject) => {
    setTime(() => {
      console.log("then02");
      // 可以不写return，但是建议如是写。为了不让执行resolve之后的代码
      return resolve();
    }, 2000);
  }
})
```
这样写修改之后才能达到理想的输出。

# 002
```js
new Promise((resolve, reject) => {
  let property = 1;
  resolve();
})
.then(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("then01")
      // return reject("then01-Promise error");
      return resolve();
    }, 500);
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("then02")
        // return reject("then02-Promise error");
        return resolve();
      }, 500);
    })
    .then(() => {
      for(let i = 0; i < 3000; i++) {
        console.log("for...");
      };
      console.log("then03")
      // return Promise.reject("then03-Promise error");
      return Promise.resolve("then03-resolve");
    });
  });
})
.then(res => {
  console.log("then04, res:", res);
})
.catch(errMsg => {
  console.log(errMsg);
});
```
分析以上代码
- 结论一：深层then中的错误也是可以被最后的第一层promise的catch捕捉到；
1）取消以上代码中`return reject("then01-Promise error")`的注释，结果
![image](https://user-images.githubusercontent.com/25907273/37244036-ea82a54e-24bd-11e8-9132-a45ce5b9f492.png)
2）取消以上代码中`return reject("then02-Promise error")`的注释，结果
![image](https://user-images.githubusercontent.com/25907273/37244052-1a643b1a-24be-11e8-8cec-f54661768187.png)
3）取消以上代码中`return Promise.reject("then03-Promise error")`的注释，结果
![image](https://user-images.githubusercontent.com/25907273/37244064-3a9cfe12-24be-11e8-8216-42c4ff56aa97.png)

- 结论二：由上往下，无论是否为同一层的then，都会由上往下同步执行；
![image](https://user-images.githubusercontent.com/25907273/37243964-0b870a42-24bd-11e8-9ece-594a5bbb2eee.png)
利用这个特点可以写出更好看的Promise二次封装，比如
```js
function getList() {
  return axios.get(xxx)
  .then(resp => {
    if(resp.status === ERROR) {
      return Promise.reject(resp.msg);
    }
    return Promise.resolve(resp);
  })
}
```
当然，也可以在axios外部包括一层`new Promise`。
- 结论三：深层then内的Promise的then内部的异步逻辑并不计入Promise的`pending `状态
修改then03内部代码为：
```js
then(() => {
  setTimeout(() => {
    console.log("then03")
    return Promise.resolve("then03-resolve");
  }, 500);
});
```
![image](https://user-images.githubusercontent.com/25907273/37244245-d51a5d8e-24c0-11e8-8c03-dd6681c5255d.png)

若想以上一步去代码也进入`pending`状态，就需要在外部包裹一层Promise逻辑
```js
then(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("then03")
      // return reject("then02-Promise error");
      return resolve("then03-resolve");
    }, 500);
  })
});
```
![image](https://user-images.githubusercontent.com/25907273/37244268-4b0899e8-24c1-11e8-86fe-224b74fb284c.png)


