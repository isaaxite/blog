const { Signale } = require('signale');
const signale = new Signale();
const genOpt = (type, label) => ({
  types: { [type]: { label } }
});

const createHint = () => ({
  warn: (text) => {
    signale.warn(text);
  },
  /**
   * 
   * @param { main: { label: string, text: string }, subs: string[]} list 
   */
  warnList: ({ main, subs }) => {
    let signale = new Signale(genOpt('warn', main.label));
    signale.warn(main.text);

    if (!subs?.length) {
      return;
    }

    signale = new Signale(genOpt('warn', ''));
    for (const text of subs.slice(0, -1)) {
      signale.warn(`  ├── ${text}`);
    }
    signale.warn(`  └── ${subs.slice(-1)[0]}`);
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
