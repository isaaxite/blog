---
title: Parabolic、Ear Tag 和 Rhythmbox 搭建本地音乐库
excerpt:  Linux（LMDE 6）环境下搭建本地音乐库。使用 Parabolic 下载视频为音频文件；Ear Tag 编辑完善音频元数据，让它有好看的封面，正确的标题（演奏者）、专辑信息等等；Rhythmbox 或 Amberol 播放。
slugpath: linux-daily-use/local-music-library-setup
date: 2026-03-03 16:58:17
tags:
  - 本地乐库
  - 本地音乐
  - Linux
  - Rhythmbox
  - Parabolic
  - Ear Tag
categories:
- [Linux]
- [Linux 工具]
---

## 引言

搭建自己专属的本地音乐库，满足收藏癖好。解决版权问题导致的种种问题，凑不齐的播放列表。看看下文，来点思路。

下文介绍在 Linux（LMDE 6）环境下搭建本地音乐库。使用 Parabolic 下载视频为音频文件；Ear Tag 编辑完善音频元数据，让它有好看的封面，正确的标题（演奏者）、专辑信息等等；Rhythmbox 或 Amberol 播放。

## 环境信息

- OS: LMDE 6 (faye) x86_64；
- Kernel: 6.1.0-42-amd64

## 将要使用的软件

