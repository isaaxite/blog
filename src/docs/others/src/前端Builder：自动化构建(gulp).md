# 前端Builder：自动化构建(gulp)

#### 前端自动化构建的目标：
- 开发环境：
1.编译html、Less/Sass(Exp: Less)、js;
2.实时刷新浏览器(文件变动，触发刷新浏览器事件)；
- 生产环境
1.编译、压缩html；
2.编译、压缩Less/Sass(Less为例子)；
3.编译、压缩js；

#### 搭建环境
- 安装nodejs
下载链接：http://nodejs.cn/download/
安装完，在terminal，node -v 测试安装成功否。
- packjson
```
npm init  //初始化packjson文件
```
>![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-bd1ca352df7d4d0f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 安装关键道具gulp
```
npm install -g gulp --save-dev  //save-dev：包名保存到packjson中
```
- 需要用到的包
>作用如变量名
>![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-fe93bb7fb0317229.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  ```
npm install -g browser-sync --save-dev  //全局安装
npm install -g gulp-less gulp-rename gulp-htmlmin --save-dev 
npm install -g gulp-minify-css gulp-uglify gulp-notify --save-dev
```
- 新建gulpfile.js
不是太懂gulp语法，看官网文档：http://www.gulpjs.com.cn/docs/api/

  >填一下项目结构：
>![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-f3af59a70c6a340a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
>PS: dist是打包目录，一开始是空目录


```js
//填一下gulpfile文件自己体会
var gulp 		= require('gulp'),
	less 		= require('gulp-less'),				//编译less
	rename 		= require('gulp-rename'),	
	minHtml		= require('gulp-htmlmin'),	
	minCss 		= require('gulp-minify-css'),
	minJs 		= require('gulp-uglify'),
	notify		= require('gulp-notify'),			//消息提醒
	browserSync	= require('browser-sync').create(),	//实时刷新浏览器
	reload 		= browserSync.reload;

var PRE = pre_suffix = 'less';
var root = {
	htmlRoot: './dist/',
	src: {
		html: 'src/html/',
		js: 'src/js/',
		precss: function(sender){ return 'src/'+PRE+'/'+sender+'.'+pre_suffix; }
	},
	dist: {
		html: 'dist/',
		css: 'dist/css/',
		js: 'dist/js/'
	}
}

// 生产环境
gulp.task('html', function(){
	var options = {
		collapseWhitespace:true,
		collapseBooleanAttributes:true,
		removeComments:true,
		removeEmptyAttributes:true,
		removeScriptTypeAttributes:true,
		removeStyleLinkTypeAttributes:true,
		minifyJS:true,
		minifyCSS:true
	};
	return gulp.src(root.src.html+'/*.html').
	pipe(minHtml(options))
	.pipe(gulp.dest(root.dist.html))
});
gulp.task('precss', function(){
	return gulp.src('src/less/*.less')
	.pipe(less())
	.pipe(minCss())
	.pipe(gulp.dest('dist/css'))
});
gulp.task('js', function(){
	return gulp.src('src/js/*.js')
	.pipe(minJs())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('dist/js'))
});
gulp.task('build', ['html', 'precss' ,'js']);


// 开发环境
gulp.task('html:dev', function(){
	return gulp.src(root.src.html+'/*.html')
	.pipe(gulp.dest(root.dist.html))
	.pipe(reload({stream: true}))

});
gulp.task('html-watch:dev', ['html:dev'], browserSync.reload);

gulp.task('precss:dev', function(){
	return gulp.src(root.src.precss('/*'))
	.pipe(less())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(root.dist.css))
	.pipe(browserSync.reload({stream: true}))
});
gulp.task('js:dev', function(){
	return gulp.src(root.src.js+'/*.js')
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(root.dist.js))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('dev', ['html:dev', 'precss:dev' ,'js:dev'], function(){
	browserSync.init({
		server: { baseDir: root.htmlRoot }
	});
	gulp.watch(root.src.html+'/*.html', ['html:dev']);
	gulp.watch(root.src.js+'/*.js', ['js:dev']);
	gulp.watch([root.src.precss('/*'), root.src.precss('/*/*')], ['precss:dev']);
});
```

- 使用命令启动任务
```
//在terminal，cd到当前目录下
gulp dev  //开发环境
gulp build  //生产环境
```

- [可选]将命令保存到npm 脚本
打开packjson.json文件
在script处：
>![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2838289-78f514f120445330.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
>PS:rimraf 是用来删除文件的，不需要的可以去掉&&前的命令（包括&&）
```
//分别执行的命令
npm run dev
npm run build
```

- 补充：
>关于压缩html配置项的说明
1.collapseWhitespace:从字面意思应该可以看出来，清除空格，压缩html，这一条比较重要，作用比较大，引起的改变压缩量也特别大；
2.collapseBooleanAttributes:省略布尔属性的值，比如：<input checked="checked"/>,那么设置这个属性后，就会变成 <input checked/>;
3.removeComments:清除html中注释的部分，我们应该减少html页面中的注释。
4.removeEmptyAttributes:清除所有的空属性，
5.removeSciptTypeAttributes:清除所有script标签中的type="text/javascript"属性。
6.removeStyleLinkTypeAttributes:清楚所有Link标签上的type属性。
7.minifyJS:压缩html中的javascript代码。
8.minifyCSS:压缩html中的css代码。
