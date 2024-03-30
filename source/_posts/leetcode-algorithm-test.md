---
title: 算法题目分析与解答
tags:
  - 算法题
  - Leetcode
  - JavaScript
date: 2020-04-17 07:26:51
categories:
---


在计算机科学和编程领域，算法是一项至关重要的核心技能。解决各种问题的高效算法可以极大地提升程序的性能和效率。而算法题目则是考察和锻炼这种技能的常见方式之一。

当我们面对算法题目时，可能会感到挑战和困惑。这些题目往往涉及复杂的逻辑、数据结构和数学原理，需要我们运用创造力和分析能力来找到最佳的解决方案。然而，正是这种挑战性使得算法题目如此令人着迷。

<!-- more -->

# 变态跳台阶||

## 题目描述

一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。

## 程序
```js
function jumpFloorII(n) {
  if (n === 1) {
    return 1;
  } else {
    return 2 * jumpFloorII(n - 1);
  }
}
```

## 分析
看程序就知道，这个解法不是单纯依赖平常思维写的，`2 * jumpFloorII(n - 1)`这句代码明显就是个规律，所以就是找规律！

设有`f(n)，n=台阶数`为算出“跳上一个n级的台阶总共有多少种跳法”的函数。

只关心第一次跳多少个台阶，剩下的就交给这个`f(n)`来解决！
那么有n个台阶，第一次可以选择跳的台阶数就可以是1级，或2级，或3级，……，或n级。
当第一次跳1级时，那么剩下就有n-1级，那么剩下n-1级台阶就有f(n-1)种跳法；
当第一次跳2级时，那么剩下就有n-2级，那么剩下n-2级台阶就有f(n-2)种跳法；
当第一次跳3级时，那么剩下就有n-3级，那么剩下n-3级台阶就有f(n-3)种跳法；
……
当第一次跳n-1级时，那么剩下就有n-(n-1)级，那么剩下n-(n-1)级台阶就有f(n-(n-1))种跳法；
当第一次跳n级时，那么剩下就有n-n级，那么剩下n-n级台阶就有f(n-n)种跳法。

