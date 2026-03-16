const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * 对本地资源链接进行多维分类
 * @param {string}   mdDir        - md 文件所在目录（真实可访问）
 * @param {string}   assetDirName - 资源目录名，如 'assets'
 * @param {string[]} localResources - classifyLinks 返回的 localResource 数组
 * @returns {object} 分类对象
 */
function classifyLocalResources(mdDir, assetDirName, localResources) {
  // 1. 验证 mdDir 有效
  try {
    fs.accessSync(mdDir, fs.constants.R_OK);
    if (!fs.statSync(mdDir).isDirectory()) {
      throw new Error(`路径存在但不是一个目录：${mdDir}`);
    }
  } catch (err) {
    throw new Error(`目录无效或不可访问：${mdDir}（${err.message}）`);
  }

  const resolvedMdDir = path.resolve(mdDir);

  const result = {
    inMdDir: {
      inAssetDir: {
        accessible: [],
        inaccessible: [],
      },
      notAssetDir: {
        accessible: [],
        inaccessible: [],
      },
    },
    outOfMdDir: {
      accessible: [],
      inaccessible: [],
    },
  };

  for (const url of localResources) {
    const resolvedUrl = path.resolve(resolvedMdDir, url);

    // 通用：判断链接是否可访问
    const isAccessible = (() => {
      try {
        fs.accessSync(resolvedUrl, fs.constants.R_OK);
        return true;
      } catch {
        return false;
      }
    })();

    // 2. 判断是否属于 mdDir 目录下
    const isInMdDir =
      resolvedUrl === resolvedMdDir ||
      resolvedUrl.startsWith(resolvedMdDir + path.sep);

    if (!isInMdDir) {
      // 5~6. 不属于 mdDir
      isAccessible
        ? result.outOfMdDir.accessible.push(url)
        : result.outOfMdDir.inaccessible.push(url);
      continue;
    }

    // 3. 属于 mdDir，判断是否在名为 assetDirName 的子目录下
    const relativeToMd = path.relative(resolvedMdDir, resolvedUrl);
    const topLevelName = relativeToMd.split(path.sep)[0];
    const isInAssetDir = topLevelName === assetDirName;

    // 4. 按 inAssetDir / notAssetDir + accessible 归类
    if (isInAssetDir) {
      isAccessible
        ? result.inMdDir.inAssetDir.accessible.push(url)
        : result.inMdDir.inAssetDir.inaccessible.push(url);
    } else {
      isAccessible
        ? result.inMdDir.notAssetDir.accessible.push(url)
        : result.inMdDir.notAssetDir.inaccessible.push(url);
    }
  }

  return result;
}

const RESOURCE_EXTENSIONS = new Set([
  // 图片
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'avif',
  // 文档
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  // 视频
  'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv',
  // 音频
  'mp3', 'wav', 'flac', 'aac', 'm4a',
  // 压缩包 / 其他
  'zip', 'tar', 'gz', 'rar', '7z', 'dmg', 'exe', 'apk',
  // 字体
  'woff', 'woff2', 'ttf', 'otf',
]);

function isResourceUrl(url) {
  try {
    const cleanPath = url.split('?')[0].split('#')[0];
    const ext = cleanPath.split('.').pop().toLowerCase();
    return RESOURCE_EXTENSIONS.has(ext);
  } catch {
    return false;
  }
}

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
 * @param {string}   outputDir        - 目标输出目录
 * @param {string}   mdFilePath       - 需要移动的 md 文件路径
 * @param {object}   resources        - 资源链接数据
 * @param {string[]} resources.same   - md 同级目录下的资源链接（相对路径）
 * @param {string[]} resources.outside - 非同级目录下的资源链接（相对路径）
 * @param {'copy'|'cut'} outsideMode  - 非同级资源的转移方式，默认 'copy'
 * @returns {{ moved: string[], failed: { file: string, error: string }[] }}
 */
