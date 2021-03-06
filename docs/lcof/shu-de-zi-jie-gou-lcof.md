# 面试题26. 树的子结构

输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

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