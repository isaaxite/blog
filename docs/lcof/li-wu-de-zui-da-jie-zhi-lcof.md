# 面试题47. 礼物的最大价值

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

0 < grid.length <= 200
0 < grid[0].length <= 200

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
