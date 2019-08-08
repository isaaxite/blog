### 0-前言
最近思考很多，也不能说最近，其实一直在想，怎么才能提供自己的学习效率，加快自己的步伐。正如某人说的，现在不缺程序员，缺的是优秀的程序员，但凡是热爱程序的猿，都有一颗热切提高自我，成为自己眼中，别人眼中优秀猿的心。进步需要不断地吸收新知识，不断实践深化知识，但是二者怎么平衡以达到最大化效率就见仁见智。不断不说，我最近实在是花太多太多时间在编程上，反而缺少了，吸收新知识的行为。大量重复性工作一定程度上深化了我的专业知识，但是你做一百次一万次1+1，你最后也只会1+1=2。anyway，我只想说我要好好每天下班多花时间做自己的事，多学有趣的知识，让自己保持对编程的热情，而不是下班继续写公司的业务代码（当然我在公司代码中也是有很多乐趣，毕竟我是个懂得在苦中作乐的人，公司代码没有，我就创造 ）。但公司的代码毕竟是公司的代码，我要我自己的，哈哈。

### 1-获取issue列表
最近开始在github上，利用issue写blog，最开始是看到一篇github的文章，发现issue竟然还能用来写blog，觉得实在是很有趣，不知不觉自己就开始，发现什么问题就往issue上写，生怕过阵子就忘记。然后觉得越发有趣，就打算折腾一下，就issue作为自己的数据库，将issue展示在自己的blog上（这也是当时看到的一种github issue的玩法，[传送门](https://github.com/eyasliu/blog/issues/2)）

github提供了很多的api，其中就有关于issue的api，现在我也是仅仅会用那么一点点，多点都不会，看github的api文档我也是看的不是很懂，最后也就通过各种的google，找到了窍门，下面来说一下，怎么获取目标项目的issue列表。
- 基本使用
```
// api
https://api.github.com/repos/:username/:repository/issues
```
上面是最基本的api链接，比如我的：
```
// api
https://api.github.com/repos/issaxite/issaxite.github.io/issues
```
[直接浏览器访问](https://api.github.com/repos/issaxite/issaxite.github.io/issues)，会返回一串很长很长的json，默认会返回30条issue，每条issue都包含了很多的内容，都是一目了然，一看就知道是什么数据，然后，再说一下怎么按需的地返回需要的json，关于参数，我暂时也不知道在哪里可以看到文档，看官网的api文档，并没有说到一下的几个参数。这个几个参数是我研究别人的代码看到的，实践过确实有效，附上我研究的代码[github项目](https://github.com/wuhaoworld/wuhaoworld.github.com/blob/master/app.js)
```
page: [int], // 当前页
per_page: [int] // 获取的条数
```
这两个参数可以用get的方式带上
```
// api
https://api.github.com/repos/issaxite/issaxite.github.io/issues?page=1&per_page=10
```
**ps：默认返回open的issue**

&nbsp;
-----

- 增加获取访问上限
据说，使用匿名的方式请求api，每天只能访问60次，假如你觉得你访问的频数会比较大（你就继续骗自己吧）你可以通过access_token来请求issue的api，[上限是多少？](#)
首先是获取access_token，你需要进入[传送门](https://github.com/settings/tokens)添加access_token
![image](https://user-images.githubusercontent.com/25907273/32739879-bf39d1d6-c866-11e7-99c8-b49518d96e21.png)
填描述，基本勾选repo就够。
![image](https://user-images.githubusercontent.com/25907273/32739912-dd09ae7a-c866-11e7-9966-d36ca270c37a.png)
然后就可以获取access_token。

然后接下来，在api上带上access_token就好
```
https://api.github.com/repos/issaxite/issaxite.github.io/issues?access_token=<access_token>&page=1&per_page=10
```

### 小结
按需获取issue，api请求地址
```
https://api.github.com/repos/issaxite/issaxite.github.io/issues?[access_token=<access_token>]&page=<page>&per_page=<per_page>

```
