---
title: Get-Start-Of-VScode-Ext-Dev
excerpt: Get-Start-Of-VScode-Ext-Dev
date: 2023-09-18 10:10:59
tags:
  - writting
categories:
---

# 初始化项目

安装 Yeoman 和 VS Code Extension Generator：

```shell
pnpm add install yo generator-code --save-dev
```

# 声明

使用 package.json 作为声明文件，详细配置字段查阅 [Extension Manifest Reference](https://code.visualstudio.com/api/references/extension-manifest)

# 入口文件

> The extension entry file exports two functions, activate and deactivate. activate is executed when your registered Activation Event happens. deactivate gives you a chance to clean up before your extension becomes deactivated. 

生命周期钩子函数：

- activate
- deactivate

# 三个概念

[Activation Events](https://code.visualstudio.com/api/references/activation-events): events upon which your extension becomes active.
[Contribution Points](https://code.visualstudio.com/api/references/contribution-points): static declarations that you make in the package.json Extension Manifest to extend VS Code.
[VS Code API](https://code.visualstudio.com/api/references/vscode-api): a set of JavaScript APIs that you can invoke in your extension code.

# UX Guidelines

https://code.visualstudio.com/api/ux-guidelines/overview

说明vscode 界面布局区域

# 注册命令

```js
vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
```

注册之后即可在声明文件中调用，比如上面的 `nodeDependencies.refreshEntry`
