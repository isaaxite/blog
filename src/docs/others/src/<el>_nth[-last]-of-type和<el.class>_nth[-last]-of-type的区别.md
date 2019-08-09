# <el>_nth[-last]-of-type和<el.class>_nth[-last]-of-type的区别

```html
<div>
  <dl class="item"></dl>
  <dl class="item-extra"></dl>
</div>
```

```css
dl:nth-last-of-type(1)::before {
  content: "just dl";
}

dl.item:nth-last-of-type(1)::before {
  content: "dl.item";
}
```

期望的输出是：
```
dl.item
just item
```
实际上输出：
```
just item
```

没错，实际上就只是输出这么一行`just item`！
输出`just item`其实不难理解，而且它的输出是预期结果，`dl:nth-last-of-type(1)`找的确实是最后一个dl子元素，所以确实是会输出`just item`。
但是比较让人意外的是没有输出`dl.item`！！！but why?

预期的元素查找思路用js的代码描述就是这样的：
```js
const idItemEle = [...document.querySelectorAll("dl.item")].pop();
//期望：先找到所有的"dl.item"子元素，然后返回最后一个
```
但实际上，惭怍大概是这样的：
```js
let dlItemEle = [...document.querySelectorAll('dl')].pop();
dlItemEle = dlItemEle.classList.includes('item') ? dlItemEle : undefined;
// 实际：先找到所有的 dl 子元素，返回最后一个dl子元素，然后判断是否包含”item“类。
// 如果有包含，那么很好，这就是要找的！如果没有，不好意思，就是这么蠢！
```
