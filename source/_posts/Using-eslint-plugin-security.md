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
  - eslint 8.48.0
  - eslint-config-airbnb-base 15.0.0
  - eslint-plugin-import 2.28.1

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

检测利用unicode bidi攻击注入恶意代码的 [trojan source attacks](https://trojansource.codes/) 案例。

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
