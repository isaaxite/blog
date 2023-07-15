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

Angular 规范要求每个 commit message 都包含三个部分：Header、Body 和 Footer。其中，Header 包含一个必填字段和一个可选字段，必填字段为 Type，可选字段为 Scope。Body 和 Footer 都是可选的，用于提供更详细的信息。

**Type 字段包含以下值：**

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

**Angular 规范的格式为：**

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


## Conventional Commits 规范

Conventional Commits 规范要求每个 commit message 都包含三个部分：Type、Scope 和 Subject。其中，Type 和 Subject 是必填的，Scope 是可选的。

**Type 包含以下值：**

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

**Conventional Commits 规范的格式为：**

```shell
<type>[scope]: <subject>

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

其中，`<type>` 表示 commit 的类型，`[scope]` 表示 commit 的影响范围，`<subject>` 表示 commit 的简短描述，`[body]` 表示 commit 的详细描述，`[footer]` 表示 commit 的元信息。

## Gitmoji 规范

以下是 Gitmoji 规范中一些常用的 emoji 和它们的含义：

- ✨ `:sparkles:`：新增功能
- 🐛  `:bug:`：修复 bug
- 📚 `:books:`：修改文档
- 💄 `:lipstick:`：修改样式
- ♻️ `:recycle:`：重构代码。
- ✅ `:white_check_mark:`：修改测试用例
- 🔧 `:wrench:`：修改构建过程或工具
- 🚀 `:rocket:`：优化性能
- 💚 `:green_heart:`：修改持续集成流程
- 📦 `:package:`：修改构建过程
- ⏪ `:rewind:`：撤销之前的提交

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

## 小结

从以上可以看出 Conventional Commits 规范 与 Angular 规范有比较多的相同之处。是的，Conventional Commits 规范借鉴了 Angular 规范。

事实上，Conventional Commits 规范的创始人 Tim Pope 是 Karma 团队的成员，他在开发 Karma 过程中使用了 Angular 规范，认为这个规范非常有用。因此，他在 Angular 规范的基础上，扩充和修改了一些内容，提出了 Conventional Commits 规范。可以说，Conventional Commits 规范是在 Angular 规范的基础上发展而来的，但是相对于 Angular 规范，Conventional Commits 规范更加通用，可以适用于更多的项目和开发语言。

*以下是 Angular 规范和 Conventional Commits 规范在某些方面存在的一些差异，具体如下：*

- **Header 格式不同**：Angular 规范要求 Header 必须包含 Type 字段和可选的 Scope 字段，如 "feat(core): add new feature"；而 Conventional Commits 规范要求 Header 必须包含 Type 和 Subject 字段，Scope 字段是可选的，如 "feat: add new feature"。

- **Type 值的定义略有不同**：Angular 规范和 Conventional Commits 规范都定义了一些 Type 值，但有些值的含义略有不同。例如，Conventional Commits 规范将 "build" 和 "ci" 两个 Type 值分别定义为构建和持续集成修改，而 Angular 规范将它们合并为 "build"。

- **Conventional Commits 规范定义了特殊的 Type 值**：Conventional Commits 规范定义了一些特殊的 Type 值，如 "feat!" 和 "fix!"，用于表示不兼容的新功能或修复问题。而 Angular 规范没有这样的定义。

Gitmoji 规范的显著特点是供了大量的 emoji 来描述不同类型和目的的 Git 提交，这使得开发者可以更加准确地描述自己的 Git 提交，简单易懂，具有很强的可读性。Commit的格式在一定程度上与前两者有相似之处，从提出时间上看，它算是采百家之长的集大成者了。

Gitmoji 规范的制定者 Carlos Cuesta 在规范的 Github 页面上并没有明确提到他借鉴了哪些规范。然而，从 Gitmoji 规范的内容来看，它借鉴了一些其他的规范和标准，例如：

- **Emoji**：Gitmoji 规范使用 Emoji 表情符号来表示不同类型的提交，这一做法和 Slack、微信等工具中使用 Emoji 表情符号的方式类似。

- **Semantic Versioning**：Gitmoji 规范中使用了类似 Semantic Versioning 的方式来表示版本，例如 ":bookmark:" 表示打标签，":bookmark: v1.0.0" 表示打了一个 v1.0.0 的标签。

- **Conventional Commits**：Gitmoji 规范和 Conventional Commits 规范类似，都是使用 commit message 来描述代码库的变化。不过，Gitmoji 规范使用 Emoji 表情符号来表示不同类型的提交，而 Conventional Commits 规范使用文本标识符来表示。



# 强制 commit 规范

从上面知道了有Angular 规范、Conventional Commits 规范和 Gitmoji 规范。当然，我们可以自发遵循的这些规范去编写 commit，可是人不是机器，最大的特性是混乱，难免有出错的时候。因此，需要一些工具来辅助输出符合规范的commit。

下面从两个方向去操作：

1. 基础：添加 commit 语法检测；

2. 优化：添加工具编写 commit，提供易用性。

## Commit 语法检测

[Commitlint ↗] 是一个用于检查 commit message 是否符合规范的工具，可以自定义规则和配置。它支持多种规范，如 Angular 规范、Conventional Commits 规范、ESLint 规范等。

[Commitlint ↗] 的作用仅仅是检测 Commit 语法。还需要使用 Git Hook （`commit-msg`）拦截 `git commit` 动作以达到强制执行规范的目的。

> **commit-msg**
>This hook is invoked by [git-commit[1]](https://git-scm.com/docs/git-commit) and [git-merge[1]](https://git-scm.com/docs/git-merge), and can be bypassed with the `--no-verify` option. It takes a single parameter, the name of the file that holds the proposed commit log message. Exiting with a non-zero status causes the command to abort.
>
>The hook is allowed to edit the message file in place, and can be used to normalize the message into some project standard format. It can also be used to refuse the commit after inspecting the message file.
>
>The default commit-msg hook, when enabled, detects duplicate `Signed-off-by` trailers, and aborts the commit if one is found.
>
> Refenrence: [githooks - Hooks used by Git]


[Husky ↗](https://typicode.github.io/husky/) 是一个 Git hook 工具，它可以在 Git 执行特定操作时自动触发预定义的脚本。常用于配合 Commitlint 进行 commit message 的校验。与原生的 Git hook 相比，Husky 有以下优点：

- **易于使用**：Husky 提供了简单易用的 API，可以轻松地在项目中添加和配置 Git hook。与原生的 Git hook 相比，Husky 的配置更加直观和简单，不需要手动编写脚本。

- **跨平台支持**：Husky 可以在 Windows、Linux、macOS 等多个平台上运行，而原生的 Git hook 可能会因为操作系统和 shell 的不同而产生兼容性问题。

- **更强大的功能**：Husky 支持多个 Git hook，可以在不同的 Git 操作时自动触发相应的任务。而原生的 Git hook 只支持有限的几个 hook，需要手动编写脚本来实现更复杂的功能。

- **安全性**：Husky 的配置文件存储在项目的 package.json 文件中，这意味着可以将配置文件提交到代码仓库中进行版本控制，保证配置的安全性和一致性。而原生的 Git hook 需要手动将 hook 脚本添加到 .git/hooks 目录中，容易被意外覆盖或删除。

*因此，接下来需要做的事情是，安装 Husky，配置 `commit-msg` 拦截`git commit` 动作，再安装 Commitlint 对拦截到的 commit 信息进行校验。*




常用的遵循 Angular 规范、Conventional Commits 规范和 Gitmoji 规范的工具：

| 工具名称 | 描述 | 支持的规范 |
| --- | --- | --- |
| [Commitizen ↗](https://github.com/commitizen/cz-cli) | 一个用于生成符合规范的 commit message 的命令行工具。可以使用预设的配置或自定义配置。 | Angular 规范、Conventional Commits 规范、Gitmoji 规范等 |
| [Commitlint ↗](https://github.com/conventional-changelog/commitlint) | 一个用于检查 commit message 是否符合规范的工具。可以自定义规则和配置。 | Angular 规范、Conventional Commits 规范等 |
| [Semantic Release ↗](https://github.com/semantic-release/semantic-release) | 一个用于自动化版本控制和发布的工具。支持 Conventional Commits 规范。 | Conventional Commits 规范 |
| [Gitmoji CLI ↗](https://github.com/carloscuesta/gitmoji-cli) | 一个用于在命令行中快速添加 Gitmoji 表情符号的工具。可以自定义配置。 | Gitmoji 规范 |


[`@commitlint/config-conventional`] 是 commitlint 的规则


| Husky | 一个 Git 钩子工具，可用于在 Git 操作前或后执行脚本，常用于配合 Commitlint 进行 commit message 的校验。 | - |


[`@commitlint/config-conventional`]:https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional


## 安装 Commitlint

依赖2个库

- @commitlint/config-conventional

- commitlint/cli

```shell
pnpm add --save-dev @commitlint/{config-conventional,cli}
```

添加 配置文件

```shell
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

