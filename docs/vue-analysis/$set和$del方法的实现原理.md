# 大纲

- [前言](#前言)
- [`$set`的实现原理](#`$set`的实现原理)
- [`__ob__`是怎么来的？](#`__ob__`是怎么来的？)
- [`$del`的实现原理](#`$del`的实现原理)
- [总结](#总结)


# 前言

[回到顶部](#大纲)

- vue版本：`v2.6.9`;

- $set的实现原理；

- 列举$set方法可以通知订阅者的情况；



# `$set`的实现原理

[回到顶部](#大纲)

**path: vue/src/core/observer/index.js**

```js
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (
    process.env.NODE_ENV !== 'production'
    // undefined || 值类型（原始类型）数据
    && (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }

	/**
   * $set 增删数组元素
  **/
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    // 删除或添加元素
    // 直接使用splice，因为splice是已经被处理过的变异方法
    target.splice(key, 1, val)
    return val
  }
  
 
  /**
   * $set 设置对象属性
  **/
  // 对象原有属性，直接赋值！这个对象有两种情况 $data本身、$data的子属性或后代属性 和 非$data 对象
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  // warn: 不应该使用 $set 设置 vue实例 和 $data 的成员属性
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // 被设置的对象没有被观测（劫持）
  if (!ob) {
    target[key] = val
    return val
  }
  // 新增属性
  // 对新属性进行劫持
  defineReactive(ob.value, key, val)
 	// 通知订阅该对象订阅者
  ob.dep.notify()
  return val
}
```

`$set`可以用来设置对象和数组。但target不允许是undefined 或 值类型（原始类型）数据；


#### 新增数组元素

  1. 首先要是个数组，然后指定的index必须是自然数！

直接就使用了splice方法，因为此方法已经是被vue处理过的变异方法！详细参考[数组变异方法（Mutation Methods）的实现原理]。

#### 新增对象属性

1. 更新数组原有属性：`if (key in target && !(key in Object.prototype))`，直接赋值！此时的对象一般有以下几种情况：a. $data本身（tip：$data的原型就是执行Object.prototype）；b. $data的子属性或后代属性；c. 非$data 对象。
2. 被设置的对象是vue的实例或$data，此类情况会warning，而且不会做任何操作。控制流是：`if (target._isVue || (ob && ob.vmCount))`。
3. 被设置的对象没有被观测（劫持），情况和1一样，直接赋值。
4. 正确设置，越过以上3道障碍！会对对象的新属性进行劫持，这样新属性才会有Dep关联，才能被watcher订阅！


&nbsp;


# `__ob__`是怎么来的？

[回到顶部](#大纲)

在设置对象属性时，执行了`const ob = (target: any).__ob__`，`__ob__`从target中取出，每个被劫持的数组或对象都会将劫持当前该引用类型数据的Observer实例挂载道该引用类型数据的`__ob__`上！详细参考[数组变异方法（Mutation Methods）的实现原理]。



在`defineReactive(ob.value, key, val)`，这句中，还见到，defineReactive是对`ob.value`的` key`进行了坚持，`ob.value`是什么？不是应该要操作的对象不应该是`target`吗？看下面：



```typescript
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // ...
  ob = new Observer(value)
  // ...
}
export class Observer {
  value: any;
  // ...

  constructor (value: any) {
    this.value = value
    // ...
  }
  // ...
}
```

在正常的数据坚持中，vue调用`observe`方法对目标对象的成员进行劫持，从上面可以看到这个传入的对象（代码中的形参value），最中传入到Observer的构造函数赋值给this.value！

所以其实，`target`就是`__ob__.value`。



最后是调用了`ob.dep.notify()`通知订阅该对象的订阅者！



换言之，使用`$set`操作对象，只有新增已经被劫持的且是$data后代的对象，才能通知订阅者。


&nbsp;


# `$del`的实现原理

[回到顶部](#大纲)

**path: vue/src/core/observer/index.js**

```typescript
/**
 * Delete a property and trigger change if necessary.
 */
export function del (target: Array<any> | Object, key: any) {
  // undefined || 值类型（原始类型）数据
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 删除元素
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  // warn: 不应该使用 $set 设置 vue实例 和 $data 的成员属性
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  // 要删除的对象属性不在当前对象上
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  // 对象没有被坚持
  if (!ob) {
    return
  }

  // 通知订阅者，它订阅的对象已经变动
  ob.dep.notify()
}
```

`$del`在一定程度上和`$set`很相似：

1. `if (process.env.NODE_ENV !== 'production' &&
   ​    (isUndef(target) || isPrimitive(target))`，不允许对未定义属性或值类型数据使用`$del`方法；
2. `if (Array.isArray(target) && isValidArrayIndex(key))`；
3. `if (target._isVue || (ob && ob.vmCount))`，不应该使用 $set 设置 vue实例 和 $data 的成员属性；
4. `if (!ob) `，同样无Observer，则不做通知和劫持操作，当然删除属性本就无必要劫持！
5. 同样可以用于操作对象，都是使用数组的变异方法`splice`；
6. 同样会通知订阅者当前数据变动。



对于数组而言，`$del`使用`target.splice(key, 1)`删除元素，且无第三个参数，即只能用于删除！

对于对象而言，`$del`则是使用`delete`操作符删除对象属性，并通知订阅者！


&nbsp;

# 总结

[回到顶部](#大纲)

- 使用`$set`新增对象属性与普通方式的区别在于，获取挂载在对象上的Observer实例（`__ob__`）对新增属性进行劫持，并且通知订阅了该对象的watcher；

- $set不但只可以新增对象属性，还可以修改对象原有属性，但不会通知订阅者；
- $set不能这是$data对象和vue实例；
- $set可以用来新增数组成员，效果等同与直接使用数组的变异方法`splice`, 但限定了删除元素个数，因此对于vue数组来说，它只能用来替换或新增元素；
- $del使用`splice(key, 1)`删除数组元素，仅能做删除操作；
- $del使用delete操作符删除对象属性，并在最后通知相关订阅者，无数据劫持。

[数组变异方法（Mutation Methods）的实现原理]:./数组变异方法（Mutation%20Methods）的实现原理.md