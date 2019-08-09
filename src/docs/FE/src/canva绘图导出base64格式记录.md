# canva绘图导出base64格式记录

## 前言
- canvas绘图流程，canvas绘图->转成base64格式->插入img标签；
- pc端调试工具：微信开发者工具
- 移动端：无特别说明即为，iphone6，系统版本：10.3.2

## 记录1
绘制完成，使用对象函数`toDataURL`转成`base64 `格式，在微信调试工具表现正常；在移动端没有成功插入img标签。

## 记录2
推测因为图片跨域问题。
测试：注释说有图片绘制。
结果：
- pc端无问题；
- 移动端依然无法导出。

修正：
- 移动端刷新几次后出现canvas图像，（缓存导致）。
修成结果：移动端可以导出。

## 记录3
推测是图片跨域引起；
测试：在用Image对象预加载图片时设定`crossOrigin`属性，
```javascript
img.crossOrigin = 'Anonymous'; //解决跨域
```
结果无效，并跑出异常：
![](https://user-images.githubusercontent.com/25907273/32412931-3702a30c-c1cb-11e7-9208-eed326cc02fc.png)


## 记录4
测试：注释，
```javascript
img.crossOrigin = 'Anonymous'; //解决跨域
```
测试，依然不行。将图片放在本地，使用相同域名，
结果：
- pc端，可以；
- 移动端，可以。

## 记录5
测试`img.crossOrigin`属性，观测设置`img.crossOrigin`属性后的报错信息，
![image](https://user-images.githubusercontent.com/25907273/32415670-e6a694da-c202-11e7-9be2-d4377bd5c942.png)
二维码的t图片出现跨域。
- 设置`crossOrigin`，取消预加载、绘制二维码。
结果：
- pc端，可以；
- 移动端，可以。

测试`crossOrigin`解决跨域的效果
- 取消设置`crossOrigin`属性
结果：
pc端，可以
移动端，预加载完成，但是图片绘制没有成功。

小结：`crossOrigin`属性一定程度上可以解决跨域，单遇到某些图片则会在预加载时抛出异常`has been blocked by CORS policy`

## 记录6
测试：取消设置`crossOrigin`属性。
结果：
- pc端，预加载没有报跨域异常，绘图成功；
- 移动端，预加载没有报跨域异常，绘图失败；

## 记录7
测试，在预加载图片时不设置`crossOrigin`，`drawImage`前设置`crossOrigin`。
结果：
- pc端，预加载可以；绘图，可以；
- 移动端，预加载可以；绘图，失败。

## 记录8
测试：由于二维码资源在设置`crossOrigin`属性后出现跨域，因此尝试更换二维码资源；
资源1：http://tool.kd128.com/qrcode?text=https%3A%2F%2Fwww.kd128.com
资源2：http://qr.liantu.com/api.php?&w=200&text=http://baidu.com
资源3：http://qrcode.devincloud.cn/qrcode?text=987343423&w=200

结果（pc）：
资源1：
![image](https://user-images.githubusercontent.com/25907273/32416061-a04b6500-c208-11e7-94c6-8b68eb34914b.png)

资源2：
![image](https://user-images.githubusercontent.com/25907273/32416042-728b6aac-c208-11e7-8369-0c68f873b8dd.png)

资源3：通过，没有抛异常

## 记录9
测试：在nginx（我们用nginx）设置反向代理，比如现在二维码资源出现跨域，那么就设置反向代理指向该二维码资源的域名:
- 二维码的链接
```
https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHc7zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyUnotZjRGeWRhYlUxMWxlME5xMW8AAgQpDQBaAwQsAQAA
```
- nginx反向代理配置
```
// nginx 
location /qrcode/ {
  proxy_pass https://mp.weixin.qq.com/;
}
```
然后直接如此访问：
```javascript
let img = new Image();
img.src = '/qrcode/cgi-bin/showqrcode?ticket=gQHc7zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyUnotZjRGeWRhYlUxMWxlME5xMW8AAgQpDQBaAwQsAQAA'
```
结果：
pc端：预加载可以，绘图可以；
移动端：预加载可以，绘图可以。


