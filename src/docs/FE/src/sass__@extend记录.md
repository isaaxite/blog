# sass__@extend记录

[reference](http://www.alloyteam.com/2016/12/javascript-has-a-unicode-sinkhole/)
## 7.3. @extend
在设计网页的时候常常遇到这种情况：一个元素使用的样式与另一个元素完全相同，但又添加了额外的样式。通常会在 HTML 中给元素定义两个 class，一个通用样式，一个特殊样式。假设现在要设计一个普通错误样式与一个严重错误样式，一般会这样写：
```html
<div class="error seriousError">
  Oh no! You've been hacked!
</div>
```
样式如下
```css
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  border-width: 3px;
}
```
麻烦的是，这样做必须时刻记住使用 .seriousError 时需要参考 .error 的样式，带来了很多不变：智能比如加重维护负担，导致 bug，或者给 HTML 添加无语意的样式。使用 @extend 可以避免上述情况，告诉 Sass 将一个选择器下的所有样式继承给另一个选择器。
```sass
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```
上面代码的意思是将 .error 下的所有样式继承给 .seriousError，border-width: 3px; 是单独给 .seriousError 设定特殊样式，这样，使用 .seriousError 的地方可以不再使用 .error。

其他使用到 .error 的样式也会同样继承给 .seriousError，例如，另一个样式 .error.intrusion 使用了 hacked.png 做背景，<div class="seriousError intrusion"> 也同样会使用 hacked.png 背景。
```css
.error.intrusion {
  background-image: url("/image/hacked.png");
}
```
### 7.3.1. How it Works

@extend 的作用是将重复使用的样式 (.error) 延伸 (extend) 给需要包含这个样式的特殊样式（.seriousError），刚刚的例子：
```sass
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.error.intrusion {
  background-image: url("/image/hacked.png");
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```
编译为
```css
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd; }

.error.intrusion, .seriousError.intrusion {
  background-image: url("/image/hacked.png"); }

.seriousError {
  border-width: 3px; }
```
当合并选择器时，@extend 会很聪明地避免无谓的重复，.seriousError.seriousError 将编译为 .seriousError，不能匹配任何元素的选择器（比如 #main#footer ）也会删除。

### 7.3.2. 延伸复杂的选择器 (Extending Complex Selectors)

Class 选择器并不是唯一可以被延伸 (extend) 的，Sass 允许延伸任何定义给单个元素的选择器，比如 .special.cool，a:hover 或者 a.user[href^="http://"] 等，例如：
```sass
.hoverlink {
  @extend a:hover;
}
```
同 class 元素一样，a:hover 的样式将继承给 .hoverlink。
```sass
.hoverlink {
  @extend a:hover;
}
a:hover {
  text-decoration: underline;
}
```
编译为
```css
a:hover, .hoverlink {
  text-decoration: underline; }
```

与上面 .error.intrusion 的例子一样，所有 a:hover 的样式将继承给 .hoverlink，包括其他使用到 a:hover 的样式，例如：
```sass
.hoverlink {
  @extend a:hover;
}
.comment a.user:hover {
  font-weight: bold;
}
```

编译为

```css
.comment a.user:hover, .comment .user.hoverlink {
  font-weight: bold; }
```
-----
### 7.3.3. 多重延伸 (Multiple Extends)

同一个选择器可以延伸给多个选择器，它所包含的属性将继承给所有被延伸的选择器：
```sass
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.attention {
  font-size: 3em;
  background-color: #ff0;
}
.seriousError {
  @extend .error;
  @extend .attention;
  border-width: 3px;
}
```

编译为

```css
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd; }

.attention, .seriousError {
  font-size: 3em;
  background-color: #ff0; }

.seriousError {
  border-width: 3px; }
```

每个 .seriousError 将包含 .error 与 .attention 下的所有样式，这时，后定义的样式享有优先权：.seriousError 的背景颜色是 #ff0 而不是 #fdd，因为 .attention 在 .error 之后定义。

多重延伸可以使用逗号分隔选择器名，比如 @extend .error, .attention; 与 @extend .error; @extend.attention 有相同的效果。

### 7.3.4. 继续延伸 (Chaining Extends)

当一个选择器延伸给第二个后，可以继续将第二个选择器延伸给第三个，例如：

```sass
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
.criticalError {
  @extend .seriousError;
  position: fixed;
  top: 10%;
  bottom: 10%;
  left: 10%;
  right: 10%;
}
```
现在，每个 .seriousError 选择器将包含 .error 的样式，而 .criticalError 不仅包含 .seriousError 的样式也会同时包含 .error 的所有样式，上面的代码编译为：
```css
.error, .seriousError, .criticalError {
  border: 1px #f00;
  background-color: #fdd; }

.seriousError, .criticalError {
  border-width: 3px; }

.criticalError {
  position: fixed;
  top: 10%;
  bottom: 10%;
  left: 10%;
  right: 10%; }
```

### 7.3.5. 选择器列 (Selector Sequences)

暂时不可以将选择器列 (Selector Sequences)，比如 .foo .bar 或 .foo + .bar，延伸给其他元素，但是，却可以将其他元素延伸给选择器列：
```sass
#fake-links .link {
  @extend a;
}

a {
  color: blue;
  &:hover {
    text-decoration: underline;
  }
}
```

编译为

```css
a, #fake-links .link {
  color: blue; }
  a:hover, #fake-links .link:hover {
    text-decoration: underline; }
```
### 7.3.5.1. 合并选择器列 (Merging Selector Sequences)

有时会遇到复杂的情况，比如选择器列中的某个元素需要延伸给另一个选择器列，这种情况下，两个选择器列需要合并，比如：
```sass
#admin .tabbar a {
  font-weight: bold;
}
#demo .overview .fakelink {
  @extend a;
}
```
技术上讲能够生成所有匹配条件的结果，但是这样生成的样式表太复杂了，上面这个简单的例子就可能有 10 种结果。所以，Sass 只会编译输出有用的选择器。

当两个列 (sequence) 合并时，如果没有包含相同的选择器，将生成两个新选择器：第一列出现在第二列之前，或者第二列出现在第一列之前：
```sass
#admin .tabbar a {
  font-weight: bold;
}
#demo .overview .fakelink {
  @extend a;
}
```

编译为

```css
#admin .tabbar a,
#admin .tabbar #demo .overview .fakelink,
#demo .overview #admin .tabbar .fakelink {
  font-weight: bold; }
```

如果两个列 (sequence) 包含了相同的选择器，相同部分将会合并在一起，其他部分交替输出。在下面的例子里，两个列都包含 #admin，输出结果中它们合并在了一起：
```sass
#admin .tabbar a {
  font-weight: bold;
}
#admin .overview .fakelink {
  @extend a;
}
```

编译为

```css
#admin .tabbar a,
#admin .tabbar .overview .fakelink,
#admin .overview .tabbar .fakelink {
  font-weight: bold; }
```

### 7.3.6. @extend-Only 选择器 (@extend-Only Selectors)

有时，需要定义一套样式并不是给某个元素用，而是只通过 @extend 指令使用，尤其是在制作 Sass 样式库的时候，希望 Sass 能够忽略用不到的样式。

如果使用普通的 CSS 规则，最后会编译出很多用不到的样式，也容易与其他样式名冲突，所以，Sass 引入了“占位符选择器” (placeholder selectors)，看起来很像普通的 id 或 class 选择器，只是 # 或 . 被替换成了 %。可以像 class 或者 id 选择器那样使用，当它们单独使用时，不会被编译到 CSS 文件中。

```sass
// This ruleset won't be rendered on its own.
#context a%extreme {
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
```

占位符选择器需要通过延伸指令使用，用法与 class 或者 id 选择器一样，被延伸后，占位符选择器本身不会被编译。

```sass
.notice {
  @extend %extreme;
}
```
编译为

```css
#context a.notice {
  color: blue;
  font-weight: bold;
  font-size: 2em; }
```

### 7.3.7. !optional 声明 (The !optional Flag)

如果 @extend 失败会收到错误提示，比如，这样写 a.important {@extend .notice}，当没有 .notice 选择器时，将会报错，只有 h1.notice 包含 .notice 时也会报错，因为 h1 与 a 冲突，会生成新的选择器。

如果要求 @extend 不生成新选择器，可以通过 !optional 声明达到这个目的，例如：

```sass
a.important {
  @extend .notice !optional;
}
```
### 7.3.8. 在指令中延伸 (@extend in Directives)

在指令中使用 @extend 时（比如在 @media 中）有一些限制：Sass 不可以将 @media 层外的 CSS 规则延伸给指令层内的 CSS，这样会生成大量的无用代码。也就是说，如果在 @media （或者其他 CSS 指令）中使用 @extend，必须延伸给相同指令层中的选择器。

下面的例子是可行的：
```sass
@media print {
  .error {
    border: 1px #f00;
    background-color: #fdd;
  }
  .seriousError {
    @extend .error;
    border-width: 3px;
  }
}
```
但不可以这样：
```sass
.error {
  border: 1px #f00;
  background-color: #fdd;
}

@media print {
  .seriousError {
    // INVALID EXTEND: .error is used outside of the "@media print" directive
    @extend .error;
    border-width: 3px;
  }
}
```
希望有一天，浏览器可以原生支持 @extend 指令，这样就可以在任何指令中使用延伸功能，不再受限制了。
