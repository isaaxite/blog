# webpack的rules的两种写法

## 前言
在配置webpack的时候在，在网上经常会搜到一下两种配置方式：
- 逐个配置loader
![image](https://user-images.githubusercontent.com/25907273/32641451-9d685aa8-c593-11e7-826b-958f9a5c102c.png)

- 一次性配置多个loader
![image](https://user-images.githubusercontent.com/25907273/32641544-231347bc-c594-11e7-8afb-bfe5e8dc523c.png)

## 混合配置loader
罕有两个混在一起的写法，就算你想也是不知道要怎么写。

还是说大家没有这样的需求，然而并不是，我就有（难道我是奇葩！？）
比如上面的scss的配置，我想编译玩后还要压缩css文件，那怎么写，下面是我在网上找到的答案（当然还有其他的，然后我选择了这个）：
```javascript
{
  loader: 'css-loader',
  options: {
    minimize: true
  }
}
```
然后我看着上面的scss配置一脸懵逼，难道我要帮上面的scss的配置拆开来写？！
但是拆开要怎么写，然后我想，能不能混在一起写：
```javascript
{
  test:   /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
    use: [{
      loader: 'css-loader',
      options: {
        minimize: true // css压缩
      }
    }, 'postcss-loader', 'sass-loader']
  })
}
```
编译果然可以，这些写应该也是大有人在，不是我第一个，只是我比较倒霉，没有找到！另外我也看到别人说用`postcss` + `cssnano`可以达到相同的压缩效果，另外也有人推荐使用[optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)


