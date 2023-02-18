---
title: 图的javascript实现
date: 2020-01-01 12:18:25
tags:
- 数据结构
- JavaScript
- 旧文迁移
categories:
- 数据结构
---


# 图的概念

图：关于图的概念就大概说一下基本的，图分成有向和无向。图由若干顶点构成，顶点相连成边，边由顶点对组成，(假设有v1，v2两顶点，(v1,v2)即为一条边)每个顶点有权重，对于图的概念可以自行Google，本文着重对图的实现，上两张“图”的例子：

<!-- more -->

有向图：

![](2838289-34f3c4e8246fdbfd.png)

无向图：

![](2838289-1effeaaa6413bc13.png)

# 图的存储

- 使用邻接表：
以顶点值为下标，构建数组，元素为与该顶点相连的顶点值，下面例子就是用邻接表存储。假设有顶点v1、v2、v3，且有边(v1, v2)、(v1, v3)、(v2, v3)
```js
var edges = [];
edges[v1] = [v2, v3];
edges[v2] = [v1, v3];
edges[v3] = [v1, v2];
```

- 使用邻接矩阵：
临界矩阵，简单说是个二维数组，假设有顶点v1、v2，并且v1、v2有边相连，则用邻接矩阵表示为：
```js
var edges = [];
edges[v1][v2] = 1;
// 若无边相连则为
edges[v1][v2] = 0;
```

# 图的javascript实现

**下面以上文中的无向图为例**
```js
function Graph() {
  this.edges = 0;
  this.vertices = [];
}

// 初始化顶点
Graph.prototype.initVertices = function(list) {
  if(toString.call(list) !== '[object Array]') {
    throw new TypeError('please init adj with Array');
  }
  for(item in list) {
    this.vertices[list[item]] = [];
  }
};

// 添加顶点的连结（边）
Graph.prototype.addEdge = function(v1, v2) {
  if(!this.vertices[v1] || !this.vertices[v2]) {
    throw new TypeError('vertex that does not exist！');
  }
  this.vertices[v1].push(v2);
  this.vertices[v2].push(v1);
  this.edges++; 
};


// 输出存储图的邻接表
Graph.prototype.showGraph = function() {
  for(item in this.vertices) {
    console.log(item+': ', this.vertices[item].join(','));
  }
};

var list = [1,2,3,4,5,6];
var graph = new Graph();
graph.initVertices(list);
graph.addEdge(1, 2);
graph.addEdge(1, 4);
graph.addEdge(1, 5);

graph.addEdge(2, 3);
graph.addEdge(2, 4);
graph.addEdge(2, 5);
graph.addEdge(2, 6);

graph.addEdge(3, 5);
graph.addEdge(3, 6);

graph.addEdge(4, 5);

graph.addEdge(5, 6);

graph.showGraph();
```

![](2838289-1e184a4fff1588ef.png)

PS：图当然是没有那么简单的啦，想了解图自己去看书吧
