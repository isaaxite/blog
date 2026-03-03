---
title: Linux 包管理器 - APT
date: 2023-09-02 13:11:55
tags:
  - apt
  - linux包管理器
categories:
  - - Linux
issue_number: 318
---

# 前言

本文将介绍 Advanced Packaging Tool (APT) 包管理器，以及其在 Debian 系统及其衍生发行版（如 Ubuntu）中的配置方式和使用方法。我们将探讨如何配置 APT，包括软件源的设置和更新策略。我们还将深入了解 APT 的使用方式，包括通过命令行工具 apt 进行软件包的安装、升级和移除等操作。通过本文，读者将能够全面了解 APT 的功能和特性，并能够有效地使用 APT 管理软件包，提升系统的稳定性和安全性。

<!-- more -->

背景：

- 系统：Debian 12；

# APT

APT 是一个命令行工具，也是 Debian 系统和基于 Debian 的发行版（如 Ubuntu）中常用的软件包管理工具之一。它是 Advanced Packaging Tool（高级软件包工具）的缩写，旨在简化软件包的安装、升级和移除等操作。

# 常见的包管理器

| 包管理器 | 描述 |
| --- | --- |
| [**Advanced Packaging Tool (APT)**](https://wiki.debian.org/Apt) | APT 是 Debian 系统及其衍生发行版（如 Ubuntu）中的包管理器。它通过命令行工具 `apt` 提供软件包的安装、升级和移除等功能。 |
| [**dnf/yum**](https://dnf.readthedocs.io/en/latest/) | dnf（Dandified Yum）是 Fedora 系统及其衍生发行版中的包管理器，取代了旧的 Yum 包管理器。在较旧的 Fedora 和 CentOS 系统中，仍然可以使用 Yum 来进行包管理。 |
| [**Pacman**](https://wiki.archlinux.org/index.php/Pacman) | Pacman 是 Arch Linux 及其衍生发行版（如 Manjaro）中的包管理器。它使用简单的命令行工具来管理软件包，具有轻量且高效的特点。 |
| [**Homebrew**](https://brew.sh/) | Homebrew 是 macOS 系统上的包管理器，用于安装、更新和管理各种开源软件包。它具有简单易用的命令行界面，并提供了大量的软件包供用户选择。 |
| [**Chocolatey**](https://chocolatey.org/) | Chocolatey 是 Windows 系统上的包管理器，类似于 Linux 系统中的包管理器。它允许用户通过命令行界面来安装、升级和管理软件包。 |
| [**Snap**](https://snapcraft.io/) | Snap 是一种通用的软件打包和分发格式，可在多个 Linux 发行版上使用。Snap 提供了一个命令行工具来管理软件包，使得安装和更新软件变得更加简单和可靠。 |


# 常见命令

第三种命令是`apt`，它是APT的一种更简洁的命令行工具，自动处理软件包之间的依赖关系。它在一些较新的Debian和Ubuntu发行版中取代了`apt-get`命令，提供了更直观和用户友好的界面。


## 安装软件包

```shell
sudo apt install <package>
```
该命令用于安装指定的软件包。它会自动解析并安装所需的依赖关系。

## 升级已安装的软件包
   
```shell
sudo apt upgrade
```

该命令用于升级系统中已安装的软件包。它会检查可用的软件包更新并升级到最新版本。

## 移除软件包
   
```shell
sudo apt remove <package>
```

该命令用于移除指定的软件包。它会将软件包及其相关的配置文件从系统中删除。

## 搜索软件包

```shell
apt search <keyword>
```

该命令用于搜索包含指定关键字的软件包。它会列出与关键字相关的软件包名称和描述。

## 显示软件包信息

```shell
apt show <package>
```

该命令用于显示指定软件包的详细信息，包括版本号、依赖关系、描述等。

## 更新软件包源列表

```shell
sudp apt update
```
它是在使用APT进行软件包管理时非常重要的一步。当你运行apt update命令时，APT会连接到配置的软件包源服务器，并下载最新的软件包列表信息。这些软件包列表包含了可用的软件包和它们的版本信息。


下面是 `apt update` 命令的作用：

- **更新软件包列表**：apt update命令会更新本地系统中的软件包列表。软件包列表是一个包含可用软件包的索引，它包含了软件包的名称、版本、依赖关系等重要信息。通过更新软件包列表，你可以了解到最新的软件包和版本信息。

- **获取最新的软件包版本**：通过运行apt update命令，你可以获取最新的软件包版本信息。APT会检查软件包源服务器上的软件包，并比较本地系统中已安装的软件包版本与软件包源上的最新版本。这有助于确定是否有可用的更新版本供你安装。

- **解决软件包依赖关系**：软件包之间存在依赖关系，即某些软件包需要依赖其他软件包才能正常工作。通过运行apt update命令，APT会检查软件包源上的依赖关系并更新本地系统的软件包列表。这有助于确保软件包的依赖关系得到满足，以便正确地安装和更新软件包。

使用`apt`命令时，不需要在命令后面添加`sudo apt-get`中常见的`sudo`和`get`关键字。它提供了更简洁的语法，并且在处理依赖关系时更加智能和自动化。这使得软件包的安装和管理过程更加便捷和高效。

## 其他

```shell
# isaac @ debian in /etc/apt/apt.conf.d [18:34:28] 
$ apt --help
apt 2.6.1 (amd64)
Usage: apt [options] command

apt is a commandline package manager and provides commands for
searching and managing as well as querying information about packages.
It provides the same functionality as the specialized APT tools,
like apt-get and apt-cache, but enables options more suitable for
interactive use by default.

Most used commands:
  list - list packages based on package names
  search - search in package descriptions
  show - show package details
  install - install packages
  reinstall - reinstall packages
  remove - remove packages
  autoremove - automatically remove all unused packages
  update - update list of available packages
  upgrade - upgrade the system by installing/upgrading packages
  full-upgrade - upgrade the system by removing/installing/upgrading packages
  edit-sources - edit the source information file
  satisfy - satisfy dependency strings

See apt(8) for more information about the available commands.
Configuration options and syntax is detailed in apt.conf(5).
Information about how to configure sources can be found in sources.list(5).
Package and version choices can be expressed via apt_preferences(5).
Security details are available in apt-secure(8).
                                        This APT has Super Cow Powers.
```

# 配置

在上面有提到使用 `apt install <package>` 安装软件，对此不禁有疑问：所安装的软件的来源是那里获取的？

实际上，APT（Advanced Packaging Tool）通过软件源（Software Repository）来获取和安装软件包。软件源是一个集中存储软件包的远程服务器，APT通过访问这些服务器来搜索、下载和安装软件包。

在系统中配置了软件源列表（source list）后，APT 会根据列表中的地址和设置来确定可用的软件源服务器。

## 软件源

软件源是存储软件包和更新的服务器或存储库。它是用户获取并安装软件的主要来源之一。软件源提供了一个集中的位置，用户可以从中获取各种软件包、应用程序和系统组件，以满足其Linux操作系统的需求。

以下是一些常见的软件源类型，它们广泛用于不同的Linux发行版：

- 官方软件源；

- 第三方软件源；

- Snap Store；

- Flatpak。

### 官方软件源

各Linux发行版都维护了自己的官方软件源，提供了核心软件包和更新。例如：

- Ubuntu：https://packages.ubuntu.com/

- Debian：https://packages.debian.org/

- Fedora：https://apps.fedoraproject.org/packages/

- CentOS：https://www.centos.org/packages/

- Arch Linux：https://archlinux.org/packages/

- openSUSE：https://software.opensuse.org/

- Mageia：https://madb.mageia.org/

- Gentoo：https://packages.gentoo.org/

这些链接将带你到相应发行版的官方软件源的网页，你可以使用这些网页来搜索和浏览软件包列表。请注意，这些链接可能会随着时间变化而更新，所以最好通过搜索引擎或官方网站来获取最新的软件源链接。

### 第三方软件源

许多开发者、社区和组织维护自己的软件源，提供特定软件的最新版本和增强功能。这些第三方软件源可以是针对特定软件的官方源，也可以是由社区维护的源。常见的第三方软件源如：

- [Ubuntu PPA（Personal Package Archive）](https://launchpad.net/ubuntu/+ppas)：个人软件仓库，由Ubuntu用户创建和维护。提供了额外的软件包和更新。

- [RPM Fusion（适用于Fedora和CentOS）](https://rpmfusion.org/)：提供了一些常用软件的补充包，包括多媒体相关的软件和驱动程序。

- [Arch User Repository（AUR）](https://aur.archlinux.org/)（适用于Arch Linux）：由Arch Linux社区维护的软件仓库，允许用户共享和安装自定义软件包。

- [OBS（Open Build Service）](https://build.opensuse.org/)（适用于多个发行版）：一个开放的软件构建服务，允许开发者构建和发布软件包。支持多个Linux发行版。

- [EPEL（Extra Packages for Enterprise Linux）](https://fedoraproject.org/wiki/EPEL)（适用于CentOS和RHEL）：为企业级Linux发行版提供额外的软件包，以满足更广泛的需求。

- [Nixpkgs（适用于NixOS）](https://nixos.org/nixpkgs/)：NixOS的官方软件仓库，提供了丰富的软件包和配置管理工具。

- [Homebrew](https://brew.sh/)（适用于macOS）：macOS上的包管理器，提供了易于安装和管理的软件包。

这些第三方软件源提供了额外的软件包和功能，使用户能够获取更多的选择和定制性。请注意，使用第三方软件源时应谨慎，确保了解源的可信度和安全性，并遵循它们的使用指南。

### Snap Store

[Snap Store](https://snapcraft.io/store) 是一个官方的软件分发平台，它提供了广泛的应用程序和工具，适用于基于 Linux 的各种发行版，如 Ubuntu、Fedora、CentOS、Arch Linux等。Snap Store基于Snap包管理系统，这是一种跨发行版的软件打包和分发格式。

Snap Store的特点包括：

1. 跨发行版支持：Snap Store的软件包可以在多种不同的Linux发行版上安装和运行，无需担心依赖关系或兼容性问题。

2. 安全性：Snap包采用沙箱技术，提供了额外的安全层，确保软件的隔离性和安全性。每个Snap应用程序都有自己的依赖和运行环境，不会干扰系统的其他部分。

3. 自动更新：Snap Store中的软件包会自动更新到最新版本，确保用户始终使用最新的功能和修复的bug。

4. 宽广的应用程序库：Snap Store提供了各种类型的应用程序，包括办公套件、多媒体工具、开发工具、游戏等，使用户能够方便地找到并安装他们所需的软件。

在Snap Store中，你可以浏览不同类别的软件，搜索特定的应用程序，并通过简单的几个步骤安装和管理它们。

#### 使用

```shell
# 安装 snapd
sudo apt update
sudo apt install snapd
sudo snap install core

# 安装软件
sudo snap install <package>

# 删除软件
sudo snap remove <package>

# 查看已安装软件
sudo snap list
```

### Flatpak

[Flatpak](https://flathub.org/) 是一个用于Linux发行版的软件打包和分发系统，类似于Snap。它提供了一种跨发行版的方式，允许开发者打包应用程序及其依赖项，并在不同的Linux发行版上以沙箱环境中运行。

Flatpak的特点包括：

1. 跨发行版支持：Flatpak允许开发者将应用程序打包为独立的容器，与底层系统无关。这使得应用程序可以在各种不同的Linux发行版上运行，无需重新打包。

2. 沙箱环境：Flatpak应用程序运行在沙箱环境中，与系统其他部分隔离。这提供了额外的安全性，防止应用程序对系统造成潜在的影响。

3. 应用程序库：Flatpak通过Flathub提供了一个中央应用程序库，其中包含了大量的应用程序供用户选择。你可以在Flathub上浏览各种类别的应用程序，并通过几个简单的步骤安装它们。

4. 更新管理：Flatpak应用程序可以自动更新，确保用户始终使用最新的版本和修复的漏洞。

使用Flatpak，你可以浏览Flathub上的应用程序，搜索特定的应用程序，并使用Flatpak命令行工具或图形界面工具进行安装、更新和管理。Flatpak提供了一种简便的方式，使用户能够轻松地获取和运行各种Linux应用程序。

#### 使用

```shell
# 安装 flatpak 完成后，重启生效
sudo apt install flatpak
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# 安装软件
flatpak install flathub <package>
```

## 配置文件

这些软件源的地址被配置在 `/etc/apt/sources.list` 或 `/etc/apt/sources.list.d/`目录下的`*.list`文件中。

- `source.list` 文件定义了一个或多个软件源的URL，软件包管理器将从这些源中下载软件包。每个源的URL通常指向一个包含软件包的软件存储库。

- `source.list.d/` 目录是 `/etc/apt/` 目录下的另一个目录，用于存放以 `.list` 为扩展名的软件源文件。这个目录允许用户和软件包管理器将软件源的配置拆分为多个文件，以便更好地组织和管理。可以通过简单地在该目录中创建一个新的.list文件来添加新的软件源。这种分割的方式使得在不影响source.list文件的情况下添加、删除或修改软件源变得更加方便，而无需修改单个大文件。

例如：

```shell
├── sources.list
└── sources.list.d
    ├── cloudflare-client.list
    ├── microsoft-edge.list
    └── vscode.list
```

## 优先级

在 Debian 和 Ubuntu 等 Linux 发行版中，`source.list`文件和`source.list.d/`目录下的`.list`文件中的配置具有以下优先级：

1. `source.list.d/`目录下的`.list`文件的优先级高于`source.list`文件。这意味着如果在`source.list.d/`目录中存在与`source.list`中相同的软件源配置，将使用`source.list.d/`目录中的配置。

2. 当存在多个`source.list.d/`目录下的`.list`文件时，它们的加载顺序是按照文件名的字母顺序进行的。较早加载的文件中的配置将被后续加载的文件中的配置覆盖。

3. 如果存在相同软件源的重复配置，后面加载的配置将覆盖先前加载的配置。因此，在`source.list.d/`目录中的较晚加载的`.list`文件中的配置将覆盖较早加载的文件中相同软件源的配置。

需要注意的是，优先级仅适用于软件源配置。对于其他APT设置（如代理配置、密钥管理等），在`source.list`中配置的设置将始终具有最高优先级。

## 配置格式

下面是 Debian 12 的 `source.list` 配置内容：

```shell
# isaac @ debian in /etc/apt [13:26:09] C:130
$ cat sources.list

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware

# deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware

deb https://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
deb-src https://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
```

以上面的 `sources.list` 文件的第一行为例说明一个软件源的配置格式：

```shell
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware

<软件源关键词> <软件源地址> <发行版名称> <组件1> <组件2> ...
```

它指定了一个名为"bookworm"的发行版，使用了清华大学开源软件镜像站（https://mirrors.tuna.tsinghua.edu.cn/debian/）作为软件源。

### 软件源关键词

`deb`：这是APT软件源配置中的关键词，表示这是一个二进制包的软件源。

软件源配置中常用的关键词有以下几个：

1. **deb**：表示这是一个二进制包的软件源。

2. **deb-src**：表示这是一个源代码包的软件源。

这两个关键词用于不同类型的软件源，前者用于获取和安装二进制包，后者用于获取和构建源代码包。

### 软件源地址

`https://mirrors.tuna.tsinghua.edu.cn/debian/`：这是软件源的URL地址，指向清华大学开源软件镜像站的 Debian 软件源。

这里的清华源并非默认的源，默认的官方源是 `http://deb.debian.org/debian/`，由于访问官网源在国内比较慢等原因，因此上面使用了国内的源。除了清华源外，国内还有其他 Debian APT 源，常见的有：

- [腾讯软件源](https://mirrors.cloud.tencent.com/)

- [阿里源](https://developer.aliyun.com/mirror/)

- [华为源](https://mirrors.huaweicloud.com/home)

- [中科大源](http://mirrors.ustc.edu.cn/)


### 发行版名称

`bookworm`：这是发行版的名称，表示这个软件源适用于 Debian 12（代码名称为"Bookworm"）。

更多的 Debian 的发行版本名称见 [附录](#Debian-的发行版本名称)


### 组件

`main contrib non-free non-free-firmware`： 这是软件源中的组件。不同的组件包含了不同类型的软件包。

- **main**：Debian 发行版的核心组件，包含了自由的开源软件包。

- **contrib**：这是非必需的软件包组件，包含了依赖于main组件的一些软件包。

- **non-free**：这是非自由软件包组件，包含了不符合自由软件定义的软件包。

- **non-free-firmware**：这是非自由的硬件固件组件，包含了一些设备所需的非自由固件。

## 小结

软件源列表（Source List）是一个文本文件，用于配置系统中软件包管理器（如APT）的软件源服务器信息。它包含了系统用于下载和安装软件包的网络地址。

在 Debian 系及其衍生发行版（如Ubuntu）中，软件源列表文件通常位于`/etc/apt/sources.list`或`/etc/apt/sources.list.d/`目录下。这个文件中列出了各种软件源服务器的地址，以及与每个软件源相关的软件包分发渠道和组件。

软件源列表文件的内容可以根据用户的需求进行自定义。用户可以根据自己的地理位置、网络速度和软件需求来选择合适的软件源服务器。通过编辑软件源列表文件，用户可以添加、删除或更改软件源，以便获取所需的软件包。

在使用APT进行软件包管理时，软件源列表起到关键作用。通过配置正确的软件源，系统可以正确地下载和安装软件包，保持系统的更新和安全。因此，了解软件源列表的概念并正确配置它是非常重要的。

# 总结

这是一篇关于 Linux 系统中 APT 包管理器的使用指南。本文主要内容如下:

第一部分介绍了 APT 的基本概念，它是 Debian 系统及其衍生发行版中的常用包管理工具，通过 apt 命令提供软件包管理功能。

第二部分详细解释了 APT 的各种常用命令，包括安装、升级、删除、搜索、显示软件包信息等，并给出了具体的命令格式和使用示例，便于读者快速掌握。 

第三部分着重讲解了 APT 的软件源配置，包括不同类型软件源、它们之间的优先级关系、sources.list 文件的格式等内容。正确配置软件源对 APT 的正常使用非常关键。

# 附录

## Debian 的发行版本名称

Debian 发行版通常使用代号来标识各个版本，这些代号通常以动画电影《玩具总动员》中的角色命名。以下是一些常见的Debian 发行版代号及其对应的版本：

1. Debian 1.1 "Buzz"
2. Debian 1.2 "Rex"
3. Debian 1.3 "Bo"
4. Debian 2.0 "Hamm"
5. Debian 2.1 "Slink"
6. Debian 2.2 "Potato"
7. Debian 3.0 "Woody"
8. Debian 3.1 "Sarge"
9. Debian 4.0 "Etch"
10. Debian 5.0 "Lenny"
11. Debian 6.0 "Squeeze"
12. Debian 7.0 "Wheezy"
13. Debian 8.0 "Jessie"
14. Debian 9.0 "Stretch"
15. Debian 10 "Buster"
16. Debian 11 "Bullseye"

这些代号是根据《玩具总动员》系列电影的角色（如Buzz、Rex等）命名的，并按照字母顺序进行命名，每个新版本都使用下一个字母的角色名称作为代号。这些代号主要用于标识特定版本的Debian发行版，使用户和开发者可以更方便地引用和讨论特定版本的Debian。

## 参考

- [debian / 获取 debian / 软件包](https://www.debian.org/distrib/packages)
- [wikipeida - APT (software)](https://en.wikipedia.org/wiki/APT_(software))
- [Ubuntu - Package management](https://ubuntu.com/server/docs/package-management)
- [apt - command-line interface](https://manpages.ubuntu.com/manpages/xenial/man8/apt.8.html)
- [Snap documentation](https://snapcraft.io/docs)
- [Introduction to Flatpak](https://docs.flatpak.org/en/latest/introduction.html)
