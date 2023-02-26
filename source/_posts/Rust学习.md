---
title: Rust学习
date: 2023-02-15 00:56:17
tags:
- Rust
- 旧文迁移

categories:
- Rust
---

# 前言

Rust 是一种 预编译静态类型（ahead-of-time compiled）语言，这意味着你可以编译程序，并将可执行文件送给其他人，他们甚至不需要安装 Rust 就可以运行。

<!-- more -->

Rust 是 静态类型（statically typed）语言，也就是说在编译时就必须知道所有变量的类型。

Rust 通过所有权系统管理内存，编译器在编译时会根据一系列的规则进行检查。如果违反了任何这些规则，程序都不能编译。

Rust是内存安全、没有GC(垃圾回收)的高效语言。

-------------------


# 安装

```shell
[root@f8ac270c7b6b workspace]# curl --proto '=https' --tlsv1.3 https://sh.rustup.rs -sSf | sh
```
安装成功！
```
info: default toolchain set to 'stable-x86_64-unknown-linux-gnu'                 
                                                                                 
  stable-x86_64-unknown-linux-gnu installed - rustc 1.65.0 (897e37553 2022-11-02)
                                                                                 
                                                                                 
Rust is installed now. Great!                                                    
                                                                                 
To get started you may need to restart your current shell.                       
This would reload your PATH environment variable to include                      
Cargo's bin directory ($HOME/.cargo/bin).                                        
                                                                                 
To configure your current shell, run:                                            
source "$HOME/.cargo/env"                                                        
```

刷新当前shell配置

```shell
[root@f8ac270c7b6b workspace]# source ~/.bashrc

[root@f8ac270c7b6b workspace]# rustc --version
rustc 1.65.0 (897e37553 2022-11-02)
```

--------------------

# Hello World

- Code
- 编译
- 执行

## Code

文件名：hello_world.rs

使用的是 `.rs` 后缀！

```
fn main() {
  println!("Hello, world!");
}
```

安装 vs code的 rust 扩展！