上面已经将“跳上一个n级的台阶总共有多少种跳法”这个问题做了拆分，拆分为：以第一次跳的级数作为分类，由上面的排比就知道分成了n类方式（是不是很熟悉，排列组合中[分类加法计数原理](https://baike.baidu.com/item/%E5%88%86%E7%B1%BB%E5%8A%A0%E6%B3%95%E8%AE%A1%E6%95%B0%E5%8E%9F%E7%90%86/467166)）。

显然将这n类方式的跳法加起来就是题目的问题，即：
```
f(n) = f(n-1) + f(n-2) + f(n-3) + ... + f(n-(n-1)) + f(n-n)
```
整理一下这个代数式就是
```
f(n) = f(n-1) + f(n-2) + f(n-3) + ... + f(1) + f(0)
```
根据这个代数式，你可以推导出f(n-1)的代数式是：
```
f(n-1) = f(n-2) + f(n-3) + ... + f(1) + f(0)
```
结合一下，就有最终的式子：
```
f(n) = f(n-1) + f(n-1) = 2 * f(n-1)
```
到现在，只是知道代数关系，还是不知道f(n)这个函数的具体逻辑！但是有这个关系，就可以将问题向下转化！比如我们不知道f(2)等于多少，但是知道`f(2) = 2 * f(1)`，而f(1)是很轻松就可以知道的！
f(1)就是第一次跳了n-1级的台阶，剩下的台阶数就只有1级，显然就只有1种跳法，即*f(1) = 1*!
然后就知道f(2) = 2；这样就可以将所有未知转化为已知！

然后就有了：
```js
function jumpFloorII(n) {
  if (n === 1) {
    return 1;
  } else {
    return 2 * jumpFloorII(n - 1);
  }
}
```

# 正则表达式匹配

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

# 树的子结构


输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

<!-- more -->

例如:
给定的树 A:
```

     3
    / \
   4   5
  / \
 1   2
```
给定的树 B：
```
   4 
  /
 1
```
返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。

示例 1：

输入：A = [1,2,3], B = [3,1]
输出：false
示例 2：

输入：A = [3,4,5,1,2], B = [4,1]
输出：true
限制：

0 <= 节点个数 <= 10000

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/shu-de-zi-jie-gou-lcof

## 1.先序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * 解题思路：
 * 1.先序遍历找到与B根节点匹配的A子节点或A的根节点subA，找到后暂停
 * 2.比较从B和subA的根节点开始比较，B是不是subA的子树
 * 3.如果2判断不是，则重复1、2直到遍历完A
 * @param {TreeNode} A
 * @param {TreeNode} B
 * @return {boolean}
 */
var isSubStructure = function(A, B) {
  if (!B) return false;

  let isSub = false;
  preOrder(A);

  function preOrder(node) {
    if (!node) return '';
    if (node.val === B.val) {
      if (isSubOf(node, B)) {
        isSub = true;
        return;
      }
    }
    preOrder(node.left);
    preOrder(node.right);
  }

  function isSubOf(sup, sub) {
    if (!sub) return true;
    if (!sup || sup.val !== sub.val) {
      return false;
    }
    return isSubOf(sup.left, sub.left) && isSubOf(sup.right, sub.right);
  }

  return isSub;
};
```

# 顺时针打印矩阵

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

示例 1：

输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]
示例 2：

输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
输出：[1,2,3,4,8,12,11,10,9,5,6,7]
 

限制：

0 <= matrix.length <= 100
0 <= matrix[i].length <= 100
注意：本题与主站 54 题相同：https://leetcode-cn.com/problems/spiral-matrix/

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof


## 1.缩小边界直到越界

```js
/**
 * [
 *  [1, 2, 3, 4],
 *  [5, 6, 7, 8],
 *  [9,10,11,12]
 * ]
 * [
 *  [(0,0), (0,1), (0,2), (0,3)],
 *  [(1,0), (1,1), (1,2), (1,3)],
 *  [(2,0), (2,1), (2,2), (2,3)],
 * ]
 * 0.定义边界top, right, bottom, left. [top, bottom], [left, right]
 * 1.顺时针打印边界元素，每打印完一条边，将这条边的位置向中心步进1
 * 2.直到越界
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  if (!matrix.length) return []; 

  let top = 0;
  let right = matrix[0].length - 1;
  let bottom = matrix.length - 1;
  let left = 0;
  const res = [];

  while (true) {
    // 遍历上边界
    for (let i = left; i <= right; i++) {
      res.push(matrix[top][i])
    }
    if (++top > bottom) break;

    // 遍历右边界
    for (let i = top; i <= bottom; i++) {
      res.push(matrix[i][right]);
    }
    if (left > --right) break;

    // 遍历下边界
    for (let i = right; i >= left; i--) {
      res.push(matrix[bottom][i]);
    }
    if (top > --bottom) break;

    // 遍历左边界
    for (let i = bottom; i >= top; i--) {
      res.push(matrix[i][left]);
    }
    if (++left > right) break;
  }
  return res;
};
```

# 包含min函数的栈

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

示例:
```js
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.min();   --> 返回 -3.
minStack.pop();
minStack.top();   --> 返回 0.
minStack.min();   --> 返回 -2.
```

提示：

各函数的调用总次数不超过 20000 次
 

注意：本题与主站 155 题相同：https://leetcode-cn.com/problems/min-stack/

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/bao-han-minhan-shu-de-zhan-lcof

## 双栈实现最小栈

```js

/**
 * 双栈实现最小栈
 * 1._data保存数据 _data: 9, 10, 7, 11, 5
 * 2._min保存最小值 _min: 9, 7, 5
 * 
 * 3.每次push的时候，在push到_data同时，如果新值比_min的最小值（栈顶元素）小就入栈_min，否则不入_min
 * 4.在pop的时候_data出栈，如果出栈的元素和_min栈顶元素相等，那么_min也出栈，因为这个最小值已经失效
 * initialize your data structure here.
 */
var MinStack = function() {
  this._data = [];
  this._min = [];
};

/** 
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
  if (!this._min.length || x <= this._min[this._min.length - 1]) {
    this._min.push(x);
  }
  this._data.push(x);
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
  const tail = this._data[this._data.length - 1];
  if (tail === this._min[this._min.length - 1]) {
    this._min.pop();
  }
  return this._data.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
  const len = this._data.length;
  return this._data[len - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.min = function() {
  return this._min[this._min.length - 1];
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.min()
 */
```

# 栈的压入、弹出序列

输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如，序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列的弹出序列。

示例 1：

输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
输出：true
解释：我们可以按以下顺序执行：
push(1), push(2), push(3), push(4), pop() -> 4,
push(5), pop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1
示例 2：

输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
输出：false
解释：1 不能在 2 之前弹出。
 

提示：

0 <= pushed.length == popped.length <= 1000
0 <= pushed[i], popped[i] < 1000
pushed 是 popped 的排列。
注意：本题与主站 946 题相同：https://leetcode-cn.com/problems/validate-stack-sequences/

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/zhan-de-ya-ru-dan-chu-xu-lie-lcof

## 使用真实stack模拟

```js
/**
 * 使用真实stack模拟
 * 0.定义辅助栈stack
 * 1.持续按照pushed的顺序入栈stack，直到stack的栈顶元素与poped的栈底元素相同，
 * 2.则按照poped顺序出栈stack直到stack的栈顶元素不再与poped的栈低元素相同，然后重复1->2之道pushed的元素使用完
 * 3.如果poped不为空，则stack按照poped继续出栈，直到poped使用完返回true，否则返回false；
 * @param {number[]} pushed
 * @param {number[]} popped
 * @return {boolean}
 */
var validateStackSequences = validateStackSequences2;
function validateStackSequences1(pushed, popped) {
  const stack = [];
  let isValid = true;
  while (pushed.length || popped.length) {
    if (stack && stack[stack.length - 1] === popped[0]) {
      stack.pop();
      popped.shift();
    } else if (pushed.length) {
      stack.push(pushed.shift());
    }

    if (!pushed.length && stack[stack.length - 1] !== popped[0]) {
      isValid = false;
      break;
    }
  }
  return isValid;
};

function validateStackSequences2(pushed, popped) {
  const stack = [];
  let isValid = true;
  let i = 0;  // pushed idx
  let j = 0;  // poped idx
  while (i < pushed.length || j < popped.length) {
    if (stack && stack[stack.length - 1] === popped[j]) {
      stack.pop();
      j++;
    } else if (i < pushed.length) {
      stack.push(pushed[i]);
      i++;
    }

    if (i >= pushed.length && stack[stack.length - 1] !== popped[j]) {
      isValid = false;
      break;
    }
  }
  return isValid;
};
```

# 序列化二叉树

请实现两个函数，分别用来序列化和反序列化二叉树。


示例: 

你可以将以下二叉树：
```
    1
   / \
  2   3
     / \
    4   5
```

序列化为 "[1,2,3,null,null,4,5]"
注意：本题与主站 297 题相同：https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/

## 1.前序遍历

关键：
1. 将遍历的序列转化为字符串；
2. 保留空子节点（可以保存为‘null’），作为标识符来反序列化。

```js
/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
  if (!root) return '';
  const res = [];
  preOrder(root);
  function preOrder(node) {
    if (!node) return res.push('null');
    res.push(node.val);
    preOrder(node.left);
    preOrder(node.right);
  }
  return res.join();
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
  if (!data.length) return null;
  const arr = data.split(',');

  function buildTree(arr) {
    const val = arr.shift();
    if (val === 'null') return null;
    const node = new TreeNode(val);
    node.left = buildTree(arr);
    node.right = buildTree(arr);
    return node;
  }
  return buildTree(arr);
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
 function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
 }
