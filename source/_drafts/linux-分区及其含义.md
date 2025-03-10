---
title: linux-分区及其含义
excerpt: linux-分区及其含义
date: 2025-03-01 14:43:38
tags:
categories:
---

# 手动分区

- `/boot`
- `/boot/efi`：使用双系统时需要
- `/`：根目录

## SWAP

*手动分区时，swap分区无需挂载点，只需设置文件系统类型为`swap`。*

如何确定当前磁盘使用的是MBR还是GPT分区形式？

- 使用命令：`fdisk -l`（无权限时加上`sudo`）。在列出的信息中的`Disklabel`一项中可得知是`MBR`或`GPT`
- 使用图形GUI工具`disk`，在对应磁盘的详细信息可见：`Partitioning: GUID Parttion Table`（此为 `GPT`）

## EFI

参考的文章中，“文件系统设置为 `vfat` 或 `fat32`”，实际设置为`efi`格式才可行！

# 附录

## 参考

- [Linux 银河漫游指南 - 安装 Fedora - 使用 Blivet-GUI 进行手动分区](https://libhitchhiker.eu.org/entry/installation/fedora/#%E4%BD%BF%E7%94%A8-blivet-gui-%E8%BF%9B%E8%A1%8C%E6%89%8B%E5%8A%A8%E5%88%86%E5%8C%BA)
- [如何在 Windows 和 Linux 上确定系统使用的是 MBR 还是 GPT 分区](https://linux.cn/article-13727-1.html)