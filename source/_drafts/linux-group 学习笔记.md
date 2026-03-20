---
title: linux-group 学习笔记
excerpt: linux-group 学习笔记
date: 2026-03-21 01:09:00
tags:
categories: 
---

## 查看/理解 group 文件

列出所有组：

```bash
cat /etc/group
```

```bash
# isaac @ LMDE in ~ [1:06:51] 
$ cat /etc/group 
root:x:0:
daemon:x:1:
bin:x:2:
sys:x:3:
# 省略很多行...
saned:x:124:
colord:x:125:
lightdm:x:126:
geoclue:x:127:
isaac:x:1000:
bluetooth:x:115:isaac
gamemode:x:994:
sambashare:x:993:isaac
nvpd:x:128:
```

单行构成说明：

- `：` - 一列的开始；

- 首列：`<group name>` - 组名，如果组名和你的用户名相同。确实如此，在创建用户时，会分配一个同名组；

- 第二列：`<group password>`：组密码，`x` 不是实际密码，可能类似占位符的存在。一般情况下，它不是应该使用的；
- 第三列：`<group id>`：组的唯一 id，也称 `gid`。

```bash
isaac:x:1000:
<group name>:<group password>:<group id>:
```

- 第四列：`<username>` - 归属于当前组的用户。

```bash
bluetooth:x:115:isaac
<group name>:<group password>:<group id>:<username>
```

## 添加/删除

增删组需要 `sudo`权限，分别需使用 `groupadd` 和 `groupdel` 两条不同的命令。

```bash
# 添加
sudo groupadd <new group name>

# 删除
sudo groupdel <new group name>
```

## 主组/附加组

在组文件（`/etc/group`）中是没有区分主组/附加组的。仅当组被作为主组分配用户时，它才是主组。因此，主组/附加组概念的区别在于组如何分配。

一个用户只能有一个主组，但可有任意附加组。以下为例，输出中：除了 isaac （主组）外，其他都是附加组。

```bash
# isaac @ LMDE in ~/Workspace/blog on git:main x [1:11:11] 
$ groups
isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users netdev lpadmin bluetooth scanner sambashare
```

## 把用户添加到组

把用户添加到组的方式之一：使用`usermod`（注：添加到组是它总舵能力之一，非合心作用）。

查看组下的用户成员：

```bash
groups <group name>
```

```bash
# isaac @ LMDE in ~/Workspace/blog on git:main x [1:43:13] C:1
$ groups isaac
isaac : isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users netdev lpadmin bluetooth scanner sambashare
```

使用 `usermod` 添加用户到组：

```bash
sudo usermod -aG <group name> <username>
```

`usermod` 的两个选项组合含义：

- `-G` — 指定要加入的附加组（supplementary group）；
- `-a` — append，追加模式，在现有组的基础上新增，**不会移除**已有的组。

*注：如果只用 `-G` 不加 `-a`，会把用户的附加组替换为仅 `input` 一个，导致原本所属的其他组（如 `sudo`、`audio` 等）全部丢失，是危险操作。所以 `-a` 必须和 `-G` 一起用！*

例子 - 将用户 isaac 以追加的形式添加到 input 组中：
```bash
# isaac @ LMDE in ~/Workspace/blog on git:main x [1:43:25] 
$ sudo usermod -aG input isaac
[sudo] password for isaac:              

# isaac @ LMDE in ~/Workspace/blog on git:main x [2:10:03] 
$ groups isaac
isaac : isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users input netdev lpadmin bluetooth scanner sambashare

# isaac @ LMDE in ~/Workspace/blog on git:main x [2:10:10] 
$ groups
isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users netdev lpadmin bluetooth scanner sambashare
```

## 修改用户主组

修改主组不是简单的一次性行为，还需要后续操作补充。因此，非必要不推荐进行此行为。

使用 `usermod` 修改用户的主组：

```bash
sudo usermod -g <group name> <username>

# 例子：
# 将用户 isaax 的主组修改为 input01
sudo usermod -g input01 isaax
```

