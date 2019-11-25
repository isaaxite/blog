
path: `vue/src/platforms/web/entry-runtime-with-compiler.js`
```typescript
const { render, staticRenderFns } = compileToFunctions(template, {
  outputSourceRange: process.env.NODE_ENV !== 'production',
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
  delimiters: options.delimiters,
  comments: options.comments
}, this)
options.render = render
```

path: `vue/src/core/instance/lifecycle.js`
```typescript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  restoreActiveInstance()
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```

```typescript
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

```typescript
new Watcher(vm, updateComponent, noop, {
  key: 'render-watcher',
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

这是render-watcher的update方法，vnode是每次都生成的
```typescript
updateComponent = () => {
  const vnode = vm._render();
  vm._update(vnode, hydrating)
}
```

```typescript
// 更新视图
vm.$el = vm.__patch__(prevVnode, vnode)
```

[vnode的实现](https://blog.csdn.net/violetjack0808/article/details/79354852)


```typescript
function patch (oldVnode, vnode, hydrating, removeOnly) {

  // 控制流-1：传入的新节点未定义，而旧节点存在，则是删除操作
  if (isUndef(vnode)) {
    // 存在旧节点，则删旧节点
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }
  // ...
}

/**
 * 深入地，递归调用销毁的钩子
*/
function invokeDestroyHook (vnode) {
  let i, j
  const data = vnode.data
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
    for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
  }
  if (isDef(i = vnode.children)) {
    for (j = 0; j < vnode.children.length; ++j) {
      invokeDestroyHook(vnode.children[j])
    }
  }
}
```

```typescript
function patch (oldVnode, vnode, hydrating, removeOnly) {
  // ...

  // 控制流-2：旧节点不存在，而新节点存在，表明是初始化补丁
  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    // 很具新的虚拟节点创建元素
    createElm(vnode, insertedVnodeQueue)
  }
  // ...
}

export function createElementNS (namespace: string, tagName: string): Element {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

export function createElement (tagName: string, vnode: VNode): Element {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}

export function setStyleScope (node: Element, scopeId: string) {
  node.setAttribute(scopeId, '')
}

/**
 * Check if value is primitive.
 * 检查值是否为原始值。
 */
export function isPrimitive (value: any): boolean %checks {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

vue是怎么定义一个虚拟节点是否相等？

sameVnode(oldVnode, vnode)

```typescript
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        // 标签相同
        a.tag === b.tag &&

        // 都是注释元素, 或都不是
        a.isComment === b.isComment &&

        // idDef = (v) => v !== undefined && v !== null
        // 都定义了，或都没有定义
        isDef(a.data) === isDef(b.data) &&

        // a = { data: { atttrs: { type: 'xxx' } } }
        // 1. 两节点的type相同，
        //   i. type存在, 且相同；
        //   ii. 两个type都没有定义，都是undefined；a、b都算是通过
        // 2. a、b节点type都是'text,number,password,search,email,tel,url'中之一
        // 换言之 a.type = text, b.type = password，也可以说两个input节点相同
        // 3. a不是input标签
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

一般的视图更新：

1. 文本值的修改；
```html
<span>{{price}}</span>
```
sameVnode = true

2. 属性值修改；
```html
<span data-attr="price">{{price}}</span>
```
sameVnode = true

3. v-show/v-if

4. 列表更新

ps: 每次调用 patch 函数，vnode都是渲染的app元素，然后逐层向下比较


```typescript
function patch (oldVnode, vnode, hydrating, removeOnly) {
  // 新增节点
  if (isUndef(oldVnode)) {
    // ...
  }
  // 更新节点
  else {
    // 旧节点时有效的元素
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // ...
    } else {
      // 新旧元素不相同
      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      )
      // ...
    }
  }
}
export function parentNode (node: Node): ?Node {
  return node.parentNode
}
```

```typescript
function patch (oldVnode, vnode, hydrating, removeOnly) {
  // 新增节点
  if (isUndef(oldVnode)) {
    // ...
  }
  // 更新节点
  else {
    // 旧节点时有效的元素
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // ...
    } else {
      // 新旧元素不相同
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent
        const patchable = isPatchable(vnode)
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor)
          }
          ancestor.elm = vnode.elm
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor)
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]()
              }
            }
          } else {
            registerRef(ancestor)
          }
          ancestor = ancestor.parent
        }
      }
    }
  }
}

function isPatchable (vnode) {
  while (vnode.componentInstance) {
    vnode = vnode.componentInstance._vnode
  }
  return isDef(vnode.tag)
}
```
vnode的`.componentInstance._vnode`是什么？
![](https://segmentfault.com/img/bVs5U9)

- 只会做同级比较，不做跨级比较
1. 在tag不是input且操作的属性不是type的轻快下，属性个数增减，属性值的更新都还不算是变更，前后两个节点还是相同的

```typescript
if (!prevVnode) {
  // initial render
  vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
} else {
  // updates
  vm.$el = vm.__patch__(prevVnode, vnode)
}
```

`hydrating` 默认是 `fasle`
```typescript
Vue.prototype.$mount = function (
  el?: any,
  hydrating?: boolean
): Component {
  return mountComponent(
    this,
    el && query(el, this.$document),
    hydrating
  )
}
```