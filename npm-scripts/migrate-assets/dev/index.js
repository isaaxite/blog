const { migrate } = require("../index");
const path = require('path');

// migrate({
//   inputDir: path.resolve('source', '_drafts'),
//   outputDir: path.resolve('source', '_posts'),
// });

migrate({
  inputDir: path.resolve('source', '_posts'),
  outputDir: path.resolve('source', '_drafts'),
});
