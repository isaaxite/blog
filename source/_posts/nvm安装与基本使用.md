---
title: nvm安装与基本使用
date: 2023-02-27 01:26:41
tags:
- nodejs
- nvm
categories:
- [nodejs]
- [linux]
---

# nvm 与 n 的区别
node 版本管理工具还有一个是 TJ大神的 n 命令，n 命令是作为一个 node 的模块而存在，而 nvm 是一个独立于 node/npm 的外部 shell 脚本，因此 n 命令相比 nvm 更加局限。

<!-- more -->

由于 npm 安装的模块路径均为 /usr/local/lib/node_modules，当使用 n 切换不同的 node 版本时，实际上会共用全局的 node/npm 目录。 因此不能很好的满足『按不同 node 版本使用不同全局 node 模块』的需求。



# 下载与安装

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
``` 

# 设置环境变量

在 `~/.bashrc` 或者 `~/.zshrc` 文件末尾添加：

```shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

 保存！

重新加载配置：`source ~/.bashrc` 或 `source ~/.zshrc` 

查看 nvm 版本，借此检查安装情况：

```shell
$ nvm -v
0.39.1
```

# 基本使用

安装node版本

```shell
nvm install <node version>
```

查看版本

```shell
nvm ls
```
 
切换node版本（要先安装再切换）

```shell
nvm use <node version>
```

# 附录
- github：https://github.com/nvm-sh/nvm