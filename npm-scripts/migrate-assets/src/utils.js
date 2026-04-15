const fs = require('fs');

function clearLine() {
  process.stdout.write('\x1B[1A\x1B[2K');
}

function checkFileExist(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

module.exports = {
  clearLine,
  checkFileExist,
};
