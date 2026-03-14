---
title: FFmpeg 处理音频
excerpt: Linux；Rhythmbox；
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

## ffmpeg

### 获取音频

已经下载到本地的音频，其中已包含元数据、封面和歌词等等数据，当前目的是从这样的音频中得到纯净的音频。

下面是从语言大模型得到的信息。将逐一测试

#### 0x01

使用 `ffmpeg` 删除歌曲封面的命令如下：

```bash
ffmpeg -i input.mp3 -c copy -map 0 -metadata:s:v title="" -metadata:s:v comment="" output.mp3
```

- `input.mp3` 是你要处理的原始文件。
- `output.mp3` 是去掉封面后的新文件名。
- `-c copy` 用于复制音频流，而不重新编码。
- `-map 0` 表示将所有流都包括在内。
- `-metadata:s:v title=""` 和 `-metadata:s:v comment=""` 用于清除封面图像的元数据。

*结果*：无效

#### 0x02

要获得一个完全不包含封面和其他元数据的纯净音频文件，可以使用以下 `ffmpeg` 命令：

```bash
ffmpeg -i input.mp3 -vn -acodec copy -map_metadata -1 output.mp3
```

- `-i input.mp3` 指定输入文件。
- `-vn` 表示不处理视频流（在音频文件中无视频流，但可以防止其他流）。
- `-acodec copy` 表示复制音频编码。
- `-map_metadata -1` 表示不复制任何元数据。

*结果*：有效

### 添加封面

获得纯净音频后。将本地图片做为封面添加到音频中。

下面是语言大模型提供的方案，会逐一做尝试。

#### 0x01

```shell
ffmpeg -i input.m4a -i cover.jpg -c copy -map 0 -map 1 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" output.m4a
```

- `input.m4a` 是你要添加封面的原始音频文件。
- `cover.jpg` 是你要用作封面的图片文件。
- `output.m4a` 是输出文件名。
- `-c copy` 表示复制音频流，而不重新编码。
- `-map 0` 表示包含第一个输入（音频）。
- `-map 1` 表示包括第二个输入（封面图像）。
- `-metadata:s:v title="Album cover"` 和 `-metadata:s:v comment="Cover (front)"` 为封面添加标题和注释。

*结果*：无效。见下面报错信息。输出的文件无法使用。

```shell
[ipod @ 0x562b21b52fc0] Could not find tag for codec mjpeg in stream #1, codec not currently supported in container
[out#0/ipod @ 0x562b21b52ec0] Could not write header (incorrect codec parameters ?): Invalid argument
Conversion failed
```
提供错误信息给大模型，得到的回答是：

> [!NOTE]
> 这个错误通常是因为 M4A 容器不支持 MJPEG 编码的封面图像。为了避免这个问题，可以将封面图像转换为 PNG 格式，或使用 JPG 格式，但确保使用正确的选项。

使用 ffmpeg 查看当前封面（`cover.jpg`）信息如下：

```shell
Input #0, image2, from 'cover.jpg':
  Duration: 00:00:00.04, start: 0.000000, bitrate: 25562 kb/s
  Stream #0:0: Video: mjpeg (Baseline), yuvj444p(pc, bt470bg/unknown/unknown), 640x640 [SAR 37:37 DAR 1:1], 25 fps, 25 tbr, 25 tb
```

可见确实是 mjpeg 格式的图片。

##### mjpeg to jpg

尝试使用大模型提供的，将mjpeg转jpg的两个方案均失败：

```shell
ffmpeg -i cover.jpg -q:v 2 output.jpg
```

```shell
ffmpeg -i cover.jpg -vf "scale=iw:ih" -q:v 2 output.jpg
```

最后解决方案是：使用截图工具得到 png 图片。

### 换用 mp3 容器

因个人喜好以及音频质量，而使用m4a格式，但在使用 ffmpeg 附着封面到音频时，遇到暂无法解决的问题，因此将音频格式换为mp3格式。

- [ x ] 获取纯净音频；
- [ x ] 附着封面图至音频；

#### 添加元数据

```shell
ffmpeg -i input.mp3 -metadata title="Your Title" \
-metadata artist="Your Artist" \
-metadata album="Your Album" \
-metadata album_artist="Your Album Artist" \
-metadata genre="Your Genre" \
-metadata date="2025" \
-metadata composer="Your Composer" \
-c copy output.mp3
```

*结果*：有效。
