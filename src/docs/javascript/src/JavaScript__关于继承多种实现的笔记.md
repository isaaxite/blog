# JavaScript__关于继承多种实现的笔记

### 原型链继承

**先说原型链继承的问题：包含引用类型属性的原型（不想被共享的引用属性）会变成共享。**
```
function SuperType(name){
    this.name = name;
    this.type = 'color';
    this.colors = ['yellow', 'white'];
}
SuperType.prototype.sayType = function() {
  console.log(this.type);
};
SuperType.prototype.sayName = function() {
  console.log(this.name);
};


function SubType(name){
	this.name = name;
}
SubType.prototype = new SuperType(this.name);

var ins1 = new SubType();
ins1.colors.push('red');
console.log(ins1.colors);  //'yellow', 'white', 'red'

var ins2 = new SubType('issac');
console.log(ins2.colors);  //'yellow', 'white', 'red'
ins2.sayType();
ins2.sayName();
```

![](http://upload-images.jianshu.io/upload_images/2838289-0ef782193b536392.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**根据超类，colors应该为每个实例独有、不共享的，但由上面的代码可见，由于原型链继承后，colors变成了共享的属性**
>造成此结果的原因是：以SuperType的实例作为了prototype，而每个对象实例都只是指向这个prototype，因此每个实例拥有的colors实际都是同一个colors，换言之ins1.colors和ins2.colors存放都是同一个指针。

  **原型链继承的问题：无法保证“私有”引用类型继续“私有”**

---
 
### 借调构造函数继承

**为解决原型链本应为实例独有的引用属性变成共享属性的问题，提出借调构造函数继承**
```
function SuperType(name){
    this.name = name;
    this.colors = ['yellow', 'white'];
}
SuperType.prototype.sayName = function(){
	console.log(this.name);
}

function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
}

var sub = new SubType('issac', 18);
sub.sayName();
```
![](http://upload-images.jianshu.io/upload_images/2838289-1925f395a7a67071.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>借调构造函数解决上面提出了的问题，而且接受参数更加的方便

  **构造函数自身的老问题：**
>由于构造函数会将它的把内容创建在一个新的作用域内赋给实例，因此，同样功能的方法就会为每个实例新建一份。这样本应共有的方法一旦多起来，创建的对象实例一旦多起来，就会造成很大冗余，这就是方法无法复用的问题。而且你也看到了，假如父类是使用组合式创建对象（组合原型式和构造函数式），子类是无法继承父类的原型的，因此上面 `sub.sayName();` 才会抛出异常，因为subType中确实没有这个方法。

---
 
### 组合继承

>由上面两种继承的方式可以看出： **原型链继承** 不能保证“私有”引用属性继续“私有”，但是 **借调构造函数** 可以；**借调构造函数继承** 不可以复用方法，但 **原型链继承** 可以。那么可以组合两种方式的长处，使用 **原型链继承** 继承共享属性和方法，使用 **借调构造函数** 继承“私有”属性。

 
```
function SuperType(name){
    this.name = name;
    this.colors = ['yellow', 'white'];
}
SuperType.prototype.sayName = function(){
    console.log(this.name);
}
function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
}
SubType.prototype = new SuperType();
//公用方法和属性要定义后将父对象的实例赋值给SubType对象之后，不然会因为重写prototype而被“抹去”
SubType.prototype.constructor = SuperType;
SubType.prototype.sayAge = function(){
    console.log(this.age);
}
var ins1 = new SubType('a', 18);
ins1.colors.push('red');
console.log(ins1.colors);  //'yellow', 'white', 'red'
var ins2 = new SubType('b', 18);
console.log(ins2.colors);  //'yellow', 'white'
```
>**要理解组合继承是怎么工作的，要先知道一件事：js会先执行prototype的代码，再执行构造函数的代码。**
首先是执行 **SubType.prototype = new SuperType();** 这句相当于给SubType的原型对象创建了
```
//以下是涉及的主要部分
{
    name: undefined,
    colors: ['yellow', 'white'],
    [[prototype]]: SuperType.prototype  //包含了SuperType的公有方法和属性
}
```
然后在新建SubType对象实例 **var ins1 = new SubType('a', 18);**的时候调用构造函数，相当于给ins1对象创建“私有”属性： 
```
//这里我不太会表达下面属性是ins1独有的属性，姑且如下面这样写，但愿不会误导人
var name = 'a';
var age = 18;
var colors = ['yellow', 'white'];
```
这些属性会屏蔽原型对象的同名属性，从而达到“私有”。

---

 
### 原型式继承

通过封装一个函数来作为继承的媒介
```
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
var person = {
    name: "issac",
    friends: ['frank', 'Aye'],
};
var anthorPerson = object(person);
anthorPerson.name = 'Annd';
anthorPerson.friends.push('Dda');
```
在ES5中添加Object.create()方法规范了这种继承，这个方法接受两个参数，一个是原型对象，第二个是需要新增的属性会方法[可选]
```
var person = {
    name: "issac",
    friends: ['frank', 'Aye'],
};
var anthorPerson = Object.create(person);
anthorPerson.name = 'Annd';
anthorPerson.friends.push('Dda');
var yetPerson = Object.create(person, {
    name: {
      value: 'issac'
    }
});
```
**Object.create()仅在IE9+支持，特别指出IE其他的浏览器就不说了**

___
 
### 寄生式继承

>寄生式继承是和原型式继承紧密相关的思路。

```
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}

function createAnthor(o){
    var clone = object(o);
    clone.sayHi = function(){
        console.log('Hi Issac');
    }
}
var person = {
    name: "issac",
    friends: ['frank', 'Aye'],
};
var anthorPerson = createAnthor(person);
anthorPerson.sayHi();  //Hi Issac
```
**寄生的精髓即在原有对象上进行扩展**

---
### 寄生组合式继承

>在说组合继承的时候，已经说过超类是会被调用两次，“私有”属性的继承即通过对象实例的属性对原型对象的屏蔽，显然，原型对象中的“私有”属性是多余了。为解决中多余，提出了 **寄生组合式继承**

```
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
function inheritPrototype(subType, superType){
    var prototype = object(superType.prototype);
    prototype.constructor = superType;
    subType.prototype = prototype;
}
function SuperType(name){
    this.name = name;
    this.colors = ['yellow', 'white'];
    console.log(Math.round(Math.random()*10));  //打印一个0~10的随机数
}
SuperType.prototype.sayName = function(){
    console.log(this.name);
}
function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
}
//继承
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function(){
    console.log(this.age);
}
var ins1 = new SubType('issac1', 18);
ins1.colors.push('red');
console.log(ins1.colors);
```
>![以上代码的执行结果](http://upload-images.jianshu.io/upload_images/2838289-4d9d8877c8ca347b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**显然，使用寄生组合式继承仅仅调用了一次超类。
使用组合继承，会调用2次超类：
第一次，以超类的实例作为子类的原型对象（原型链式继承）；
第二次，创建子类的对象实例时调用子类构造函数，子类构造函数，通过借调构造函数继承调用超类的构造函数；
 
寄生组合式继承是抹去上面说的第一次调用超类。它是通过直接将超类的原型对象赋值给子类的原型对象，然后子类在此基础上进行个扩充，这样就会不会触发到超类的构造函数。**
