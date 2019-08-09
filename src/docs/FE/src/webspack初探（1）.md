# webspack初探（1）

## 0 前言
**已经安装nodejs**

## 1 配置webpack相关node脚本
- 初始化package.json文件
```
npm init
```
- 添加脚本
```
{
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
     "build": "webpack"
  },
  ...
}
```

- 使用
```
// 1
npm run watch

// 2
npm run build
```

## 1 开始
#### 安装webpack：
```
npm install --save-dev webpack
```
#### 新建webpack配置文件：
```
// 未试过
webpack --config webpack.config.js
```

#### 最简单的webpack配置文件：
```
var path = require('path');

module.exports = {
  entry: 'main.js',
  // 映射编译后主文件错误到源文件，方便定位错误
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

#### 基本webpack 插件安装：
##### 0 `HtmlWebpackPlugin`
动态生成index.html，当修改编译的入口、出口文件名时，可以响应地修改index.html中js文件的引入

- 安装命令
```
npm install --save-dev html-webpack-plugin
```
- webpack配置文件中添加：
```javascript
const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
    // 映射编译后主文件错误到源文件，方便定位错误
    devtool: 'inline-source-map',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

##### 1 `clean-webpack-plugin`
编译前清空/dist文件夹
- 安装命令
```
npm install clean-webpack-plugin --save-dev
```

- webpack文件的相应改动：
```javascript
const path = require('path');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
+     new CleanWebpackPlugin(['dist']),
    ],
    // 映射编译后主文件错误到源文件，方便定位错误
    devtool: 'inline-source-map',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

#### 加载样式文件
##### 0 import css文件
- 安装响应库
```
npm install --save-dev style-loader css-loader
```

- webpack配置文件改动：
```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
};
```

##### 1 import scss文件
- 在已经安装`引入css文件`依赖的前提下，还需要安装以下依赖：
```
// node-sass被sass-loader引用
npm install --save-dev sass-loader node-sass
```

- webpack配置文件的更新：
```javascript
module.exports = {
  ...
  module: {
    ...
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test:   /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
    ]
  }
};
```
引入文件：
```
import 'xxx.scss';
```

#### 优雅使用ES6
安装`babel-loader`将ES6编译成ES5

- 安装`babel-loader`依赖
```
npm install --save-dev babel-loader@8.0.0-beta.0 @babel/core@next @babel/preset-env@next
```

- webpack配置文件更新：
```javascript
module: {
  rules: [
    ...
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
    ...
  ]
}
```

#### 纯净css
使用postcss的autoprefixer插件自动补全css的兼容性样式，可以和预编译器（sass、less...）使用

- 安装命令：
```
npm i -D postcss-loader --save-dev
```

- webpack文件更新：
![](https://user-images.githubusercontent.com/25907273/32371487-07d45fb6-c05f-11e7-9cb3-ada98d9e8aec.png)

- 添加postcss配置文件
|– App
...
| |– webpack.config.js
| |– postcss.config.js
...
| 
```javascript
var autoprefixer = require('autoprefixer');
module.exports = {
  plugins: [
    autoprefixer({ browsers: ['last 4 versions'] })
  ]
}
```

