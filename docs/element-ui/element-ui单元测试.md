## 使用了那些库

在package.json可以看见的被用于单元测试的库

- ["chai": "^3.5.0"](),
- ["mocha": "^3.1.1"](),
- ["sinon": "^1.17.6"](https://github.com/sinonjs/sinon),
- ["sinon-chai": "^2.8.0"](https://github.com/domenic/sinon-chai),
- ["karma": "^1.3.0"](),
- ["karma-chrome-launcher": "^2.2.0"](https://github.com/karma-runner/karma-chrome-launcher),
- ["karma-coverage": "^1.1.1"](),
- ["karma-mocha": "^1.2.0"](),
- ["karma-sinon-chai": "^1.2.4"](),
- ["karma-sourcemap-loader": "^0.3.7"](),
- ["karma-spec-reporter": "0.0.26"](),
- ["karma-webpack": "^3.0.0"](),

测试框架：

- sinon-chai：sinon框架，包含chai断言库；
- mocha：mocka框架；

karma：在浏览器上运行测试代码
> 可以通过karma测试工具来实现在浏览器上运行测试代码，
> 甚至可以在浏览器上打断点来运行测试代码。