- 下载音乐：[Parabolic](https://github.com/NickvisionApps/Parabolic)；
- 编辑音乐文件元数据：[Ear Tag](https://gitlab.gnome.org/World/eartag)；
- 本地音乐播放器：[Rhythmbox](https://wiki.gnome.org/Apps/Rhythmbox)。

## 安装 Parabolic

使用 `flatpak` 安装。`flatpak` 非 `LMDE` 自带，若未安装，可参考 [Set Up Flathub > Debian](https://flathub.org/en/setup/Debian)，下同再赘述。Flathub 中的 [Parabolic](https://flathub.org/en/apps/org.nickvision.tubeconverter)。

```bash
flatpak install org.nickvision.tubeconverter
```

其他安装方式：

- [Firefox ADD-ONS](https://addons.mozilla.org/en-US/firefox/addon/parabolic/)
- [MacOS | Windows](https://github.com/NickvisionApps/Parabolic/releases)

## 安装 Ear Tag

Flathub 中的 [Ear Tag](https://flathub.org/en/apps/app.drey.EarTag)。

```bash
flatpak install app.drey.EarTag
```

**注**：*仅支持 Linux，详见 [App for GNOME](https://apps.gnome.org/EarTag/)* 。

## 安装 Rhythmbox

Rhythmbox 是 LMDE 自带，无需安装。如果不是这样，可使用 apt 安装：

```bash
sudo apt update
sudo install rhythmbox -y
```

## 下载音乐

Parabolic 是强大的视频和音频下载工具，它的下载能力覆盖上百个网站，比如 Bilibili。[点击](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)查看官方提供的，它下载能力覆盖的网站列表。

它支持将视频下载为：MP4，WEBM，MKV，MOV，AVI，MP3，M4A，OPUS，FLAC 和 WAV。

下面以下载[【Gimme! Gimme! Gimme!  - ABBA【Hi-Res】百万级装备试听】](https://www.bilibili.com/video/BV1jk4y1v77X/?share_source=copy_web&vd_source=792027cc03eadb17f9372168dabbf9ba) 为例：

![Parabolic 下载在线视频为音频](https://assets-amu.pages.dev/blog/2026-03-12-06-52-48.png)

## 编辑元数据

Ear Tag 是个简单的音频元数据编辑工具，支持编辑 MP3, WAV, M4A, FLAC, OGG 和 WMA 格式的音频文件。使用 Ear Tag 打开下载好的 `Gimme! Gimme! Gimme!  - ABBA【Hi-Res】百万级装备试听 [BV1jk4y1v77X].mp3`，你会看到一些不太理想的元数据：

![编辑前的音频元数据](https://assets-amu.pages.dev/blog/2026-03-12-06-51-32.png)

### 极简版的元数据

| 名称   | 元数据名       | 描述           |
|--------|----------------|----------------|
| 标题   | Title          | 歌曲标题       |
| 艺术家 | Artist         | 演唱者/演奏者  |
| 封面   | 无对应元数据名 | 格式：png / jpg |

### 我喜欢的版本

在极简版的基础上再加上：

| 名称       | 元数据名     | 描述                       |
|------------|--------------|----------------------------|
| 轨道号     | Track number | 歌曲在专辑中的序号         |
| 轨道数     | Total Tracks | 专辑中歌曲总数             |
| 专辑名称   | Album        | 有助于音乐播放器按专辑归类 |
| 专辑艺术家 | Album artist | 专辑作者                   |
| 发行日期   | Release date |                            |

或者可再加上：

| 名称   | 元数据名 | 描述                       |
|--------|----------|----------------------------|
| 风格   | Genre    | 有助于音乐播放器按风格归类 |
| 作曲者 | Composer |                            |

### 获取元数据

在网络上不难找到一首歌曲的元数据信息。或可尝试在 [KKBOX](https://www.kkbox.com/hk/tc/) 网站上获取。在 KKBOX 上，可以根据歌曲名称获取：

| 名称 | 数据 |
| ---- | ---- |
| 标题 / 歌曲名 | Gimme! Gimme! Gimme! (A Man After Midnight) |
| 艺术家 / 乐队名 | ABBA |
| 封面 | 此处不作展示，[点击查看封面详情](https://www.kkbox.com/hk/tc/song/CnEkyTypUCArr5ugXQ) |
| 作词 | B.Andersson & B.Ulvaeus |
| 作曲 | B.Andersson & B.Ulvaeus |
| 歌词 | 此处不作展示，[点击查看歌词详情](https://www.kkbox.com/hk/tc/song/CnEkyTypUCArr5ugXQ) |
| 专辑名 | ABBA Gold |
| 轨道号 | 14 |
| 轨道数 | 19 |
| 发行日期 | 1/1/2008 |
| 专辑介绍 | 此处不作展示，[点击查看专辑介绍](https://www.kkbox.com/hk/tc/song/CnEkyTypUCArr5ugXQ) |

![完善元数据后的音频](https://assets-amu.pages.dev/blog/2026-03-12-06-50-28.png)

## 本地音乐播放器

| Icon                                     | Name                                                        | Desc                                                                                                                                                                |
|------------------------------------------|-------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![Rhythmbox 图标](https://assets-amu.pages.dev/blog/file-20250331080903896.png) | [Rhythmbox](dcf290e7/https://wiki.gnome.org/Apps/Rhythmbox) | **GNOME** 桌面环境默认的**音乐播放与管理软件**，适用于 **Linux** 系统。它提供音频播放、音乐库管理、网络电台、播客支持等功能，界面简洁易用，适合日常听歌和轻度音乐整理需求。 |

![Rhythmbox 播放界面](https://assets-amu.pages.dev/blog/2026-03-12-06-48-59.png)

如果不介意无法创建播放列表、无法分类，更注重视觉体验，那么 [Amberol](https://apps.gnome.org/Amberol/) 会是超出预期的选择。现代化 GTK 4 设计，无冗余元素。专注播放，无后台扫描或数据库负担。完美融入最新 GNOME 桌面。

![Amberol 播放界面](https://assets-amu.pages.dev/blog/2026-03-12-06-47-39.png)

### 增强 Rhythmbox 体验

上面展示的 Rhythmbox 界面，实际并非它原有的模样。而是经过 [fossfreedom /alternative-toolbar](https://github.com/fossfreedom/alternative-toolbar) 配置后的结果。下面的才是它原有的模样：

![Rhythmbox 原来的模样](https://assets-amu.pages.dev/blog/file-20250326093045383.png)

使用 Git 克隆到本地安装：

```bash
cd ~/Downloads
sudo apt-get install intltool git gir1.2-glib-2.0 gir1.2-gstreamer-1.0 gir1.2-gtk-3.0 gir1.2-peas-1.0 gir1.2-rb-3.0 gnome-pkg-tools gobject-introspection libglib2.0-dev pkg-config python3-gi python3
git clone https://github.com/fossfreedom/alternative-toolbar.git
cd alternative-toolbar
./autogen.sh --prefix=/usr
make
sudo make install
```

[fossfreedom /alternative-toolbar](https://github.com/fossfreedom/alternative-toolbar) 旨在改进默认界面的用户体验，提供更现代化的布局和增强的功能。在多个方面都作了不同程度的增强与优化：

- **更紧凑的工具栏**
  - 合并播放控制、搜索栏和视图切换，减少空间占用
  - 支持自定义工具栏按钮（隐藏/显示特定功能）
- **现代化的播放控制**
  - 更直观的播放按钮（类似现代播放器风格）
  - 支持进度条内显示当前/总时间
- **增强的搜索功能**：全局搜索栏集成到工具栏，快速查找歌曲、专辑或艺术家
- **快捷视图切换**：一键切换 *“专辑视图”*、*“艺术家视图”* 和 *“播放列表”*，无需进入侧边栏
- **播放状态显示优化**
  - 当前播放歌曲信息（标题、艺术家）直接显示在工具栏
  - 可自定义显示元数据（如比特率、文件格式）
- **可调整布局**
  - 允许用户选择 **经典模式**（默认 Rhythmbox 风格）或 **紧凑模式**（节省空间）
  - 支持隐藏不常用的按钮（如广播、播客）
- **快捷键支持**：提供额外的键盘快捷键控制播放（如 `Ctrl+F` 快速聚焦搜索栏）

![来自 alternative-toolbar > Github README 的示例图](https://assets-amu.pages.dev/blog/file-20250326094015785.png)

## 结语

文中涉及到的几个软件，它们的安装方式和过程都是很简单且无异常抛出，不必有心智负担。如果你对 FFmpeg  和 Shell 脚本感兴趣，可以看看我的另外一个缓慢开发中的项目：[isaaxite / muselfic](https://github.com/isaaxite/muselfic)。若你有有趣的方案请到原文的[评论](http://localhost:4000/blog/linux-daily-use/local-music-library-setup/#%E7%BB%93%E8%AF%AD)中分享给我，会有又见通知我的。如果你从本文获得了帮助或思路，请不要吝啬你的鼓励。你可以到原文写下[评论](http://localhost:4000/blog/linux-daily-use/local-music-library-setup/#%E7%BB%93%E8%AF%AD)，或给我在 Github 的博客项目点 [GitHub stars](https://github.com/isaaxite/isaaxite.github.io)、[GitHub watchers](https://github.com/isaaxite/isaaxite.github.io)，毕竟它的数据实际不怎么样。如果你财大气粗，不吝打赏 - [Buy me a coffee](http://localhost:4000/blog/linux-daily-use/local-music-library-setup/#%E7%BB%93%E8%AF%AD)。
