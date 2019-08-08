```
#运行用户
user www-data;    

#启动进程,通常设置成和cpu的数量相等
worker_processes  1;

#全局错误日志及PID文件
error_log  /var/log/nginx/error.log;

#全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
error_log /var/log/nginx/error.log info;

#进程文件
pid /var/run/nginx.pid;

#一个nginx进程打开的最多文件描述符数目，理论值应该是最多打开文件数（系统的值[ulimit](http://www.ha97.com/tag/ulimit) -n）与nginx进程数相除，但是nginx分配请求并不均匀，所以建议与ulimit -n的值保持一致。
worker_rlimit_nofile 65535;

#工作模式及连接数上限
events {    
    use   epoll;             #epoll是多路复用IO(I/O Multiplexing)中的一种方式,但是仅用于linux2.6以上内核,可以大大提高nginx的性能    
    worker_connections  1024;#单个后台worker process进程的最大并发链接数              
    # multi_accept on;
}
#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {     
    #设定mime类型,类型由mime.type文件定义    
    include       /etc/nginx/mime.types;    
    #默认文件类型
    default_type  application/octet-stream;    
    #设定日志格式    
    access_log    /var/log/nginx/access.log;
    #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，   
     #必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.    
    sendfile        on;    
    autoindex on; #开启目录列表访问，合适下载服务器，默认关闭。
    tcp_nopush on; #防止网络阻塞
    tcp_nodelay on; #防止网络阻塞
    keepalive_timeout 120; #长连接超时时间，单位是秒

    #FastCGI相关参数是为了改善网站的性能：减少资源占用，提高访问速度。下面参数看字面意思都能理解。
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;    

    #gzip模块设置
    gzip on; #开启gzip压缩输出
    gzip_min_length 1k; #最小压缩文件大小
    gzip_buffers 4 16k; #压缩缓冲区
    gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_comp_level 2; #压缩等级
    gzip_types text/plain application/x-javascript text/css application/xml;
    #压缩类型，默认就已经包含text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
    gzip_vary on;
    #limit_zone crawler $binary_remote_addr 10m; #开启限制IP连接数的时候需要使用

    #设定请求缓冲    
    client_header_buffer_size    1k;    
    large_client_header_buffers  4 4k;
    include /etc/nginx/conf.d/*.conf;    
    include /etc/nginx/sites-enabled/*;

    #设定负载均衡的服务器列表     
    upstream mysvr {    
        #weigth参数表示权值，权值越高被分配到的几率越大    
        #本机上的Squid开启3128端口    
        server 192.168.8.1:3128 weight=5;    
        server 192.168.8.2:80  weight=1;    
        server 192.168.8.3:80  weight=6;    
    }

    server {    
        #侦听80端口        
        listen       80;        

        #域名可以有多个，用空格隔开       
        server_name  www.xx.com;
        
        #设定本虚拟主机的访问日志        
        access_log  logs/www.xx.com.access.log  main;

        #图片缓存时间设置
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)${
            expires 10d;
        }

        #JS和CSS缓存时间设置
        location ~ .*\.(js|css)?${
            expires 1h;
        }

        #对 "/" 启用反向代理  
        location / {          
            root   /root;      #定义服务器的默认网站根目录位置          
            index index.php index.html index.htm;   #定义首页索引文件的名称
            fastcgi_pass  www.xx.com;         
            fastcgi_param  SCRIPT_FILENAME  $document_root/$fastcgi_script_name;           
            include /etc/nginx/fastcgi_params;        
        }
        # 定义错误提示页面    
        error_page   500 502 503 504 /50x.html;          
        location = /50x.html {        root   /root;    }
        
        #静态文件，nginx自己处理    

        location ~ ^/(images|javascript|js|css|flash|media|static)/ {        
            root /var/www/virtual/htdocs;        
            #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。       
             expires 30d;    
        }    

        #PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.    
        location ~ \.php$ {        
            root /root;        
            fastcgi_pass 127.0.0.1:9000;        
            fastcgi_index index.php;        
            fastcgi_param SCRIPT_FILENAME /home/www/www$fastcgi_script_name;        
            include fastcgi_params;    
        }    

        #设定查看Nginx状态的地址    
        location /NginxStatus {        
            stub_status            on;        
            access_log              on;        
            auth_basic              "NginxStatus";       
            auth_basic_user_file  conf/htpasswd;    
        }    
  
        #禁止访问 .htxxx 文件    
        location ~ /\.ht {       
            deny all;
        }
    }
}
```

以上是一些基本的配置,使用Nginx最大的好处就是负载均衡
如果要使用负载均衡的话,可以修改配置http节点如下：
```
#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {     
    #设定mime类型,类型由mime.type文件定义    
    include       /etc/nginx/mime.types;    
    default_type  application/octet-stream;    
    #设定日志格式    
    access_log    /var/log/nginx/access.log;
    #省略上文有的一些配置节点
    #。。。。。。。。。。
    #设定负载均衡的服务器列表     
    upstream mysvr {    
        #weigth参数表示权值，权值越高被分配到的几率越大    
        server 192.168.8.1x:3128 weight=5;  #本机上的Squid开启3128端口    
        server 192.168.8.2x:80  weight=1;    
        server 192.168.8.3x:80  weight=6;    
    }
   
    upstream mysvr2 {    
        #weigth参数表示权值，权值越高被分配到的几率越大
        server 192.168.8.x:80  weight=1;    
        server 192.168.8.x:80  weight=6;    
    }
   
    #第一个虚拟服务器   
    server {    
        #侦听192.168.8.x的80端口
        listen       80;
        server_name  192.168.8.x;
        #对aspx后缀的进行负载均衡请求
        location ~ .*\.aspx$ {
            root   /root;      #定义服务器的默认网站根目录位置          
            index index.php index.html index.htm;   #定义首页索引文件的名称
          proxy_pass  http://mysvr ;  #请求转向mysvr 定义的服务器列表
          #以下是一些反向代理的配置可删除.
          proxy_redirect off;
          #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP              
          proxy_set_header Host $host;          
          proxy_set_header X-Real-IP $remote_addr;          
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;          
          client_max_body_size 10m;    #允许客户端请求的最大单文件字节数          
          client_body_buffer_size 128k;  #缓冲区代理缓冲用户端请求的最大字节数，
          proxy_connect_timeout 90;  #nginx跟后端服务器连接超时时间(代理连接超时)
          proxy_send_timeout 90;        #后端服务器数据回传时间(代理发送超时)
          proxy_read_timeout 90;         #连接成功后，后端服务器响应时间(代理接收超时)
          proxy_buffer_size 4k;             #设置代理服务器（nginx）保存用户头信息的缓冲区大小
          proxy_buffers 4 32k;               #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
          proxy_busy_buffers_size 64k;    #高负荷下缓冲大小（proxy_buffers*2）
          proxy_temp_file_write_size 64k;  #设定缓存文件夹大小，大于这个值，将从upstream服务器传
       }
    }
}
```