function transferFiles(outputDir, mdFilePath, resources, outsideMode = 'copy') {
  // 验证目标输出目录，不存在则退出

  if (!fs.existsSync(outputDir)) {
    console.error(`${outputDir} is not exist!`)
    process.exit(1);
  }

  const resolvedOutputDir = path.resolve(outputDir);
  const resolvedMdFile    = path.resolve(mdFilePath);
  const mdDir             = path.dirname(resolvedMdFile);

  const moved  = [];
  const failed = [];

  /**
   * 执行单个文件转移
   * @param {string} srcAbs   - 源文件绝对路径
   * @param {string} destAbs  - 目标文件绝对路径
   * @param {'copy'|'cut'} mode
   */
  function transfer(srcAbs, destAbs, mode) {
    try {
      if (mode === 'cut') {
        moveFile(srcAbs, destAbs);
      } else {
        copyFile(srcAbs, destAbs);
      }
      moved.push(destAbs);
    } catch (err) {
      failed.push({ file: srcAbs, error: err.message });
    }
  }

  // ── 1. 转移 md 文件本身 ────────────────────────────────────────
  const mdDestPath = path.join(resolvedOutputDir, path.basename(resolvedMdFile));
  transfer(resolvedMdFile, mdDestPath, 'cut');

  // ── 2. 转移同级目录下的资源（保持相对结构）────────────────────
  //    相对路径基准：md 文件所在目录
  //    目标位置：outputDir 下保持同样的相对结构
  for (const url of (resources.same || [])) {
    const srcAbs  = path.resolve(mdDir, url);
    const destAbs = path.join(resolvedOutputDir, url);
    transfer(srcAbs, destAbs, 'cut');
  }

  // ── 3. 转移非同级目录下的资源（保持相对结构）─────────────────
  //    相对结构：资源相对 md 目录的路径保持不变
  for (const url of (resources.outside || [])) {
    const srcAbs  = path.resolve(mdDir, url);
    // url 可能含 ../，用 path.normalize 保留层级关系写入目标目录
    const destAbs = path.join(resolvedOutputDir, path.normalize(url));
    transfer(srcAbs, destAbs, outsideMode);
  }

  return { moved, failed };
}

/**
 * 对 URL 字符串数组进行分类
 * @param {string[]} urls
 * @returns {{
 *   externalPage: string[],
 *   externalResource: string[],
 *   localResource: string[],
 *   inPageAnchor: string[],
 *   other: string[]
 * }}
 */
function classifyLinks(urls) {
  const result = {
    externalPage: [],
    externalResource: [],
    localResource: [],
    inPageAnchor: [],
    other: [],
  };

  for (const url of urls) {
    const trimmed = (url || '').trim();

    if (!trimmed) {
      result.other.push(url);
      continue;
    }

    // ── 1. 文内引用：URL 以 # 开头 ──────────────────────────────
    if (trimmed.startsWith('#')) {
      result.inPageAnchor.push(url);
      continue;
    }

    // ── 2. 外链：http / https 开头 ──────────────────────────────
    if (/^https?:\/\//i.test(trimmed)) {
      if (isResourceUrl(trimmed)) {
        result.externalResource.push(url);
      } else {
        result.externalPage.push(url);
      }
      continue;
    }

    // ── 3. 非 http 协议（mailto、ftp、javascript 等）→ other ────
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
      result.other.push(url);
      continue;
    }

    // ── 4. 本地引用：相对路径 / 绝对路径 ────────────────────────
    result.localResource.push(url);
  }

  return result;
}

async function extractResourceLinks(filePath) {
  const links = [];
  
  // Regex patterns for markdown syntax
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const markdownLinkRegex = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
  
  // Regex patterns for HTML syntax
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const aTagRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  
  for await (const line of rl) {
    lineNumber++;
    
    // Check markdown image syntax: ![]()
    let match;
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    while ((match = imgRegex.exec(line)) !== null) {
      links.push({
        type: 'markdown-image',
        syntax: match[0],
        alt: match[1],
        url: match[2],
        line: lineNumber
      });
    }
    
    // Check markdown link syntax: []()
    const linkRegex = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
    while ((match = linkRegex.exec(line)) !== null) {
      links.push({
        type: 'markdown-link',
        syntax: match[0],
        text: match[1],
        url: match[2],
        line: lineNumber
      });
    }
    
    // Check HTML img tag
    const imgHtmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = imgHtmlRegex.exec(line)) !== null) {
      links.push({
        type: 'html-img',
        syntax: match[0],
        url: match[1],
        line: lineNumber
      });
    }
    
    // Check HTML a tag
    const aHtmlRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
    while ((match = aHtmlRegex.exec(line)) !== null) {
      links.push({
        type: 'html-anchor',
        syntax: match[0],
        url: match[1],
        line: lineNumber
      });
    }
  }
  
  return links;
}

// -------------

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

module.exports = {
  extractResourceLinks,
  classifyLinks,
  classifyLocalResources,
  transferFiles,
  findMdFiles,
  readFrontMatterTitle,
  collectMdMeta,
};
