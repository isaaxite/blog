# Re__从零开始的【comic_spider】《最简单的实现》(上)

<dic style="text-align: center;"><img src="https://user-gold-cdn.xitu.io/2019/3/15/1697ed7fdad379bf"/></div>
## 前言
一个最简单的漫画脚本最基本的功能是下载，但是在是下载之前还要做什么？是找资源！那么“搜索”功能也应该算在一个最简单漫画爬虫的基本功能。所以，接下来围绕这两个功能看看从一零开始的 [ic-comic-spider]！

ps：我们用于爬取漫画的站点确定为 [chuixue]

欢迎 [star] 和 [试用] yo！

## 正文

### 实现目标

```
# 下载漫画全本
icsdr http://xxx

# 搜索漫画
icsdr --search [comic name]
```

### 分析页面

#### 目录页面
我们以 [ONE-PUNCH MAN] 的目录页为例子。
目录页面的分析目标是：1. 获取漫画名；2. 获取漫画每章节的链接；

审查元素，可以找到漫画名的节点：


![](https://user-gold-cdn.xitu.io/2019/3/15/16980b5540568d7d?w=556&h=289&f=png&s=44420)

我们可以通过以下方式复制节点路径方便待会获取对应节点：

![](https://user-gold-cdn.xitu.io/2019/3/15/16980b46be1a8362?w=643&h=497&f=png&s=245704)

```
# 漫画名的节点路径
#intro_l > div.title > h1

# 目录章节节点路径
#play_0 ul > li > a
```

&nbsp;

#### 章节内漫画图片页
图片页就不能直接通过审查元素获取节点路径获取图片的资源链接了。图片的节点一般都不会直接在服务端渲染后，基本上都是在浏览器端渲染，因此我们直接用axios请求到的html文本是浏览器渲染前的，言外之意就是里面是没有图片的节点的！

那么，想要获取图片的资源链接我们就需要直接从源码中找图片链接的组成规则，当前这个网站也是如此！

现在我打开[ONE-PUNCH MAN第127话页面]，审查元素可以看到解析后的图片链接：

![](https://user-gold-cdn.xitu.io/2019/3/15/16980baba8759bac?w=799&h=93&f=png&s=37747)
根据这个渲染后的链接去源码里面找链接的组成方式：打开 `控制台` -> `source`，开始阅读源码找组合图片链接的逻辑，此处省略十年！

然后，以下是我找到的组合规则，并且封装成函数：

```js
const imgOrigins = ['http://2.csc1998.com/', 'http://img.csc1998.com/'];
const viewidThreshold = 519253;
/**
 * 获取图片origin
 * @param { number } viewId
 */
function getImgOrigin(viewId) {
  let origin;
  if (viewId >= viewidThreshold) {
    origin = imgOrigins[0];
  } else {
    origin = imgOrigins[1];
  }
  return origin;
}

/**
 * 获取图片链接的后半部分
 * @param { string } _doc html文本
 */
function getImgPaths(_doc) {
  const photosr = [];
  const packedMatcheds = _doc.match(/packed=\"(.*)\"\;/);
  const packed = packedMatcheds && packedMatcheds[1];
  if (packed) {
    const temp = Buffer.from(packed, 'base64').toString();
    eval(eval(temp.slice(4)));
    photosr.shift();
  } else {
    const photosrMatched = _doc.match(/photosr\[.+\] =\".*";/);
    if (photosrMatched) {
        eval(photosrMatched[0]);
        photosr.shift();
    }
  }

  return photosr;
}

/**
 * 组合img的origin和 paths
 * @param { string } _origin
 * @param { string[] } _paths
 */
function generateImgSrcs(_origin, _paths) {
    const srcs = _paths.map((imgPath) => {
        return url.resolve(_origin, imgPath);
    });
    return srcs;
}
```

&nbsp;

#### 搜索的分析

首先是先找到搜索的api是什么！

 ____
`控制台` -> `Network`，然后进行搜索，你就会发现这个搜索的api（大部分的站点也是这么找）

![](https://user-gold-cdn.xitu.io/2019/3/17/1698ad84e0d6e439?w=1455&h=736&f=png&s=245048)

那么搜索的api即是：
```
http://www.chuixue.net/e/search/?searchget=1&show=title,player,playadmin,pinyin&keyboard=[keywork]
```

&nbsp;

接下来就是分析结果列表

----
搜索结果的节点路径
```
#dmList > ul > li > dl > dt > a
```
这样就可以拿到搜索到的资源了！

&nbsp;

&nbsp;


### 实现下载
需要用到的npm包：
- [axios]：请求资源（获取页面html和下载漫画图片流）
- [cheerio]：将html文本转化成dom，方便提取目标资源链接

    主要用到的几个方法是：
    1. `.text( [textString] )`：获取节点文本
    2. `.attr([string])`：获取节点属性
    3. `.html([string])`：获取节点html文本
    4. `.eq([number])`：获取节点列表中的其中之一

- iconv-lite: 用于转码请求回来的html文本，主要是为了解决中文乱码问题

    这里补充说明如何知道html文本的编码。这里有两个方法：
    1. `控制台` -> `Element`:

    ![](https://user-gold-cdn.xitu.io/2019/3/15/16980cafbb81aadd?w=857&h=189&f=png&s=82304)


    2. `控制台` -> `Console`, 打印`document.characterSet`

    ![](https://user-gold-cdn.xitu.io/2019/3/16/1698605d762a9747?w=417&h=128&f=png&s=11534)



#### 获取目录资源

获取目录的dom对象

----
1. axios请求目录页面，获取html文本；
2. iconv-lite将html文本转码成utf-8解决中文乱码；
3. 将html文本转化成cheerio的dom对象；
```js
/**
 * 获取目录dom对象
 * @param {*} _url 
 */
function getCatalogDom(_url) {
  const reqOptions = {
    method: 'GET',
    url: _url,
    responseType: 'arraybuffer'
  };
  return axios.request(reqOptions).then((resp) => {
    const data = iconv.decode(resp.data, 'GBK');
    const doc = cheerio.load(data);
    return doc;
  }).catch((err) => {
    console.log(err);
  });
}
```


&nbsp;

获取漫画名字

----
漫画名字节点路径我们已经知道，使用刚刚拿到的dom对象，使用cheerio的`.text()`获取名字。
```js
/**
 * 获取漫画名字
 * @param { string } _doc
 */
function getComicName(_doc) {
  const selectorPath = '#intro_l > div.title > h1';
  return _doc(selectorPath).text();
}
```

&nbsp;


获取章节列表资源

____
使用上面找到的节点路径即可获取到章节的节点列表，然后使用`.eq`遍历配合`.attr`方法即可获取到章节的名字和链接。
```js
/**
 * 获取章节列表资源
 * @param { object } _doc 
 * @param { string } _catalogUrl 
 */
function getComicChaptes(_doc, _catalogUrl) {
  const { URL } = url;
  const origin = (new URL(_catalogUrl)).origin;
  const selectorPath = '#play_0 ul > li > a';
  const chapterEles = _doc(selectorPath);
  const list = [];
  for (let i = 0, len = chapterEles.length; i < len; i+=1) {
    const ele = chapterEles.eq(i);
    list.push({
      title: ele.attr('title'),
      url: url.resolve(origin, ele.attr('href'))
    })
  }
  return list;
}
```

&nbsp;

封装一下以上函数

----

```js
/**
 * 获取目录资源
 * @param { string } _catalogUrl
 */
function parseCatalog(_catalogUrl) {
  return getCatalogDom(_catalogUrl)
    .then((_doc) => {
      const comicName = getComicName(_doc);
      const catalogs = getComicChaptes(_doc, _catalogUrl);
      return {
        comicName,
        catalogs
      };
    });
}
```
然后我们只需调用这个`parseCatalog`函数即可获取到漫画的目录资源

![](https://user-gold-cdn.xitu.io/2019/3/16/16986209fbc199cb?w=607&h=321&f=png&s=56396)


&nbsp;

&nbsp;



#### 获取漫画图片资源

解析完目录之后，就是要获取到每个章节的图片支资源链接，这个也是站点极力想要保护的部分，或多或少都会做一些防盗链的措施，比如[chuixue]就把图片资源放列表用base64加密，然后将解密逻辑隐藏在其他文件，这样直接抓取漫画页就不能很容易地拿到图片链接。

上面我已经找到组合图片链接的逻辑，现在我们首先要做的是把html文本爬回来，然后正则匹配到我们需要的资源；

```js
/**
 * 获取章节的图片资源链接
 * @param { string } _chapterUrl 
 */
function getImageSrcList(_chapterUrl) {
  const imgSrcList = [];
  const reqOptions = {
    method: 'GET',
    url: _chapterUrl
  };
  return axios.request(reqOptions).then((resp) => {
    const doc = resp.data || '';
    const viewId = doc.match(/var viewid = \"(.*)\"\;/)[1];
    const origin = getImgOrigin(viewId);
    const imgPaths = getImgPaths(doc);
    const imgSrcList = generateImgSrcs(origin, imgPaths);
    return imgSrcList;
  })
}
```
现在我们就获取第127话的图片资源：
```js
(function __main() {
  parseCatalog(config.catalog)
    .then((_data) => {
      // 最后一章节（127话）
      const lastedChapter = _data.catalogs.pop();
      getImageSrcList(lastedChapter.url).then((imgSrcList) => {
        console.log(imgSrcList);
      });
    });
})();
```

![](https://user-gold-cdn.xitu.io/2019/3/16/1698643d33a10bc4?w=605&h=330&f=png&s=62062)

&nbsp;

&nbsp;




#### 下载资源


以上我们已经实现了一部分逻辑，已经可以拿到图片的资源链接，接下来我们只需要将图片下载回来就ok！

下面用递归实现对第127话漫画图片的下载（当然你也可以直接遍历，并在遍历的过程中直接发请求，让所有的下载一起并发，但是啊，请求得过于频繁怕不是会被禁了你ip？！）。

```js
(function _download(index) {
  const imgSrc = imgSrcList[index];
  if (imgSrc) {
    console.log('download:', imgSrc);
    const format = imgSrc.split('.').pop();
    const picIndex = index + 1;
    const fileName = picIndex + '.' + format;
    const savePath = path.join(process.cwd(), fileName);
    downloadPic(imgSrc, savePath).then(() => {
      _download(++index);
    }).catch((error) => {
      console.log(error.message);
    });
  } else {
    console.log('finish chapter!');
  }
})(0);
```

![](https://user-gold-cdn.xitu.io/2019/3/17/1698acf4f5f7bf36?w=592&h=609&f=png&s=148338)

下载部分到此就基本结束，接下我们在实现搜索的逻辑，然后就可以进入优化的阶段~

&nbsp;

&nbsp;

### 搜索逻辑的实现
1. axios请求搜索的api，获取搜索到的html文本
2. 解析html文本，获取到搜索的结果

```js
/**
 * 站内搜索漫画
 * @param { string } keyword 
 */
function search(_keyword) {
  console.log('search: ' + _keyword);
  const selectorPath = '#dmList > ul > li > dl > dt > a';
  const keyword = encodeText(_keyword);
  const origin = 'http://www.chuixue.net/';
  const searchUrl = 'http://www.chuixue.net/e/search/?searchget=1&show=title,player,playadmin,pinyin&keyboard=' + keyword;
  const reqOptions = {
    method: 'GET',
    url: searchUrl,
    responseType: 'arraybuffer'
  };
  const promise = axios.request(reqOptions).then((resp) => {
    const html = iconv.decode(resp.data, 'GBK');
    const doc = cheerio.load(html);
    const eles = doc(selectorPath);
    let searchList = [];
    for (let i = 0, len = eles.length; i < len; i += 1) {
      const ele = eles.eq(i);
      const name = ele.attr('title');
      const src = url.resolve(origin, ele.attr('href'));
      searchList.push({ name, src });
    }
    searchList = searchList.filter((item) => {
      return item.name;
    });
    return searchList;
  });

  return promise;
}
```
看上面的实现逻辑，你在函数的第三行你会发现这么一个函数`encodeText`，这个不是语言自带的函数，而是自己封装的，这个转码函数是个什么东西？？？

```js
/**
 * 转码搜索关键字
 * @param { string } _text 
 */
function encodeText(_text) {
  const buf = iconv.encode(_text, 'GBK');
  const hex = buf.toString('hex');
  const chars = hex.split('');
  let text = '';
  for (let i = 0, len = chars.length; i < len; i += 2) {
    const char = chars.slice(i, i + 2).join('');
    text += `%${char.toUpperCase()}`;
  }
  return text;
}
```

![](https://user-gold-cdn.xitu.io/2019/3/17/1698b094dc233ba0?w=397&h=79&f=png&s=10388)

你会发现转码后的结果和`urlencode`的结果很像，但其实不是~，你打开控制台的`Network`你会发现

![](https://user-gold-cdn.xitu.io/2019/3/17/1698b0d4c47af091?w=940&h=468&f=png&s=93190)

搜索的关键字确实是被转码了，但是又不是被urlencode了，但是你用encode试下你就会发现：

![](https://user-gold-cdn.xitu.io/2019/3/17/1698b0ef6bc2ba48?w=297&h=47&f=png&s=7809)

并不一样~

这是为什么？

假如你对此感兴趣你去看看这篇[文章]（[备用文章链接]）。你去看这部分搜索的源码你会发现，代码并没有做任何的转码操作，仅仅只是提交了表单！言外之意这个转码的过程是浏览器做的~

回归正题，搜索的实现结果：

![](https://user-gold-cdn.xitu.io/2019/3/17/1698b15d3f3825c0?w=517&h=82&f=png&s=14728)

&nbsp;

&nbsp;


### 优化脚本

回一下我们的实现目标：
```
# 下载漫画全本
icsdr http://xxx

# 搜索漫画
icsdr --search [comic name]
```
做成命令行执行~

这时候我们就需要[commander]这个库！

```js
#!/usr/bin/env node
 
const spider = require('./index');
const program = require('commander');

const config = {
  isSearch: false,
  isDownload: true,
  comicName: '',
  downloadLink: ''
};

program
  .version('0.1.0')
  .option('-s, --search [comic name]', 'Search Comic', function(comicName) {
    config.isSearch = true;
    config.isDownload = false;
    config.comicName = comicName;
  })
  .parse(process.argv);

(function __main() {
  if (config.isDownload) {
    if (!config.downloadLink) {
      config.downloadLink = process.argv.pop();
    }
    spider.download(config.downloadLink);
  } else {
    spider.search(config.comicName);
  }
})();
```

此时此刻你已经可以使用命令行执行脚本：
```
# 下载漫画
node icsdr.js [catalog link]

# 搜索漫画
node icsdr.js -s [comic name]
```
已经很接近我们的目标，这个时候我们还需要修改一下我们的package.json（如果没有就npm init）

下面关键且必须的部分：
```
"name": "icsdr",
...
// 指明脚本执行文件
"bin": {
    "icsdr": "./icsdr.js"
},
```
你想要直接使用icsdr命令，有好几个方法懂得自己然懂。
- 写好发布到npm源上，然后全局安装就好
- 本地调试可以使用`npm link`
- 笨点可以直接使用路径全局安装：`npm i [absolute-path/relative-path] -g`

然后你就可以：

![](https://user-gold-cdn.xitu.io/2019/3/18/1698fa197148da0d?w=715&h=85&f=png&s=16931)

![](https://user-gold-cdn.xitu.io/2019/3/18/1698fa258e815fe1?w=715&h=631&f=png&s=151206)


![](https://user-gold-cdn.xitu.io/2019/3/18/1698fa343a9bef6c?w=1440&h=900&f=png&s=1054730)

当然这里为了演示只是下载了第127话！

本次代码例子已经上传到[我的github]，可以自行食用

欢迎star我的[ic-comic-spider]


## 小结
1. axios获取html文本；
2. cheerio转化html文本cheerio的dom和正则匹配获取所需资源；
3. axios获取图片流资源，fs保存文件；
4. commander将脚本命令行化；
 
以上简单说了一下comic spider的基本实现，下一篇将基于这个“基本实现”扩展一下下载相关的功能！

[ONE-PUNCH MAN]: http://www.chuixue.net/manhua/552/
[ONE-PUNCH MAN第127话页面]:http://www.chuixue.net/manhua/552/440937.html
[ic-comic-spider]: https://github.com/isaaxite/ic-comic-spider
[chuixue]: http://www.chuixue.net/manhua/552/
[axios]: https://github.com/axios/axios/blob/master/README.md
[cheerio]: https://github.com/cheeriojs/cheerio/blob/master/Readme.md
[star]: https://github.com/isaaxite/ic-comic-spider
[试用]: https://www.npmjs.com/package/ic-comic-spider
[文章]: http://xml-nchu.blogspot.com/p/url.html
[备用文章链接]: http://www.ruanyifeng.com/blog/2010/02/url_encoding.html
[commander]: https://www.npmjs.com/package/commander
[我的github]: https://github.com/isaaxite/blog/tree/master/examples/ic-comic-spider/basicFeature
