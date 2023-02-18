---
title: 编写油猴脚本扩展github评论编辑器，增加全屏模式
date: 2022-10-31 13:15:34
tags:
- tampermonkey
- 旧文迁移
- 油猴脚本
categories:
- 油猴脚本
excerpt: " "
---

# 安装插件

安装 [tampermonkey](https://www.tampermonkey.net/index.php?version=4.18.0&ext=dhdg&show=dhdg#)

# 注释说明

```js
// ==UserScript==
// @name         Comment Zoomer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add zoom button in github comment to provide full screen mode, allowing you to write comments more elegantly
// @author       IsaacKam
// @match        https://github.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// ==/UserScript==
```

属性名 | 作用
:-- | :--
name | 油猴脚本的名字
namespace | 命名空间，类似于Java的包名，用来区分相同名称的脚本，一般写成作者名字或者网址就可以了 |  
version | 脚本版本，油猴脚本的更新会读取这个版本号
description | 描述，用来告诉用户这个脚本是干什么用的
author | 作者名字
match | 只有匹配的网址才会执行对应的脚本，例如*、http://*、http://www.baidu.com/*等，参见谷歌开发者文档
grant | 指定脚本运行所需权限，如果脚本拥有相应的权限，就可以调用油猴扩展提供的API与浏览器进行交互。如果设置为none的话，则不使用沙箱环境，脚本会直接运行在网页的环境中，这时候无法使用大部分油猴扩展的API。如果不指定的话，油猴会默认添加几个最常用的API
require | 如果脚本依赖其他js库的话，可以使用require指令，在运行脚本之前先加载其他库，常见用法是加载jquery
connect | 当用户使用GM_xmlhttpRequest请求远程数据的时候，需要使用connect指定允许访问的域名，支持域名、子域名、IP地址以及*通配符
updateURL | 脚本更新网址，当油猴扩展检查更新的时候，会尝试从这个网址下载脚本，然后比对版本号确认是否更新
license | 声明开源协议，*在发布是必须的*

## 注意

- `@match`，*是必要的参数，用来匹配当前脚本要在那个页面生效！*

# 调试

最简单的方式是编写完后，将代码复制到 tampermonkey 上。然后刷新脚本应用到的页面！

# 发布

1. 进入 [greasyfork](https://greasyfork.org/en)！
2. 选择发布脚本；

| <img width="383" alt="image" style="border: 1px solid black;" src="https://user-images.githubusercontent.com/25907273/198898570-20993ce2-6890-4583-9583-018500c99b1e.png"> |
| -------- |

3. 输入代码，以及说明，即可发布！

# 栗子🌰

欢迎 [使用](https://greasyfork.org/en/scripts/453950-comment-zoomer) 和 [star](https://github.com/isaaxite/comment_zoomer)!

| ![image](https://user-images.githubusercontent.com/25907273/198898702-ac29ff5d-7cbf-4086-a8d5-6ea28db837f4.png) |
| -------- |



# 附录

## 参考

- [油猴脚本编写教程](https://segmentfault.com/a/1190000021654926)
- [This section describes how the Tampermonkey API can be used and what is different to Geasemonkey](https://www.tampermonkey.net/documentation.php)
- [tampermonkey](https://www.tampermonkey.net/index.php?version=4.18.0&ext=dhdg&show=dhdg#)
