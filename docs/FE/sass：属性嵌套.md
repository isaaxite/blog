### 4.3. 属性嵌套 (Nested Properties)
有些 CSS 属性遵循相同的命名空间 (namespace)，比如 font-family, font-size, font-weight 都以 font 作为属性的命名空间。为了便于管理这样的属性，同时也为了避免了重复输入，Sass 允许将属性嵌套在命名空间中，例如：
```sass
.funky {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
```
编译为

```css
.funky {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold; }
```
命名空间也可以包含自己的属性值，例如：
```sass
.funky {
  font: 20px/24px {
    family: fantasy;
    weight: bold;
  }
}
```
编译为
```css
.funky {
  font: 20px/24px;
    font-family: fantasy;
    font-weight: bold; }
```
