# toggleAnimate
- 基于Animate.css、zepto.js/jQoery的css动画切换组件。

- [https://issaxite.github.io/lib/toggleAnimate/](https://issaxite.github.io/lib/toggleAnimate/)

# 目的
- 解决两个不同Animate.css的连贯使用；
- 解决使用一个html组件实现数据切换；
- 解决两个Animate切换过慢的问题（Animate.css动画默认是1000ms完成）。

# 例子
- 最简单例子
```js
var $text = $("#animationSandbox");

$testBtn.on('click', function(){
  var enterClass = "bounceOutLeft";

  $text.toggleAnimate({
    enterClass: enterClass, // 首个动画
  });
});
```
- 修改切换时间，默认300ms
```js
var $text = $("#animationSandbox"),
    $testBtn = $("#test")
    $enterClass = $("#enterClass select"),
    $leaveClass = $("#leaveClass select"),
    $delay = $("#delay select");

$testBtn.on('click', function(){
  var enterClass = "bounceOutLeft",
      leaveClass = "bounceInRight",
      delay = 300;  

  $text.toggleAnimate({
    delay: delay, // 两个动画切换的延时
    enterClass: enterClass, // 首个动画
    enterClassCallback: function(){
      // 首个动画完成时调用（1000ms后回调，延时由Animate.css的演示决定）
    },
    callback: function(){
      // 首个动画执行时回调
    },
    leaveClass: leaveClass, // 第二个动画
  });
});
```
- 完成参数
```js
$ele.toggleAnimate({
    delay: delay,   // 动画切换时间，缺省300ms，不应大于1000ms
    enterClass: enterClass, // 首个动画类名
    enterClassCallback: function(){ // 可选 
        // 首个动画完成后回调 
    },
    callback: function(){   // 可选 
        // 首个动画执行时回调 
    },
    leaveClass: leaveClass, // 可选 
});
```

# 使用场景
- 在编写轮播组件的时候，一般有多个轮播item。但是，使用该(小小)库，可以只是用item，然后在首个动画完成时（消失的时候），使用ViewModel对改item进行数据更新。

