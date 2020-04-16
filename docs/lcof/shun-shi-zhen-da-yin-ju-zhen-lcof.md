# 面试题29. 顺时针打印矩阵

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