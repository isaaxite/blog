# 面试题50. 第一个只出现一次的字符

在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。

示例:

s = "abaccdeff"
返回 "b"

s = "" 
返回 " "
 

限制：

0 <= s 的长度 <= 50000

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/di-yi-ge-zhi-chu-xian-yi-ci-de-zi-fu-lcof

## Hash表记录

```js
/**
 * @param {string} s
 * @return {character}
 */
var firstUniqChar = function(s) {
  const charMap = {};
  for (let i = 0; i < s.length; i++) {
    charMap[s[i]] = charMap[s[i]] ? 2 : 1;
  }
  for (let key in charMap) {
    if (charMap[key] === 1) return key;
  }
  return ' ';
};
```