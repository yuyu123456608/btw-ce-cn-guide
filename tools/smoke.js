/* 部署后 smoke test：本地 32 条断言证明不了「线上这批 URL 真的都在」。
   历史上就中过两次——robots.txt 被 .gitignore 挡住（本地 verify 全过、线上 404）、
   docs/README.md 重复（本地有、线上多一份）。所以部署完必须逐个 GET 断言。

   用法：
     node tools/smoke.js                       # 默认站点根
     node tools/smoke.js https://example.com/  # 指定站点根
   退出码 0 = 全通过；1 = 有异常（CI 直接红）。 */
const https = require('https');

const BASE = (process.argv[2] || 'https://yuyu123456608.github.io/btw-ce-cn-guide/').replace(/\/?$/, '/');

/* 每项：路径、期望状态、字节数区间（区间用来抓「200 但内容是 GitHub 默认 404 / 空文件」） */
const CHECKS = [
  { p: '',                     min: 40000, max: 400000, name: '首页' },
  { p: 'items.js',             min: 40000, max: 400000, name: '数据 items.js' },
  { p: 'guides.js',            min: 4000,  max: 60000,  name: '攻略 guides.js' },
  { p: 'og.png',               min: 5000,  max: 60000,  name: 'og 图' },
  { p: '404.html',             min: 1000,  max: 20000,  name: '自定义 404 页' },
  { p: 'fonts/pixel.woff2',    min: 20000, max: 120000, name: '像素字体' },
  { p: 'fonts/OFL.txt',        min: 2000,  max: 20000,  name: '字体许可' },
  { p: 'robots.txt',           min: 30,    max: 4000,   name: 'robots' },
  { p: 'sitemap.xml',          min: 100,   max: 8000,   name: 'sitemap' }
];

/* 任意错误路径必须命中自定义 404 页（GitHub 默认页不含「这个方块不存在」） */
const NOT_FOUND = { p: 'no-such-page-smoke-check', marker: '这个方块不存在' };

const get = (url) => new Promise((resolve, reject) => {
  const req = https.get(url, { headers: { 'user-agent': 'btw-smoke/1' } }, res => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', c => { body += c; });
    res.on('end', () => resolve({ status: res.statusCode, len: Number(res.headers['content-length'] || Buffer.byteLength(body)), body }));
  });
  req.setTimeout(20000, () => { req.destroy(new Error('超时')); });
  req.on('error', reject);
});

(async () => {
  const fail = [];
  console.log(`smoke: ${BASE}`);
  for (const c of CHECKS) {
    const url = BASE + c.p;
    try {
      const r = await get(url);
      const ok = r.status === 200 && r.len >= c.min && r.len <= c.max;
      console.log(`  ${ok ? '✓' : '×'} ${c.name.padEnd(12)} ${r.status} ${r.len} B${ok ? '' : `（期望 200 / ${c.min}–${c.max} B）`}`);
      if (!ok) fail.push(`${c.name}（${c.p || '根'}）：${r.status} / ${r.len} B`);
    } catch (e) { console.log(`  × ${c.name} 请求失败：${e.message}`); fail.push(`${c.name}：${e.message}`); }
  }
  /* 404 页：状态码本身是 404，所以单独判断 */
  try {
    const r = await get(BASE + NOT_FOUND.p);
    const ok = r.status === 404 && r.body.includes(NOT_FOUND.marker);
    console.log(`  ${ok ? '✓' : '×'} ${'自定义 404'.padEnd(12)} ${r.status} ${r.len} B${ok ? '' : '（没命中「' + NOT_FOUND.marker + '」）'}`);
    if (!ok) fail.push(`404 页：${r.status}，正文未命中自定义页`);
  } catch (e) { fail.push('404 页：' + e.message); }

  if (fail.length) { console.log(`\n有 ${fail.length} 项不对：`); fail.forEach(f => console.log('  - ' + f)); process.exit(1); }
  console.log('\nsmoke 全过 ✅');
})();
