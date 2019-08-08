# input组件的v-model
关于v-model的实现原理vue文档有描述，是基于vue现有功能二次实现的语法糖。

vue中input的v-model写法

```html
<input v-model="something">
```

不过是以下示例的语法糖

```html
<input v-bind:value="something" v-on:input="something = $event.target.value">
<!-- 或者这样写 -->
<input v-bind:value="something" v-on:input="something = arguments[0].target.value">
<!-- 或者这样写 -->
<input v-bind:value="something" v-on:input="e => something = e.target.value">
```

据我们所见，v-model是个双向绑定的实现，这个实现主要是通过下面两个关键实现。

- 通过`:value`/`v-bind:value`是将data的value，即`data.something`单向绑定到input的value属性，`input.value`上。因此初始化页面的时候data.value的值会同步到对应input的value上，但如果只是这样的话，当用户通过input输入框改变input的值时并不会将改变后的值同步到data.input上。

- 通过`v-on:input`监听input.value的变化，可以监听到变化就可以将值更新到data.value上。通过`e => something = e.target.value`

  ​

对于第二点，`v-on`监听HTML5事件， [\[input事件\]](https://developer.mozilla.org/zh-CN/docs/Web/Events/input)。或许有些人会对这个html5事件有点陌生，不知道的，或许还会误以为是vue中开发者自定义的事件。

input事件的描述
>当 `<input>` 或 `<textarea>` 元素的值更改时，DOM input 事件会同步触发。(对于 type = checkbox 或 type = radio 的输入元素，当用户单击控件时，输入事件不会触发，因为value属性不会更改。) 此外，当内容更改时，它会在 contenteditable 的编辑器上触发。在这种情况下，事件目标是编辑主机元素。如果有两个或多个具有 contenteditable 的元素为真，“编辑主机”是其父级不可编辑的最近的祖先元素。同样，它也会在  designMode 编辑器的根元素上触发。

对v-model的关键句是：**当 <input> 或 <textarea> 元素的值更改时，DOM input 事件会同步触发。**



## 那为什么不使用change事件或者keyup事件实现？
- change事件的问题

mdn对change的描述
>change事件被`<input>`，`<select>`和`<textarea>`元素触发，访用户提交对元素值的更改时。与input事件不同，change不一定会对元素值的每次更改触发。 

意思是什么？
比如说，你长按键盘输入文字到input框，input的value是一直在变的，但是长按期间的变化是不会触发到change事件的，只有在松开按键的时候并且input的value有变化才会触发。

而input事件则是，只要input的值发生变化都会触发，没有则不触发。

- key事件的问题

keyup事件触发条件就如字面意思，按键松开的时候触发。这不就是和change事件相似？是很相似，但keyup是只要按键松开就会触发，无论value是否有改变，比如你按下方向键也会触发。

## 小结
数据双向绑定（v-model）的的核心是：v-bind同步数据到html元素节点的value;事件监听元素节点的value变化，然后将变化同步到vue.$data中。






# 自定义组件实现v-model
对于自定义组件实现双向数据绑定的也是和input实现思路一样，实现方法也是类似。
- 将父组件的data.value通过向子组件传参，将其同步到子组件内部

再看vue文档给出的示例

```html
// v-model实现
<custom-input v-model="something"></custom-input>
// vue给出的自定义组件中v-model的解析
<custom-input
  v-bind:value="something"
  v-on:input="something = arguments[0]">
</custom-input>
```

完整父组件：

```html
<template>
  <div>
    <custom-input @input="something = arguments[0]" :value="something"></custom-input>
  </div>
</template>

<script>
import customInput from './_input'

export default {
  data () {
    return {
      something: "i am isaac_宝华",
    }
  },
  watch: {
    something(val) {
      console.log(val)
    }
  },
  components: {
    "custom-input": customInput
  }
}
</script>
```



子组件（我的意淫）：

```html
<template>
  <div>
    <input type="text" name="name" :value="value" @input="updateValue">
  </div>
</template>

<script>
export default {
  props: {
    name: "customInput",
    value: [String, Number],
  },
  methods: {
    updateValue(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
```
![image](https://user-images.githubusercontent.com/25907273/35480891-4f1300ca-0453-11e8-9b40-d49d0f45d03d.png)



- 同样，在父组件在`custom-input`中绑定`something`，向`custom-input`内部传入`something`。在`custom-input`内部将传入的value，绑定到真正的input的value上，这样就先实现单向的数据绑定。



- 然后要做的就是将真正的input.value的变化更新到父组件的`something`。怎么做？看父组件，在`custom-input`不是监听了input事件吗？！那么要在`custom-input`内部更新input.value到父组件，就需要触发这个input事件，就是子组件的这句: `$emit('input', $event.target.value)`。

  那后你会发现在`custom-input`组件内部的input上也同样监听了一个input事件，因为要同步到父组件，首先就要监听到真正的input.value的变化，

  ```javascript
  <input type="text" name="name" :value="value" @input="$emit('input', $event.target.value)">
  ```

  的input事件就会监听到input.value的变化，然后再将变化通过`$emit('input', $event.target.value)`传回父组件。

## 小结

在这里，只是浅析v-model这个语法糖，正如vue文档中说的

> **预期**：随表单控件类型不同而不同。

所以这里只是简单说了input:text类型控件，而且也只是停留在vue层面浅析v-mode，并没有深入到js层面去分析v-model的实现。虽然如此，但这是有助于我们封住相关的input控件，作为一个自定义组件使用。

另外，不得不说，别看vue文档中将v-model好像说得很简单，但其实是vue中最复杂的组件之一。
