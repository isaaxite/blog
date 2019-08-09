# vue__关于嵌套路由的错觉

### 前言
嵌套路由在我一开始用vue的时候就有尝试过，毕竟如下这样的写法觉得是很好看的：
```javascript
...
{ path: '/user', component: User,
  children: [
    { path: '/profile', component: UserProfile },
    { path: 'posts', component: UserPosts }
  ]
}
...
```
然后用`/user`访问主页，用`/user/xxx`访问子组件。很好看，有没有。

### 关于错觉
- 缘起
在做一个项目的时候，比如我有个一级路由组件`user`，我也写好了。过一段时间，产品说要产品说要加个功能页面，让用户设置个人信息。这样很明显这个设置页就是user页面的子页，`/user/set`也是让人理所当然地想到，而且更有美感，归属更加清晰明了。`/userset`，这样莫名就很挫[掩面]，然后我当时是这样写的：
```javascript
import user from './user/_index';   // 个人信息主页
import userSet from './user/set';   // 个人信息设置页面

router: new VueRouter({
  routes: [
    { 
      path: '/user', name: 'user', component: user,
      children: [
        { path: 'set', component: userSet },
      ]
    },
  ]
}),
```
写完还开心啊，跑起来啊，受苦吧！结果当然是不行啦！我也没有多看文档，深信不疑自己这样写没错，看起来也是想那么回事，~~左看右看，没看出什么错~~。最后也没有搞定然后就改用了很挫的写法：
```javascript
router: new VueRouter({
  routes: [
    { path: '/user', name: 'user', component: user },
    { path: '/user/set', name: 'userSet', component: userSet }
  ]
}),
```
然后日子就这样凑合过去了！

### 正确的写法
~~本着我不踩坑谁不踩坑的伟大精神~~，今天有碰到这段代码。我又搞起来了，又去看了文档，没错不止看了一次才发现我眼瞎的事实。

- 路由嵌套需要一个路由分发组件
上面的写法是不对，正确是需要一个`route-view`作为根组件分发各个路由，上面写到的`user`组件不应该作为根组件，而是应该作为一个子组件存在，多说无益，上代码，一目了然。
```javascript
// routeView.vue
<template>
  <router-view></router-view>
</template>

// main.js
import routeView from ''./common/routeView;
import user from './user/_index';   // 个人信息主页
import userSet from './user/set';   // 个人信息设置页面

router: new VueRouter({
  routes: [
    { 
      path: '/user', name: 'user', component: routeView,   // 注意这里
      children: [
        { path: '', component: user },   // 注意这里
        { path: 'set', component: userSet },
      ]
    },
  ]
}),
```

### 小结
年轻人不要心浮气躁啊[掩面]，所以说，没事多看看文档，你总会在里面发现很多不为你所知的宝贝


### Menu
- [ [ Home ] ](https://issaxite.github.io)
- [ < Prev \] ](https://github.com/issaxite/issaxite.github.io/issues/66)
- [ \[ Next > ](https://github.com/issaxite/issaxite.github.io/issues/68)





