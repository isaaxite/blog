---
title: JavaScript (Node.js) Debug 指南
slug: guide/nodejs-js-debug
excerpt: Debug JS, NodeJS 指南
date: 2026-03-12 16:07:56
tags:
categories:

---





## vscode

项目根目录下创建 `.vscode/launch.json` 

内容：

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "migrate-assets",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/npm-scripts/migrate-assets/index.js",
      "console": "integratedTerminal"
    }
  ]
}
```

其中 `configurations` 的几个关键字：

- `program`：`${workspaceFolder}` 是根目录的占位符；
- `"console": "integratedTerminal"`：配置此行后，`terminal` 才会输出，以及交互



## 附录

- [Node.js debugging in VS Code](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)