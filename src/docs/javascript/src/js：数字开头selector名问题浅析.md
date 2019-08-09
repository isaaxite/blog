# js：数字开头selector名问题浅析

### 前言

朋友问起我一些关于怎么查找节点的问题，我下意识就给他推荐了`querySelector`[`All`]，并自鸣得意地说，灵活方便，堪比jq的选择器查找，（在我看来也确实如此）:flushed:。

没错多久就出问题了，光速打脸:pensive:

![image](https://user-images.githubusercontent.com/25907273/34355060-9dcfbb18-ea6d-11e7-816b-e135c0960dbd.png)

虽然他的id名起得也是很迷人:sweat_smile:。

----



### 问题是什么？

他跟我说，出问题部分元素是动态插入的，静态的就没有问题，其实不是，就算是静态的元素也会出问题
最开始我以为是`querySelector`本身的问题，因此专门去[JS BIN](http://jsbin.com/)试了一下，如下：

```javascript
var div = document.createElement('div');
div.id = "coder";
div.textContent = "issac_宝华";
document.body.appendChild(div);

var idName = document.querySelector("#coder").id;
console.log(idName);
```

![image](https://user-images.githubusercontent.com/25907273/34354894-7e364d68-ea6c-11e7-9922-74f7565b4b14.png)

不论我是用`createElement`和`innerHTML`都是没有问题。我质疑说，是不是你id名写错了。然后继续打脸:scream:，而且就算是id名写错的也不会报错，最多就是返回个空，一脸懵逼，难道真的不行。



据他说，用我推荐的`querySelector`会有问题，但是用他自己代码的`getElementById`就没有问题，还有那么邪门:zap:

难道是id名的问题？！我直接叫他复制id名给我试试。



如果有人认为是兼容性的问题，那就大可放心了：

[Can I Use querySelector/querySelectorAll ?](https://caniuse.com/#search=querySelector)

----



### 测试

马蛋:new_moon_with_face:，竟然还真是……

![image](https://user-images.githubusercontent.com/25907273/34355152-42f63bd0-ea6e-11e7-90a4-56a72a15c4c9.png)

过分了，过分了，不会是因为id名太长吧！测试了，不是的

![image](https://user-images.githubusercontent.com/25907273/34355199-81141c70-ea6e-11e7-9ded-7f4bf7a7bc67.png)

变态到这样也是没有问题的，测试到这里也该看出端倪了，

**是不是因为数字开头！**

别说，还真是……

![image](https://user-images.githubusercontent.com/25907273/34355237-c8d97f00-ea6e-11e7-8aec-8c9d5e24e97a.png)

最神奇的是，用`getElementById`就算使用数字开头的名字也是没有问题的，**Orz**

![image](https://user-images.githubusercontent.com/25907273/34355328-60d98796-ea6f-11e7-92d5-5303439b52d8.png)

爽到没有:joy:！


另外，他说的静态元素就没有问题，我也专门去试了一下，是有问题的
![image](https://user-images.githubusercontent.com/25907273/34355526-f04df1e0-ea70-11e7-95f0-ce9628ce690a.png)

----



### 最后

就算是`getElementById`有更强的容错，但是我还是会继续用`querySelector`，毕竟那么生儿为人20几年没有试过用过如此怪异的selector name。:eyes:
