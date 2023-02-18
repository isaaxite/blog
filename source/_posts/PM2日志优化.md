---
title: PM2日志优化
date: 2022-11-01 13:09:01
tags:
- PM2
- 日志处理
- 旧文迁移
categories:
- 服务端
---

# 默认pm2日志存在的问题

1. 缺少日志时间戳；
2. 缺少日志分片；
3. 没有日志rotate 功能，定期清除防止磁盘爆满

<!-- more -->


## PM2自带的日志
https://pm2.keymetrics.io/docs/usage/log-management/

## PM2的日志扩展插件
[pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)


# 默认情况下，处理日志临近饱满磁盘的办法

## 删除文件

1 查看日志文件位置
```shell
pm2 show <app name>
```

2 删除日志

```shell
rm -rf xxx
```

3 重启应用

重启应用会自动再生成日志文件！

```
pm2 relaod <app name>
```

## pm2清洗日志命令

这将清空当前pm2应用程序日志! 

```shell
pm2 flush

pm2 flush <api> # Clear the logs for the app with name/id matching <api>
```


# pm2-logrotate基本使用

## 安装

```shell
pm2 install pm2-logrotate

# output

[PM2][Module] Installing NPM pm2-logrotate module
[PM2][Module] Calling [NPM] to install pm2-logrotate ...
+ pm2-logrotate@2.7.0
added 213 packages from 236 contributors and audited 214 packages in 9.267s
```
![image](https://user-images.githubusercontent.com/25907273/199225377-6850e2b9-ffe8-4952-973c-571f591c711e.png)

## 查看rotate配置

```
pm2 conf

# output

Module: pm2-logrotate
$ pm2 set pm2-logrotate:max_size 10M
$ pm2 set pm2-logrotate:retain 30
$ pm2 set pm2-logrotate:compress false
$ pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
$ pm2 set pm2-logrotate:workerInterval 30
$ pm2 set pm2-logrotate:rotateInterval 0 0 * * *
$ pm2 set pm2-logrotate:rotateModule true
Module: module-db-v2
$ pm2 set module-db-v2:pm2-logrotate [object Object]
```

## 查看日志分片

![image](https://user-images.githubusercontent.com/25907273/199226021-2a431cae-143f-4350-baa9-65f0ea038ae4.png)

## 修改配置

```shell
pm2 set pm2-logrotate:<conf key> <conf val>
```


