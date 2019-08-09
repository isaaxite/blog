const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const SPE_NEWLINE = '\r\n';
const docsDir = path.resolve('./docs');
const conf = {
  showCount: 3,
  excludeCate: ['asset', 'dependencies'],
  excludeFile: ['.conf', 'readme.md']
};

function getDocsData() {
  const originalDocsDirList = fs.readdirSync(docsDir);
  const docsData = [];
  originalDocsDirList.forEach((dirName) => {
    const dirPath = path.join(docsDir, dirName);
    const stat = fs.statSync(dirPath);
    const isDir = stat.isDirectory();
    const isExclude = conf.excludeCate.includes(dirName);
    if (isDir && !isExclude) {
      docsData.push({
        name: dirName,
        dir: dirPath,
        href: `./docs/${dirName}`,
        list: []
      });
    }

    docsData.forEach((it) => {
      const originalDirList = fs.readdirSync(it.dir);
      originalDirList.forEach((fileName) => {
        const filePath = path.join(it.dir, fileName);
        const stat = fs.statSync(filePath);
        const isFile = stat.isFile();
        const isConf = fileName === '.conf';
        const isExclude = conf.excludeFile.includes(fileName);
        if (isFile && !isConf && !isExclude) {
          it.list.push({
            name: _.escape(fileName),
            href: `${it.href}/${_.escape(fileName)}`
          });
        } else if (isConf) {
          let confData;
          try {
            confData = fs.readFileSync(filePath);
            confData = JSON.parse(confData);
          } catch (error) {
            confData = [];
          }
          it.conf = confData;
        }
      });
    });
  });
  return docsData;
}

const noRepeat = [];
function initTopping(_docsData) {
  const topping = _docsData.map((it) => {
    const cache = new Set();;
    cache.add(`## [${it.name}](${it.href})`);
    for (let i = 0, len = it.list.length; i < len; i +=1) {
      const text = it.list[i];
      cache.add(`- [${text.name}](${text.href})`)
    }
    cache.add(`- [更多](${it.href}/README.md)`);
    return Array.from(cache);
  });
  return topping;
}

function homeCate() {
  const spe = SPE_NEWLINE + SPE_NEWLINE;
  fs.writeFileSync('./README.md', mdData.map((it) => {
    const lastIdx = it.length > 5 ? conf.showCount + 1 : it.length - 1;
    const data = it.slice(0, lastIdx);
    data.push(...it.slice(-1));
    return data.join(SPE_NEWLINE);
  }).join(spe) + SPE_NEWLINE);
}

function childCate(_mdData) {
  _mdData.forEach((it) => {
    const cate = it[0];
    const props = cate.match(/\[.*\]\((.*)\)/);
    const dirPath = props[1];
    const filePath = path.join(dirPath, 'README.md');
    const innerText = it.slice(0, -1).join(SPE_NEWLINE) + SPE_NEWLINE;
    fs.writeFileSync(filePath, innerText);
  });
}

const docsData = getDocsData();
const mdData = initTopping(docsData); 
homeCate(mdData);
childCate(mdData);

