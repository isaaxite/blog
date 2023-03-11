---
title: 初识WSL2
tags:
- WSL
ccategories:
- [WSL]
---

# 前言

本文旨在记录WSL2的安装，让WSL基本可用。

接着是Linux发行版本的替换，以至于可以自由选择自己熟悉、喜欢的distribution。

最后，是有选择地介绍WSL的基础配置及其略详细的情况，目的是让WSL可以更加适合开发者使用。如果后面有需要会继续补充常用的配置使用。以及linux发行版本的替换。

<!-- more -->

# 安装

## 系统要求
TODO

## 实践环境
TODO

## 命令行安装

打开 powershell，使用以下命令安装，等待完成。

```shell
wsl --install
```

安装结束后，可以使用 `wsl --help` 查看支持的命令，详细参考 [附录-wsl --help]。


# 修改linux distributions

TODO

# 添加配置

TODO

# 特性

## systemd命令的支持

默认不支持，需要在配置文件中开启

```shell
# isaac @ ERAZER in ~/workspace/blog on git:develop x [11:15:48]
$ systemd
Trying to run as user instance, but the system has not been booted with systemd.
```

配置文件中添加以下配置，重启后生效：

```shell
[boot]
systemd=true
```

重启后可以使用 `systemctl list-unit-files --type=service` 检查。

## Automount settings

自动挂载设置，以及options的释义，参考：https://learn.microsoft.com/en-us/windows/wsl/wsl-config#automount-settings

其中涉及的概念：

- uid=1000，参考[附录](#附录)中的 [What is Umask in Linux?]

- umask，参考[附录](#附录)中的 [What is Umask in Linux?]
    
    栗子：umask=022，则意味新建的目录与文件的权限将是`77 - 022 = 755`

# 附录

## 特别说明

[Advanced settings configuration in WSL] 中包含了 [wsl.conf] 和 [.wslconfig]的示例文件；

## wsl --help

```shell
PS C:\Users\isaac> wsl --help
Copyright (c) Microsoft Corporation. All rights reserved.

Usage: wsl.exe [Argument] [Options...] [CommandLine]

Arguments for running Linux binaries:

    If no command line is provided, wsl.exe launches the default shell.

    --exec, -e <CommandLine>
        Execute the specified command without using the default Linux shell.

    --
        Pass the remaining command line as is.

Options:
    --cd <Directory>
        Sets the specified directory as the current working directory.
        If ~ is used the Linux user's home path will be used. If the path begins
        with a / character, it will be interpreted as an absolute Linux path.
        Otherwise, the value must be an absolute Windows path.

    --distribution, -d <Distro>
        Run the specified distribution.

    --user, -u <UserName>
        Run as the specified user.

Arguments for managing Windows Subsystem for Linux:

    --help
        Display usage information.

    --install [Options]
        Install additional Windows Subsystem for Linux distributions.
        For a list of valid distributions, use 'wsl --list --online'.

        Options:
            --distribution, -d [Argument]
                Downloads and installs a distribution by name.

                Arguments:
                    A valid distribution name (not case sensitive).

                Examples:
                    wsl --install -d Ubuntu
                    wsl --install --distribution Debian

    --set-default-version <Version>
        Changes the default install version for new distributions.

    --shutdown
        Immediately terminates all running distributions and the WSL 2
        lightweight utility virtual machine.

    --status
        Show the status of Windows Subsystem for Linux.

    --update [Options]
        If no options are specified, the WSL 2 kernel will be updated
        to the latest version.

        Options:
            --rollback
                Revert to the previous version of the WSL 2 kernel.

            --inbox
                Only update the inbox WSL 2 kernel. Do not install WSL from the Microsoft Store.

            --web-download
                Download the most recent version of WSL from the internet instead of the Microsoft Store.

Arguments for managing distributions in Windows Subsystem for Linux:

    --export <Distro> <FileName>
        Exports the distribution to a tar file.
        The filename can be - for standard output.

    --import <Distro> <InstallLocation> <FileName> [Options]
        Imports the specified tar file as a new distribution.
        The filename can be - for standard input.

        Options:
            --version <Version>
                Specifies the version to use for the new distribution.

    --list, -l [Options]
        Lists distributions.

        Options:
            --all
                List all distributions, including distributions that are
                currently being installed or uninstalled.

            --running
                List only distributions that are currently running.

            --quiet, -q
                Only show distribution names.

            --verbose, -v
                Show detailed information about all distributions.

            --online, -o
                Displays a list of available distributions for install with 'wsl --install'.

    --set-default, -s <Distro>
        Sets the distribution as the default.

    --set-version <Distro> <Version>
        Changes the version of the specified distribution.

    --terminate, -t <Distro>
        Terminates the specified distribution.

    --unregister <Distro>
        Unregisters the distribution and deletes the root filesystem.
```


## 参考

### 安装

- [How to install WSL2 on Windows 10]

- [Install Linux on Windows with WSL]

### 其他

- [Advanced settings configuration in WSL]

- [Wiki about 'Systemd']

- [What is the user 1000?]

- [What is Umask in Linux?]

- [Comparing WSL Versions]

<!-- reference -->

[附录-wsl --help]:#wsl-%E2%80%93help

[How to install WSL2 on Windows 10]:https://pureinfotech.com/install-windows-subsystem-linux-2-windows-10/

[Install Linux on Windows with WSL]:https://learn.microsoft.com/en-us/windows/wsl/install

[Advanced settings configuration in WSL]:https://learn.microsoft.com/en-us/windows/wsl/wsl-config

[Wiki about 'Systemd']:https://en.wikipedia.org/wiki/Systemd

[What is the user 1000?]:https://www.linuxquestions.org/questions/linux-general-1/what-is-the-user-1000-a-4175510196/

[What is Umask in Linux?]:https://www.liquidweb.com/kb/what-is-umask-and-how-to-use-it-effectively/

[Comparing WSL Versions]:https://learn.microsoft.com/en-us/windows/wsl/compare-versions?source=recommendations

[.wslconfig]:https://learn.microsoft.com/en-us/windows/wsl/wsl-config#example-wslconfig-file

[wsl.conf]:https://learn.microsoft.com/en-us/windows/wsl/wsl-config#example-wslconf-file