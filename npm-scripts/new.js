const crypto = require('crypto');
const { execSync } = require('child_process');
const layout = process.argv[2];
const title = process.argv[3];

function getHash(str) {
  return crypto.createHash('md5')
    .update(str)
    .digest('hex')
    .slice(0, 8);
}

const command = `hexo new ${layout} "${title}" -p "${title}/${getHash(title)}"`;
execSync(command, { stdio: 'inherit' });
