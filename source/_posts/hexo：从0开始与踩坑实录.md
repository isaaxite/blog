---
title: hexo：从0开始与踩坑实录
date: 2021-03-16 14:46:49
categories: 
- hexo
tags:
- hexo
description: " "
---

# 下载插件

## curl下载github zip链接

```
curl -LJO https://github.com/theme-next/theme-next-fancybox3 
```

## unzip

```
unzip theme-next-fancybox3-master.zip
```

# page布局有什么用？

官文档说的布局概念

> ![](Snipaste_2023-02-14_21-58-08.png)

**布局概念含糊不清！**

# 为什么主页将所有文章以详情的形式全列出来了？

文章没有添加 `description` 属性。形如

```yml
---
title: hexo：从0开始与踩坑实录
date: 2021-03-16 14:46:49
categories: 
- hexo
tags:
- hexo
description: 记录入坑hexo的过程中遇到的问题与最终解决
---
```

只有添加 `description`并且字段值不为空（可以使用空格占位），才会以概览模式在主页列出所有文章！

## 参考

- [hexo小技巧-首页显示文章摘要及图片](https://ryderchan.github.io/2017/01/26/hexo%E5%B0%8F%E6%8A%80%E5%B7%A7-%E9%A6%96%E9%A1%B5%E6%98%BE%E7%A4%BA%E6%96%87%E7%AB%A0%E6%91%98%E8%A6%81%E5%8F%8A%E5%9B%BE%E7%89%87/)



# 文章中的图片的保存位置以及使用方式


## post_asset_folder

开启 `post_asset_folder`，将生成文章同名目录。可以使用路径访问此目录下的资源！

```yml
# _config.yml
post_asset_folder: true
```

## 使用Markdown语法


```yml
# _config.yml
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true
```

启用后，资源图片将会被自动解析为其对应文章的路径。
例如： image.jpg 位置为 `/2020/01/02/foo/image.jpg` ，这表示它是 `/2020/01/02/foo/` 文章的一张资源图片， `![](image.jpg)` 将会被解析为 `<img src="/2020/01/02/foo/image.jpg"> `。

## 参考

- hexo博客中如何插入图片: https://cloud.tencent.com/developer/article/1736563
- 资源文件夹: https://hexo.io/zh-cn/docs/asset-folders



# Next如何添加分类页与标签页？

## 将Next配置文件中的Menu开启

路径：themes/next/_config.yml

将配置开启后，就可以在页面上看到 分类页 和 标签页 的入口。但是仅仅只有入口没有内容！

```yml
# ---------------------------------------------------------------
# Menu Settings
# ---------------------------------------------------------------

# Usage: `Key: /link/ || icon`
# Key is the name of menu item. If the translation for this item is available, the translated text will be loaded, otherwise the Key name will be used. Key is case-sensitive.
# Value before `||` delimiter is the target link, value after `||` delimiter is the name of Font Awesome icon.
# External url should start with http:// or https://
menu:
  home: / || fa fa-home
  # about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
  # schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  #commonweal: /404/ || fa fa-heartbeat
```

## 添加页面

添加分类页面。执行下面命令将会生成 source/categories/index.md

```shell
hexo new page categories
```

categories/index.md 的内容如下，还需做些必要修改：添加 `type: "categories"`

```yml
---
title: categories
date: 2023-02-14 16:56:26
type: "categories"
---
```

标签页的添加与以上大部分相似！需要注意的是：

- 标签页创建：`hexo new page tags`；
- 标签页属性修改：`type: "tags"`

## 使用分类

在 `source/_posts/` 目录的文章中的yml配置，添加 `categories` 属性。如下面例子。

文章添加标签后，再编译就会生成对应的标签文件！


```yml
---
title: 面试题62. 圆圈中最后剩下的数字
date: 2020-04-17 02:13:49
categories: 
- 算法题
tags:
- LCOF
description: ' '
---
```

## 编译

编译后继承生成分类、标签目录，见下：

```shell
categories
├── hexo
|  └── index.html
├── index.html
└── 算法题
   └── index.html
```


-------------


# 预览图片

## 打开 fancybox 开关

```yml
# NexT _config.yml
fancybox: true
```

## 加载资源

### 方式1：CDN

打开 NexT 配置文件FancyBox资源配置的注释即可！

```yml
# NexT _config.yml
# FancyBox
# jquery: //cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
# fancybox: //cdn.jsdelivr.net/gh/fancyapps/fancybox@3/dist/jquery.fancybox.min.js
# fancybox_css: //cdn.jsdelivr.net/gh/fancyapps/fancybox@3/dist/jquery.fancybox.min.css
```


### 方式2：下载 fancybox 插件资源

将 fancybox 包下载到 cd next/source/lib，并将资源解压（假如需要）后命名为 fancybox 即可！

fancybox包：https://github.com/theme-next/theme-next-fancybox3


# 评论插件(gittalk)

仓库：https://github.com/gitalk/gitalk

NexT已经内置，只需要修改NexT配置文件！

```yml
# Gitalk
# For more information: https://gitalk.github.io, https://github.com/gitalk/gitalk
gitalk:
  enable: true
  github_id:  # GitHub repo owner
  repo:  # Repository name to store issues
  client_id:  # GitHub Application Client ID
  client_secret:  # GitHub Application Client Secret
  admin_user:  # GitHub repo owner and collaborators, only these guys can initialize gitHub issues
  distraction_free_mode: false # Facebook-like distraction free mode
  # Gitalk's display language depends on user's browser or system environment
  # If you want everyone visiting your site to see a uniform language, you can set a force language value
  # Available values: en | es-ES | fr | ru | zh-CN | zh-TW
  language: zh-CN
```

上面配置 client_id 和 client_secret 需要在github注册 OAuth App: 

https://github.com/settings/applications/new

![](Snipaste_2023-02-16_13-28-44.png)

```yml
Application name： # 应用名称，随意填写即可
Homepage URL： # 你的网站地址，如https://yourname.github.io
Application description # 描述，随意填写即可
Authorization callback URL：# 你的网站地址，如https://yourname.github.io
```

## 参考

- [hexo博客 NexT 7.7.0以后版本 gitalk配置](https://chenfeng2000.github.io/2020/01/30/NexT-7-7-0%E4%BB%A5%E5%90%8E%E7%89%88%E6%9C%AC-gitalk%E9%85%8D%E7%BD%AE/)
- [Hexo 博客增加Valine/Gitalk评论插件](https://blog.mmzi.online/2021/07/10/Hexo-%E5%8D%9A%E5%AE%A2%E5%A2%9E%E5%8A%A0Valine%E5%92%8CGitalk%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6/)
- [github:gitalk/gitalk](https://github.com/gitalk/gitalk)

# 参考

- [NexT官方文档](https://theme-next.js.org/)
- [初步了解Hexo站点的布局](https://www.jianshu.com/p/5a1e6d8c83af)
- [hexo布局架构及功能分析](https://ben286.github.io/2018/08/21/%E5%85%B6%E4%BB%96/hexo%E5%B8%83%E5%B1%80%E6%9E%B6%E6%9E%84%E5%8F%8A%E5%8A%9F%E8%83%BD%E5%88%86%E6%9E%90/)
- [Hexo使用攻略-添加分类及标签](https://linlif.github.io/2017/05/27/Hexo%E4%BD%BF%E7%94%A8%E6%94%BB%E7%95%A5-%E6%B7%BB%E5%8A%A0%E5%88%86%E7%B1%BB%E5%8F%8A%E6%A0%87%E7%AD%BE/)