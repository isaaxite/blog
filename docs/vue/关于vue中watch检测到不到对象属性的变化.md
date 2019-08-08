## 前言

在vue开发的过程中发现一个问题：改变vue.$data中对象的属性，watch是观测不到变化，但其实对象的属性是有变化的。这……，有点难以置信！



## 正文

```vue
<template>
  <div>
    <dl>name: {{option.name}}</dl>
    <dl>age: {{option.age}}</dl>
    <dl>
      <button @click="updateAgeTo25">update age with 25</button>
    </dl>
  </div>
</template>

<script>
export default {
  data () {
    return {
      option: {
        name: "isaac",
        age: 24
      }
    }
  },
  watch: {
    option(val) {
      console.log(val)
    }
  },
  methods: {
    updateAgeTo25() {
      this.option.age = 25
    }
  }
}
</script>
```



> ![image](https://user-images.githubusercontent.com/25907273/35481764-0c39010c-0465-11e8-8da3-1cd1c2e7202e.png)

> ![image](https://user-images.githubusercontent.com/25907273/35481768-28a9fb0c-0465-11e8-84fd-f674f250d707.png)

如结果所示，option.age已经更新，但是watch中的option函数并没有被触发。



vue的watch钩子会那么鸡肋？我是不信的了。



## 深层watch

```vue
  ...
  watch: {
    option: {
      handler(newVal) {
        console.log(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  ...
```

需要深层watch就需要开启`deep`属性

> ![image](https://user-images.githubusercontent.com/25907273/35481930-35d9beea-0468-11e8-99f8-e29202773176.png)

> ![image](https://user-images.githubusercontent.com/25907273/35481938-59c60af2-0468-11e8-8ecd-4e01873927de.png)

如结果所示。



另外，你会发现，在age没有变化前也是有打印出option，这是因为开启`immediate`属性，设定为`true`，

> 该回调将会在侦听开始之后被立即调用



[\[来自vue文档的说明\]](https://cn.vuejs.org/v2/api/#vm-options)
