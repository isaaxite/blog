const prompts = require('prompts');
const { clearLine } = require('./utils');

const createPrompt = ({
  getPostPaths,
  getDirTree,
}) => ({
  selectPosts: async function() {
    const { value } = await prompts({
      type: 'autocompleteMultiselect',
      name: 'value',
      message: 'Select posts to migrate',
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

    if (typeof value === 'undefined') {
      clearLine();
      process.exit(0);
    }

    if (!value.length) {
      clearLine();
      return await this.selectPosts();
    }

    return value;
  },
  selectOutputDirPath: async function() {
    const PREVIOUS = Symbol('previous');
    const USE_CURRENT = Symbol('use current');
    let node = getDirTree();

    while (true) {
      const choices = [{
        title: 'Current',
        value: USE_CURRENT,
        description: 'Use current directory',
      }];

      node.children.reduce((choices, it) => {
        const flag = it.children.length ? '/' : '';
        choices.push({
          title: `${it.value}${flag}`,
          value: it,
        });
        return choices;
      }, choices);

      const relative = node.getPath().relative;
      let message = 'Select directory to migrate to';
      message = relative ? `${message}(${relative})` : message;

      const ret = await prompts({
        type: 'select',
        name: 'value',
        message,
        choices: node.parent ? [
          { title: 'Previous', value: PREVIOUS, description: 'Return to parent directory' },
          ...choices,
        ] : choices,
      });

      if (typeof ret.value === 'undefined') {
        clearLine();
        process.exit(0);
      }

      if (ret.value === PREVIOUS) {
        node = node.parent;
        clearLine();
        continue;
      }

      if (ret.value === USE_CURRENT) break;

      node = ret.value;
      
      if (!node.children.length) break;

      clearLine();
    }

    return node.getPath().absolute;
  },
  selectTransferMode: async function(message) {
    const { value } = await prompts({
      type: 'select',
      name: 'value',
      message,
      choices: [
        { title: 'Copy', value: 'copy' },
        { title: 'Replace', value: 'replace' },
        { title: 'Skip', value: 'skip' },
      ],
    });

    if (typeof value === 'undefined') {
      clearLine();
      process.exit(0);
    }

    return value;
  },
  confirm: async function(text) {
    const { value } = await prompts({
      type: 'confirm',
      name: 'value',
      message: text || 'Continue?',
      initial: true
    });

    if (typeof value === 'undefined') {
      clearLine();
      process.exit(0);
    }

    return value;
  },
});

module.exports = { createPrompt };
