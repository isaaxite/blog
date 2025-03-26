---
title: linux-Rhythmbox|local musics
excerpt: linux-Rhythmbox|local musics
date: 2025-03-24 06:45:36
tags:
categories:
---
# 目的

- 下载音频
- 完善音频信息
- 选择并优化本地音频播放器

# 背景

```shell
# System Details Report
---

## Report details
- **Date generated:**                              2025-03-24 07:20:52

## Hardware Information:
- **Hardware Model:**                              ASUSTeK COMPUTER INC. TUF B360M-PLUS GAMING S
- **Memory:**                                      16.0 GiB
- **Processor:**                                   Intel® Core™ i5-8600K × 6
- **Graphics:**                                    NV137
- **Disk Capacity:**                               1.3 TB

## Software Information:
- **Firmware Version:**                            2418
- **OS Name:**                                     Fedora Linux 41 (Workstation Edition)
- **OS Build:**                                    (null)
- **OS Type:**                                     64-bit
- **GNOME Version:**                               47
- **Windowing System:**                            Wayland
- **Kernel Version:**                              Linux 6.13.6-200.fc41.x86_64
```

# 下载音频


## 音源选择

这里说的音源选择并非是选择那个音乐平台，而是选择下载音频（audio）还是视频（video -> audio）。在目前这个时间点，想要直接下载免费且优质的音频已经不是容易的事。音乐的版权越来越规范，音频被不同的平台收录，防盗措施也做得越来越好。想通过非官方提供的手段下载的门槛也是越发的高，尽管有也不知道那天就会失效！并且音源是通过手机软件、电脑客户端的形式提供。此类形式，本身就自带门槛！另外，尽管愿意为音乐买单付费，也可能存在你喜欢的列表里的音频版权不完全归属于统一平台，这不单止增加成本也带来体验的割裂感！

