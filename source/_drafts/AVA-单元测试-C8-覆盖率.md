---
title: AVA 单元测试 C8 覆盖率
excerpt: ava 单元测试|c8 覆盖率
date: 2026-03-21 09:47:38
tags:
categories:
---

## 安装

- ava 做单元测试
- c8 生成覆盖率报告

github action ~~上传测试报告、覆盖率报告到 Codecov~~（Codecov 的 commit 对比让它异常难用，改用 coveralls）：

- 测试报告：Codecov 的 Test Analytics 功能需要 JUnit XML 格式的测试报告。安装 `tap-xunit` 将 ava 的测试结果转换成 JUnit XML：`ava --tap | tap-xunit --package=path-treeify > reports/junit.xml`。
- JUnit XML 是较为通用的格式。
- 覆盖率报告：使用 `lcov` 格式。c8 默认支持输出。



## 参考

- [Codecov > Guide > Test Analytics](https://docs.codecov.com/docs/test-analytics)：测试报告格式要求说明；
- [Codecov > Guide > Supported Coverage Report Formats](https://docs.codecov.com/docs/supported-report-formats)：覆盖率报告格式要求说明；
- [Codecov GitHub Action](https://github.com/marketplace/actions/codecov)：`codecov/codecov-action@v5` 使用说明；
- [c8 - native V8 code-coverage](https://github.com/bcoe/c8#readme)：c8 - 原生 V8 代码覆盖率工具使用说明。
