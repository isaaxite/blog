---
title: hexo-common issues
excerpt: hexo-common issues
date: 2024-03-31 13:18:21
tags:
categories:
---


# markdown 图片预览

hexo 提供的一种特有的图片语法，它非绝对路径也非相对路径，见例子：

```tree
├── post
│   ├── pic_01.png
│   └── pic_02.png
└── post.md
```

在 `post.md` 中的团片语法在 hexo 环境下可以是：`![](pic_01.png)`。

这样的语法有好处也有不便。缺点是：使用 VS Code 编写 md 内容时无法在 VS Code 中预览图片；优点是：路径中无文件名（如 `post.md` 中的 `post` ），文件内有大量图片语法时，就不用因为修改了文件名而进行大量的替换工作。

思路：

1. 让 VS Code 支持 hexo 的特殊语法；

2. 改文件名时自动修改文件内的路径语法；

3. 换可支持 hexo 特殊语法的 md 编辑软件；****

4. VS Code 浏览器，在右侧打开浏览器视窗；

- VS Browser；

vs code 真是



## 试验 md 编辑软件

- N | emacs：过于硬核；
- N | joplin：奇怪无打开目录选项，打开目录很奇怪；
- Y | obsidian：啊啊啊可以使用 hexo 的特殊路径语法。但是 bug 略多，初步使用已经发现 2 个：
	- 中文输入时，自动插入英文首字母；
	- 代码块识别异常；
- N | typora：不支持 hexo 特性语法；
- N | Marker：不支持，并且功能过于基础；

## VS Code 浏览器，在右侧打开浏览器视窗

问题：

- 无法快速跳转到某一章节，只能滚动

- 刷新问题。VS Browser 的地址栏路径不会因为点击导航变化，刷新只会跳回路径地址，无记忆能力。