```

# 字符串的排列

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

# 数组中出现次数超过一半的数字

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

# 数据流中的中位数


如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值。如果从数据流中读出偶数个数值，那么中位数就是所有数值排序之后中间两个数的平均值。


例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

void addNum(int num) - 从数据流中添加一个整数到数据结构中。
double findMedian() - 返回目前所有元素的中位数。
示例 1：

输入：
["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
[[],[1],[2],[],[3],[]]
输出：[null,null,null,1.50000,null,2.00000]
示例 2：

输入：
["MedianFinder","addNum","findMedian","addNum","findMedian"]
[[],[2],[],[3],[]]
输出：[null,null,2.00000,null,2.50000]
 

限制：

最多会对 addNum、findMedia进行 50000 次调用。
注意：本题与主站 295 题相同：https://leetcode-cn.com/problems/find-median-from-data-stream/

## 1.二分查找找插入位置

```js
/**
 * initialize your data structure here.
 */
var MedianFinder = function() {
  this._stack = [];
};

/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
  if (!this._stack.length) {
    this._stack.push(num);
    return ;
  }
  let left = 0;
  let right = this._stack.length;
  // [left, right)
  while (left < right) {
    let midIdx = left + Math.floor((right - left) / 2);
    if (num === this._stack[midIdx]) {
      right = midIdx;
      break;
    }
    if (num < this._stack[midIdx]) {
      right = midIdx;
    } else {
      left = midIdx + 1;
    }
  }

  this._stack.splice(right, 0, num);
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
  const len = this._stack.length;
  if (len & 1 === 1) {
    return this._stack[(len - 1) / 2];
  } else {
    const right = len / 2;
    return (this._stack[right-1] + this._stack[right]) / 2;
  }
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
```

# 把数字翻译成字符串

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

示例 1:

输入: 12258
输出: 5
解释: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"
 

提示：

0 <= num < 231

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/ba-shu-zi-fan-yi-cheng-zi-fu-chuan-lcof

## 1.深度优遍历

```js
/**
 * @param {number} num
 * @return {number}
 */
var translateNum1 = function(num) {
  let count = 0;
  dfs(num + '', 0);
  function dfs(str, start) {
    if (start >= str.length) return ++count;
    const num1 = +(str[start]);
    const num2 = +(str[start] + str[start+1]);
    
    dfs(str, start + 1);
    if (9 < num2 && num2 < 26) {
      dfs(str, start + 2);
    }
  }
  return count;
};
```

## 2.动态规划

```js
/**
 * dp[i]：长度为i字符串的翻译方法数
 * 最优子结构：dp[i-1]:最后单字符翻译，dp[i-2]：最后双字符翻译
 * 状态转移方程：dp[i] = isValid(s[i-1]+s[i-2]) ? dp[i-1] + dp[i-2] : dp[i-1]
 * @param {number} num
 * @return {number}
 */
var translateNum2 = function(num) {
  const str = '_' + num;
  // [0, pos)
  let dp1 = 1;
  let dp2 = 1;
  for (let i = 3; i <= str.length; i++) {
    let tmp = dp2;
    const num = str[i-2] + str[i - 1];
    if (9 < +num && +num < 26) {
      dp2 = dp2 + dp1;
    }
    dp1 = tmp;
  }
  return dp2;
};
```

## 3.动态规划（优化）

```js
/**
 * @param {number} num
 * @return {number}
 */
