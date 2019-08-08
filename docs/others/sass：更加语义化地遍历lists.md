## 前言
有时候使用sass，会有如同vue中的v-for遍历数组的情况，当然scss也是有提供遍历器的。比如`@each`和`@for`;虽然是可以遍历，但是scss遍历的是`lists`，这个lists有点类似数组，但是又不是数组。javascript的数组元素可以使用对象作为元素，而scss在这点上，并没有类似“对象”的数据结构，倒是有嵌套`lists`。综上，scss就比较难做到语义化的列表遍历。比如，现在页面有一个列表，列表元素的宽度长短不一，需要根据不同的类名进行定制！

根据scss的情况，首先想到的做法是：
```scss
&.el-date-editor{
  $types: 'year', 'month', 'date', 'dates', 'week', 'datetime', 'datetimerange', 'daterange';
  $widths: 74px, 98px, 122px, 122px, 104px, 188px, 358px, 220px;
 
  @for $i from 1 through length($types) {
    &--#{nth($types, $i)} {width: nth($widths, $i); }
  }
}
```
咋看之下，这样确实实现了。但是，当你想要修改某个元素的宽度，找起来就不是一般的麻烦，也很容易改错，很容易出现误操作！

## 解决方案
如前言中，scss有提供`lists`的嵌套：利用`()`运算符！

```css
&.el-date-editor{
    $types:
      ('year' 74px),
      ('month' 98px),
      ('date' 122px),
      ('dates' 122px),
      ('week' 104px),
      ('datetime' 188px),
      ('datetimerange' 358px),
      ('daterange' 220px);

    @each $item in $types {
      &--#{nth($item, 1)} { width: nth($item, 2); }
    }
  }
```
如上，是不是就比较语义化了，想改week的宽度时，很容易就可以找到并准确修改~

另外，你发现在括号内部是以空格分隔的，其实空格和逗号都是一样的效果，在括号内部使用空格是为了更加语义化，更加容易区分~