Extension ID：dustypomerleau.rust-syntax
![image](https://user-images.githubusercontent.com/25907273/204077420-7c3a88eb-57d2-4393-ae55-5ad625521997.png)

## 编译

`rustc xxx.rs` 编译rust程序！

```shell
[root@f8ac270c7b6b rust-learn]# rustc hello_world.rs
[root@f8ac270c7b6b rust-learn]# ls
hello_world  hello_world.rs
```

## 执行

直接执行编译后的文件！不需要启动程序！

```
[root@f8ac270c7b6b rust-learn]# ./hello_world
Hello, world!
```

----------

# 构建系统和包管理器，Cargo 

Cargo 是 Rust 的构建系统和包管理器。它可以为你处理很多任务，比如构建代码、下载依赖库并编译这些库

使用官方方式安装，会自带 Cargo！

Cargo的详细命令可以使用 `--help`，也可查看 [附录](https://github.com/isaaxite/blog/issues/296#issuecomment-1327996209)

```shell
[root@f8ac270c7b6b rust-learn]# cargo --version
cargo 1.65.0 (4bc8f24d3 2022-10-20)
```

- 创建项目
- 编译项目
  - 开发时编译
  - 生产时编译
- 执行项目
- 快速检测
- 小结
- 参考

## 创建项目

使用 `cargo new <new dir name>`

产物结构

![image](https://user-images.githubusercontent.com/25907273/204089591-b2abeda6-5cdc-4bda-8498-3a06cf746f4a.png)

生成一个配置文件，是toml文件。

这个文件使用 [TOML](https://toml.io/) (Tom's Obvious, Minimal Language) 格式，这是 Cargo 配置文件的格式。

还生成一个src以及src下的z=主文件main。

![image](https://user-images.githubusercontent.com/25907273/204089548-adadc8f1-ff1a-48e5-826b-68257e30cb6f.png)

## 编译项目

- 开发时编译
- 生产时编译

### 开发时编译

切换到 项目目录下（此处是 hello_cargo），执行build命令。

```shell
cargo build
```

build 结果如下：

![image](https://user-images.githubusercontent.com/25907273/204089646-b505984f-8cf6-4fae-b221-cbb47c59dcbb.png)

增加了 `Cargo.lock` 和 `target/` 目录！


### 生产时编译

在开发时编译的基础上增加 `--release`。

编译的产物会放在 `target/release` 中！详细参考 [附录](https://github.com/isaaxite/blog/issues/296#issuecomment-1327996209)

```shell
cargo build --release
```

![image](https://user-images.githubusercontent.com/25907273/204099490-4309d4b8-7122-44d0-a7e7-2668d1940238.png)




## 运行项目

使用 `run` 命令

```shell
cargo run
```

![image](https://user-images.githubusercontent.com/25907273/204089972-fb695c14-1456-4863-8c09-fb8e5184a9bd.png)


## 快速检查

在项目根目录下执行以下命令：

```shell
cargo check
```

![image](https://user-images.githubusercontent.com/25907273/204100025-89f68fa1-26a0-4303-a32f-3a240ae04503.png)

该命令快速检查代码确保其可以编译，但并不产生可执行文件！

通常 cargo check 要比 cargo build 快得多，因为它省略了生成可执行文件的步骤。如果你在编写代码时持续的进行检查，cargo check 可以让你快速了解现在的代码能不能正常通过编译！


## 小结

- `cargo new`，创建项目。
- `cargo build`，构建项目。
- `cargo run`，一步构建并运行项目。
- `cargo check`，在不生成二进制文件的情况下构建项目来检查错误。
- 有别于将构建结果放在与源码相同的目录，Cargo 会将其放到 target目录，默认在 `target/debug`，生产时在 `target/release`。

## 参考

- [Rust 程序设计语言 简体中文版 —— Hello, Cargo!](https://kaisery.github.io/trpl-zh-cn/ch01-03-hello-cargo.html#hello-cargo)



---

# 语法概念

- 结束符号
- 注释
- 变量/常量
- 数据类型
- [函数定义](https://github.com/isaaxite/blog/issues/296#issuecomment-1328515749)
- [控制流](https://github.com/isaaxite/blog/issues/296#issuecomment-1330017240)

## 结束符号

使用分号（`;`）作为结束符号


## 注释

```rs
// 这是一段注释
```

## 变量/常量

### 变量

变量默认是不可重复赋值！
如果要重复赋值可以使用`mut`配合声明。
变量是可以重复声明的！

使用 `let` 声明标量！

```rs
let foo = 1;
```
需要重复赋值时声明

```rs
let mut foo = 1;

foo = 2
```
可以重复声明变量

```rs
let foo = 1;
// 在此之前foo=1
let foo: u8 = 2;
// 解析来foo = 2
```

### 常量

使用 `const`声明，与变量不同，它声明之后总是不可重复声明与赋值！

```rs
const FOO = 1;
```


## 数据类型

- 数据类型的分类

### 数据类型的分类

数据类型的分为*标量（scalar）*和*复合（compound）*，以及其他

**标量（scalar）** 类型代表一个单独的值。Rust 有四种基本的标量类型：

- [整型](https://github.com/isaaxite/blog/issues/296#issuecomment-1328102385)
- [浮点型](https://github.com/isaaxite/blog/issues/296#issuecomment-1328105183)
- [布尔类型](https://github.com/isaaxite/blog/issues/296#issuecomment-1328105689)
- [字符类型](https://github.com/isaaxite/blog/issues/296#issuecomment-1328111816)

**复合类型（Compound types）** 可以将多个值组合成一个类型。Rust 有两个原生的复合类型：

- [元组（tuple）](https://github.com/isaaxite/blog/issues/296#issuecomment-1328122358)
- [数组（array）](https://github.com/isaaxite/blog/issues/296#issuecomment-1328195135)

其他类型包含：

- [引用类型](https://github.com/isaaxite/blog/issues/296#issuecomment-1328463936)
- [Slice类型](https://github.com/isaaxite/blog/issues/296#issuecomment-1328510984)


-----------------

#  所有权（ownership）

- 前言
- 所有权的规则
- 变量作用域
- 变量与数据交互的方式
- 引用与借用

## 前言

[栈（Stack）与堆（Heap）内存。

栈以放入值的顺序存储值。

堆是缺乏组织的：当向堆放入数据时，你要请求一定大小的空间。内存分配器（memory allocator）在堆的某处找到一块足够大的空位，把它标记为已使用，并返回一个表示该位置地址的 指针（pointer）。

入栈比在堆上分配内存要快，因为（入栈时）分配器无需为存储新数据去搜索内存空间；其位置总是在栈顶。相比之下，在堆上分配内存则需要更多的工作，这是因为分配器必须首先找到一块足够存放数据的内存空间，并接着做一些记录为下一次分配做准备。


## 所有权的规则

1. Rust 中的每一个值都有一个 所有者（owner）。
2. 值在任一时刻有且只有一个所有者。
3. 当所有者（变量）离开作用域，这个值将被丢弃。


## 变量作用域

`{}`，每个花括号包含的代码块都是一个作用域！

注意，这不包含 struct 的花括号！

```rs
fn var_scope_main() {
  {                     // s 在这里无效, 它尚未声明
    let s = "hello";    // 从此处起，s 是有效的
    
    // 使用 s
  }                     // Rust 在结尾的 } 处自动调用 drop, 释放内存
                        // 此作用域已结束，s 不再有效
}
```

## String 类型

Rust 有第二个字符串类型，String。这个类型管理被分配到堆上的数据，所以能够存储在编译时未知大小的文本。可以使用 from 函数基于字符串字面值来创建 String。

String类型有别于字面量字符串，它是可修改的！

```rs
let mut s = String::from("hello");

s.push_str(", world!"); // push_str() 在字符串后追加字面值

println!("{}", s); // 将打印 `hello, world!`
```

对于 String 类型，为了支持一个可变，可增长的文本片段，需要在堆上分配一块在编译时未知大小的内存来存放内容。这意味着：

- 必须在运行时向内存分配器（memory allocator）请求内存。
- 需要一个当我们处理完 String 时将内存返回给分配器的方法。

### 变量与数据交互的方式

使用堆内存的变量，他们之间的数据交互方式！

![图片](https://user-images.githubusercontent.com/25907273/204480696-4188bc14-809f-49dd-be12-3ef7868d3b0e.png)

- 转移
- 拷贝

#### 转移

为了确保内存安全，在 let s2 = s1 之后，Rust 认为 s1 不再有效，因此 Rust 不需要在 s1 离开作用域后清理任何东西。

相当于 s1 赋值给 s2，就将数据转移到s2。不是浅拷贝（将引用复制给s2），也不是深拷贝！

```rs
fn heap_var_main() {
  let s1 = String::from("hello");
  let s2 = s1;
  print!("s1 is {}", s1);
  print!("s2 is {}", s2);
}
```

![图片](https://user-images.githubusercontent.com/25907273/204481489-09ebb4e5-5fb3-413c-83a6-36a528ed980a.png)

#### 拷贝

使用一个叫做 [clone] 的通用函数。

```rs
fn clone_main() {
  let s1 = String::from("hello");
  let s2 = s1.clone();

  println!("\ns1 = {}, s2 = {}", s1, s2);
}
```

![图片](https://user-images.githubusercontent.com/25907273/204489601-c2e6f02b-4aa7-46bc-97d5-e707e7643458.png)


## 引用与借用

引用（reference）像一个指针，因为它是一个地址，我们可以由此访问储存于该地址的属于其他变量的数据。 与指针不同，引用确保指向某个特定类型的有效值。

`&` 符号就是 引用，它们允许你使用值但不获取其所有权。

![图片](https://user-images.githubusercontent.com/25907273/204947997-bd4878ea-b295-47fd-bd0d-895d2f703fc1.png)

```rs
fn ref_main() {
  let s1 = String::from("hello world!");

  fn calculate_length(s: &String) -> usize {
    return s.len();
  }// 这里，s 离开了作用域。但因为它并不拥有引用值的所有权，
  // 所以什么也不会发生

  let len = calculate_length(&s1);

  println!("\ns1 len = {}", len);
}
```

`&s1` 语法让我们创建一个 指向 值 s1 的引用，但是并不拥有它。因为并不拥有这个值。

我们将创建一个引用的行为称为 借用（borrowing）。


### 可变引用

正如变量默认是不可变的，引用也一样。（默认）不允许修改引用的值。

```rs
fn mut_ref_main() {
  let mut s = String::from("hello");

  change(&mut s);

  print!("\ns = {}", s);

  fn change(some_string: &mut String) {
    some_string.push_str(", world");
  }
}
```

**注意：可变引用有一个很大的限制：如果你有一个对该变量的可变引用，你就不能再创建对该变量的引用。**

这个限制的好处是 Rust 可以在编译时就避免数据竞争。

[clone]: https://doc.rust-lang.org/std/clone/index.html


---------------


# 包、crate和模块

use 关键字: 在一个作用域内，use关键字创建了一个成员的快捷方式，用来减少长路径的重复。在任何可以引用crate::garden::vegetables::Asparagus的作用域, 你可以通过 use crate::garden::vegetables::Asparagus;创建一个快捷方式，然后你就可以在作用域中只写Asparagus来使用该类型。


外部模块的寻址过程 

1. 内联；
2. 在文件 `src/<mod>.rs`；
3. 在文件 `src/<mod>/mod.rs`。

内联模块：

```rs
mod front_of_house {}
```


---------------


# 附录

- 参考
- cargo --help
- cargo编译后的产物
- Rust内存布局

## 参考
- [The Rust Programming Language](https://doc.rust-lang.org/book/#the-rust-programming-language)
- [Rust 程序设计语言 简体中文版](https://kaisery.github.io/trpl-zh-cn/ch01-01-installation.html)
- [Rust入门秘籍](https://rust-book.junmajinlong.com/)
- [Rust 中文教程等相关资源列表](https://www.rustwiki.org.cn/docs/)

## cargo --help

```shell
[root@f8ac270c7b6b rust-learn]# cargo --help                                                    
Rust's package manager                                                                          
                                                                                                
USAGE:                                                                                          
    cargo [+toolchain] [OPTIONS] [SUBCOMMAND]                                                   
                                                                                                
OPTIONS:                                                                                        
    -V, --version               Print version info and exit                                     
        --list                  List installed commands                                         
        --explain <CODE>        Run `rustc --explain CODE`                                      
    -v, --verbose               Use verbose output (-vv very verbose/build.rs output)           
    -q, --quiet                 Do not print cargo log messages                                 
        --color <WHEN>          Coloring: auto, always, never                                   
        --frozen                Require Cargo.lock and cache are up to date                     
        --locked                Require Cargo.lock is up to date                                
        --offline               Run without accessing the network                               
        --config <KEY=VALUE>    Override a configuration value                                  
    -Z <FLAG>                   Unstable (nightly-only) flags to Cargo, see 'cargo -Z help' for 
                                details                                                         
    -h, --help                  Print help information                                          
                                                                                                
Some common cargo commands are (see all commands with --list):                                  
    build, b    Compile the current package                                                     
    check, c    Analyze the current package and report errors, but don't build object files     
    clean       Remove the target directory                                                     
    doc, d      Build this package's and its dependencies' documentation                        
    new         Create a new cargo package                                                      
    init        Create a new cargo package in an existing directory                             
    add         Add dependencies to a manifest file                                             
    run, r      Run a binary or example of the local package                                    
    test, t     Run the tests                                                                   
    bench       Run the benchmarks                                                              
    update      Update dependencies listed in Cargo.lock                                        
    search      Search registry for crates                                                      
    publish     Package and upload this package to the registry                                 
    install     Install a Rust binary. Default location is $HOME/.cargo/bin                     
    uninstall   Uninstall a Rust binary                                                         
                                                                                                
See 'cargo help <command>' for more information on a specific command.                          
                                                                                                
```

## cargo编译后的产物

- 开发时产物
- 生产时产物

### 开发时产物

```shell
[root@f8ac270c7b6b hello_cargo]# tree                      
.                                                          
|-- Cargo.lock                                             
|-- Cargo.toml                                             
|-- src                                                    
|   `-- main.rs                                            
`-- target                                                 
    |-- CACHEDIR.TAG                                       
    `-- debug                                              
        |-- build                                          
        |-- deps                                           
        |   |-- hello_cargo-84cd33c7f338469a               
        |   `-- hello_cargo-84cd33c7f338469a.d             
        |-- examples                                       
        |-- hello_cargo                                    
        |-- hello_cargo.d                                  
        `-- incremental                                    
            `-- hello_cargo-aokenuaryvra                   
                |-- s-gfry8e3ogd-1vtypym-2e5m3t5mj48xn     
                |   |-- 1b24fot1ksjfohwq.o                 
                |   |-- 2pcmwubz98u8588d.o                 
                |   |-- 2skhc1xjwld6hx4y.o                 
                |   |-- 387f08navk0xr9hq.o                 
                |   |-- 41zl1lnzyfy87gmq.o                 
                |   |-- 4gfj2nd48vmsnha0.o                 
                |   |-- dep-graph.bin                      
                |   |-- query-cache.bin                    
                |   `-- work-products.bin                  
                `-- s-gfry8e3ogd-1vtypym.lock              
                                                           
9 directories, 18 files                                    
```

### 生产时产物

```shell
[root@f8ac270c7b6b target]# tree                   
.                                                  
|-- CACHEDIR.TAG                                   
|-- debug                                          
|   |-- build                                      
|   |-- deps                                       
|   |   |-- hello_cargo-84cd33c7f338469a           
|   |   `-- hello_cargo-84cd33c7f338469a.d         
|   |-- examples                                   
|   |-- hello_cargo                                
|   |-- hello_cargo.d                              
|   `-- incremental                                
|       `-- hello_cargo-aokenuaryvra               
|           |-- s-gfryfk4nh1-10dc9z2-2e5m3t5mj48xn 
|           |   |-- 1b24fot1ksjfohwq.o             
|           |   |-- 2pcmwubz98u8588d.o             
|           |   |-- 2skhc1xjwld6hx4y.o             
|           |   |-- 387f08navk0xr9hq.o             
|           |   |-- 41zl1lnzyfy87gmq.o             
|           |   |-- 4gfj2nd48vmsnha0.o             
|           |   |-- dep-graph.bin                  
|           |   |-- query-cache.bin                
|           |   `-- work-products.bin              
|           `-- s-gfryfk4nh1-10dc9z2.lock          
`-- release                                        
    |-- build                                      
    |-- deps                                       
    |   |-- hello_cargo-42d24d7ef33ef483           
    |   `-- hello_cargo-42d24d7ef33ef483.d         
    |-- examples                                   
    |-- hello_cargo                                
    |-- hello_cargo.d                              
    `-- incremental                                
                                                   
12 directories, 19 files
```

## Rust 内存布局

<img width="100%" src="https://user-images.githubusercontent.com/25907273/204198140-44b47b88-e8ed-43b0-a554-181ebdd3ef0c.png" />