var translateNum3 = function(num) {
  const str = '_' + num;
  // [0, pos)
  let dp1 = 1;
  let dp2 = 1;
  for (let i = 2; i < str.length; i++) {
    let tmp = dp2;
    const num = str[i-1] + str[i];
    if (9 < +num && +num < 26) {
      dp2 = dp2 + dp1;
    }
    dp1 = tmp;
  }
  return dp2;
};
```

# 礼物的最大价值

在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

示例 1:

输入: 
```
[
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
```
输出: 12
解释: 路径 1→3→5→2→1 可以拿到最多价值的礼物
 

提示：
```
0 < grid.length <= 200
0 < grid[0].length <= 200
```
来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/li-wu-de-zui-da-jie-zhi-lcof

## 1.深度优先遍历（超时）

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxValue1 = function(grid) {
  let res = 0;
  const m = grid.length - 1;
  const n = grid[0].length - 1;

  dfs(grid, 0, 0, 0);

  function dfs(grid, i, j, count) {
    if (i > m || j > n) return;
    count += grid[i][j];
    if (i === m && j === n) {
      res = Math.max(res, count);
      return;
    }
    // to right
    dfs(grid, i, j + 1, count);
    // to bottom
    dfs(grid, i + 1, j, count);
  }

  return res;
}
```

## 2.动态规划

```js
/**
 * dp[i][j]：到达(i,j)位置的最大价值
 * 最优子结构：
 * 1.从上方移动一步到达，dp[i][j-1] + grid[i][j]
 * 2.从左边移动一步到达，dp[i-1][j] + grid[i][j]
 * 状态转移方程：dp[i][j] = Math.max(dp[i][j-1], dp[i-1][j]) + grid[i][j]
 * 边界：dp[0][0] = grid[0][0]
 * @param {number[][]} grid
 * @return {number}
 */
var maxValue2 = function(grid) {
  if (!grid.length) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let dp = new Array(m).fill();
  dp = dp.map(() => new Array(n).fill(0));
  dp[0][0] = grid[0][0];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const sub1 = i < 1 ? 0 : dp[i-1][j];
      const sub2 = j < 1 ? 0 :dp[i][j-1];
      dp[i][j] = Math.max(sub1, sub2) + grid[i][j]
    }
  }
  return dp[m-1][n-1];
};
```

# 最长不含重复字符的子字符串

请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

示例 1:

输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 

提示：

s.length <= 40000
注意：本题与主站 3 题相同：https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/zui-chang-bu-han-zhong-fu-zi-fu-de-zi-zi-fu-chuan-lcof


## 1.滑动窗口

```js
/**
 * 滑动窗口
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  let idx = 0;
  let window = '';
  let res = 0;

  while (1) {
    const char = s[idx];
    if (!window.includes(char) && idx < s.length) {
      window += char;
      idx++;
    } else {
      res = Math.max(res, window.length);
      if (idx >= s.length) break;
      window = window.slice(1);
    }
  }
  return res;
};
```

# 丑数

我们把只包含因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。

示例:

输入: n = 10
输出: 12
解释: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 是前 10 个丑数。
说明:  

1 是丑数。
n 不超过1690。
注意：本题与主站 264 题相同：https://leetcode-cn.com/problems/ugly-number-ii/

通过次数7,052提交次数11,250

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/chou-shu-lcof

## 1.动态规划

```js
/**
 * 动态规划
 * dp[i]: 第i个丑数
 * 最优子结构: 左前最靠近i的因子为2的丑数dp[a], 左前最靠近i的因子为3的丑数dp[b]，左前最靠近i的因子为5的丑数dp[c]
 * dp[i]是丑数，所以肯定是dp[c] * 2或dp[b] * 2或dp[c] * 5得到，当前是要找下一个丑数，所以肯定是取前三者最小之一
 * 状态转移方程：dp[i] = Math.min(dp[i-1] * 2, dp[i-1] * 3. dp[i-1] * 5)
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function(n) {
  let ugly1 = 1;
  let ugly2 = 1;
  let ugly3 = 1;
  let dp = [0, 1];
  let count = 2;
  while (count <= n) {
    let tmp1 = dp[ugly1] * 2;
    let tmp2 = dp[ugly2] * 3;
    let tmp3 = dp[ugly3] * 5;
    dp[count] = Math.min(tmp1, tmp2, tmp3);
    if (dp[count] === tmp1) ugly1++;
    if (dp[count] === tmp2) ugly2++;
    if (dp[count] === tmp3) ugly3++;
    count++;
  }
  return dp[n];
};
```

# 第一个只出现一次的字符

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

# 数组中的逆序对

在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。

示例 1:

输入: [7,5,6,4]
输出: 5
 

限制：

0 <= 数组长度 <= 50000


来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/shu-zu-zhong-de-ni-xu-dui-lcof

## 1.暴力双迭代（超时）

```js
/**
 * 暴力双迭代，时间复杂度O(n^2)
 * @param {number[]} nums
 * @return {number}
 */
var reversePairs1 = function(nums) {
  if (nums.length < 2) return 0;
  let count = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) {
        count++;
      }
    }
  }
  return count;
};
```

## 2.归并排序

```js
/**
 * 在使用归并排序时，拆分的过程是不会打乱数组，
 * 使用归并排序成左小右大的时，会先将拆分出的两个数组中小的一个进入临时数组
 * 在添加左数组进入临时数组时，假如在此前右数组已经添加了一部分元素进临时数组，说明这些元素是
 * 比当前要添加临时数组的左数组元素要小，又因为这些元素在右数组中，说明这些元素在原数组中是在当前左元素后面的，
 * 换言之，这些元素可以与当前左数组元素可以构成逆序对，那么会构成多少个呢？
 * 只需要统计一下目前右数组已经添加了多少个元素到临时数组就好！
 * @param {number[]} nums
 * @return {number}
 */
var reversePairs2 = function(nums) {
  if (nums.length < 2) return 0; 
  let count = 0;;
  // [left, right]
  function mergeSort(numArr, left, right) {

    if (right - left === 0) {
      return [numArr[left]];
    }
    const mid = left + Math.floor((right - left) / 2);
    const leftArr = mergeSort(numArr, left, mid);
    const rightArr = mergeSort(numArr, mid + 1, right);
    return merge(leftArr, rightArr);
  }
  function merge(leftArr, rightArr) {
    let tmp = [];
    let lIdx = 0;
    let rIdx = 0;
    while (lIdx < leftArr.length && rIdx < rightArr.length) {
      // 注意这里要加上等号
      // 因为相同的值不算逆序对，没有等号时，就是将right中的元素添加到tmp中，rIdx就会步进，
      // 相当于相同值也算进了逆序对
      if (leftArr[lIdx] <= rightArr[rIdx]) {
        tmp.push(leftArr[lIdx]);
        lIdx++;
        count += rIdx
      } else {
        tmp.push(rightArr[rIdx]);
        rIdx++;
      }
    }

    while (lIdx < leftArr.length) {
      tmp.push(leftArr[lIdx]);
      lIdx++;
      count += rIdx;
    }

    while (rIdx < rightArr.length) {
      tmp.push(rightArr[rIdx]);
      rIdx++;
    }

    return tmp;
  }

  mergeSort(nums, 0, nums.length - 1);
  return count;
}
```

# 两个链表的第一个公共节点


输入两个链表，找出它们的第一个公共节点。

如下面的两个链表：

![](./leetcode-algorithm-test/160_statement.png)

在节点 c1 开始相交。

<!-- more -->

 

示例 1：

![img](./leetcode-algorithm-test/160_example_1.png)

输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
输出：Reference of the node with value = 8
输入解释：相交节点的值为 8 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。


示例 2：

![img](./leetcode-algorithm-test/160_example_2.png)

输入：intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：Reference of the node with value = 2
输入解释：相交节点的值为 2 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [0,9,1,2,4]，链表 B 为 [3,2,4]。在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。


示例 3：

![img](./leetcode-algorithm-test/160_example_3.png)

输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null
输入解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
解释：这两个链表不相交，因此返回 null。


注意：

如果两个链表没有交点，返回 null.
在返回结果后，两个链表仍须保持原有的结构。
可假定整个链表结构中没有循环。
程序尽量满足 O(n) 时间复杂度，且仅用 O(1) 内存。
本题与主站 160 题相同：https://leetcode-cn.com/problems/intersection-of-two-linked-lists/

## 计算长短链表差值

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * 1.遍历headA, headB，分别计算长度countA, countB
 * 2.根据countA, countB判断长链表long和短链表short，相差长度k
 * 3.让long先步进k步，然后long和short一起步进，直到long.next和short.next相等就break, long或short就是公共节点
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
  if (!headA || !headB) return null;
  if (headA === headB) return headA;
  let curA = headA;
  let curB = headB;
  let countA = 0;
  let countB = 0;  
  // 计算A链表和B链表的长度
  while (curA.next || curB.next) {
    if (curA.next) {
      countA++;
      curA = curA.next;
    }
    if (curB.next) {
      countB++;
      curB = curB.next;
    }
  }
  if (curA !== curB) return null;

  let long;
  let short;
  let k;
  if (countB > countA) {
    long = headB;
    short = headA;
    k = countB - countA;
  } else {
    long = headA;
    short = headB;
    k = countA - countB;
  }
  while (long) {
    long = long.next;
    if (k) {
      k--;
    } else {
      short = short.next;
    }
    if (long === short) break;
  }
  return long;
};
```

# II. 0～n-1中缺失的数字

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

# II. 平衡二叉树

输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过1，那么它就是一棵平衡二叉树。

示例 1:

给定二叉树 [3,9,20,null,null,15,7]
```
    3
   / \
  9  20
    /  \
   15   7
