---
title: New操作符的机制与实现相同功能的方法
date: 2023-02-18 11:45:11
tags:
- JavaScript
- 旧文迁移
categories:
- JavaScript
---

# 大纲

- [new操作符做了什么]
    - [小结一下](#小结一下)
- [实现一个new创建实例]
    - [分析](#分析)
    - [具体实现](#具体实现)

<!-- more -->

# new操作符做了什么？

[回到顶部]

先来看一个例子，分别用新旧方式创建类，并实例化。
```js
// 传统实现
function Foo(name) {
  this.name = name
}
// 静态属性
Foo.fn = 'Foo';
// 成员方法
Foo.prototype.sayName = function() {
  console.log(this.name);
}

// 现代实现
class Bar {
  constructor(name) {
    // 静态属性
    Bar.fn = 'Bar';
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}
```
分别创建两个类的实例
```js
const foo = new Foo('isaac');
const bar = new Bar('isaac');
```
<img src="62819728-ddf24080-bb8b-11e9-8ebb-97522b8ce822.png" alt="New操作符的机制与实现相同功能的方法"/>

首先，可以看输出结果。很明显两个实例的结构上是基本一致的，类比一下，你可以猜到新语法“class”的实现本质，当然class也确实是传统实现的语法糖。

所以，接下来直接使用Foo的定义方式作为例子讲。

再来看看定义一个类的时候我们做了什么：
- 定义了一个构造函数，将需要属性赋值给了上下文（context，即上文的this）
- 定义了构造函数的属性prototype，将方法、属性挂载在这个prototype上。

最后再对比下实例的结构：

你可以发现，传入Foo的实参被初始化到了对象的第一层属性上：

<img src="62832611-9b039c00-bc63-11e9-9812-f76237cce809.png" alt="New操作符的机制与实现相同功能的方法"/>

**说不准这就是构造函数做的事情：通过构造函数将传参，经过逻辑处理，然后初始化到实例上。**

在看输出结果，在`name`属性的下面还有一个`__proto__`属性，他是一个类对象的结构，你可以发现有两个成员是我们自己定义的：
> 1. fn
> 2. sayName

这两个属性都是我们在定义类的时候挂载到prototype上的。

**说不准这就是我们定义在Foo.prototype属性**

最后，我们根据上面两个猜想，再进行推断new做了什么事情：
- new通过构造函数创建了一个对象foo，并且通过构造函数的逻辑初始化了这个对象的基本成员；
- new将foo的原型引用指向了Foo.prototype，从而连接好从`foo -> Foo.prototype -> Object.prototype`这条原型链。

上面即是猜想也是实质，我不去证明，这不是我的主要想写的，我是想根据这个猜测去实现一个方法达到“new”的功能。

## 小结一下
javascript的类的实现分成两部分：
- Constructor（构造函数）
- Proptotype（原型）

实例化一个类的实例的本质是：
- 创建一个对象，且在访问该对象成员时，可以向它类指向原型回溯；
- 对象的成员属性（包含方法）通过Constructor进行初始化；


# 实现一个new创建实例

[回到顶部]

## 分析

根据上面对new操作符的分析，我们可以这么做：
1. 创建一个对象；
2. 将这个对象的原型引用（不是这个对象的原型，是一个内部属性`__proto__`指向）；
3. 调用构造函数，将上下文（this）绑定到对象。

## 具体实现

- 使用`setPrototypeOf`实现原型指向

`setPrototypeOf`是ES6的新方法，具体实现其实就是对对象`__proto__`的修改
```js
function setPrototypeOf(_ctx, _proto) {
  _ctx.__proto__ = _proto;
}
```

```js
/**
 * 创建实例
 * @param { Constructor } ctor 构造
 */
function newIns(ctor) {
  const ins = {};
  Object.setPrototypeOf(ins, ctor.prototype);
  ctor.apply(ins, Array.prototype.slice.call(arguments, 1));
  return ins;
}

const ins = newInsOf(Foo, 'isaac')
console.log(ins);
```

<img src="62832251-0cd8e700-bc5e-11e9-80c6-578eb9c982e7.png" alt="New操作符的机制与实现相同功能的方法"/>

- 通过`Object.create`“继承”类

`Object.create`是官方对原型式继承的内部实现，具体逻辑如下：
```js
function objectCreate(prototype) {
  function F() {}
  F.prototype = prototype;
  return new F();
}
```
对于原型式继承可参考: [原型式继承](https://github.com/isaaxite/blog/issues/253#issuecomment-520214476)

`Object.create`不但创建了一个对象，并且设置了这个对象的`__proto__`指向。

```js
function newInsOf(
  const ins = Object.create(ctor.prototype);
  ctor.apply(ins, Array.prototype.slice.call(arguments, 1));
  return ins;
}
```

<img src="62832679-d357aa00-bc64-11e9-9963-dd2741ad89f9.png" alt="New操作符的机制与实现相同功能的方法"/>

[回到顶部]: #大纲
[new操作符做了什么]: #new操作符做了什么
[实现一个new创建实例]: #实现一个new创建实例

