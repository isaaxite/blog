const path = require('path');
const { createHint } = require('./src/hint');
const { createPrompt } = require('./src/prompt');
const { main } = require('./src/main');
const { collectMdMeta } = require('./src/transfer');
const { PathTreeify } = require('path-treeify');
const assetDirName = 'assets';

const migrate = async ({ inputDir, outputDir }) => {
  const getPostPaths = () => {
    const post = collectMdMeta(path.join('source', inputDir));
    const data = Object.entries(post.title2mdFilepath).map(([title, postPath], idx) => ({
      title: `No.${idx+1} ${title}`,
      postPath,
    }));

    return data;
  };
  const getDirTree = () => {
    const ptf = new PathTreeify({
      base: path.resolve('source', outputDir),
      filter: ({ name }) => name !== assetDirName,
    });

    return ptf.build();
  };

  main(assetDirName, {
    getHint: () => createHint(),
    getPrompt: () => createPrompt({
      getPostPaths,
      getDirTree,
    }),
  });
};

module.exports = { migrate };
