```js
function getPost(callback) {
  setTimeout(() => {
    callback && callback('isaac');
  }, 5000);
}
// async路由守卫钩子无效
async beforeRouteEnter(to, from, next) {
  await getPost();
  next();
},
// 使用回调的方式，路由守卫钩子起效
beforeRouteEnter(to, from, next) {
  getPost(() => next());
},
```
