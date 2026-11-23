/* 部署后 smoke：本地断言证明不了「线上这批 URL 真的都在、而且内容是对的」。
   历史两次翻车都在这一层——robots.txt 被 .gitignore 挡住（本地全过、线上 404）、
   docs/README.md 重复（本地有、线上多一份）。

   两条硬规矩：
   1) 字节数不写死：读构建产出的 tools/sizes.json（由 build-dist 生成，与产物同一次构建），
      一一比对精确字节。没有基准文件时才退回「非空」并明确提示，绝不偷偷用手写常量。
   2) 不止看字节：把线上 index.html / items.js 拉下来，在本地跑内容断言——
      og 绝对地址、countGuard 各数字与数组实长一致、hero 两处数字、404 文案里的总数。
      这是唯一能证明「线上这份数据是对的」的检查。

   用法：node tools/smoke.js [站点根]      例 node tools/smoke.js https://x.github.io/repo/
   退出码 0 = 全过，1 = 有异常（CI 直接红）。 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BASE = (process.argv[2] || 'https://yuyu123456608.github.io/btw-ce-cn-guide/').replace(/\/?$/, '/');
const SIZES = path.join(__dirname, 'sizes.json');

const get = (url) => new Promise((resolve, reject) => {
  const req = https.get(url, { headers: { 'user-agent': 'btw-smoke/1' } }, res => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      const buf = Buffer.concat(chunks);
      resolve({ status: res.statusCode, len: Number(res.headers['content-length'] || buf.length), body: buf.toString('utf8') });
    });
  });
  req.setTimeout(20000, () => req.destroy(new Error('超时')));
  req.on('error', reject);
});

const fail = [];
const ok = (cond, msg) => { if (!cond) fail.push(msg); return cond; };

(async () => {
  console.log(`smoke: ${BASE}`);

  /* 基准字节：优先读构建产物；没有就说清楚，不假装有 */
  let sizes = null;
  if (fs.existsSync(SIZES)) {
    const s = JSON.parse(fs.readFileSync(SIZES, 'utf8'));
    sizes = s.sizes;
    console.log(`  基准：tools/sizes.json（构建于 ${s.builtAt}）`);
  } else {
    console.log('  ⚠ 没有 tools/sizes.json：本次只校验非空与内容，不校验字节数');
  }

  const FILES = ['', 'items.js', 'guides.js', 'og.png', '404.html', 'fonts/pixel.woff2', 'fonts/OFL.txt', 'robots.txt', 'sitemap.xml'];
  const bodies = {};
  for (const f of FILES) {
    const url = BASE + f;
    try {
      const r = await get(url);
      const label = f || '根 index.html';
      const expect = sizes && sizes[f || 'index.html'];
      let good = r.status === 200 && r.len > 0;
      let note = '';
      if (expect != null) {
        good = good && r.len === expect;
        note = good ? '' : `（期望 ${expect} B，实测 ${r.len} B）`;
      }
      console.log(`  ${good ? '✓' : '×'} ${label.padEnd(20)} ${r.status} ${r.len} B${note}`);
      if (!good) fail.push(`${label}：${r.status} / ${r.len} B${note}`);
      if (good && (f === '' || f === 'items.js' || f === '404.html')) bodies[f] = r.body;
    } catch (e) {
      console.log(`  × ${f || '根'} 请求失败：${e.message}`);
      fail.push(`${f || '根'}：${e.message}`);
    }
  }

  /* 任意错误路径必须落到自定义 404 页（GitHub 默认页不含这句） */
  try {
    const r = await get(BASE + 'no-such-page-smoke-check');
    const good = r.status === 404 && r.body.includes('这个方块不存在');
    console.log(`  ${good ? '✓' : '×'} ${'自定义 404'.padEnd(20)} ${r.status} ${r.len} B${good ? '' : '（未命中自定义页）'}`);
    if (!good) fail.push(`404 页：${r.status}，正文未命中自定义页`);
  } catch (e) { fail.push('404 页：' + e.message); }

  /* —— 内容断言：线上这份数据对不对 —— */
  if (bodies[''] && bodies['items.js']) {
    let ITEMS = [], ARCHIVE = [];
    try {
      const sb = { console };
      sb.window = sb;
      vm.createContext(sb);
      vm.runInContext(bodies['items.js'], sb);
      ITEMS = sb.BTW_ITEMS || [];
      ARCHIVE = sb.BTW_ITEMS_ARCHIVE || [];
    } catch (e) { fail.push(`线上 items.js 解析失败：${e.message}`); }

    if (ITEMS.length) {
      const html = bodies[''];
      const total = ITEMS.length + ARCHIVE.length;
      const recipes = ITEMS.filter(x => x.grid || (x.shape === 'shapeless' && x.mats && x.mats[0] && x.mats[0] !== '待补充')).length;
      const procRows = ITEMS.reduce((s, x) => s + (x.proc || []).filter(l => String(l).indexOf('另有') !== 0).length, 0);

      /* 1) countGuard：HTML 上的数字 vs 线上数组实长 */
      const guard = html.match(/id="countGuard"[^>]*/);
      if (!guard) fail.push('线上 index.html 缺少 #countGuard，内容断言无从核对');
      else {
        const attr = (k) => { const m = guard[0].match(new RegExp(`data-${k}="(\\d+)"`)); return m ? Number(m[1]) : null; };
        const pairs = [['main', ITEMS.length], ['archive', ARCHIVE.length], ['total', total], ['recipes', recipes], ['proc', procRows]];
        pairs.forEach(([k, want]) => {
          const got = attr(k);
          if (got !== want) fail.push(`countGuard 的 ${k}=${got}，线上数据实测 ${want}`);
        });
      }

      /* 2) hero 两处数字 */
      const heroTotal = html.match(/id="heroTotal">(\d+)</);
      const heroShown = html.match(/id="heroShown">(\d+)</);
      if (!heroTotal || Number(heroTotal[1]) !== total) fail.push(`heroTotal=${heroTotal ? heroTotal[1] : '缺失'}，实测 ${total}`);
      if (!heroShown || Number(heroShown[1]) !== ITEMS.length) fail.push(`heroShown=${heroShown ? heroShown[1] : '缺失'}，实测 ${ITEMS.length}`);

      /* 3) og 必须是绝对地址，且指向本站在线根（掉回相对路径时这里必红） */
      const ogImage = html.match(/property="og:image" content="([^"]+)"/);
      const ogUrl = html.match(/property="og:url" content="([^"]+)"/);
      if (!ogImage || ogImage[1] !== BASE + 'og.png') fail.push(`og:image=${ogImage ? ogImage[1] : '缺失'}，应为 ${BASE}og.png`);
      if (!ogUrl || ogUrl[1] !== BASE) fail.push(`og:url=${ogUrl ? ogUrl[1] : '缺失'}，应为 ${BASE}`);

      /* 4) 像素字体确实被声明（线上 CSS 与线上字体文件都在） */
      if (!/@font-face[\s\S]{0,200}fonts\/pixel\.woff2/.test(html)) fail.push('线上 index.html 里没有指向 fonts/pixel.woff2 的 @font-face');

      /* 5) 404 正文里的总数 */
      if (bodies['404.html']) {
        const m = bodies['404.html'].match(/(\d+) 条核心条目都在/);
        if (!m) fail.push('线上 404.html 缺少「N 条核心条目都在」');
        else if (Number(m[1]) !== total) fail.push(`线上 404.html 写 ${m[1]} 条核心条目，实测 ${total}`);
      }

      /* 6) 线上不该有仓库说明副本（docs/README.md 曾重复上线过） */
      try {
        const r = await get(BASE + 'README.md');
        if (r.status === 200) fail.push('线上存在 README.md 副本（docs/README.md 重复问题复发）');
        else console.log(`  ✓ ${'无 README 副本'.padEnd(20)} ${r.status}`);
      } catch (e) { /* 404 之外的网络错误不判死 */ }
    }
  } else if (!fail.length) {
    fail.push('没拿到 index.html / items.js，内容断言未执行');
  }

  if (fail.length) { console.log(`\n有 ${fail.length} 项不对：`); fail.forEach(f => console.log('  - ' + f)); process.exit(1); }
  console.log('\nsmoke 全过 ✅（字节 + 内容）');
})();
