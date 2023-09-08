---
title: isubo - add feat of only-print
date: 2023-09-06 00:29:54
layout: post
---

yargs 添加 `options`，`only-print`

参考：https://github.com/yargs/yargs/blob/main/docs/api.md#optionkey-opt

```js
var argv = require('yargs/yargs')(process.argv.slice(2))
  .option('f', {
      alias: 'file',
      demandOption: true,
      default: '/etc/passwd',
      describe: 'x marks the spot',
      type: 'string'
  })
  .argv;
```

修改为使用cmd，`isubo format`。

增加 option

- `--print`: 打印到 console；

- `--clipboard`: 输出到剪切板


# 附录

## 参考

- [How to Test Yargs CLI with Jest](https://kgajera.com/blog/how-to-test-yargs-cli-with-jest/)