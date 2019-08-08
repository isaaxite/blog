# 前言
以前用jQuery的时候，获取序列化form表单数据很简单`$("form").serialize()`或者`$("form").serializeArray()`就好，用vue，数据双向绑定，获取表单的数据也很容易。那么原生的js怎么获取？怎么有效地用js检验表单组件？

# 来自《高程》表单序列化
```javascript
function serialize(form){
  var len = form.elements.length;
  var field = null;
  var parts = [];
  var opLen, opValue;

  for(var i = 0;i < len; i++){
    field = form.elements[i];

    switch(field.type){
      case "select-one":
      case "select-multiple":
        if(field.name.length){
          for(var j = 0, opLen = filed.options.length; j < opLen; j++) {
            option = field.options[j];
            if(option.selected) {
              opValue = option.value ? option.value : option.text;

              parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(opValue));
            }
          }
        }
        break;

      case undefined:
      case "file":
      case "submit":
      case "reset":
      case "button":
        break;
      case "radio":
      case "checkbox":
        if(!field.checked){ break; }
      default:
        if(field.name.length){
          parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
        }
    }
  }
  return parts.join("&");
}
```
也不能看懂，以上的`serialize`函数，核心就是`form.elements`这个数组，遍历他就好。

但是，上面只是序列化了表单数据，要检验表单数据就有点麻烦了。
个人觉得返回一个对象更容易检验，并且如果使用ajax提交表单的话，也没有必要序列化表单，直接以对象的形式提交就好。

**以下对《高程》代码做的基础修改**
```javascript
...
// 将parts从数组改成对象
var parts = {};

...
case "select-multiple":
 ...
 parts[field.name] = opValue; 

...
default:
  if(field.name.length){
    parts[field.name] = opValue; 
  }

...
// 修改 return parts.join("&");
return parts;
```
修改了哪里自行脑补。

# formData实现
关于FormData的详细说明我不累述，自行mdn：[FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
FormData的实现是我自行意淫出来的，并没有经过太多的实践验证，主要是使用了FormData的`entries()`方法。
>The FormData.entries() 方法返回一个 iterator对象 ，此对象可以遍历访问FormData中的键值对。其中键值对的key是一个 USVString 对象；value是一个 USVString , 或者 Blob对象。

```javascript
function serialize(form){
  var data = {};
  var formData = new FormData(form);
  for(var item of formData.entries()) {
    var key = item[0];
    var val = item[1];
    data[key] = val;
  }
  
  return data;
}
```
用处有多大呢，我选择保留意见，权当抛砖引玉。

# Zepto序列化表单的实现
[#111 Zepto: serialize源码浅析](https://github.com/issaxite/issaxite.github.io/issues/111)
