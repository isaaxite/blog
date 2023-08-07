const chalk = require('chalk');
const { logger } = require('hexo-log');
const { existsSync, ensureFileSync, writeFileSync } = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const DATE_FORMAT = 'YYYY/MM/DD';
const DATESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const JOURNAL_ROOT_DIR = '_journals';
const dateDirPath = dayjs().format(DATE_FORMAT);
const datestamp = dayjs().format(DATESTAMP_FORMAT);

const dayJournalDirpath = path.join(JOURNAL_ROOT_DIR, dateDirPath);
const filepath = path.join(dayJournalDirpath, 'index.md');
const absFilepath = path.resolve('source', filepath);

const hinter = logger();

function main() {
  if (existsSync(absFilepath)) {
    hinter.info(`${filepath} already exist`);
    return;
  }

  ensureFileSync(absFilepath);

  writeFileSync(absFilepath, [
    '---',
    `date: ${datestamp}`,
    '---'
  ].join('\n') + '\n');

  hinter.info(`Created: ${chalk.magentaBright(absFilepath)}`);
}

main();
