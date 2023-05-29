---
title: filter的实现原理
date: 2019-12-14 08:41:47
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
- [filter一般调用方式有三种](#filter一般调用方式有三种)
- [\_f是什么？](#_f是什么)
- [总结](#总结)

<!-- more -->

# 前言

使用如下例子，说明`filter`作为html属性一部分或元素文本一部分的解析，以及vue对`filter`解析过程的详细实现。

```html
<main id="app">
  <span :data-filter="price|decimal(3)|format-unit|test">{{price|decimal(3)|format-unit|test}}</span>
</main>
<script>
  const vm = new Vue({
    created() {
      this.methodA();
    },
    data: {
      curcoder: {
        name: 'isaac',
        position: 'fe',
        email: 'isaacgun@outlook.com'
      },
      price: 100
    },
    filters: {
      decimal(val, count = 2) {
        if (Number.isNaN(val)) {
          return val;
        }
        if (Number.isNaN(count) || count < 0) {
          count = 0;
        }
        return val.toFixed(count);
      },
      formatUnit(val) {
        return ['￥', val].join('');
      },
      Test(val) {
        console.log(334, this);
        return val;
      }
    },
    methods: {
      methodA() {
        const { decimal } = this.$options.filters;
        const num = decimal(120, 4);
        console.log(num);
      }
    }
  }).$mount('#app');
  console.log('vm:', vm);
</script>
```


# filter一般调用方式有三种

[回到顶部]

1. 在双花括号中使用：`<span>{{price|unit}}</span>`，在解析模板阶段，使用`parseText`进行解析；
2. 在 `v-bind` 中使用：`<span :data-format-price="price|unit"></span>`，在解析模板阶段，使用`processAttrs`进行解析；
3. 在钩子或回调函数中使用：`this.$options.filters.unit(this.price)`。

在`parseText`中解析

path: `vue/src/compiler/parser/text-parser.js:20`

```typescript
// parse `<span>{{price|unit}}</span>`

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export function parseText (
  text: string,
  delimiters?: [string, string]
): TextParseResult | void {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  if (!tagRE.test(text)) {
    return
  }
  while ((match = tagRE.exec(text))) {
    // ...
    log(match[1]);
    const exp = parseFilters(match[1].trim())
    // ...
  }
  // ...
}

// output: "price|unit"
```

在`processAttrs`中解析

path: `vue/src/compiler/parser/index.js:765`

```typescript
// parse `<span :data-format-price="price|unit"></span>`

function processAttrs (el) {
  // ...
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (dirRE.test(name)) {
      // ...
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '')
        log('value:', value)
        value = parseFilters(value)
      }
      // ...
    }
    // ...
  }
  // ...
}

// output: "price|unit"
```
可以看到，以上两种方式去解析filter文本，最后都是调用`parseFilters`对filter文本进行解析。
```typescript
// parse `price|decimal(3)|format-unit|test`

export function parseFilters (exp: string): string {
  // ...
  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i])
    }
  }
  log(expression);
  return expression
}
function wrapFilter (exp: string, filter: string): string {
  const i = filter.indexOf('(')
  if (i < 0) {
    // _f: resolveFilter
    return `_f("${filter}")(${exp})`
  } else {
    const name = filter.slice(0, i)
    const args = filter.slice(i + 1)
    return `_f("${name}")(${exp}${args !== ')' ? ',' + args : args}`
  }
}

// output: `_f("test")(_f("format-unit")(_f("decimal")(price,3)))`
```
filter文本最后解析完还是文本！是一串有函数和参数组成的字符串，其中比较突出的就是`_f`！
从`_f("decimal")(price,3)`就可以大致推断`_f`是一个工厂函数，用来生产filter函数，`_f("decimal")`应该就是获取`decimal`过滤器，
那么大概`_f("decimal")(price,3)`就是，调用`decimal`过滤器，传入参数`this.price,3`！

为什么最后解析出的只是一段函数调用的文本？

因为vue的视图渲染分成两步：a. 解析视图模板，生成用于渲染整个视图的函数文本；b. 将函数文本作为视图订阅器（render-watcher）的getter（用于获取watcher的值，watcher.value）。

可以直接打印一下例子中render-watcher的文本：

```typescript
// path: 
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  log(code.render);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```
```
# output:

with(this){return _c('main',{attrs:{"id":"app"}},[_c('span',{attrs:{"data-filter":_f("test")(_f("format-unit")(_f("decimal")(price,3)))}},[_v(_s(_f("test")(_f("format-unit")(_f("decimal")(price,3)))))])])}
```
可以看见`_f("test")(_f("format-unit")(_f("decimal")(price,3)))`就被包含在其中！



# _f是什么？

[回到顶部]

上面推测`_f`是生产过滤器的工厂，具体看下这个`_f`是怎么来的！

全局搜索`._f`，可以在`vue/src/core/instance/render-helpers/index.js`找到下面的代码！
```typescript
import { resolveFilter } from './resolve-filter'

export function installRenderHelpers (target: any) {
  // ...
  target._f = resolveFilter
  // ...
}
```

向上回溯去找`installRenderHelpers`在哪里被调用！可以找到`renderMixin`！

```typescript
export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)
}
```
在`vue/src/core/instance/render-helpers/index.js`中向下寻找`resolveFilter`的本质逻辑！
```typescript
import { identity, resolveAsset } from 'core/util/index'

/**
 * Runtime helper for resolving filters
 * @param {string} id filter的名字
 */
export function resolveFilter (id: string): Function {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]

  // 中划线转驼峰
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]

  // 开头大写化
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]

  // fallback to prototype chain
  // 自然回溯原型链
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
```

再看`_f("decimal")`，即是`resolveFilter ("decimal")`,
```typescript
// resolveAsset(this.$options, 'filters', id, true)
resolveAsset(this.$options, 'filters', 'decimal', true);
```
那么对于filter来说，xx的几个参数的意思：
```typescript
function resolveAsset (
  options: Object,  // this.$options
  type: string, // 'filters'
  id: string, // 'decimal'(过滤器名)
  warnMissing?: boolean
)
```
那么`const assets = options[type]`中的assets就是filters，`return assets[id]`就是返回我们自己定义的filter-callback！

`_f("decimal")`就返回decimal过滤器回调函数！

从上面`resolveAsset`的实现，可以看出，filter的使用方式可以兼容以下几种情况：

1. 正常调用，`{{price|formatUnit}}`；
2. 中划线调用，单用驼峰法定义filter，`{{price|format-unit}}`；
3. 小写开头调用，但定义时用开头大写，`{{price|test}}`，test对使用Test定义的filter有效；
4. 自然回溯原型链，但对于filter作用不大，除非是与原型链上属性或函数同名！

整个流程下来，可以发现：a. filter-callback没有使用bind绑定上下文；b. 没有直接挂在在vue实例上。

这也是有别于`methods`的不同，看`methods`的初始化就知道：
```typescript
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    // ...
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}
```

filter的特点
1. filter不会被代理到vm实例上；      
2. filter不会绑定vm作为上下文。




# 总结

[回到顶部]

- filter兼容的调用方式
 1. 正常调用，`{{price|formatUnit}}`；
 2. 中划线调用，单用驼峰法定义filter，`{{price|format-unit}}`；
 3. 小写开头调用，但定义时用开头大写，`{{price|test}}`，test对使用Test定义的filter有效；
 4. 自然回溯原型链，但对于filter作用不大，除非是与原型链上属性或函数同名！



- filter的特点
 1. filter不会被代理到vm实例上；     
 2. filter不会绑定vm作为上下文。



[回到顶部]: #大纲
[前言]: #前言
[filter一般调用方式有三种]: #filter一般调用方式有三种
[_f是什么？]: #_f是什么
[总结]: #总结
