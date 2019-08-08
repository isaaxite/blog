### 前言
关于js的继承之前也写过，现在回去再看看书，又想写一下。

### 使用原型链实现继承
**注意：不要和“原型式继承”搞混**
基本原理：用超类的实例作为子类的基础原型对象(prototype)，然后在此基础继续实现子类的原型对象(prototype)

```javascript
function SuperType() {
  this.superProperty = 'super_property';
  this.superArray = [0, 1, 2, 3];
}

function SubType() {
  this.subProperty = 'sub_property';
}
SubType.prototype = new SuperType();
SubType.prototype.getSuperProperty = function() {
  return this.superProperty;
};

var sub = new SubType();
cosole.log(sub.getSuperProperty());	// super_property
```
继承是继承了，但是问题还是有：
- 仅仅用原型链实现继承，无法向超类传递参数；
- 原本超类中的实例属性（仅为每个实例所有，相互独立），使用原型链实现继承后，在子类的实例中变成了对象属性（共享）
```javascript
var sub1 = new SubType();
var sub2 = new SubType();

sub1.superArray.push(4);
console.log(sub1.superArray);	// [0, 1, 2, 3, 4]
console.log(sub2.superArray);	// [0, 1, 2, 3, 4]
```
----------------------------------------------------------------------------------------------------

### 借调构造函数（经典继承）
基本原理：借用超类构造函数，在子类构造函数里面直接调用超类构造函数，并将当前this绑定到超类的构造函数中。
绑定的话，可以使用apply和call
```javascript
function SuperType(superTypeName) {
  this.superTypeName = superTypeName;
  this.superProperty = 'super_property';
  this.superArray = [0, 1, 2, 3];
}

function SubType(subTypeName, superTypeName) {
  SuperType.call(this, superTypeName);
  this.subTypeName = subTypeName;
  this.subProperty = 'sub_property';
}

SubType.prototype.getSuperTypeName = function() {
  return this.superTypeName;
};

var sub = new SubType("subType", "superType");
console.log(sub.getSuperTypeName());	// super_property

var sub1 = new SubType("subType", "superType");
var sub2 = new SubType("subType", "issac");
sub1.superArray.push(4);
console.log(sub1.superArray);	// [0, 1, 2, 3, 4]
console.log(sub2.superArray);	// [0, 1, 2, 3]
console.log(sub1.getSuperTypeName());	// superType
console.log(sub2.getSuperTypeName());	// issac
```
虽然使用“借调构造函数”的方式实现继承，解决了“无法向超类传参”和“污染超类实例属性”的的问题，但是自身也是存在问题：
- 子类对超类的原型属性/方法不在可见
加入在超类中添加如下原型方法：
```javascript
SuperType.prototype.getSuperTypeProperty = function() {
  return this.superProperty;
};
```
然后使用子类的实例调用该方法就会抛出异常：
```javascript
console.log(sub.getSuperTypeProperty());  // throw error
```
如果只能这样的话，继承就不算继承，顶多算是在子类的构造函数里面调用了个普通的函数，一言蔽之，无用。

---------------------------------------------------------------------------------------------------

### 组合继承（伪经典继承）
基本原理：混合原型式继承和借调构造函数继承。
既然“原型链”可以继承原型属性/方法，“借调构造函数”可以继承实例属性，可以向超类传参。那就各取所需，互补长短。
```javascript
function SuperType(superTypeName) {
  this.superTypeName = superTypeName;
  this.superProperty = 'super_property';
  this.superArray = [0, 1, 2, 3];
}
SuperType.prototype.getSuperTypeProperty = function() {
  return this.superProperty;
};

function SubType(subTypeName, superTypeName) {
  // 借调超类构造函数，继承实例属性，并向超类传参   
  SuperType.call(this, superTypeName);
  this.subTypeName = subTypeName;
  this.subProperty = 'sub_property';
}

SubType.prototype = new SuperType();
SubType.prototype.getSuperTypeName = function() {
  return this.superTypeName;
};

// 原型链继承超类方法
var sub = new SubType("subType", "superType");
console.log(sub.getSuperTypeName());	// super_property
console.log(sub.getSuperTypeProperty());	// super_property


var sub1 = new SubType("subType", "superType");
var sub2 = new SubType("subType", "issac");
sub1.superArray.push(4);
console.log(sub1.superArray);	// [0, 1, 2, 3, 4]
console.log(sub2.superArray);	// [0, 1, 2, 3]
console.log(sub1.getSuperTypeName());	// superType
console.log(sub2.getSuperTypeName());	// issac
```
如此，在“借调构造函数”的说明中执行`console.log(sub.getSuperTypeProperty());`也也不会抛出异常了。
