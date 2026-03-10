---
title: Hexo 使用指南
excerpt: Hexo，指南，配置，NexT。启用 Mermaid、Favicon 配置。
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

## Favicon 配置

### 方案一：极简版

#### 准备图片

产出以下三个格式的图片：

- 180×180：`apple-touch-icon.png`；
- 32×32：`favicon.ico`；
- 32×32（`viewBox="0 0 32 32`）`：icon.svg`。

**Step 1** - 准备一张图，假定是： `favicon.png`。

**Step 2** - 压缩它：使用 [tinify](https://tinypng.com/)，得到 `tinified-favicon.png`。

**Step 3** - 将 `tinified-favicon.png` 转为 `svg` 格式：使用 [PNG to SVG](https://png2svg.com/)，得到 `tinified-favicon.svg`；

**Step 4** - 产出 `apple-touch-icon.png`

```bash
ffmpeg -i tinified-favicon.png -vf "scale=180:180" -compression_level 9 apple-touch-icon.png
```

**Step 5** - 产出 `favicon.ico`

```bash
ffmpeg -i tinified-favicon.png -vf "scale=32:32" -compression_level 9 ./favicon.ico
```

**Step 6** - `icon.svg`

使用 [SVG Viewer](https://www.svgviewer.dev/)，压缩并修改宽高，最后重命名为 `icon.svg`。

参考工具：

- [Image Resizer](https://imageresizer.com/)：Easily resize images online for free.

#### 使用图片

**Step 1** - 将它们存放到 Web 服务器的根目录下（Hexo 本地根目录是 `source/`）。

**Step 2** - 目标是在 HTML 页面的 `<head>` 內插入以下内容：

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

首先，注释 `themes/next/_config.yml` 中的 `favicon` 配置：

```yml
# ---------------------------------------------------------------
# Site Information Settings
# ---------------------------------------------------------------
favicon:
  # small: /images/favicon-16x16-next.png
  # medium: /images/favicon-32x32-next.png
  # apple_touch_icon: /images/apple-touch-icon-next.png
  # safari_pinned_tab: /images/logo.svg
  # android_manifest: /manifest.json
```

然后，新增脚本 `scripts/favicon.js`：

```js
// 在 <head> 中插入自定义的 favicon 链接
hexo.extend.filter.register('theme_inject', function(injects) {
  // 插入到 head 的末尾
  injects.head.raw('custom-favicon', [
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="icon" href="/icon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  ].join('\n'), {}, { cache: true });
});
```

最后，`npx hexo clean && npx hexo server[ --draft]`。

### 参考

- [The Open Graph protocol](https://ogp.me/)
- [How to Favicon in 2026: Three files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)
- [Google updates Favicon Requirements: new 8x8px minimum size](https://ppc.land/google-updates-favicon-requirements-new-8x8px-minimum-size-2/#/portal/#/portal)
- [What is a Favicon? Size, Formats & How to Add One (2026 Guide)](https://www.bluehost.com/blog/what-is-a-favicon)
