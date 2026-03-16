const path = require('path');
const { createHint } = require('./src/hint');
const { createPrompt } = require('./src/prompt');
const { main } = require('./src/main');
const { collectMdMeta } = require('./src/transfer');
const { PathTree } = require('./src/utils');
const assetDirName = 'assets';

(async () => {
  const getPostPaths = () => {
    const post = collectMdMeta('source/_posts');
    const draft = collectMdMeta('source/_drafts');
    const data = Object.entries(post.title2mdFilepath).map(([title, postPath]) => ({ title, postPath }));

    for (const [title, postPath] of Object.entries(draft.title2mdFilepath)) {
      data.push({ title, postPath });
    }

    return data;
  };
  const getDirTree = () => {
    const pathTree = new PathTree({
      filter: ({ name }) => name !== assetDirName,
    });

    const dirPaths = [
      'source/_posts',
      'source/_drafts',
    ].map(it => path.resolve(it));

    return pathTree.buildByDirPaths(dirPaths);
  };

  main(path.resolve('source/'), assetDirName, {
    getHint: () => createHint(),
    getPrompt: () => createPrompt({
      getPostPaths,
      getDirTree,
    }),
  });

})()
