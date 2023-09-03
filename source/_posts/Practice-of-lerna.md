---
title: Practice of lerna
excerpt: Practice of lerna
date: 2023-09-02 13:11:55
tags:
  - writting
categories:
---

# 前言

最近的学习内容有比较多方法论的实践，故考虑需要个仓库存放实践内容相关的内容。对于这些实践内容，我的想法是：它们唯一的共同点只是它们是“实践内容”，其他方面都应该隔离，放在一起仅仅是方便查阅与管理。同时不希望建立太多的 repository，散落在各处。故有使用 Monorepo 相关工具管理的想法。

粗略对比常见的几个对 Monorepo 实践的工具（[Lerna]、[Yarn Workspaces] 和 [Pnpm Workspaces]）后，考虑我建立大仓库的出发点，最终选择了 [Lerna]。

背景：

- 系统：WSL2-Debian 12；

- 仓库：[isaaxite/practices]

- IDE: VS Code

- 代码托管平台：Github

- 大仓库包管理工具：pnpm

# 初始化

```shell
# ~/workspace

git clone git@github.com:isaaxite/practices.git

cd practices
```

安装 lerna：

```shell
pnpm add lerna --save-dev
```

习惯性看看 `--help`：

```shell
$ npx lerna --help
Usage: cli.js <command> [options]

Commands:
  cli.js add-caching          Interactive prompt to generate task runner configuration
  cli.js changed              List local packages that have changed since the last tagged release     [aliases: updated]
  cli.js clean                Remove the node_modules directory from all packages
  cli.js create <name> [loc]  Create a new lerna-managed package
  cli.js diff [pkgName]       Diff all packages or a single package since the last release
  cli.js exec [cmd] [args..]  Execute an arbitrary command in each package
  cli.js import <dir>         Import a package into the monorepo with commit history
  cli.js info                 Prints debugging information about the local environment
  cli.js init                 Create a new Lerna repo or upgrade an existing repo to the current version of Lerna
  cli.js list                 List local packages                                                  [aliases: ls, la, ll]
  cli.js publish [bump]       Publish packages in the current project
  cli.js repair               Runs automated migrations to repair the state of a lerna repo
  cli.js run <script>         Run an npm script in each package that contains that script
  cli.js watch                Runs a command whenever packages or their dependents change.
  cli.js version [bump]       Bump version of packages changed since the last release
  cli.js add <pkg> [globs..]  The "add" command was removed by default in v7, and is no longer maintained.
  cli.js bootstrap            The "bootstrap" command was removed by default in v7, and is no longer maintained.
  cli.js link                 The "link" command was removed by default in v7, and is no longer maintained.

Global Options:
      --loglevel       What level of logs to report.                                            [string] [default: info]
      --concurrency    How many processes to use when lerna parallelizes tasks.                    [number] [default: 6]
      --reject-cycles  Fail if a cycle is detected among dependencies.                                         [boolean]
      --no-progress    Disable progress bars. (Always off in CI)                                               [boolean]
      --no-sort        Do not sort packages topologically (dependencies before dependents).                    [boolean]
      --max-buffer     Set max-buffer (in bytes) for subcommand execution                                       [number]
  -h, --help           Show help                                                                               [boolean]
  -v, --version        Show version number                                                                     [boolean]

When a command fails, all logs are written to lerna-debug.log in the current working directory.

For more information, check out the docs at https://lerna.js.org/docs/introduction

```

使用 lerna 初始化项目

```shell
npx lerna init --dryRun
```

Oops! 失败了

```shell
# isaac @ ISAACGAN-PC0 in ~/workspace/practices on git:main x [14:04:06]
$ npx lerna init --dryRun
lerna notice cli v7.2.0
lerna ERR! Cannot initialize lerna because your package manager has not been configured to use `workspaces`, and you have not explicitly specified any packages to operate on
lerna ERR! See https://lerna.js.org/docs/getting-started#adding-lerna-to-an-existing-repo for how to resolve this
```

从异常信息中得知，当前项目被识别为“已存在的仓库”。参考 lerna 对于“已存在的仓库”的指引进行初始化。

```shell
# isaac @ ISAACGAN-PC0 in ~/workspace/practices on git:main x [14:08:45]
$ npx lerna init --packages="packages/*"
lerna notice cli v7.2.0
lerna info Applying the following file system updates:
CREATE lerna.json
lerna info Git is already initialized
lerna info Using pnpm to install packages
lerna success Initialized Lerna files
lerna info New to Lerna? Check out the docs: https://lerna.js.org/docs/getting-started
```

初始化后增加了 `lerna.json` 文件，见下。

```shell
.
├── lerna.json
├── LICENSE
├── node_modules
│   └── lerna -> .pnpm/lerna@7.2.0/node_modules/lerna
├── package.json
├── pnpm-lock.yaml
└── README.md
```

`lerna.json` 的初始内容：

```json
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "version": "0.0.0",
  "packages": [
    "packages/*"
  ],
  "npmClient": "pnpm"
}
```

lerna.json文件主要配置如下:

- $schema: 指定配置文件结构的JSON schema

- version: 项目的版本号策略,比如固定、日期等

- packages: 指定包目录,这里定义在packages下所有一级子目录为独立包

- npmClient: 指定所使用的包管理工具
  
  - "yarn": 默认使用Yarn
  - "npm": 使用NPM
  - "pnpm": 使用PNPM
  - 其他工具名: 比如"my-custom-npm"

# 新建包

```shell
npx lerna create eslint-security
```

命令执行详情见[附录](#命令详情)。

新包的目录结构：

```shell
.
├── lib
│   └── eslint-security.js
├── package.json
├── README.md
└── __tests__
    └── eslint-security.test.js

3 directories, 4 files
```

新包 `package.json` 的初始内容见 [附录](#新包_`package.json`_的内容)。

*根目录下的 `lerna.json` 内容在新建包后未见变化。*

删除已有包：

见上面的 [`--help`](#初始化)，lerna 未提供删除已有包的命令。因此，需要手动删除。参考上面新建包后大仓库的变化，直接删除包对应目录是安全的。




# 附录

## `lerna create` 新建包

### 命令详情

![](./Practice-of-lerna/lerna%20create%20pkg.gif)

### 新的 `package.json` 的内容

```json
{
  "name": "eslint-security",
  "version": "0.0.0",
  "description": "practice eslint-plugin-security",
  "keywords": [
    "practice",
    "eslint-plugin-security"
  ],
  "author": "isaaxite <isaacgun@outlook.com>",
  "homepage": "https://github.com/isaaxite/practices#readme",
  "license": "MIT",
  "main": "lib/eslint-security.js",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/isaaxite/practices.git"
  },
  "scripts": {
    "test": "node ./__tests__/eslint-security.test.js"
  },
  "bugs": {
    "url": "https://github.com/isaaxite/practices/issues"
  }
}
```

## 参考

- [Lerna - Getting Started](https://lerna.js.org/docs/getting-started)


<!-- ref defined -->

[Lerna]:https://lerna.js.org/
[Yarn Workspaces]:https://classic.yarnpkg.com/lang/en/docs/workspaces/
[Pnpm Workspaces]:https://pnpm.io/workspaces
[isaaxite/practices]:https://github.com/isaaxite/practices
