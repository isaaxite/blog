遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。



创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

调用指针对象的`next`方法，可以将指针指向数据结构的下一个成员。



`Symbol.iterator`是一个预定义好的`Symbol`类型的特殊值



原生具备 Iterator 接口的数据结构如下。

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象



iterator的数据结构

```typescript
interface Iterable {
  [Symbol.iterator]() : Iterator,
}

interface Iterator {
  next(value?: any) : IterationResult,
}

interface IterationResult {
  value: any,
  done: boolean,
}
```





依赖`[Symbol.iterator]`迭代器生成函数的接口有：

	- `for...of`
	- `Array.from()`
	- `Map()`, `Set()`, `WeakMap()`, `WeakSet`
	- `Promise.all`
	- `Promise.race`
	- 解构符：`...`
	- 扩展符：`...`
	- `yield*`