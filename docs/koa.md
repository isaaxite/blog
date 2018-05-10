### 前言

关于url访问：`http://localhost:8888/api/test/users`所触发yibot_web的koa逻辑

### 01：用户验证

```js
apiRouteApp.use(userAuth({ redirect: '/signin', whitelist: [] }));
```

userAuth中间件校验用户（koa1的每个路由都是一个generator），中间件文件位置：`app/middlewares/userAuth.js`

根据用户用户传过来的email或重cookie中获取的email去数据库获取用户数据，以此进行用户身份校验

```js
user = yield model.User.findOne({ where: { email } });
if (!user) { throw new Error('Authorization Failure: No User Found'); }
```



### 02：检验用户是否拥有与其businessId对应的business数据 ，并建立business数据库链接

- 检验

    ```js
    const setting = require('../setting/basic');
    const headerName = setting.bizHeader;
    const businessId = ctx.headers[headerName];
    // 判断当前用户是否拥有与businessId对应的业务
    // user的数据是在userAuth中间件的时候已经挂到了上下文中(this)
    // 根据BusinessId和userId
    const o = yield models.BusinessUser.findOne({ where: { BusinessId: businessId, UserId: this.user.id } });
    if (!o) {
        ctx.error(errCode.sequelize.code, `You don't have access to business(${businessId}), Please connect business admin`);
        return;
    }
    ```

- 建立数据库链接

  先判断连接池中是都存在与businessId对应的数据库链接，有则直接使用。
  ```js
  const Connection = localRequire('database/business');
  
  let b;
  try {
  	const bizId = businessId & 65535;
  	const companyId = businessId >> 16;
  	// 判断用户是否存在与之businessId对应的业务数据库
   	// 同时也是根据businessId去数据库获取改用业务数据库的详细信息 
  	b = yield models.Business.findOne({ where: { bizId, companyId: companyId } });
  	if (!b) { throw new Error('Sequelize Matching failure'); }
  } catch (e) {
  	ctx.error(errCode.sequelize.code, e.message || errCode.sequelize.text);
  	return;
  }
  // 根据获取回来的业务数据的相关信息建立对应的业务数据库链接
  // 将新建的数据库连接放到连接池
  // 并将当前数据库连接挂载到当前上下文
  ctx.Model = connections[businessId] = new Connection(b.dbIp, b.dbName, b.dbUser, b.dbPassword, b.dbPort);
  ```

