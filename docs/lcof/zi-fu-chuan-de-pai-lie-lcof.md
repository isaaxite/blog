# 面试题38. 字符串的排列

输入一个字符串，打印出该字符串中字符的所有排列。

 

你可以以任意顺序返回这个字符串数组，但里面不能有重复元素。

 

示例:

输入：s = "abc"
输出：["abc","acb","bac","bca","cab","cba"]
 

限制：

1 <= s 的长度 <= 8

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/zi-fu-chuan-de-pai-lie-lcof

## 1.暴力穷举

```js
/**
 * @param {string} s
 * @return {string[]}
 */
var permutation = function(s) {
  const res = [];
  dfs(s, '');
  function dfs(restStr, recordStr) {
    if (!restStr.length && !res.includes(recordStr)) res.push(recordStr);
    for (let i = 0; i < restStr.length; i++) {
      let newRest = restStr.slice(0, i) + restStr.slice(i + 1);
      dfs(newRest, recordStr + restStr[i]);
    }
  }
  return res;
};
```