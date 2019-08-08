## bin/gen-cssfile

## 前言

#### bin目录结构
```
bin
├── build-entry.js
├── build-locale.js
├── gen-cssfile.js
├── gen-indices.js
├── i18n.js
├── iconInit.js
├── new.js
├── new-lang.js
├── template.js
└── version.js
```

#### grn-cssfile.js源码

```js
var fs = require('fs');
var path = require('path');
var Components = require('../../components.json');
var themes = [
  'theme-chalk'
];
Components = Object.keys(Components);
var basepath = path.resolve(__dirname, '../../packages/');

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default';
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n';
  Components.forEach(function(key) {
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
    var fileName = key + (isSCSS ? '.scss' : '.css');
    indexContent += '@import "./' + fileName + '";\n';
    var filePath = path.resolve(basepath, theme, 'src', fileName);
    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});
```

## 这个gen-cssfile.js的作用是什么？
看文件名，猜他是用来生成或初始化css文件！
实际上是，初始化一个scss文件里的内容~
在elementUI的`/packages/theme-chalk/src/index.scss`，引入了一堆的组件样式：
```scss
@import "./base.scss";
...
@import "./footer.scss";
```
这些“@import”都不是手写的，都是这个脚本生成~
这个脚本的作用就是：初始化`/packages/theme-chalk/src/index.scss`文件需要引入的组件样式，既然是生成的，那么问题就来了，怎么控制需要生成什么内容？

```js
var Components = require('../../components.json');
Components = Object.keys(Components);
```
留意这两句！第一句引入了一个json，去看看这份json是什么内容：
```json
{
  "pagination": "./packages/pagination/index.js",
  ...
  "footer": "./packages/footer/index.js"
}
```
然后，结合上面的第二句代码，最后`Components`就是一个Array，元素是这个json的键值。

再看下面这段代码：
```js
Components.forEach(function(key) {
  ...
  indexContent += '@import "./' + fileName + '";\n';
  ...
});
const _path = path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css');
fs.writeFileSync(_path, indexContent);
```
遍历`Components`，组合引入语句，然后写入`_path`的文件，这个文件就是`/packages/theme-chalk/src/index.scss`

然后回答上面的问题，怎么控制生成的内容？在具体一点，怎么增删需要引入的组件？！

**通过增删`components.json`的元素！**