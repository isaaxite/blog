const createHint = () => ({
  warn: (text) => {
    console.warn(text);
  },
  warnList: (textList) => {
    textList.forEach(console.warn);
  },
  error: (text) => {
    console.error(text);
  }
});

module.exports = { createHint };
