---
title: 面试题56 - II. 数组中数字出现的次数 II
date: 2020-04-17 07:26:51
tags:
- 算法题
- 旧文迁移
categories:
- 算法题
---


在一个数组 nums 中除一个数字只出现一次之外，其他数字都出现了三次。请找出那个只出现一次的数字。

<!-- more -->

示例 1：

输入：nums = [3,4,3,3]
输出：4
示例 2：

输入：nums = [9,1,7,9,7,9,7]
输出：1
 

限制：

1 <= nums.length <= 10000
1 <= nums[i] < 2^31

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-ii-lcof

## 1.Hash表去重

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumberHash = function(nums) {
  const record = {};
  for (const num of nums) {
    if (!record[num]) {
      record[num] = 1;
    } else {
      record[num]++;
    }
  }
  for (let key in record) {
    if (record[key] === 1) return key;
  }
};
```

## 2.位运算计算目标数

```js
/**
 * 计算目标数的二进制上的每一位（0/1），注意是计算出，不是过滤出的
 * 1.使用2的冥值去探测各个二进制位上的情况，设要找的书是tar，设nums中，二进制第i位上的值是1的数有k个，k肯定是满足：
 * 1.1 当tar的二进制的第i位是1,则k=3n+1, (n = 0, 1, ..., nums,length)
 * 1.2 当tar的二进制的第i位是0,则k=3n, (n = 0, 1, ..., nums,length)
 * 2.根据1.1和1.2就可以去探测tar每一位具体是0还是1
 * @param {number[]} nums
 * @return {number}
 */
var singleNumberBit1 = function(nums) {
  const tar = [];
  // 题目指出：1 <= nums[i] < 2^31
  // bit是由1左移得到，所以最多可以移30位，因为第一次是移动0位，所以可以遍历31次
  for (let i = 0; i < 31; i++) {
    let count = 0;
    // bit:
    // i= 0: 1
    // i= 1: 10
    // i= 2: 100
    // ...
    const bit = 1 << i;
    for (const num of nums) {
      if ((num & bit) !== 0) {
        count++;
      }
    }
    // count % 3 !== 0, 说明tar左起第i位是
    tar.unshift(count % 3 !== 0 ? 1 : 0);
  }
  return Number.parseInt(tar.join(''), 2);
};
```

## 3.完全位运算

与“2.位运算计算目标数”不同，不是使用记录目标书二进制情况，而是使用按位或直接计算。

```js
if (count % 3 !== 0) tar = tar | bit;
```

```js
var singleNumberBit2 = function(nums) {
  let tar = 0;
  // 题目指出：1 <= nums[i] < 2^31
  // bit是由1左移得到，所以最多可以移30位，因为第一次是移动0位，所以可以遍历31次
  for (let i = 0; i < 31; i++) {
    let count = 0;
    const bit = 1 << i;
    for (const num of nums) {
      if ((num & bit) !== 0) {
        count++;
      }
    }
    // |:按位或，只要同一位不为0都得1
    if (count % 3 !== 0) tar = tar | bit;
  }
  return tar;
}
```
