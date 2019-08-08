![](http://pic.qiantucdn.com/58pic/26/08/53/58bdadd97e469_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS40LnBuZw==/align/center)
### 前言
正如，标题所说，在vue中并没有用新数组替换旧数组的性能会比在原有数组的基础上拼接新数组性能差很多的问题。会有此担忧，是因为下意识地会觉得因为用新数组（包含旧数组）替换旧数组会使用虚拟dom重新渲染一遍旧数组的数据（说得是自己），然而vue并没有那么愚蠢。以下是引用vue文档的原文，具体实现我暂时还不得而知，假如有时间我会去研究，先留个坑（又在骗自己）。


### 原文引用
> 你可能认为这将导致 Vue 丢弃现有 DOM 并重新渲染整个列表。幸运的是，事实并非如此。Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的、启发式的方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。
[ [原文链接] ](https://cn.vuejs.org/v2/guide/list.html#替换数组)


### Menu
- [ [ Home ] ](https://issaxite.github.io)
- [ < Prev \] ](https://github.com/issaxite/issaxite.github.io/issues/61)
- [ \[ Next > ](https://github.com/issaxite/issaxite.github.io/issues/63)
