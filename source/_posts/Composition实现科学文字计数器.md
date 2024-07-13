---
title: Composition实现科学文字计数器
date: 2018-09-12 17:19:14
tags:
- 前端
- dom事件
- input
categories:
- JavaScript
---

# 很长的前言
前端时间需要做一个input组件，组件要求之一是：动态计算input文字并展示出来，大概如下：

<!-- more -->


本来就是基于vue来做，想起来也是很简单的事情，就是获取`$input.value.length`~确实也是如此。

最初我是这么写的：

```html
<template>
  <div class="self-input">
    <input
      ref="input"
      type="text"
      class="self-input__inner"
      maxlength="maxlength"
      :input="handleInput"
      :value="currentValue"
    >
    <span class="self-input__calculator">
      <span class="self-input__calculator--current">{{ textCount }}</span>
      <span class="self-input__calculator--max">{{ maxlength }}</span>
    </span>    
  </div>
</template>
<script>
  export default {
    name: 'SelfInput',
    props: {
      value: { type: [String, Number] },
      maxlength: [String, Number]
    },
    data() {
      return {
        currentValue: this.value,
        textCount: 0
      };
    },
    methods: {
      handleInput() {
        let inputVal =  this.$refs.input.value;
        inputVal = inputVal.trim();
        this.textCount = inputVal.length;
        this.$emit('input', inputVal);
      }
    }
  };
</script>
<style lang="scss">
  .self-input{
    $--calculator-width: 56px;
    
    & { position: relative;display: inline-block; }
    
    &__inner{ padding-left: 5px;line-height: 28px;width: 220px;padding-right: $--calculator-width;font-size: 14px; }
    
    &__calculator{
      & {
        position: absolute;top: 0;right: 0;bottom: 0;display: inline-flex;justify-content: flex-end;
        align-items: center;padding-right: 5px;width: $--calculator-width;box-sizing: border-box;
      }
      
      &--current{
        &::after{ content: "/";display: inline-block; }
      }
      
      &--max{ color: gray; }
    }
  }
</style>
```


如你所见，在中文输入时出现了非预期的文字数目计数（附上 [Demo1] ）~



# 正文

看win下的效果就知道，在使用中文输入的时候，直接使用`input`事件（v-model语法糖就是监听input事件）就出现了非预期的问题！

在看ElementUI源码的时候发现了一个以前没有用过的事件（见识短浅），*composition事件*。这个事件有三个事件组成，分别是：

- [compositionstart]
- [compositionupdate]
- [compositionend]

> `compositionstart` 事件触发于一段文字的输入之前（类似于 keydown 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）。

> `compositionupdate` 事件触发于字符被输入到一段文字的时候（这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）

> 当文本段落的组成完成或取消时, `compositionend` 事件将被触发 (具有特殊字符的触发, 需要一系列键和其他输入, 如语音识别或移动中的字词建议)。


换言之，在一开始中文输入的时候会触发`compositionstart`事件，当继续中文输入但未选词前会持续触发`compositionupdate`事件，然后当选词后则触发`compositionend`事件（针对当前情况如是说）！

## 用input事件配合以上三事件优化文字计数器
```html
<input
  class="self-input__inner"
  type="text"
  :value="exValue"
  @compositionend="handleComposition"
  @input="handleInput"
  maxlength="maxlength"
>
<!-- ... -->
<script>
export default {
  // ...
  data() {
    return {
      // ...
      isOnComposition: false
    };
  },
  methods: {
    _setTextCount(val) {
      this.textCount = val.length || 0;
    },
    handleComposition(event) {
      this.isOnComposition = event.type !== 'compositionend';
      !this.isOnComposition && this.handleInput(event);
    },
    handleInput(event) {
      let value;
      if (this.isOnComposition) return;
      value = event.target.value;
      this.currentValue = value;
      this._setTextCount(value);
      this.$emit('input', value);
    }
  }
  // ...
}
</script>
```
这里只是用到了Composition事件之一, `compositionend`。

其实要做得更加健壮应该三个事件都用到！这里的思路也很简单，如果是非中文输入的时候就不会触发`compositionend`事件，正常执行input事件的回调，

而中文输入的时候，`compositionend`和`input`都会同时触发，在未完成选词前，当然是不能执行input回到的真正逻辑，

因此加入一个`isOnComposition`状态记录当前是否进行中文输入，input回调函数则据此判断是否执行真正的业务逻辑！

附上jsfiddle源码Demo: [Demo2]


## 更加简单的做法

```html
<!-- ... -->
<input
  class="self-input__inner"
  type="text"
  v-model="currentValue"
  :maxlength="maxlength"
/>
<!-- ... -->
<script>
  // ...
  data() {
    return {
      currentValue: (this.value === undefined || this.value === null) ? '' : this.value
    };
  },
  computed: {
    textCount() {
      return this.currentValue.length || 0;
    }
  }
  // ...
</script>
```
对比上一种做法，将`v-bind`绑定的`value`属性，换成`v-model`，其余去掉的部分一看到~，基本就是做了这么一点功夫就搞定了上一种做法的长篇大论~
附上jsfiddle源码Demo: [另一种简单的实现]


[Github Blog]: https://github.com/issaxite/issaxite.github.io/issues/198
<!-- 缺陷例子 -->
[Demo1]: http://jsfiddle.net/sobq1cn9/33/

[Demo2]: http://jsfiddle.net/sobq1cn9/143/

[另一种简单的实现]: http://jsfiddle.net/issaxite/wqfhnvc4/1/

[compositionstart]: https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionstart

[compositionupdate]: https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionupdate

[compositionend]: https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionend
