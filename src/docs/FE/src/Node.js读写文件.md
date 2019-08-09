# Node.js读写文件

## 读写文件
使用fs模块来实现所有有关文件和目录的创建、写入和删除操作。在fs模块中，所有操作都可以使用同步和异步这两种方法。例如在执行读文件操作时，可以使用readFile和readFileSync（同步）方法
```js
   var fs = require('fs');
   var data = fs.readFileSync('./index.html', 'utf8');
   // 停止执行代码直到操作结束
   console.log(data)
```
而异步方法将操作结果作为回调函数的参数，这种error-first回调方式可以参考另一篇博文 node.js知识点总结 
在很少的场景比如读取配置文件并启动服务器才会使用同步方法 
读取文件后得到的是文件原始二进制数据缓存区中的内容，使用toString方法将该内容以字符串形式输出
```js
   fs.readFile('./test.txt', function(err, data){
       if(err) console.log('文件读取发生错误');
       else {
           // console.log(data);
           console.log(data.toString());
       }
   })
```
同样写文件也是分为writeFile和writeFileSync
```js
   fs.writeFile(filename, data, [options], callback)
```
例如
```js
   fs.writeFile('./message.txt', '第一行\r\n第二行', function(err){
       if(err) console.log...
       else console.log('写文件操作成功');
   })
```


## 从指定位置开始读写
首先需要使用fs模块中的open方法或openSync方法打开文件
```js
   var fs = require('fs');
   fs.open('./message.txt', 'r', function(err, fd){
      // 创建一个文件缓存区，将数据读进来
      var buf = new Buffer(255);
      // 一个汉字的utf编码为3个字节数据
      fs.read(fd, buf, 0, 9, 3, function(err), byteRead, buffer){
          console.log(buffer.slice(0, bytesRead).toString());
      })
   })
```

## 创建和读取目录
使用mkdir来创建目录，callback和之前的使用方式一致
```js
    fs.mkdir(path, [mode], callback)
```
mode参数用于指定该目录权限，默认值为0777(任何人可读写)。 
读取目录可使用readdir
```js
   fs.readdir(path, callback);
```
## 流的基本概念
当使用readFile方法读取文件内容时，Node.js首先将文件内容完整读入缓存区，再从缓存区读取文件内容。在使用writeFile的时候，首先将该内容完整读入缓存区，然后一次性将缓存区中内容写入文件。而read方法则不同： 1、将需要书写的数据写到一个内容缓存区。2、等缓存区写满后再将该缓存区内容写入到文件中。在文件读写过程中允许执行其他处理。 
在一个应用程序中，流是一组有序的、有起点和终点的字节数据的传输手段。在各种对象之间传输数据的时候，总是先将该对象所包含的数据转换成各种形式的流数据（即字节数据），再通过流的传输，到达目的地将数据流转换成该对象中可以使用的数据。 
在Node.js中，使用各种实现了stream.Writeable接口的对象来将流数据写入对象，所有这些对象都是继承了EventEmitter类的实例对象，在写入数据过程中，会触发各种事件

## 使用readStream对象读取
在fs模块中，可以使用createReadStream方法创建一个将文件内容读取为数据流的ReadStream对象
```js
   fs.createReadStream(path, [options]);
```

在实际使用中
```
   var file = fs.createReadStream('./message.txt', {start: 3, end: 12 });
   file.on('open', function(fd){
       console.log('开始读取文件');
   })
   file.on('data', function(data){
       console.log('读取到数据');
   })
   file.on('end', function(){
       console.log('文件全部读取完毕');
   })
   file.on('close', function(){
       console.log('文件被关闭');
   })
   file.on('error', function(){
       console.log('读取文件失败')
   })
```

写入文件也类似
```
   var file = fs.createReadStream('./message.txt');
   var out = fs.createWriteStream('./anotherMessage.txt');
   file.on('data', function(data){
       // WriteStream对象的write方法
       out.write(data);
   })
   out.on('open', function(){ ... })
```

## 最后
以上内容均为转载，[原文链接]，侵删~

[原文链接]: https://blog.csdn.net/sysuzhyupeng/article/details/58587781
