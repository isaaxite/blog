---
title: record-一个脚本.md
excerpt: record-一个脚本.md
date: 2023-12-05 23:50:30
tags:
---

# 创建脚本

创建名为 `main.sh` 的脚本文件。

##  添加权限

```shell
chmod 755 main.sh
```

**添加权限的两种方式：**

```shell
chmod 755 <script.sh>
```

`chmod 755` 是一种 **绝对模式** 设置权限的方式，直接指定文件或目录的权限值为 `755`。

- **权限值解析**：
  - `7`：所有者（user）的权限，`7` 表示 `rwx`（读、写、执行）。
  - `5`：所属组（group）的权限，`5` 表示 `r-x`（读、执行）。
  - `5`：其他人（others）的权限，`5` 表示 `r-x`（读、执行）。
        
- **效果**： 
  - 所有者：读、写、执行（`rwx`）。
  - 所属组：读、执行（`r-x`）。
  - 其他人：读、执行（`r-x`）。


```shell
chmod u+xr <script.sh>
```

`chmod u+rx` 是一种 **符号模式** 设置权限的方式，只针对文件或目录的所有者（user）添加读（`r`）和执行（`x`）权限。

- **符号解析**：
  - `u`：表示所有者（user）。
  - `+`：表示添加权限。
  - `rx`：表示读（`r`）和执行（`x`）权限。
        
- **效果**：
  - 仅对所有者生效，添加读和执行权限。
  - 不会修改所属组和其他人的权限。


## 第一行

```shell
#!/bin/sh
```

参考：[The Shell Scripting Tutorial / A First Script](https://www.shellscript.sh/first.html)

# 附录

## `chmod` 添加权限

