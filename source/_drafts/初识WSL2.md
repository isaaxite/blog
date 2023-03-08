---
title: 初识WSL2
tags:
- WSL
ccategories:
- [WSL]
---

# 安装

TODO

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



## 参考

- [Advanced settings configuration in WSL]

- [Wiki about 'Systemd']

- [What is the user 1000?]

- [What is Umask in Linux?]

- [Comparing WSL Versions]



[Advanced settings configuration in WSL]:https://learn.microsoft.com/en-us/windows/wsl/wsl-config

[Wiki about 'Systemd']:https://en.wikipedia.org/wiki/Systemd

[What is the user 1000?]:https://www.linuxquestions.org/questions/linux-general-1/what-is-the-user-1000-a-4175510196/

[What is Umask in Linux?]:https://www.liquidweb.com/kb/what-is-umask-and-how-to-use-it-effectively/

[Comparing WSL Versions]:https://learn.microsoft.com/en-us/windows/wsl/compare-versions?source=recommendations

[.wslconfig]:https://learn.microsoft.com/en-us/windows/wsl/wsl-config#example-wslconfig-file

[wsl.conf]:https://learn.microsoft.com/en-us/windows/wsl/wsl-config#example-wslconf-file