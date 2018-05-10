- node服务一旦挂载，就会一直存在于运行内存中，生命周期在停止服务前都会一直存在；

- node的中间件挂载后，如何出发和路径有关

  ```js
  apiRouteApp.prefix('/api');
  apiRouteApp.use(userAuth({ redirect: '/signin', whitelist: [] }));
  apiRouteApp.use(sequelize.middleware(''));
  apiRouters.forEach((route) => {
    apiRouteApp.use(route.routes());
  });
  ```

  比如说，以上的两个中间件就只有是`/api/*`的时候才会触发