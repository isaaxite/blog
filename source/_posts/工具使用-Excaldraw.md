---
title: 工具使用-Excaldraw
date: 2024-02-14 10:09:40
tags:
categories:
- 工具使用
---

# 简介

Excaldraw 是一个非常实用的在线绘图工具,使用简单,功能强大。适合需求在线绘图、设计图形、思维脑图、协同工作的用户。其开源的特点也使得excaldraw在全球范围内受到广泛欢迎。具有以下功能和特点:

- 支持在线绘制流程图、思维导图、网络拓扑图、UML图等多种图形
- 提供丰富的图形库,包含各种预设形状、图标、连接线等
- 支持拖拽生成图形,使用简单方便
- 支持实时协作,多人协同编辑同一张图
- 支持导出图片,将绘图作品导出为 PNG、JPEG、SVG 等格式
- 开源免费,代码托管在GitHub上,有良好的开发者社区
- 使用 HTML5 技术开发,可以跨平台使用,支持网页和移动端
- 提供一定的扩展和二次开发接口。

<!-- more -->

# Excaldraw Online

此版本是官方的使用方式。使用浏览器打开 [`https://excalidraw.com/`](https://excalidraw.com/) 即可。

# Excaldraw In VS Code

VS Code中没有官方提供的Excaldraw扩展。如果想在VS Code中使用类似的绘图功能,可以安装第三方提供的Excalidraw扩展,例如当前比较流行的 `pomdtr.excalidraw-editor`。

该扩展是第三方开发者 `pomdtr` 基于 Excalidraw 开源项目开发的,用于在VS Code内部集成和扩展Excalidraw的功能。

Excalidraw是一个由官方团队开发维护的开源在线白板绘图工具,代码开源在GitHub上。而pomdtr.excalidraw-editor只是一个使用了Excalidraw部分代码和功能的第三方扩展。

该扩展与Excalidraw官方团队没有正式的合作或支持关系。不过由于它建立在开源代码之上,且有一定用户基础,可以看作是Excalidraw生态系统中的有益补充。当然使用时也需要注意版本兼容性及功能差异等问题。

## 安装

Extension ID： `pomdtr.excalidraw-editor`

## 使用

创建以 `.excaldraw` 或 `.excaldraw.svg` 为扩展名创建文件，并使用 VS Code 打开即可。