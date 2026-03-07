---
title: Hexo 使用指南
excerpt: Hexo，指南，配置，NexT。启用 Mermaid。
slugpath: guide/hexo 
date: 2026-03-07 10:59:40
tags:
- mermaid
categories:
---

## 启用 Mermaid

### 修改NexT主题配置文件

打开 NexT 主题的配置文件（通常是 `_config.next.yml` 或 `themes/next/_config.yml`），找到 `mermaid` 配置项，进行如下设置：

- `enable`，设置为 `true`。

```yml
# Mermaid 图表支持
mermaid:
  enable: true  # 设置为true开启
  # 可选主题：default | dark | forest | neutral
  theme:
    light: default  # 浅色模式主题
    dark: dark      # 深色模式主题
```

### 修改 Hexo 根目录配置文件

**这是最容易遗漏的步骤。**打开博客根目录的 `_config.yml`，找到 `highlight` 配置（如果你用的是`prismjs`，则修改 `prismjs` 部分），添加 `exclude_languages` 配置：

```yml
# 代码高亮设置
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: ''
  exclude_languages:    # 👈 添加这一行
    - mermaid           # 👈 添加这一行

# 如果你使用的是prismjs，同样处理
prismjs:
  enable: false
  exclude_languages:    # 👈 添加这一行
    - mermaid           # 👈 添加这一行
```

**为什么要这样做？** 这行配置告诉 `Hexo` 的语法高亮引擎不要处理标记为 `mermaid` 的代码块，将其原样留给前端的 `Mermaid.js` 去渲染，避免冲突。

### 清理缓存并重新生成

修改配置后，务必执行清理操作：

```bash
hexo clean
hexo generate
hexo server [--draft] # 本地预览
```

示例：[Vue 源码分析 - 数组变异方法的实现原理](/blog/source-code-reading/vue/array-mutation/)
