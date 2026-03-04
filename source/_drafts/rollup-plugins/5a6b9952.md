---
title: rollup plugins
excerpt: rollup plugins
date: 2024-09-04 12:32:36
tags:
categories:
---

# Rollup

Rollup 是一个 JavaScript 模块打包工具，它主要用于将多个模块（文件）打包成一个更小、更高效的单一文件。Rollup 的核心作用包括以下几点：

1. **模块打包**：Rollup 将多个 ES 模块（即使用 `import` 和 `export` 语法的模块）打包成一个单一的文件；

2. **代码优化**：Rollup 的一个显著特点是其「tree-shaking」功能。这一功能会自动剔除项目中未使用的代码，从而减少打包后的文件大小，提高运行效率。相比于 Webpack 等其他打包工具，Rollup 更注重生成清晰和高效的代码；

3. **插件系统**：Rollup 具有强大的插件系统，允许开发者通过各种插件扩展其功能。例如，处理非 JavaScript 文件类型（如 TypeScript、CSS、JSON 等）、替换代码中的变量、处理动态导入等；

4. **支持多种模块格式**：Rollup 支持输出多种模块格式，适用于不同的环境。对于浏览器应用程序，Rollup 可以生成 IIFE 或 UMD 格式的包，对于 Node.js 应用程序，它可以生成 CommonJS 格式的包；

Rollup 通常与现代前端框架（如 React、Vue 等）配合使用，尤其在构建库和工具时表现出色。它的配置文件简单、易于理解，适合追求更轻量级打包解决方案的项目。

*注意：Rollup 的模块合并能力仅仅针对输入源是 ESM 模块的代码，不单仅仅要求业务是 ESM 模块，同样要求引入的第三方库（这是不现实的，因此需要“其他模块语法”转 ESM 语法的插件辅助）*


## 安装

选择自己喜欢的包管理器即可，不做过多展示。相信大部分开发者都不会如官方推荐般全局装，毕竟不是每个开发者都预装了适合当前项目的 Rollup 本版。

```shell
yarn add rollup --dev

yarn add rollup@3.29.4 --dev
```

*注意：目前（2024/09/04） Rollup 的版本已经到 `4.x.x`。它依赖的 NodeJS 版本已经 `>= 18.x.x`。因此，在新旧项目使用 Rollup 时需要注意选择其相应的版本，以免部分插件或库无法打包与使用。*


## 配置文件

Rollup 有提供 CLI 工具（`npx rollup --help` 查看即可，不作赘述），但个人认为，结合配置文件与基础的 CLI 命令使用更加规范、安全与方便。官方提供多种的配置文件扩展与模块系统。基于官方的配置示例多使用 ESM 模块语法，并且 Rollup 基于 NodeJS 运行时工作，因此最方便快捷的选择应是使用 `.mjs` 的文件扩展名。

```mjs
// rollup.config.mjs

export default {
  input: {
    'a/b': 'origin/entry/path1.ext'
    'c/d': 'origin/entry/path2.ext'
  },
  output: {
    dir: 'dist/dir/path',
    format: '<iife | esm | umd | cjs>'
  },
}
```

输入输出的对应关系：

- `origin/entry/path1.ext` => `dist/dir/path/a/b.js`
- `origin/entry/path2.ext` => `dist/dir/path/c/d.js`

