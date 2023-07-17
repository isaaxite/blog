---
title: Automated Changelog Manual
date: 2023-07-13 11:06:20
tags:
categories:
excerpt: Automated Changelog Manual
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

- `feat`：新功能
- `fix`：修复问题
- `docs`：文档修改
- `style`：代码格式修改，不影响代码逻辑
- `refactor`：重构代码，既不修复错误也不添加功能
- `perf`：性能优化
- `test`：添加或修改测试代码
- `build`：构建系统或外部依赖项修改
- `ci`：持续集成修改
- `chore`：其他修改，如修改构建流程或辅助工具等
- `revert`：回滚到之前的提交

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

- `feat`：新功能
- `fix`：修复问题
- `docs`：文档修改
- `style`：代码格式修改，不影响代码逻辑
- `refactor`：重构代码，既不修复错误也不添加功能
- `perf`：性能优化
- `test`：添加或修改测试代码
- `build`：构建系统或外部依赖项修改
- `ci`：持续集成修改
- `chore`：其他修改，如修改构建流程或辅助工具等
- `revert`：回滚到之前的提交
- `feat!`: 不兼容的新功能
- `fix!`: 不兼容的修复问题
- `docs!`: 不兼容的文档修改
- `style!`: 不兼容的代码格式修改
- `refactor!`: 不兼容的重构代码
- `perf!`: 不兼容的性能优化
- `test!`: 不兼容的添加或修改测试代码
- `build!`: 不兼容的构建系统或外部依赖项修改
- `ci!`: 不兼容的持续集成修改
- `chore!`: 不兼容的其他修改，如修改构建流程或辅助工具等

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

2. 优化：添加工具辅助编写 commit，提高易用性。

## Commit 语法检测

[Commitlint ↗] 是一个用于检查 commit message 是否符合规范的工具，可以自定义规则和配置。它支持多种规范，如 Angular 规范、Conventional Commits 规范、ESLint 规范等。

[Commitlint ↗] 的作用仅仅是检测 Commit 语法。还需要使用 Git Hook （`commit-msg`）拦截 `git commit` 动作以达到强制执行规范的目的。

