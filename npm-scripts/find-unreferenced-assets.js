#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─────────────────────────────────────────────
// 配置：在此填写要同步删除同名文件的目录（可多个）
// ─────────────────────────────────────────────
const EXTRA_SEARCH_DIRS = [
  '../gh-assets/blog',
  // '/home/isaac/Downloads/tinified',
];
// ─────────────────────────────────────────────

// Posts directory - can also be passed as CLI arg: node script.js /path/to/posts
const POSTS_DIR = process.argv[2] || process.cwd();

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function findMdAndAssetDirs(baseDir) {
  const results = [];
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md'));
  const dirs = new Set(entries.filter(e => e.isDirectory()).map(e => e.name));

  for (const mdEntry of mdFiles) {
    const stem = path.basename(mdEntry.name, '.md');
    if (dirs.has(stem)) {
      results.push({
        mdFile: path.join(baseDir, mdEntry.name),
        assetDir: path.join(baseDir, stem),
      });
    }
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      results.push(...findMdAndAssetDirs(path.join(baseDir, entry.name)));
    }
  }

  return results;
}

function getReferencedFilenames(mdFilePath) {
  const content = fs.readFileSync(mdFilePath, 'utf-8');
  const referenced = new Set();

  const patterns = [
    /!\[.*?\]\(([^)]+)\)/g,            // ![alt](path)
    /<img[^>]+src=["']([^"']+)["']/gi, // <img src="...">
    /\[.*?\]\(([^)]+)\)/g,             // [text](path)
    /(?:src|href)=["']([^"']+)["']/gi, // src="..." href="..."
  ];

  for (const regex of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const ref = match[1].split('?')[0].split('#')[0];
      referenced.add(path.basename(ref));
    }
  }

  return referenced;
}

// Find files with the given filename in EXTRA_SEARCH_DIRS
function findInExtraDirs(filename) {
  const found = [];
  for (const dir of EXTRA_SEARCH_DIRS) {
    if (!fs.existsSync(dir)) continue;
    try {
      for (const f of getAllFiles(dir)) {
        if (path.basename(f) === filename) found.push(f);
      }
    } catch (_) {}
  }
  return found;
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function tryDelete(absPath) {
  try {
    fs.unlinkSync(absPath);
    console.log(`     ✅ Deleted: ${absPath}`);
    return true;
  } catch (e) {
    console.log(`     ❌ Failed:  ${absPath} (${e.message})`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  // ── Step 1: scan POSTS_DIR for unreferenced files ─────────────────────────
  console.log(`Scanning POSTS_DIR: ${POSTS_DIR}\n`);

  const pairs = findMdAndAssetDirs(POSTS_DIR);
  const unreferenced = [];

  for (const { mdFile, assetDir } of pairs) {
    const referencedNames = getReferencedFilenames(mdFile);
    for (const assetFile of getAllFiles(assetDir)) {
      if (!referencedNames.has(path.basename(assetFile))) {
        unreferenced.push({
          absPath: assetFile,
          asset: path.relative(POSTS_DIR, assetFile),
          md: path.relative(POSTS_DIR, mdFile),
        });
      }
    }
  }

  if (unreferenced.length === 0) {
    console.log('✅ All assets are referenced in their corresponding .md files.');
    return;
  }

  // Print unreferenced report
  console.log(`⚠️  Found ${unreferenced.length} unreferenced asset(s):\n`);
  const grouped = {};
  for (const item of unreferenced) {
    (grouped[item.md] ??= []).push(item);
  }
  for (const [md, items] of Object.entries(grouped)) {
    console.log(`📄 ${md}`);
    for (const item of items) console.log(`   ❌ ${item.asset}`);
    console.log();
  }
  console.log(`Total: ${unreferenced.length} unreferenced file(s) across ${Object.keys(grouped).length} .md file(s).`);

  // ── Step 3: scan EXTRA_SEARCH_DIRS for same-named files ───────────────────
  const activeDirs = EXTRA_SEARCH_DIRS.filter(d => fs.existsSync(d));
  const extraMatches = [];

  if (activeDirs.length > 0) {
    console.log('\nScanning extra dirs for same-named files...');
    for (const item of unreferenced) {
      for (const found of findInExtraDirs(path.basename(item.absPath))) {
        extraMatches.push(found);
      }
    }

    if (extraMatches.length > 0) {
      console.log(`\nFound ${extraMatches.length} same-named file(s) in extra dirs:`);
      for (const p of extraMatches) console.log(`   • ${p}`);
    } else {
      console.log('No matching files found in extra dirs.');
    }
  } else if (EXTRA_SEARCH_DIRS.length > 0) {
    console.log('\n⚠️  Extra search dirs configured but none exist:');
    for (const d of EXTRA_SEARCH_DIRS) console.log(`   • ${d}`);
  }

  // ── Step 2 & 4: ask and delete ────────────────────────────────────────────
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // Step 2: delete unreferenced files in POSTS_DIR
  const ans1 = await ask(rl, `\nDelete all ${unreferenced.length} unreferenced file(s) from POSTS_DIR? [Y/n] `);
  if (ans1.trim().toLowerCase() !== 'n') {
    let count = 0;
    for (const item of unreferenced) {
      if (tryDelete(item.absPath)) count++;
    }
    console.log(`${count} file(s) deleted from POSTS_DIR.`);
  } else {
    console.log('Skipped.');
  }

  // Step 4: delete same-named files in EXTRA_SEARCH_DIRS
  if (extraMatches.length > 0) {
    const ans2 = await ask(rl, `\nDelete all ${extraMatches.length} same-named file(s) from extra dirs? [Y/n] `);
    if (ans2.trim().toLowerCase() !== 'n') {
      let count = 0;
      for (const p of extraMatches) {
        if (tryDelete(p)) count++;
      }
      console.log(`${count} file(s) deleted from extra dirs.`);
    } else {
      console.log('Skipped.');
    }
  } else if (activeDirs.length > 0) {
    console.log('\nNo files to delete in extra dirs.');
  }

  rl.close();
  console.log('\n✅ Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
