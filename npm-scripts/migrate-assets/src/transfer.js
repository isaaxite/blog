const fs = require('fs');
const path = require('path');

/**
 * 复制单个文件，自动创建目标目录
 * @param {string} src
 * @param {string} dest
 */
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/**
 * 剪切单个文件（复制后删除源文件）
 * @param {string} src
 * @param {string} dest
 */
function moveFile(src, dest) {
  copyFile(src, dest);
  fs.unlinkSync(src);
}

/**
 * 转移 md 文件及其引用资源到目标目录
 *
 * @param {string}   outputDir
 * @param {string}   mdFilePath
 * @param {object}   resources
 * @param {string[]} resources.move
 * @param {string[]} resources.copy
 * @returns {{ moved: string[], failed: { file: string, error: string }[] }}
 */
function transferFiles(
  outputDir,
  mdFilePath,
  resources,
) {
  if (!fs.existsSync(outputDir)) {
    console.error(`${outputDir} is not exist!`)
    process.exit(1);
  }

  const resolvedOutputDir = path.resolve(outputDir);
  const resolvedMdFile    = path.resolve(mdFilePath);
  const mdDir             = path.dirname(resolvedMdFile);

  const moved  = [];
  const copied  = [];
  const failed = {
    moved: [],
    copied: [],
  };

  const mdDestPath = path.join(resolvedOutputDir, path.basename(resolvedMdFile));
  moveFile(resolvedMdFile, mdDestPath);

  for (const url of (resources.move || [])) {
    const srcAbs  = path.resolve(mdDir, url);
    const destAbs = path.join(resolvedOutputDir, url);
    try {
      moveFile(srcAbs, destAbs);
      moved.push(url);
    } catch (error) {
      failed.moved.push(url);
    }
  }

  for (const url of (resources.copy || [])) {
    const srcAbs  = path.resolve(mdDir, url);
    const destAbs = path.join(resolvedOutputDir, path.normalize(url));

    try {
      copyFile(srcAbs, destAbs);
      copied.push(url);
    } catch (error) {
      failed.copied.push(url);
    }
  }

  return { moved, copied, failed };
}

/**
 * Recursively find all .md files under a directory
 * @param {string} dirPath
 * @returns {string[]}
 */
function findMdFiles(dirPath) {
  const resolvedDir = path.resolve(dirPath);

  try {
    fs.accessSync(resolvedDir, fs.constants.R_OK);
    if (!fs.statSync(resolvedDir).isDirectory()) {
      throw new Error(`Path exists but is not a directory: ${resolvedDir}`);
    }
  } catch (err) {
    throw new Error(`Directory is invalid or inaccessible: ${resolvedDir} (${err.message})`);
  }

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...walk(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }

    return results;
  }

  return walk(resolvedDir);
}

/**
 * Read and extract the title from a md file's front-matter
 * @param {string} filePath
 * @returns {{ title: string } | { error: string }}
 */
function readFrontMatterTitle(filePath) {
  const resolvedPath = path.resolve(filePath);

  try {
    fs.accessSync(resolvedPath, fs.constants.R_OK);
  } catch (err) {
    return { error: `File is inaccessible: ${resolvedPath} (${err.message})` };
  }

  const content = fs.readFileSync(resolvedPath, 'utf-8');

  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    return { error: 'Missing front-matter' };
  }

  const titleMatch = fmMatch[1].match(/^title:\s*(.+)$/m);
  if (!titleMatch) {
    return { error: 'front-matter has no title field' };
  }

  const title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
  return { title };
}

function collectMdMeta(dirpath) {
  const map = new Map();
  const mdFiles = findMdFiles(dirpath);
  const titles = [];
  for (const filepath of mdFiles) {
    const { title, error } = readFrontMatterTitle(filepath);

    if (error) {
      continue;
    }
    titles.push(title);
    map[title] = filepath;
  }

  return { titles, title2mdFilepath: map };
}

function normalizeDestPaths(outputDir, pathsObj) {
  if (!fs.existsSync(outputDir)) {
    console.error(`${outputDir} is not exist!`)
    process.exit(1);
  }

  const output = path.resolve(outputDir);
  const result = {};
  for (const [key, arr] of Object.entries(pathsObj)) {
    if (!result[key]) {
      result[key] = [];
    }

    for (const it of arr) {
      const dest = path.resolve(output, it);
      result[key].push({ src: it, dest });
    }
  }

  return result;
}

module.exports = {
  transferFiles,
  findMdFiles,
  readFrontMatterTitle,
  collectMdMeta,
  normalizeDestPaths,
};
