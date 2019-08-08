用Element.hasAttribute()来检测是否包含某未显式声明的属性，只会返回fasle，尽管是在js设定该属性后也是如此。

## 实验
```html
<input type="text" name="name">
<button>check</button>
```

```javascript
var $input = document.querySelector("input");
var isValue = function(){
    return $input.hasAttribute('value');
};

var setInputVal = function() {
  $input.value = "i am isaac_宝华";
};

document.querySelector("button")
.addEventListener('click', function(){
  console.log("hasAttribute: " + isValue());
  setInputVal();
  console.log("hasAttribute: " + isValue());
}, false);
```
init output
![image](https://user-images.githubusercontent.com/25907273/35482140-d430e868-046b-11e8-8f38-7d89602ea558.png)

after check click
![image](https://user-images.githubusercontent.com/25907273/35482142-e3b100a2-046b-11e8-90cf-d95e7aee785d.png)

![image](https://user-images.githubusercontent.com/25907273/35482145-f282d75e-046b-11e8-8b6e-cc138ac499bf.png)

当在input中显式声明value属性后，再点击check button
```html
<input type="text" name="name" value="">
```

![image](https://user-images.githubusercontent.com/25907273/35482167-3f80e3ac-046c-11e8-846c-c4e79a191e1c.png)



