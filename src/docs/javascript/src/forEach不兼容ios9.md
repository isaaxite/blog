# forEach不兼容ios9

![image](https://user-images.githubusercontent.com/25907273/33612860-e3549f0c-da0d-11e7-90ea-cf9311f57a6d.png)

### 前言
前天在做一个活动，也是上线了，在公司大部分手机上都测试过，都没有发现什么问题。最终上线也确实没有什么大问题，只是，只是，一个隐藏得很深的同事的手机出现了问题，页面从一开始就没有加载出来，什么都没有。

### debug
打开微信开发工具，console并没有跑出任何异常，然后在其他人和我的手机上也是没有问题。基本确定不是范围性的bug了，只有该同事的手机出现问题，并且在微信开发工具也没有抛出异常，那么，很大可能就是兼容性问题。

然后，我去查看了该同事的手机版本。是ios9.0+，基本确定是兼容性问题了。

但是，在开发微信开发工具我找不到是哪一端代码出现了兼容性的bug。

忽然想起之前在用的一个代理工具，虽然不是很稳定[捂脸]：[spy-debugger](https://github.com/wuchangming/spy-debugger)

可以在pc端看到移动端的输出，这里就不贴图了，我是在后再补这文章的。

然后，发现是forEach抛出的异常，最终我是使用for来代替forEach:
```javascript
for (let index = 0; index < imgs.length; index++) {
  const item = imgs[index];
  ...
}
```

### 向下兼容
为了向下兼容，可以为Object对象添加forEach原型方法：
```javascript
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
```

[向下兼容代码来源是MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

### 导航
- [主页](https://issaxite.github.io)
- 上一篇：[多层元素实现的委托](https://github.com/issaxite/issaxite.github.io/issues/89)
