---
title: 初识debin
tags:
- debin
categories:
- [linux]
---

# 前言

本文旨在记录初次安装Debian系统，前端开发者需要安装喝配置的基础环境。包括但不限于系统软件源的替换、基础系统软件、开发软件的安装，以及其他可以优化使用体验的操作。

<!-- more -->

# 软件源

## 国内源
```shell
sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
```

## 更新源

```shell
apt-get update
```

# 系统软件

- git
- vim
- curl
- net-tools：ifconfig命令，方便查看ip

```shell
apt-get install git vim curl -y
```

# 开发软件

- nvm，管理多个node和npm版本；
- yarn，nodejs lib 管理工具
- hexo，blog工具

## nvm

参考：[Isaac Kam's Blog: nvm安装与基本使用](nvm安装与基本使用/#more)

# 体验优化

- zsh，优秀的shell工具；
- Oh My Zsh，zsh的美化插件；

## zsh

```shell
apt-get install zsh -y
```

## Oh My Zsh

参考：https://ohmyz.sh/

![](Snipaste_2023-03-08_11-10-50.png)

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

# 参考

- [Debian说明文档](https://www.debian.org/doc/)
