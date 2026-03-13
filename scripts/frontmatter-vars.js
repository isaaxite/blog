const crypto = require('crypto');

/**
 * 获取 Hexo permalink 占位符的值
 * @param {string} placeholder - 占位符名称（不含冒号），如 'year', 'month' 等
 * @param {object} post - Hexo 文章对象
 * @param {string} [defaultCategory='uncategorized'] - 默认分类
 * @returns {string} 占位符对应的值
 */
function getPlaceholderVal(placeholder, post, defaultCategory = 'uncategorized') {
  const date = post.date ? new Date(post.date) : new Date();

  const pad = (n) => String(n).padStart(2, '0');

  const map = {
    // 年份（4位）
    year: () => String(date.getFullYear()),

    // 月份（2位，含前导零）
    month: () => pad(date.getMonth() + 1),

    // 月份（不含前导零）
    i_month: () => String(date.getMonth() + 1),

    // 日期（2位，含前导零）
    day: () => pad(date.getDate()),

    // 日期（不含前导零）
    i_day: () => String(date.getDate()),

    // 小时（2位）
    hour: () => pad(date.getHours()),

    // 分钟（2位）
    minute: () => pad(date.getMinutes()),

    // 秒钟（2位）
    second: () => pad(date.getSeconds()),

    // Unix 时间戳（秒）
    timestamp: () => String(Math.floor(date.getTime() / 1000)),

    // 文件名（相对于 source/_posts/）
    title: () => post.slug || post.title || '',

    // 文件名（不含路径）
    name: () => {
      const slug = post.slug || post.title || '';
      return slug.split('/').pop();
    },

    // 文章标题
    post_title: () => post.title || '',

    // 文章 ID
    id: () => String(post._id || post.id || ''),

    // 分类（取第一个，若无则用默认值）
    category: () => {
      const cats = post.categories;
      if (cats && cats.length > 0) {
        // 兼容 Hexo warehouse 对象或普通数组
        const first = cats.toArray ? cats.toArray()[0] : cats[0];
        return (first && (first.slug || first.name)) || defaultCategory;
      }
      return defaultCategory;
    },

    // SHA1 哈希（文件名 + 日期，取前12位十六进制）
    hash: () => {
      const title = post.slug || post.title || '';
      const dateStr = date.toISOString();
      return crypto
        .createHash('sha1')
        .update(title + dateStr)
        .digest('hex')
        .slice(0, 12);
    },
  };

  const fn = map[placeholder];
  if (!fn) {
    console.warn(`[getPlaceholderVal] 未知占位符: :${placeholder}`);
    return '';
  }

  return fn();
}

hexo.extend.filter.register("before_post_render", function (data) {
  const frontMatterVars = hexo.config.front_matter_vars || [];

  if (!['post', 'draft'].includes(data.layout)) {
    return data;
  }

  for (const item of frontMatterVars) {
    const { raw, final } = item;
    if (!raw) {
      continue;
    }

    const finalVarname = final || `final_${raw}`
    data[final] = data[raw];
    if (!data[raw]) {
      data[final] = item.default.replace(/:([a-z_]+)/g, (match, key) => {
        const val = getPlaceholderVal(key, data, hexo.config.default_category || 'uncategorized');
        return val !== '' ? val : match; // 未知占位符保留原样
      });
    }
  }

  return data;
});

