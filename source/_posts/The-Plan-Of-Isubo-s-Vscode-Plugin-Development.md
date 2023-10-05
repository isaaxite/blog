---
title: The Plan Of Isubo's Vscode Plugin Development
excerpt: The Plan Of Isubo's Vscode Plugin Development
date: 2023-09-18 12:33:45
tags:
  - writting
categories:
---

计划分多个非向下兼容版本开发，目前想到的暂时有两个，下面先简述第一个版本的主要功能：

- 对 post 文件右键呼出菜单，可以对文章推送，包含更新、创建。

![](./The-Plan-Of-Isubo-s-Vscode-Plugin-Development/architecture-containers.png)

- 选择推送选项后，需要一个 loading 进行防抖。

# 需要了解的功能

- 插件项目初始化；

- 配置菜单的api；

- loading 配置的 api；


# 项目初始化

```shell
pnpm add install yo generator-code --save-dev
```

