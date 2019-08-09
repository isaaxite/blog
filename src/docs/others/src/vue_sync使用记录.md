# vue_sync使用记录

## 前言
通过事件绑定的语法糖sync可以间接达到双向数据绑定！
根据官方文档的说明：
只需要在父组件中想子组件的prop属性添加`.sync`修饰符，并且在子组件中触发对应的更新事件（`this.$emit('update:<event name>', [data])`）即可

父组件

```vue
<component
  :status.sync="status"
></component>

<script>
export default {
  data() {
    retturn {
      status: false
    }
  }
};
</script>
```

子组件

```js
this.$emit('update:status', true);
```

## 正文

今天想记录的是：使用`.sync`实现双向数据绑定的属性，如果属性是值类型，那么watch可以监听到每次属性值的变化，但是如果双向绑定的属性是引用类型的话，watch却只能监听到第一次变化，就算是使用`deep`模式也是不起效。但并不是说引用类型属性的内部属性值没有改变，因为用setInterval定时打印是有看到变化的！

详细代码如下：

```vue
<component
  :status.sync="status"
></component>

<script>
export default {
  data() {
    return {
      status: {}
    };
  },
  
  watch: {
    'status': {
      deep: true,
      handler(val) {
        console.log('status', val)
      }
    },
    
    'status.update': function (val) {
      console.log('status.update', val)
    }
  }
}
</script>
```

// 子组件
```js
// 子组件
export default {
  methods: {
    handleStatusChange() {
      this.status.namespace = Date.now();
      this.$emit('update:status', this.status);
    }
  }
}
```
父组件中的两个watcher都是只能监听到第一次变化~

## 临时的解决方案
不使用`.sync`修饰符，即不通过事件触发的方式达到父子组件通信，转而利用引用类型数据的特性，直接将引用类型数据的引用传到子组件内部，然后子组件通过赋值方式更新该引用的内部属性。

