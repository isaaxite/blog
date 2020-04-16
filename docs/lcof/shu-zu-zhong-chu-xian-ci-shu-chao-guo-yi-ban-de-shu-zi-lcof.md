# 面试题39. 数组中出现次数超过一半的数字

数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。

 

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

 

示例 1:

输入: [1, 2, 3, 2, 2, 2, 5, 4, 2]
输出: 2
 

限制：

1 <= 数组长度 <= 50000

 

注意：本题与主站 169 题相同：https://leetcode-cn.com/problems/majority-element/

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/shu-zu-zhong-chu-xian-ci-shu-chao-guo-yi-ban-de-shu-zi-lcof

## 1.Hash去重与计数

```js
/**
 * Hash去重与计数
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  const obj = {};
  const halfLen = Math.floor(nums.length / 2);
  for (const num of nums) {
    if (obj[num]) {
      obj[num]++;
      if (obj[num] > halfLen) {
        return num;
      }
    } else {
      obj[num] = 1;
    }
  }
  for (let num in obj) {
    if (obj[num] > halfLen) {
      return num;
    }
  }
};
```