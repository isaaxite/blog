---
title: 浅析Nest如何实现装饰器的路由注册
date: 2019-10-09 13:35:25
tags:
- Nest
- 源码分析
categories:
- Nest
- 源码分析

---

在`nest`中你可以看到使用装饰器实现路由路径。

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }
}
```

<!-- more -->

主要就是由`Controller`和其他`http-method`装饰器。而实际的路由路径是：

全局前缀（可选） + Controller装饰器的文本参数（可选） + http-method装饰器文本参数（可选）

# 存储路径数据

## Controller前缀的保存

```typescript
export function Controller(
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator {
  const defaultPath = '/';
  const [path, scopeOptions] = isUndefined(prefixOrOptions)
    ? [defaultPath, undefined]
    : isString(prefixOrOptions)
    ? [prefixOrOptions, undefined]
    : [prefixOrOptions.path || defaultPath, { scope: prefixOrOptions.scope }];

  return (target: object) => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
  };
}
```

在`Controller`装饰器工厂中，首先是获取了path, scopeOptions，然后返回了一个装饰器函数。这个函数主要是保存工厂函数的参数。
这里用到了[`Reflect`](https://github.com/rbuckton/reflect-metadata)，是一个用来存取元数据的库，数据结构主要是Map和WeakMap。

```typescript
Reflect.defineMetadata(PATH_METADATA, path, target);
```
将path这个数据`WeakMap/target/PATH_METADATA`中。所以取的时候也需要`target`, `PATH_METADATA`。


## http-method前缀的保存

```typescript

const defaultMetadata = {
  [PATH_METADATA]: '/',
  [METHOD_METADATA]: RequestMethod.GET /* GET: 0 */,
};

export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
  const pathMetadata = metadata[PATH_METADATA];
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;

  return (target, key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    return descriptor;
  };
};

const createMappingDecorator = (method: RequestMethod) => (
  path?: string | string[],
): MethodDecorator => {
  return RequestMapping({
    [PATH_METADATA]: path,
    [METHOD_METADATA]: method,
  });
};

export const Get = createMappingDecorator(RequestMethod.GET);
```

上面以`@Get()`装饰器的实现为例。和`@Controller`的实现大同小异，最终都是将工厂函数的参数使用`Reflect`保存起来，

```typescript
Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
```
分别将请求方法和路径保存了起来。

这里就有个问题：为什么要先保存这些路由数据，而不是直接使用？

首先，装饰器实际发挥作用的阶段是紧接着类声明之后，立即就执行装饰器函数。而业务逻辑是在访问路由之后才会被触发。


## 小结

- 使用Reflect存放元数据，Reflect由一个外部库[reflect-metadata](https://github.com/rbuckton/reflect-metadata)实现；
- target(类的引用，也可以说是构造函数)/PATH_METADATA存放`Controller`部分的路径数据；
- descriptor.value（成员方法的引用，即方法本身）/PATH_METADATA存放，存放剩余的http-method部分的路径数据；


# 组合路由的路径数据

下面我们来看nest怎么组合分散的路由路径`path`

```typescript
public async registerRouter() {
  await this.registerMiddleware(this.httpAdapter);

  const prefix = this.config.getGlobalPrefix();
  const basePath = validatePath(prefix);
  this.routesResolver.resolve(this.httpAdapter, basePath);
}
```
这个方法中，获取全局前缀，得到路径的最开头部分：
```typescript
path = [
  this.config.getGlobalPrefix() // 全局前缀
].join('');  
```


```typescript
public resolve<T extends HttpServer>(applicationRef: T, basePath: string) {
  const modules = this.container.getModules();
  modules.forEach(({ controllers, metatype }, moduleName) => {
    let path = metatype
      ? Reflect.getMetadata(MODULE_PATH, metatype)
      : undefined;
    path = path ? basePath + path : basePath;
    this.registerRouters(controllers, moduleName, path, applicationRef);
  });
}
```
这里组合模块部分的路径:
```typescript
path = [
  this.config.getGlobalPrefix(),
  Reflect.getMetadata(MODULE_PATH, metatype)  // 模块部分的前缀
].join('');
```


```typescript
// 获取Controller的路径

public registerRouters(
  routes: Map<string, InstanceWrapper<Controller>>,
  moduleName: string,
  basePath: string,
  applicationRef: HttpServer,
) {
  routes.forEach(instanceWrapper => {
    const { metatype } = instanceWrapper;
    const path = this.routerBuilder.extractRouterPath(
      metatype as Type<any>,
      basePath,
    );
    const controllerName = metatype.name;

    this.logger.log(CONTROLLER_MAPPING_MESSAGE(controllerName, path));
    this.routerBuilder.explore(
      instanceWrapper,
      moduleName,
      applicationRef,
      path,
    );
  });
}

public extractRouterPath(
  metatype: Type<Controller>,
  prefix?: string,
): string {
  let path = Reflect.getMetadata(PATH_METADATA, metatype);
  if (prefix) path = prefix + this.validateRoutePath(path);
  return this.validateRoutePath(path);
}
```

组合`Controller`部分的路由数据：
```typescript
path = [
  this.config.getGlobalPrefix(),
  Reflect.getMetadata(MODULE_PATH, metatype),
  Reflect.getMetadata(PATH_METADATA, metatype)  // Controller`部分的路由数据
].join('');
```

```typescript
public explore<T extends HttpServer = any>(
  instanceWrapper: InstanceWrapper,
  module: string,
  applicationRef: T,
  basePath: string,
) {
  const { instance } = instanceWrapper;
  const routerPaths = this.scanForPaths(instance);
  this.applyPathsToRouterProxy(
    applicationRef,
    routerPaths,
    instanceWrapper,
    module,
    basePath,
  );
}

public scanForPaths(
  instance: Controller,
  prototype?: any,
): RoutePathProperties[] {
  const instancePrototype = isUndefined(prototype)
    ? Object.getPrototypeOf(instance)
    : prototype;
  return this.metadataScanner.scanFromPrototype<
    Controller,
    RoutePathProperties
  >(instance, instancePrototype, method =>
    this.exploreMethodMetadata(instance, instancePrototype, method),
  );
}

public exploreMethodMetadata(
  instance: Controller,
  instancePrototype: any,
  methodName: string,
): RoutePathProperties {
  const targetCallback = instancePrototype[methodName];
  const routePath = Reflect.getMetadata(PATH_METADATA, targetCallback);
  if (isUndefined(routePath)) {
    return null;
  }
  const requestMethod: RequestMethod = Reflect.getMetadata(
    METHOD_METADATA,
    targetCallback,
  );
  const path = isString(routePath)
    ? [this.validateRoutePath(routePath)]
    : routePath.map(p => this.validateRoutePath(p));
  return {
    path,
    requestMethod,
    targetCallback,
    methodName,
  };
}
```

最后是剩余的http-method部分路由数据
```typescript
path = [
  this.config.getGlobalPrefix(),
  Reflect.getMetadata(MODULE_PATH, metatype),
  Reflect.getMetadata(PATH_METADATA, metatype),
  Reflect.getMetadata(PATH_METADATA, targetCallback)  // http-method部分路由数据
].join('');
```

## 小结

- Controller和http-method装饰工厂存储的路径数据在注册路由的时候被访问并组合成完成路径；

