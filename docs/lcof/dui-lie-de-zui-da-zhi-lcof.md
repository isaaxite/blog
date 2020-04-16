# 面试题59 - II. 队列的最大值

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