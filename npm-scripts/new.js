const crypto = require('crypto');
const { execSync } = require('child_process');
const layout = process.argv[2];
const title = process.argv[3];
let filename = process.argv[4];

if (!title) {
  console.error('Please provide a title for the new post.');
  process.exit(1);
}

function getHash(str) {
  return crypto.createHash('md5')
    .update(str)
    .digest('hex')
    .slice(0, 8);
}

filename = filename || getHash(title);
let postPath = `${title}/${filename}`;

if (layout === 'daily') {
  postPath = `生活记录/${postPath}`;
}

const command = `hexo new ${layout} "${title}" -p "${postPath}"`;
execSync(command, { stdio: 'inherit' });
