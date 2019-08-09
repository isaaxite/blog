const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const axios = require('axios');

const docsDir = path.resolve('./src/docs');
const conf = {
  access_token: 'ab8aa5166073cdaf6aa5da3668767e6a632c983e',
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
  return issues;
}

function formatTitle(_title) {
  const title =  _title.replace(/[\s\/\:]/g, '_');
  return title;
}

async function handleIssues() {
  let tempData;
  try {
    tempData = fs.readFileSync('./temp.json');
    tempData = JSON.parse(tempData);
  } catch (error) {
    console.log(error);
    tempData = [];
  }
  const issues = tempData;
  for (const issue of issues) {
    const fname = formatTitle(issue.title);
    const catePaths = [];
    if (fname) {
      if (issue.labels && issue.labels.length) {
        for (const label of issue.labels) {
          const dir = path.join(docsDir, label.name);
          const srcDir = path.join(dir, 'src');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          if (!fs.existsSync(srcDir)) {
            fs.mkdirSync(srcDir);
          }
          catePaths.push(srcDir);
        }
      } else {
        const dir = path.join(docsDir, 'others');
        const srcDir = path.join(dir, 'src');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        if (!fs.existsSync(srcDir)) {
          fs.mkdirSync(srcDir);
        }
        catePaths.push(srcDir);
      }
      catePaths.forEach((catePath) => {
        const fPath = path.join(catePath, `${fname}.md`);
        if (issue.body) {
          fs.writeFileSync(fPath, `# ${fname}\r\n\r\n${issue.body}\r\n`);
          initConf(catePath, issue);
        }
      });
    }
  }
  
  // console.log(issues);
}

function initConf(_cateDir, _data) {
  let conf;
  let oldText;
  const { title, created_at, updated_at } = _data;
  const name = formatTitle(title);
  const confPath = path.join(_cateDir, `.conf`);
  const confPath1 = path.join(_cateDir, `2.conf`);
  try {
    fs.unlinkSync(confPath1); 
  } catch (error) {
    
  }
  if (!fs.existsSync(_cateDir)) {
    fs.mkdirSync(_cateDir);
  }
  try {
    oldText = fs.readFileSync(confPath);
  } catch (error) {
    // console.log(error);
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
    if (it.name === name) {
      isRepeat = true;
      Object.assign(it,  { name, updated_at });
      break;
    }
  }
  if (!isRepeat) {
    conf.push({
      name,
      path: path.join(_cateDir, name),
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
