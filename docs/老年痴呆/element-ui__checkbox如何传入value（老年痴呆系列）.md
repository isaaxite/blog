## 前言

element-ui，以前粗略看过，但是并没有实际应用在项目，毕竟以前更多是开发移动端。最近，开始做pc端的cms，不得不接触它，但其实我更喜欢自己在轮子，而不是拿来就用。虽然我内心抗拒，但是杂兵并无说不的权利。

首先踩坑的是checkbox组件。element-ui的示例是这样的：
```vue
<template>
  <el-checkbox-group 
    v-model="checkedCities1"
    :min="1"
    :max="2">
    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
  </el-checkbox-group>
</template>
<script>
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    data() {
      return {
        checkedCities1: ['上海', '北京'],
        cities: cityOptions
      };
    }
  };
</script>
```

这段示例，我关注带两个点：
- cityOptions是一个一维数组；
- `<el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>` 中的 `:label`，下意识认为这是传一个字符串label；

然后，从api获取回来的数据大概是这样子的：
```js
const apiData = [
  { label: '上海', value: 1 }, 
  { label: '北京', value: 2 },
  { label: '广州', value: 3 },
  { label: '深圳', value: 4 }
]
```
很明显，这样的格式要求的是：看见的是label，选中的是value。此时此刻，我是在问候element-ui的(我知道此时此刻你也一定认为我是傻逼)。

更迷的是element-ui的文档：
![image](https://user-images.githubusercontent.com/25907273/40578748-26eca12c-614c-11e8-887f-b2e46b6828f1.png)

竟然没有传入value的属性！what?!

## 自以为是的做法

以上述为背景，我需要从apiData中生成一个labels的数组，并且构建一个label与value的映射关系(或者直接使用element-ui返回的selected，遍历这个selected数组，与apiData的label逐个比对，返回对应的value)。那么就开始撸起袖子乱来吧！
- html
```html
<template>
  <el-checkbox-group v-model="checkedCities" @change="changeEvent">
    <el-checkbox v-for="label in labels" :label="label" :key="label">{{label}}</el-checkbox>
  </el-checkbox-group>
  
  <br>
  <label for="">selected:</label>
  <pre>{{ selectedJson }}</pre>
</template>
```
- javascript
```js
const cityOptions = [
  { label: '上海', value: 1 }, 
  { label: '北京', value: 2 },
  { label: '广州', value: 3 },
  { label: '深圳', value: 4 }
];

var Main = {
  beforeMount() {
    this.createMapping(this.cities);
    console.log(this.mapping);
  },
  data() {
    return {
      checkedCities: ['北京'],
      mapping: { label: {}, value: {} },
      cities: cityOptions,
      selectedJson: "{ label: {\"北京\"}, values: { 2 } }"
    };
  },
  computed: {
    labels() {
    	return this.cities.map(city => city.label);
    }
  },
  methods: {
    getVAlues(labels) {
    	const mapping = this.mapping.label;
    	return labels.map(label => mapping[label]);
    },
    createMapping(data) {
      let mapping = this.mapping;
      
      data.forEach(datum => {
      	mapping.label[datum.label] = datum.value;
      	mapping.value[datum.value] = datum.label;
      });
      
      return mapping;
    },
    changeEvent(labels) {
      const values = this.getVAlues(labels);
      this.selectedJson = JSON.stringify({ labels, values });
    }
  },
};
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
```
[传送门](https://jsfiddle.net/issaxite/uLavz7kh/1/)
![](http://ohi69gup6.bkt.clouddn.com/1.gif)

## 真实简单的做法
其实多留意下这一句代码，就应该可以嗅出尿性：
```vue
<el-checkbox v-for="label in labels" :label="label" :key="label">{{label}}</el-checkbox>
```
为什么`:label`传入的是label，而`{{label}}`也是传入label，到底那个是真实显示的，猪也可以猜到是`{{label}}`，那么`:label`是干嘛的？难道就是传说中的input-value！！！

实践是检验自己是不是傻逼的唯一方法~

- html
```html
<template>
  <el-checkbox-group v-model="checkedCities1" @change="changeEvent">
    <el-checkbox v-for="city in cities" :label="city.value" :key="city.label">{{city.label}}</el-checkbox>
  </el-checkbox-group>
  
  <p>selected: {{ selected }}</p> 
</template>
```

```javascript
const cityOptions = [
  { label: '上海', value: 1 }, 
  { label: '北京', value: 2 },
  { label: '广州', value: 3 },
  { label: '深圳', value: 4 }
];
  var Main = {
    data() {
      return {
      	selected: "[1, 2]",
        checkedCities1: [1, 2],
        cities: cityOptions
      };
    },
    methods: {
      changeEvent(val) {
      	this.selected = JSON.stringify(val);
      }
    }
  };
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
```
[传送门](https://jsfiddle.net/issaxite/zn1k1zLn/2/)
![](http://ohi69gup6.bkt.clouddn.com/2.gif)

## 最后说一句
element-ui为什么要写成`:label`，写`:value`不好吗？！真tm垃圾~

真香！
