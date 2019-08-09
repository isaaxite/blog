# 使用Image对象加载微信头像出现跨域

## 前言
![](https://user-images.githubusercontent.com/25907273/32407846-cf986c24-c15c-11e7-9284-9c4ed27bf796.png)

```javascript
const portrait = 'http://wx.qlogo.cn/mmopen/9BeQibiaUkTQXKTFFTR5Bia5ichGAbuLKbRXq9njQJCx84Nlcfj0kSamrzfj9MxFCmvoJopejE6lic1MwJJRwpF5kXxqraE3TQmXw/0',
let img = new Image();
img.src = portrait;
img.crossOrigin = 'Anonymous'; //解决跨域 
```

在注释
```javascript
img.crossOrigin = 'Anonymous'; //解决跨域 
```
后问题解决

