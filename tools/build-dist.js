/* build-dist.js — 生成发布目录 docs/（唯一需要上线的 5 项），并写 tools/dist-manifest.json
   用法：
     node tools/build-dist.js                                   # 未定域名：og 保持相对路径
     node tools/build-dist.js --user=<GitHub 用户名> [--repo=btw-ce-cn-guide]
   做三件事：
     1) 拷 index.html / items.js / guides.js / icons/ / og.png（icons 先清空，避免残留）
     2) 把 dist/index.html 的 og:image、twitter:image 换成绝对 URL，并补 og:url（站点根，不带 hash）
     3) 在 dist/index.html 头部插 <!-- dist-built: ... --> 标记，dist/README.md 一并生成
   校验：node tools/verify.js 第 27 条读 manifest，发现源文件改动而 dist 没重建即报错 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'docs');
const args = process.argv.slice(2);
const opt = k => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : ''; };
/* --user/--repo 决定 og:image / og:url / 404 回链三处绝对地址。
   CI 里从 github.repository 推导（环境变量 GITHUB_REPOSITORY=owner/repo），不硬编码；
   显式传参优先，传了但与 CI 推导值不一致时直接失败——错参数构建出的产物不能上线。 */
const envRepo = String(process.env.GITHUB_REPOSITORY || '').trim();   // "owner/repo"
const [envUser, envName] = envRepo ? envRepo.split('/') : ['', ''];
const USER = opt('user') || envUser;
const REPO = opt('repo') || envName || 'btw-ce-cn-guide';
if (envRepo && opt('user') && opt('user') !== envUser) {
  console.error(`--user=${opt('user')} 与 CI 仓库所有者 ${envUser} 不一致：产物里的 og/404 会指错站`);
  process.exit(1);
}
if (envRepo && opt('repo') && opt('repo') !== envName) {
  console.error(`--repo=${opt('repo')} 与 CI 仓库名 ${envName} 不一致：产物里的 og/404 会指错站`);
  process.exit(1);
}
const OG_URL = USER ? `https://${USER}.github.io/${REPO}/` : '';
console.log(`og 绝对地址：${OG_URL || '（未定，og 退回相对路径）'}${envRepo ? '（由 GITHUB_REPOSITORY 推导）' : '（本地显式传参）'}`);

/* 全部数字从数据源算，README 与 404 里不写死任何计数。
   口径与 verify 第 25 / 28 条完全一致：改数据后三个文件同步，不需要手改。 */
const vm = require('vm');
const sb = { console };
sb.window = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'items.js'), 'utf8'), sb);
const ITEMS = sb.BTW_ITEMS, ARCHIVE = sb.BTW_ITEMS_ARCHIVE;
const N = {
  total: ITEMS.length + ARCHIVE.length, /* BTW_ITEMS_TOTAL 是主数组条数，总条目要加上归档 */
  main: ITEMS.length,
  archive: ARCHIVE.length,
  recipes: ITEMS.filter(x => x.grid || (x.shape === 'shapeless' && x.mats && x.mats[0] && x.mats[0] !== '待补充')).length,
  proc: ITEMS.reduce((s, x) => s + (x.proc || []).filter(l => String(l).indexOf('另有') !== 0).length, 0),
};

const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

function copy(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

/* 1. 拷文件
   文本文件统一成 LF 再发：Windows 工作区是 CRLF、CI 检出是 LF，
   同一份源会产出不同字节数——artifact 就成了「跟谁构建有关」的东西，smoke 的字节基准也没法用。 */
function copyText(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n'));
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'icons'), { recursive: true });
copyText(path.join(ROOT, 'items.js'), path.join(DIST, 'items.js'));
copyText(path.join(ROOT, 'guides.js'), path.join(DIST, 'guides.js'));
copy(path.join(ROOT, 'og.png'), path.join(DIST, 'og.png'));
const icons = fs.readdirSync(path.join(ROOT, 'icons')).filter(f => f.endsWith('.png'));
icons.forEach(f => copy(path.join(ROOT, 'icons', f), path.join(DIST, 'icons', f)));
/* 像素字体与许可原件必须同发布：OFL-1.1 要求分发字体时随附许可文本 */
const fontFiles = fs.readdirSync(path.join(ROOT, 'fonts'));
fontFiles.forEach(f => copy(path.join(ROOT, 'fonts', f), path.join(DIST, 'fonts', f)));

