---
title: 安装适配优秀docker环境的win10系统
tags:
- windows
- win10
- wsl2
- docker
categories:
- 开发环境
---

# 前言

- 当前系统被安装安全扫描软件，并且无法删除；

- win11系统响应太慢，个人感受win10更加适合当前的使用场景；

# 新环境需求

- 优秀的dockers环境；

- WSL2，运行Debian系统

- windows 10系统

# WSL2

## 运行要求

TODO

## 安装

TODO

# 优秀的dockers环境

## 运行要求

>Prerequisites
Before you turn on the Docker Desktop WSL 2, ensure you have:
>
>- Windows 10, version 1903 or higher, or Windows 11.
>- Enabled WSL 2 feature on Windows. For detailed instructions, refer to the Microsoft documentation.
>- Downloaded and installed the Linux kernel update package.

# windows 10

## 系统版本选择

### FAQ

**Q1：Windows 10版本business_editions和consumer_editions的区别？**

二者都内置专业版，不同之处在于：

**consumer_editions 版本**包含：
  - Home(家庭版); 
  - Education(教育版) ; 
  - Professional(专业版)；

**business_editions 版本**包含：
  - Education(教育版); 
  - Enterprise (企业版); 
  - Professional(专业版)；

**Q2：Windows 10 各版本区别？**

- **家庭版(Home)**：供家庭用户使用，无法加入Active Directory和Azure AD，不允许远程链接

- **专业版(Professional)**：供小型企业使用 在家庭版基础上增加了域账号加入、bitlocker、企业商店等功能

- **企业版(Enterprise)**：供中大型企业使用 在专业版基础上增加了DirectAccess，AppLocker等高级企业功能

- **教育版(Education)**：供学校使用 (学校职员, 管理人员, 老师和学生) 其功能基本和企业版的一样

- **LTSB版**：无Edge浏览器、小娜，无磁贴，可选是否下载和安装补丁，其它版都不能自选补丁

- **N版**：带“N”的版本相当于阉割版，移除了Windows Media Player，几乎用不到N版。

参考以上，最终选择下载 **consumer_editions 版本**，选装 **专业版(Professional)**！



## 系统下载

下载地址：ed2k://|file|cn_windows_10_consumer_editions_version_1909_updated_jan_2020_x64_dvd_47161f17.iso|5417457664|274FEBA5BF0C874C291674182FA9C851|/

来源：https://msdn.itellyou.cn/


## 启动盘制作

TODO





参考：https://docs.docker.com/desktop/windows/wsl/
