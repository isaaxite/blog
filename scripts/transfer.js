const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const axios = require('axios');
const tempData = require('../temp.json');

const docsDir = path.resolve('./docs');
const conf = {
  url: 'https://api.github.com/repos/issaxite/issaxite.github.io/issues?access_token=5b567d9b1cb45925c286c28b748265f6141523c5'
}

async function getIssues() {
  // const { data: issues } = await axios.get(conf.url);
  // fs.writeFileSync('./temp.json', JSON.stringify(issues, null, 2));
  const issues = tempData.slice(0);
  console.log(issues.length);
  for (const issue of issues) {
    const fname = issue.title.replace(/[\s\/]/g, '_');
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
      });
    }
  }
  
  // console.log(issues);
}
async function init() {
  await getIssues();
}

init();
