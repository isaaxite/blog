/* global hexo */

'use strict';

const { readdirSync, writeFileSync, readFileSync } = require('fs');
const path = require('path');
const { load } = require('js-yaml');

const FENCE = {
  start: '---',
  end: '---'
};

const PLACEHOLDER_CONTENT = '%CONTENT%';

let cnt = 0

function matchFrontmatter(txt) {
  const regexStr = `^${FENCE.start}\n([\\s\\S]*?)\n${FENCE.end}$`;
  const regex = new RegExp(regexStr, 'm');
  const match = regex.exec(txt);
  return match;
}

hexo.extend.filter.register('before_generate', function(){
  if (cnt > 1) {
    return;
  }
  cnt += 1;

  genListPage('daily');
  genListPage('games');
});

function genListPage(entryDirName) {
  const postDirpath = `source/${entryDirName}`;
  const dirnames = readdirSync(postDirpath).filter(s => path.parse(s).name !== 'index');
  const postPaths = dirnames.map(s => path.join(postDirpath, s, 'index.md'));
  const metadatas = postPaths.map(postPath => {
    const dirname = path.dirname(postPath);
    const ret = {
      title: dirname,
      dirname: dirname
    };
    const content = readFileSync(postPath, 'utf8');
    const match = matchFrontmatter(content);
    if (match) {
      const frontamtter = load(match[1]);
      ret.title = frontamtter.title || ret.title;
      return ret;
    }
    return ret;
  });

  const template = readFileSync(`source/${entryDirName}/index.template`, 'utf8');
  const listPagecontent = template.replace(
    PLACEHOLDER_CONTENT,
    metadatas.map(({ title, dirname }) => `- [${title}](${entryDirName}/${encodeURI(dirname)})`).join('\n')
  );

  writeFileSync(`source/${entryDirName}/index.md`, listPagecontent);
}
