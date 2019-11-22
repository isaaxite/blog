
欢迎（begging）star项目 [vue-dev-debugger源码](https://github.com/isaaxite/vue-dev-debugger)!

欢迎使用（疯狂下载）[vue-dev-debugger](https://www.npmjs.com/package/vue-dev-debugger)！

# 大纲

- [搭建一个最简单的node服务器](#搭建一个最简单的node服务器)
- [命令式创建http服务](#命令式创建http服务)
- [总结](#总结)

&nbsp;

# 搭建一个最简单的node服务器

[回到顶部](#大纲)

首先，使用 `http` 模块创建一个服务，监听一个端口

```js
var http = require('http');
var server = http.createServer(function (request, response) {
  // 处理逻辑
}).listen(8080);
```

这样就可以从浏览器通过访问localhost:8080，执行上面代码的函数！

在回调中，可以对请求进行响应，`request`可以拿到请求的信息，`response` 则是可以对请求进行响应，即想浏览器回包。
我们的目标是给vue开发调试用，细化一下需求：

1. vue调试用请求不外乎2种文件：i. javascript文件；ii. html文件。请求的url对于我们来说就是重要信息，`request.url`；
2. 访问的不同文件需要向浏览器发送不同的 [Content-Type](https://www.iana.org/assignments/media-types/media-types.xhtml) 头信息，浏览器根据不同的`Content-Type`对不同的响应资源进行处理！javascript文件需要写的`Content-Type`是：`application/javascript`；html文件需要写的`Content-Type`是：`text/html`。
3. 既然是处理文件，就要读取文件，需要引入`fs`模块，需要使用url信息读取文件，就需要解析url，引入`url`模块；



接下来处理 `createServer` 的回调。

```js
var fs = require('fs');
var url = require('url');
var http = require('http');

var server = http.createServer(function (request, response) {
  // 处理逻辑
  var data;
  var respMsg = '';
  var urlInfo = url.parse(request.url);
  var rootDir = './';
  var filePath = path.join(rootDir, urlInfo.pathname);
  try {
    if (fs.existsSync(filePath)) {
      // 回包数据
      data = fs.readFileSync(filePath, { encoding: 'utf8' });
      response.write(data);

      // 根据文件类型不同写 Content-Type
      var contentType = ''
      if (filePath.endsWith('.js')) {
        contentType = 'application/javascript';
      } else if (filePath.endsWith('.html')) {
        contentType = 'text/html';
      } else {
        throw new Error('illegal file format')
      }
      headers['charset'] = 'UTF-8';
      headers['Content-Type'] = contentType;
      response.writeHead(200, headers);
    } else {
      throw new Error('file not exist');
    }
  } catch (error) {
    respMsg = error.message;
    response.writeHead(404, {'Content-Type': 'text/html'});
  }

  response.end(respMsg); 
}).listen(8080);
```

以上代码对`request.url`进行了解析，得到文件路径，读取的文件并发送给浏览器。根据不用文件类型写不同的`Content-Type`。做了一定的错误处理！


&nbsp;

# 命令式创建http服务

[回到顶部](#大纲)

上一小节建议地创建了一个httpServer，算是这个小项目的核心代码，接下来对其进行一些修饰：

1. 根目录改成可配置，毕竟不好直接将整个vue的项目复制的当前这个项目下，而且当前这个项目是要做成一个npm包的！
2. 端口可配置，根据情况不同，很可能8080端口早已被占用。
3. 命令执行，方便配置。

### 添加命令行

使用命令创建httpServer，引入一个命令行库：[commander](https://www.npmjs.com/package/commander)。如下设置我们需要的命令：


path: vue-dev-debugger/bin/index.js
```js
#!/usr/bin/env node

var program = require('commander');
// 默认配置
var conf = {
  port: 8087,
  rootDir: process.cwd(),
};

program
  .option('-p, --port <number>', 'set port', function(val) {
    conf.port = val;
  })
  .option('-r, --root <path>', 'set root dir', function(_path) {
    const rootPath = path.resolve(_path);
    if (fs.existsSync(rootPath)) {
      conf.rootDir = rootPath;
    } else {
      console.error(['unvalid path: ', _path].join(''));
    }
  })
  .parse(process.argv);
```

**注意：文件最上面的这句话 `#!/usr/bin/env node` 很重要!**

> 配置#!/usr/bin/env node, 就是解决了不同的用户node路径不同的问题，可以让系统动态的去查找node来执行你的脚本文件 [reference](https://juejin.im/post/5cb93cd651882578b148c637)


如是者，以下命令配置：

1. 端口：node bin/index.js -p 8080
2. 根目录：node bin/index.js -r ./

接下来间比较简单了！

只需要将创建httpServer的代码封装一下，读取配置执行就好

path: vue-dev-debugger/src/server.js
```js
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var server = {
  rootDir: './',
  init: function(options) {
    var server = http.createServer(function (request, response) {
      // 关键的处理逻辑，此处沈略一万字...
    });

    return server;
  }
};
module.exports = server;
```

再回到 `vue-dev-debugger/bin/index.js` 中，引入server.js，读取配置调用init方法就好！

```js
#!/usr/bin/env node

var program = require('commander');
var Server = require('./server');
// 默认配置
var conf = { /* 配置 */};

program
  .option('-p, --port <number>', 'set port', function(val) {
    // ...
  })
  .option('-r, --root <path>', 'set root dir', function(_path) {
    // ...
  })
  .parse(process.argv);

Server.init({
  rootDir: conf.rootDir
}).listen(conf.port);
```

最后设置下package.json
```json
  "m`ain": "./src/vder.js",
  "bin": {
    "vder": "./bin/index.js"
  },`
```

```shell
> npm login
> npm publish
```
完成！！！


然后，`npm i vder -g`之后，就可以愉快地使用这个简单到不行的命令行工具：

```npm
vder -p 8080
```

&nbsp;

# 总结

[回到顶部](#大纲)

- 创建一个简单的httpServer，最基本需要的是http模块，调用`http.createServer`创建服务；
- `http.createServer`方法的回调参数`request`读取请求信息；
- `http.createServer`方法的回调参数`response`对请求做相应，写不同的响应头信息；
- 对不同的文件使用不同的`content-type`;
  