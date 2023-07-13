---
title: Automated Changelog Manual
date: 2023-07-13 11:06:20
tags:
categories:
keywords:
---

# 前言

TODO

- 为什么要开始自动化 CHANGELOG?

- 现成的自动化 CHANGELOG 有那些解决方案？

- CHANGELOG 的来源是 commits，那些 commmit 应该 自动化到 CHANGELOG ?

- commits 可以被筛选的前提是commits有规律的，意味commits需要被规范化。commits 的规范化标准如何制定？

- 人类的特性是混乱，人类是不可信的。需要强制执行 commits 规范，尽管是要求的自动化的自己！强制执行的解决方案有那些，是否存在现成的？

- 强制commit规范的原理探讨一下。


# Git Commit 规范

首先要解决的问题是

| 规范名称 | 描述 |
| --- | --- |
| [Angular规范 ↗](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit) | Angular规范是非常流行的Git Commit规范之一，拥有众多的用户和贡献者。它提供了一套完整的Git Commit规范。Angular规范要求Commit message必须包含三个部分：类型、范围和描述。类型可以是feat、fix、docs、style、refactor、test、chore等。范围是可选的，用于表示代码变更的影响范围。描述应该清晰地描述代码变更的内容。|
| [Conventional Commits规范 ↗](https://www.conventionalcommits.org/) | Conventional Commits是一种通用的Git Commit规范，它要求Commit message必须包含三个部分：类型、作用域和描述。类型可以是feat、fix、docs、style、refactor、test、build等。作用域是可选的，用于表示代码变更的影响范围。描述应该清晰地描述代码变更的内容。Conventional Commits还支持关键词，用于表示代码变更的重要性，例如：BREAKING CHANGE表示这个Commit会破坏向后兼容性。|
| [Gitmoji规范 ↗](https://github.com/carloscuesta/gitmoji) | Gitmoji是一种基于Emoji表情符号的Git Commit规范，它要求Commit message必须包含一个Emoji表情符号，用于表示代码变更的类型。例如：:sparkles:表示新增功能，:bug:表示修复Bug，:pencil2:表示修改文档等等。Gitmoji规范还支持在Emoji后面添加一个简短的描述，用于更详细地描述代码变更的内容。|

下面是每种规范的格式的列表：

## Angular 规范

Angular 规范的格式为：

```shell
<type>[(scope)]: <subject>

[body]

[footer]

# e.g.
# slim
feat: add user management module

# fully
feat(users): add user management module

This commit adds the user management module to the project.

Closes #123
```

其中，`<type>` 表示 commit 的类型，`[scope]` 表示 commit 的影响范围，`<subject>` 表示 commit 的简短描述，`[body]` 表示 commit 的详细描述，`<footer>` 表示 commit 的元信息，如关闭 issue、引入变更等。

下面是每种type的含义与作用：

- `feat`：新增功能，例如新的页面、新的API等。
- `fix`：修复问题，例如修复 bug、修复样式等。
- `docs`：修改文档，例如修改README、添加注释等。
- `style`：修改样式，例如修改CSS、修改UI等。
- `refactor`：重构代码，例如重构函数、重构类等。
- `test`：修改测试用例，例如添加测试、修改测试等。
- `chore`：修改构建过程或工具，例如修改打包脚本、修改工具配置等。
- `perf`：优化性能，例如提高页面加载速度、减少服务器负载等。
- `ci`：修改持续集成流程，例如修改自动化测试、部署流程等。
- `build`：修改构建过程，例如修改打包脚本、修改构建配置等。
- `revert`：撤销之前的提交。

## Conventional Commits 规范

Conventional Commits 规范的格式为：

```shell
<type>[scope]: <description>

[body]

[footer]

# e.g.
# slim
feat: add user management module

# fully
feat(users): add user management module

This commit adds the user management module to the project.

Closes #123
```

其中，`<type>` 表示 commit 的类型，`[scope]` 表示 commit 的影响范围，`<description>` 表示 commit 的简短描述，`[body]` 表示 commit 的详细描述，`[footer]` 表示 commit 的元信息。

下面是每种type的含义与作用：

- `feat`：新增功能，例如新的页面、新的API等。
- `fix`：修复问题，例如修复 bug、修复样式等。
- `build`：修改构建过程，例如修改打包脚本、修改构建配置等。
- `chore`：修改构建过程或工具，例如修改打包脚本、修改工具配置等。
- `ci`：修改持续集成流程，例如修改自动化测试、部署流程等。
- `docs`：修改文档，例如修改README、添加注释等。
- `style`：修改样式，例如修改CSS、修改UI等。
- `refactor`：重构代码，例如重构函数、重构类等。
- `perf`：优化性能，例如提高页面加载速度、减少服务器负载等。
- `test`：修改测试用例，例如添加测试、修改测试等。
- `revert`：撤销之前的提交。


## Gitmoji 规范

Gitmoji 规范的格式为：

```shell
<gitmoji> <description>

[body]

# e.g.
# slim
✨ add user management module

# fully
✨ add user management module

This commit adds the user management module to the project.
```

其中，`<gitmoji>` 是一个表情符号，表示 commit 的类型和含义，`<description>` 表示 commit 的简短描述 ,`[body]`?: commit 的详细描述。

下面是每种type的含义与作用：

- ✨ `:sparkles:`：新增功能。
- 🐛  `:bug:`：修复 bug。
- 📚 `:books:`：修改文档。
- 💄 `:lipstick:`：修改样式。
- ♻️ `:recycle:`：重构代码。
- ✅ `:white_check_mark:`：修改测试用例。
- 🔧 `:wrench:`：修改构建过程或工具。
- 🚀 `:rocket:`：优化性能。
- 💚 `:green_heart:`：修改持续集成流程。
- 📦 `:package:`：修改构建过程。
- ⏪ `:rewind:`：撤销之前的提交。

## 小结

从以上可以看出 Conventional Commits 规范 与 Angular 规范有比较多的相同之处。是的，Conventional Commits 规范借鉴了 Angular 规范。事实上，Conventional Commits 规范的创始人 Tim Pope 是 Karma 团队的成员，他在开发 Karma 过程中使用了 Angular 规范，认为这个规范非常有用。因此，他在 Angular 规范的基础上，扩充和修改了一些内容，提出了 Conventional Commits 规范。可以说，Conventional Commits 规范是在 Angular 规范的基础上发展而来的，但是相对于 Angular 规范，Conventional Commits 规范更加通用，可以适用于更多的项目和开发语言。

### Angular 规范和 Conventional Commits 规范在某些方面存在一些不同，具体如下：

- **Header 格式不同**：Angular 规范要求 Header 必须包含 Type 字段和可选的 Scope 字段，如 "feat(core): add new feature"；而 Conventional Commits 规范要求 Header 必须包含 Type 和 Subject 字段，Scope 字段是可选的，如 "feat: add new feature"。

- **Type 值的定义略有不同**：Angular 规范和 Conventional Commits 规范都定义了一些 Type 值，但有些值的含义略有不同。例如，Conventional Commits 规范将 "build" 和 "ci" 两个 Type 值分别定义为构建和持续集成修改，而 Angular 规范将它们合并为 "build"。

- **Conventional Commits 规范定义了特殊的 Type 值**：Conventional Commits 规范定义了一些特殊的 Type 值，如 "feat!" 和 "fix!"，用于表示不兼容的新功能或修复问题。而 Angular 规范没有这样的定义。

需要注意的是，Angular 规范和 Conventional Commits 规范都是针对 commit message 的规范，可以根据实际需求和开发规范选择使用。


### Gitmoji 规范与 Angular 规范的不同点

Gitmoji 规范和 Angular 规范都是用于规范 commit message 的规范，但它们之间存在一些不同之处，具体如下：

1. 使用的格式不同：Angular 规范使用的是文本格式的 commit message，而 Gitmoji 规范使用的是 emoji 表情符号和文本组合的 commit message，例如 ":sparkles: add new feature"。

2. 定义的 Type 值不同：Angular 规范和 Conventional Commits 规范定义了一些 Type 值，例如 "feat"、"fix" 等。而 Gitmoji 规范使用的是 emoji 表情符号来表示不同的 Type，例如 ":sparkles:" 表示新功能，":bug:" 表示修复 bug。

3. 定义的提交类型不同：Gitmoji 规范定义了更多的 emoji 表情符号来表示不同类型的提交，例如 ":construction:" 表示进行中的工作，":poop:" 表示添加或更新测试用例，":truck:" 表示移动或重命名文件等。而 Angular 规范只定义了一些常见的提交类型。

4. 可读性和可理解性不同：Gitmoji 规范使用 emoji 表情符号来表示不同类型的提交，可以提高 commit message 的可读性和可理解性，使得团队成员更容易理解代码库的变化。同时，Gitmoji 规范还可以增加一些趣味性，让提交记录更有生命力。而 Angular 规范使用的是文本格式的 commit message，可读性和可理解性相对较低。

需要注意的是，Angular 规范和 Gitmoji 规范都是可选的规范，可以根据实际需求和开发规范选择使用。


# 强制 commit 规范

从上面知道了有Angular 规范、Conventional Commits 规范和 Gitmoji 规范。当然，我们可以自发遵循的这些规范去编写 commit，可是人不是机器，最大的特性是混乱，难免有出错的时候。因此，需要一些工具来辅助输出符合规范的commit。

下面从两个方向去操作：

1. 基础：添加 commit 语法检测；

2. 优化：添加工具编写 commit，提供易用性。

## commit 语法检

[Commitlint ↗](https://commitlint.js.org/#/?id=getting-started) 是一个用于检查 commit message 是否符合规范的工具，可以自定义规则和配置。它支持多种规范，如 Angular 规范、Conventional Commits 规范、ESLint 规范等。



常用的遵循 Angular 规范、Conventional Commits 规范和 Gitmoji 规范的工具：

| 工具名称 | 描述 | 支持的规范 |
| --- | --- | --- |
| [Commitizen ↗](https://github.com/commitizen/cz-cli) | 一个用于生成符合规范的 commit message 的命令行工具。可以使用预设的配置或自定义配置。 | Angular 规范、Conventional Commits 规范、Gitmoji 规范等 |
| [Commitlint ↗](https://github.com/conventional-changelog/commitlint) | 一个用于检查 commit message 是否符合规范的工具。可以自定义规则和配置。 | Angular 规范、Conventional Commits 规范等 |
| [Semantic Release ↗](https://github.com/semantic-release/semantic-release) | 一个用于自动化版本控制和发布的工具。支持 Conventional Commits 规范。 | Conventional Commits 规范 |
| [Gitmoji CLI ↗](https://github.com/carloscuesta/gitmoji-cli) | 一个用于在命令行中快速添加 Gitmoji 表情符号的工具。可以自定义配置。 | Gitmoji 规范 |

需要注意的是，以上工具都是非常优秀的 commit message 规范工具，可以帮助开发者规范提交记录，提高代码质量和可维护性。开发者可以根据自己的需求选择适合自己的工具。


[`@commitlint/config-conventional`] 是 commitlint 的规则


| Husky | 一个 Git 钩子工具，可用于在 Git 操作前或后执行脚本，常用于配合 Commitlint 进行 commit message 的校验。 | - |


[`@commitlint/config-conventional`]:https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional


## Angular规范 与 Conventional Commits规范

Angular 规范和 Conventional Commits 规范都是用于规范 commit message 的规范。

### Angular 规范

Angular 规范要求每个 commit message 都包含三个部分：Header、Body 和 Footer。其中，Header 包含一个必填字段和一个可选字段，必填字段为 Type，可选字段为 Scope。Body 和 Footer 都是可选的，用于提供更详细的信息。Type 字段包含以下值：


- feat：新功能
- fix：修复问题
- docs：文档修改
- style：代码格式修改，不影响代码逻辑
- refactor：重构代码，既不修复错误也不添加功能
- perf：性能优化
- test：添加或修改测试代码
- build：构建系统或外部依赖项修改
- ci：持续集成修改
- chore：其他修改，如修改构建流程或辅助工具等
- revert：回滚到之前的提交

### Conventional Commits规范

Conventional Commits 规范要求每个 commit message 都包含三个部分：Type、Scope 和 Subject。其中，Type 和 Subject 是必填的，Scope 是可选的。Type 包含以下值：

- feat：新功能
- fix：修复问题
- docs：文档修改
- style：代码格式修改，不影响代码逻辑
- refactor：重构代码，既不修复错误也不添加功能
- perf：性能优化
- test：添加或修改测试代码
- build：构建系统或外部依赖项修改
- ci：持续集成修改
- chore：其他修改，如修改构建流程或辅助工具等
- revert：回滚到之前的提交
- feat!: 不兼容的新功能
- fix!: 不兼容的修复问题
- docs!: 不兼容的文档修改
- style!: 不兼容的代码格式修改
- refactor!: 不兼容的重构代码
- perf!: 不兼容的性能优化
- test!: 不兼容的添加或修改测试代码
- build!: 不兼容的构建系统或外部依赖项修改
- ci!: 不兼容的持续集成修改
- chore!: 不兼容的其他修改，如修改构建流程或辅助工具等

需要注意的是，Angular 规范和 Conventional Commits 规范都是针对 commit message 的规范，可以根据实际需求和开发规范选择使用。
