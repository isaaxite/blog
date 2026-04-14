const path = require('path');
const { readFrontMatterTitle, transferFiles } = require('./transfer');
const { LinkHarvester, DetectType, LinkTarget } = require('link-harvester');

async function promptTransfer(inputDir, {
  assetDirName,
  prompt,
  hint,
}) {
  const postPaths = await prompt.selectPosts();
  const outputDirpath = await prompt.selectOutputDirPath();
  const isFileInDirectory = (base, filePath) => {
    const dir = base.endsWith(path.sep) ? base : base + path.sep;
    return filePath.startsWith(dir);
  }

  const result = {};

  for (const mdFilepath of postPaths) {
    const { title } = readFrontMatterTitle(mdFilepath);
    const harvester = new LinkHarvester({
      base: inputDir,
      filePath: mdFilepath,
    });
    const dirPath = path.dirname(mdFilepath);
    const assetsDirPath = path.join(dirPath, assetDirName);
    const linksData = await harvester.gather()
      .filterBy(LinkTarget.LocalResource)
      .detect(DetectType.Accessible)
      .detect(DetectType.ExternalRefs)
      .classify({
        accessible: it => it.accessible,
        invalid: 'rest',
      });

    if (linksData.invalid.length) {
      hint.warn(`《${title}》引用了不存在的资源！`);
      hint.warnList(linksData.invalid.map(it => it.syntax));

      if (!(await prompt.confirm())) {
        continue;
      }
    }

    const resources = {
      move: [],
      copy: [],
    };

    linksData.accessible.reduce((data, it) => {
      const assetAbsPath = path.join(dirPath, it.url);
      if (
        it.externalRefs.length
        || !isFileInDirectory(inputDir, assetAbsPath)
      ) {
        data.copy.push(it.url);
      } else if (isFileInDirectory(assetsDirPath, assetAbsPath)) {
        data.move.push(it.url);
      }
      return data;
    }, resources);

    result[mdFilepath] = transferFiles(outputDirpath, mdFilepath, resources);
  }

  try {
    const hasFailed = (failed) => failed.moved.length || failed.copied.length;
    for (const [filePath, ret] of Object.entries(result)) {
      const { failed, moved, copied } = ret;
      const basename = path.basename(filePath);
      const successLabel = `assets - moved(${moved.length}) copied(${copied.length})`;
      const failedLabel = `failed(moved: ${failed.moved.length}, copied: ${failed.copied.length})`;

      hasFailed(failed)
        ? hint.note(basename, `${successLabel} ${failedLabel}`)
        : hint.success(basename, successLabel);

      failed.moved.forEach((asset) => hint.fatal(asset, 'moved'));
      failed.copied.forEach((asset) => hint.fatal(asset, 'copied'));
    }
  } catch (error) {
    throw error;
  }
}

module.exports = { promptTransfer };
