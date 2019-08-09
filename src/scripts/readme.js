const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const SRC_DIR = 'src';
const SPE_NEWLINE = '\r\n';
const docsDir = path.resolve('./src/docs');
const conf = {
  showCount: 3,
  excludeCate: ['asset', 'dependencies', 'Recommend'],
  excludeFile: ['.conf', 'README.md']
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
        href: `./src/docs/${dirName}`,
        list: [],
        conf: []
      });
    }

    docsData.forEach((it) => {
      const srcDir = path.join(it.dir, SRC_DIR);
      let originalDirList;
      try {
        originalDirList = fs.readdirSync(srcDir);
      } catch (error) {
        originalDirList = [];
      }
      originalDirList.forEach((fileName) => {
        const filePath = path.join(srcDir, fileName);
        const stat = fs.statSync(filePath);
        const isFile = stat.isFile();
        const isConf = fileName === '.conf';
        const isExclude = conf.excludeFile.includes(fileName);
        if (isFile && !isConf && !isExclude) {
          it.list.push({
            name: _.escape(fileName),
            href: `${it.href}/${SRC_DIR}/${_.escape(fileName)}`
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
function initMdData(_docsData) {
  const topping = _docsData.map((it) => {
    const cache = new Set();;
    cache.add(`## ${it.name}`);
    for (let i = 0, len = it.list.length; i < len; i +=1) {
      const text = it.list[i];
      cache.add(`- [${text.name}](${text.href.slice(1)})`)
    }
    cache.add(`- [更多](${it.href})`);
    return Array.from(cache);
  });
  return topping;
}

function generateTopping(_docsData, _mdData) {
  const mdArr = [];
  const toppingConf = [];
  const noRepeat = [];
  _docsData.forEach((it) => {
    const cache = it.conf.filter((conf) => conf.topping);
    toppingConf.push(...cache);
  });
  if (toppingConf.length) {
    const href = './src/docs/Recommend';
    const titles = toppingConf.map((it) => `${it.name}.md`);
    const toppingMdList = [`## Recommend`];
    _mdData.forEach((it) => {
      it.forEach((text) => {
        const props = text.match(/\[(.*)\]\(.*\)/);
        if (props && titles.includes(props[1]) && !noRepeat.includes(props[1])) {
          toppingMdList.push(text);
          noRepeat.push(props[1]);
        }
      });
    })
    toppingMdList.push(`- [更多](${href})`);
    _mdData.unshift(toppingMdList);
    // console.log(_mdData[0])
  }

  return _mdData;
}

function homeCate(_mdData) {
  const spe = SPE_NEWLINE + SPE_NEWLINE;
  fs.writeFileSync('./README.md', _mdData.map((it) => {
    const lastIdx = it.length > 5 ? conf.showCount + 1 : it.length - 1;
    const data = it.slice(0, lastIdx);
    data.push(...it.slice(-1));
    return data.join(SPE_NEWLINE);
  }).join(spe) + SPE_NEWLINE);
}

function childCate(_mdData) {
  _mdData.forEach((it, index) => {
    const cate = it.pop();
    const props = cate.match(/\[.*\]\((.*)\)/);
    const dirPath = props[1];
    if (dirPath) {
      const filePath = path.join(dirPath, 'README.md');
      const innerText = it.join(SPE_NEWLINE) + SPE_NEWLINE;
      fs.writeFileSync(filePath, innerText);
    }
  });
}

const docsData = getDocsData();
let mdData = initMdData(docsData);
mdData = generateTopping(docsData, mdData);
homeCate(mdData);
childCate(mdData);

