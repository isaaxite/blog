# 开启MySQL远程访问权限_允许远程连接记录

# 前言
- 系统信息：
```
# root @ iZbp19z5o9dc905pnjjollZ in ~ [21:58:58] C:1                                                                                          
$ sudo lsb_release -a                                                                                                                         
LSB Version:    core-9.20160110ubuntu0.2-amd64:core-9.20160110ubuntu0.2-noarch:security-9.20160110ubuntu0.2-amd64:security-9.20160110ubuntu0.2
-noarch                                                                                                                                       
Distributor ID: Ubuntu                                                                                                                        
Description:    Ubuntu 16.04.3 LTS                                                                                                            
Release:        16.04                                                                                                                         
Codename:       xenial                  
```   

- 数据库版本
```
# root @ iZbp19z5o9dc905pnjjollZ in ~ [22:00:45]
$ mysql -V
mysql  Ver 14.14 Distrib 5.7.24, for Linux (x86_64) using  EditLine wrapper
```                                                                                              

# 正文
#### 登陆数据库
```
# root @ iZbp19z5o9dc905pnjjollZ in ~ [22:17:20] C:1      
$ mysql -uroot -p                                         
Enter password:                                           
Welcome to the MySQL monitor.  Commands end with ; or \g. 

mysql> show databases;   
+--------------------+   
| Database           |   
+--------------------+   
| information_schema |   
| mysql              |   
| performance_schema |   
| sys                |   
+--------------------+   
4 rows in set (0.00 sec) 
```

#### 选择数据库（name=mysql）
```
mysql> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```
#### 更新host
```
mysql> UPDATE user SET host='%' WHERE user='root'; 
mysql> select user,host from user;
+------------------+-----------+
| user             | host      |
+------------------+-----------+
| root             | %         |
| debian-sys-maint | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
+------------------+-----------+
4 rows in set (0.00 sec)                                       
```
#### 刷新权限
```
mysql> flush privileges;            
Query OK, 0 rows affected (0.00 sec)
```

#### 测试连接
```
# root @ iZbp19z5o9dc905pnjjollZ in ~ [22:13:45]
$ mysql --host=47.xxx.xx.3 -uroot -p
Enter password:
ERROR 2003 (HY000): Can't connect to MySQL server on '47.xxx.xx.3' (110)
```

不行~

![image](https://user-images.githubusercontent.com/25907273/48314271-229f7a00-e602-11e8-9c85-a010bf090183.png)

