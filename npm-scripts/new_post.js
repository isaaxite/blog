const crypto = require('crypto');
const { execSync } = require('child_process');
const title = process.argv[2];

function getHash(str) {
  return crypto.createHash('md5')
    .update(str)
    .digest('hex')
    .slice(0, 8);
}

const command = `hexo new -p "${title}/${getHash(title)}" "${title}"`;
execSync(command, { stdio: 'inherit' });
