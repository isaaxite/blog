以下是[Microsoft Developer Network]的描述
>sort 方法就地对 Array 对象进行排序；在执行过程中不会创建新 Array 对象。
如果在 sortFunction 参数中提供一个函数，则该函数必须返回下列值之一：
如果所传递的第一个参数小于第二个参数，则返回负值。
如果两个参数相等，则返回零。
如果第一个参数大于第二个参数，则返回正值。

这是一段比较让人迷惑的描述！

再看[Microsoft Developer Network]提供的例子：
```javascript
var a = new Array(4, 11, 2, 10, 3, 1);

// Sort the array elements with a function that compares array elements.
b = a.sort(CompareForSort);
document.write(b);
document.write("<br/>");
// Output: 1,2,3,4,10,11.

// Sorts array elements in ascending order numerically.
function CompareForSort(first, second)
{
    if (first == second)
        return 0;
    if (first < second)
        return -1;
    else
        return 1;
}
```

关注两点：
- 数组a：`[4, 11, 2, 10, 3, 1]`;
- 回调函数 `CompareForSort`。

`CompareForSort` 也是真的如描述一般：`=` 就返回 0，`<` 就返回 -1，`>` 就返回 1。
然后，排序后的数组也真的有序了，升序~

没错如果遵循描述说的做，只能得到 “升序” 的有序列，但是有时我们是需要降序的有序列！！！

这个有前者的基础也是好办， 按描述的相反方向操作就好：

**`=` 就返回 0，`<` 就返回 1，`>` 就返回 -1**

看到这里有没有感受到描述的恶意；

到这里，我总结一下`Array.prototype.sort`这个方法：

1. 按描述操作是默认的升序排序；
2. 返回 1（正数） 会交换位置，返回 0 或 -1（非正数）保持位置不变！

没错关键是第二句！

[Microsoft Developer Network]: https://msdn.microsoft.com/zh-cn/library/4b4fbfhk(v=vs.94).aspx

