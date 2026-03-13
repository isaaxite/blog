const fs = require('fs');
const path = require('path');

hexo.extend.generator.register("post_assets", function () {
  const assetsFolder = hexo.config.assets_folder;

  if (!assetsFolder) {
    return [];
  }

  const cmdIsGenerate = hexo.env.cmd === 'generate' || hexo.env.cmd === 'g';

  if (!assetsFolder.enable || cmdIsGenerate && !assetsFolder.publish) {
    return [];
  }

  const assetsDirname = hexo.config.assets_folder.name || 'assets';
  const postDirPath = path.join(hexo.source_dir, '_posts');
  const getAssetsPath = (dirPath) => {
    const assetsPathArr = [];

    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        if (file === assetsDirname) {
          assetsPathArr.push(filePath);
        } else {
          assetsPathArr.push(...getAssetsPath(filePath));
        }
      }
    });
    return assetsPathArr;
  };

  const assetsPathArr = getAssetsPath(postDirPath);
  if (hexo.env.args.draft) {
    assetsPathArr.push(...getAssetsPath(path.join(hexo.source_dir, '_drafts')));
  }

  const assetFileArr = [];
  const deduplication = {};
  for (const assetsPath of assetsPathArr) {
    fs.readdirSync(assetsPath).forEach(file => {
      const assetFilepath = path.join(assetsPath, file);
      if (fs.statSync(assetFilepath).isDirectory()) {
        return;
      }

      if (deduplication[file]) {
        hexo.log.warn(`Duplicate asset filename detected: ${file}.`);
        hexo.log.warn(`Skipping ${path.relative(hexo.source_dir, assetFilepath)}.`);
        hexo.log.warn(`Using ${ path.relative(hexo.source_dir, deduplication[file])} instead.`);
        return;
      }

      assetFileArr.push({
        path: `assets/${file}`,
        data: function () {
          return fs.createReadStream(assetFilepath);
        }
      });
      deduplication[file] = assetFilepath
    });
  }

  return assetFileArr;
});

hexo.extend.filter.register("before_post_render", function (data) {
  if (data.layout !== 'post') {
    return data;
  }

  const cmdIsGenerate = hexo.env.cmd === 'generate' || hexo.env.cmd === 'g';
  const isSkipAssetsReplace = hexo.env.args['skipAssetsReplace'];
  const assets_folder = hexo.config.assets_folder;
  if (!assets_folder || !assets_folder.enable) {
    return data;
  }

  const assetsFolderName = assets_folder.name || 'assets';
  const assetsPattern = new RegExp(`(?<=\\]\\()(\\.\\/)?${assetsFolderName}\\/`, 'g');
  const lastAssetsPrefix = cmdIsGenerate && assets_folder.externalink && !isSkipAssetsReplace ? `${assets_folder.externalink}/` : `/${assetsFolderName}/`;

  data.content = data.content.replace(assetsPattern, lastAssetsPrefix);
  data.content = data.content.replace(new RegExp(`(?<=<(img|a)[^>]+(?:src|href)=["'])(\\.\\/)?${assetsFolderName}\\/`, 'g'), lastAssetsPrefix);
  return data;
});
