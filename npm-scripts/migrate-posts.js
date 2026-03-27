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
migrate({ inputDir, outputDir });
