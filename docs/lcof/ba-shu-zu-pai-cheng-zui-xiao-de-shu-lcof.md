# 面试题45. 把数组排成最小的数

输入一个正整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

 

示例 1:

输入: [10,2]
输出: "102"
示例 2:

输入: [3,30,34,5,9]
输出: "3033459"
 

提示:

0 < nums.length <= 100
说明:

输出结果可能非常大，所以你需要返回一个字符串而不是整数
拼接起来的数字可能会有前导 0，最后结果不需要去掉前导 0

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof

## 自定义排序规则 + 快排

```js
/**
 * 核心是自定义排序规则
 * +[x,y].join('') < +[y,x].join('') => x < y
 * +['30','4'].join('') < +['4','30'].join('') => '30' < '4'
 * @param {number[]} nums
 * @return {string}
 */
var minNumber = function(nums) {
  const isLessThan = (lNum, rNum) => {
    const num1 = +([lNum, rNum].join(''));
    const num2 = +([rNum, lNum].join(''));
    return num1 < num2;
  };
  function quickSort(nums) {
    if (!nums.length) return nums;
    const left = [];
    const right = [];
    const mid = Math.floor(nums.length / 2);
    for (let i = 0; i < nums.length; i++) {
      if (i === mid) continue;
      isLessThan(nums[i], nums[mid])
        ? left.push(nums[i])
        : right.push(nums[i]);
    }
    return [...quickSort(left), nums[mid], ...quickSort(right)];
  }
  return quickSort(nums).join('');
};
```