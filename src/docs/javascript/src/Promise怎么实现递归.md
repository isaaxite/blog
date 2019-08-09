# Promise怎么实现递归

请求需要带上一个token作为验证。token有时效性，过期请求就无效需要重新获取有效的token，然后带上有效token重新请求。
```js
function get(url) {
  const token = getTokenStorage();
  return new Promise((reject, resolve) => {
    axios.get(`${url}?token=${token}`)
    .then(resp => {
      if(resp.status === TOKEN_OVERTIME) {
      	removeTokenStorage();
      	regainTokenFromServer()
        .then(token => {
          setTokenStorage(token);
          // 重新请求  
        });
      } else if(resp.status !== SUCCESS) {
      	return reject(resp.msg);
      } else {
      	return resolve(resp.data);
      }
    })
  })
}

get("https://xxx")
.then(data => {
  render(data);
})
.catch(errMsg => {
  toastErr(ErrMsg);
});
```

当使用以上get函数，发送一个请求，服务端响应“此时token已过期”，那么以上get函数就会执行到注（`// 重新请求  `）释的位置。在执行到此位置前，token已经重新获取并存入缓存，这时很明显需要做的就是递归一下这个get函数
```js
get(url);
```
但关键是怎么写！

是这样写：
```js
// 重新请求
get(url).then(data => resolve(data));
```

或是如下改写
```js
function get(url) {
  const token = getTokenStorage();
  return new Promise((reject, resolve) => {
    axios.get(`${url}?token=${token}`)
    .then(resp => {
      if(resp.status === TOKEN_OVERTIME) {
      	removeTokenStorage();
      	regainTokenFromServer()
        .then(token => {
          setTokenStorage(token);
          // 重新请求 
          return resolve({ isRegainToken: true });
        });
      } else if(resp.status !== SUCCESS) {
      	return reject(resp.msg);
      } else {
      	// 将此处 return resolve(resp.data); 改写为
        return resolve({ isRegainToken: false, data: resp.data });
      }
    })
  })
  .then(({ isRegainToken, data }) => {
    return isRegainToken ? get(url) : Promise.resolve(data);
  })
}
```

以上基本算是伪代码，下面贴2个可以执行的例子：
```js
let counter = 0;
const max = 5;

function waitting(sec) {
  return new Promise(resolve => {
    console.log(`waiting ${sec}s...`);
    setTimeout(() => resolve(), 1000);
  });
}

function promise() {
  console.log(`waiting ${++counter}s...`);
  return new Promise(resolve => {
    if(counter >= max) {
      counter = 0;
      return resolve("promise finish");
    } else {
      setTimeout(() => {
        promise().then(res => resolve(res));
      }, 1000);
    }
  })
}

function promiseElse() {
  counter++;
  return new Promise((resolve, reject) => {
    if(counter >= max) {
      return resolve({ isValid: true, data: "promiseElse finish"});
    } else {
      return resolve({ isValid: false });
    }
  })
  .then(res => {
    if(res.isValid) {
      counter = 0;
      return Promise.resolve(res.data); 
    } else {
      return waitting(counter)
      .then(() => promiseElse());
    }
  });
}


promise()
.then(res => {
  console.log(res);

  return promiseElse();
})
.then(res => {
  console.log(res);
});
```
![image](https://user-images.githubusercontent.com/25907273/37294268-69a19900-2650-11e8-9489-301e168b8963.png)