日前不久，较大的[免费音频下载网站](https://tools.liumingye.cn/p/bulletin/myfreemp3%e5%81%9c%e6%ad%a2%e8%bf%90%e8%90%a5%e9%80%9a%e7%9f%a5)也停止运营，直接下载音频的路也不好走！而音乐视频方面，目前看来还是路平且宽：

1. **无版权问题**：音乐类视频由个人用户上传而非官方所有；
2. **下载门槛较低**：视频平台都有网页端，甚至运营的侧重点就是网页端！而从网页端下载资源的难度在我看来比起客户端是要底得多的；
3. **音源质量不错**：不少个人用户上传的音乐视频是官方 MV 或者是经过二次优化处理的。

## 下载工具

下载工具可以从 3 个方向选择：

1. 专门下载视频的个人网站，如 [UKC.COM.NP](https://www.ukc.com.np/p/youtube-m4a.html)；
2. 浏览器插件；
3. Linux 软件（图形 or CMD 工具）。

这里不是要对比以上方式的优劣（当然我都尝试过以上方向），仅仅是记录当前我正使用的一款 Linux 软件：[Parabolic](https://github.com/NickvisionApps/Parabolic)。

![](file-20250325055209088.png)
Parabolic 是由 Nickvision 开发的一款 Linux 软件，旨在帮助用户下载网络视频和音频。以下是 Parabolic 的一些主要特点和信息：

1. **功能**：
    
    - Parabolic 是一个基本的 yt-dlp 前端，支持多种格式的视频下载，包括 mp4、webm、mp3、m4a、opus、flac 和 wav。
    - 允许同时运行多个下载任务。
    - 支持下载视频元数据和字幕。
2. **版本更新**：
    
    - 最近的版本是 2025.1.4，约两个月前发布，包含一些功能修改和修复，例如添加了新选项以启用或禁用独立下载缩略图，修复了一些格式选择和章节分割的问题。
3. **系统需求**：
    
    - 安装大小约为 428.17 MiB，下载大小为 162.82 MiB。
    - 兼容的架构包括 aarch64 和 x86_64。
4. **社区驱动**：
    
    - Parabolic 是一个开放社区开发的项目，遵循 GNU General Public License v3.0 或更高版本的许可协议。
5. **安装信息**：
    
    - 目前该应用的安装量已超过 201,449 次。


使用方式非常简单，此处不做赘述。

# 完善本地音频

音源无论是来源于免费的音频网站或是视频网站都有一个共有的缺点：音频信息不完整或不理想，如封面（cover）、标题（title）、专辑信息（artist、artist album）、作曲家（composer）、歌词（lyrics）等等。

结合当前我已知的信息，一个较为完整的音频当具备以下信息：

- Cover（专辑封面）；
- Title（歌曲标题，非文件名）；
- Artist（音乐演奏者）；
- Album Artist（发行当前专辑的艺术家）；
- Composer（作曲家）；
- Genre（音乐的风格）；
- Track number / Total tracks；（当前音乐在专辑中的序号 / 专辑的所有音乐数）
- Year（发行年份）；
- Lyrics（可选，歌词）。
## 音频数据获取

关于以上音频的基本信息，推荐使用 deepseek 等大模型进行检索。比起使用浏览器，大模型会更加方便、提供的信息更加精准。

![](file-20250325155651160.png)

## 编辑音频数据

关于音乐数据的编辑，这里提供 2 种我接触到的方式：

1. Linux 图形化软件：[Ear Tag](https://gitlab.gnome.org/World/eartag)；
2. CMD 工具：[FFmpeg](https://www.ffmpeg.org/)。

此处先不对 FFmpeg 作展开，后续工作流的优化时再作相关说明。Ear Tag 是图形化软件，使用几乎是没有门槛：

![](file-20250325064237413.png)

**Ear Tag**（原名 **GNOME Music Tagger**）是一款 **GTK 4** 开发的 **开源音频元数据编辑器**，专为 **GNOME 桌面环境** 设计，适用于 **Linux** 系统。它提供简洁的图形界面，支持编辑 MP3、FLAC、OGG、M4A 等常见音频文件的标签信息（如标题、艺术家、专辑封面等）。  

### **核心功能**  

1. **元数据编辑**  
   - 修改基础标签：标题（Title）、艺术家（Artist）、专辑（Album）、年份（Year）、流派（Genre）等。  
   - 支持 **嵌入式专辑封面**（可添加/删除/替换）。  
   - 自动从 **MusicBrainz** 数据库获取元数据（需联网）。  

2. **文件管理**  
   - 批量编辑多个文件的标签。  
   - 支持通过文件名自动填充标签（如 `Artist - Title.mp3` 格式）。  

### **优缺点**  

**优点**  
- 界面现代简洁，符合 GNOME 设计规范；
- 支持批量编辑和 MusicBrainz 自动补全；
- 轻量级，无复杂依赖。

**缺点**  
- 功能较基础，不适合专业音频管理（如无音频波形编辑）；
- 部分格式支持有限（如 WAV 标签写入可能不兼容）。  

# 本地音频播放器

Linux 支持播放本地音频的播放器很多，经体验不下 10 款后，我选择了其中两款：

- [Amberol](https://apps.gnome.org/Amberol/)：一款轻量级、现代化的 **Linux 音乐播放器**，专为 **GNOME 桌面环境**设计。它专注于**简洁播放体验**，界面极简，适合快速播放本地音乐文件，无复杂功能干扰。；
- [Rhythmbox](https://wiki.gnome.org/Apps/Rhythmbox)：**GNOME** 桌面环境默认的**音乐播放与管理软件**，适用于 **Linux** 系统。它提供音频播放、音乐库管理、网络电台、播客支持等功能，界面简洁易用，适合日常听歌和轻度音乐整理需求。；

## Amberol
![](file-20250325160649645.png)
### 优点

- **界面美观**：现代化 GTK 4 设计，无冗余元素；
- **快速流畅**：专注播放，无后台扫描或数据库负担；
- **适合 GNOME**：完美融入最新 GNOME 桌面。

### 缺点

- 功能极其基础，不支持播放列表、标签编辑或高级音效；
- 仅适合临时播放，不适合管理大型音乐库。

### 适用场景

- 需要快速播放单个或少量音乐文件（如临时试听）；
- 偏好 GNOME 原生应用风格，追求极简体验；
- 作为备用播放器，搭配 Rhythmbox 使用。

## Rhythmbox

![](file-20250324070625947.png)

### 优点

- **集成度高**：GNOME 默认应用，与桌面环境无缝兼容；
- **功能全面**：覆盖播放、电台、播客等常见需求；
- **低资源占用**：相比 Amarok 或 Clementine 更轻量。

### 缺点

- 界面较传统，缺乏现代化设计（如未适配 GTK 4）；
- 高级功能（如智能播放列表）不如 **Amarok** 或 **Clementine**。、

### 适用场景

- GNOME 用户需要一款开箱即用的播放器；
- 管理本地音乐库 + 收听网络电台/播客；
- 作为基础工具，搭配插件扩展功能。

### 插件

#### Alternative Toolbar

上面图片中 Rhythmbox 的外观并非原有的，而是安装第三方插件 [fossfreedom /alternative-toolbar](https://github.com/fossfreedom/alternative-toolbar) 后并作简单配置的效果。下面是原有的外观：

![](file-20250326093045383.png)

 [fossfreedom /alternative-toolbar](https://github.com/fossfreedom/alternative-toolbar) 旨在改进默认界面的用户体验，提供更现代化的布局和增强的功能。在多个方面都作了不同程度的增强与优化：
 ![图片来自alternative-toolbar 的 Github README](file-20250326094015785.png)

**1. 界面优化**

✅ **更紧凑的工具栏**

- 合并播放控制、搜索栏和视图切换，减少空间占用。
- 支持自定义工具栏按钮（隐藏/显示特定功能）。

✅ **现代化的播放控制**

- 更直观的播放按钮（类似现代播放器风格）。    
- 支持进度条内显示当前/总时间。

✅ **主题适配**

- 支持 **Dark Mode（深色模式）**，适配 GNOME 环境。
- 可调整工具栏高度，适应不同屏幕尺寸。

---

**2. 功能增强**

🔧 **增强的搜索功能**

- 全局搜索栏集成到工具栏，快速查找歌曲、专辑或艺术家。

🔧 **快捷视图切换**

- 一键切换 **“专辑视图”**、**“艺术家视图”** 和 **“播放列表”**，无需进入侧边栏。

🔧 **播放状态显示优化**

- 当前播放歌曲信息（标题、艺术家）直接显示在工具栏。
- 可自定义显示元数据（如比特率、文件格式）。

---

**3. 自定义选项**

⚙️ **可调整布局**

- 允许用户选择 **经典模式**（默认 Rhythmbox 风格）或 **紧凑模式**（节省空间）。    
- 支持隐藏不常用的按钮（如广播、播客）。

⚙️ **快捷键支持**

- 提供额外的键盘快捷键控制播放（如 `Ctrl+F` 快速聚焦搜索栏）。

#### 其他

除了 Alternative Toolbar 外，Rhythmbox 还有内置的、外置的插件。在 Perferences -> Plugins 中可见。但目前为止，Alternative Toolbar 是我觉得作用最大，对于其他的插件，我赞为体会到他们美好！有几个内置的插件（如 Cover art search、Songs Lyrics），从标题与简介来看颇用用处，但实际使用时（选中主页面中音频条目后右键选择“Properties”可体验）却无甚大用。
![](file-20250326095253052.png)