```
返回 true 。

示例 2:

给定二叉树 [1,2,2,3,3,null,null,4,4]
```
       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
```
返回 false 。

 

限制：

1 <= 树的结点个数 <= 10000
注意：本题与主站 110 题相同：https://leetcode-cn.com/problems/balanced-binary-tree/

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/ping-heng-er-cha-shu-lcof

## 1.深度优先遍历（后序）

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * 深度优先（后序递归遍历）计算左右子树的深度
 * 判断左右子树深度差是否超过1
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced1 = function(root) {
  let res = true;
  dfs(root);
  function dfs(node) {
    if (!node) return 0;
    const lDeep = dfs(node.left) + 1;
    const rDeep = dfs(node.right) + 1;
    if (Math.abs(lDeep - rDeep) > 1) {
      res = false;
    }
    return Math.max(lDeep, rDeep);
  }
  return res;
};

var isBalanced = isBalanced1;
```

# II. 数组中数字出现的次数 II

在一个数组 nums 中除一个数字只出现一次之外，其他数字都出现了三次。请找出那个只出现一次的数字。

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

# II. 和为s的连续正数序列

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

# I. 翻转单词顺序

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

# II. 左旋转字符串

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

# I. 滑动窗口的最大值

给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。

示例:

输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 
解释: 
```
  滑动窗口的位置                 最大值
---------------               -------
[
  1  3  -1] -3  5  3  6  7       3
  1 [3  -1  -3] 5  3  6  7       3
  1  3 [-1  -3  5] 3  6  7       5
  1  3  -1 [-3  5  3] 6  7       5
  1  3  -1  -3 [5  3  6] 7       6
  1  3  -1  -3  5 [3  6  7       7
]
```

