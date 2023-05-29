---
title: v-for的原理分析
date: 2019-11-19 08:41:47
tags:
- vue
- vue源码分析
categories:
- [源码分析]
- [vue]
---

# 大纲

- [大纲](#大纲)
- [前言](#前言)
- [v-for的函数文本](#v-for的函数文本)
  - [解析出`ast`](#解析出ast)
  - [根据ast解析出函数文本](#根据ast解析出函数文本)
- [renderList的实现](#renderlist的实现)
- [总结](#总结)

<!-- more -->

# 前言

- 使用`parse`解析模板生成`ast`，`v-for`相关的属性；
- 使用`generate`，结合`ast`生成函数文本（`code`），包含`v-for`的函数文本是`_l(/* ... */)`;
- 结合`code`构造`render_watcher.update()`，从而渲染`v-for`元素。

接下来使用一下例子结合源码进行学习：

```html
<main id="app">
  <dl v-for="(name, idx) in names" :key="idx">
    <dt>name:</dt>
    <dd>{{name}}</dd>
  </dl>
</main>
<script>
  const vm = new Vue({
    data: {
      names: ['isaac', 'frank', 'rick'],
    }
  }).$mount('#app');
</script>
```


# v-for的函数文本

[回到顶部](#大纲)

**解析模板的入口**：`vue/src/compiler/index.js`

`ast`由`parse`返回，所以先深入去parse是怎么生成`v-for`的`ast`!
```typescript
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // parse 生产 ast
  log('ast:', ast);
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // generate 生产 渲染用的函数文本
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

## 解析出`ast`

解析视图模板主要由`parseHTML`函数实现，而这个函数是比较长，`parseHTML`对`v-for`相关信息的解析，先说明用到的函数，以及对应的作用：

1. `const startTagMatch = parseStartTag()`，parseStartTag是解析开始标签，主要是解析：a. 开始标签这段文本在整个html文本的开始和结束位置，b. 标签内的属性文本的位置，比如`v-for="(name, idx) in names"`的开始和结束位置。
2. `handleStartTag(startTagMatch)`，根据位置信息进一步接续出属性值，比如`{ name: 'v-for', value: '(name, idx) in names' }`。
```typescript
/**
 * Convert HTML string to AST.
 */
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  // ...
  parseHTML(template, {
    // ...
    start (tag, attrs, unary, start, end) {
      // ...
      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      log('element:', element);
      // ...
    }
    // ...
  });

  // ...
  return root
}

export function parseHTML (html, options) {
  // ...
  while (html) {
    // ...
    // Start tag: 记录属性文本在争端元素字符串开始和结束的位置
    const startTagMatch = parseStartTag()
    if (startTagMatch) {
      // 根据 parseStartTag 解析出来的位置信息，进一步将文本解析成对象解构的属性
      handleStartTag(startTagMatch)
      // ...
    }
  }

  // advance(推进)，更新html文本
  function advance (n) {
    index += n
    html = html.substring(n)
  }

  // 1. 找出开始标签的start-index和end-index，
  // 比如<span name="isaac"></span>中的开始标签就是<span name="isaac">
  // 2. 找出每个属性文本的始和终index
  function parseStartTag () {
    const start = html.match(startTagOpen)
    log('html.match(startTagOpen):', html);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      }
      advance(start[0].length)
      let end, attr
      while (
        !(end = html.match(startTagClose))
        && (
          attr = html.match(dynamicArgAttribute)
          || html.match(attribute)
        )
      ) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }

  // 根据 parseStartTag, 得到的文职信息，以及属性的匹配信息
  // 将属性信息从文本解析成对象
  function handleStartTag (match) {
    // ...
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      // ...
      const attrItem = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      }
      log('attrItem:', attrItem)
      /**
       * output:
       * it-1: "attrItem:" {name: "v-for", value: "(name, idx) in names"}
       * it-2: "attrItem:" {name: ":key", value: "idx"}
      */
      attrs[i] = attrItem;
      // ...
    }

    // log('stack:', JSON.parse(JSON.stringify(stack)));
    if (options.start) {
      log('attrs:', JSON.parse(JSON.stringify(attrs)));
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }
}

const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g
function decodeAttr (value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
  return value.replace(re, match => decodingMap[match])
}
```
- `log('attrs:', JSON.parse(JSON.stringify(attrs)));`
![](./asset/attrs.png)

- `log('element:', element)`
![](./asset/element.jpg)

- `log('ast:', ast)`
![](./asset/ast.jpg)


## 根据ast解析出函数文本

path: vue/src/compiler/codegen/index.js
```typescript
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

export function genElement (el: ASTElement, state: CodegenState): string {
  // ...

  if (el.staticRoot && !el.staticProcessed) {
    // ...
  } else if (el.for && !el.forProcessed) {
    const forCode = genFor(el, state);
    log('forCode', forCode);
    // output: "forCode" "_l((names),function(name,idx){return _c('dl',{key:idx},[_c('dt',[_v("name:")]),_v(" "),_c('dd',[_v(_s(name))])])})"
    return forCode;
  } else {
    // ...
  }
}
```

path: vue/src/compiler/codegen/index.js
```typescript
export function genFor (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altHelper?: string
): string {
  const log = (...rest) => console.log(Date.now(), `genFor-${rest.shift()}`, ...rest);
  // exp这名变量名也提醒我们：被遍历的目标，可以直接是变量名，也可以是一段可执行的语句
  const exp = el.for
  // 成员临时别名
  const alias = el.alias
  // <div v-for="(value, name, index) in object">，中的 name
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
  // <div v-for="(value, name, index) in object">，中的 index
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''
  // ..

  el.forProcessed = true // avoid recursion
  return  `${altHelper || '_l'}((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
      // genElement递归生成
      `return ${(altGen || genElement)(el, state)}` +
    '})'
}
```



```typescript
renderList((names), function(name,idx) {
  return _c('dl', {key:idx}, [
    _c('dt', [createTextVNode("name:")]),
    createTextVNode(" "),
    _c('dd', [createTextVNode(toString(name))])
  ])
})
```


# renderList的实现

[回到顶部](#大纲)

由上面知道最后`v-for`html段落最后被解析出来的函数文本：
解析v-for模板的函数文本
```typescript
_l((names), function(name,idx) {
  return _c('dl', {key:idx}, [
    _c('dt', [_v("name:")]),
    _v(" "),
    _c('dd', [_v(_s(name))])
  ])
})
```

全局搜索一下`_l`就可以找到：

```typescript
export function installRenderHelpers (target: any) {
  // ...
  target._l = renderList
  // ...
}
```

renderList函数是`vm._l`的实现，它的功能是遍历`v-for="item in list"`中的list，list可以有多种不同的类型！注意遍历是这个函数功能，元素的渲染则是依赖renderList函数的第二个参数：`ender: (val: any, keyOrIndex: string | number, index?: number) => VNode`。

```typescript
import { isObject, isDef, hasSymbol } from 'core/util/index'

/**
 * Runtime helper for rendering v-for lists.
 */
export function renderList (
  // 遍历的目标
  val: any,
  // 渲染函数
  render: (val: any, keyOrIndex: string | number, index?: number) => VNode
): ?Array<VNode> {
  let ret: ?Array<VNode>, i, l, keys, key
  // 1. 遍历一个数组
  // 2. 遍历一个字符串
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length)
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i)
    }
  } 
  // 3. 循环 val 次
  else if (typeof val === 'number') {
    ret = new Array(val)
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i)
    }
  }
  // 4. 遍历一个对象
  else if (isObject(val)) {
    // 4.1 遍历迭代器
    /**
     * 以下内置类型拥有默认的@@iterator方法：
     *  Array.prototype[@@iterator]()
     *  TypedArray.prototype[@@iterator]()
     *  String.prototype[@@iterator]()
     *  Map.prototype[@@iterator]()
     *  Set.prototype[@@iterator]()
     */
    if (hasSymbol && val[Symbol.iterator]) {
      ret = []
      const iterator: Iterator<any> = val[Symbol.iterator]()
      let result = iterator.next()
      while (!result.done) {
        ret.push(render(result.value, ret.length))
        result = iterator.next()
      }
    }
    // 4.2 遍历常规对象
    else {
      keys = Object.keys(val)
      ret = new Array(keys.length)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        ret[i] = render(val[key], key, i)
      }
    }
  }
  if (!isDef(ret)) {
    ret = []
  }
  (ret: any)._isVList = true
  return ret
}
```
由上面的代码可以知道，`v-for`可以遍历以下几种类型

1. 遍历数组
2. 遍历类数组的字符串
3. 循环指定次数
4. 遍历迭代器
5. 遍历常规对象

遍历迭代器可能用得比较少，下面有个不算很好的例子：

```html
<main id="app">
  <ul>
    <h3>myIterable: </h3>
    <li v-for="(item, key) in myIterable">{{key}}: {{item}}</li>
  </ul>
</main>
<script>
  const vm = new Vue({
    data: {
      myIterable: (() => {
        var myIterable = {}
        myIterable[Symbol.iterator] = function* () {
          yield 1;
          yield 2;
          yield 3;
        };
        return myIterable;
      })()
    }
  }).$mount('#app');
</script>
```
迭代器的详细分析参考：[什么是迭代器？](#)


```typescript
parseHTML(template, {
  // ...
  start (tag, attrs, unary, start, end) {
    // ...
    let element: ASTElement = createASTElement(tag, attrs, currentParent)
    // ...
    else if (!element.processed) {
      // structural directives
      processFor(element)
      // ..
    }
  }
  // ...
});
```


# 总结

[回到顶部](#大纲)

- v-for视图解析到渲染成html文段的过程

1. 使用`parse`方法解析视图模板，生成ast，其中主要的三个函数是: a. parseStartTag解析属性等主要信息的位置，b. handleStartTag解析属性，c. createASTElement根据解析出的属性等生成元素的ast；
2. 使用`generate`将ast转化成函数文本，`_l`（`renderlist`）即是`v-for`视图的文本函数，其中主要函数是`genElement`，可递归生成后代元素的函数文本；
3. 函数文本作为render-watcher.update方法主逻辑

- 从`renderlist`中可以看出v-for可以遍历以下几种类型
  
1. 遍历数组
2. 遍历类数组的字符串
3. 循环指定次数
4. 遍历迭代器
5. 遍历常规对象

