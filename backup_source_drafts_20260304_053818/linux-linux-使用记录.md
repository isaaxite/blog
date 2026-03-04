---
title: linux-linux 使用记录
excerpt: linux-linux 使用记录
date: 2024-04-05 03:27:46
tags:
  - linux
categories:
---
# isaac is not in the sudoers files

isaac 是安装 debian 时创建的账户。使用 `sudo apt update` 出现了这样的错误信息：`isaac is not in the sudoers files`。据以往经验，这个账户应该默认在 `sudoers files` 中，可以获得使用 root 权限的票据。

使用 `su` 切换到 `root` 账户：

```shell
su
```

执行 `su` （`su` 与 `sudo` 两个软件非从属关系），即会触发输入密码的 prompt，输入 root 账户的密码即可进行登陆。

```shell
sudo visudo
```

会使用默认编辑器（当前系统下是`nano`，见[附录](#附录)切换至 `vim`）打开 `/etc/sudoers` 文件（默认内容见附录）。添加 `isaac	ALL=(ALL:ALL) ALL` 内容（见下）被保存：

```shell
# User privilege specification
root	ALL=(ALL:ALL) ALL

# Allow members of group sudo to execute any command
%sudo	ALL=(ALL:ALL) ALL

isaac	ALL=(ALL:ALL) ALL
```

## 附录

### sudoer 的默认内容

```shell
root@isaac-debian:/home/isaac# cat /etc/sudoers
#
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.
#
# See the man page for details on how to write a sudoers file.
#
Defaults	env_reset
Defaults	mail_badpass
Defaults	secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# This fixes CVE-2005-4890 and possibly breaks some versions of kdesu
# (#1011624, https://bugs.kde.org/show_bug.cgi?id=452532)
Defaults	use_pty

# This preserves proxy settings from user environments of root
# equivalent users (group sudo)
#Defaults:%sudo env_keep += "http_proxy https_proxy ftp_proxy all_proxy no_proxy"

# This allows running arbitrary commands, but so does ALL, and it means
# different sudoers have their choice of editor respected.
#Defaults:%sudo env_keep += "EDITOR"

# Completely harmless preservation of a user preference.
#Defaults:%sudo env_keep += "GREP_COLOR"

# While you shouldn't normally run git as root, you need to with etckeeper
#Defaults:%sudo env_keep += "GIT_AUTHOR_* GIT_COMMITTER_*"

# Per-user preferences; root won't have sensible values for them.
#Defaults:%sudo env_keep += "EMAIL DEBEMAIL DEBFULLNAME"

# "sudo scp" or "sudo rsync" should be able to use your SSH agent.
#Defaults:%sudo env_keep += "SSH_AGENT_PID SSH_AUTH_SOCK"

# Ditto for GPG agent
#Defaults:%sudo env_keep += "GPG_AGENT_INFO"

# Host alias specification

# User alias specification

# Cmnd alias specification

# User privilege specification
root	ALL=(ALL:ALL) ALL

# Allow members of group sudo to execute any command
%sudo	ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "@include" directives:

@includedir /etc/sudoers.d
```

### xsel --help

```shell
isaac@isaac-debian:~$ su --help

Usage:
 su [options] [-] [<user> [<argument>...]]

Change the effective user ID and group ID to that of <user>.
A mere - implies -l.  If <user> is not given, root is assumed.

Options:
 -m, -p, --preserve-environment      do not reset environment variables
 -w, --whitelist-environment <list>  don't reset specified variables

 -g, --group <group>             specify the primary group
 -G, --supp-group <group>        specify a supplemental group

 -, -l, --login                  make the shell a login shell
 -c, --command <command>         pass a single command to the shell with -c
 --session-command <command>     pass a single command to the shell with -c
                                   and do not create a new session
 -f, --fast                      pass -f to the shell (for csh or tcsh)
 -s, --shell <shell>             run <shell> if /etc/shells allows it
 -P, --pty                       create a new pseudo-terminal

 -h, --help                      display this help
 -V, --version                   display version

For more details see su(1).
```
### 安装并设置 vim 为默认编辑器

```shell
$ isaac@isaac-debian:~$ su

$ root@isaac-debian:/home/isaac# apt install vim -y

$ root@isaac-debian:/home/isaac# sudo update-alternatives --config editor
There are 3 choices for the alternative editor (providing /usr/bin/editor).

  Selection    Path                Priority   Status
------------------------------------------------------------
  0            /bin/nano            40        auto mode
  1            /bin/nano            40        manual mode
* 2            /usr/bin/vim.basic   30        manual mode
  3            /usr/bin/vim.tiny    15        manual mode

Press <enter> to keep the current choice[*], or type selection number: 2
```

# 压缩/解压

## zip/unzip



# 安装字体

1. 下载字体；
2. 解压字体（如果有必要的话）到下面两个目录之一（支持 `**/*` 形式存放字体文件，详见[附录](#～-x2F-fonts-x2F-目录结构示例)）：
	1. `/usr/share/fonts/`；
	2. `～/.fonts/`（此目录默认是不存在的）。
3. 更新字体缓存：`sudo fc-cache -f -v  ` （`fc-cache` 命令详情见附录）

## 字体推荐

- [Fira Code](https://github.com/tonsky/FiraCode)
- [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

## 附录

### fc-cache --help

```shell
# isaac @ Mint-Yoga in ~/.fonts [6:57:08]
$ fc-cache --help
usage: fc-cache [-EfrsvVh] [-y SYSROOT] [--error-on-no-fonts] [--force|--really-force] [--sysroot=SYSROOT] [--system-only] [--verbose] [--version] [--help] [dirs]
Build font information caches in [dirs]
(all directories in font configuration by default).

  -E, --error-on-no-fonts  raise an error if no fonts in a directory
  -f, --force              scan directories with apparently valid caches
  -r, --really-force       erase all existing caches, then rescan
  -s, --system-only        scan system-wide directories only
  -y, --sysroot=SYSROOT    prepend SYSROOT to all paths for scanning
  -v, --verbose            display status information while busy
  -V, --version            display font config version and exit
  -h, --help               display this help and exit
```

### ～/.fonts/ 目录结构示例

```shell
# isaac @ Mint-Yoga in ~/.fonts [7:05:50]
$ tree
.
├── FiraCode
│   ├── FiraCode-VariableFont_wght.ttf
│   └── static
│       ├── FiraCode-Bold.ttf
│       ├── FiraCode-Light.ttf
│       ├── FiraCode-Medium.ttf
│       ├── FiraCode-Regular.ttf
│       └── FiraCode-SemiBold.ttf
├── Source_Code_Pro
│   ├── OFL.txt
│   ├── README.txt
│   ├── SourceCodePro-Italic-VariableFont_wght.ttf
│   ├── SourceCodePro-VariableFont_wght.ttf
│   └── static
│       ├── SourceCodePro-BlackItalic.ttf
│       ├── SourceCodePro-Black.ttf
│       ├── SourceCodePro-BoldItalic.ttf
│       ├── SourceCodePro-Bold.ttf
│       ├── SourceCodePro-ExtraBoldItalic.ttf
│       ├── SourceCodePro-ExtraBold.ttf
│       ├── SourceCodePro-ExtraLightItalic.ttf
│       ├── SourceCodePro-ExtraLight.ttf
│       ├── SourceCodePro-Italic.ttf
│       ├── SourceCodePro-LightItalic.ttf
│       ├── SourceCodePro-Light.ttf
│       ├── SourceCodePro-MediumItalic.ttf
│       ├── SourceCodePro-Medium.ttf
│       ├── SourceCodePro-Regular.ttf
│       ├── SourceCodePro-SemiBoldItalic.ttf
│       └── SourceCodePro-SemiBold.ttf
└── YaHei Consolas Hybrid 1.12.ttf

4 directories, 27 files
```

### 字体下载

- [Google Fonts](https://fonts.google.com/)

# ln


移除软链

```shell
unlink /path/to/symbolic-link
```

## 附录

`ln --help`

```shell
$ ln --help
Usage: ln [OPTION]... [-T] TARGET LINK_NAME
  or:  ln [OPTION]... TARGET
  or:  ln [OPTION]... TARGET... DIRECTORY
  or:  ln [OPTION]... -t DIRECTORY TARGET...
In the 1st form, create a link to TARGET with the name LINK_NAME.
In the 2nd form, create a link to TARGET in the current directory.
In the 3rd and 4th forms, create links to each TARGET in DIRECTORY.
Create hard links by default, symbolic links with --symbolic.
By default, each destination (name of new link) should not already exist.
When creating hard links, each TARGET must exist.  Symbolic links
can hold arbitrary text; if later resolved, a relative link is
interpreted in relation to its parent directory.

Mandatory arguments to long options are mandatory for short options too.
      --backup[=CONTROL]      make a backup of each existing destination file
  -b                          like --backup but does not accept an argument
  -d, -F, --directory         allow the superuser to attempt to hard link
                                directories (note: will probably fail due to
                                system restrictions, even for the superuser)
  -f, --force                 remove existing destination files
  -i, --interactive           prompt whether to remove destinations
  -L, --logical               dereference TARGETs that are symbolic links
  -n, --no-dereference        treat LINK_NAME as a normal file if
                                it is a symbolic link to a directory
  -P, --physical              make hard links directly to symbolic links
  -r, --relative              create symbolic links relative to link location
  -s, --symbolic              make symbolic links instead of hard links
  -S, --suffix=SUFFIX         override the usual backup suffix
  -t, --target-directory=DIRECTORY  specify the DIRECTORY in which to create
                                the links
  -T, --no-target-directory   treat LINK_NAME as a normal file always
  -v, --verbose               print name of each linked file
      --help     display this help and exit
      --version  output version information and exit

The backup suffix is '~', unless set with --suffix or SIMPLE_BACKUP_SUFFIX.
The version control method may be selected via the --backup option or through
the VERSION_CONTROL environment variable.  Here are the values:

  none, off       never make backups (even if --backup is given)
  numbered, t     make numbered backups
  existing, nil   numbered if numbered backups exist, simple otherwise
  simple, never   always make simple backups

Using -s ignores -L and -P.  Otherwise, the last option specified controls
behavior when a TARGET is a symbolic link, defaulting to -P.

GNU coreutils online help: <https://www.gnu.org/software/coreutils/>
Full documentation <https://www.gnu.org/software/coreutils/ln>
or available locally via: info '(coreutils) ln invocation'
```


# 安装中文输入法


# 随手记

背景

- debian12

## 安装 fctix5

```shell
sudo apt install fcitx5 -y
```

据实践的结果观察，安装 `fcitx5` 的同时会安装 `fcitx5-config-qt` 、`fcitx5-configtool`、`fcitx5-diagnose`、`fcitx5-migrator` 和 `fcitx5-remote`。

## 使用 fcitx5-pinyin

```shell
sudo apt install fcitx5-pinyin -y
```

使用 `fcitx5-configtool` 添加拼音输入法（小鹤双拼）

```shell
fcitx5-configtool
```

![](image-20240419032425784.png)

将 `Shuangpin` 从右侧添加至左侧，保存即可。

## 使用 rime

安装 `fcitx5-rime`

```shell
sudo apt install fcitx5-rime -y
```

在 `fcitx5-configtool` 中添加 `rime` 即可使用，`rime` 默认已经支持几种拼音方案（朙月拼音、地球拼音等等，可在切换输入法到 `rime` 后，使用热键——`Ctrl`+ `~` 或 `F4`——切换拼音方案）。

### 添加小鹤双拼

#### 下载 rime-double-pinyin

下载 [rime-double-pinyin](https://github.com/rime/rime-double-pinyin)。使用浏览器直接下载 zip 包，将 zip 包解压到 rime 的目录下（具体位置以[官方文档](https://github.com/rime/home/wiki/UserData)为准），以下是成文时官方对于 rime 目录的说明：

- **ibus-rime:** `~/.config/ibus/rime`
- **fcitx-rime:** `~/.config/fcitx/rime`
- **fcitx5-rime:** `~/.local/share/fcitx5/rime/`

注意：官方的方案推荐使用 [rime/plum](https://github.com/rime/plum) 安装 `rime-double-pinyin`，但实测无效。据观察：`rime` 会将结合 rime 目录下的 `*.schema.yaml` 和 `default.custom.yaml` 等文件进行构建，故有以上行为。

#### 配置小鹤双拼

编辑 `~/.local/share/fcitx5/rime/default.custom.yaml`（无则创建），添加：

```shell
patch:
  schema_list:
    - schema: luna_pinyin          # 拼音输入方案
    - schema: double_pinyin_flypy  # 双拼输入方案
```

*注意：`double_pinyin_flypy` 即为小鹤双拼，其他拼音方案的名称可在 ``~/.local/share/fcitx5/rime/` 目录下使用 `ls` 命令查看。*

保存文件，重新登陆桌面会话（logout / login）或重启设备后即可使用 `rime` 的热键切换到“小鹤双拼”拼音方案。

参考：
- https://github.com/rime/rime-double-pinyin
- https://fcitx-im.org/wiki/Install_Fcitx_5/zh-cn