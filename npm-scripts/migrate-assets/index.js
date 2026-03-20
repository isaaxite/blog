const path = require('path');
const { createHint } = require('./src/hint');
const { createPrompt } = require('./src/prompt');
const { main } = require('./src/main');
const { collectMdMeta } = require('./src/transfer');
const { PathTreeify } = require('path-treeify');
const assetDirName = 'assets';

(async () => {
  const getPostPaths = () => {
    const post = collectMdMeta('source/_posts');
    const draft = collectMdMeta('source/_drafts');
    const data = Object.entries(post.title2mdFilepath).map(([title, postPath]) => ({
      title: `${title} [post]`,
      postPath,
    }));

    Object.entries(draft.title2mdFilepath).reduce((data, [title, postPath]) => {
      data.push({ title: `${title} [draft]`, postPath });
      return data;
    }, data);

    return data;
  };
  const getDirTree = () => {
    const ptf = new PathTreeify({
      base: path.resolve('source'),
      filter: ({ name }) => name !== assetDirName,
    });

    return ptf.buildBy(['_posts', '_drafts']);
  };

  main(assetDirName, {
    getHint: () => createHint(),
    getPrompt: () => createPrompt({
      getPostPaths,
      getDirTree,
    }),
  });
})()
