# 面试题19. 正则表达式匹配

请实现一个函数用来匹配包含'. '和'*'的正则表达式。模式中的字符'.'表示任意一个字符，而'*'表示它前面的字符可以出现任意次（含0次）。在本题中，匹配是指字符串的所有字符匹配整个模式。例如，字符串"aaa"与模式"a.a"和"ab*ac*a"匹配，但与"aa.a"和"ab*a"均不匹配。

示例 1:

输入:
s = "aa"
p = "a"
输出: false
解释: "a" 无法匹配 "aa" 整个字符串。
示例 2:

输入:
s = "aa"
p = "a*"
输出: true
解释: 因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
示例 3:

输入:
s = "ab"
p = ".*"
输出: true
解释: ".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
示例 4:

输入:
s = "aab"
p = "c*a*b"
输出: true
解释: 因为 '*' 表示零个或多个，这里 'c' 为 0 个, 'a' 被重复一次。因此可以匹配字符串 "aab"。
示例 5:

输入:
s = "mississippi"
p = "mis*is*p*."
输出: false
s 可能为空，且只包含从 a-z 的小写字母。
p 可能为空，且只包含从 a-z 的小写字母，以及字符 . 和 *。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/zheng-ze-biao-da-shi-pi-pei-lcof

## 1.暴力递归进行穷举

```js
/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
function isMatchIt(s, p) {
  if (p === '') return s === '';
  const subMatch = s && [s[0], '.'].includes(p[0]);
  // *是需要和前面一个字符结合使用，即至少p的长度是2
  if (p.length > 1 && p[1] === '*') {
    // 1. 匹配0次: isMatch(s, p.slice(2))，可以忽略s[0] !== p[0]，既然匹配0次，即可以跳过“p[0]*”的匹配
    // 2. 匹配多次，匹配多次的前提是[p[0], '.'].includes(s[0])
    // 2.1 通过后移s，而不动p，然后下一个s可以持续匹配"p[0]*"
    return isMatch(s, p.slice(2)) || subMatch && isMatch(s.slice(1), p);
  }
  return subMatch && isMatch(s.slice(1), p.slice(1));
}
```

## 2.备忘录优化暴力法

```js
function isMatchByMemo(s, p) {
  const sLen = s.length;
  const pLen = p.length;
  const meno = {};
  function dp(i, j) {
    // [i, sLen)
    // [j, pLen)
    const key = [i, j].join();
    const sRestLen = sLen - i;
    const pRestLen = pLen - j;
    if (typeof meno[key] !== 'undefined') return meno[key];
    if (pRestLen < 1) return sRestLen < 1;
    let isMatch = sRestLen > 0 && (s[i] === p[j] || p[j] === '.');
    if (pRestLen > 1 && p[j + 1] === '*') {
      // j: p[j], j + 1: *
      isMatch = dp(i, j + 2) || isMatch && dp(i + 1, j);
    } else {
      isMatch = isMatch && dp(i + 1, j + 1);
    }
    meno[key] = isMatch;
    return isMatch;
  }
  return dp(0, 0);
}
```