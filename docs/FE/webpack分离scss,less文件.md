## 前言

## 0 分离scss文件
- 安装插件
```

```

- webpack配置更新
```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      ...
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
          use: ['css-loader', 'sass-loader']
        })
      }
      ...
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
    //如果想要传入选项，你可以这样做：
    //new ExtractTextPlugin({
    //  filename: 'style.css'
    //})
  ]
}
```
如上已经可以将scss文件打包并且分离出来，打包成`style.css`文件。

- postcss自动补全css兼容前缀
```javascript
use: ['css-loader', 'postcss-loader', 'sass-loader']
```
这里要注意，`postcss-loader`必须在`sass-loader`前，不然是没有效的，以下是如上配置打包的：
![image](https://user-images.githubusercontent.com/25907273/32639003-6391e864-c587-11e7-80b6-b5e5c3a60e3a.png)

而用下面的配置则是打包到下面的文件
```javascript
use: ['css-loader', 'sass-loader', 'postcss-loader']
```
![image](https://user-images.githubusercontent.com/25907273/32638967-3b792284-c587-11e7-92b8-2eedf2d413a3.png)
很明显，css样式并没有添加前缀