提示：

你可以假设 k 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof


## 暴力法
```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  if (!nums.length) return [];
  let left = 0;
  let right = k - 1;
  const res = [];
  while (right < nums.length) {
    // [left, right]
    let max = -Infinity;
    for (let i = left; i <= right; i++) {
      max = Math.max(max, nums[i]);
    }
    res.push(max);
    left++;
    right++;
  }
  return res;
};
```

## 双端队列
```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  if (!nums.length) return [];
  const res= [];
  let curMaxNumIdx;
  const deQueue = new DeQueue(nums, k);

  curMaxNumIdx = deQueue.getLeftHead();
  res.push(nums[curMaxNumIdx]);

  for (let i = k; i < nums.length; i++) {
    deQueue.push(i);
    curMaxNumIdx = deQueue.getLeftHead();
    res.push(nums[curMaxNumIdx]);
  }
  return res;
}

/**
 * 维护一个队列，成员是nums中元素的idx，并且这些idx都是当前
 * 并且这些idx都是在滑动中
 */
function DeQueue(nums, k) {
  this._queue = [];
  this._nums = nums;
  this._k = k;
  this._init();
}

DeQueue.prototype.push = function(idx) {
  this._clean(idx);
  this._queue.push(idx);
}

DeQueue.prototype.getLeftHead = function() {
  return this._queue[0];
}

DeQueue.prototype._init = function() {
  for (let i = 0; i < this._k; i++) {
    this.push(i);
  }
}

DeQueue.prototype._clean = function(idx) {
  const queueLen = this._queue.length;
  const leftHead = this._queue[0];
  const minValidIdx = idx + 1 - this._k;
  // 队列为空，不需要清理无用元素
  if (!queueLen) return;

  // ps: 每次调用_clean只会调用一次
  // 当前滑动窗口中index的取值范围是：[minValidIdx, idx]
  // 如果deQueue的中的元素已经不再取值范围内就已经无用，出队清理掉
  if (leftHead < minValidIdx) {
    this._queue.shift();
  }

  // PS: 调用多次更新序列
  // 背景：nums[idx]将会进入deQueue，现在这里的逻辑是在入队新元素前的整理工作
  // deQueue中的元素要求是：一个由大到小的有序列
  // 如果队尾（队列中最小）元素指向的nums的真实值比nums[idx]还小，那就没用，要清理掉
  let rightHead = this._queue[this._queue.length - 1];
  while (this._queue.length && this._nums[idx] >= this._nums[rightHead]) {
    this._queue.pop();
    rightHead = this._queue[this._queue.length - 1];
  }
}
```

# II. 队列的最大值

请定义一个队列并实现函数 max_value 得到队列里的最大值，要求函数max_value、push_back 和 pop_front 的均摊时间复杂度都是O(1)。

若队列为空，pop_front 和 max_value 需要返回 -1

示例 1：

输入: 
["MaxQueue","push_back","push_back","max_value","pop_front","max_value"]
[[],[1],[2],[],[],[]]
输出: [null,null,null,2,1,2]
示例 2：

输入: 
["MaxQueue","pop_front","max_value"]
[[],[],[]]
输出: [null,-1,-1]
 

限制：

1 <= push_back,pop_front,max_value的总操作数 <= 10000
1 <= value <= 10^5

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/dui-lie-de-zui-da-zhi-lcof

## 辅助双端队列

```js
/**
 * 辅助双端队列
 * 1._data队列正常对数据进行入队出队
 * 2._max是一个双端队列。每次_data入队元素，_max如下操作：
 * 2.1 当_max空，如对元素
 * 2.2 当_max非空，新数据value从右侧入队，入队前需要将右侧所有比value小的从右侧出队再入队。
 * 为什么？为了位置一个左到右递减的数列，这样才能维持_max每次从左侧出队的都是最大元素
 * 3.当出队_data元素value时，若_max的队头元素与value相等，则也出队_max的队头。为什么？因为value已经出队无效了
 */
var MaxQueue = function() {
  this._data = [];
  this._max = [];
};

/**
 * @return {number}
 */
MaxQueue.prototype.max_value = function() {
  if (!this._max.length) return -1;
  return this._max[0];
};

/** 
 * @param {number} value
 * @return {void}
 */
MaxQueue.prototype.push_back = function(value) {
  this._data.push(value);
  while (this._max.length && value > this._max[this._max.length-1]) {
    this._max.pop();
  }
  this._max.push(value);

};

/**
 * @return {number}
 */
MaxQueue.prototype.pop_front = function() {
  if (!this._data.length) return -1;
  const head = this._data.shift();
  if (head === this._max[0]) {
    this._max.shift();
  }
  return head;
};

/**
 * Your MaxQueue object will be instantiated and called as such:
 * var obj = new MaxQueue()
 * var param_1 = obj.max_value()
 * obj.push_back(value)
 * var param_3 = obj.pop_front()
 */
```

