import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const RAW_ROOT = path.join(ROOT, 'raw', '产品官网文档');
const DOCS_ROOT = path.join(ROOT, 'docs');
const CONTENT_ROOT = path.join(DOCS_ROOT, 'content', '产品官网文档');
const SIDEBAR_FILE = path.join(DOCS_ROOT, '_sidebar.md');

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function removeDirIfExists(target) {
  if (await exists(target)) {
    await fs.rm(target, { recursive: true, force: true });
  }
}

function sortZh(items) {
  return items.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
}

function toDisplayName(name) {
  return name.replace(/^\d+\s*[-_.、]\s*/, '');
}

async function buildSidebarLines(dir, relFromContent = '') {
  const lines = [];
  const current = path.join(dir, relFromContent);
  const entries = await fs.readdir(current, { withFileTypes: true });

  const dirs = sortZh(entries.filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => e.name));
  const files = sortZh(
    entries
      .filter((e) => e.isFile() && e.name.endsWith('.md') && !e.name.startsWith('.'))
      .map((e) => e.name),
  );

  for (const file of files) {
    const fileRel = path.posix.join(relFromContent.replace(/\\/g, '/'), file);
    const fileBase = file.replace(/\.md$/i, '');
    lines.push(`- [${toDisplayName(fileBase)}](content/产品官网文档/${fileRel})`);
  }

  for (const subdir of dirs) {
    const subRel = path.posix.join(relFromContent.replace(/\\/g, '/'), subdir);
    const childLines = await buildSidebarLines(dir, subRel);
    if (childLines.length === 0) continue;
    lines.push(`- ${toDisplayName(subdir)}`);
    for (const line of childLines) {
      lines.push(`  ${line}`);
    }
  }

  return lines;
}

async function main() {
  if (!(await exists(RAW_ROOT))) {
    throw new Error(`未找到目录: ${RAW_ROOT}`);
  }

  await ensureDir(DOCS_ROOT);
  await removeDirIfExists(CONTENT_ROOT);
  await copyDir(RAW_ROOT, CONTENT_ROOT);

  const sidebarLines = [
    '<!-- 由 scripts/sync-product-docs.mjs 自动生成，请勿手改 -->',
    ...await buildSidebarLines(CONTENT_ROOT),
    '',
  ];

  await fs.writeFile(SIDEBAR_FILE, sidebarLines.join('\n'), 'utf-8');
  console.log('已同步产品官网文档到 docs/content 并更新侧边栏');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
