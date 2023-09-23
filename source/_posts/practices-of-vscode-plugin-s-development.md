---
title: practices of vscode-plugin's development
excerpt: practices of vscode-plugin's development
date: 2023-09-22 21:50:26
tags:
  - writting
categories:
---

`explorer/context`

给 vscode 侧边栏右键菜单添加选项。

```json
"contributes": {
  "commands": [{
    "command": "isubo-ext.helloWorld",
    "title": "Hello World"
  }],
  "menus": {
    "explorer/context": [{
      "command": "isubo-ext.helloWorld"
    }]
  }
},
```

`isubo-ext.helloWorld` 对应在 `extension.js` 中使用 `vscode.commands.registerCommand` 注册的命令。

`vscode.commands.registerCommand` 的第一个回调参数是 `file` 对象，例如：

```shell
{scheme: 'file', authority: '', path: '/home/isaac/Workspace/blog/source/_posts/Get-Start-Of-Github-Action.md', query: '', fragment: '', …}
extensionHostProcess.js:113
_formatted:
'file:///home/isaac/Workspace/blog/source/_posts/Get-Start-Of-Github-Action.md'
_fsPath:
'/home/isaac/Workspace/blog/source/_posts/Get-Start-Of-Github-Action.md'
authority:
''
fragment:
''
fsPath:
ƒ fsPath(){return this._fsPath||(this._fsPath=w(this,!1)),this._fsPath}
path:
'/home/isaac/Workspace/blog/source/_posts/Get-Start-Of-Github-Action.md'
query:
''
scheme:
'file'
[[Prototype]]:
k
```

`vscode.commands.registerCommand` 注册的命令可以使用多种方式触发，其中就有 `control+shift+p` 或 对侧边栏的文件树右键选择。后者方式触发，回调函数的第一个参数会是 file 对象。

在开发的过程中，使用到了nodejs的api。这时不禁有个疑问：是不是用户安装插件时，还需要提前安装nodejs环境？

但是以往的经验告诉我并非如此。在查阅相关资料后发现：

1. vscode本身使用Electron框架开发，而Electron是内置nodejs的！并且不同的vscode内置不同的nodejs。通过 vsode的版本信息就可以知道对应的nodejs版本，比如：

```shell
Version: 1.82.2
Commit: abd2f3db4bdb28f9e95536dfa84d8479f1eb312d
Date: 2023-09-14T05:51:20.981Z
Electron: 25.8.1
ElectronBuildId: 23779380
Chromium: 114.0.5735.289
Node.js: 18.15.0
V8: 11.4.183.29-electron.0
OS: Linux x64 6.1.0-12-amd64
```

## loading 提示

- 使用 VSCode 自带的进度条

```shell
vscode.window.withProgress({
  location: vscode.ProgressLocation.Window,
  title: 'Loading',
  cancellable: false
}, (progress) => {
  return new Promise((resolve) => {
    let cnt = 0;
    const timer = setInterval(() => {
      cnt += 10;
      // 可选
      progress.report({ increment: 10 });

      if (cnt >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
});
```

测试有效，是在vsocde底部状态栏左边有loading动态图标的提示，点击可以在右下呼起提示框。

- 使用 VSCode 插件 API 提供的状态栏项

```shell
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
statusBarItem.text = 'Loading...';
statusBarItem.show();

// 加载完成后更新状态栏项
statusBarItem.text = 'Loaded';
```

测试有效！但无动态图标！

# 确认窗框

```js
const options = ['Option 1', 'Option 2', 'Option 3'];

vscode.window.showQuickPick(options, {
  placeHolder: 'Select an option'
}).then((selectedOption) => {
  console.info(selectedOption);
});
```

测试有效。会在vscode窗口顶部弹出单选项。
