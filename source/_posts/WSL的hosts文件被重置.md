---
title: WSL的hosts文件被重置
date: 2023-03-08 16:01:21
tags:
- WSL
categories:
- WSL
---

# 前言

使用WSL安装软件时，需要从 `raw.githubusercontent.com` 拉取数据，抛异常 403。经查阅是DNS污染导致，推荐的解决方案是修改hosts文件，添加域名与ip的映射。

然而，再第二天打开电脑再次登入wsl发现，继续403异常！查看hosts文件：内容被重置！

<!-- more -->


# 原因

![](Snipaste_2023-03-08_16-08-58.png)

注释已经解释，host文件会被WSL自动生成，导致对hosts的历史修改被覆盖！

想要关闭自动生成功能，则需要在 `/etc/wsl.conf` 中设置：

```shell
generateHosts = false
```

抱着以防万一的心态，查阅 `wsl.conf` 详情：https://learn.microsoft.com/en-us/windows/wsl/wsl-config#network-settings

![](Snipaste_2023-03-08_16-15-42.png)

# 解决方案

- 关闭 generateHosts；
- 在win系统下的hosts做修改；


## 关闭 generateHosts

默认情况下，wsl是没有 `/etc/wsl.conf`，所以新建就好！

完整的 示例配置 可以从这个链接中获取：https://learn.microsoft.com/en-us/windows/wsl/wsl-config#example-wslconf-file

setp1: 新建 `sudo vim /etc/wsl.conf`；

setp2：添加配置，`generateHosts = false`

## 在win系统下的hosts做修改

在研究的过程中，发现wsl是基于win下的host文件生成的！

基于这些host映射在win和wsl都会用到，所以直接在win的host文件做修改！
