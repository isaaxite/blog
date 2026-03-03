---
title: Git Hook实现轻量级自动化部署
date: 2020-05-07 13:20:52
tags:
- 部署发布
- git hook
- 旧文迁移
categories:
- 部署发布
---

# 前言

最近在整理项目，发现以前的一个项目中，发现使用git hook和pm2实现了一个简单的自动化部署，也没有写什么记录，故复记录之。

<!-- more -->

# 正文

![image](https://user-images.githubusercontent.com/25907273/81206194-59d7c700-8ffe-11ea-82b1-d8672393d6c7.png)

## 原理与流程

1. git用户执行git push操作；
2. 远程仓库发现有用户执行了push操作，就会执行一个脚本post-update（钩子）；
3. 在post-update脚本中，将git仓库的代码拷贝到web站点目录下。

## Git 钩子

Git 钩子(hooks)是在 Git 仓库中特定事件(certain points)触发后被调用的脚本。通过钩子可以自定义 Git 内部的相关（如 git push）行为，在开发周期中的关键点触发自定义的行为。Git 含有两种类型的钩子：客户端的和服务器端的。客户端钩子由诸如提交和合并这样的操作所调用，而服务器端钩子作用于诸如接收被推送的提交这样的联网操作。

每个使用git进行版本版本管理的项目都存在hooks，这些hooks存在于项目目录下的`.git/hooks/`：

![image](https://user-images.githubusercontent.com/25907273/81207013-7fb19b80-8fff-11ea-9846-7565991e923a.png)

以上这些就是git hook脚本。简单地说，hook是一种特殊的脚本（代码），仅在满足特定条件时执行。git hooks分别有对应各种操作的hook。每个hook都对应在不同的情况下触发，比如接下来要用到的post-update脚本，则是在检测到push的操作时触发。

## 实现流程

1. 在服务端创建一个裸仓库；
2. 编辑裸仓库中的post-update hook脚本；
3. 本地仓库添加远程裸仓库作为remote。

### 1. 在服务端创建一个裸仓库

什么是裸仓库？

裸仓库与 git init 初使化的仓库不太一样，裸仓库其实相当于通过克隆来的仓库里的.git文件夹，整个裸仓库中只有git索引（index），不包含工作目录。裸仓库只保存了一些配置信息等，肉眼找不到上传的代码。简单说就是一个简单版的git仓库，不能使用常见的git命令，比如`git status`等等。

![image](https://user-images.githubusercontent.com/25907273/81208387-8b05c680-9001-11ea-8cad-8fbcdf45bcff.png)

创建裸仓库很简单：

```shell
# bare.git名字可以任意
git init --bare bare.git
# 或
mkdir bare.git
cd bare.git
git init --bare
```

为什么要创建裸仓库？

裸仓库存在于服务端，是我们要提交代码的目标。我们在本地仓库push代码，就是要push到这个裸仓库。当我们push到这个裸仓库时，就会触发裸仓库响应的git hook——post-update。

### 2. 编辑裸仓库中的post-update hook脚本

在脚本中，你可以写Bash、Python、JavaScript等代码，Git通过Shebang来选择执行代码的解释器。如果要写Bash，Shebang可以是这样：

```shell
#!/usr/bin/bash
```

使用Windows的读者请注意，如果脚本文件含有BOM（字节序标识符），可能会导致一些问题。

```shell
# 去掉sample后缀才会触发
$ cp post-update.sample post-update
```

下面是一个比较简单的hook脚本：

```shell
#!/bin/sh

unset GIT_DIR
# bare-repos是实际要部署代码的目录，这个目录是需要现在服务端创建的
# 当然也可以当前脚本中自动化创建
DIR_ONE=/Users/baohua/workspace/bare-repos/
cd $DIR_ONE

git init
git remote add origin /Users/baohua/workspace/bare.git
git clean -df
git pull origin master

npm run deploy
```
**注意： 一定要unset GIT_DIR清除变量， 不然会引起remote: fatal: Not a git repository: ‘.’错误。**

上面脚本做的事情很简单：
1. 切换到部署目录；
2. 初始化git，在部署目录中添加裸仓库作为remote；
3. 拉取裸仓库中的代码；
4. 执行打包脚本。

接着还需要给 post-update 添加执行权限：

```shell
# chmod +x将所有用户的执行权限添加到现有权限
chmod +x post-update
```

### 3. 本地仓库添加远程裸仓库作为remote

```shell
// 如果测试，并且裸仓库建在本地
git remote add deploy /Users/baohua/workspace/bare.git

// 默认ssh端口号为22时
git remote add deploy user@serverIp:/Users/baohua/workspace/bare.git

// ssh端口号为不22时
git  remote  add  deploy  ssh://user@serverIp:port/Users/baohua/workspace/bare.git
```


# 总结

- 利用每次push到目标仓库都会触发对应git hook的机制，在git hook中进行需要部署的代码从目标仓库中克隆到实际的代码部署目录；
- 实现流程分为三步：
  1. 在服务端创建一个裸仓库；
  2. 编辑裸仓库中的post-update hook脚本；
  3. 本地仓库添加远程裸仓库作为remote。


# 附录

- [Customizing Git - Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [前端自动化工作流中的hooks](https://juejin.im/post/5ce607946fb9a07ef5620e5b)
- [利用Git Hooks自动部署](https://www.jianshu.com/p/c1478bfcb372)
- [用 Git 钩子进行简单自动部署](https://aotu.io/notes/2017/04/10/githooks/index.html)
- [git hook实现代码自动部署](https://blog.csdn.net/u010837612/article/details/70825225?utm_source=itdadao&utm_medium=referral)
- [使用 Git Hook 实现网站的自动部署](https://www.cnblogs.com/wowchky/p/9177036.html)
- [git init 和 git init --bare 的区别？](https://segmentfault.com/q/1010000004683286)
- [使用git hook 实现nodejs项目自动部署](https://segmentfault.com/a/1190000016513388)
- [不会写shell的程序员照样是好前端——用Node.JS实现git hooks](https://www.jianshu.com/p/ef373ea5c61b)
- [“chmod + x”和“chmod 755”有什么区别？](https://ubuntuqa.com/article/2264.html)

