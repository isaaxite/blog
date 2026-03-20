const path = require('path');
const { extractResourceLinks, classifyLinks, classifyLocalResources, readFrontMatterTitle, transferFiles } = require('./transfer');

async function promptTransferFiles(assetDirName, {
  prompt,
  hint,
}) {
  const postPaths = await prompt.selectPosts();
  const outputDirpath = await prompt.selectOutputDirPath();

  for (const mdFilepath of postPaths) {
    const { title } = readFrontMatterTitle(mdFilepath);
    const resourceData = await extractResourceLinks(mdFilepath);
    const resourceLinks = resourceData.map(it => it.url);
    const { localResource } = classifyLinks(resourceLinks);
    const mdFileDir = path.dirname(mdFilepath);
    const {
      inMdDir,
      outOfMdDir,
    } = classifyLocalResources(mdFileDir, assetDirName, localResource);

    const { inAssetDir, notAssetDir } = inMdDir;
    const transferAssets = {
      inAssetDir: inAssetDir.accessible,
      notAssetDir: [],
    };

    if (inAssetDir.inaccessible.length) {
      hint.warn(`引用了资源目录（${assetDirName}）不存在的资源！`);
      hint.warnList(inAssetDir.inaccessible);
      
      if (!(await prompt.confirm())) {
        continue;
      }
    }

    if (notAssetDir.accessible.length) {
      hint.warn(`引用了非资源目录（${assetDirName}）与《${title}》同级目录的资源！`);
      hint.warnList(notAssetDir.accessible);

      if (!(await prompt.confirm())) {
        continue;
      }

      transferAssets.notAssetDir.push(...notAssetDir.accessible);
    }

    if (notAssetDir.inaccessible.length) {
      hint.warn(`引用了非资源目录（${assetDirName}）与《${title}》同级目录不存在的资源！`);
      hint.warnList(notAssetDir.inaccessible);

      if (!(await prompt.confirm())) {
        continue;
      }
    }

    if (outOfMdDir.accessible.length) {
      hint.warn(`引用了非资源目录（${assetDirName}），《${title}》的上层目录的资源！`);
      hint.warnList(outOfMdDir.accessible);

      if (!(await prompt.confirm())) {
        continue;
      }

      transferAssets.notAssetDir.push(...outOfMdDir.accessible);
    }

    if (outOfMdDir.inaccessible.length) {
      hint.warn(`引用了非资源目录（${assetDirName}），《${title}》的上层目录的不存在资源！`);
      hint.warnList(outOfMdDir.inaccessible);

      if (!(await prompt.confirm())) {
        continue;
      }
    }

    let transferMode = 'copy';
    if (transferAssets.notAssetDir.length) {
      transferMode = await prompt.selectTransferMode();
    }

    const ret = transferFiles(outputDirpath, mdFilepath, {
      same: transferAssets.inAssetDir,
      outside: transferAssets.notAssetDir,
    }, transferMode);
  }
}

async function main(assetDirName, {
  getPrompt,
  getHint,
}) {
  return await promptTransferFiles(assetDirName, {
    prompt: getPrompt(),
    hint: getHint(),
  });
};

module.exports = { main };
