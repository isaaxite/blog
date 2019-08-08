## 前言
默认webpack是不会压缩css和js文件的

## 压缩文件
- 安装插件
```
npm i -D uglifyjs-webpack-plugin
```
- webpack配置文件
```javascript
// 引入文件
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
```
```javascript
plugins: [
  ...
  new UglifyJSPlugin(),
  ...
],
```
然后执行编译就可以亚搜哦js
