const signale = require('signale');

const createHint = () => ({
  warn: (text) => {
    signale.warn(text);
  },
  warnList: (textList) => {
    textList.forEach((it) => signale.warn(it));
  },
  error: (text) => {
    signale.error(text);
  }
});

module.exports = { createHint };