> **commit-msg**
> This hook is invoked by [git-commit[1]](https://git-scm.com/docs/git-commit) and [git-merge[1]](https://git-scm.com/docs/git-merge), and can be bypassed with the `--no-verify` option. It takes a single parameter, the name of the file that holds the proposed commit log message. Exiting with a non-zero status causes the command to abort.
>
> <mark>The hook is allowed to edit the message file in place, and can be used to normalize the message into some project standard format. It can also be used to refuse the commit after inspecting the message file.</mark>
>
> The default commit-msg hook, when enabled, detects duplicate `Signed-off-by` trailers, and aborts the commit if one is found.
>
> Refenrence: [githooks - Hooks used by Git]


[Husky ↗](https://typicode.github.io/husky/) 是一个 Git hook 工具，它可以在 Git 执行特定操作时自动触发预定义的脚本。常用于配合 Commitlint 进行 commit message 的校验。与原生的 Git hook 相比，Husky 有以下优点：

- **易于使用**：Husky 提供了简单易用的 API，可以轻松地在项目中添加和配置 Git hook。与原生的 Git hook 相比，Husky 的配置更加直观和简单，不需要手动编写脚本。

- **跨平台支持**：Husky 可以在 Windows、Linux、macOS 等多个平台上运行，而原生的 Git hook 可能会因为操作系统和 shell 的不同而产生兼容性问题。

- **更强大的功能**：Husky 支持多个 Git hook，可以在不同的 Git 操作时自动触发相应的任务。而原生的 Git hook 只支持有限的几个 hook，需要手动编写脚本来实现更复杂的功能。

- **安全性**：Husky 的配置文件存储在项目的 package.json 文件中，这意味着可以将配置文件提交到代码仓库中进行版本控制，保证配置的安全性和一致性。而原生的 Git hook 需要手动将 hook 脚本添加到 .git/hooks 目录中，容易被意外覆盖或删除。

*因此，接下来需要做的事情是，安装 Husky，配置 `commit-msg` 拦截`git commit` 动作，再安装 Commitlint 对拦截到的 commit 信息进行校验。*

### 安装 Husky

```shell
# npm
npm install husky --save-dev

# pnpm
pnpm add husky --save-dev
```

使用 Husky 安装 Git Hooks

```shell
# npx 调用 局部命令 husky 
npx husky install

# 直接路径访问局部命令 husky
./node_modules/.bin/husky install
```

<details open>
  <summary><strong>💡 npx 是什么？</strong></summary>
  <blockquote>
    <br/>
    <p><code>npx</code>是一个Node.js命令行工具，它提供了一种方便的方式来运行本地安装的Node.js包中的可执行文件。npx的作用是在不全局安装包的情况下，运行这些包中的命令。</p>
    <p>通常情况下，在运行命令行工具时，需要全局安装相关的包和依赖项。但是，这种方式可能会导致一些问题，例如不同版本的包之间的冲突，或者需要手动更新全局安装的包等。<code>npx</code>提供了一个解决方案，可以在不全局安装包的情况下，运行这些包中的命令。</p>
    <p>使用<code>npx</code>，可以直接在命令行中指定需要运行的包和命令，<code>npx</code>将会自动查找并运行该包中的命令。例如，可以使用以下命令运行&quot;<code>create-react-app</code>&quot;包中的命令来创建一个新的React应用程序：</p>
    <pre><code>npx create-react-app my-app</code></pre>
    <p>在这个例子中，<code>npx</code>将在本地查找&quot;<code>create-react-app</code>&quot;包，并运行它中的&quot;<code>create-react-app</code>&quot;命令，然后使用&quot;<code>my-app</code>&quot;作为应用程序的名称创建一个新的React应用程序。</p>
    <p>更多 npx 相关信息可参考：<a href="https://docs.npmjs.com/cli/v9/commands/npx">Npx | Run a command from a local or remote npm package</a></p>
    <br/>
  </blockquote>
</details>
<br/>

添加 `prepare` 脚本到 `package.json` 的 `scripts` 中，使得在新环境初始化项目时，自动安装 Git Hooks。

📢 *此为可选操作，不做也不影响后续操作，但是推荐执行*

```shell
npm pkg set scripts.prepare="husky install"

# 执行以上命令得到的结果是：
{
  "scripts": {
+    "prepare": "husky install" 
  }
}
```

> **prepare (since npm@4.0.0)**
>
> Runs BEFORE the package is packed
> Runs BEFORE the package is published
> <mark>Runs on local "npm install" without any arguments</mark>
> Run AFTER `prepublish`, but BEFORE `prepublishOnly`
> NOTE: If a package being installed through git contains a `prepare` script, its `dependencies` and `devDependencies` will be installed, and the prepare script will be run, before the package is packaged and installed.
>
> Refenrence: [How npm handles the "scripts" field]

Husky 配置 Hooks 的方式如下

```shell
npx husky add .husky/<git hook> "<command that needs to be executed when the hook is triggered>"

# e.g.
# 将在 `git commit` 执行前触发 `npm test` 命令
npx husky add .husky/pre-commit "npm test"
```


至此，Git Hooks 的准备工作已经完成，`commit-msg` 钩子的配置要在 commitlint 安装完成后配置。

### 安装 Commitlint

`@commitlint` 是一个由多个相关包组成的集合，可以根据需要安装和配置这些包来实现不同的功能。

`@commitlint` 的核心包是`@commitlint/cli`，它提供了命令行工具，用于检查提交信息是否符合规范。`@commitlint/cli`可以通过命令行参数来指定规范，也可以通过配置文件来指定规范。例如，可以使用`@commitlint/config-conventional`包来定义一个常规的提交信息规范，然后使用`@commitlint/cli`来检查提交信息是否符合该规范。

除了`@commitlint/cli`之外，@commitlint还提供了其他几个相关包，包括：

- `@commitlint/load`: 提供了一个函数，用于加载配置文件并解析它们，以便`@commitlint/cli`可以使用它们进行检查。
- `@commitlint/config-conventional`: 提供了一组常见的规范，用于检查常规的Git提交信息格式。
- `@commitlint/config-angular`: 提供了一个用于检查Angular项目的提交信息规范。
- `@commitlint/config-lerna-scopes`: 提供了一个用于检查Lerna项目的提交信息规范。
- [更多相关包...](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint)

这些包可以根据具体需要进行安装和配置。

---

📢 *根据当前的需求，接下来则安装 `@commitlint/cli` 和 `@commitlint/config-conventional`(Conventional Commits 规范)*


```shell
# npm
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# pnpm
pnpm add --save-dev @commitlint/config-conventional @commitlint/cli
```

添加 配置文件

`@commitlint/cli` 支持以下这些默认的配置文件名：

- `commitlint.config.js`
- `.commitlintrc.js`
- `.commitlintrc`
- `.commitlintrc.json`
- `.commitlintrc.yml`

为了避免切换模块化语法问题，接下来使用 `.commitlintrc.yml` 作为配置文件

```yml
# .commitlintrc.yml

# 使用 extends 引用 @commitlint/config-conventional 规范
extends:
  - '@commitlint/config-conventional'
```

更多的配置项参考：[Commitlint > Configuration]

![Test Commitlint-CLI](./Automated-Changelog-Manual/test_commitlint.gif)


### Husky + Commitlint

使用 Husky 设置 `commit-msg` 钩子执行 `commitlint-cli`, 对 `git commit` 动作提交的信息进行校验。

```shell
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

在这个命令中，`--no` 参数是用来禁用 `npx` 的默认行为的。

默认情况下，`npx` 会在运行目标命令之前检查本地是否已经安装了目标命令所在的包，如果没有安装，则会先安装该包，然后再运行目标命令。这种行为通常是有用的，因为它可以确保运行的命令使用的是最新的包版本，并且可以避免不同版本之间的兼容性问题。

但是，在某些情况下，我们可能不想让 `npx` 自动安装包，而是希望使用本地已经安装的包。在这种情况下，可以使用 `--no` 参数来禁用 `npx` 的默认行为，以便直接使用本地安装的包。

在这个具体的命令中，`--no` 参数用来禁用 `npx` 自动安装 `commitlint` 包，而是使用本地已经安装的 `commitlint` 包。

`--edit ${1}` 是用来编辑指定文件的第一个参数的提交信息，`${1}` 代表第一个参数的值，通常是一个文件路径。这个命令的作用是使用本地安装的 `commitlint` 包来检查指定文件的提交信息是否符合规范，并在编辑器中打开该文件，以便修改提交信息。

![Commitlint by hook](./Automated-Changelog-Manual/commitlint_by_hook.gif)

## 半自动编写 Commit

以下是使用 Markdown 表格输出 @commitlint/prompt-cli 和 Commitizen 的信息：

| 工具名称 | 描述 | npm周下载量（2023/07/17） |
| --- | --- | --- |
| [@commitlint/prompt-cli ↗](https://www.npmjs.com/package/@commitlint/prompt-cli) | 一个命令行交互式工具，用于帮助开发人员规范化提交信息。它使用 `commitlint` 配置文件中定义的规则来检查提交信息，确保它们符合预定的格式和风格。该工具还提供了一些提示，帮助开发人员更好地理解如何编写符合规则的提交信息。 | *67,802* |
| [Commitizen ↗](github.com/commitizen/cz-cli) | 一个命令行交互式工具，用于帮助开发人员规范化提交信息。它使用预定义的提交信息模板来引导开发人员编写符合规则的提交信息，并根据模板中的规则进行验证。与@commitlint/prompt-cli不同的是，Commitizen不检查提交信息是否符合commitlint配置文件中定义的规则，而是依靠模板中的规则来确保提交信息的正确性。此外，Commitizen还提供了一些功能，例如自动填充提交信息，以帮助开发人员更快地编写提交信息。 | *917,033* |


```shell
# npm
npm add @commitlint/prompt-cli --save-dev

# pnpm
pnpm add @commitlint/prompt-cli --save-dev
```

![Test prompt-cli](./Automated-Changelog-Manual/test_prompt-cli.gif)



# CHANGELOG自动化

`conventional-changelog-cli` 是一个命令行工具，用于生成符合规范的 changelog。它可以根据项目的 commit message 格式，自动解析 commit 信息，并将其转换为人类可读的 changelog。

这个工具的基本原理是将符合规范的 commit message 按照类型（type）和 scope 等信息进行分类，然后根据分类的结果生成 changelog。

`conventional-changelog-cli` 支持使用多种预设（preset）来生成 changelog，包括 `angular`、`atom`、`codemirror`、`conventionalcommits`、`ember`、`eslint`、`express`、`jquery` 和 `jshint` 等。你也可以使用自定义的配置文件来生成 changelog。

以下是 `conventional-changelog-cli` 的一些常用命令：

- `conventional-changelog`: 生成 changelog，默认使用 Angular 规范。

- `conventional-changelog -p [preset]`: 生成指定预设的 changelog。

- `conventional-changelog -i [file]`: 将 changelog 写入到指定文件中。

- `conventional-changelog -s`: 将 changelog 添加到文件的开头而不是结尾。

- `conventional-changelog --release-count [number]`: 指定要包括的版本数量。

- `conventional-changelog --config [file]`: 使用自定义的配置文件生成 changelog。

通过 `conventional-changelog-cli`，你可以方便地生成符合规范的 changelog，并且可以根据自己的需要进行自定义配置和预设，以满足项目的需求。

<blockquote>
  <br/>
  <pre><code class="language-shell">npm install -g conventional-changelog-cli
  cd my-project
  conventional-changelog -p angular -i CHANGELOG.md -s
  </code></pre>
  <p>This will not overwrite any previous changelogs. The above generates a changelog based on commits since the last semver tag that matches the pattern of &quot;Feature&quot;, &quot;Fix&quot;, &quot;Performance Improvement&quot; or &quot;Breaking Changes&quot;.</p>
  <br/>
</blockquote>

- 配置不方便

- 难以找到或没有官方的配置文档

## 版本 commit

### 手动设置

```shell
npm version patch -m "chore: bump version to %s"
```

### 配置文件设置

```shell
commit-hooks=true
tag-version-prefix=v
message="chore: bump version to %s"
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

## `conventional-changelog-cli` 配置文件详细设置

以下是可以在 `conventional-changelog-cli` 的配置文件中添加的一些自定义选项及其说明：

- `projectName`: 项目名称，用于生成 changelog 标题。
- `projectUrl`: 项目 URL，用于生成 changelog 标题和 commit URL。
- `authorName`: 作者名称，用于生成 commit URL。
- `authorEmail`: 作者邮箱，用于生成 commit URL。
- `issueTrackerUrl`: issue 跟踪器 URL，用于生成 issue URL。
- `versionFile`: 版本信息文件路径，用于从文件中获取版本信息。
- `exclude`: 要排除的 commit 类型列表。
- `include`: 要包含的 commit 类型列表。
- `types`: 使用自定义的 commit 类型和部分标题。
- `commitFormat`: 自定义 commit message 的格式。
- `headerFormat`: 自定义头部的格式。
- `footerFormat`: 自定义尾部的格式。
- `notesSort`: 自定义注释的排序方式。
- `commitGroupsSort`: 自定义 commit 组的排序方式。
- `commitsSort`: 自定义 commit 的排序方式。
- `hideUnreleased`: 如果为 `true`，则不包括未发布的 commit。
- `hideTags`: 如果为 `true`，则不包括版本标签。
- `reverse`: 如果为 `true`，则按照相反的顺序生成 changelog。
- `normalize`: 如果为 `true`，则规范化 commit message。

你可以在 `.conventional-changelogrc` 或 `.conventional-changelogrc.js` 文件中添加这些自定义选项，以满足项目的需求。

## 参考

- [githooks - Hooks used by Git]
- [How npm handles the "scripts" field]
- [Commitlint > Configuration]
- [Npx | Run a command from a local or remote npm package]
- [Husky | Modern native git hooks made easy](https://typicode.github.io/husky/)
- [Commitlint | Helps your team adhere to a commit convention](https://commitlint.js.org/#/)

<!-- Link Defined -->
[Commitlint ↗]: https://commitlint.js.org/#/?id=getting-started

[githooks - Hooks used by Git]: https://git-scm.com/docs/githooks#_commit_msg

[`@commitlint/config-conventional`]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional

[How npm handles the "scripts" field]: https://docs.npmjs.com/cli/v9/using-npm/scripts

[`@commitlint/cli`]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/cli

[`@commitlint/config-conventional`]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional

[`@commitlint/load`]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/load

[`@commitlint/config-angular`]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-angular

[`@commitlint/config-lerna-scopes`]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-lerna-scopes

[`Lerna`]: https://github.com/lerna/lerna

[Commitlint > Configuration]: https://commitlint.js.org/#/reference-configuration?id=configuration

[Npx | Run a command from a local or remote npm package]: https://docs.npmjs.com/cli/v9/commands/npx


常用的遵循 Angular 规范、Conventional Commits 规范和 Gitmoji 规范的工具：

| 工具名称 | 描述 | 支持的规范 |
| --- | --- | --- |
| [Commitizen ↗](https://github.com/commitizen/cz-cli) | 一个用于生成符合规范的 commit message 的命令行工具。可以使用预设的配置或自定义配置。 | Angular 规范、Conventional Commits 规范、Gitmoji 规范等 |
| [Commitlint ↗](https://github.com/conventional-changelog/commitlint) | 一个用于检查 commit message 是否符合规范的工具。可以自定义规则和配置。 | Angular 规范、Conventional Commits 规范等 |
| [Semantic Release ↗](https://github.com/semantic-release/semantic-release) | 一个用于自动化版本控制和发布的工具。支持 Conventional Commits 规范。 | Conventional Commits 规范 |
| [Gitmoji CLI ↗](https://github.com/carloscuesta/gitmoji-cli) | 一个用于在命令行中快速添加 Gitmoji 表情符号的工具。可以自定义配置。 | Gitmoji 规范 |