# n个骰子的点数

把n个骰子扔在地上，所有骰子朝上一面的点数之和为s。输入n，打印出s的所有可能的值出现的概率。

你需要用一个浮点数数组返回答案，其中第 i 个元素代表这 n 个骰子所能掷出的点数集合中第 i 小的那个的概率。

示例 1:

输入: 1
输出: [0.16667,0.16667,0.16667,0.16667,0.16667,0.16667]
示例 2:

输入: 2
输出: [0.02778,0.05556,0.08333,0.11111,0.13889,0.16667,0.13889,0.11111,0.08333,0.05556,0.02778]
 

限制：

1 <= n <= 11

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/nge-tou-zi-de-dian-shu-lcof

## 1.动态规划穷举

```js
/**
 * 状态：dp[n][i]:掷出第n个骰子，总点数是i的所有次数
 * 最优子结构：每枚骰子6个点数，dp[n][i]的次数可以由 dp[n-1][i-1] + 1或dp[n-1][i-2] + 2或...或dp[n-1][i-6] + 6构成
 * 状态转移方程：dp[n][i] = sum(dp[n-1][i-j]), 1 <= j <= 6
 * @param {number} n
 * @return {number[]}
 */
var twoSum = twoSumDp2;
function twoSumDp1(n) {
  let dp = new Array(n + 1).fill();
  dp = dp.map(() => new Array(7).fill(0));
  for (let i = 1; i <=  6; i++) {
    dp[1][i] = 1;
  }

  dpCount(n);
  const res = [];
  const all = Math.pow(6, n);
  for (let i = n; i <= n * 6; i++) {
    if (!dp[n][i]) continue;
    const tmp = dp[n][i] / all;
    res.push(tmp);
  }
  function dpCount(n) {
    for (let i = 2; i <= n; i++) {
      for (let j = i; j <= i * 6; j++) {
        dp[i][j] = 0;
        for (let num = 1; num <= 6; num++) {
          if (j - num <= 0) break;
          const sub = dp[i - 1][j - num] || 0;
          dp[i][j] += sub;
        }
      }
    } 
  }
  return res;
};
```

## 2.优化动态规划

使用一个长度是2的二维数值存储dp元素，因为计算`dp[i][j]`只是依赖`dp[i - 1][j - num]`

```js
function twoSumDp2(n) {
  const dp = [[0, 1, 1, 1, 1, 1, 1], []];

  dpCount(n);
  const res = [];
  const all = Math.pow(6, n);
  for (let i = n; i <= n * 6; i++) {
    res.push(dp[0][i] / all);
  }
  function dpCount(n) {
    for (let i = 2; i <= n; i++) {
      for (let j = i; j <= i * 6; j++) {
        dp[1][j] = 0;
        for (let num = 1; num <= 6; num++) {
          if (j - num <= 0) break;
          dp[1][j] += dp[0][j - num] || 0;
        }
      }
      dp[0] = dp[1];
      dp[1] = [];
    } 
  }
  return res;
};
```

# 扑克牌中的顺子

从扑克牌中随机抽5张牌，判断是不是一个顺子，即这5张牌是不是连续的。2～10为数字本身，A为1，J为11，Q为12，K为13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

示例 1:

输入: [1,2,3,4,5]
输出: True
 

示例 2:

输入: [0,0,1,2,5]
输出: True
 

限制：

数组长度为 5 

数组的数取值为 [0, 13] .

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/bu-ke-pai-zhong-de-shun-zi-lcof

## 1.找最大最小值

```js
/**
 * 1.连续序列的特点：max - min + 1 = 序列长度，由于0可以变化，所以max - min + 1 <- 序列长度
 * 2.如果存在重复，则不是顺子
 * @param {number[]} nums
 * @return {boolean}
 */
var isStraight = function(nums) {
  let min = 14
  let max = -1;
  const repeated = [];
  for (let i = 0; i < nums.length; i++) {
    if (!nums[i]) continue; 
    min = Math.min(min, nums[i]);
    max = Math.max(max, nums[i]);
    if (!repeated.includes(nums[i])) {
      repeated.push(nums[i]);
    } else {
      return false;
    }
  }
  if (max - min + 1 > 5) return false;
  return true;
};
```

# 圆圈中最后剩下的数字

0,1,,n-1这n个数字排成一个圆圈，从数字0开始，每次从这个圆圈里删除第m个数字。求出这个圆圈里剩下的最后一个数字。

例如，0、1、2、3、4这5个数字组成一个圆圈，从数字0开始每次删除第3个数字，则删除的前4个数字依次是2、0、4、1，因此最后剩下的数字是3。

