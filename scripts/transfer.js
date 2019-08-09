const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const axios = require('axios');
const tempData = require('../temp.json');

const docsDir = path.resolve('./docs');
const conf = {
  access_token: 'dbaf28b28c3a30cfff30e37cd09fa57809afa4d0',
  url: 'https://api.github.com/repos/issaxite/blog/issues'
}

axios.defaults.headers.common['Authorization'] = `token ${conf.access_token}`;

async function fetchIssues() {
  let isFinish = false;
  let page = 1;
  const issues = [];
  const perPage = 100;
  while(!isFinish && page < 10) {
    const url = `${conf.url}?page=${page}&per_page=${perPage}`
    const data = await axios.get(url).then((resp) => {
      return resp.data;
    }).catch((err) => {
      console.log(err);
    });
    isFinish = !data || !data.length;
    if (!isFinish) {
      issues.push(...data);
    }
    page += 1;
  }
  fs.writeFileSync('./temp.json', JSON.stringify(issues, null, 2));
}

async function handleIssues() {
  const issues = tempData.slice(0);
  for (const issue of issues) {
    const fname = issue.title.replace(/[\s\/\:]/g, '_');
    const catePaths = [];
    if (fname) {
      if (issue.labels && issue.labels.length) {
        for (const label of issue.labels) {
          const dir = path.join(docsDir, label.name);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          catePaths.push(dir);
        }
      } else {
        const dir = path.join(docsDir, 'others');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        catePaths.push(dir);
      }
      catePaths.forEach((catePath) => {
        const fPath = path.join(catePath, `${fname}.md`);
        catePath === '/mnt/d/workspace/github/blog/docs/dependencies' && console.log(fname);
        fs.writeFileSync(fPath, issue.body + '\r\n');
        initConf(catePath, issue);
      });
    }
  }
  
  // console.log(issues);
}

function initConf(_cateDir, _data) {
  let conf;
  let oldText;
  const { title: name, created_at, updated_at } = _data;
  const confPath = path.join(_cateDir, `.conf`);
  if (!fs.existsSync(_cateDir)) {
    fs.mkdirSync(_cateDir);
  }
  try {
    oldText = fs.readFileSync(confPath);
  } catch (error) {
    console.log(error);
    oldText = '[]';
  }
  try {
    conf = JSON.parse(oldText) || [];
  } catch (error) {
    conf = [];
    console.log(error);
    throw error;
  }
  let isRepeat = false;
  for (const it of conf) {
    if (it.name === _data.title) {
      isRepeat = true;
      Object.assign(it,  { name, updated_at });
      break;
    }
  }
  if (!isRepeat) {
    conf.push({
      name,
      created_at,
      updated_at,
      topping: false
    });
  }
  fs.writeFileSync(confPath, JSON.stringify(conf, null, 2));
}


async function init() {
  await handleIssues();
}

init();
