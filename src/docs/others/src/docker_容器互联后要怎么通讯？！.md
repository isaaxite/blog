# docker_容器互联后要怎么通讯？！

## 前言
来源： https://yeasy.gitbooks.io/docker_practice/network/linking.html

## 正文

### 新建网络
```
docker network create -d bridge my-net
```

### 连接容器
```
docker run -it --rm --name busybox1 --network my-net busybox sh

docker run -it --rm --name busybox2 --network my-net busybox sh
```

### 查看是否成功互联
```
ping busybox1
```

### 问题

#### ques 1：
```
--rm
```

是什么意思？

#### ques 2:

实际操作上，不同容器怎么通信？比如容器1是mysql，容器2是个webApp。容器2怎么想容器1做数据io？


