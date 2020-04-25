# 面试题37. 序列化二叉树
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