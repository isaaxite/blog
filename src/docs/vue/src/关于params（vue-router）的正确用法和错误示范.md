# 关于params（vue-router）的正确用法和错误示范

## 前言
文章不会太长，纯属记录一个错误使用params造成的问题！这个错误导致刷新导致部分必要参数丢失，导致页面垮掉！

## 正文
#### params的正确使用
```js
# 挂在路由
import Foo from './foo';
import VueRouter from 'vue-router';

const router = [
  { name: Foo.name, path: '/foo/:id', component: Foo }
];
export default new VueRouter({ router });


# 访问router对应的组件
// 在vue组件内
this.$router.push(  name: 'foo', params: { id: 1 } )
// 或者直接在地址栏输入: http://xxx.com/#/foo/1
```

#### 错误的示范
先看看是怎么错的，再说说为什么他要这样写！
首先挂在路由他没有指明`id`，只是这样：
```
path: '/foo'
```
然后依然使用同样的方式（或其他类似的方式）访问foo组件。就算这样写也是可以跳转，并且在foo组件内部也是可以使用 `this.$route.params.id` 访问到传递过来的id~

但是此时刷新页面就悲剧了，id丢失了，为什么？因为id仅仅是保存在`this.$route.params`这个对象中，这个对象的值从那么来的？

解析当前地址，通过正则匹配到的~

因为在挂在路由的时候没有指明`:id`，因此在地址会是`/#/foo`，仅仅这样，不会有id出现在地址上，那么params就不会有取得id，那么foo组件内部依赖id的所有逻辑都会出现非预期的结果！

再来说说此人为什么要这样写？如果仅仅是传递id这样的单一参数的话，大可使用query来传递
```js
# url
/#/foo?id=1

# js
this.$route.push({ name: 'foo', query: '')
```
然而，他存在params中的是一个对象，一条从数据库拿回来的记录，为了不再次去数据从查找，他直接使用params将数据从当前组件传给了foo组件，想法是好的，但是却忽略了在foo组件刷新后导致的后果。

最后我对此做了一点小的修改，我没有完全改掉他的写法，只是在此基础上使用query传递了此数据记录的id

```js
this.$route.push({ name: 'foo', params: { record }, query: { id } });
```

然后在foo组件的created钩子中判断params是否为空，为空再去获取数据！

这真的是一个错误的用法，而且完全地曲解了params的用法~，就算为了达到我刚刚的做法也是应该params（或者query）+vuex（或者bus）来实现~

## 最后一句
其实我个人认为params是比较鸡肋的功能，因为你需要path来配合，但是一个大的项目，很多人在维护的时候就很容易会忽略掉这个path的配合（虽然vue是有warning的）但是，如果一个已经确定好的path，现在你要在上面加个":[param]"，你真的不知道会对未来有什么不好的影响，你不确定，人都是易错的动物，那么在写法和架构上应该使用兼容性健壮性更好的写法~


