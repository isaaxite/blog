# Css利器calc()方法

## 前言
首先，看一下Can I Use中对改方法在各个浏览器支持度的描述
![image](https://user-images.githubusercontent.com/25907273/37652514-c18b4b80-2c76-11e8-886f-313f6cfb05de.png)

看到这里我想我可以比较放心地使用了，特别是在移动端。

## 概述
>CSS函数calc()可以用在任何一个需要`<length>`、`<frequency>`, `<angle>`、`<time>`、`<number>`、或`<integer>`的地方。有了calc()，你就可以通过计算来决定一个CSS属性的值了。

你还可以在一个 calc() 内部嵌套另一个 calc() ，里面的 calc() 会被简单地视为加了括号。 

该概述来自于MDN

## 基本用法
```css
div{
  /* property: calc(expression) */
  width: calc(100% - 80px);
}
```
其实看到这个例子我就很惊喜了，立马就想到在web开发过程中常遇到的一个情况：**footer贴底**，稍后详述。先来看看语法。

其实从上面例子大可管中窥豹，触类旁通，举一反三，`calc`相当一个执行环境用来执行css中的四则运算。


>该表达式可以使用以下运算符任意组合（使用正常的运算符优先级顺序）。
>
>\+
>加法
>\-
>减法
>\*
>乘法，乘数中至少要有一个是 <number> 类型的
>/
>除法，被除数（/右面的数）必须是 <number> 类型的
>表达式中的操作数可以使用任意语法种类的长度。如果你愿意，你可以在一个表达式中混用多种不同的长度单位。在需要时，你还可以使用小括号来调整计算顺序。

![image](https://user-images.githubusercontent.com/25907273/37653057-8b04eea2-2c78-11e8-8c21-2dc990676bea.png)

## 说说footer贴底问题
然后，再说回**footer贴底**的问题。
比如下面这个页面，可以看到底部是有个页脚的，在nei内容饱满的时候，footer不需要做什么特殊处理，甚至，footer容器甚至可以不写什么样式，直接放在最后就好，反正内容已经足够产生纵向滚轴。
![image](https://user-images.githubusercontent.com/25907273/37653124-c28fd65c-2c78-11e8-9d7b-1cf2ae895f05.png)

但是，一旦内容不足以让视窗产生滚轴，footer就不能保证贴底，比如下面的页面
![image](https://user-images.githubusercontent.com/25907273/37653374-a66605f4-2c79-11e8-8406-8542c88c1a66.png)
就会出问题了。当然，会有跟多其他的方法实现，比如容器一个`min-height: 100%;padding-bottom: xxx;`然后footer相对该容器定位到底部， 或者使用绝对定位将页面划分成内容区和footer区域。

但当我看到calc这个方法我脑子就飞过一个解决方案：
```html
<body>
  <main></main>
  <footer></footer>
</body>
```
```css
main{ min-height: calc(100% - 200px); }
footer{ height: 200px; }
```
是不是用很少的代码就实现了，有没有爽到，当然我还没有尝试这样的写法，只是灵光一闪。
