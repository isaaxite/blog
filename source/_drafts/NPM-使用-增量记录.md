---
title: NPM 使用指南-增量记录
excerpt: npm 使用-增量记录
date: 2026-03-27 10:00:50
tags:
categories:
---



## 自动解析命令参数为`npm_config_` 环境变量

```bash
"test:md": "mkdir -p reports && ava --tap | tap-json | node ./.github/scripts/generate-report.js --title \"${npm_config_title:-AVA Test Results}\" > reports/ava-test.md"
```

这句 package.json 里的 scripts 命令可以这么使用：

```bash
npm run test:md --title="this is a title"
```

可以如此的原因是上面的 scripts 命令定义时使用了 `npm_config_title` 环境变量。NPM 将一切 `--<key>=<value>`形式的命令参数自动解析为存储了 `<value>` 的环境变量`npm_config_<key>`
