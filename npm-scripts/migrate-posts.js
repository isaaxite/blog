const path = require('path');
const minimist = require('minimist');
const { migrate } = require('./migrate-assets');

const args = minimist(process.argv.slice(2), {
  string: [
    'base',       // relative path
    'input-dir',  // relative to base
    'output-dir', // relative to base
  ],
  alias: {
    'inputDir': 'input-dir',
    'outputDir': 'output-dir',
  }
});

const { inputDir, outputDir } = args;
const base = path.resolve(args.base);
migrate({ base, inputDir, outputDir });
