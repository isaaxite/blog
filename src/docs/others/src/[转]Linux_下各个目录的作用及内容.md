# [转]Linux_下各个目录的作用及内容

**Linux 目录**

在 Linux 下，我们看到的是文件夹（目录）： 
>![img](http://upload-images.jianshu.io/upload_images/2838289-470a0bb4661f73a9.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

在早期的 UNIX 系统中，各个厂家各自定义了自己的 UNIX 系统文件目录，比较混乱。Linux 面世不久后，对文件目录进行了标准化，于1994年对根文件目录做了统一的规范，推出 FHS ( Filesystem Hierarchy Standard ) 的 Linux 文件系统层次结构标准。FHS 标准规定了 Linux 根目录各文件夹的名称及作用，统一了Linux界命名混乱的局面。
无论何种版本的 Linux 发行版，桌面、应用是 Linux 的外衣，文件组织、目录结构才是Linux的内心。FHS（英文：Filesystem Hierarchy Standard
 中文：文件系统层次结构标准），多数 Linux 版本采用这种文件组织形式，FHS 定义了系统中每个区域的用途、所需要的最小构成的文件和目录同时还给出了例外处理与矛盾处理。 FHS 定义了两层规范，第一层是， / 下面的各个目录应该要放什么文件数据，例如 /etc 应该要放置设置文件，/bin 与 /sbin 则应该要放置可执行文件等等。

第二层则是针对 /usr 及 /var 这两个目录的子目录来定义。例如 /var/log 放置系统登录文件、/usr/share 放置共享数据等等。

FHS 是根据以往无数 Linux 用户和开发者的经验总结出来的，并且会维持更新，FHS 依据文件系统使用的频繁与否以及是否允许用户随意改动（注意，不是不能，学习过程中，不要怕这些），将目录定义为四种交互作用的形态，如下表所示：
![img](http://upload-images.jianshu.io/upload_images/2838289-4956b524d89c7739.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

/ ：根目录，一般根目录下只存放目录，不要存放件，/etc、/bin、/dev、/lib、/sbin应该和根目录放置在一个分区中
![img](http://upload-images.jianshu.io/upload_images/2838289-fd8a3ef746fe66d0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

/bin: /usr/bin: 可执行二进制文件的目录，如常用的命令ls、tar、mv、cat等。

/boot：放置linux系统启动时用到的一些文件。/boot/vmlinuz 为 linux 的内核文件，以及 /boot/gurb。建议单独分区，分区大小100M即可

/dev：存放linux系统下的设备文件，访问该目录下某个文件，相当于访问某个设备，常用的是挂载光驱 mount /dev/cdrom /mnt。

/etc：系统配置文件存放的目录，不建议在此目录下存放可执行文件，重要的配置文件有 /etc/inittab、/etc/fstab、/etc/init.d、/etc/X11、/etc/sysconfig、/etc/xinetd.d修改配置文件之前记得备份。

注：/etc/X11 存放与 x windows 有关的设置。

/home：系统默认的用户家目录，新增用户账号时，用户的家目录都存放在此目录下，~表示当前用户的家目录，~edu 表示用户 edu 的家目录。建议单独分区，并设置较大的磁盘空间，方便用户存放数据

/lib: /usr/lib: /usr/local/lib：系统使用的函数库的目录，程序在执行过程中，需要调用一些额外的参数时需要函数库的协助，比较重要的目录为 /lib/modules。

/lost+fount：系统异常产生错误时，会将一些遗失的片段放置于此目录下，通常这个目录会自动出现在装置目录下。如加载硬盘于 /disk 中，此目录下就会自动产生目录 /disk/lost+found

/mnt: /media：光盘默认挂载点，通常光盘挂载于 /mnt/cdrom 下，也不一定，可以选择任意位置进行挂载。

/opt：给主机额外安装软件所摆放的目录。如：FC4使用的Fedora 社群开发软件，如果想要自行安装新的 KDE 桌面软件，可以将该软件安装在该目录下。以前的 Linux 系统中，习惯放置在 /usr/local 目录下

/proc：此目录的数据都在内存中，如系统核心，外部设备，网络状态，由于数据都存放于内存中，所以不占用磁盘空间，比较重要的目录有 /proc/cpuinfo、/proc/interrupts、/proc/dma、/proc/ioports、/proc/net/* 等。

/root：系统管理员root的家目录，系统第一个启动的分区为 /，所以最好将 /root和 /放置在一个分区下。

/sbin: /usr/sbin: /usr/local/sbin：放置系统管理员使用的可执行命令，如fdisk、shutdown、mount 等。与 /bin 不同的是，这几个目录是给系统管理员 root使用的命令，一般用户只能"查看"而不能设置和使用。

/tmp：一般用户或正在执行的程序临时存放文件的目录,任何人都可以访问,重要数据不可放置在此目录下

/srv：服务启动之后需要访问的数据目录，如 www 服务需要访问的网页数据存放在 /srv/www 内。

/usr：应用程序存放目录。
/usr/bin：存放应用程序。
/usr/share：存放共享数据。
/usr/lib：存放不能直接运行的，却是许多程序运行所必需的一些函数库文件。
/usr/local：存放软件升级包。
/usr/share/doc：系统说明文件存放目录。
/usr/share/man：程序说明文件存放目录，使用 man ls 时会查询 /usr/share/man/man1/ls.1.gz 的内容建议单独分区，设置较大的磁盘空间

/var：放置系统执行过程中经常变化的文件，如随时更改的日志文件 /var/log，/var/log/message：所有的登录文件存放目录，/var/spool/mail：邮件存放的目录，/var/run:程序或服务启动后，其PID存放在该目录下。建议单独分区，设置较大的磁盘空间

**一切皆文件**
Linux 对数据文件(*.mp3、*.bmp)，程序文件(*.c、*.h、*.o)，设备文件（LCD、触摸屏、鼠标），网络文件( socket ) 等的管理都抽象为文件，使用统一的方式方法管理。

文件分类：
1）普通文件( 数据文件 )
普通文件是用于存放数据、程序等信息的文件，一般都长期地存放在外存储器（磁盘）中。普通文件又分为文本文件和二进制文件。

2）目录文件
目录文件是文件系统中一个目录所包含的目录项所组成的文件。

3）设备文件
设备文件是用于为操作系统与设备提供连接的一种文件。在Linux系统中将设备作为文件来处理，操作设备就像是操作普通文件一样。每一个设备对应一个设备文件，存放在 /dev 目录中。

5）链接文件
似于 windows 下的快捷方式，链接又可以分为软链接（符号链接）和硬链接。

6）管道文件
管道文件主要用于在进程间传递数据的一种特殊文件。

7）套接口文件
主要用于不同计算机间网络通信的一种特殊文件。
![img](http://upload-images.jianshu.io/upload_images/2838289-56daeb5905fb909a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) ![img](http://upload-images.jianshu.io/upload_images/2838289-25097bb4d6d123db.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[原文链接: https://cnbin.github.io/blog/2015/06/23/linux-xia-ge-ge-mu-lu-de-zuo-yong-ji-nei-rong/](https://cnbin.github.io/blog/2015/06/23/linux-xia-ge-ge-mu-lu-de-zuo-yong-ji-nei-rong/)
