---
title: 初识debin
tags:
- debin
categories:
- [linux]
---

# 软件源

## 国内源
```shell
sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
```

## 更新源

```shell
apt-get update
```

# 系统软件

- git
- vim
- curl

```shell
apt-get install git vim curl -y
```

# 开发软件

- nvm

## nvm

参考：[Isaac Kam's Blog: nvm安装与基本使用](nvm安装与基本使用/#more)

# 参考

- [Debian说明文档](https://www.debian.org/doc/)
