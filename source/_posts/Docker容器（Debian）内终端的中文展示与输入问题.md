---
title: Docker容器（Debian）内终端的中文展示与输入问题
date: 2023-02-28 16:22:11
tags:
- docker
- debian
- linux
categories:
- [linux]
- [docker]
---

# 前言

使用docker容器作为开发环境。以Debian11镜像启动容器，出现两个问题：

1. 无法展示中文，ls输出的都是八进制编码的字符串；
2. 终端无法输入中文，粘贴可以但同学展示为八进制字符串；

![](Snipaste_2023-02-27_20-24-42.png)

<!-- more -->

# locale

经查阅，确定问题是系统语言环境导致，默认使用的语言环境不支持中文编码！

使用 `locale` 查看当前使用的字符集：

```shell
root@docker-desktop:~/workspace# locale

LANG=
LANGUAGE=
LC_CTYPE="POSIX"
LC_NUMERIC="POSIX"
LC_TIME="POSIX"
LC_COLLATE="POSIX"
LC_MONETARY="POSIX"
LC_MESSAGES="POSIX"
LC_PAPER="POSIX"
LC_NAME="POSIX"
LC_ADDRESS="POSIX"
LC_TELEPHONE="POSIX"
LC_MEASUREMENT="POSIX"
LC_IDENTIFICATION="POSIX"
LC_ALL=
```

显然，当前我使用的Debian11镜像默认使用的是`POSIX`字符集！

可以使用 `locale -a` 查看当前系统支持的字符集：

```shell
root@docker-desktop:~/workspace# locale -a
C
C.UTF-8
POSIX
```

在 Debian 使用指南中关于 `locale` 中看到：

> You can set `LANG` or `LC_ALL` to your preferred locale.

然后，将 `LANG` 环境变量设置成 `C.UTF-8`，这个系统支持的中文字符集！

设置方式有多种，在`~/.bashrc`文件、进入容器通过`env`变量设置或者通过`dockerfile`，详细不展开！

设置成功后可以通过 `locale` 命令查看：

```shell
root@docker-desktop:/# locale
LANG=C.UTF-8
LANGUAGE=
LC_CTYPE="C.UTF-8"
LC_NUMERIC="C.UTF-8"
LC_TIME="C.UTF-8"
LC_COLLATE="C.UTF-8"
LC_MONETARY="C.UTF-8"
LC_MESSAGES="C.UTF-8"
LC_PAPER="C.UTF-8"
LC_NAME="C.UTF-8"
LC_ADDRESS="C.UTF-8"
LC_TELEPHONE="C.UTF-8"
LC_MEASUREMENT="C.UTF-8"
LC_IDENTIFICATION="C.UTF-8"
LC_ALL=
```

# 总结

- Debian容器终端无法展示和输入中文，这个问题的原因之一是：系统默认使用不支持中文编码的字符集；

- 可以使用 `locale`查看当前系统使用的字符集，使用`locale -a`列出当前系统支持的字符集；

- 通过设置`LANG` 环境变量可以修改系统使用的字符集；

# 附录

- [Debian使用指南locale篇章](https://wiki.debian.org/Locale)
