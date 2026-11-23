/* 生成 tools/texpool-index.json：贴图池的「文件路径清单」。
   为什么需要它：第 8 条要核对 imgNeed 指向的贴图是否真实存在，而 texpool/ 是 1340 个文件、
   约 100 MB 的反编译产物，不能入库。清单只保留相对路径，入库几 KB，
   CI 用清单核对「这条 imgNeed 在贴图池里存在过」，本地有目录时再用目录做交叉校验。 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POOL = path.join(ROOT, 'tools', 'texpool');
const OUT = path.join(ROOT, 'tools', 'texpool-index.json');

if (!fs.existsSync(POOL)) {
  console.error('tools/texpool 不存在，无法生成清单');
  process.exit(1);
}

const list = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else list.push(path.relative(POOL, p).split(path.sep).join('/'));
  }
})(POOL);
list.sort();

fs.writeFileSync(OUT, JSON.stringify({ count: list.length, files: list }) + '\n');
console.log(`texpool-index.json：${list.length} 个文件 / ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
