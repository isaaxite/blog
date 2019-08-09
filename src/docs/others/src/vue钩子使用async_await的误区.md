# vue钩子使用async_await的误区

# 前言
有时候，我们需要在请求到数据之后再进行页面的渲染，并且有了async/await之后，类似这样的代码就出现了：
```js
async created() {
  await this.getList();
},

mounted() {
  this.handleList(this.list.rows);
}
```
上面代码的期望是：在created钩子中先获取数据列表，获取后，再在页面挂在后进行数据处理。逻辑上正确，但实际表现却不如人意。结果会是：

```
undefined of rows
```

# 正文
为什么会有这样的结果？！

其实回忆一下js的基础知识：事件轮询（event loop），就能知道个大概了。

async/await本就是generator的语法糖，再看看getList这个函数（这是它就是个网络请求），再vue中你是怎么做一部请求？是不是大多是用axios，这里就是，我的同事就是~

没错，我假定了那么多前定，但是也确实大多如此！

axios本质就是对promise的封装！

本体来了，再执行环境会怎么样？它会被推进事件队列，等待当前执行环境同步代码执行完毕再响应事件队列的事件（假定此时挂载的事件已经完毕，可以出发回调）！

说到这里，层层往上推，大概就知道为什么created钩子会在mounted钩子之后执行（这里指的是created钩子内部的await代码，而非在await前的同步代码，这些同步代码还是会按正常的顺序执行，不明白的想想promise内部的同步代码就了然于心）