设置 配置文件路径

```shell
commitlint --config commitlint.config.js
```

添加 Git Hook 拦截提交的 commit

```shell
npm pkg set scripts.commitlint="commitlint --edit"
npx husky add .husky/commit-msg 'npm run commitlint ${1}'
```

安装 husky

```shell
pnpm add husky --save-dev
```

开启 Git Hook

```shell
npx husky install
```

To automatically have Git hooks enabled after install, edit package.json

```shell
npm pkg set scripts.prepare="husky install"
```







# 附录

## Husky支持的 Git hook

Husky 支持大部分 Git hook，以下是 Husky 支持的 Git hook 列表：

- `applypatch-msg`：在 Git 执行 `git am` 命令时触发
- `pre-applypatch`：在 Git 执行 `git am` 命令前触发
- `post-applypatch`：在 Git 执行 `git am` 命令后触发
- `pre-commit`：在 Git 执行 `git commit` 命令前触发
- `prepare-commit-msg`：在 Git 执行 `git commit` 命令前触发，用于编辑提交信息
- `commit-msg`：在 Git 执行 `git commit` 命令后触发，用于验证提交信息
- `post-commit`：在 Git 执行 `git commit` 命令后触发
- `pre-rebase`：在 Git 执行 `git rebase` 命令前触发
- `post-checkout`：在 Git 执行 `git checkout` 命令后触发
- `post-merge`：在 Git 执行 `git merge` 命令后触发
- `pre-push`：在 Git 执行 `git push` 命令前触发
- `pre-receive`：在 Git 执行 `git push` 命令时，服务端接收到数据之前触发
- `update`：在 Git 执行 `git push` 命令时，服务端接收到数据之后触发
- `post-receive`：在 Git 执行 `git push` 命令后触发
- `post-update`：在 Git 执行 `git push` 命令后触发
- `pre-auto-gc`：在 Git 执行自动垃圾回收之前触发
- `post-rewrite`：在 Git 执行 `git filter-branch` 和 `git commit --amend` 命令后触发
- `sendemail-validate`：在 Git 执行 `git send-email` 命令前触发

以上 Git hook 具体作用可以参考 Git 的官方文档。Husky 可以通过在 package.json 文件的 `husky.hooks` 中定义相应的命令，来自动触发这些 Git hook。例如，在 `husky.hooks` 中定义 `pre-commit` 命令，就可以在每次执行 `git commit` 命令时自动触发该命令。

## 参考

- [githooks - Hooks used by Git]
- [How npm handles the "scripts" field](https://docs.npmjs.com/cli/v9/using-npm/scripts)

<!-- Link Defined -->
[Commitlint ↗]:https://commitlint.js.org/#/?id=getting-started
[githooks - Hooks used by Git]:https://git-scm.com/docs/githooks#_commit_msg