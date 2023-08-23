用 prettier 自动化格式化代码，统一代码风格

# prettier 是什么

Prettier是一个流行的代码格式化工具，用于自动化地格式化代码以实现一致的代码风格。它支持多种编程语言，包括JavaScript、TypeScript、CSS、HTML、JSON等。

# 安装

```shell
pnpm add --save-dev --save-exact prettier
```

# 配置

默认配置文件名：`.prettierrc.json`

支持的配置文件扩展：

A "prettier" key in your package.json file.
A .prettierrc file written in JSON or YAML.
A .prettierrc.json, .prettierrc.yml, .prettierrc.yaml, or .prettierrc.json5 file.
A .prettierrc.js, or prettier.config.js file that exports an object using export default or module.exports (depends on the type value in your package.json).
A .prettierrc.mjs, or prettier.config.mjs file that exports an object using export default.
A .prettierrc.cjs, or prettier.config.cjs file that exports an object using module.exports.
A .prettierrc.toml file.

可配置的属性

以下是带有序号的Prettier可配置属性的表格列表：
| 序号  | 属性                           | 描述                               | 默认值                 | 可选项                                         |
| --- | ---------------------------- | -------------------------------- | ------------------- | ------------------------------------------- |
| 1   | `printWidth`                 | 每行代码的最大字符数。                      | `80`                | -                                           |
| 2   | `tabWidth`                   | Tab字符的宽度（空格数）。                   | `2`                 | -                                           |
| 3   | `useTabs`                    | 是否使用Tab字符进行缩进，而不是空格。             | `false`             | -                                           |
| 4   | `semi`                       | 是否在语句末尾添加分号。                     | `true`              | -                                           |
| 5   | `singleQuote`                | 是否使用单引号而不是双引号。                   | `false`             | -                                           |
| 6   | `quoteProps`                 | 对象属性是否使用引号。                      | `"as-needed"`       | `"as-needed"` - 仅在必要时添加引号<br/> `"consistent"` - 基于第一个带引号的属性，保持引号一致（总是添加或从不添加）<br/>`"preserve"` - 保留代码中使用的原始引号 |
| 7   | `jsxSingleQuote`             | 在JSX中是否使用单引号而不是双引号。              | `false`             | -                                           |
| 8   | `trailingComma`              | 是否在多行结构的末尾添加逗号。                  | `"none"`            | `"none"` - 没有尾逗号<br/>`"es5"` - 在多行数组和对象中添加尾逗号，但在函数参数中不添加<br/>`"all"` - 在多行数组、对象和函数参数中添加尾逗号                  |
| 9   | `bracketSpacing`             | 对象字面量中的花括号是否有空格。                 | `true`              | -                                           |
| 10  | `jsxBracketSameLine`         | 将JSX的`>`放置在最后一行的末尾，而不是另起一行。      | `false`             | -                                           |
| 11  | `arrowParens`                | 箭头函数参数是否使用圆括号。                   | `"always"`          | `"always"` - 在单个箭头函数参数周围始终使用括号<br/>`"avoid"` - 只有一个参数时省略括号                       |
| 12  | `rangeStart`                 | 仅格式化给定范围内的代码的开始行索引。              | `0`                 | -                                           |
| 13  | `rangeEnd`                   | 仅格式化给定范围内的代码的结束行索引。              | `Infinity`          | -                                           |
| 14  | `parser`                     | 指定要使用的解析器。                       | 自动检测                | -                                           |
| 15  | `filepath`                   | 指定要格式化的文件路径。                     | 自动检测                | -                                           |
| 16  | `requirePragma`              | 是否需要在文件顶部加上特定格式化的注释才会应用Prettier。 | `false`             | -                                           |
| 17  | `insertPragma`               | 是否在文件顶部插入特定格式化的注释。               | `false`             | -                                           |
| 18  | `proseWrap`                  | 指定是否将Markdown文本视为换行符。            | `"preserve"`        | `"preserve"` - 保留类似段落的文本中的原始换行符<br/>`"always"` - 根据指定的字符数将类似段落的文本包裹起来<br/>`"never"` - 不包裹类似段落的文本         |
| 19  | `htmlWhitespaceSensitivity`  | HTML文件中空格的敏感性。                   | `"css"`             | `"css"` - 遵循CSS中定义的空格规则<br/>`"strict"` - 严格遵循HTML的空格规则<br/>`"ignore"` - 忽略HTML的空格规则             |
| 20  | `endOfLine`                  | 文件行尾的换行符类型。                      | `"lf"`              | `"lf"` - 使用LF（Unix）行尾换行符<br/>`"crlf"` - 使用CRLF（Windows）行尾换行符<br/>`"cr"` - 使用CR（Mac）行尾换行符<br/>`"auto"` - 保持文件中现有的行尾换行符          |
| 21  | `embeddedLanguageFormatting` | 是否启用对嵌入式语言的格式化支持。                | `"auto"`            | `"auto"` - 自动检测并启用嵌入式语言的格式化支持<br/>`"off"` - 禁用嵌入式语言的格式化支持<br/>`"on"` - 启用嵌入式语言的格式化支持                           |
| 22  | `overrides`                  | 针对特定文件或文件类型的配置覆盖。                | -                   | -                                           |
| 23  | `plugins`                    | 自定义插件的数组。                        | -                   | -                                           |
| 24  | `disableLanguages`           | 禁用格式化的语言列表。                      | `[]`                | -                                           |
| 25  | `filepath`                   | 指定要格式化的文件路径。                     | 自动检测                | -                                           |
| 26  | `ignorePath`                 | 指定用于忽略文件的`.prettierignore`文件的路径。 | `".prettierignore"` | -                                           |
| 27  | `ignoreNodeModules`          | 是否忽略`node_modules`目录下的文件。        | `false`             | -                                           |
| 28  | `withNodeModules`            | 是否包含`node_modules`目录下的文件。        | `false`             | -                                           |
包含所有可选配置的配置文件：

