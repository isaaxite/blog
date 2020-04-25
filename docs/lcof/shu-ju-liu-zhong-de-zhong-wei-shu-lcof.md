# 面试题41. 数据流中的中位数

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