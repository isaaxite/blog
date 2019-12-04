单元测试命令：`npm run test`

package.json中相关描述：

```json
"lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
"build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
"test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run"
"test:watch": "npm run build:theme && karma start test/unit/karma.conf.js",
```

测试文件入口：test/unit/karma.conf.js

```js
const webpackConfig = require('../../build/webpack.test');

module.exports = function(config) {
  const configuration = {
    browsers: ['Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    client: {
      mocha: {
        timeout: 4000
      }
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
```

`files: ['./index.js'],`, 说了会加载 `test/unit/index.js` 的内容：

```js
// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind');
require('packages/theme-chalk/lib/index.css');

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
// 引入../../src下所有文件名不是main的js文件
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/);
srcContext.keys().forEach(srcContext);
```

关于context的说明：


> 可以使用 require.context() 方法来创建自己的（模块）上下文，这个方法有 3 个参数：
>
> 要搜索的文件夹目录
> 是否还应该搜索它的子目录，
> 以及一个匹配文件的正则表达式。
> ```js
>
>  require.context(directory, useSubdirectories = false, regExp = /^\.\//)
> 
>  require.context("./test", false, /\.test\.js$/);
>  //（创建了）一个包含了 test 文件夹（不包含子目录）下面的、所有文件名以 `.test.js` 结尾的、能被 require 请求到的文件的上下文。
> 
>  require.context("../", true, /\.stories\.js$/);
>  //（创建了）一个包含了父级文件夹（包含子目录）下面，所有文件名以 `.stories.js` 结尾的文件的上下文。
>  
> ```
> > require.context模块导出（返回）一个（require）函数，这个函数可以接收一个参数：request 函数–这里的 request 应该是指在 require() 语句中的表达式
> 
> 导出的方法有 3 个属性： resolve, keys, id。
> 
> resolve 是一个函数，它返回请求被解析后得到的模块 id。
> keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的请求组成。
> id 是上下文模块里面所包含的模块 id. 它可能在你使用 module.hot.accept 的时候被用到

功能函数

```js
/**
 * 回收 vm
 * @param  {Object} vm
 */
export const destroyVM = function(vm) {
  vm.$destroy && vm.$destroy();
  vm.$el &&
  vm.$el.parentNode &&
  vm.$el.parentNode.removeChild(vm.$el);
};

const createElm = function() {
  const elm = document.createElement('div');

  elm.id = 'app' + ++id;
  document.body.appendChild(elm);

  return elm;
};

/**
 * 创建一个测试组件实例
 * @link http://vuejs.org/guide/unit-testing.html#Writing-Testable-Components
 * @param  {Object}  Compo          - 组件对象
 * @param  {Object}  propsData      - props 数据
 * @param  {Boolean=false} mounted  - 是否添加到 DOM 上
 * @return {Object} vm
 */
export const createTest = function(Compo, propsData = {}, mounted = false) {
  if (propsData === true || propsData === false) {
    mounted = propsData;
    propsData = {};
  }
  // 创建一个空元素的div元素，id="app<number>"，并且作为body子元素入栈body子元素栈
  const elm = createElm();
  // 将组建作为一个options，使用entend方法，创建一个vue的子类
  const Ctor = Vue.extend(Compo);
  // 注入props，创建实例
  return new Ctor({ propsData }).$mount(mounted === false ? null : elm);
};
```

mocha的package.json

```json
  "devDependencies": {
    // ...
    "expect.js": "^0.3.1",
    // ...
  }
```

mocha.js使用[mocha](https://github.com/Automattic/expect.js)