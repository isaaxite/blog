const { Signale } = require('signale');
const signale = new Signale();
const genOpt = (type, label) => ({
  types: { [type]: { label } }
});

const createHint = () => ({
  warn: (text) => {
    signale.warn(text);
  },
  warnList: (textList) => {
    textList.forEach((it) => signale.warn(it));
  },
  error: (text) => {
    signale.error(text);
  },
  success: (text, label) => {
    if (label) {
      const signale = new Signale(genOpt('success', label));
      return signale.success(text);
    }

    signale.success(text);
  },
  note: (text, label) => {
    if (label) {
      const signale = new Signale(genOpt('note', label));
      return signale.note(text);
    }

    signale.note(text);
  },
  copied: (text) => {
    const signale = new Signale(genOpt('success', 'copied'));
    signale.success(text);
  },
  moved: (text) => {
    const signale = new Signale(genOpt('success', 'moved'));
    signale.success(text);
  },
  fatal: (text, label) => {
    if (label) {
      const signale = new Signale(genOpt('fatal', label));
      return signale.fatal(text);
    }
    signale.fatal(text);
  },
});

module.exports = { createHint };
