# 面试题30. 包含min函数的栈

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