```yml
# Maximum number of characters per line of code.
# Default: 80
printWidth: 80

# Number of spaces for each level of indentation.
# Default: 2
tabWidth: 2

# Whether to use tabs for indentation instead of spaces.
# Default: false
useTabs: false

# Whether to add semicolons at the end of statements.
# Default: true
semi: true

# Whether to use single quotes instead of double quotes.
# Default: false
singleQuote: false

# How to quote object properties.
# Default: as-needed
# Options: "as-needed" - Add quotes only when necessary.
#          "consistent" - Add quotes consistently (either always or never) based on the first quoted property.
#          "preserve" - Preserve the original quotes used in the code.
quoteProps: as-needed

# Whether to use single quotes in JSX elements and attributes.
# Default: false
jsxSingleQuote: false

# Whether to add trailing commas in multiline object literals and arrays.
# Default: none
# Options: "none" - No trailing commas.
#          "es5" - Add trailing commas in multiline arrays and objects, but not in function parameters.
#          "all" - Add trailing commas in multiline arrays, objects, and function parameters.
trailingComma: none

# Whether to include spaces inside curly braces of object literals.
# Default: true
bracketSpacing: true

# Whether to place the closing bracket of JSX elements in a new line.
# Default: false
jsxBracketSameLine: false

# How to use parentheses with arrow function parameters.
# Default: always
# Options: "always" - Always include parentheses around a sole arrow function parameter.
#          "avoid" - Omit parentheses when there is only one parameter.
arrowParens: always

# Starting line index to format a specific range of code.
# Default: 0
rangeStart: 0

# Ending line index to format a specific range of code.
# Default: Infinity
rangeEnd: Infinity

# Specify the parser to use for formatting.
# Default: auto
parser: auto

# Specify the file path to format.
# Default: auto
filepath: auto

# Whether a special formatting comment is required at the top of the file for Prettier to take effect.
# Default: false
requirePragma: false

# Whether to insert a special formatting comment at the top of the file.
# Default: false
insertPragma: false

# How to wrap prose-like text in Markdown files.
# Default: preserve
# Options: "always" - Wrap prose-like text to the specified print width.
#          "never" - Do not wrap prose-like text.
#          "preserve" - Preserve the original line breaks in prose-like text.
proseWrap: preserve

# Whitespace sensitivity for HTML files.
# Default: css
# Options: "css" - Respect the whitespace rules defined in CSS.
#          "strict" - Follow HTML whitespace rules strictly.
#          "ignore" - Ignore HTML whitespace rules.
htmlWhitespaceSensitivity: css

# Line ending to use in the formatted files.
# Default: lf
# Options: "auto" - Maintain the existing line endings of the file.
#          "lf" - Use LF (Unix) line endings.
#          "crlf" - Use CRLF (Windows) line endings.
#          "cr" - Use CR (Mac) line endings.
endOfLine: lf

# Whether to enable formatting support for embedded languages.
# Default: auto
# Options: "auto" - Automatically detect and enable formatting for embedded languages.
#          "off" - Disable formatting for embedded languages.
#          "on" - Enable formatting for embedded languages.
embeddedLanguageFormatting: auto

# Configuration overrides for specific files or file types.
# Default: []
overrides: []

# Custom plugins to use.
# Default: []
plugins: []

# List of languages to disable formatting.
# Default: []
disableLanguages: []

# Specify the path to .prettierignore file for ignoring files.
# Default: .prettierignore
ignorePath: .prettierignore

# Whether to ignore files inside node_modules directory.
# Default: false
ignoreNodeModules: false

# Whether to include files inside node_modules directory.
# Default: false
withNodeModules: false
```

配置需要忽略的文件

`.prettierignore`，配置将被忽略的文件

例子：

```shell
# 忽略所有.js文件
*.js

# 忽略dist目录及其内容
dist/

# 忽略test文件夹内以.test.js结尾的文件
test/*.test.js

# 忽略根目录下的config.js文件
/config.js

# 排除特定目录下的所有文件和子目录
!docs/

# 使用正则表达式匹配文件名
/src/.*\.scss
```

触发格式化

- watch模式；

- GitHub hook（）触发


# 实践

## 

## 优化

[lint-staged](https://github.com/okonet/lint-staged) 是一个用于在 Git 暂存区（staging area）中运行代码检查工具的工具。它的主要目的是在提交代码之前，对即将提交的文件进行代码检查，以确保代码质量和一致性。

通常情况下，开发人员会使用各种代码检查工具（例如 ESLint、Prettier、Stylelint 等）来确保代码符合一定的规范和最佳实践。而 lint-staged 可以帮助开发人员在 Git 提交之前，只对即将提交的文件运行这些代码检查工具，而不是对整个项目所有文件都运行检查，从而提高代码检查的效率。


