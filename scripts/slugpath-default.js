hexo.extend.filter.register('before_post_render', function(data) {
  // 如果文章没有设置 slugpath，则使用文件名
  if (!data.slugpath && ['post', 'draft'].includes(data.layout)) {
    const parts = data.slug.split('/');
    data.slugpath = parts[parts.length - 1];
  }
  return data;
});
