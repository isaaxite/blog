# 前言
关于`(x)`的作用
>匹配 'x' 并且记住匹配项，就像下面的例子展示的那样。括号被称为 捕获括号。
>
>模式/(foo) (bar) \1 \2/中的 '(foo)' 和 '(bar)' 匹配并记住字符串 "foo bar foo bar" 中前两个单词。模式中的 \1 和 \2 匹配字符串的后两个单词。注意 \1、\2、\n 是用在正则表达式的匹配环节。在正则表达式的替换环节，则要使用像 $1、$2、$n 这样的语法，例如，'bar foo'.replace( /(...) (...)/, '$2 $1' )。

关于`[^xyz]`的作用
>一个反向字符集。也就是说， 它匹配任何没有包含在方括号中的字符。你可以使用破折号（-）来指定一个字符范围。任何普通字符在这里都是起作用的。
>
>例如，[^abc] 和 [^a-c] 是一样的。他们匹配"brisket"中得‘r’，也匹配“chop”中的‘h’。

# 疑问
**关于`(x)`和`[^xyz]`的作用大致了解，那么`[^(xyz)]`会怎么样？**

# 正文
下面我们先来看一下3个例子：
```javascript
var str = "issac-issac-issac";
console.log("result0:", str.match(/(sa)/g));
console.log("result1:", str.match(/[^sa]/g));
console.log("result3:", str.match(/[^(sa)]/g));
```
以上代码分别打印的是什么呢？

- result0

很好明白，就像`(x)`描述中的
>![image](https://user-images.githubusercontent.com/25907273/35186647-3e0283f2-fe52-11e7-88f6-b492e1d5db1b.png)

- result1

`[^sa]`这个字符集不难明白，匹配str中不等于's'或'a'，即
```javascript
var strArr = [];
for(var i = 0; i < str.length; i++) {
  if(str[i] != 's' && str[i] != 'a') {
    strArr.push(str[i]);
  }
}
```
结果如无意外也是如此
>![image](https://user-images.githubusercontent.com/25907273/35186861-47318546-fe56-11e7-86cc-1aa634ea68e9.png)


- result2

高潮来了！会是什么？是返回除去"sa"意外的所有字符吗？我最初也是如此认为（我知道我是个渣比）。

然而不是！

>![image](https://user-images.githubusercontent.com/25907273/35186883-86eda2b4-fe56-11e7-9e31-85179e0eeeb8.png)

有没有疑问为什么没有“s”返回，“issac”中除了“sa”不是还有“i“，”s“，s”吗？

# 小结
根据结果来看原因，我只能认为[^xyz]这个反向字符集是以单个字符为单位，而不能以字符串作为一个匹配单位。


