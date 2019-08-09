# wsl安装mysql记录01：安装登陆

# 前言
![image](https://user-images.githubusercontent.com/25907273/48300431-38d10b80-e518-11e8-8762-2eb8912fa6e8.png)

- 系统环境：WSL（ubuntu16.04）
- mysq版本：`mysql  Ver 14.14 Distrib 5.7.24, for Linux (x86_64) using  EditLine wrapper`

# 正文
#### 安装mysql：
```
sudo apt-get install mysql-server
sudo apt install mysql-client
sudo apt install libmysqlclient-dev
```

#### 登陆
```
$ mysql -u root p
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)
```
并没有成功登陆，在`/var/run/`目录也下不存在`mysqld/mysqld.sock`目录和文件！

经google，众多答案指向mysql服务没有启动！并且让我意识到这个`mysqld.sock`文件会在服务启动的时候创建

另外一个有趣的插曲是：`mysql --help`可以查看到mysql的配置文件在哪里：
```
$ mysql --help
...
Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf ~/.my.cnf
The following groups are read: mysql client
...
```
如上三个位置
只有`/etc/mysql/`目录下有可用配置文件，另外两个位置目测都要自己新建配置文件
```
/etc/mysql/                         
├── conf.d                             
│   ├── mysql.cnf                      
│   └── mysqldump.cnf                  
├── debian.cnf                         
├── debian-start                       
├── my.cnf -> /etc/alternatives/my.cnf 
├── my.cnf.fallback                    
├── mysql.cnf                          
└── mysql.conf.d                       
    ├── mysqld.cnf                     
    └── mysqld_safe_syslog.cnf         
```
如上结构，真实文件是`mysqld.cnf`！
#### 查看当前mysql进程
```
$ ps -ef | grep mysqld
mysql      800     1  0 15:03 ?        00:00:00 /bin/sh /usr/bin/mysqld_safe
mysql     1159   800  0 15:03 ?        00:00:00 /usr/sbin/mysqld --basedir=/usr --datadir=/var/lib/mysql --plugin-dir=/usr/lib/mysql/plugin --log-error=/var/log/mysql/error.log --pid-file=/var/run/mysqld/mysqld.pid --socket=/tmp/mysql.sock --port=3306 --log-syslog=1 --log-syslog-facility=daemon --log-syslog-tag=
isaac     6559   175  0 16:47 pts/1    00:00:00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn mysqld
```

进程中存在两个mysql的进程：800 和 1159

我没有选择kill掉（不要问我为什么）

我选择先停止mysql服务，因为既然存在mysql的进程，应该说明已经启动，现在我i就是尝试去重启
```
$ sudo service mysql restart
 * Stopping MySQL database server mysqld                                                                                       [fail]
 * Starting MySQL database server mysqld                                                                                             No directory, logging in with HOME=/
                                                                                                                               [fail]
```
看最右边两个[fail]，单独停止服务也失败~
看error log，
```
2018-11-10T08:06:40.721105Z mysqld_safe Logging to '/var/log/mysql/error.log'.
2018-11-10T08:06:40.810186Z mysqld_safe A mysqld process already exists
2018-11-10T08:38:46.479830Z mysqld_safe Logging to '/var/log/mysql/error.log'.
2018-11-10T08:38:46.573742Z mysqld_safe A mysqld process already exists
2018-11-10T08:40:16.603777Z mysqld_safe Logging to '/var/log/mysql/error.log'.
2018-11-10T08:40:16.689659Z mysqld_safe A mysqld process already exists
2018-11-10T08:52:13.344173Z mysqld_safe Logging to '/var/log/mysql/error.log'.
2018-11-10T08:52:13.429294Z mysqld_safe A mysqld process already exists
2018-11-10T08:55:38.687442Z mysqld_safe Logging to '/var/log/mysql/error.log'.
2018-11-10T08:55:38.768004Z mysqld_safe A mysqld process already exists
2018-11-10T09:01:32.317510Z mysqld_safe Logging to '/var/log/mysql/error.log'.
```
然后，意识到上面说的两个mysql进程，要不还是手动kill掉吧~

```
# isaac @ DESKTOP-URUBQ6N in /etc/init.d [17:00:30] C:2 
$ pkill -9  mysql                                       
pkill: killing pid 800 failed: Operation not permitted  
pkill: killing pid 1159 failed: Operation not permitted 
                                                        
# isaac @ DESKTOP-URUBQ6N in /etc/init.d [17:00:48]     
$ sudo pkill -9  mysql                                  
                                                        
# isaac @ DESKTOP-URUBQ6N in /etc/init.d [17:01:05] 
$ ps uaxww | grep -i mysql
isaac     5586  0.0  0.0  12072   708 pts/2    S    16:39   0:00 tail -f /var/log/mysql/error.log
isaac     8464  0.0  0.0  12892  1148 pts/1    S    17:01   0:00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn -i mysql
```
不知道为什么直接用应用名kill不了，然后用了pkill成功了

#### 再次启动服务
```
# 查看当前服务状态
$ sudo service mysql status
 * MySQL is stopped.

# 启动服务
# isaac @ DESKTOP-URUBQ6N in /etc/init.d [16:59:36] C:1                    
$ sudo service mysql start          
[sudo] password for isaac:       
 * Starting MySQL database server mysqld       No directory, logging in with HOME=/      [ OK ] 
```
看到这个 [OK] 不能再舒服了
```
# isaac @ DESKTOP-URUBQ6N in /etc/init.d [17:01:42] C:3                                                                
$ sudo service mysql status                                                                                            
 * /usr/bin/mysqladmin  Ver 8.42 Distrib 5.7.24, for Linux on x86_64                                                   
Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.                                           
                                                                                                                       
Oracle is a registered trademark of Oracle Corporation and/or its                                                      
affiliates. Other names may be trademarks of their respective                                                          
owners.                                                                                                                
                                                                                                                       
Server version          5.7.24-0ubuntu0.16.04.1                                                                        
Protocol version        10                                                                                             
Connection              Localhost via UNIX socket                                                                      
UNIX socket             /var/run/mysqld/mysqld.sock                                                                    
Uptime:                 24 sec                                                                                         
                                                                                                                       
Threads: 1  Questions: 8  Slow queries: 0  Opens: 107  Flush tables: 1  Open tables: 26  Queries per second avg: 0.333 
```
舒服~

#### 又又又登陆mysql
```
# isaac @ DESKTOP-URUBQ6N in /etc/init.d [17:02:11] C:1
$ mysql -uroot p
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)

# isaac @ DESKTOP-URUBQ6N in /etc/init.d [17:02:23] C:1
$ sudo mysql -uroot p
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
```
![image](https://user-images.githubusercontent.com/25907273/48300425-1ccd6a00-e518-11e8-98fb-8140dca6f785.png)

不好意思，手抖打少了个中划线~

```
# isaac @ DESKTOP-URUBQ6N in /etc/init.d [18:43:06]
$ mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 5.7.24-0ubuntu0.16.04.1 (Ubuntu)

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>

```
![image](https://user-images.githubusercontent.com/25907273/48300455-f1974a80-e518-11e8-944b-32c9e7e21e6d.png)

#### mysql服务启动不了原因有一
今天在公司的wsl环境装个mysql，同样发现是启动不了mysql，我以为还是进程占用的问题，然后我如法炮制，kill掉所有的mysql进程，首先我是查看了当前进程：
```
# root in yibot_view on git:feature/channels o [12:14:00] ✗                                                                              
$ ps -ef | grep mysqld                                                                                                                   
root      5933   111  0 12:14 pts/1    00:00:00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.
hg --exclude-dir=.svn mysqld                                                                                                             
```

然后，也没多看，就直接kill

```
# root in yibot_view on git:feature/channels o [12:14:18] ✗
$ sudo pkill -9  mysql

# root in yibot_view on git:feature/channels o [12:14:20] ✗
$ ps -ef | grep mysqld
root      5985   111  0 12:14 pts/1    00:00:00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn mysqld
```
但是，如你所见，它还是在哪里~

anyway！

组后kill进程大法是不行了~

然后我便启动服务，边看看日志抛得什么异常（左右开弓，左边panel跑mysql，右边刷新error log）：
```
// 启动MySQL
# root in workspace [12:13:12] ✗
$ service mysql start
 * Starting MySQL database server mysqld                                                                                           No directory, logging in with HOME=/
                                                                                                                             [fail]
// 刷新日志
# root in mysql.conf.d [13:00:30] ✗
$ tail -f /var/log/mysql/error.log
```

其中一条日志引起了我的注意：

```
...
2018-11-15T05:01:23.815789Z 0 [ERROR] Can't start server: Bind on TCP/IP port: Permission denied        
2018-11-15T05:01:23.815862Z 0 [ERROR] Do you already have another mysqld server running on port: 3306 ? 
2018-11-15T05:01:23.815933Z 0 [ERROR] Aborting                                                          
...
```
照着错误信息（`Can't start server: Bind on TCP/IP port: Permission denied`）去google，首先找到的答案是：

>如果你开启了selinux，mysql会无法启动，你会在日志中看到以下错误
>
>[ERROR] Can't start server: Bind on TCP/IP port: Permission denied
>[ERROR] Do you already have another mysqld server running on port: 3308
>
>那么，你需要关掉selinux，不想重启服务器，而关掉selinux，使用以下命令
>
>/usr/sbin/setenforce 0
>
>
>修改linux下mysql端口时候报错：
>
>Can't start server: Bind on TCP/IP port: Permission denied
>
>需要修改： vi /etc/selinux/config
>
>SELINUX=disabled
>
>然后重启服务器即可

按着操作，我发现并没有config这个文件~

然后，这两句话引起小生注意：
1. Do you already have another mysqld server running on port: 3306 ? 
2. Do you already have another mysqld server running on port: 3308

一条是我自己的错误信息，一条是别人的！

**端口不一样哎！是不是端口被占用了？**

其实一开始我也有想过这个问题，但是我很明确地告诉你，我本地没有开启任何mysql服务或者其他服务占用3306这个端口~

anyway~我还是不自信地把端口配置改成3307

```
[mysqld]                                      
#                                             
# * Basic Settings                            
#                                             
user            = mysql                       
pid-file        = /var/run/mysqld/mysqld.pid  
socket          = /var/run/mysqld/mysqld.sock 
port            = 3307                        
basedir         = /usr                        
datadir         = /var/lib/mysql              
tmpdir          = /tmp                        
lc-messages-dir = /usr/share/mysql            
skip-external-locking                         
```
重新启动服务……

**真香，成功了~**
![image](https://user-images.githubusercontent.com/25907273/48532119-0a697c80-e8da-11e8-969d-47533e7d43e5.png)


# 小结
1. 登陆不了mysql，先看看有没有启动服务：
  ```
  service mysql start
  service mysql stop
  service mysql restart
  service mysql status
  ```
2. 查看mysql进程 和 杀死进程
```
# 查看
ps -ef | grep mysqld

# 杀死（杀死进程方法有很多种）
sudo pkill -9  mysql
```
3. 登陆mysql
```
sudo mysql -u root -p
```
4.看看错误，是不是端口占用
