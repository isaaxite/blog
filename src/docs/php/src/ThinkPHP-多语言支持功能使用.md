# ThinkPHP-多语言支持功能使用

### 前言

**旧博客迁移，[\[原链接\]]**

### 正文

1.检查\ThinkPHP\Extend\Behavior目录下是否有CheckLangBehavior.class.php文件，没有的话去下载完整版，并将文件放到此目录下。

 

2.修改目录下文件Application\[模块/比如Home、Common等等]\Conf\tags.php（没有此文件的话自己添加）添加配置：
```
return array{

   'app_begin' => array('Behavior\CheckLangBehavior'),

);
``` 

3.修改Application\[模块]\Conf\config.php文件，添加配置如下：
```
return array(
    //'配置项'=>'配置值'
    'LANG_SWITCH_ON' => true,   // 开启语言包功能
    'LANG_AUTO_DETECT' => true, // 自动侦测语言 开启多语言功能后有效
    'DEFAULT_LANG' => 'zh-cn', // 默认语言
    'LANG_LIST'        => 'zh-cn,en-us', // 允许切换的语言列表 用逗号分隔
    'VAR_LANGUAGE'     => 'l', // 默认语言切换变量
);
```
这里另外补充，一般以上两个（2、3）都是在Common下配置这个，这样就不用每个模块的配置文件都改。

 

4.在目录Application\[模块]下添加Lang目录，并在Lang目录下，添加zh-cn.php、en-us.php文件,分别在这两个文件内配置不能的语言
```
        /Lang/zh-en.php

        /Lang/en-us.php
```
 

　　比如zh-en.php的配置可以如下：

         
```
     return array(

        ‘_NAME_'=>’甘宝华'

     );
 ```

     相应的在en-us.php文件内以同样索引名配置：

          
```
     return array(

        ‘_NAME_'=>’issac'

     );
 ```

     ps：配置的索引名不论大小写，最后都会被TP转化成大写。

 

5.在你需要的controller里面引入语言包（个人建议在构造函数里面调用）：

         
```
    function _initialize(){

        //L() 是将所有的配置取出

        $this->assign('lang',L());

        /*

          //L(‘_NAME_’)是单独取出一个

         $this->assign(’name',L(‘_NAME_'));

         */

    }
 ```

6.在模板（html页面中使用）：
```
{$lang._NAME_}      

//单取出一个

//{$name}
```
 

7.模板中多语言的切换：
```
<a href=“?l=zh-cn">CN</a>

<a href=“?l=en-us">EN</a>
```

 

显然，就是要给get过去一个索引为l的键值对。


[\[原链接\]]:https://www.jianshu.com/p/a639d68a645a


