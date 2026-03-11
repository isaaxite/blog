const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

let processedFiles = new Set();

hexo.on('generateAfter', () => {
  const cmdIsGenerate = hexo.env.cmd === 'generate' || hexo.env.cmd === 'g';
  if (!cmdIsGenerate) {
    return;
  }

  const config = hexo.config;
  const plagiarizeConfig = config.sitemap.plagiarize;
  const sourceDomain = config.url;
  const publicDir = hexo.public_dir;
  const escapedDomain = sourceDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // 重置处理记录
  processedFiles.clear();

  const checkSourceIsExists = () => {
    for (const item of config.sitemap.path) {
      if (!fs.existsSync(path.join(publicDir, item))) {
        hexo.log.warn(`Plagiarize sitemap: Waiting for ${item} to be generated`);
        return false;
      }
    }
    return true;
  }

  // 检查并处理文件
  const checkAndProcess = () => {
    if (!checkSourceIsExists()) {
      setTimeout(checkAndProcess, 100);
      return;
    }

    for (const item of plagiarizeConfig) {
      const targetDomain = item.url;

      const sitemapFileObjects = {};
      (config.sitemap.path || []).forEach(item => {
        sitemapFileObjects[path.extname(item)] = {
          source: item,
          target: [],
        };
      });

      for (const slug of item.path) {
        sitemapFileObjects[path.extname(slug)].target.push(slug);
      }

      Object.values(sitemapFileObjects).forEach(item => {
        const sourceFile = path.join(publicDir, item.source);
        const targetFiles = item.target;

        if (!fs.existsSync(sourceFile)) {
          return;
        }
        
        try {
          let content = fs.readFileSync(sourceFile, 'utf8');
          // 验证文件是否完整（比如包含预期的内容）
          const isValidSource = content.includes('<?xml') || content.includes('http');

          if (!isValidSource) {
            return;
          }

          content = content.replace(new RegExp(escapedDomain, 'g'), targetDomain);
          
          // 写入新文件
          for (const targetFile of targetFiles) {
            const targetFilePath = path.join(publicDir, targetFile);
            fse.ensureFileSync(targetFilePath);
            fs.writeFileSync(targetFilePath, content, 'utf8');
            hexo.log.info(`Plagiarize sitemap generated: ${targetFile}`);
            processedFiles.add(targetFilePath);
          }
        } catch (error) {
          hexo.log.error(`Plagiarize sitemap: Error processing file ${item.source}:`, error.message);
        }
      });
    }
    
    // 如果还有文件没处理完，继续检查
    const count = plagiarizeConfig.reduce((sum, item) => {
      return sum + item.path.length;
    }, 0);

    if (processedFiles.size < count) {
      setTimeout(checkAndProcess, 500);
    }
  };
  
  // 开始处理
  setTimeout(checkAndProcess, 100);
});
