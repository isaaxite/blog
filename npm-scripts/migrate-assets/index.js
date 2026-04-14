const path = require('path');
const { createHint } = require('./src/hint');
const { createPrompt } = require('./src/prompt');
const { promptTransfer } = require('./src/main');
const { collectMdMeta } = require('./src/transfer');
const { PathTreeify } = require('path-treeify');
const assetDirName = 'assets';

const migrate = async ({ inputDir, outputDir }) => {
  const getPostPaths = () => {
    const post = collectMdMeta(inputDir);
    const data = Object.entries(post.title2mdFilepath).map(([title, postPath], idx) => ({
      title: `No.${idx+1} ${title}`,
      postPath,
    }));

    return data;
  };
  const getDirTree = () => {
    const ptf = new PathTreeify({
      base: outputDir,
      filter: ({ name }) => name !== assetDirName,
    });

    return ptf.build();
  };

  await promptTransfer(inputDir, {
    assetDirName,
    prompt: createPrompt({
      getPostPaths,
      getDirTree,
    }),
    hint: createHint(),
  }).catch((err) => {
    console.error(err);
  });
};

module.exports = { migrate };
