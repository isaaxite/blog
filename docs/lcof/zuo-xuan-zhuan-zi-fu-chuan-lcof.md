# 面试题58 - II. 左旋转字符串

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。

 

示例 1：

输入: s = "abcdefg", k = 2
输出: "cdefgab"
示例 2：

输入: s = "lrloseumgh", k = 6
输出: "umghlrlose"
 

限制：

1 <= k < s.length <= 10000

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof

## 1.简单切片

```js
/**
 * @param {string} s
 * @param {number} n
 * @return {string}
 */
var reverseLeftWords = reverseLeftWords2;

function reverseLeftWords1(s, n) {
  return s.slice(n) + s.slice(0, n);
};
```

## 2.字符拼接

拼接比起数组保存后拼接要快……

```js
function reverseLeftWords2(s, n) {
  let res = '';
  for (let i = n; i < s.length; i++) {
    res += s[i];
  }
  for (let i = 0; i < n; i++) {
    res += s[i];
  }
  return res;
};
```