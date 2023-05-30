/* global hexo */

'use strict';

// const util = require('util');
var assign = require('object-assign');
var pagination = require('hexo-pagination');

hexo.config.exindex_generator = assign({
  per_page: typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page,
  order_by: '-date'
}, hexo.config.exindex_generator);

const generator = function(locals){
  var config = this.config;
  var posts = locals.posts;
  let exclude = hexo.config.exindex_generator.exclude || {};
  const excludeTags = (exclude.tags || '').split(',');
  // console.info(exclude, excludeTags)

  posts.data = posts.data.filter(function(it) {
    // console.info(Object.keys(it))
    const carTags = it.tags.data.map(it => it.name);
    const isExclude = excludeTags.some(it => carTags.includes(it));

    // console.info(it.title, ': ', isExclude, carTags)
    return !isExclude;
  }); 

  posts.data = posts.data.sort(function(a, b) {
    if(a.top && b.top) { // 两篇文章top都有定义
      if(a.top == b.top) return b.date - a.date; // 若top值一样则按照文章日期降序排
      else return b.top - a.top; // 否则按照top值降序排
    }
    else if(a.top && !b.top) { // 以下是只有一篇文章top有定义，那么将有top的排在前面（这里用异或操作居然不行233）
      return -1;
    }
    else if(!a.top && b.top) {
      return 1;
    }
    else return b.date - a.date; // 都没定义按照文章日期降序排
  });

  // console.info(util.format('%o', posts.data.map((it) => {
  //   return it.title;
  // })))

  var paginationDir = config.pagination_dir || 'page';
  return pagination('', posts, {
    perPage: config.exindex_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};


hexo.extend.generator.register('exindex_generator', function(locals) {
  const ret = generator.call(this, locals);
  return ret;
});
