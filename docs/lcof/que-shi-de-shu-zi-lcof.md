# 面试题53 - II. 0～n-1中缺失的数字

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

 

示例 1:

输入: [0,1,3]
输出: 2
示例 2:

输入: [0,1,2,3,4,5,6,7,9]
输出: 8
 

限制：

1 <= 数组长度 <= 10000

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/que-shi-de-shu-zi-lcof

## 1.二分查找

```js
/**
 * 二分查找
 * 注意点：每个数字都在范围0～n-1之内，最大值不超过n，所以若给的nums是一个递增无缺少的序列，则是缺少n
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
  if (!nums.length) return 0;
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (
      nums[mid] !== mid
      && (nums[mid - 1] === mid - 1 || nums[mid - 1] === undefined)
    ) {
      return mid;
    }
    if (nums[mid] === mid) {
      left = mid + 1;

    } else {
      right = mid - 1;
    }
  }
  return nums.length;
};
```