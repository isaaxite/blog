---
title: Typora 替换 Tab 为 Space 实践与方案
segment: guide/typora-tab-to-space
excerpt: 已知 Typora 不支持改 Tab 为 Space，尝试以拦截替换的方式实现。全文记录使用 xremap 成功拦截 Tab，替换为可配置个数的空格，且仅对 Typora 生效。xremap 执行需要 sudo 权限和它是个前台程序，基于这两个小问题，再做进一步探索，尝试让 xremap 更加优雅的方式达到目的。探索的最后，因储备知识有限，未试可能解决的方案，而借助 tmux 做了临时的处理。
date: 2026-03-20 05:15:32
tags:
- typora
- tab
- space
- xremap
- 替换空格
- 用户组
- 服务
- systemctl
categories:
- [Linux]
- [Linux 工具]
---

## 引言

Typora 已知的情况是：它不支持配置 Tab 替换为空格。另辟蹊径的方案是：使用工具拦截 Tab 键，理想的情况是仅仅对 Typora 做拦截。拦截后，每次在 Typora 编辑器內按下 Tab 插入空格（2 或 4，可配置）。确实找到这么一个软件：

> [xremap / xremap](https://github.com/xremap/xremap) - `xremap` is a key remapper for Linux. Unlike `xmodmap`, it supports app-specific remapping and Wayland.

下文记录针对使用 xremap 替换 Tab 为空格的过程。结论是它确实有效拦截并插入空格（可配置），并且可配置仅对某个窗口生效，比如 Typora。功能性没有问题，但存在些不算问题的问题：

- 需要 sudo 权限执行；
- 执行后，运行的是前台程序。

因此，除了解决 Tab 替换问题，下文还记录了关于以上两个问题的实践探索。最终没有完全达到预期，而是使用了临时性的折中方案。但主要因为知识储备不足，而未尝试可能有效的方案，才导致现在这么个情况。

## 环境信息

- OS: LMDE 6 (faye) x86_64
- Kernel: 6.1.0-42-amd64
- Typora: 1.12.4

## 安装

**Step 1** - Github Releases 页面，下载 [xremap / xremap](https://github.com/xremap/xremap/releases) 的 [xremap-linux-x86_64-x11.zip](https://github.com/xremap/xremap/releases/download/v0.14.18/xremap-linux-x86_64-x11.zip)

**Step 2** - 解压得到 `xremap` 文件。

**Step 3** - 将文件移动到 `/usr/local/bin/`

```bash
sudo mv ~/Downloads/xremap /usr/local/bin/
```

## 配置

**Step 1** - 创建目录：`~/.config/xremap/`

**Step 2** - 添加配置（`config.yml`）：

```yml
keymap:
  - name: Typora Tab to Space
    application:
      only: [Typora]
    remap:
      Tab: [Space, Space]
```

## 启动

`sudo` 启动 - **Tab 替换成功**。但 xremap 运行在**前台进程**，占用了终端的标准输入/输出：

```bash
# isaac @ LMDE in ~/.config/xremap [5:04:58] 
$ sudo xremap ~/.config/xremap/config.yml
Selecting devices from the following list:
------------------------------------------------------------------------------
/dev/input/event0 : Sleep Button
/dev/input/event1 : Power Button
/dev/input/event10: HDA NVidia HDMI/DP,pcm=8
/dev/input/event11: HDA NVidia HDMI/DP,pcm=9
/dev/input/event12: HDA Intel PCH Rear Mic
/dev/input/event13: HDA Intel PCH Front Mic
/dev/input/event14: HDA Intel PCH Line
/dev/input/event15: HDA Intel PCH Line Out
/dev/input/event16: HDA Intel PCH Front Headphone
/dev/input/event2 : Power Button
/dev/input/event3 : Keychron Keychron K2
/dev/input/event4 : Keychron Keychron K2
/dev/input/event5 : Logitech G304
/dev/input/event6 : PC Speaker
/dev/input/event7 : Eee PC WMI hotkeys
/dev/input/event8 : HDA NVidia HDMI/DP,pcm=3
/dev/input/event9 : HDA NVidia HDMI/DP,pcm=7
------------------------------------------------------------------------------
Selected keyboards automatically since --device options weren't specified:
------------------------------------------------------------------------------
/dev/input/event3 : Keychron Keychron K2
/dev/input/event4 : Keychron Keychron K2
/dev/input/event5 : Logitech G304
------------------------------------------------------------------------------
application-client: X11 (supported: true)
application: xed.Xed
^C	# Control + C 退出

# isaac @ LMDE in ~/.config/xremap [5:04:47] C:130
```

## 服务化

xremap 运行在前台进程，尝试让它在后台以服务方式运行。

**Step 1** - 创建并配置服务文件

```bash
# isaac @ LMDE in ~/.config/xremap [5:09:29] C:130
$ mkdir -p ~/.config/systemd/user

# isaac @ LMDE in ~/.config/xremap [5:09:31] 
$ vim ~/.config/systemd/user/xremap.service
```

`~/.config/systemd/user/xremap.service` 的内容：

```bash
# isaac @ LMDE in ~/Workspace/path-treeify on git:main o [5:16:02] 
$ cat ~/.config/systemd/user/xremap.service
[Unit]
Description=xremap key remapper

[Service]
ExecStart=/usr/local/bin/xremap /home/isaac/.config/xremap/config.yml
Restart=on-failure

[Install]
WantedBy=default.target
```

**Step 2** - 让 systemd 读取新建的 service 文件：

**注：以后修改了 .service 文件才需要重新执行**

```bash
# isaac @ LMDE in ~/.config/xremap [5:10:11] 
$ systemctl --user daemon-reload
```

**Step 3** - 设置开机自动启动：

只需执行一次，之后每次开机会自动生效。

```bash
# isaac @ LMDE in ~/.config/xremap [5:12:06] 
$ systemctl --user enable xremap
Created symlink /home/isaac/.config/systemd/user/default.target.wants/xremap.service → /home/isaac/.config/systemd/user/xremap.service.
```

**Step 4** - 立即启动：

`start` — 本次立即启动，**只需执行一次**，之后开机会由 enable 自动接管

```bash
# isaac @ LMDE in ~/.config/xremap [5:12:13] 
$ systemctl --user start xremap
```

注：其他或将使用的命令：

取消开机自启：

```bash
systemctl --user disable xremap
```

查看当前是否添加开机启动：

输出 `enabled` 表示已开机自启，`disabled` 表示未开启。

```bash
systemctl --user is-enabled xremap
```

列出当前用户所有已设置开机自启的服务：

注：若要查看系统级（sudo 级别）的开机自启服务，则去掉 `--user`。

```bash
systemctl --user list-unit-files --state=enabled
```

停止当前正在运行的进程：

```bash
systemctl --user stop xremap
```

## 服务化异常

服务启动后（`systemctl --user start xremap`），Tab 替换失败。

### 异常归因

**Step 1** - 检查状态：

```bash
# isaac @ LMDE in ~/.config/xremap [5:12:37] 
$ systemctl --user status xremap
× xremap.service - xremap key remapper
     Loaded: loaded (/home/isaac/.config/systemd/user/xremap.service; enabled; preset: enabled)
     Active: failed (Result: exit-code) since Fri 2026-03-20 05:12:38 CST; 1min 52s ago
   Duration: 3ms
    Process: 3887383 ExecStart=/usr/local/bin/xremap /home/isaac/.config/xremap/config.yml (code=exited, status=1/FAILURE)
   Main PID: 3887383 (code=exited, status=1/FAILURE)
        CPU: 3ms

Mar 20 05:12:38 LMDE systemd[1072]: xremap.service: Scheduled restart job, restart counter is at 5.
Mar 20 05:12:38 LMDE systemd[1072]: Stopped xremap.service - xremap key remapper.
Mar 20 05:12:38 LMDE systemd[1072]: xremap.service: Start request repeated too quickly.
Mar 20 05:12:38 LMDE systemd[1072]: xremap.service: Failed with result 'exit-code'.
Mar 20 05:12:38 LMDE systemd[1072]: Failed to start xremap.service - xremap key remapper.
```

服务已经是 `failed` 状态，没有在运行：

```bash
Mar 20 05:12:38 LMDE systemd[1072]: Failed to start xremap.service - xremap key remapper.
```

**Step 2** - 直接执行（无 `sudo`），查看输出：

```bash
# isaac @ LMDE in ~/.config/xremap [5:16:02] C:3
$ /usr/local/bin/xremap ~/.config/xremap/config.yml
Selecting devices from the following list:
------------------------------------------------------------------------------
------------------------------------------------------------------------------
Selected keyboards automatically since --device options weren't specified:
------------------------------------------------------------------------------
Error: Failed to prepare input devices: No device was selected!
```

推论：**xremap 找不到可用的输入设备。**Linux 中 `/dev/input/` 下的设备文件（键盘、鼠标等）默认只有 `root` 和 `input` 组的成员才能读写。xremap 需要直接读取这些设备来拦截按键，若当前用户不在 `input` 组内，则报"No device was selected"。

**验证 1** - 执行 `xremap --list-devices` ：

无 `sudo`情况下执行：无设备信息输出。

```bash
# isaac @ LMDE in ~/Workspace/blog on git:main x [7:03:04] 
$ xremap --list-devices
PATH NAME IS_KEYBOARD IS_MOUSE TYPE VENDOR PRODUCT 

# isaac @ LMDE in ~/Workspace/blog on git:main x [7:03:09] 
$ sudo xremap --list-devices
[sudo] password for isaac:              
PATH               NAME                          IS_KEYBOARD IS_MOUSE TYPE    VENDOR PRODUCT 
/dev/input/event0  Sleep Button                  false       false    Host    0x0    0x3     
/dev/input/event1  Power Button                  false       false    Host    0x0    0x1     
/dev/input/event10 HDA NVidia HDMI/DP,pcm=8      false       false    Unknown 0x0    0x0     
/dev/input/event11 HDA NVidia HDMI/DP,pcm=9      false       false    Unknown 0x0    0x0     
/dev/input/event12 HDA Intel PCH Rear Mic        false       false    Unknown 0x0    0x0     
/dev/input/event13 HDA Intel PCH Front Mic       false       false    Unknown 0x0    0x0     
/dev/input/event14 HDA Intel PCH Line            false       false    Unknown 0x0    0x0     
/dev/input/event15 HDA Intel PCH Line Out        false       false    Unknown 0x0    0x0     
/dev/input/event16 HDA Intel PCH Front Headphone false       false    Unknown 0x0    0x0     
/dev/input/event17 xremap                        true        true     USB     0x1234 0x5678  
/dev/input/event2  Power Button                  false       false    Host    0x0    0x1     
/dev/input/event3  Keychron Keychron K2          true        false    USB     0x5ac  0x24f   
/dev/input/event4  Keychron Keychron K2          true        false    USB     0x5ac  0x24f   
/dev/input/event5  Logitech G304                 true        false    USB     0x46d  0x4074  
/dev/input/event6  PC Speaker                    false       false    ISA     0x1f   0x1     
/dev/input/event7  Eee PC WMI hotkeys            false       false    Host    0x0    0x0     
/dev/input/event8  HDA NVidia HDMI/DP,pcm=3      false       false    Unknown 0x0    0x0     
/dev/input/event9  HDA NVidia HDMI/DP,pcm=7      false       false    Unknown 0x0    0x0
```

**验证 2** - 查询用户 `isaac` 所属的所有用户组

注：不加用户名则默认查询当前登录用户。

```bash
# isaac @ LMDE in ~/Workspace/blog on git:main x [7:03:23] 
$ groups isaac
isaac : isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users netdev lpadmin bluetooth scanner sambashare
```

输出列表中没有 `input`，说明 `isaac` 用户不在 `input` 组内。

### 尝试方案：编辑用户组

将用户 `isaac` 添加到 `input` 用户组：

用户态运行 xremap 需要有权限访问 `/dev/input/` 设备，当前用户不在 `input` 组里。使用 `usermod` ，将  `isaac` 添加到 `input` 用户组。

`usermod` 的两个选项组合含义：

- `-G` — 指定要加入的附加组（supplementary group）；
- `-a` — append，追加模式，在现有组的基础上新增，**不会移除**已有的组。

*注：如果只用 `-G` 不加 `-a`，会把用户的附加组替换为仅 `input` 一个，导致原本所属的其他组（如 `sudo`、`audio` 等）全部丢失，是危险操作。所以 `-a` 必须和 `-G` 一起用！*

```bash
sudo usermod -aG input isaac
```

然后**重新登录**（注销再登录，不是开新终端），让组权限生效。加入组后需要重新登录是因为组权限在登录时加载，新终端不够触发重新加载组权限，必须完整注销再登录才能生效。

**异常** - 将 issac 添加到 input 组，注销登录后查看，当前会话实际加载的组中（`groups`（不带用户名））仍未写入：

```bash
# isaac @ LMDE in ~ [2:12:49] 
$ groups isaac
isaac : isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users input netdev lpadmin bluetooth scanner sambashare

# isaac @ LMDE in ~ [2:12:54] 
$ groups      
isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users netdev lpadmin bluetooth scanner sambashare
```

重启电脑后查看：

当前会话中，isaac 用户确实已经在 input 组內。但服务启动仍然失败。

```bash
# isaac @ LMDE in ~ [2:20:11] 
$ groups                            
isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users input netdev lpadmin bluetooth scanner sambashare

# isaac @ LMDE in ~ [2:20:19] 
$ groups isaac                      
isaac : isaac adm dialout fax cdrom floppy tape sudo audio dip video plugdev users input netdev lpadmin bluetooth scanner sambashare

# isaac @ LMDE in ~ [2:20:26] 
$ systemctl --user status xremap    
× xremap.service - xremap key remapper
     Loaded: loaded (/home/isaac/.config/systemd/user/xremap.service; enabled; preset: enabled)
     Active: failed (Result: exit-code) since Sat 2026-03-21 02:20:10 CST; 31s ago
   Duration: 916ms
    Process: 1680 ExecStart=/usr/local/bin/xremap /home/isaac/.config/xremap/config.yml (code=exited, status=1/FAILURE)
   Main PID: 1680 (code=exited, status=1/FAILURE)
        CPU: 2ms

Mar 21 02:20:10 LMDE systemd[1067]: xremap.service: Scheduled restart job, restart counter is at 5.
Mar 21 02:20:10 LMDE systemd[1067]: Stopped xremap.service - xremap key remapper.
Mar 21 02:20:10 LMDE systemd[1067]: xremap.service: Start request repeated too quickly.
Mar 21 02:20:10 LMDE systemd[1067]: xremap.service: Failed with result 'exit-code'.
Mar 21 02:20:10 LMDE systemd[1067]: Failed to start xremap.service - xremap key remapper.
```

无 `sudo` 执行 `xremap` 测试：

用户态运行 xremap 已经有权限访问 `/dev/input/` 设备。当前错误显示：**输出设备**权限不足，需要加入 `uinput` 组。

```bash
# isaac @ LMDE in ~ [2:20:41] C:3
$ /usr/local/bin/xremap ~/.config/xremap/config.yml
Selecting devices from the following list:
------------------------------------------------------------------------------
/dev/input/event0 : Sleep Button
/dev/input/event1 : Power Button
/dev/input/event10: HDA NVidia HDMI/DP,pcm=8
/dev/input/event11: HDA NVidia HDMI/DP,pcm=9
/dev/input/event12: HDA Intel PCH Rear Mic
/dev/input/event13: HDA Intel PCH Front Mic
/dev/input/event14: HDA Intel PCH Line
/dev/input/event15: HDA Intel PCH Line Out
/dev/input/event16: HDA Intel PCH Front Headphone
/dev/input/event2 : Power Button
/dev/input/event3 : Keychron Keychron K2
/dev/input/event4 : Keychron Keychron K2
/dev/input/event5 : Logitech G304
/dev/input/event6 : PC Speaker
/dev/input/event7 : Eee PC WMI hotkeys
/dev/input/event8 : HDA NVidia HDMI/DP,pcm=3
/dev/input/event9 : HDA NVidia HDMI/DP,pcm=7
------------------------------------------------------------------------------
Selected keyboards automatically since --device options weren't specified:
------------------------------------------------------------------------------
/dev/input/event3 : Keychron Keychron K2
/dev/input/event4 : Keychron Keychron K2
/dev/input/event5 : Logitech G304
------------------------------------------------------------------------------
Error: Failed to prepare an output device: Permission denied (os error 13)
```

查看组列表中是否有 uinput - **没有**：

```bash
# isaac @ LMDE in ~ [2:33:27] 
$ cat /etc/group | grep uinput 

# isaac @ LMDE in ~ [2:34:03] C:1
```

查看 uinput 设备权限：

```bash
# isaac @ LMDE in ~ [2:26:37] C:1
$ ls -la /dev/uinput
crw------- 1 root root 10, 223 Mar 21 02:19 /dev/uinput
```

当前 `/dev/uinput` 只有 `root` 可读写，且没有分配给任何用户组（组也是 `root`）。

---

可能有效当时还**未尝试**的方案：

```bash
# 新增 uinput 用户组
sudo groupadd uinput

# 将当前用户 isaac 添加到 uinput 用户组
sudo usermod -aG uinput isaac

# 将 /dev/uinput 所属的用户组从 root 改为 uinput
sudo chown root:uinput /dev/uinput

# 修改 /dev/uinput 文件的权限
# 660：所有者、所属用户组具有可读可写，不可执行的权限
sudo chmod 660 /dev/uinput
```

- 所有者（Owner）：读（4） + 写（2） = 6 （可读可写，不可执行）；
- 用户组（Group）：读（4） + 写（2） = 6 （可读可写，不可执行）；
- 其他用户（Others）：0 （无任何权限）。

并且， `chown` 和 `chmod` 的修改重启后会丢失，需要用 udev 规则持久化：

```bash
echo 'KERNEL=="uinput", GROUP="uinput", MODE="0660"' | sudo tee /etc/udev/rules.d/99-uinput.rules
```

全部执行后注销重新登录再测试。

### 临时方案：tmux-session

当前临时使用的方案 - tmux session 与 client 分离：

```bash
tmux
```

将打开一个会话（session），执行：

```bash
sudo xremap ~/.config/xremap/config.yml
```

然后，用 `ctrol-b` + `d`（关于 tmux 的更多使用，[点击查看](https://isaaxite.indevs.in/blog/usage/tmux/)），将当前执行了 `xremap` 前台程序的 session 与 client 分离。

可以使用 `ls` 命令查看会话：

```bash
# isaac @ LMDE in ~/Workspace/path-treeify on git:main o [5:21:58] 
$ tmux ls
0: 1 windows (created Sat Mar 21 03:22:49 2026)
```

使用 `attach` 将 session 重新附着到 client（查看前台程序执行状态）：

```bash
# isaac @ LMDE in ~/Workspace/path-treeify on git:main o [15:48:26] 
$ tmux attach -t 0
```

注：`0` - session 的序号，具体是多少根据 `ls` 输出判断。
