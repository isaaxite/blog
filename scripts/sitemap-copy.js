const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

let processedFiles = new Set();

hexo.on('generateAfter', () => {
  const config = hexo.config;
  const sitemapCopyConfig = config.sitemap.copy;
  const sourceDomain = config.url;
  const targetDomain = sitemapCopyConfig.url;
  const publicDir = hexo.public_dir;
  
  // 重置处理记录
  processedFiles.clear();

  const sitemapFileObjects = {};

  (config.sitemap.path || []).forEach(item => {
    sitemapFileObjects[path.extname(item)] = {
      source: path.join(publicDir, item),
      target: [],
    };
  });

  sitemapCopyConfig.path.forEach((slug) => {
    sitemapFileObjects[path.extname(slug)].target.push(path.join(publicDir, slug));
  });

  // 检查并处理文件
  const checkAndProcess = () => {
    Object.values(sitemapFileObjects).forEach(item => {
      const sourceFile = item.source;
      const targetFiles = item.target;
      
      // 如果已经处理过，跳过
      if (processedFiles.has(item.source)) return;
      
      if (fs.existsSync(sourceFile)) {
        try {
          let content = fs.readFileSync(sourceFile, 'utf8');
          // 验证文件是否完整（比如包含预期的内容）
          if (content.includes('<?xml') || content.includes('http')) {
            // 替换域名
            const escapedDomain = sourceDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            content = content.replace(new RegExp(escapedDomain, 'g'), targetDomain);
            
            // 写入新文件
            for (const targetFile of targetFiles) {
              fse.ensureFileSync(targetFile);
              fs.writeFileSync(targetFile, content, 'utf8');
              hexo.log.info(`Generated: ${targetFile}`);
              processedFiles.add(targetFile);
            }
            
          }
        } catch (error) {
          hexo.log.error(`处理文件 ${item.source} 时出错:`, error.message);
        }
      }
    });
    
    // 如果还有文件没处理完，继续检查
    if (processedFiles.size < sitemapCopyConfig.path.length) {
      setTimeout(checkAndProcess, 500);
    }
  };
  
  // 开始处理
  setTimeout(checkAndProcess, 300);
});
