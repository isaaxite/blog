# typeorm：使用事务

#### 用法一
自动开启，回滚，释放事务。触发回滚只需要在回调函数内部抛出错误。在回调函数内部进行数据库操作只能通过回调参数`transactionalEntityManager `实现，灵活性有限。
```typescript
import {getManager} from "typeorm";

await getManager().transaction(async transactionalEntityManager => {
    await transactionalEntityManager.save(users);
    await transactionalEntityManager.save(photos);
    // ...
});
```

#### 用法二
手动开启，回滚，释放事务。没有用法的限制，但是不要忘了释放事务！
```typescript
import {getConnection} from "typeorm";

// get a connection and create a new query runner
const connection = getConnection();
const queryRunner = connection.createQueryRunner();

// establish real database connection using our new query runner
await queryRunner.connect();

// now we can execute any queries on a query runner, for example:
await queryRunner.query("SELECT * FROM users");

// we can also access entity manager that works with connection created by a query runner:
const users = await queryRunner.manager.find(User);

// lets now open a new transaction:
await queryRunner.startTransaction();

try {

    // execute some operations on this transaction:
    await queryRunner.manager.save(user1);
    await queryRunner.manager.save(user2);
    await queryRunner.manager.save(photos);

    // commit transaction now:
    await queryRunner.commitTransaction();

} catch (err) {

    // since we have errors lets rollback changes we made
    await queryRunner.rollbackTransaction();

} finally {

    // you need to release query runner which is manually created:
    await queryRunner.release();
}
```
