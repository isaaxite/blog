---
title: Using eslint-plugin-security
excerpt: Using eslint-plugin-security
date: 2023-09-02 17:35:02
tags:
  - writting
categories:
---

# 前言

背景：

- 系统：WSL2 - Debian 12；

- 仓库：[isaaxite/practices - eslint-security](https://github.com/isaaxite/practices/tree/main/packages/eslint-security)；

- 包管理器：pnpm；

- 已安装的包：
  - eslint `8.48.0`
  - eslint-config-airbnb-base `15.0.0`
  - eslint-plugin-import `2.28.1`

# eslint-plugin-security

`eslint-plugin-security` 是一个 ESLint 插件，用于检测 JavaScript 代码中的常见安全问题。

这里给出它的一个简要概述:

- **名称**：eslint-plugin-security

- **作用**：通过ESLint规则检查JavaScript代码中的安全隐患

- **检测项**：

    - XSS(跨站脚本)；
    
    - SQL注入；
    
    - 缓冲区溢出；
    
    - XXE；
    
    - 敏感数据泄漏；
    
    - 引用不安全模块；
    
    - 文件操作权限；
    
    - 随机数生成；
  
    - CRLF注入；
  
    - 点击劫持；
  
    - 暴露详细错误信息。
  
- **使用步骤**：

  1. 安装插件；

  2. 在 Eslint 配置文件中配置 `plugins` 和 `rules`；

  3. 运行ESLint扫描代码。

- **规则可配置**：

  可以针对不同的检测项单独开启或者关闭相关规则。

- **输出结果**：

  标注出代码中的潜在安全问题位置和类型。

- **目的**：

  在开发阶段早期发现安全隐患，帮助编写更安全的代码。

| Order | Name                                                                                                                                                              | Description                         | Rules                                            |
|:------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------|:-------------------------------------------------|
| 1     | [detect-bidi-characters](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-bidi-characters.md)                               | 检测双向字符攻击,可能注入代码       | `security/detect-bidi-characters`                |
| 2     | [detect-buffer-noassert](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-buffer-noassert.md)                               | 检测Buffer使用noAssert可能导致溢出  | `security/detect-buffer-noassert`                |
| 3     | [detect-child-process](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-child-process.md)                                   | 检测child_process调用是否安全       | `security/detect-child-process`                  |
| 4     | [detect-disable-mustache-escape](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-disable-mustache-escape.md)               | 检测模板引擎是否关闭转义功能        | `security/detect-disable-mustache-escape`        |
| 5     | [detect-eval-with-expression](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-eval-with-expression.md)                     | 检测eval是否使用可控参数            | `security/detect-eval-with-expression`           |
| 6     | [detect-new-buffer](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-new-buffer.md)                                         | 检测Buffer构造是否使用可控参数      | `security/detect-new-buffer`                     |
| 7     | [detect-no-csrf-before-method-override](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-no-csrf-before-method-override.md) | 检测CSRF顺序设置是否正确            | `security/detect-no-csrf-before-method-override` |
| 8     | [detect-non-literal-fs-filename](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-fs-filename.md)               | 检测文件操作是否使用可控文件名      | `security/detect-non-literal-fs-filename`        |
| 9     | [detect-non-literal-regexp](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-regexp.md)                         | 检测正则是否使用可控参数可能导致DOS | `security/detect-non-literal-regexp`             |
| 10    | [detect-non-literal-require](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-require.md)                       | 检测require是否使用可控参数         | `security/detect-non-literal-require`            |
| 11    | [detect-object-injection](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-object-injection.md)                             | 检测对象属性注入                    | `security/detect-object-injection`               |
| 12    | [detect-possible-timing-attacks](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-possible-timing-attacks.md)               | 检测时间攻击                        | `security/detect-possible-timing-attacks`        |
| 13    | [detect-pseudoRandomBytes](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-pseudoRandomBytes.md)                           | 检测随机数是否真随机                | `security/detect-pseudoRandomBytes`              |
| 14    | [detect-unsafe-regex](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-unsafe-regex.md)                                     | 检测正则表达式安全问题              | `security/detect-unsafe-regex`                   |

# 安装

```shell
# eslint-plugin-security 1.7.1

pnpm add eslint-plugin-security --save-dev
```

# 配置

在安装 `eslint-plugin-security` 后，`eslint-plugin-security` 已经内置上面表格中的所有规则，并且设置告警等级为 `warn`。因此无需手动配置规则，除非需要修改告警等级。

```js
// .eslintrc.js

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
+   'plugin:security/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
  },
};
```

# detect-bidi-characters

```js
'security/detect-bidi-characters': 'warn'
```

检测利用 unicode bidi（"bidirectional"的缩写，是指双向书写或双向格式的意思） 攻击注入恶意代码的 [trojan source attacks](https://trojansource.codes/) 案例。

<details open>
  <summary><strong>什么是 <code>trojan source attacks</code> ？</strong></summary>
  <blockquote>
    <br/>
    <p>trojan source attacks 是一种利用双向书写系统中的特殊字符实现隐藏代码注入的攻击方式。</p>
    <p>具体来说:</p>
    <ul>
    <li><p>双向书写系统指阿拉伯数字和希伯来字母可以从右到左或者从左到右流畅书写的语言。</p>
    </li>
    <li><p>这些语言中的部分字符既可以作为一般字符显示,也可以用于控制书写方向。</p>
    </li>
    <li><p>攻击者会利用这些特殊字符在源代码中隐藏恶意代码段。</p>
    </li>
    <li><p>正常阅读源代码时无法发现隐藏段,但在特定环境中执行时被触发执行。</p>
    </li>
    <li><p>比如利用Unicode字符格式控制(LRE/RLE)在源码中间插入JavaScript代码。</p>
    </li>
    <li><p>当页面使用这种双向书写格式解析源码时,控制字符会触发隐藏代码执行。</p>
    </li>
    </ul>
    <p>此类攻击很难通过简单查看源代码发现,通常需要专门的检测工具分析可能存在的隐藏代码段。</p>
    <br/>
  </blockquote>
</details>
<br/>

这里给一个利用双向书写格式控制字符隐藏注入代码的 JavaScript 示例:

```js
console.log('正常源码...'); 

// 使用双向书写格式左到右控制码插入隐藏代码
\u202a
alert('被注入的代码!');
\u202c 

console.log('正常源码...');
```

当使用支持双向书写的浏览器/环境解析此源码时,会出现如下效果：

1. 首先正常显示"正常源码..."日志；

2. 然后遇到 `\u202a` 控制码,切换解释方向从右到左；

3. 这会导致 `alert('被注入的代码!');` 这段码变成隐藏状态,在源码中不可见；

4. 再遇到 `\u202c` 控制码后切换回正常左到右方向；

5. 最后再正常显示尾部"正常源码..."日志。

而普通浏览器直接查看源码只会看到：

```js 
console.log('正常源码...');

console.log('正常源码...');
```

中间隐藏的 `alert` 调用无法见到，从而实现了代码注入的攻击目的。

<details open>
  <summary><strong><code>\u202a</code> 和 <code>\u202c</code> 这两个控制码的作用是什么 ？</strong></summary>
  <blockquote>
    <br/>
    <p><code>\u202a</code> 和 <code>\u202c</code> 是 <code>Unicode</code> 的双向格式控制字符。</p>
    <p>它们的作用是控制文本书写的方向：</p>
    <ul>
    <li><p><code>\u202a</code> 是 <code>Unicode</code> 左到右标记(LRE)。它可以切换当前文本流的书写方向为从右到左；</p>
    </li>
    <li><p><code>\u202c</code> 是 <code>Unicode</code> 弹性冲突终止(PDF)。它可以把当前文本流的书写方向切换回正常的左到右。</p>
    </li>
    </ul>
    <p>这两个控制字符常被用在支持双向书写的语言环境中，以控制阿拉伯数字和希伯来字母等文本的流向。</p>
    <p>在 trojan source attacks 中，攻击者会利用它们来隐藏代码注入：</p>
    <ul>
    <li><p>使用 <code>\u202a</code> 指令切换流向右到左；</p>
    </li>
    <li><p>在这段流中插入要隐藏的代码，因为流向右到左，代码就会处于隐藏状态；</p>
    </li>
    <li><p>再使用 <code>\u202c</code> 指令切换流向回正常左到右。</p>
    </li>
    </ul>
    <p>这样一来，正常查看源代码就看不见被隐藏的代码段了。但在支持双向的运行环境中，隐藏代码依然会被执行。</p>
    <p>所以说,<code>\u202a</code> 和 <code>\u202c</code> 具有控制文本显示方向的关键作用，能很好地实现源代码层面的&quot;隐写术&quot;攻击手法。</p>
    <br/>
  </blockquote>
</details>
<br/>

除了上面 2 个 Unicode 的双向格式控制字符外，还有其他的。以下是相关 Unicode 双向格式字符的表格及描述：

| 序号 | 缩写 | Unicode字符 | 名称         | 描述                                      |
|------|:-----|:------------|:-------------|:------------------------------------------|
| 1    | LRE  | U+202A      | 左到右嵌入   | 将以下文本处理为从左到右                  |
| 2    | RLE  | U+202B      | 右到左嵌入   | 将以下文本处理为从右到左                  |
| 3    | LRO  | U+202D      | 左到右重写   | 强制将以下文本作为从左到右处理            |
| 4    | RLO  | U+202E      | 右到左重写   | 强制将以下文本作为从右到左处理            |
| 5    | LRI  | U+2066      | 左到右隔离   | 将以下文本作为从左到右处理,不影响相邻文本 |
| 6    | RLI  | U+2067      | 右到左隔离   | 将以下文本作为从右到左处理,不影响相邻文本 |
| 7    | FSI  | U+2068      | 首个强隔离   | 根据接下来的字符强制处理以下文本的方向    |
| 8    | PDF  | U+202C      | 弹出方向格式 | 终止最近的LRE、RLE、LRO或RLO              |
| 9    | PDI  | U+2069      | 弹出方向隔离 | 终止最近的LRI或RLI                        |


trojan source attacks 属于源代码层面的攻击，需要攻击者能获取和修改受保护源代码，一般来说这需要内部人员参与恶意行为才行。

更具体地说:

- 如果源代码完全开源，任何人都可以下载和修改，那么外部人也可能进行这种攻击；

- 但如果源代码受到良好控制和管理，只有内部开发和维护人员可以访问和提交代码，那么进行 trojan 源代码改动的就很可能是内部人员之一；

- 除非通过其他漏洞获得源代码写入权限，否则外部人很难直接进行源代码层面改动；

- 所以大多数情况下，这种攻击更可能源自内部人员的恶意行为，如内鬼、骇客入侵内部系统等。

所以总之，trojan source attacks 强调源代码方面的改动，这更需要内部人员的参与进行，而不太可能是外部直接攻击。这也是它与其他类型攻击的一个区别。

# detect-buffer-noassert

```js
'security/detect-buffer-noassert': 'warn'
```

这个规则用于检测代码中没有做边界检查直接调用 buffer 的情况，这可能会导致缓冲区溢出漏洞。`noAssert` 标志禁用了边界检查，所以使用这个标志调用 buffer 是危险的做法。

主要的检测逻辑是：

1. 检测对 `buffer()` 的调用；

2. 检查调用是否设置了 `noAssert` 标志；

3. 如果同时满足以上两点，则报告警告

这可以帮助开发者发现危险的 buffer 调用，进行修改以避免引入安全漏洞。总体来说,这个规则通过静态分析提高了代码安全性,防止缓冲区溢出等问题的产生。

下面是一个使用 `noAssert` 标志调用 `buffer()` 的错误示例：

```js
const buf = Buffer.alloc(100);

// 错误示例
buf.write('some data', 0, 120, 'ascii', noAssert);

// 正确示例
buf.write('some data', 0, buf.length, 'ascii'); 
```

在这个例子中，`write()` 方法可能会向 buf 缓冲区写入超过其长度的数据，因为传入的长度参数为 120，大于 buf 的长度 100。而且使用了 `noAssert` 标志来禁用长度检查。

这就可能导致缓冲区溢出，造成内存污染、崩溃或安全漏洞。

`security/detect-buffer-noassert` 规则会捕获像这样危险的 `noAssert` 调用，从而帮助发现并修复类似的问题。

# detect-child-process

```js
'security/detect-child-process': 'warn'
```

这条规则用来检测代码中是否存在潜在的子进程命令注入漏洞。

子进程模块 `child_process` 可以用来生成子进程，如果拼接用户输入到子进程命令中，可能会导致命令注入攻击。

例如:

```js
const cp = require('child_process');
const userInput = process.argv[2];

cp.exec('ping ' + userInput);
```

如果用户输入包含特殊字符，可能会造成命令注入。

detect-child-process 规则会检查代码中是否：

1. 使用了 child_process 模块；

2. 构造子进程命令时，拼接了用户可控变量。

如果同时满足上述条件，则会报告高优先级警告,提示这里存在潜在的命令注入风险。

**如果实在需要拼接用户的输入，可以参考以下常见的安全措施：**

1. 使用白名单过滤用户输入，只允许安全的字符，过滤掉特殊字符；

2. 对用户输入进行转义，防止特殊字符被解析为命令语法；

3. 使用参数数组传入用户输入，而不是直接拼接字符串；

4. 设置子进程的用户权限，限制它可以执行的命令；

5. 使用沙箱机制限制子进程访问系统资源；

6. 不直接使用用户输入，而是根据白名单映射为内部命令；

7. 监控子进程的执行情况，设置超时时间，防止阻塞；

8. 如果可能，避免直接使用用户输入，使用预定义的命令集合；

9. 其他输入验证和输出编码等手段。

在确认已经确认采取防范措施，可以使用内联的规则忽略方式去掉警告，如下：


1. 单行注释

    ```js
    // eslint-disable-next-line security/detect-child-process
    cp.exec('ping ' + userInput);
    ```

2. 范围注释

    ```js
    function safeExec() {
      /* eslint-disable security/detect-child-process */

      cp.exec('ping ' + userInput);
      
      /* eslint-enable security/detect-child-process */
    }
    ```

# detect-disable-mustache-escape

```js
'security/detect-disable-mustache-escape': 'warn'
```

它用于检测是否在使用 [Mustache 模板引擎] 时关闭了 HTML 转义，这可能会导致 XSS 漏洞。

这个规则的主要逻辑是：

1. 检查代码中是否使用了 [Mustache 模板引擎]；

2. 检查 `Mustache` 的调用是否通过 `disableEscape` 选项关闭了 HTML 转义；

3. 如果同时满足上述两个条件，则会报告警告；

示例危险代码：

```js
const Mustache = require('mustache');

const data = {text: '<script>alert(1)</script>'};

// 禁用转义,导致 XSS 漏洞
Mustache.render('<p>{{{text}}}</p>', data); 
```

关闭转义后，用户输入的数据就可能包含恶意代码而没有被过滤。

这个规则可以帮助开发者识别 Mustache 模板中关闭转义的危险用法，修正为：

```js
Mustache.render('<p>{{text}}</p>', data);
```

<details>
  <summary><strong>XSS 是什么？</strong></summary>
  <blockquote>
    <br/>
    <p>XSS(跨站脚本)攻击是一种代码注入攻击,它允许攻击者将恶意脚本注入到易受攻击的Web应用程序中。</p>
    <p>简单来说,XSS攻击的过程是:</p>
    <ol>
    <li><p>攻击者构造出特殊的恶意代码(通常是JavaScript)。</p>
    </li>
    <li><p>恶意代码被提交到易受攻击的网站,并保存在服务器端(比如用户提交表单,注入恶意JavaScript代码)。</p>
    </li>
    <li><p>网站将未过滤的恶意代码发送给其他用户(比如在结果页面直接输出用户输入的内容)。</p>
    </li>
    <li><p>其他用户的浏览器执行了这段恶意JavaScript代码,导致账号被盗用、页面被篡改等后果。</p>
    </li>
    </ol>
    <p>XSS因此可以让攻击者得到目标用户的敏感信息,篡改页面内容,以受害者的身份执行操作等。</p>
    <p>防范XSS需要对用户输入进行校验和输出编码,避免直接暴露给浏览器,即输入验证和输出编码。现在也有许多静态扫描工具可以检测XSS漏洞。</p>
    <br/>
</details>
<br/>

<details open>
  <summary><strong>Mustache 模板引擎是什么？</strong></summary>
  <blockquote>
    <br/>
    <p>Mustache 是一种流行的 JavaScript 模板引擎，它可以用来根据视图模板和数据渲染 HTML。</p>
    <p>Mustache 的一些关键特点包括：</p>
    <ul>
    <li><p>语法简单，双大括号表示变量插入点。如：<code>Hello {{name}}</code>；</p>
    </li>
    <li><p>不需要预编译，在客户端实时渲染模板；</p>
    </li>
    <li><p>支持主流前端框架，可以配合 React、Vue 等使用；</p>
    </li>
    <li><p>默认进行 HTML 转义，防止 XSS 攻击；</p>
    </li>
    <li><p>支持自定义语法扩展；</p>
    </li>
    <li><p>无依赖，体积小。</p>
    </li>
    </ul>
    <p>Mustache 的用法示例:</p>
    <pre>
<code class="lang-js"><span class="hljs-comment">// 定义模板 </span>
<span class="hljs-keyword">const</span> <span class="hljs-keyword">template</span> = <span class="hljs-string">"Hello {{name}}"</span>; 
<span class="hljs-comment">// 渲染函数</span>
<span class="hljs-keyword">const</span> render = Mustache.render(<span class="hljs-keyword">template</span>, {name: <span class="hljs-string">"Jack"</span>});
<span class="hljs-comment">// 得到渲染结果</span>
render; <span class="hljs-comment">// "Hello Jack"</span>
</code></pre>
    <p>必须注意的是，在使用 Mustache 时不要关闭 HTML 转义选项，否则可能会导致XSS漏洞。建议配合 ESLint 的 <code>detect-disable-mustache-escape</code> 规则进行静态检查。</p>
    <p>总体上，Mustache是一个轻量简单的模板引擎，可以快速实现数据渲染，但需要注意安全性。</p>
    <p>保持默认的转义打开，然后再根据需要通过白名单等手段过滤用户输入数据，从而避免 XSS 漏洞。</p>
    <br/>
</details>
<br/>

目前常见的前端框架大多**基于或可以集成** Mustache 模板引擎，比如：

- React - 可以通过 react-mustache 这个库集成 Mustache；

- Vue - 可以通过 vue-mustache 这个库集成 Mustache；

- Angular - 可以通过 ngx-mustache 库集成；

- Ember - Ember 内置对 Mustache 的支持；

- Backbone - Backbone 推荐的模板引擎就是 Mustache；

- Meteor - Meteor 提供了空间风格(Spacebars)模板，语法与 Mustache 类似；

- Node.js - 可以通过 mustache 模块在后端使用；

- Vanilla JS - 直接通过嵌入式 JS 或从 CDN 引入 Mustache。

支持多种语言，其中 JavaScript 由 [mustache.js](https://github.com/janl/mustache.js) 支持。

# detect-eval-with-expression

TODO

# detect-new-buffer

TODO

# detect-no-csrf-before-method-override

TODO

# detect-non-literal-fs-filename

TODO

# detect-non-literal-regexp

TODO

# detect-non-literal-require

TODO

# detect-object-injection

TODO

# detect-possible-timing-attacks

TODO

# detect-pseudoRandomBytes

TODO

# detect-unsafe-regex

TODO

# 附录

## 参考

- [双向文稿](https://www.wikiwand.com/zh-hans/%E9%9B%99%E5%90%91%E6%96%87%E7%A8%BF)
- [Trojan Source attack for introducing invisible vulnerabilities](https://pvs-studio.com/en/blog/posts/cpp/0933/)

<!-- refs defined -->
[Mustache 模板引擎]:http://mustache.github.io/