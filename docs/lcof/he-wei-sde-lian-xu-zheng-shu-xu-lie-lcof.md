# 面试题57 - II. 和为s的连续正数序列

输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。

序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

 

示例 1：

输入：target = 9
输出：[[2,3,4],[4,5]]
示例 2：

输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]
 

限制：

1 <= target <= 10^5

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof

## 使用滑动窗口（双指针变种）

```js
/**
 * 使用滑动窗口（双指针变种）
 * idx向右移动，同时累加当前总数sum，win入栈idx，直到sum大于或等于target
 * 1.当sum等于target，则保存win副本，然后继续右移idx
 * 2.当sum大于target，则出队win头元素tmp，并sum -= tmp（相当于右移win的边界）
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function(target) {
  if (target < 2) return [];
  let idx = 1;
  let sum = 0;
  let win = [];
  const res = [];
  const max = Math.ceil(target / 2);
  while (idx <= max) {
    if (sum < target) {
      sum += idx;
      win.push(idx);
      idx++;
    }

    if (sum > target) {
      sum -= win.shift();
    }

    if (sum === target) {
      res.push(win.slice(0));
      sum -= win.shift();
    }
  }
  return res;
};
```