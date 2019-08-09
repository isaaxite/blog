# JavaScript对象的深复制

js的数据类型可以分为两大类：
- 值类型（原始类型）：
比如String、Number类型都是值类型。

- 引用类型：
比如Object、Array是引用类型。

简单说一下他们两者的区别：
最明显的区别就是赋值。值类型的赋值是真正的copy一份赋给新的变量的：
```
var a, b = "issax";
a = b;
a +="_coder";
console.log(a);  //issax_coder
console.log(b);  //issax
```
看上面的例子，将b赋值给a之后，a、b两个变量就是相互独立的，改变自身的值不会影响到对方，这就是值类型。

然后看看引用类型：
```
var obj_i, obj_ii = { name: 'issax' };
obj_i = obj_ii;
obj_i['career'] = 'coder';
console.log(obj_i);  //Object {name: "issax", career: "coder"}
console.log(obj_ii);  //Object {name: "issax", career: "coder"}
```
看到没有，将obj_ii的值赋给obj_i后，改变obj_i的内容，会连同obi_ii的内容也改变，这就是引用类型。引用类型的变量存储并不是内容本身，而是指向内容的一个指针，没错，你赋值的时候其实只是将这个指针赋值给了新变量，他们都指向同一个内容，为什么出现上面的情况就不言而喻了。

握草，我在说什么gui，我是来说对象的深复制的啊[捂脸]

复制又可以分为浅复制和深复制，看完上面例子，大概联想一下就知道什么是浅复制什么是什么深复制了，
平常的值类型的赋值过程就是深复制，而引用类型的赋值就是浅复制。

既然对象是引用类型，那么它平常的赋值过程就是浅复制了，但是啊，有时候对象也是需要深交的，握草，我说了什么gui，是深复制。

比如，前两天在做Vue，遇到一个需求，要按name来排序，奇数次click就排序，偶数次click就恢复原来的按更新时间排序。这Tm还不简单，每次都sort一下不就好了。真Tm这样做就sb了，尼玛你想一下，除了第一次排序是有意义的，第二三四五六七八……有什么意义，他们都是重复的，每次sort一下不是很浪费性能吗！那么就该将sort后的对象存储起来……
然后就gg了，对象是引用类型，一开始我直接赋值了，然后场面一度十分尴尬，数据根本不动[捂脸]；

要想属性一个一个的递归复制吗？然后我的对象是类似这样的：

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-8ebc5e3f66675099.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

握草，真递归复制就sb啦，好在想到个好办法，值类型是深复制的，这Tm将引用类型转成值类型不就o了吗[狂喜]
小二，上代码：
```
function deepCopy(sender){
  var temp = JSON.stringify(sender);
  return JSON.parse(temp);
}  
var obj_i, obj_ii = { name: 'issax' };
obj_i = deepCopy(obj_ii);
obj_i['career'] = 'coder';
console.log(obj_i);  //Object {name: "issax", career: "coder"}
console.log(obj_ii);  //Object {name: "issax"}
```

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-1affe55ffe762a7b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


各位观众老爷，装逼到此结束。


##### 追加
zepto.js 和 jQuery的深复制方法，$.extend(); 默认不是深复制
