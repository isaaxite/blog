---
title: SCSS字符分割函数获取当前选择器名
date: 2023-02-19 00:53:16
tags:
---

# 有点长的前言

常有这样的情况：比如以下面的一段代码来说，多人开发的情况下，很可能你写了一个`.header-icon`的css样式描述，你的同事也开发了一个！

并且他的样式优先级比你的高，目前你负责的部分需要你的样式生效！

```scss
.side{
  .bar{
    &-header{
      &-icon{
        width: 20px;
      }
    }
  }
}
```

这要怎么办？直接想到的有两个方法：

- `!important`；

- 重复声明选择器，比如 `.bar-header-icon.bar-header-icon`；

很多时候负责任的开发者都会使用后者，因为后者可以前者覆盖，具备一定的扩展性！


```scss
.side{
  .bar{
    &-header{
      &-icon.bar-header-icon{
        width: 20px;
      }
    }
  }
}
```

没错这样就ok！

但细想可知，虽然`&-header`的当前选择器名是和`.bar-header-icon`的是相等的，但是一旦父选择器名字（`.header`）改了，就出问题，健壮性过差！

当然如果你不嫌麻烦，可以同时改两个地方。但实际开发时可能就不是两个地方的事了……

聪明如你会想到这样写：

```scss
.side{
  .bar{
    &-header{
      &-icon&-icon{
        width: 20px;
      }
    }
  }
}
```

你期望输出的是：

```css
.side .bar-header-icon.bar-header-icon {
  width: 20px;
}
```


但是，实际上输出的是：


```css
.side .bar-header-icon.side .bar-header-icon {
  width: 20px;
}
```

如你所见，在上面的情况中`&-icon`并不与`.bar-header-icon`等价，实际上，`&`编译后的是`.side .bar-header`。是不是就有点尴尬了~


# 正文

scss没有提供获取当前选择器名的方法或者全局变量，那么就自己实现！

`&`输出的字符串是一个选择器名的列表，这些元素名一般以空格分割，还有的就是`. > + ~`等等，

因此可以通过这些分割字符串，然后”数组“的最后一个元素就是目标选择器名！

## 字符串分割函数

```scss
@function str-split($str, $separator) {
  $splits: ();
  // 获取下次分割点posituion
  $pos : str-index($str, $separator);
  @while $pos != null {
    // 根据position返回子字符串
    $item: str-slice($str, 1, $pos - 1);
    // 将切割出的字串push入list中
    $splits: append($splits, $item);
    // 更新源字符串
    $str: str-slice($str, $pos + 1);
    // 获取下次分割点posituion
    $pos : str-index($str, $separator);
  }
  $splits: append($splits, $str);

  @return $splits;
}
```

## pop函数

```scss
@function list-pop($list) {
  $len: length($list);
  @return nth($list, $len);
}
```

## 获取当前selector

```scss
@function current-selector($str) {
  @return list-pop(str-split($str, ' ')); 
}
```


## 增强版的`current-selector`


```scss
@function nth-by-flag($list, $flag) {
    $els: ();
    @each $item in $list {
        @if str-index($item, $flag) != null {
            $els: append($els, $item);
        }
    }
    @return $els;
}

@function current-selector($str, $seps: null, $flag: null) {
  $current: $str;
  @if $seps != null {
    $seps: append(' ', $seps);  
  } @else {
    $seps: ' ';
  }
  @each $sep in $seps {
    $is-exist: str-index($current, $sep);
    @if $is-exist != null {
      @if $flag != null {
        $current: nth-by-flag(str-split($current, $sep), $flag);
      } @else {
        $current: list-pop(str-split($current, $sep));   
      }
    }
  }
  @return $current;
}
```

## 测试

```scss
// 封装一个debug-mixin
@mixin debug($var) {
  .debug{ content: $var; }
}
```

```scss
@include debug(current-selector(".a .b .c")); 
```

> ![](44906193-d0f78b00-ad46-11e8-99f6-060e4ceb1453.png)


```scss
$sep: '.';
$current: $sep + current-selector(".a .b .c.c.c", $sep);
@include debug($current);; 
```

> ![](44906431-76126380-ad47-11e8-8779-90f5b5b2c8bb.png)


```scss
@include debug(current-selector(".a .isaac .b .c", null, 'isaac')); 
```
> ![](44906552-cf7a9280-ad47-11e8-8b2a-28e25383bd90.png)

# 参考

- [Sass Documentation](https://sass-lang.com/documentation/modules/string)