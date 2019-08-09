# 使用{}_import引入模块下的export写法

## 前言
[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)上有很详细的各种import的写法，其中一种是：
```javascript
// 引入单个模块
import { router } from './utils';
// 或引入多个模块
import { router, preload } from './utils';
```
## export写法

久疏未用，误以为以上import引入方式的前提（export的写法）是对象形式：
```
export default {
  router() {
    // ...
  },
  preload() {
    // ...
  }
}
```

但其实并非如此，正确的写法应该是每个模块都需要用`export`导出一次：
```javascript
// utils.js
export function router() {
  // ...
}
export function preload() {
  // ...
}
```
