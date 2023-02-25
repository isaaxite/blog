---
title: NexT添加文章置顶feat
tags:
- hexo
categories:
- [hexo]
- [NexT]
---

# 前言

Hexo以及NexT主题默认没有置顶功能！本文旨在通过现有方案，花费最小力气补充此缺失的功能！

<!-- more -->

# 方案

使用现有解决方案：https://github.com/netcan/hexo-generator-index-pin-top

> Feautres 
>
>This version supports pin-top feature, you can add the top: True field to post's front-matter to pin it.

# 使用

## 安装

```shell
$ npm uninstall hexo-generator-index --save
$ npm install hexo-generator-index-pin-top --save
```

## 优化

修改主题文件，添加“置顶”标志。
```shell
# themes/next/layout/_partials/post/post-meta.njk

{% if post.top %}
  <font color="#1fa67a">
    <i class="fa fa-thumb-tack" style="position: relative;top: 1px;"></i>
    <span> 置顶</span>
  </font>
{% endif %}
```

## 置顶

修改需要置顶的文章，Front-matter 添加 `top: true`，见下栗子：

```yml
---
title: vue中的diff算法实现
date: 2019-12-26 08:41:47
tags:
- vue
- vue源码分析
categories:
- [源码分析]
- [vue]
+ top: true
---
```

## 效果

>![](Snipaste_2023-02-25_21-11-27.png)
