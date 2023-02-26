---
title: 快速排序的JavaScript实现
date: 2020-01-01 12:50:02
tags:
- 数据结构
- JavaScript
- 旧文迁移
categories:
- 数据结构
---

### 基本思想
>1 在数据集之中，选择一个元素作为"基准"（pivot）。
>2 所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
>3 对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。

<!-- more -->

### 举个栗子
```js
let array = [2, 9, 6, 3, 80, 34, 7, 8];
```

![](36534815-97fd73f2-1802-11e8-9039-36b714dfd2ee.png)

```js
function quickSort(list) {
  if(list.length <= 1) { return list; }
  let left = [], right = [];
  let pivotIndex = Math.floor(list.length / 2);
  let pivot = list.splice(pivotIndex, 1)[0];
  
  for(let index = 0, len = list.length; index < len; index++) {
    let val = list[index];
    
    if(val <= pivot) {
      left.push(val);
    } else {
      right.push(val);
    }
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```
>![](36535646-54302edc-1805-11e8-8fa4-0d0eef8591c6.png)

### `quickSort`函数解构
```js
  let left = [], right = [];
  let pivotIndex = Math.floor(list.length / 2);
  let pivot = list.splice(pivotIndex, 1)[0];
  
  for(let index = 0, len = list.length; index < len; index++) {
    let val = list[index];
    
    if(val <= pivot) {
      left.push(val);
    } else {
      right.push(val);
    }
  }
```
这部分逻辑正是对**基本思想**中的1、2点的实践。
- #### 1 找出基准数
```js
  let pivotIndex = Math.floor(list.length / 2);
  let pivot = list.splice(pivotIndex, 1)[0];
```
- #### 2 以“基准”二分数组
```js
  for(let index = 0, len = list.length; index < len; index++) {
    let val = list[index];
    
    if(val <= pivot) {
      left.push(val);
    } else {
      right.push(val);
    }
  }
```

- #### 3 重复1、2点

在栗子中的数组执行一次1、2点实现后，你会发现此时执行后出现三个结果
1）letf = [2];
2）pivot = 3;
3）right = [9, 6, 80, 34, 7, 8];

然后依次组合
```js
[...left, pivot, ...right]
// [2, 3, 9, 6, 80, 34, 7, 8]
```
你会发现`left`只有一个元素，那就没有必要继续对`left`排序，所以没有必要再排序
```js
if(list.length <= 1) { return list; }
```
然后再看`right`，并不是有序数组。那要怎么办？继续对`right`排序，调用`quickSort`
```js
quickSort(right)
// [...quickSort(left), pivot, ...quickSort(right)];
```
而
```js
return [...quickSort(left), pivot, ...quickSort(right)];
```
正是对第3点的实践。