示例 1：

输入: n = 5, m = 3
输出: 3
示例 2：

输入: n = 10, m = 17
输出: 2


限制：

1 <= n <= 10^5
1 <= m <= 10^6

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof

## 1.暴力模拟（超时）

```js
/**
 * @param {number} n
 * @param {number} m
 * @return {number}
 */
var lastRemaining = lastRemaining2;
function lastRemaining1(n, m) {
  let idx = 0;
  let num = 0;
  let count = 0;
  let getIdx = (idx) => idx % n;
  const record = {};
  while (1) {
    if (!record[num]) idx++;
    // console.log(num, idx, record)
    if (!record[num] && idx > 0 && idx % m === 0) {
      count++;
      // console.log({count, n})
      record[num] = true;
      if (count >= n) return num;
      idx = 0;
    }
    num = getIdx(num + 1);
  }
};
```

## 2.约瑟夫自杀环

![2020-04-16_17-00](./leetcode-algorithm-test/2020-04-16_17-00.png)

```js
/**
 * f(x)：最后输出的序号
 * f(n, m) = (f(n - 1, m) + m)
 * @param {number} n
 * @param {number} m
 * @return {number}
 */
function lastRemaining2(n, m) {
  function josephus(n, m) {
    if (n === 1) return 0;
    return (josephus(n - 1, m) + m) % n;
  }
  return josephus(n, m);
}
```

## 3.迭代优化约瑟夫问题

避免使用递归栈空间

```js
function lastRemaining3(n, m) {
  let res = 0
  for (let i = 2; i <= n; i++) {
    res = (res + m) % i;
  }
  return res;
}
```

# 把字符串转换成整数

写一个函数 StrToInt，实现把字符串转换成整数这个功能。不能使用 atoi 或者其他类似的库函数。

首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。

当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。

该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。

注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。

在任何情况下，若函数不能进行有效的转换时，请返回 0。

说明：

假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−231,  231 − 1]。如果数值超过这个范围，请返回  INT_MAX (231 − 1) 或 INT_MIN (−231) 。

示例 1:

输入: "42"
输出: 42
示例 2:

输入: "   -42"
输出: -42
解释: 第一个非空白字符为 '-', 它是一个负号。
     我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。
示例 3:

输入: "4193 with words"
输出: 4193
解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。
示例 4:

输入: "words and 987"
输出: 0
解释: 第一个非空字符是 'w', 但它不是数字或正、负号。
     因此无法执行有效的转换。
示例 5:

输入: "-91283472332"
输出: -2147483648
解释: 数字 "-91283472332" 超过 32 位有符号整数范围。 
     因此返回 INT_MIN (−231) 。
 

注意：本题与主站 8 题相同：https://leetcode-cn.com/problems/string-to-integer-atoi/

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/ba-zi-fu-chuan-zhuan-huan-cheng-zheng-shu-lcof

## 1.正则表达式

```js
/**
 * @param {string} str
 * @return {number}
 */
var strToInt1 = function(str) {
  const matched = str.match(/^\s*([-|+]?\d+).*$/);
  if (!matched) return 0; 
  let num = +matched[1];
  const max = Math.pow(2, 31) - 1;
  const min = Math.pow(-2, 31);
  if (num > max) return max;
  if (num < min) return min;

  return num;
};
```

## 2.线性遍历

```js
/**
 * @param {string} str
 * @return {number}
 */
var strToInt2 = function(str) {
  let sign;
  let res = '';
  const max = Math.pow(2, 31) - 1;
  const min = Math.pow(-2, 31);

  for (let i = 0; i < str.length; i++) {
    if (sign) {
      if ('0' <= str[i] && str[i] <= '9') {
        res += str[i];
      } else {
        break;
      }
    } else {
      if (str[i] === ' ') continue;
      if ('0' <= str[i] && str[i] <= '9') {
        sign = '+';
        res += str[i];
      } else if (['+', '-'].includes(str[i])) {
        sign = str[i];
      } else {
        return 0;
      }
    }
  }
  res = sign === '-' ? -res : res;
  if (res > max) return max;
  if (res < min) return min;

  return res;
};
```

# 全排列

给定一个 没有重复 数字的序列，返回其所有可能的全排列。

示例:

输入: [1,2,3]
输出:
```
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/permutations

## 1.深度优先（比较隐含的回溯）

由于传入下一层调用栈的参数都是新值，不会影响当前栈所以不用显式地回溯

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute1 = function(nums) {
  // [left, right]
  const res = [];
  dfs(nums, []);

  function dfs(nums, visited) {
    if (nums.length === 1) {
      visited.push(nums[0]);
      res.push(visited);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      dfs([...nums.slice(0, i), ...nums.slice(i + 1)], [nums[i], ...visited]);
    }
  }
  return res;
};
```

## 2.显式的回溯

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute2 = function(nums) {
  // [left, right]
  const res = [];
  dfs(nums, [], {}, res);

  function dfs(nums, path, visited, res) {
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (!visited[i]) {
        visited[i] = true;
        path.push(nums[i]);
        dfs(nums, path, visited, res);
        visited[i] = false;
        path.pop();
      }
    }
  }
  return res;
};
```

