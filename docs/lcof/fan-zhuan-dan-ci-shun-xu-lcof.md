# 面试题58 - I. 翻转单词顺序

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

 

示例 1：

输入: "the sky is blue"
输出: "blue is sky the"
示例 2：

输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
示例 3：

输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
 

说明：

无空格字符构成一个单词。
输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
注意：本题与主站 151 题相同：https://leetcode-cn.com/problems/reverse-words-in-a-string/

注意：此题对比原题有改动

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/fan-zhuan-dan-ci-shun-xu-lcof

## 1.滑动窗口+双指针

```js
/**
 * 滑动窗口+双指针
 * 1.使用滑动窗口取出每个单词
 * 2.双指针，left=0, right=len-1，同时向中间偏移同时交换元素
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  if (!s) return '';
  let left = 0;
  let right = 1;
  const isSpace = (val) => ['', ' '].includes(val); 
  const wordArr = [];
  // [left. right)
  while (right <= s.length) {
    if (
      !isSpace(s[left])
      && !isSpace(s[right - 1])
      && isSpace(s[right] || '')
    ) {
      wordArr.push(s.slice(left, right));
      left = right;
    }
    if (isSpace(s[left])) left++;
    right++;
  }
  left = 0;
  right = wordArr.length - 1;
  // [left, right]
  while (left < right) {
    const tmp = wordArr[left];
    wordArr[left] = wordArr[right];
    wordArr[right] = tmp;
    left++;
    right--;
  }
  return wordArr.join(' ');
};
```