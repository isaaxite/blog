# 🐊vue中async-await的使用误区

# 前言

曾经见过为了让钩子函数的异步代码可以同步执行并且阻塞主线程直到钩子全部逻辑处理完，而对钩子函数使用async/await，就好像下面的代码：

```js
// exp-01
export default {
  async created() {
    const timeKey = 'cost';
    console.time(timeKey);
    console.log('start created');

    this.list = await this.getList();

    console.log(this.list);
    console.log('end created');
    console.timeEnd(timeKey);
  },

  mounted() {
    const timeKey = 'cost';
    console.time(timeKey);
    console.log('start mounted');
    
    console.log(this.list.rows);

    console.log('end mounted');
    console.timeEnd(timeKey);
  },

  data() {
    return {
      list: []
    };
  },

  methods: {
    getList() {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve({
            rows: [
              { name: 'isaac', position: 'coder' }
            ]
          });
        }, 3000);
      });
    }
  }
};
```

`exp-01`的代码最后会输出：

```
start created
start mounted
undefined
end mounted
mounted cost: 2.88623046875ms
{__ob__: Observer}
end created
created cost: 3171.545166015625ms
```

很明显没有达到预期的效果，为什么？

根据`exp-01`的输出结果，可以看出代码的执行顺序，首先是钩子的执行顺序：
```
created => mounted
```

是的，钩子的执行顺序还是正常的没有被打乱，证据就是：created钩子中的同步代码是在mounted先执行的：
```
start created
start mounted
```

再看看created钩子内部的异步代码：
```
this.list = await this.getList();
```

可以看见this.list的打印结果
```
end mounted
mounted cost: 2.88623046875ms
// 这是created钩子打印的this.list
{__ob__: Observer}
end created
```
在mounted钩子执行完毕之后才打印，言外之意是使用async/await的钩子内部的异步代码并没有起到阻塞钩子主线程的执行。这里说的钩子函数的主线程是指：
```
beforeCreate => created => beforeMount => mounted => ...
```


会写出以上代码的原因我估计有两个：

1. 对异步代码返回的数据有强依赖，因此希望在mounted钩子内容调用完成前，先执行完created的内容（包括异步代码的回调函数）；
2. 仅仅是希望钩子函数的异步代码可以按照编写顺序执行（`exp-01`是确实实现了的），但却没想到带来了副作用；



# 正文

#### 剖析一下
前言中针对代码的执行流程分析了一下，很明显没有如期望的顺序执行，我们先来回顾一下期望的顺序是什么
```js
// step 1
created() {
  // step 1.1
  let endTime;
  const startTime = Date.now();
  console.log(`start created: ${startTime}ms`);
  // step 1.2
  this.list = await this.getList();
  endTime = Date.now();
  console.log(this.list);
  console.log(`end created: ${endTime}ms, cost: ${endTime - startTime}ms`);
},
// step 2
mounted() {
  let endTime;
  const startTime = Date.now();
  console.log(`start mounted: ${startTime}ms`);
  console.log(this.list.rows);
  endTime = Date.now();
  console.log(`end mounted: ${endTime}ms, cost: ${endTime - startTime}ms`);
}

// step 1 => step 1.1 => step 1.2 => step 2 
```
期望的打印结果是：
```
// step 1(created)
start created
// this.list
{__ob__: Observer}
end created
created cost: 3171.545166015625ms

// step 2(mounted)
start mounted
// this.list.rows
[{…}, __ob__: Observer]
end mounted
mounted cost: 2.88623046875ms

```

对比实际的打印和期望的打印，就知道问题出在created钩子内使用了await的异步代码，并没有达到我们期望的那种的“异步代码同步执行”的效果，仅仅是一定程度上达到了这个效果。

下面来分析一下为什么会出现这个非预期的结果！

在分析前，让我们来回顾一下一些javascript的基础知识！看看下面这段代码：

```js
(function __main() {
  console.log('start');
  setTimeout(() => {
    console.log('console in setTimeout');
  }, 0);
  console.log('end');
})()

// output
start
end
console in setTimeout
```

这个打印顺序有没有让你想到什么？！

&nbsp;

**任务队列！**

&nbsp;

