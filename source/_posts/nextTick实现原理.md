---
title: nextTick实现原理
date: 2019-11-20 08:41:47
tags:
- vue
- vue源码分析
categories:
- 源码分析
- vue
---


# 大纲

- [前言](#前言)
- [nextTick的实现逻辑](#nextTick的实现逻辑)
- [timerFunc是什么？](#timerFunc是什么？)
- [timerFunc的实现](#timerFunc的实现)

<!-- more -->

# 前言

- vue版本：`2.6.9`；
- path：`vue/src/core/util/next-tick.js`；

&nbsp;

# nextTick的实现逻辑

```typescript
const callbacks = []
let pending = false

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

进入nextTick，首先会点cb进行封装，涉及三个控制流！

1. 如果存在cb，则调用cb函数：`cb.call(ctx)`；
2. 如果`_resolve`存在，则调用 `_resolve(ctx)`，`_resolve`是`Promise.resolve`的引用！这是在当前环境支持`Promise`；
3. 不做任何处理。

在将`cb`推入`callbacks`后，判断当前是不是正在执行上次`callbacks`的回调函数，根据pending（待定）来判断，当前是否要执行新的`callbacks`的cb！



先假设当前`pending = fakse`，那么进入`if (!pending)`，执行`timerFunc()`！

&nbsp;

# timerFunc是什么？

`timerFunc`，是一个可将当前`callbacks`作为一个回调函数（这个包裹的函数就是下面的`flushCallbacks`），入队微/宏任务队列中，等待主线程代码执行完毕之后执行！

```typescript
function flushCallbacks () {
  // 立刻执行 “pending = false” 意味着，在主线程代码执行完，
  // 轮到当前这个 “flushCallbacks()” 被放入主线程执行开始
  // 就可以进入 "if (!pending)" 控制流再次执行触发 “timerFunc()”，
  // 将新的“flushCallbacks” 放进微/宏任务队列
  // 而不是等到 上一次 “callbacks” 的所有cb执行完之后
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```



`timerFunc`根据当前环境的支持情况可能用`Promise`、`MutationObserver`、`setImmediate`、`setTimeout`实现！优先级：`Promise` > `MutationObserver` > `setImmediate` > `setTimeout`。

- 微任务（micro task）：Promise、MutationObserver；
- 宏任务（macro task）：setImmediate、setTimeout。

任务调用优先级：微任务 > 宏任务。



关于为什么这样的优先级，vue做了说明：

> Here we have async deferring wrappers using microtasks. In 2.5 we used (macro) tasks (in combination with microtasks).However, it has subtle problems when state is changed right before repaint(e.g. #6813, out-in transitions).Also, using (macro) tasks in event handler would cause some weird behaviors that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109). So we now use microtasks everywhere, again.A major drawback of this tradeoff is that there are some scenarios where microtasks have too high a priority and fire in between supposedly sequential events (e.g. #4521, #6690, which have workarounds) or even between bubbling of the same event (#6566).
>
> 这里我们使用微任务异步延迟包装器。在2.5中，我们使用了（宏）任务（与微任务结合使用），但是当重新绘制之前状态发生改变时它存在一些细微的问题（例如＃6813，输出转换）。在事件处理程序中使用（宏）任务会导致一些无法避免的怪异行为（例如＃7109，＃7153，＃7546，＃7834，＃8109）。因此，我们现在再次在各处使用微任务。 是在某些情况下，微任务的优先级过高，并且在假定的顺序事件之间（例如＃4521，＃6690，它们具有变通方法）甚至在同一事件冒泡之间也会触发（＃6566）。

&nbsp;


# timerFunc的实现

```typescript
let timerFunc
```



### Promise实现timerFunc

```typescript
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    // 在有问题的UIWebViews中，Promise.then并不会完全中断，但是它可能会陷入一种怪异的状态，
    // 在这种状态中，回调被推送到微任务队列中，但是队列没有被刷新，直到浏览器需要执行其他一些工作，
    // 例如 处理一个计时器。 因此，我们可以通过添加空计时器来“强制”刷新微任务队列。
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
}
```



### MutationObserver实现timerFunc

```typescript
else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  // 在本地Promise不可用的地方使用MutationObserver，
  // e.g. PhantomJS, iOS7, Android 4.4
  // （＃6466 MutationObserver在IE11中不可靠）
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
}
```



### setImmediate实现timerFunc

```typescript
else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  // 退回到setImmediate。
  // 从技术上讲，它利用（宏）任务队列，
  // 但它仍然是比setTimeout更好的选择。
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
}
```



### setTimeout实现timerFunc

```typescript
else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```
