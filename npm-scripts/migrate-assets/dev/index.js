const { migrate } = require("../index");
const path = require('path');

migrate({
  base: path.resolve('../'),
  inputDir: 'blog/source/_drafts',
  outputDir: 'blog/source/_posts',
});

// migrate({
//   inputDir: path.resolve('source', '_posts'),
//   outputDir: path.resolve('source', '_drafts'),
// });