![](https://user-gold-cdn.xitu.io/2018/11/25/16749b8e662e2378?w=997&h=557&f=jpeg&s=73296)

我们都知道JavaScript的代码可以分成两类：

*同步代码* 和 *异步代码*

同步代码会在主线程按照编写顺序执行；

异步代码的触发过程（注意是触发，比如异步请求的发起，就是在主线程同步触发的）是同步的，但是异步代码的实际处理逻辑（回调函数）则会在异步代码有响应时将处理逻辑代码推入任务队列（也叫事件队列），浏览器会在主线程（指当前执行环境的同步代码）代码执行完毕后以一定的周期检测任务队列，若有需要处理的任务，就会让队头的任务出队，推入主线程执行。

比如现在我们发起一个异步请求：

```js
// exp-02
console.log('start');
axios.get('http://xxx.com/getList')
  .then((resp) => {
    console.log('handle response');
  })
  .catch((error) => {
    console.error(error);
  });
console.log('end');
```

在主线程中，大概首先会发生如下过程：

```js
// exp-03
// step 1
console.log('start');

// step 2
axios.get('http://xxx.com/getList');  // 此时回调函数（即then内部的逻辑）还没有被调用

// step 3
console.log('end');
```

在看看浏览器此时在干什么！

此时事件轮询（Event Loop）登场，其实并非此时才登场，而是一直都在！

“事件轮询”这个机制会以一定的周期检测任务队列有没有可执行的任务（所谓任务其实就是callback），有即出队执行。

当`step 2`的请求有响应了，异步请求的回调函数就会被添加到任务队列（Task Queue）或者 称为 事件队列(Event Queue)，然后等到事件轮询的下一次检测任务队列，队列里面任务就会依次出队，进入主线程执行：即执行下面的代码：
```js
// 假定没有出错的话
((resp) => {
  console.log('handle response');
})()
```

到此，简短科普了任务队列的机制，联想`exp-01`的代码，大概知道出现非预期结果的原因了吧！

created钩子中的await函数，虽然是在一定程度上是同步的，但是他还是被挂起了，实际的处理逻辑（this.list = resp.xxx）则在响应完成后才被添加进任务队列，并且在主线程的同步代码执行完毕后执行。
下面是将延时时间设为0后的打印：

```
start created
start mounted
undefined
end mounted
mounted cost: 2.88623046875ms
{__ob__: Observer}
end created
created cost: 9.76611328125ms
```

这侧面说明了await函数确实被被挂起，回调被添加到任务队列，在主线程代码执行完毕后等待执行。
&nbsp;

然后是为什么说`exp-01`的代码是一定程度的同步呢？！

同步执行的另一个意思是不是就是：阻塞当前线程的继续执行直到当前逻辑执行完毕~

看看`exp-01`的打印:
```
{__ob__: Observer}
end created
created cost: 3171.545166015625ms
```
`end created`这句打印，是主线程的代码，如果是一般的异步请求的话，这句打印应该是在`{__ob__: Observer}`这句打印之前的yo，至于为什么会这样，这里就不多解析，自行google！

另外，这里来个小插曲，你应该注意到，我一直强调，回调函数被添加进任务队列的时机是在响应完成之后，没错确实如此的！

但在不清除这个机制前，你大概会有两种猜想：

1. 在触发异步代码的时，处理逻辑就会被添加进任务队列；
2. 上面说到的，在异步代码响应完成后，处理逻辑才会被添加进任务队列；

其实大可推断一下

队列的数据结构特征是：先进先出（First in First out）

此时假如主线程中有两个异步请求如下：
```js
// exp-04
syncRequest01(callback01);
syncRequest02(callback02);
```
假设处理机制是第一点描述那样，那么callback01就会先被添加进任务队列，然后是callback02。

然后，我们再假设syncRequest01的响应时间是10s，syncRequest02的响应时间是5s。

到这里，有没有察觉到违和感！

异步请求的实际表现是什么？是谁快谁的回调先被执行，对吧！那么实际表现就是callback02会先于callback01执行！

那么基于这个事实，再看看上面的假设（callback01会执行）~

ok！插曲完毕！


#### 解法
首先让我回顾一下目的，路由组件对异步请求返回的数据有强依赖，因此希望阻塞组件的渲染流程，待到异步请求响应完毕之后再执行。

这就是我们需要做的事情，需要强调的一点是：**我们对数据有强依赖**，言外之意就是数据没有按预期返回，就会导致之后的逻辑出现不可避免的异常。

接下来，我们就需要探讨一下解决方案！

**[组件内路由守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB)了解一下！？**

> beforeRouteEnter 
> 
> beforeRouteUpdate (2.2 新增)
> 
> beforeRouteLeave

这里需要用到的路由守卫是：`beforeRouterEnter`， 先看代码：

```js
// exp-05
const storage = {};
export default {
  beforeRouteEnter(to, from, next) {
    showLoading();
    getList()
      .then((resp) => {
        hideLoading();
        storage.list = resp.data;
        next();
      })
      .catch((error) => {
        hideLoading();
        // handle error
      });
  },

  mounted() {
    let endTime;
    const startTime = Date.now();
    console.log(`start mounted: ${startTime}ms`);
    console.log(storage.list.rows);
    endTime = Date.now();
    console.log(`end mounted: ${endTime}ms, cost: ${endTime - startTime}ms`);
  },
};
```

路由守卫`beforeRouterEnter`，触发这个钩子后，主线程都会阻塞，页面会一直保持假死状态，直到在调用`beforeRouterEnter`的回调函数`next`，才会跳转路由进行新路由组件的渲染。

看起这个解决方案相当适合上面我们提出的需求，在调用`next`前，就可以去拉取数据！

但是如刚刚说到的，页面在一直假死，加入数据获取花费时间过长就难免变得很难看，用户体验未免太差

为此，在`exp-05`中我在请完成前后分别调用了`showLoading()` 和 `hideLoading()`以便页面`keep-alive`。

这个处理假死的loading有没有让你想到写什么，没错就是下面这个github跳转页面是顶部的小蓝条
![](https://user-gold-cdn.xitu.io/2018/11/25/16749b932ae96e29?w=1442&h=396&f=jpeg&s=94059)

想想就有点cool，当然还有很多的实现方式提升用户体验，比如作为body子元素的全屏loading，或者button-loading等等……

当然，我们知道阻塞主线程怎么都是阻塞了，loading只是一种自欺欺人式的优化（此时这个成语可不是什么贬义的词语）！

因此，不是对数据有非常强的依赖，都应在路由的钩子进行数据抓取，这样就可以让用户“更快”地跳转到目的页。为避免页面对数据依赖抛出的异常（大概就是 `undefined of xxx`），我们可以对初始数据进行一些预设，比如`exp-01`中对`this.list.rows`的依赖，我们可以预设`this.list`：
```
list: {
  rows: []
}
```
这样就不会抛出异常，待到异步请求完成，基于vue的update机制二次渲染我们的预期数据~

#### 修改后的声明
>
> 在修改前，原有的解决方式是：
> ```js
> // exp-05
> export default {
>   beforeRouteEnter(to, from, next) {
>     this.showLoading();
>     this.getList()
>       .then((resp) => {
>         this.hideLoading();
>         this.list = resp.data;
>         next();
>       })
>       .catch((error) => {
>         this.hideLoading();
>         // handle error
>       });
>   },
> 
>   mounted() {
>     let endTime;
>     const startTime = Date.now();
>     console.log(`start mounted: ${startTime}ms`);
>     console.log(this.list.rows);
>     endTime = Date.now();
>     console.log(`end mounted: ${endTime}ms, cost: ${endTime - startTime}ms`);
>   },
> };
> ```
经过的评论中的大佬们教做人后，针对以下两点做了修改:
1. `beforeRouteEnter`的函数体中是访问不到当前组件的上下文的，需要在回调参参数`next`（这是个函数引用）中，使用`next`这个函数的回调参数`vm（next(vm => {})）`中的`vm`才能访问到当前组件的上下文；
2. 虽然`vm`可以访问到组件的上下文，但是有个问题，就是你通过`vm`来做`get/set`，这个`get/set`动作是在`beforeCreate`、`created`、`beforeMount`、`mounted`这些钩子执行之后~这样的话，`beforeRouterEnter`的阻塞作用基本就废掉了！

# 小结
对于`exp-01`的写法，也不能说他是错误或不好的写法，凡事都要看我们是出于什么目的，如果仅仅是为了保证多个异步函数的执行顺序，`exp-01`的写法没有任何错误，因此async/await不能用在路由钩子上什么的并不存在！

**it just a tool！**

[欢迎提出不同得见解，提bug和评论，我们issue相见](https://github.com/issaxite/ezblog/issues/2)

