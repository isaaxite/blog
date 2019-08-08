## 前言
filter在vue中是一个比较独特的存在（我是这样认为），filter很多时候是可以使用method代替，并且很多时候都会让人想要用method代替他，特别是需要复用这个filter的时候，假如这个filter不会被嵌套使用（这是个傻逼问题，谁知道之后会怎么发展，谁知道之后会不会嵌套）

## 正文
不管怎么样，我的目的只是想要记录怎么在钩子，在method等等的组件对象内使用filter

```
this.$options.filters,[filter name]
```

讲完~
