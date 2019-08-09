# 用browser-sync实时刷新browser的坑

#### 在上一篇blog中已经说过怎么构建一个前端的builder：http://www.jianshu.com/p/7098e96f760f

- 借用别人的话：事实上，browser-sync可以理解为一个本地服务器，类似于Apache，不同的是，browser-sync只提供很简单的http功能，它的主要功能，是通过搭建一个本地服务器，并且监听文件的更改，自动刷新浏览器，实时地呈现最新的内容。

- 不是很懂browser-sync的，也可以去看看官网文档：http://www.browsersync.cn/docs/gulp/
- 在browser-sync这块卡了好久，在坑里奋力挣扎。
###### 坑：不论怎么修改保存html、less、js文件浏览器都没有相应实时刷新。

- 解决：
失败：一开始我是为了测试，所以直接在html文件里面直接写了文字，然后不断保存……
成功：至少使用body标签包裹编辑的内容[手动擦汗]

这个问题我是在browser-sync的github上看到的，发现一大堆人掉进这个坑[手动滑稽]
github issues：https://github.com/BrowserSync/browser-sync/issues/392

>![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-53c9298624ef5232.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



