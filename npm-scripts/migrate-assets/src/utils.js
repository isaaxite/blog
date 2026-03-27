function clearLine() {
  process.stdout.write('\x1B[1A\x1B[2K');
}

module.exports = {
  clearLine,
};
