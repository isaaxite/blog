# iOS移动端下focus()失效

##### 场景是这样：
我要做一个带输入框的页面，然后页面第一次进来是会弹出一个模态框，如下：



![](http://upload-images.jianshu.io/upload_images/2838289-5f300b8054daac90.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


##### 需求是这样子的：
点击模态框中的“输入香烟名称”收起模态框，直到模态框完全收起后，触发顶部输入框的focus事件，让这个input获得焦点弹起软键盘。

按常理也不难是吧：
```js
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            callback && callback.call(this);
            $(this).removeClass('animated ' + animationName);
        });
    }
});

$("#modal").animateCss("bounceOutUp", function(){
  $("#input").focus();
});
```
很简单的一段代码，在微信的模拟器上面还是没有问题，的确是起效，获得焦点的。但是真机上面测试就gg了，没有效果。
然后我是写了个button事件测试研究一下：
```htm
<button id="test">test</button>
```
```js
$("#button").on('touchstart', function() {
  $("#input").focus();
});
```
然后注册测试用例运行的结果是：在模拟器上面起效，在真机上面也起效。

最后想想是不是ios的奇特机制，然后用了安卓的机子测试，然后果不其然，安卓的机子是起效的，然后google了一下：
>my colleagues and I found that iOS will only allow focus to be triggered on other elements, from within a function, if the first function in the call stack was triggered by a non-programmatic event. In your case, the call to setTimeout starts a new call stack, and the security mechanism kicks in to prevent you from setting focus on the input.

>翻译：我和我的同事发现，iOS将只允许在其他元素上绑定函数来触发focus事件，如果第一个函数调用栈是由非编程触发的事件（这句不知道怎么翻译）。在你的案例中，调用setTimeout开始一个新的调用堆栈，IOS的安全机制开始阻止你触发input元素的focus事件

果断试了一下，将代码改成：
```js
$("#modal").animateCss("fadeOut");
$("#input").focus();
```
是的，确实是这样是，代码改成这样后无论是模拟器上移动端上（ios和安卓）都是可以让input获得焦点的。

#### 结论
**ios上只有用户交互触发的focus事件才会起效，而延时回调的focus是不会触发的，说得大佬粗点，你想在ios上focus事件起效就不能讲focus时间放在延时里面调用**
