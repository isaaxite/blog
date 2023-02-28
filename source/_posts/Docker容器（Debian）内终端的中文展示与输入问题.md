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
