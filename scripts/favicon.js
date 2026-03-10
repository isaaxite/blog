// 在 <head> 中插入自定义的 favicon 链接
hexo.extend.filter.register('theme_inject', function(injects) {
  // 插入到 head 的末尾
  injects.head.raw('custom-favicon', [
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="icon" href="/icon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  ].join('\n'), {}, { cache: true });
});
