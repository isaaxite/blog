# 前言

目前项目中使用Typescript，得益于Typescript的类型检测，使得参数的类型校验有更加好的实现！希望在进入接口核心逻辑前，对请求接口的参数进行校验。这个校验可以大致分为两种：

1. 类型的校验；
2. 参数合理性校验。

最初，打算的实现方式是在接口的逻辑中最前面的位置加上校验的逻辑。


DTO是什么？

> 数据传输对象（DTO)(Data Transfer Object)，是一种设计模式之间传输数据的软件应用系统。数据传输目标往往是数据访问对象从数据库中检索数据。数据传输对象与数据交互对象或数据访问对象之间的差异是一个以不具有任何行为除了存储和检索的数据（访问和存取器）(DTO)[https://www.cnblogs.com/loveis715/p/4379656.html]

前置准备

1. class-validator;
2. class-transform;

一个（贫血的）DTO的书写：分类编辑接口的dto

```typescript
export class EditCategortDto {
  id: number;

  name: string;

  parent?: number | null;

  faqType?: string | number;
}
```

这个接口在被调用时

```typescript
export class EditCategortDto {

  @IsInt({ message: '分类标签id必须是大于0的自然数' })
  @Min(1, { message: '分类标签id必须是大于0的自然数' })
  @IsNotEmpty({ message: '分类标签id不能为空' })
  id: number;

  @IsNotEmpty({ message: '新标签名不能为空' })
  name: string;

  parent?: number | null;

  @ValidateIf((req) => typeof req.faqType !== 'undefined')
  @IsIn(
    Object.values(FAQ_TYPE).filter((it) => !Number.isNaN(+it)),
    { message: '非法的faqType' },
  )
  @Transform((val) => Number(val))
  faqType?: string | number;
}
```

## 前言

为了方便内容说明，假设现在要处理一个修改分类接口，它是个post请求，接收的参数为：

```typescript
export class EditCategortDto {
  // 不为空，大于0的正整数
  id: number;

  // 不能为空,
  name: string;

  // 允许不传，但存在则必须是大于等于0的自然数，且parent不能等于id
  parent?: number | null;

  // 允许不传，存在则必须是整数或整数的字符串，且type只可以是[0,1,2,3]的其中之一
  type?: string | number;
}

export default class CategoryController extends Controller {
  async edit(body: EditCategortDto) {
    // 处理逻辑
  }
}
```

接下来就基于这个例子对其参数有效性进行校验！

&nbsp;

## 以往对参数有效的校验

以往我的写法是另外写一个校验的方法，比如：

```typescript
export default class CategoryController extends Controller {
  /**
   * 
   * */
  async edit(body: EditCategortDto) {
    // 参数校验
    if (!this.isValidParams(body)) {
      throw new Error('illegal parameter');
    }
    // 处理逻辑
  }

  /**
   * 校验编辑分类接口的请求参数
   * @param {EditCategortDto} body
   * */
  private isValidParams(body: EditCategortDto): boolean {
    const TYPES = [0, 1, 2, 3];
    const { id, name, parent, type } = body;
    const isInt = (val) => typeof val === 'number' && Math.ceil(val) === Math.floor(val);
    const isId = (id) => isInt(id) && id > 0; 

    const isValidId = id && isId(id);
    if (!isValidId) { return false; }

    const isValidName = name && typeof name === 'string';
    if (isValidName) { return false; }

    if (typeof patent !== 'undefined') {
      const isValidParent = isInt(parent) && parent >= 0 && parent !== id;
      if (!isValidParent) { return false; }
    }

    if (typeof type !== 'undefined') {
      if (isNaN(type)) { return false; }
      const formatedType = +type;
      const isValidType = isInt(formatedType) && TYPES.includes(formatedType);
      if (!isValidType) { return false; }
    }

    return true;
  }
}
```


## class-validator装饰对参数有效性的校验


```typescript
import {IsNotEmpty, IsString, IsNumber, ValidateIf, IsInt, Min, IsIn} from 'class-validator';

// 自定义的validator
export function NotEqualDtoAtrr(compareProperty: string, validationOptions?: ValidationOptions) {
  return (object: LooseObject, propertyName: string) => {
    registerDecorator({
      name: 'NotEqualDtoAtrr',
      target: object.constructor,
      propertyName,
      constraints: [compareProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value !== args.object[compareProperty];
        },
      },
    });
  };
}

export class EditCategortDto {

  @IsInt({ message: '分类标签id必须是大于0的自然数' })
  @Min(1, { message: '分类标签id必须是大于0的自然数' })
  @IsNotEmpty({ message: '分类标签id不能为空' })
  id: number;

  @IsNotEmpty({ message: '新标签名不能为空' })
  @IsString({ message: '分类名必须是字符串' })
  name: string;

  @ValidateIf((req) => typeof req.parent !== 'undefined' || req.parent === 0)
  @NotEqualDtoAtrr('id', { message: '父分类标签不能与子分类标签id相同' })
  @IsInt({ message: '分类标签id必须是大于0的自然数' })
  @Min(1, { message: '分类标签id必须是大于0的自然数' })
  parent?: number;

  @ValidateIf((req) => typeof req.faqType !== 'undefined')
  @IsIn(TYPES, { message: '非法的faqType' })
  @Transform((val) => Number(val))
  faqType?: string | number;
}
```

上面我们使用`class-validator`自带的校验的装饰器和一个自定的校验的装饰器对`EditCategortDto`的成员属性定义了校验规则，注意，只是定义了每个属性对应的校验的规则，并没有做校验！

接下来就是要使用这些校验的规则校验请求数据！

1. 将请求传送过来的参数，格式化成DTO类的实例
   1. 请求的参数
   2. DTO类型，怎么拿？