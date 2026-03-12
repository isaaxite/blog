hexo.extend.injector.register('head_begin', () => {
  const faviconConf = hexo.config.favicon;

  if (!faviconConf) {
    return;
  }

  const linkTagArr = [];

  for (const favicon of faviconConf) {
    const { rel, href, ...attrs } = favicon;
    if (!favicon.href) {
      hexo.log.warn(`Favicon config error: Missing 'href' in ${JSON.stringify(favicon)}`);
      continue;
    }

    const strArr = [
      `rel="${rel || 'icon'}"`,
      `href="${href}"`,
    ];

    for (const [key, value] of Object.entries(attrs)) {
      strArr.push(`${key}="${value}"`);
    }

    linkTagArr.push(`<link ${strArr.join(' ')}>`);
  }

  return linkTagArr.join('\n');
});
