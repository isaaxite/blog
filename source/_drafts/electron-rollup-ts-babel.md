---
title: electron+rollup+ts+babel
excerpt: electron+rollup+ts+babel
date: 2024-09-03 14:43:10
tags:
categories:
---
# electron

electron 的基本环境配配置：目前了解的有，自带chromium（本版未深入了解），自带nodejs运行时

---

main.js（不固定文件名） 是入口文件。main 文件引入index.html页面布局。index.html引入renderer.js（页面交互和页面渲染）和style.css（样式文件）。

main可选引入preload.js（具体作用未明，目前知道它可作为main和renderer的通信中转站）。

关于 preload，官方的说明：

>[什么是预加载脚本？](https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-preload#%E4%BB%80%E4%B9%88%E6%98%AF%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC)
>
>Electron 的主进程是一个拥有着完全操作系统访问权限的 Node.js 环境。 除了 [Electron 模组](https://www.electronjs.org/zh/docs/latest/api/app) 之外，您也可以访问 [Node.js 内置模块](https://nodejs.org/dist/latest/docs/api/) 和所有通过 npm 安装的包。 另一方面，出于安全原因，渲染进程默认跑在网页页面上，而并非 Node.js里。
>
为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 **预加载** 的特殊脚本。

---

main 和 index 是隔离的，因此由index引入的renderer也是与main隔离。renderer与main通信需要借助preload

## 快捷键

在 main 用使用[electron提供的接口实现](https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-preload#%E4%BB%80%E4%B9%88%E6%98%AF%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC)。当前项目设置的是窗口顶部横向的菜单，菜单项可以设置键盘快捷键


## 读取本地文件

main是有nodejs运行时的，因此可使用nodejs的api。读取的文件内容要在renderer中渲染。需要使用preload（ipc），让renderer拿到main读取的文件内容。

首先在main中暴露一个[ipc handler](https://www.electronjs.org/zh/docs/latest/api/ipc-main#ipcmainhandlechannel-listener)（`ipcMain.handle(channel, listener)`），再在renderer中通过[ ipc invoke 调用刚才暴露的接口](https://www.electronjs.org/zh/docs/latest/api/ipc-main#ipcmainhandlechannel-listener)（`ipcRenderer.invoke('my-invokable-ipc', arg1, arg2)`），使用的是 ipcRender，由于electron禁止在页面上使用 模块系统，因此同样需要借助preload将使用到的ipcRender接口挂到全局window对象上，使用[contextBridge.exposeInMainWorld](https://www.electronjs.org/zh/docs/latest/api/context-bridge#%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E6%8E%A5%E5%8F%A3api)。

# ts

vscode 默认有ts文件及其内容的提示，需要的只是编写ts代码。electron 不直接使用ts代码，因此需要将ts代码编译为js代码。可以使用 TypeScript 编译器 (`tsc`)（当前未使用，具体环境配置不展开）；也可使用 babel （当前使用），如果需要类型检查仍需要通过 TypeScript 编译器 (`tsc`) 或其他工具来完成。

根据 babel 的官方指引，需要安装下面三个记住库：

```shell
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

然后，添加 babel 的配置文件（`.babelrc` 或 `babel.config.json`）。在配置中首先需要做的几件事：

- 添加preset：
	- @babel/preset-env，babel 默认需要（暂时未明），作用是设置编译js为何版本的，兼容性如何的代码。
	- 使用了ts,需要安装（`npm install --save-dev @babel/preset-typescrip`）并配置@babel/preset-typescript：[@babel/preset-typescript的作用](#@babel/preset-typescript的作用)

添加 ts 配置文件。尽管不使用 tsc 编译 ts 代码（安装 `@babel/preset-typescrip` 并不会使用tsconfig.json），但它可以vscode有更好、符合预期的ts语法提示。



编译(todo)

```shell
npx babel <dir | entry file>
```


# react

使用 react 组织 electron 的页面布局渲染与交互。使用 ts、tsx 文件；使用 esm 模块。为此需要将各模块合并为一个，使用iife格式输出。

当前使用 rollup 做模块合并。

```shell
npm install --dev-save rollup
```
rollup有 tree-shark 和合并 esm 模块的能力。使用 rollup cli（自带） 和配置文件。rollup 基于nodejs运行时，官方配置示例使用 esm 语法，方便快捷的方案是使用`.mjs`的配置文件。配置文件中需要指定输入和输出：

```js
// rollup.config.mjs
const reactBuilderConf = {
  input: {
    'renderer': 'src/renderer/index.tsx',
  },
	output: {
    dir: 'dist/',
    format: 'iife'
	},
};
```

rollup 能合并 esm，但仅限 esm，就算项目代码中全使用 esm 模块，但引入的第三方库使用非 esm 模块也会引起异常。

rollup 承担了合并模块的职责，见上将react代码合并并输出到 dist 目录下的 renderer.tsx。按照前面已有的环境，应当继续使用 babel 将 `dist/renderer.tsx` 编译为 `dist/renderer.js`

todo：不使用 rollup 插件，仅仅合并模块，然后使用 babel 编译。

## 使用 rollup 插件整合 babel 和 ts

使用 rollup 的 babel 插件后，babel的配置文件还有用吗？

有用的，默认读取 babel 的配置文件（仅限babel默认命名的文件），若需要读取特定的文件，需要使用 `configFile` 属性显式声明。

增加必要的插件解决模块兼容性问题（转化为esm模块）：

- @rollup/plugin-node-resolve：解析cjs的模块路径。就算项目代码中没用使用 cjs，但引入了使用 cjs 模块的 lib 也是需要使用这个插件的；

- @rollup/plugin-commonjs：将 cjs 模块转换成 esm 模块。就算项目代码中没用使用 cjs，但引入了使用 cjs 模块的 lib 也是需要使用这个插件的；

解决项目中的 react 代码（使用 ts 编写） 的编译问题

安装 react 代码依然使用babel编译，因此需要安装 babel 的preset：`@babel/preset-react`，并在babel的配置文件中添加。


解决ts编译与js问题，需要安装 `@rollup/plugin-babel` 插件


```shell
# .babelrc.renderer.json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  "ignore": ["./src/*.d.ts"]
}
```

```js
// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

const reactBuilderConf = {
  input: {},
	output: {},
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled'
    })
  ]
};
```

使用 react

安装

```shell
npm install react react-dom
npm install --dev-save @types/react @types/react-dom
```

react 入口文件

```ts
// index.ts
import React from 'react';
import { createRoot } from "react-dom/client";
// 项目代码 App.tsx,一个函数组件：export default () => { return (<div></div>) }
import App from "./App";

