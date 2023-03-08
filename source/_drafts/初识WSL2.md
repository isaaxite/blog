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

# 附录

## 参考

- [Advanced settings configuration in WSL](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)

- [Wiki about 'Systemd'](https://en.wikipedia.org/wiki/Systemd)