/* 2. index.html：改 og，插标记 */
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
if (OG_URL) {
  html = html.replace('<meta property="og:image" content="og.png">', `<meta property="og:image" content="${OG_URL}og.png">`);
  html = html.replace('<meta name="twitter:image" content="og.png">', `<meta name="twitter:image" content="${OG_URL}og.png">`);
  html = html.replace('<meta property="og:type" content="website">', `<meta property="og:type" content="website">\n<meta property="og:url" content="${OG_URL}">`);
}
/* 站点内那句「相对路径待换」的开发注释不进发布物 */
html = html.replace(/<!-- 注：og:image 用相对路径[\s\S]*?-->\n?/, '');
const builtAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const marker = `<!-- dist-built: ${builtAt}${USER ? ' · ' + OG_URL : ' · og:image 仍为相对路径（未定域名）'} -->`;
html = html.replace(/<head>/, `<head>\n${marker}`);
fs.writeFileSync(path.join(DIST, 'index.html'), html);

/* 3. 根 README.md（GitHub 仓库首页）—— 由脚本生成，数字注入，不手写。
   以前 docs/ 里还放过一份，内容与根 README 重复 57%，已删除：README 只需要一份。 */
const readme = `# 德爷生存 · BTW 中文图鉴站

Minecraft 1.6.4 整合包「德爷生存」（Better Than Wolves Community Edition **3.1.1**）的中文物品图鉴、合成速查与生存路线。

**线上站点**：${OG_URL || '（待定域名）'}
**非官方粉丝站**，与 Mojang 及 Better Than Wolves 作者无隶属关系。

## 数据口径

| 项 | 数量 |
|---|---|
| 核心条目总数 | ${N.total} |
| 已在图鉴展示 | ${N.main} |
| 配方已核实（3×3 合成） | ${N.recipes} |
| 机器加工配方 | ${N.proc} 行（${ITEMS.filter(x => (x.proc || []).length).length} 条含加工方式） |
| 待补归档条目 | ${N.archive} |
| 物品图标 | ${icons.length} 张（16×16） |

三条铁律：有图才写 \`img\`、无依据不编配方、无官方键不自拟名。未能在模组源码中定位产出方式的条目不进入展示。

## 数据来源与免责

配方、材料名与加工方式均来自对 \`btwce-3.1.1.jar\` 内 class 文件的反编译核对，以及 BTW 官方百科 wiki.btwce.com 的条目比对，不写猜测值。游戏素材版权归原模组及原作者所有，本仓库仅作中文资料整理。

## 字体

标题用 [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font) 12px 等宽体（作者 TakWolf 与贡献者），SIL Open Font License 1.1。站点只打包了本站用到的字符子集（\`docs/fonts/pixel.woff2\`，约 43 KB），许可原件随附在 \`docs/fonts/OFL.txt\`。

## 目录与更新流程

仓库只存**源 + 校验器**，不存构建产物：\`docs/\` 由 Actions 构建后作为 Pages artifact 直接部署，改动一条数据只产生一行 diff。制作现场（反编译输出、贴图池、中间数据）在本地不入库；第 8 条核对 \`imgNeed\` 时读 \`tools/texpool-index.json\` 这份路径清单，而不是那 100 MB 贴图池。

\`\`\`bash
node tools/build-dist.js --user=${USER || '<用户名>'} --repo=${REPO}   # 本地预览用：生成 docs/
node tools/verify.js                                                  # 33 条断言，不过不许提交
node tools/smoke.js                                                   # 可选：对线上逐个 GET 核对
git add . && git commit -m "..." && git push                          # push 后 CI 构建 → 校验 → 部署 → smoke
\`\`\`

部署链路（\`.github/workflows/deploy.yml\`）：build → verify 33 条 → upload-pages-artifact(\`docs\`) → deploy-pages → 对线上 9 个 URL + 自定义 404 页跑 smoke（字节数读构建产出的 \`tools/sizes.json\`，并抓 index.html / items.js 做内容断言：og 绝对地址、countGuard 各数字与数组实长、404 文案总数）。**校验不过就不会部署**，坏版本进不了线上。

\`--user\` / \`--repo\` 每次都带：少了 og:image 会退回相对路径，第 27 条会当场拦下。
`;
fs.writeFileSync(path.join(ROOT, 'README.md'), readme);