createRoot(document.getElementById('app') as HTMLElement).render(React.createElement(App));
```

注意：这个index.ts最后会作为其中一部分被打包进入最终产物 renderer.js，而index.html则使用script标签引入renderer.js。看见`document.getElementById('app')`，说明index.html中已经预先写好了 `<div id="app"></div>`

使用 react 遇到的问题：

1. 在编写react component 时，无论是否使用 `React`，都需要显示引入（`import React from 'react';`），否则 rollup 打包后的产物会缺少 React 库。注意不是入口文件显式引入就可以，而已需要没给组件都显式引入！

2. 打包后的 renderer 代码中使用了 process 对象，electron 抛异常提示无法使用 process 对象。原因是 react 源码中使用了process对象进行 production 与 development 的判断。解决方案是在rollup中引入 `@rollup/plugin-replace` 插件。

```js
replace({
  'process.env.NODE_ENV': JSON.stringify('production'), // 自定义环境变量
  preventAssignment: true, // 确保替换在编译时完成
}),
```

以上的 replace 配置，将把源码中 `process.env.NODE_ENV` 替换为 `production`。源码判断环境的逻辑就会变成 `if ('production' === 'production') {}` 从而让 rollup 的 tree-shark 能力把这部分不需要的代码删除。



# electron 的打包

package.json

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "Jane Doe",
  "license": "MIT"
}
```
main、author和description是打包必须的。

打包并分发您的应用程序：

```shell
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

在 package.json 中将被导入 3 条基础命令：

- start：调试用

- package：？

- make：打包用


# renderer 中禁用模块系统，与main通信

使用preload作为桥，使用ipc通信。在一些情况下需要暴露借口给renderer使用，而它禁用模块系统。electron给到的方案是在preload中将需要暴露的接口挂载到html的全局对象window上。

使用ts后会发现 window 没有暴露的api的提示，甚至是错误提示。为解决此问题，electron 提供的就绝方案是增加一个 dts 文件，并在tsconfig中include它，[详细见官方示例](https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation#%E4%B8%8Etypescript%E4%B8%80%E5%90%8C%E4%BD%BF%E7%94%A8)

# 附录

## @babel/preset-typescript的作用

`@babel/preset-typescript` 是 Babel 提供的一个预设，用于将 TypeScript 代码转换为 JavaScript。它允许你在不使用 TypeScript 编译器 (`tsc`) 的情况下，通过 Babel 编译 TypeScript 代码，从而利用 Babel 的插件生态系统和工具链。

### 主要作用

1. **TypeScript 转换为 JavaScript**：
   - `@babel/preset-typescript` 将 TypeScript 代码中的类型信息移除，并将其转换为标准的 JavaScript。它只关注语法转换，不进行类型检查。类型检查仍需要通过 TypeScript 编译器 (`tsc`) 或其他工具来完成。

2. **集成 Babel 插件**：
   - 使用 `@babel/preset-typescript`，你可以将 TypeScript 与 Babel 的其他插件结合使用。例如，你可以在 TypeScript 项目中使用 Babel 的最新 JavaScript 语法转换插件或 polyfills 插件，从而实现对不同目标环境的兼容性支持。

3. **简化工具链**：
   - 对于一些项目，使用 Babel 编译 TypeScript 可以简化构建工具链。你可以在不需要单独配置 TypeScript 编译器的情况下，统一使用 Babel 进行编译，并且可以借助 Babel 的庞大插件生态来增强功能。

### 不支持的特性

`@babel/preset-typescript` 并不支持所有 TypeScript 的特性，特别是以下几点：

1. **类型检查**：
   - `@babel/preset-typescript` 不会进行类型检查。它仅移除类型注解，转换语法。如果需要类型检查，建议使用 TypeScript 编译器 (`tsc`) 或结合 Babel 的 `typescript` 插件。

2. **TypeScript 特定的语法**：
   - 一些 TypeScript 特有的语法（例如，`const enum` 和 `namespace`）不会被 `@babel/preset-typescript` 支持。对于这些特性，可能需要依赖 `tsc` 或避免使用这些语法。

### 示例配置

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ]
}
```

在这个配置中，Babel 会首先通过 `@babel/preset-typescript` 将 TypeScript 代码转换为 JavaScript，然后再通过 `@babel/preset-env` 处理现代 JavaScript 语法的转换。

### 适用场景

- **轻量化的项目**：对于不需要复杂类型检查的项目，使用 `@babel/preset-typescript` 可以简化编译过程。
- **已有 Babel 配置的项目**：如果项目已经使用了 Babel，可以通过添加 `@babel/preset-typescript` 轻松支持 TypeScript，而不必重新配置 TypeScript 编译器。

你可以在 [Babel 官方文档 - @babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) 中了解更多详细信息。