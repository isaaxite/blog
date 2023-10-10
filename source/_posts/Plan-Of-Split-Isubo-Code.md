---
title: Plan Of Split Isubo Code
excerpt: Plan Of Split Isubo Code
date: 2023-09-23 10:47:16
tags:
  - writting
categories:
---

# 前言

目前 isubo（[v0.0.12-beta.0](https://github.com/isaaxite/deploy-posts-to-github-issue/tree/v0.0.12-beta.0)） 默认以 CLI 工具存在。该版本包含了 cli 脚本 和 cli 的 prompt 提示，并且前面两者都与核心代码耦合在一起。在这种情况下不利于扩展到多平台。计划将它们与核心代码分离，将核心代码作为单独的 api 库发布。


