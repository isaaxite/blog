const path = require('path');
const minimist = require('minimist');
const { migrate } = require('./migrate-assets');

const args = minimist(process.argv.slice(2), {
  string: ['input-dir', 'output-dir'],
  alias: {
    'inputDir': 'input-dir',
    'outputDir': 'output-dir',
  }
});

const { inputDir, outputDir } = args;
migrate(Object.entries({ inputDir, outputDir }).reduce((props, [key, value]) => {
  props[key] = path.resolve('source', value);
  return props;
}, {}));
