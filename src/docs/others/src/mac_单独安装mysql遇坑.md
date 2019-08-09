# mac_单独安装mysql遇坑

首先，正常流程安装官网最新版本
![image](https://user-images.githubusercontent.com/25907273/39409696-5201797a-4c1e-11e8-88c2-505a4ffedad4.png)
下载完成安装完成，打开编好设置，最下面一栏也出现mysql图标，打开，start mysql，输完密码！以为可以啦！那就正常操作，命令行执行：
```
mysql -uroot -p
```
然而，抛出如下异常：
```
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock'
```
what？
cd 到 `/tmp`下，并无发现`mysql.sock`！what？
google一下，部分人说，可能在`/var/lib/mysql`下，cd过去，然而并没有~
ok！我不死心，我命令`find`一下
```
sudo find / -name 'mysql.sock'
```
然而并没有~
继续google一下，发现，wtm没有启动mysql，what？我一开始不就在客户端上开启了吗？
我继续打开偏好设置，继续启动一下，当我再次启动后，按钮还是`start mysql`这是我意识到，我没有成功开启~

继续google一下如何开启mysql~

知道一个答案如下
```
mysql.server start
```
然后抛出没有这命令`mysql.server`，what？

ok！我猜或许没有这个环境变量，然后我在mysql目录下找这个命令~

然后，我在`/usr/local/mysql/support-files`下找到了这个命令，保守起见我如此启动：
```
sudo ./mysql.server start
```
然而还是不行（忘记抛出什么异常了~）

怎么办~

我选择删除重新装~
删除工作如下：
```
sudo rm /usr/local/mysql
sudo rm -rf /usr/local/mysql*
sudo rm -rf /Library/StartupItems/MySQLCOM
sudo rm -rf /Library/PreferencePanes/My*
sudo rm -rf /Library/Receipts/mysql*
sudo rm -rf /Library/Receipts/MySQL*
sudo rm -rf /var/db/receipts/com.mysql.*
```
然后，重新启动电脑（记得是重启，不是注销，不要问我为什么知道）
再装一次，然而还是启动不了~

然后我继续删除重新装了另外一个版本：5.7.22

然而还是不行~

别人启动成功是这样的：
![image](https://user-images.githubusercontent.com/25907273/39409835-676e8878-4c20-11e8-8e00-0bfb109a830c.png)
然而我还是一直是stopped……

再google一下，有人说在`/usr/local/etc/`下添加或修改`my.cnf`，文件内容如下：
```
[client]
port = 3306
socket = /tmp/mysql.sock
default-character-set = utf8

[mysqld]
collation-server = utf8_unicode_ci
character-set-server = utf8
init-connect ='SET NAMES utf8'
max_allowed_packet = 64M
bind-address = 127.0.0.1
port = 3306
socket = /tmp/mysql.sock
innodb_file_per_table=1

[mysqld_safe]
timezone = '+0:00'
```
anyway，还是不行~

我还在怎么办？继续google，有人说这是mos版mysql的bug，主要是5.5以上版本的bug~

然后，我继续卸载了以上版本，去官网找了[历史版本](https://downloads.mysql.com/archives/community/)：5.1.72

当然，删除完要记得重启！然后开始客户端引导安装，安装完成后，偏厚设置最下面一栏没有了mysql的图标！难道没有安装成功？不会啊，客户端提示成功了！cd 到`/usr/local/`我发现了mysql目录，我确信是成功了，ok！那么接下来命令行启动吧！
```
sudo ./mysql.server start
```
输出如下：
![image](https://user-images.githubusercontent.com/25907273/39409930-98454ec2-4c21-11e8-9bc6-578bd6ab42fa.png)
成功了~我就是这么平静，没有一丝成功的喜悦~

ok！启动成功那么就连接mysql吧！

```
mysql -uroot -p
```
提示叫我输密码！what？我没有设置密码啊~难道有默认密码？

继续google一下[捂脸]，首次连接，不需要密码，直接enter就好~[手动滑稽]

ok！连接成功了，那么开始改密码吧！

如是操作：
```
\> FLUSH PRIVILEGES;
\> SET PASSWORD FOR 'root'@'localhost' = 'xxxxxxxx'
```

抛出如下异常：
```
Password hash should be a 41-digit hexadecimal number
```
不能明文设置密码~

怎么办？继续google一下

要如是操作：
```
\> select password('xxxxxxxx')
```
![image](https://user-images.githubusercontent.com/25907273/39409980-9d7ab818-4c22-11e8-8033-5074f842d74b.png)
继续设置：
```
SET PASSWORD FOR 'root'@'localhost' = '*C47C6EF6F324BF0926781358C11C26EB77036DC8';
```

成功了~ 我还是那么平静~

设置环境变量的方法：
```
\> vim ~/.bash_profile
```
在文件内添加：
```
export PATH=${PATH}:/usr/local/mysql/bin
```
保存然后执行：
```
\> source ~/.bash_profile
```
如法炮制，添加了mysql和mysql.server的环境变量
