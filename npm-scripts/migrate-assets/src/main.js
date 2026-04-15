const path = require('path');
const { readFrontMatterTitle, transferFiles, normalizeDestPaths } = require('./transfer');
const { LinkHarvester, DetectType, LinkTarget } = require('link-harvester');
const { checkFileExist } = require('./utils');

/**
 * promptTransfer
 * @param {*} baseAbsPath 
 * @param {*} inputDir dir path relative to base
 * @param {*} param2
 */
async function promptTransfer(baseAbsPath, inputDir, {
  assetDirName,
  prompt,
  hint,
}) {
  const inputDirAbs = path.join(baseAbsPath, inputDir);
  const postPaths = await prompt.selectPosts();
  const outputDirpath = await prompt.selectOutputDirPath();
  const isFileInDirectory = (base, filePath) => {
    const dir = base.endsWith(path.sep) ? base : base + path.sep;
    return filePath.startsWith(dir);
  }

  const result = {};

  for (const postPath of postPaths) {
    const { title } = readFrontMatterTitle(postPath);
    let harvester = new LinkHarvester({
      base: inputDirAbs,
      filePath: postPath,
    });
    const dirPath = path.dirname(postPath);
    const assetsDirPath = path.join(dirPath, assetDirName);
    let linksData = await harvester.gather()
      .filterBy(LinkTarget.LocalResource)
      .detect(DetectType.Accessible)
      .detect(DetectType.ExternalRefs)
      .classify({
        accessible: it => it.accessible,
        invalid: 'rest',
      });
    harvester = null;

    if (linksData.invalid.length) {
      hint.warnList({
        main: {
          label: 'invalid reference exists',
          text: title,
        },
        subs: linksData.invalid.map(it => it.syntax),
      });
    }

    let srcs = {
      post: postPath,
      move: [],
      copy: [],
    };

    linksData.accessible.reduce((data, it) => {
      const assetAbsPath = path.join(dirPath, it.url);
      if (
        it.externalRefs.length
        || !isFileInDirectory(inputDirAbs, assetAbsPath)
      ) {
        data.copy.push(it.url);
      } else if (isFileInDirectory(assetsDirPath, assetAbsPath)) {
        data.move.push(it.url);
      }
      return data;
    }, srcs);
    linksData = null;

    let dests = normalizeDestPaths(outputDirpath, {
      ...srcs,
      post: [path.basename(postPath)],
    });
    srcs = null;
    dests.post = dests.post[0];

    if (checkFileExist(dests.post.dest) && !(await prompt.confirm(
      `[${path.relative(baseAbsPath, dests.post.dest)}] is exist, continue?`
    ))) {
      process.exit(0);
    }

    const newMove = [];
    const newCopy = [];
    const preProcess = async (data, cb) => {
      for (const it of data) {
        if (!checkFileExist(it.dest)) {
          cb(it);
          continue;
        }

        hint.warnList({
          main: { label: 'dest exist', text: it.src },
          subs: [
            `from:  ${path.relative(baseAbsPath, path.join(dirPath, it.src))}`,
            `to:    ${path.relative(baseAbsPath, it.dest)}`
          ]
        });

        const mode = await prompt.selectTransferMode('Choose how to handle?');

        switch(mode) {
          case 'copy':
            newCopy.push(it);
            break;
          case 'replace':
            newMove.push(it);
            break;
          case 'skip':
          default:
            // notthing to do!
        }
      }
    };

    await preProcess(dests.move, (it) => newMove.push(it));
    await preProcess(dests.copy, (it) => newCopy.push(it));

    dests.move - newMove;
    dests.copy = newCopy;

    const resources = { move: [], copy: [] };
    resources.move = dests.move.map(it => it.src);
    resources.copy = dests.copy.map(it => it.src);
    newMove.length = 0;
    newCopy.length = 0;
    dests = null;

    result[postPath] = transferFiles(outputDirpath, postPath, resources);
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
