const path = require('path');
const prompts = require('prompts');

const createPrompt = ({
  getPostPaths,
  getDirTree,
}) => ({
  selectPosts: async function() {
    const { value } = await prompts({
      type: 'autocompleteMultiselect',
      name: 'value',
      message: '选择文章',
      instructions: false,
      choices: () => {
        const ret = [];
        for (const { title, postPath: value } of getPostPaths()) {
          ret.push({ title, value });
        }
        return ret;
      },
      hint: '- Space to select. Return to submit'
    });
    return value;
  },
  selectOutputDirPath: async function() {
    const PREVIOUS = Symbol('previous');
    const USE_CURRENT = Symbol('use current');
    const getPath = (node) => {
      if (!node.parent) {
        return '';
      }
      const sup = getPath(node.parent);
      return sup ? `${sup}${path.sep}${node.value}` : node.value;
    };

    let node = getDirTree();
    while (true) {
      const choices = node.children.map(it => ({
        title: it.value,
        value: it
      }));
      const ret = await prompts({
        type: 'select',
        name: 'value',
        message: `选择目标目录`,
        choices: node.parent ? [
          { title: 'Previous', value: PREVIOUS },
          { title: 'Use Current', value: USE_CURRENT },
          ...choices,
        ] : choices,
      });

      if (ret.value === PREVIOUS) {
        node = node.parent;
        continue;
      }

      if (ret.value === USE_CURRENT) break;

      node = ret.value;
      
      if (!node.children.length) break;
    }

    return getPath(node);
  },
  // inputDir() {
  //   return inquirer.createPromptModule()({
  //     type: 'input',
  //     name: 'dirpath',
  //     message: '输入输出目录路径',
  //   }).then(({ dirpath }) => dirpath);
  // },
  selectTransferMode: async function() {
    const { value } = await prompts({
      type: 'select',
      name: 'value',
      message: '选择转移非资源目录资源的方式',
      choices: [
        { title: '复制', value: 'copy' },
        { title: '剪切', value: 'cut' },
      ],
    });
    return value;
  },
  confirm: async function(text) {
    const { value } = await prompts({
      type: 'confirm',
      name: 'value',
      message: text || '是否继续？',
      initial: true
    });

    return value;
  },
});

module.exports = { createPrompt };