*注意：*
- *支持 `export default` 数组（即多个配置）和对象；*
- *`output.dir` 的目录会自动生成。二次构建时不会先移除 `output.dir` 目再打包，需要自行增加额外逻辑；*
- *以上非输入输出的唯一配置方式，更多可查阅 [Rollup guide > Configuration Options](https://rollupjs.org/configuration-options/)*

## 使用

不知道是不是过于简单，大多官方都不愿在显眼的位置说明基本用法。

```shell
npx rollup -c rollup.config.mjs
```

## 插件

### 配置方式

```mjs
// rollup.config.mjs

export default {
  input: {},
  output: {},
  plugins: [
    plugin1(),
    plugin2(),
    // ...
    pluginN(),
  ]
}
```

*注意：插件的执行顺序是按数组索引升序执行。*

### 官方插件

| 插件名称                                               | 描述                                                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [alias](https://github.com/rollup/plugins/tree/master/packages/alias) | 声明并解析包依赖项的别名                                                                |
| [auto-install](https://github.com/rollup/plugins/tree/master/packages/auto-install) | 自动安装包中导入的依赖项                                                            |
| [babel](https://github.com/rollup/plugins/tree/master/packages/babel) | 使用 Babel 编译文件                                                                   |
| [beep](https://github.com/rollup/plugins/tree/master/packages/beep) | 在出现错误和警告时系统发出蜂鸣声                                                        |
| [buble](https://github.com/rollup/plugins/tree/master/packages/buble) | 使用 buble 编译 ES2015                                                                     |
| [commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) | 将 CommonJS 模块转换为ES6                                                                 |
| [data-uri](https://github.com/rollup/plugins/tree/master/packages/data-uri) | 从 data-URI 导入模块                                                                       |
| [dsv](https://github.com/rollup/plugins/tree/master/packages/dsv) | 使用 d3-dsv 将 .csv 和 .tsv 文件转换为JavaScript模块                                         |
| [dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars) | 解析包含变量的动态导入                                                                  |
| [eslint](https://github.com/rollup/plugins/tree/master/packages/eslint) | 使用 ESLint 验证入口点及所有导入的文件                                                    |
| [esm-shim](https://github.com/rollup/plugins/tree/master/packages/esm-shim) | 为 ESM 输出捆绑替换 cjs 语法                                                                |
| [graphql](https://github.com/rollup/plugins/tree/master/packages/graphql) | 将 .gql/.graphql 文件转换为 ES6 模块                                                        |
| [html](https://github.com/rollup/plugins/tree/master/packages/html) | 创建 HTML 文件以提供 Rollup 打包包                                                          |
| [image](https://github.com/rollup/plugins/tree/master/packages/image) | 导入 JPG、PNG、GIF、SVG 和 WebP 文件                                                        |
| [inject](https://github.com/rollup/plugins/tree/master/packages/inject) | 扫描模块中的全局变量，并在必要时注入 `import` 语句                                        |
| [json](https://github.com/rollup/plugins/tree/master/packages/json) | 将 .json 文件转换为 ES6 模块                                                                |
| [legacy](https://github.com/rollup/plugins/tree/master/packages/legacy) | 为旧版非模块脚本添加 `export` 声明                                                        |
| [multi-entry](https://github.com/rollup/plugins/tree/master/packages/multi-entry) | 捆绑包使用多入口点                                                                  |
| [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) | 查找并打包 node_modules 中的第三方依赖项                                                  |
| [replace](https://github.com/rollup/plugins/tree/master/packages/replace) | 在打包时替换文件中的字符串                                                              |
| [run](https://github.com/rollup/plugins/tree/master/packages/run) | 一旦构建完成，在 Node 中运行打好的包                                                    |
| [strip](https://github.com/rollup/plugins/tree/master/packages/strip) | 从代码中移除 debugger 语句以及 assert.equal 和 console.log 等函数                              |
| [sucrase](https://github.com/rollup/plugins/tree/master/packages/sucrase) | 使用 Sucrase 编译 TypeScript、Flow、JSX 等                                                  |
| [swc](https://github.com/rollup/plugins/tree/master/packages/swc) | 使用 swc 编译 TypeScript/JavaScript                                                       |
| [terser](https://github.com/rollup/plugins/tree/master/packages/terser) | 使用 terser 生成压缩的输出捆绑包                                                          |
| [typescript](https://github.com/rollup/plugins/tree/master/packages/typescript) | 集成 Rollup 与TypeScript                                                                  |
| [url](https://github.com/rollup/plugins/tree/master/packages/url) | 作为 data-URIs 或 ES 模块导入文件                                                             |
| [virtual](https://github.com/rollup/plugins/tree/master/packages/virtual) | 从内存中加载虚拟模块                                                                    |
| [wasm](https://github.com/rollup/plugins/tree/master/packages/wasm) | 使用 Rollup 导入 WebAssembly 代码                                                           |
| [yaml](https://github.com/rollup/plugins/tree/master/packages/yaml) | 将 YAML 文件转换为 ES6 模块                                                                 |


### @rollup/plugin-node-resolve

@rollup/plugin-node-resolve 是 Rollup 打包过程中解析第三方库不可或缺的工具，因为 Rollup 默认情况下无法解析这些模块。大大简化了在 Rollup 中使用和打包外部依赖的过程。它的核心作用：

`@rollup/plugin-node-resolve` 插件在使用 Rollup 打包 JavaScript 模块时非常重要。其主要作用如下：

- **模块解析**：
  该插件帮助 Rollup 定位 `node_modules` 目录中的模块，正确解析并打包以 ES 模块或 CommonJS 模块形式发布的第三方依赖，确保在不同模块系统之间的兼容性；

- **浏览器兼容性**：
  它可以根据 `package.json` 中的 `browser` 字段来解析模块，从而确保打包后的代码能够在浏览器中正常运行；

- **自动添加文件扩展名**：
  当导入路径中省略了文件扩展名（如 `.js` 或 `.ts`）时，插件会自动补全，方便开发者处理不同类型的文件；

- **处理内置模块**：
  处理 Node.js 的内置模块，比如 `path` 和 `fs`，确保在打包时能够正确引用这些模块。



**工作原理**

1. **解析模块路径**：
   当你在代码中导入一个模块时，比如 `import _ from 'lodash';`，默认情况下，Rollup 并不知道如何找到这个模块。`@rollup/plugin-node-resolve` 插件的第一个任务就是识别这些模块引用，并查找它们在文件系统中的实际位置。它会根据标准的 Node.js 模块解析算法，从 `node_modules` 文件夹开始寻找这些依赖项。

2. **处理模块格式**：
   这个插件能够识别多种模块格式，包括 ES 模块、CommonJS 模块、甚至是使用 `browser` 字段指定的模块。当它找到一个模块后，会根据模块的类型来决定如何处理。例如，对于 CommonJS 模块，它可以与 `@rollup/plugin-commonjs` 配合使用，将这些模块转换为 ES6 模块格式。

3. **添加文件扩展名**：
   如果你的导入语句中没有指定文件扩展名（比如 `.js` 或 `.json`），插件会自动尝试常见的扩展名，确保可以找到正确的文件。这让开发者在编写代码时不需要手动添加文件扩展名，提升了开发体验。

4. **支持浏览器字段**：
   在前端项目中，有时模块作者会在 `package.json` 中使用 `browser` 字段来指定浏览器环境下的替代模块路径。`@rollup/plugin-node-resolve` 可以识别并使用这些路径，确保生成的捆绑包在浏览器环境下正常运行。

5. **内置模块支持**：
   对于像 `path`、`fs` 这样的 Node.js 内置模块，插件也会妥善处理，确保这些模块在捆绑后的代码中可以正常引用。

工作流程示意图：
1. **导入模块** → 2. **解析路径** → 3. **检查模块类型** → 4. **根据类型处理** → 5. **返回正确的模块路径**

通过这些步骤，`@rollup/plugin-node-resolve` 确保了在使用 Rollup 打包时，可以顺利地解析和打包第三方依赖项及模块，极大地简化了模块化 JavaScript 开发的过程。


**使用**

```mjs
// rollup.config.mjs

import resolve from '@rollup/plugin-node-resolve';

export default {
  input: {},
  output: {},
  plugins: [
    resolve()
    // ...
  ]
}
```

@rollup/plugin-node-resolve 一般而言会放在比较前面，常见是放在第一个，让 Rollup 可以解析模块依赖，尤其是从 node_modules 中解析第三方库。如果不首先解析这些模块，后续的插件（如处理 CommonJS 模块的 @rollup/plugin-commonjs、处理 Babel 转译的 @rollup/plugin-babel 等）可能无法正常工作。

注意：正如前所说，此插件是解析第三方库，因此注意配置 `resolve({ extensions: '' })` 时要明白它是针对第三方依赖库而非项目代码，避免项目代码使用 `ts, tsx` 文件扩展名，就只配置这些，而导致部分第三方库的代码被漏掉解析。此插件的默认 `extensions` 配置是： `['.mjs', '.js', '.json', '.node']`。

在使用 `video.js` 时就因为仅仅配置了 `ts, tsx` 而导致 `video.js` 的好几个依赖被当做全局变量（外部模块）而没有被打包，详细见附录。


### @rollup/plugin-commonjs

`@rollup/plugin-commonjs` 的主要作用是**将 CommonJS 模块转换为 ES6 模块**，以便 Rollup 能够正常解析和打包。这是因为 Rollup 本身是针对 ES6 模块设计的，无法直接处理 CommonJS 格式的模块。而大多数 Node.js 库和部分前端依赖仍然采用 CommonJS 规范发布，因此 `@rollup/plugin-commonjs` 在处理这些模块时至关重要。

具体功能：
1. **将 CommonJS 转换为 ES 模块**：CommonJS 使用 `require` 和 `module.exports` 导入导出模块，而 ES6 模块使用 `import` 和 `export`。该插件自动将 CommonJS 的导入导出语法转换为 ES6 格式，使 Rollup 可以处理这些模块。

2. **支持动态 `require`**：CommonJS 模块允许使用动态的 `require`，例如在运行时按条件加载模块，而 Rollup 只支持静态导入。该插件处理了这种动态导入情况，使其兼容 Rollup 的打包逻辑。

3. **优化依赖打包**：该插件会分析 CommonJS 模块，自动去除不必要的代码和依赖，从而生成更小的输出文件。

4. **与其他插件协作**：`@rollup/plugin-commonjs` 通常与 `@rollup/plugin-node-resolve` 配合使用，前者将 CommonJS 转换为 ES 模块，后者负责解析 `node_modules` 中的依赖。

使用场景：
- 如果项目中包含像 `lodash`、`moment`、`express` 等使用 CommonJS 规范的依赖时，需要使用该插件将它们转换为 ES 模块进行打包。

基本配置示例：
```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es' // ES 模块格式
  },
  plugins: [
    resolve(),   // 解析 node_modules 中的依赖
    commonjs()   // 将 CommonJS 转换为 ES6 模块
  ]
};
```

*注意：`@rollup/plugin-commonjs` 的作用是将**已解析的** CommonJS 模块转换为 ES6 模块，它不是针对第三方库的插件。如果需要让它可以转换第三方库中的 cjs，需要先使用 `@rollup/plugin-node-resolve` 将这些库中的 cjs 处理为“已解析的cjs”，之后才会被 `@rollup/plugin-commonjs` 转换。在未使用 `@rollup/plugin-node-resolve` 时，它仍可以转换项目中的 cjs 模块。*


### @rollup/plugin-replace

`@rollup/plugin-replace` 是一个 Rollup 插件，用于在构建过程中替换模块中的字符串。它主要用于在构建时对特定的字符串进行替换，这对处理环境变量、调试信息或进行构建特定的替换非常有用。

在开发 Election 应用中，使用 React 组织 renderer。由于 Electron 的安全隔机制禁止在 renderer 中使用 `process` 对象，React 的源码中则使用了此对象做环境判断。此时即可使用 replace 插件替换源码中 process 相关的逻辑判断：


```mjs
import replace from '@rollup/plugin-replace';
// 其他

export default {
  input: {},
  output: {},
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'), // 自定义环境变量
      preventAssignment: true, // 确保替换在编译时完成
    }),
    // 其他
  ]
};
```

这样的配置祈祷了两个作用：

1. 消除了源码中的 `process` 对象的使用；

2. 由于 Rollup 的 tree-shark 能力可以起到四代码消除的效果，从而减小 React 源码的大小。