/* 3b. 404.html —— 必须由构建脚本生成：docs 每次清空重建，手放进去会被删掉 */
const notFound = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>404 · 这个方块不存在 | 德爷生存 · BTW 中文图鉴</title>
<style>
:root{--bg:#15171B;--ink:#0C0D10;--green:#5AA83C;--cyan:#33C0C4;--text:#E6E8E3;--dim:#98A093}
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{background:var(--bg);color:var(--text);font:14px/1.7 "Microsoft YaHei",system-ui,sans-serif;
  display:flex;align-items:center;justify-content:center;padding:24px;
  background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
  background-size:32px 32px}
.box{max-width:560px;width:100%;text-align:center}
.block{width:96px;height:96px;margin:0 auto 26px;background:var(--green);border:4px solid var(--ink);
  box-shadow:inset -8px -8px 0 rgba(0,0,0,.28),6px 6px 0 var(--ink);
  display:flex;align-items:center;justify-content:center;font:700 30px/1 "Microsoft YaHei",sans-serif;color:#0C0D10}
h1{font-size:15px;letter-spacing:3px;color:var(--cyan);margin:0 0 10px;font-weight:400}
h2{font-size:26px;margin:0 0 8px;letter-spacing:2px}
h2 em{font-style:normal;color:var(--green)}
p{color:var(--dim);margin:0 0 26px}
a{display:inline-block;padding:12px 22px;background:var(--green);color:#0C0D10;font-weight:700;letter-spacing:1px;
  text-decoration:none;border:3px solid var(--ink);box-shadow:4px 4px 0 var(--ink);transition:transform .08s}
a:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ink)}
hr{border:0;height:3px;margin:0 0 26px;
  background:repeating-linear-gradient(90deg,var(--green) 0 8px,transparent 8px 16px)}
</style>
</head>
<body>
<div class="box">
  <div class="block">缺</div>
  <hr>
  <h1>404 · NOT FOUND</h1>
  <h2>这个方块<em>不存在</em></h2>
  <p>地址拼错了，或者这条还在归档里没上图鉴。<br>回站里用搜索找找，${N.total} 条核心条目都在。</p>
  <a href="${OG_URL || './'}">回图鉴看看</a>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(DIST, '404.html'), notFound);

/* 3c. sitemap.xml / robots.txt —— 站点只有根 URL 可索引：条目详情是 #item/<id> 弹层，
   hash 不会进搜索引擎索引库，硬塞进去只会是重复内容，所以只列首页。 */
if (OG_URL) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${OG_URL}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${OG_URL}sitemap.xml\n`);
}

/* 4. manifest（放 tools/，不进发布物） */
const files = {};
for (const f of ['items.js', 'guides.js', 'og.png', 'fonts/pixel.woff2', 'fonts/OFL.txt']) files[f] = sha(path.join(ROOT, f));
const manifest = { builtAt, ogUrl: OG_URL, repo: REPO, user: USER, srcIndex: sha(path.join(ROOT, 'index.html')), files, icons: icons.length };
fs.writeFileSync(path.join(ROOT, 'tools', 'dist-manifest.json'), JSON.stringify(manifest, null, 2));

const total = fs.readdirSync(DIST, { recursive: true }).filter(f => fs.statSync(path.join(DIST, f)).isFile()).length;
const size = fs.readdirSync(DIST, { recursive: true }).filter(f => fs.statSync(path.join(DIST, f)).isFile())
  .reduce((s, f) => s + fs.statSync(path.join(DIST, f)).size, 0);

/* 4b. tools/sizes.json —— smoke 要核对的「线上字节数」真值，由构建产物自己生成。
   以前 smoke 里的字节区间是手写常量，数据一变就得人手调：漏调就误报或漏报。
   现在只有这一处真值，smoke 直接按精确字节比对。 */
const SMOKE_FILES = ['index.html', 'items.js', 'guides.js', 'og.png', '404.html', 'fonts/pixel.woff2', 'fonts/OFL.txt', 'robots.txt', 'sitemap.xml'];
const sizes = {};
SMOKE_FILES.forEach(f => { const p = path.join(DIST, f); if (fs.existsSync(p)) sizes[f] = fs.statSync(p).size; });
fs.writeFileSync(path.join(ROOT, 'tools', 'sizes.json'), JSON.stringify({ builtAt, ogUrl: OG_URL, sizes }, null, 2) + '\n');

console.log(`docs 已重建：${total} 文件 / ${(size / 1024).toFixed(1)} KB / icons ${icons.length}`);
console.log(`og:image = ${OG_URL ? OG_URL + 'og.png' : '（相对路径 og.png，等域名确定后带 --user 重跑）'}`);
console.log(`smoke 基准：tools/sizes.json（${Object.keys(sizes).length} 项）`);
console.log(`标记：${marker}`);

