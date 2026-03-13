---
title: ADB 安装 For Win 10
segment: windows-adb-install
alias: blog/resources/【win】安装ADB/
tags:
  - adb
  - 安卓调试
  - 旧文迁移
categories:
  - [指南]
date: 2022-06-17 17:10:03
---


## 下载

[下载 ADB for Windows](https://developer.android.com/studio/releases/platform-tools)

![ADB for Windows 下载信息](https://assets-amu.pages.dev/blog/58064e0ddf514a219e22db69e7dbb67c.webp)

<!-- more -->

## 解压

![解压得到的内容](https://assets-amu.pages.dev/blog/02512be76de14b79948bb73c4bd20785.webp)

在 platform-tools 目录下运行命令行工具（power shell 或者 cmd）

![在 platform-tools 目录下运行命令行工具的结果](https://assets-amu.pages.dev/blog/363090a2e94b46f69101c41d06237dd8.webp)

## 设置环境变量

我的电脑 > 高级系统设置 > 环境变量 > 编辑 Path 环境变量

增加 platform-tools 目录路径

![设置环境变量 - 增加 platform-tools 目录路径](https://assets-amu.pages.dev/blog/2c4dd95b1ff24d0bbc38641b8399802e.webp)

结果

![增加 platform-tools 目录路径的结果](https://assets-amu.pages.dev/blog/00feed73893f4d84a8e2958e07d91771.webp)

## 附录

### 参考

- <https://www.xda-developers.com/install-adb-windows-macos-linux/#adbsetupwindows>
