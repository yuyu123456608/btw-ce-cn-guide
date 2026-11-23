/* ==========================================================================
   德爷生存 · 数据自检脚本
   --------------------------------------------------------------------------
   用法（在站点根目录执行）：
     node tools/verify.js
   检查项：共 27 条，逐条见文件内各段注释（编号 1–27，含数据口径、名字唯一、旧名黑名单、静态数字守卫、dist 一致性）
   有错时退出码为 1，便于接到 CI 或 pre-commit 里兜底。
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox; // 让 window.xxx 与全局 xxx 都拿到
vm.createContext(sandbox);

['items.js', 'guides.js'].forEach(f => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) {
    console.error('缺少文件：' + f);
    process.exit(1);
  }
  vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f });
});

const items = sandbox.BTW_ITEMS || [];
const archive = sandbox.BTW_ITEMS_ARCHIVE || [];
const guides = sandbox.BTW_GUIDES || [];
const declared = sandbox.BTW_ITEMS_SHOWN;

const errors = [];
const warn = [];
const CATS = ['tool', 'block', 'metal', 'pottery', 'farm', 'misc'];

/* 1. 条数与声明值（BTW_ITEMS_SHOWN 是「已上图鉴」条数，不含归档） */
if (items.length !== declared) {
  errors.push(`条数不一致：BTW_ITEMS ${items.length} 条，BTW_ITEMS_SHOWN 写的是 ${declared}`);
}

/* 2. id 唯一（两个数组一起查） */
const seen = new Set();
items.concat(archive).forEach(it => {
  if (seen.has(it.id)) errors.push(`id 重复：${it.id}`);
  seen.add(it.id);
});

/* 3/4/5. 字段级检查（只查参与渲染的数组） */
items.forEach(it => {
  const chars = [...(it.cn || '')].length;
  const syl = String(it.pinyin || '').trim().split(/\s+/).filter(Boolean).length;
  if (chars !== syl) errors.push(`拼音不符：${it.id}（${it.cn}）中文 ${chars} 字，拼音 ${syl} 音节`);
  if (!CATS.includes(it.cat)) errors.push(`分类非法：${it.id} 的 cat=${it.cat}`);
  if (it.grid !== null) {
    if (!Array.isArray(it.grid) || it.grid.length !== 3) errors.push(`grid 不是 3 行：${it.id}`);
    else it.grid.forEach((row, i) => { if (!Array.isArray(row) || row.length !== 3) errors.push(`grid 第 ${i + 1} 行不是 3 列：${it.id}`); });
  }
});

/* 6. 攻略出处
   「社区整理」是诚实值：未附原始出处。允许存在，但只限这 7 篇，新增一律报错，
   保证校验器不会因为降级而失效。*/
const COMMUNITY_ALLOW = [
  '第一棵树：从空手到工作台',
  '石磨与石墨：第一台机械',
  '铁与钻石锭：金属的三道门',
  '窑与陶器：晒砖 20 分钟',
  '猛火与釜锅：温度就是产能',
  '钢与后期工业：凋零之后',
  '下界与末地：最后一程'
];
guides.forEach(g => {
  if (!g.series) { errors.push(`攻略缺出处字段：${g.cat} / ${g.title}`); return; }
  if (g.series === '出处待补充') { errors.push(`攻略出处仍是占位值：${g.title}`); return; }
  if (g.series === '社区整理') {
    if (!COMMUNITY_ALLOW.includes(g.title)) errors.push(`新增攻略不得用「社区整理」兜底：${g.title}`);
    else warn.push(`未附原始出处（社区整理）：${g.title}`);
  }
});

/* 7. 主数组的 img 必须是真实存在的资源（防止字段是真的、文件是假的） */
items.forEach(it => {
  if (!it.img) return;
  if (!/^icons\//.test(it.img)) { errors.push(`img 路径不合规：${it.id} → ${it.img}`); return; }
  if (!fs.existsSync(path.join(root, it.img))) errors.push(`img 指向的文件不存在：${it.id} → ${it.img}`);
});

/* 8. 归档数组：禁止 img；且每条必须有一个可得来源（imgNeed 命中 / inherit 可解析 / 显式 noIcon）
   贴图池（tools/texpool/，1340 文件约 100 MB）不入库，改用 tools/texpool-index.json 这份路径清单核对；
   本地存在目录时再与清单交叉校验，防止「清单变了、目录没跟」。 */
const TEXPOOL_INDEX = path.join(root, 'tools', 'texpool-index.json');
let texpoolFiles = null;
if (fs.existsSync(TEXPOOL_INDEX)) {
  texpoolFiles = new Set(JSON.parse(fs.readFileSync(TEXPOOL_INDEX, 'utf8')).files || []);
  const poolDir = path.join(root, 'tools', 'texpool');
  if (fs.existsSync(poolDir)) {
    const actual = [];
    (function walk(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else actual.push(path.relative(poolDir, p).split(path.sep).join('/'));
      }
    })(poolDir);
    if (actual.length !== texpoolFiles.size) {
      /* 必须是 error：CI 完全信任这份索引，索引与目录不一致就等于判据失效。
         warn 在 CI 里等于不存在（没人会去看一条黄色提示）。 */
      errors.push(`texpool-index.json 有 ${texpoolFiles.size} 项，实际目录 ${actual.length} 项：索引已过期，重跑 node tools/texpool-index.js 并提交`);
    } else {
      const missingInDir = [...texpoolFiles].filter(f => !actual.includes(f));
      if (missingInDir.length) errors.push(`texpool-index.json 里有 ${missingInDir.length} 条在目录中找不到（如 ${missingInDir[0]}）：索引已过期`);
    }
  }
} else {
  warn.push('缺少 tools/texpool-index.json：第 8 条无法核对 imgNeed，跑 node tools/texpool-index.js');
}
archive.forEach(it => {
  if (Object.prototype.hasOwnProperty.call(it, 'img')) { errors.push(`归档条目不得有 img 字段：${it.id}`); return; }
  if (it.noIcon) return;                      // 明确标注「jar 里确实没有」
  if (it.imgNeed) {
    const hit = texpoolFiles ? texpoolFiles.has(String(it.imgNeed).split(path.sep).join('/')) : true;
    if (!hit) errors.push(`imgNeed 指向的贴图不在贴图池清单：${it.id} → ${it.imgNeed}`);
    /* 本地有目录时再核一次真实文件，避免清单糊弄自己 */
    const real = path.join(root, 'tools', 'texpool', it.imgNeed);
    if (fs.existsSync(path.join(root, 'tools', 'texpool')) && !fs.existsSync(real)) {
      errors.push(`imgNeed 指向的贴图不存在：${it.id} → ${it.imgNeed}`);
    }
    return;
  }
  if (it.inherit) {
    const parent = items.find(x => x.id === it.inherit) || archive.find(x => x.id === it.inherit);
    if (!parent) errors.push(`inherit 指向的条目不存在：${it.id} → ${it.inherit}`);
    return;
  }
  errors.push(`归档条目既无贴图候选也无 noIcon 标记：${it.id}`);
});

/* 9. 英文名必须命中官方名表（btw lang + 原版 lang，含子类型） */
const NAMES = new Set(
  require(path.join(__dirname, 'name-table.json'))
    .map(n => n.toLowerCase().replace(/[^a-z0-9]+/g, ''))
);
/* 允许清单：**空**。第 9 条没有豁免——任何不在官方名表的英文名都会报错。
   历史上唯一一条（windmill-blade）已随 sail 合并改名为官方键 Sail（item.fcItemBladeWindMill）而清空。 */
const NAME_ALLOW = {};
items.concat(archive).forEach(it => {
  const key = String(it.en || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  if (!NAMES.has(key) && !NAME_ALLOW[it.id]) {
    errors.push(`英文名不在官方名表：${it.id} → ${it.en}`);
  }
});

/* 10. 无序合成（shape:'shapeless'）：不许画 9 宫格，也不许留空壳
   - grid 必须为 null（画了网格就等于宣称「排布有意义」，与无序语义矛盾）
   - mats 必须有内容且不能是占位符「待补充」
   - 不得同时打 noGrid:true（那个标记是给「本来就没有配方」的掉落物用的，语义冲突）
   - shape 只认 'shapeless' 一个值；有 shape 的条目不得再有 grid */
items.concat(archive).forEach(it => {
  if (Object.prototype.hasOwnProperty.call(it, 'shape')) {
    if (it.shape !== 'shapeless') errors.push(`shape 取值非法：${it.id} → ${it.shape}`);
  }
  if (it.shape !== 'shapeless') return;
  if (it.grid !== null) errors.push(`无序合成不得有 grid：${it.id}`);
  if (!Array.isArray(it.mats) || !it.mats.length) errors.push(`无序合成缺材料清单：${it.id}`);
  else if (it.mats[0] === '待补充') errors.push(`无序合成材料仍是占位符：${it.id}`);
  if (it.noGrid) errors.push(`无序合成不得打 noGrid（语义冲突）：${it.id}`);
});

/* 11. 加工配方字段 proc：只放「机器：材料 → 产物 ×N」这种已核过的行
   - 必须是字符串数组且非空
   - 每行必须含 →，且首段必须是中文机器名（不许把英文字段名写进来）
   - 「另有 N 条同类加工」这类折叠提示允许存在 */
items.concat(archive).forEach(it => {
  if (!Object.prototype.hasOwnProperty.call(it, 'proc')) return;
  if (!Array.isArray(it.proc) || !it.proc.length) { errors.push(`proc 必须是非空数组：${it.id}`); return; }
  it.proc.forEach(p => {
    if (typeof p !== 'string' || !p.trim()) errors.push(`proc 行不是有效字符串：${it.id}`);
    else if (p.indexOf('另有') !== 0) {
      if (!p.includes('→')) errors.push(`proc 行缺箭头：${it.id} → ${p}`);
      if (/^[\x00-\x7F]/.test(p)) errors.push(`proc 行以英文开头（机器名没译）：${it.id} → ${p}`);
    }
  });
});

/* 12. 归档不得带配方/加工：归档不渲染，带了会让页面上的数字只数到数据层
   （要展示就先 promote 到主数组，见 tools/promote-recipes.js） */
archive.forEach(it => {
  if (it.grid) errors.push(`归档条目不得有 grid（先转正再展示）：${it.id}`);
  if (it.shape === 'shapeless') errors.push(`归档条目不得标 shapeless：${it.id}`);
  if (it.proc && it.proc.length) errors.push(`归档条目不得有 proc：${it.id}`);
});

/* 13. proc 行不得出现多子类型/占位字段名：StubID、planks、bark、log、CRAFT_SAW 这类
   一律不可能定位到单一可见条目，写进去只会造成「角标看着对、内容错位」 */
const BAD_PROC = /StubID|\bplanks\b|\bbark\b|\blog\b|\bCRAFT_SAW\b/i;
items.forEach(it => (it.proc || []).forEach(p => {
  if (BAD_PROC.test(p)) errors.push(`proc 行含多子类型字段名（${p}）：${it.id}`);
}));

/* 14. imgApprox 只许出现在「组继承」来的贴图上：
   它表示「有图、但不是物品轮廓」，主数组自带 img 不许带这个标记，
   带了就等于承认图是凑的；而标了 imgApprox 又没写 inherit，来源无从追溯 */
items.forEach(it => {
  if (it.imgApprox) {
    if (!it.inherit) errors.push(`imgApprox 缺少 inherit 来源：${it.id}`);
    if (!it.imgApproxFrom) errors.push(`imgApprox 缺少 imgApproxFrom 说明：${it.id}`);
    if (!it.img) errors.push(`imgApprox 却没有 img：${it.id}`);
  } else if (it.inherit) {
    errors.push(`inherit 贴图必须标 imgApprox：${it.id}`);
  }
});

/* 15. mats 只表示配方材料：不许写「待补充」占位，也不许留空数组。
   没有材料就不写这个字段——占位值会让「缺材料」的条目数和角标统统虚高 */
items.forEach(it => {
  if (it.mats === undefined) return;
  if (!Array.isArray(it.mats) || !it.mats.length) errors.push(`mats 必须是非空数组（没有就删字段）：${it.id}`);
  if (it.mats && it.mats.indexOf('待补充') > -1) errors.push(`mats 不得写「待补充」占位：${it.id}`);
});

/* 16. origin 只记录来源，且只能出现在「既没有工作台配方、也没有加工配方」的条目上：
   有 grid / shapeless 时来源由配方说明；有 proc 时 proc 本身就在讲它怎么产出的，
   再并列一条 origin 就是对同一件事给出两种说法（brick 的「晒干」与「窑烧」就是这么打起来的）。
   另外 noGrid 条目不许带 mats —— 那正是拆字段要清掉的语义混用 */
items.forEach(it => {
  const hasRecipe = Array.isArray(it.grid) || it.shape === 'shapeless';
  const hasProc = !!(it.proc && it.proc.length);
  if (it.origin !== undefined) {
    if (hasRecipe) errors.push(`有工作台配方的条目不得写 origin：${it.id}`);
    if (hasProc) errors.push(`有加工配方（proc）的条目不得再写 origin：${it.id}`);
    if (!it.origin || /待核|待补充/.test(it.origin)) errors.push(`origin 不得为空或写待核：${it.id}`);
  }
  if (it.noGrid && it.mats) errors.push(`noGrid 条目不得带 mats（来源应写 origin）：${it.id}`);
});

/* 17. 已经有 grid 或 proc 的条目，obtain 不许停留在纯占位：
   既然配方都解析出来了，「以图鉴手册为准」就是把已知信息藏起来 */
const PLACEHOLDER = /^(以图鉴手册为准。?|待补充|获取方式待核。?)$/;
items.forEach(it => {
  const known = Array.isArray(it.grid) || it.shape === 'shapeless' || (it.proc && it.proc.length);
  if (known && PLACEHOLDER.test(String(it.obtain || '').trim())) {
    errors.push(`已有配方却仍写占位 obtain：${it.id}`);
  }
});

/* 18. noGrid 是「本来就不经工作台合成」的声明，不是免检牌：
   标了它就必须说清来源 —— origin 或非占位 obtain，二者至少有一个；
   同时不得带 mats（带材料清单说明有配方，和 noGrid 自相矛盾） */
items.forEach(it => {
  if (!it.noGrid) return;
  if (it.mats) errors.push(`noGrid 条目不得带 mats：${it.id}`);
  const hasSource = !!it.origin || !PLACEHOLDER.test(String(it.obtain || '').trim());
  if (!hasSource) errors.push(`noGrid 条目缺少来源（origin 或 obtain 至少一个）：${it.id}`);
});

/* 19. origin 与 noGrid 绑定：origin 只记「不经工作台」的来源，缺 noGrid 会让卡片显示灰色「方」，
   等于用「配方待补」冒充「没有工作台配方」 */
items.forEach(it => {
  if (it.origin && !it.noGrid) errors.push(`origin 条目必须同时标 noGrid：${it.id}`);
});

/* 20. 字段别名表必须指到真实条目：plateHelmet → plate-helm 这类映射一旦写错，
   反查会静默漏掉整条配方，比没有别名表更危险 */
(function checkAliases() {
  let aliases = {};
  try { aliases = require('./field-aliases.json').fieldToId || {}; }
  catch (e) { warn.push('未找到 tools/field-aliases.json，字段反查将退回按名字匹配'); return; }
  const ids = new Set(items.concat(archive).map(x => x.id));
  Object.keys(aliases).forEach(field => {
    if (!ids.has(aliases[field])) errors.push(`字段别名指向不存在的条目：${field} → ${aliases[field]}`);
    if (ids.has(field)) errors.push(`字段别名与真实 id 同名，会造成歧义：${field}`);
  });
})();

/* 21（提示级）. mats 里出现的材料名，主数组里应当能对上条目（cn 或 alias），
   或以「类」结尾的 Tag 通用名。对不上的只提示不报错——原版物品按约定不收录，允许无卡。
   ⚠ 文案口径：主数组无卡 ≠ 站内没有卡。归档条目也是真实条目，名字能对上只是不渲染
   （site-check 的「引用归档卡」桶已单独统计）。所以这里会先剔除「归档有卡」的名字，
   提示语只说「主数组无卡」，避免文本断言与事实不符。 */
(function checkMatNames() {
  const known = new Set();
  items.forEach(it => {
    known.add(it.cn);
    (it.alias || []).forEach(a => { if (a) known.add(a); });
  });
  const knownArch = new Set();
  archive.forEach(it => {
    knownArch.add(it.cn);
    (it.alias || []).forEach(a => { if (a) knownArch.add(a); });
  });
  const missing = new Set();
  const missingArch = new Set();
  items.forEach(it => (it.mats || []).forEach(m => {
    const n = String(m).replace(/[（(].*?[）)]/g, '').replace(/×\s*\d+/g, '').trim();
    if (!n || known.has(n) || /类$/.test(n)) return;
    if (knownArch.has(n)) { missingArch.add(n); return; }
    missing.add(n);
  }));
  if (missing.size) {
    warn.push(`mats 里 ${missing.size} 个材料名主数组无卡（可能为原版物品、Tag 短名或未建卡）：` +
      Array.from(missing).slice(0, 20).join('、') + (missing.size > 20 ? ' 等' : ''));
  }
  if (missingArch.size) {
    warn.push(`另有 ${missingArch.size} 个 mats 材料名只在归档有卡（页面不渲染，见 site-check「引用归档卡」）：` +
      Array.from(missingArch).join('、'));
  }
})();

/* 22. 「灰方」口径唯一化（2026-11-23 定，口径 A = 页面口径）
   页面角标的判定是：noGrid → 源；有 grid → 亮方；其余 → 灰方。proc 不参与。
   因此灰方 = !noGrid && !grid && shape !== 'shapeless'。
   历史上有第二套「三无」算法（无配方/无加工/无来源），比页面少 2 条，两套并存会天天要人工解释差值，
   从本条起只认口径 A；对外报数一律用 GREY 这个数。
   另：灰方若带 mats，说明材料已写、格子待补，属「有料待填」，提示而不报错（补 grid 或删 mats 由人定） */
const GREY = items.filter(it => !it.noGrid && !it.grid && it.shape !== 'shapeless');
const greyWithMats = GREY.filter(it => it.mats && it.mats.length);
if (greyWithMats.length) {
  warn.push(`灰方（口径 A）${GREY.length} 条，其中带 mats 的 ${greyWithMats.length} 条属「有料待填」：` +
    greyWithMats.map(it => it.id).join('、'));
}

/* 23. 字段重复（2026-11-23 加）
   历史上前几轮的文本手术出过「noGrid 写两遍」，JS 不报错、verify 也看不见。
   这里直接读源码切块，查每个条目里 noGrid / img / grid 出现次数，>1 就报错。 */
(function checkDuplicateFields() {
  const src = fs.readFileSync(path.join(root, 'items.js'), 'utf8').split(/\r?\n/);
  let cur = null, start = 0;
  const flush = (endLine) => {
    if (!cur) return;
    const text = src.slice(start, endLine + 1).join('\n');
    ['noGrid', 'img', 'grid'].forEach(k => {
      const re = new RegExp(`(^|[\\s,{])${k}\\s*:`, 'g');
      const n = (text.match(re) || []).length;
      if (n > 1) errors.push(`字段重复：${cur} 的 ${k} 出现 ${n} 次（应为 1）`);
    });
  };
  for (let i = 0; i < src.length; i++) {
    const m = src[i].match(/^  \{ id:'([^']+)'/);
    if (m) { flush(i - 1); cur = m[1]; start = i; }
    else if (cur && /^\s*\];?$/.test(src[i]) && /^\];?$/.test(src[i].trim())) { flush(i - 1); cur = null; }
  }
  flush(src.length - 1);
})();

/* 24. 历史旧名黑名单（2026-11-23 加）
   这一轮的 6 个真实错误都是同一形态：旧译名/旧写法留在散文里（effect / obtain），
   而散文是唯一没被严格校验的地方。既然名单可以枚举，就不要再靠相似度阈值去猜。
   名单在 tools/deprecated-names.json；allowIn 里的位置放宽（目前只有 alias：
   旧名作为别名保留是刻意的，为了搜得到）。cn 字段也查——卡名本身写旧名同样算错。 */
(function checkDeprecatedNames() {
  const p = path.join(__dirname, 'deprecated-names.json');
  if (!fs.existsSync(p)) { warn.push('缺少 tools/deprecated-names.json，旧名黑名单未启用'); return; }
  const list = JSON.parse(fs.readFileSync(p, 'utf8')).entries || [];
  items.concat(archive).forEach(it => {
    const spots = [
      ['cn', [it.cn]],
      ['effect', [it.effect]],
      ['obtain', [it.obtain]],
      ['proc', it.proc || []],
      ['mats', it.mats || []],
      ['grid', (it.grid || []).flat().filter(Boolean)],
    ];
    list.forEach(d => {
      spots.forEach(([field, vals]) => {
        if (d.allowIn && d.allowIn.includes(field)) return;
        vals.forEach(v => {
          if (typeof v === 'string' && v.includes(d.old)) {
            errors.push(`旧名残留：${it.id} 的 ${field} 里出现「${d.old}」（应为「${d.new}」）`);
          }
        });
      });
    });
  });
})();

/* 25. 静态数字守卫（2026-11-23 加）
   这一轮唯一反复犯的错不是译名，是页面里写死的数字跟数据对不上（188→198、125→130 各漂过一次）。
   页面里所有对外数字都必须等于 items.js 的实测值：
     #countGuard 的 data-* ／ #heroTotal ／ #heroShown ／ meta description ／ og:image:alt（alt 不许带数字）。
   改数据后这里会逐处指出不一致，不用记得同步页面。 */
(function checkStaticCounts() {
  const p = path.join(root, 'index.html');
  if (!fs.existsSync(p)) { errors.push('缺少 index.html，无法核对静态数字'); return; }
  const html = fs.readFileSync(p, 'utf8');

  const act = {
    main: items.length,
    archive: archive.length,
    total: items.length + archive.length,
    recipes: items.filter(x => x.grid || (x.shape === 'shapeless' && x.mats && x.mats[0] && x.mats[0] !== '待补充')).length,
    proc: items.reduce((s, x) => s + (x.proc || []).filter(l => l.indexOf('另有') !== 0).length, 0),
    grey: GREY.length,
    icons: fs.readdirSync(path.join(root, 'icons')).filter(f => /\.png$/i.test(f)).length,
  };

  /* a) countGuard 的 data-* */
  const guard = html.match(/<div id="countGuard"[^>]*>/);
  if (!guard) errors.push('index.html 缺少 #countGuard 静态数字块（verify 第 25 条需要它）');
  else {
    Object.keys(act).forEach(k => {
      const m = guard[0].match(new RegExp(`data-${k}="(\\d+)"`));
      if (!m) errors.push(`#countGuard 缺 data-${k}`);
      else if (Number(m[1]) !== act[k]) errors.push(`静态数字不符：#countGuard data-${k}=${m[1]}，实测 ${act[k]}`);
    });
  }

  /* b) hero 的两处兜底值 */
  [['heroTotal', act.total], ['heroShown', act.main]].forEach(([id, v]) => {
    const m = html.match(new RegExp(`id="${id}">(\\d+)<`));
    if (!m) errors.push(`index.html 缺 #${id} 的静态兜底值`);
    else if (Number(m[1]) !== v) errors.push(`静态数字不符：#${id} 写 ${m[1]}，实测 ${v}`);
  });

  /* c) meta description 的五个数 */
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  const dm = desc && desc[1].match(/(\d+) 项核心条目中 (\d+) 项已在图鉴展示（配方核实 (\d+) 项、加工配方 (\d+) 条），另 (\d+) 项待补归档/);
  if (!dm) errors.push('meta description 的数字句式变了，第 25 条无法核对（请保持「N 项核心条目中 N 项…」格式）');
  else {
    [[1, act.total, '合计'], [2, act.main, '已上图鉴'], [3, act.recipes, '配方已核实'], [4, act.proc, '加工配方'], [5, act.archive, '待补归档']]
      .forEach(([i, v, label]) => {
        if (Number(dm[i]) !== v) errors.push(`静态数字不符：meta description 的${label}写 ${dm[i]}，实测 ${v}`);
      });
  }

  /* d) og:image:alt 不许带数字（数字一漂，alt 就是第二处要同步的地方） */
  const alt = html.match(/<meta property="og:image:alt" content="([^"]*)"/);
  if (alt && /\d/.test(alt[1])) errors.push('og:image:alt 里出现数字，会跟着数据漂移；改成不含数字的文案');
})();

/* 26. 名字全局唯一（2026-11-23 加）
   页面用 byCn 建索引（`if (a && !byCn[a]) byCn[a] = it;`）：同名 token 只认先注册的条目，
   后注册的那条别名静默失效——数组顺序一变，谁生效就悄悄变了。这是静默失败，必须断言。
   范围：主数组 + 归档的 cn 与 alias，所有 token 不得指向两条条目。 */
(function checkNameUnique() {
  const owner = new Map();
  items.concat(archive).forEach(it => {
    [it.cn].concat(it.alias || []).forEach(tok => {
      if (!tok) return;
      if (owner.has(tok) && owner.get(tok) !== it.id) {
        errors.push(`名字重复：「${tok}」同时指向 ${owner.get(tok)} 与 ${it.id}（后者在页面里会静默失效）`);
      } else owner.set(tok, it.id);
    });
  });
})();

/* 27. dist 与源一致（2026-11-23 加）
   docs/ 是拷贝产物。改了源却忘了重跑 build-dist，线上就是旧数据，而且没人会报错。
   做法：build-dist.js 写 tools/dist-manifest.json（源文件 sha256 + icons 数 + 构建时间 + 标记），
   这里重算源 hash 与 manifest 比对；不一致即「dist 已过期」。 */
(function checkDist() {
  const crypto = require('crypto');
  const dist = path.join(root, 'docs');
  const mf = path.join(root, 'tools', 'dist-manifest.json');
  if (!fs.existsSync(mf)) { warn.push('docs 尚未构建（node tools/build-dist.js）'); return; }
  if (!fs.existsSync(dist)) { errors.push('manifest 存在但 docs/ 目录不存在：产物被删或构建写错目录，重跑 node tools/build-dist.js'); return; }
  const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
  const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

  Object.entries(m.files || {}).forEach(([f, h]) => {
    if (sha(path.join(root, f)) !== h) errors.push(`dist 已过期：源 ${f} 已改动，重跑 node tools/build-dist.js`);
  });
  if (sha(path.join(root, 'index.html')) !== m.srcIndex) errors.push('dist 已过期：源 index.html 已改动，重跑 node tools/build-dist.js');

  const distIcons = fs.existsSync(path.join(dist, 'icons')) ? fs.readdirSync(path.join(dist, 'icons')).filter(f => f.endsWith('.png')).length : 0;
  if (distIcons !== m.icons) errors.push(`dist 已过期：docs/icons 有 ${distIcons} 张，源 icons 有 ${m.icons} 张`);
  if (distIcons !== fs.readdirSync(path.join(root, 'icons')).filter(f => f.endsWith('.png')).length)
    errors.push('docs/icons 与源 icons 数量不一致');

  const html = fs.readFileSync(path.join(root, 'docs', 'index.html'), 'utf8');
  const marker = html.match(/<!-- dist-built: ([^·]+?)(?: · ([^>]*?))? -->/);
  if (!marker || marker[1].trim() !== m.builtAt)
    errors.push(`docs/index.html 的构建标记与 manifest 不符（${marker ? marker[1].trim() : '缺失'} ≠ ${m.builtAt}），重跑 build-dist`);
  if (m.ogUrl) {
    if (!html.includes(`content="${m.ogUrl}og.png"`)) errors.push(`docs/index.html 未写入绝对 og:image（应为 ${m.ogUrl}og.png）`);
    if (!html.includes(`<meta property="og:url" content="${m.ogUrl}">`)) errors.push(`docs/index.html 缺 og:url（应为 ${m.ogUrl}，站点根不带 hash）`);
  }

  /* docs 只该有 5 项 + 404 + icons，多出来的文件会被一起公开（README 只在根目录一份） */
  if (!fs.existsSync(path.join(dist, '404.html'))) errors.push('docs/404.html 缺失（由 build-dist 生成），拼错路径会落到 GitHub 默认 404');
  const allowed = new Set(['index.html', 'items.js', 'guides.js', 'og.png', '404.html', 'sitemap.xml', 'robots.txt']);
  fs.readdirSync(dist).forEach(f => {
    if (!allowed.has(f) && f !== 'icons' && f !== 'fonts') errors.push(`dist 里有不该发布的文件：${f}`);
  });

  /* 发布物还得真的进得了仓库（或进得了 artifact）：
     本地存在但既没入库、也不走 CI 构图产物的文件，线上就是 404。
     （robots.txt 曾被 *.txt 通配挡在仓库外，本地 verify 全过、线上 404。）
     现在 docs/ 整目录不入库、由 Actions 构建后作为 artifact 部署，所以整目录被 ignore 时跳过。 */
  try {
    const { execSync } = require('child_process');
    const run = cmd => execSync(cmd, { cwd: root, stdio: 'ignore' });
    let docsIgnored = false;
    try { run('git check-ignore -q docs'); docsIgnored = true; } catch (e) { docsIgnored = false; }
    if (docsIgnored) {
      /* docs 由 CI 产出，不需要逐个文件入库；但仍要保证它们不会被「本地有、线上没有」地悄悄漏掉 */
      if (!fs.existsSync(path.join(root, '.github', 'workflows')))
        errors.push('docs/ 被 .gitignore 挡住，而仓库没有 .github/workflows：产物将无法发布');
    } else {
      const targets = ['index.html', 'items.js', 'guides.js', 'og.png', '404.html', 'sitemap.xml', 'robots.txt', 'fonts/pixel.woff2', 'fonts/OFL.txt']
        .map(f => `docs/${f}`);
      targets.forEach(t => {
        if (!fs.existsSync(path.join(root, t))) return;
        try {
          run(`git check-ignore -q "${t}"`);
          errors.push(`${t} 被 .gitignore 挡住，push 后线上会 404（本地存在 ≠ 已发布）`);
        } catch (e) { /* exit 1 = 没有被忽略，正常 */ }
      });
    }
  } catch (e) {
    warn.push('本机没有 git，跳过「发布物是否被 .gitignore 挡住」的检查');
  }
})();

/* 28. README.md 与 docs/404.html 里的计数必须等于实测（2026-11-23 加）
   第 25 条只管 index.html。README 是别人点进仓库看到的第一段文字，404 页没人看，
   两处写死数字漂了都不会有人报——所以让它们也进守卫，数值只在 build-dist 里算一次。
   README 只保留根目录一份（曾误放 docs/README.md，与根重复 57%，已删）。 */
(function checkDocsNumbers() {
  const p = path.join(root, 'README.md');
  if (!fs.existsSync(p)) { errors.push('根 README.md 缺失，无法核对数字'); return; }
  const md = fs.readFileSync(p, 'utf8');
  const want = {
    '核心条目总数': items.length + archive.length,
    '已在图鉴展示': items.length,
    '配方已核实（3×3 合成）': items.filter(x => x.grid || (x.shape === 'shapeless' && x.mats && x.mats[0] && x.mats[0] !== '待补充')).length,
    '待补归档条目': archive.length,
  };
  Object.keys(want).forEach(k => {
    const m = md.match(new RegExp(`\\| ${k.replace(/([（）])/g, '\\$1')} \\| (\\d+) \\|`));
    if (!m) errors.push(`README.md 缺少「${k}」行`);
    else if (Number(m[1]) !== want[k]) errors.push(`README.md 数字漂了：${k} 写 ${m[1]}，实测 ${want[k]}`);
  });
  const procLine = md.match(/机器加工配方 \| (\d+) 行（(\d+) 条含加工方式）/);
  const actProc = items.reduce((s, x) => s + (x.proc || []).filter(l => String(l).indexOf('另有') !== 0).length, 0);
  const actProcItems = items.filter(x => (x.proc || []).length).length;
  if (!procLine) errors.push('README.md 缺少「机器加工配方」行');
  else if (Number(procLine[1]) !== actProc || Number(procLine[2]) !== actProcItems)
    errors.push(`README.md 加工配方数字漂了：写 ${procLine[1]} 行/${procLine[2]} 条，实测 ${actProc} 行/${actProcItems} 条`);

  const p404 = path.join(root, 'docs', '404.html');
  if (!fs.existsSync(p404)) { errors.push('docs/404.html 缺失，无法核对数字'); return; }
  const h404 = fs.readFileSync(p404, 'utf8');
  const m404 = h404.match(/(\d+) 条核心条目都在/);
  if (!m404) errors.push('docs/404.html 里找不到「N 条核心条目」这句');
  else if (Number(m404[1]) !== items.length + archive.length)
    errors.push(`docs/404.html 数字漂了：写 ${m404[1]} 条核心条目，实测 ${items.length + archive.length}`);
  if (/href="\.\/"/.test(h404)) warn.push('docs/404.html 的回站链接是相对路径，深层错链会指错；应为绝对站点根');
})();

/* 29. 像素字体必须真的可加载（2026-11-23 加）
   背景：CSS 里曾声明六个字体名，全是「用户本机装的字体」，站点没打包任何字体文件，
   于是标题一直 fallback 到 monospace——设计语言只是声明，从未显示过。
   这条守四件事：@font-face 指向站内文件、家族名与 --px 首项一致、文件与许可都在 docs 里、
   且许可文本真的是 OFL（OFL-1.1 要求随字体分发许可原件）。 */
(function checkFont() {
  const css = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const face = css.match(/@font-face\{[^}]*font-family:"([^"]+)"[^}]*src:url\("([^"]+)"\)/);
  if (!face) { errors.push('index.html 没有 @font-face：标题会退回系统字体，像素风不生效'); return; }
  const [, family, src] = face;
  const px = (css.match(/--px:("([^"]+)"[^;]*)/) || [])[2];
  if (!px || px !== family) errors.push(`--px 首项是「${px || '缺失'}」，@font-face 提供的是「${family}」，字体用不上`);
  if (!/^fonts\//.test(src)) errors.push(`@font-face 的 src 指向站外或根路径（${src}），docs 里加载不到`);
  const font = path.join(root, src);
  if (!fs.existsSync(font)) { errors.push(`字体文件缺失：${src}（像素风会退回系统字体）`); return; }
  const kb = fs.statSync(font).size / 1024;
  if (kb < 10 || kb > 200) errors.push(`字体文件 ${src} 体积异常（${kb.toFixed(1)} KB，预期 10–200 KB）`);
  const lic = path.join(root, 'fonts', 'OFL.txt');
  if (!fs.existsSync(lic)) errors.push('fonts/OFL.txt 缺失：OFL-1.1 要求分发字体时随附许可原件');
  else if (!/SIL OPEN FONT LICENSE/i.test(fs.readFileSync(lic, 'utf8')))
    errors.push('fonts/OFL.txt 里找不到「SIL OPEN FONT LICENSE」，不是有效许可文本');
  const distFont = path.join(root, 'docs', src);
  if (!fs.existsSync(distFont)) errors.push(`docs/${src} 缺失，重跑 node tools/build-dist.js`);
  if (!fs.existsSync(path.join(root, 'docs', 'fonts', 'OFL.txt'))) errors.push('docs/fonts/OFL.txt 缺失，重跑 build-dist');
})();

/* 30. 用 var(--px) 的规则，字号必须是 12 的整数倍（2026-11-24 加）
   12px 位图字体只在整数倍缩放下笔画等宽；9/13/19 这类尺寸不是「略微不匀」，
   是小字笔画被挤掉、糊成一团。所以立成纪律：要么归 12/24，要么改用 --sans。
   比 12 还小的像素字号一律视为错误——那种尺寸本来也不该用位图字体。 */
(function checkPixelSizes() {
  const css = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const rules = css.match(/[^{}]+\{[^{}]*\}/g) || [];
  let checked = 0;
  rules.forEach(rule => {
    const body = rule.slice(rule.indexOf('{') + 1, rule.lastIndexOf('}'));
    if (!/font-family:\s*var\(--px\)/.test(body)) return;
    const sizes = [...body.matchAll(/font-size:([^;}]+)/g)].map(m => m[1].trim());
    if (!sizes.length) { errors.push(`用 var(--px) 的规则没写 font-size，字号靠继承（${rule.split('{')[0].trim().slice(0, 40)}）`); return; }
    sizes.forEach(v => {
      const px = [...v.matchAll(/(\d+(?:\.\d+)?)px/g)].map(m => Number(m[1]));
      if (!px.length) { errors.push(`无法解析像素字号「${v}」`); return; }
      px.forEach(n => {
        checked++;
        if (n % 12 !== 0) errors.push(`像素字号 ${n}px 不是 12 的整数倍（${v}），位图字体在该尺寸下笔画不匀或糊字`);
        else if (n < 12) errors.push(`像素字号 ${n}px 太小，位图字体在 12px 以下会糊；改用 --sans`);
      });
    });
  });
  if (!checked) errors.push('没扫到任何 var(--px) 字号，检查方式可能失效');

  /* CSS 块之外还有两个入口能写像素字号：元素上的内联 style、以及 JS 里拼的样式串。
     这两处以前完全在扫描范围外——加一个 style="font-size:10px;font-family:var(--px)" 就能绕过纪律。
     只取 font-size 的值本身，别把 letter-spacing:1px 之类的邻近数字算进来。 */
  const inline = [...css.matchAll(/style="([^"]*)"/g)].map(m => m[1]).filter(v => /font-size:/.test(v));
  const scripts = (css.match(/<script[\s\S]*?<\/script>/g) || []).join('\n');
  const jsStr = [...scripts.matchAll(/'([^'\n]*font-size:[^'\n]*)'|"([^"\n]*font-size:[^"\n]*)"|`([^`]*font-size:[^`]*)`/g)]
    .map(m => m[1] || m[2] || m[3]);
  inline.concat(jsStr).forEach(v => {
    if (!/var\(--px\)/.test(v)) return;      // 没写像素家族，交给 --sans 规则
    [...v.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)].forEach(m => {
      const n = Number(m[1]);
      checked++;
      if (n % 12 !== 0 || n < 12) errors.push(`内联/脚本里的像素字号 ${n}px 不合纪律：${v.slice(0, 60)}`);
    });
  });
})();

/* 31. 站点文本用到的字符必须都在字体子集清单里（2026-11-24 加）
   子集是按「当前用到的字符」切的。下次加条目/改文案出现清单外的字，
   浏览器会无声回退到系统字体——单字变粗变宽，混在段落里几乎看不出来。
   这里不解析 woff2（那要 fontTools），只守「数据变了、字体没跟」这个真实场景。 */
(function checkFontCharset() {
  const p = path.join(root, 'tools', 'font-charset.txt');
  if (!fs.existsSync(p)) { errors.push('tools/font-charset.txt 缺失，无法核对字体子集覆盖'); return; }
  const charset = new Set(fs.readFileSync(p, 'utf8'));
  const used = new Set();
  for (const f of ['index.html', 'items.js', 'guides.js', 'README.md']) {
    const fp = path.join(root, f);
    if (!fs.existsSync(fp)) continue;
    const t = fs.readFileSync(fp, 'utf8')
      .replace(/<!--[\s\S]*?-->/g, '')      // HTML 注释不渲染
      .replace(/\/\*[\s\S]*?\*\//g, '')     // CSS 注释同理
      .replace(/<[^>]+>/g, '');
    for (const ch of t) used.add(ch);
  }
  for (let c = 0x20; c < 0x7f; c++) used.add(String.fromCharCode(c));
  ['\n', '\r', '\t'].forEach(c => used.delete(c));
  const missing = [...used].filter(c => !charset.has(c));
  const unused = [...charset].filter(c => !used.has(c));
  if (missing.length)
    errors.push(`字体子集缺 ${missing.length} 字（${missing.slice(0, 20).join('')}${missing.length > 20 ? '…' : ''}），先把它们加进 tools/font-charset.txt 再跑 python tools/font-subset.py`);
  if (unused.length > 200) warn.push(`字体子集清单里 ${unused.length} 个字符已不再使用（可重跑子集脚本瘦身）`);
})();

/* 32. sitemap / robots 与站点根一致（2026-11-24 加）
   只有根 URL 进 sitemap：条目详情是 #item/<id> 弹层，hash 不进索引库，
   塞进去只是重复内容。这里守「sitemap 里的地址 = 当前站点根、robots 指向它」。 */
(function checkSitemap() {
  const mfPath = path.join(root, 'tools', 'dist-manifest.json');
  if (!fs.existsSync(mfPath)) return;                       // 未构建时第 27 条已提示
  const ogUrl = JSON.parse(fs.readFileSync(mfPath, 'utf8')).ogUrl;
  if (!ogUrl) { warn.push('manifest 没有 ogUrl（重跑 build-dist 时漏了 --user/--repo），sitemap 未生成'); return; }
  const sm = path.join(root, 'docs', 'sitemap.xml');
  const rb = path.join(root, 'docs', 'robots.txt');
  if (!fs.existsSync(sm)) { errors.push('docs/sitemap.xml 缺失'); return; }
  if (!fs.existsSync(rb)) { errors.push('docs/robots.txt 缺失'); return; }
  const xml = fs.readFileSync(sm, 'utf8');
  const loc = (xml.match(/<loc>(.*?)<\/loc>/) || [])[1];
  if (loc !== ogUrl) errors.push(`sitemap 的 <loc> 是 ${loc || '缺失'}，应为站点根 ${ogUrl}`);
  const hashUrls = [...xml.matchAll(/<loc>[^<]*#/g)];
  if (hashUrls.length) errors.push(`sitemap 里混进了 ${hashUrls.length} 条带 # 的地址（hash 不进索引库，只会算重复内容）`);
  const txt = fs.readFileSync(rb, 'utf8');
  if (!new RegExp(`Sitemap: ${ogUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}sitemap\\.xml`).test(txt))
    errors.push(`robots.txt 的 Sitemap 行不是 ${ogUrl}sitemap.xml`);
})();

/* 33. 产物里的绝对地址必须等于「由仓库推导出的站点根」（2026-11-24 加）
   og:image / og:url / 404 回链三处全靠 --user/--repo 两个参数，是条一旦传错就毁全站的隐线。
   CI 由 GITHUB_REPOSITORY 推导；这里在 CI 里回验产物，参数不再只是「相信它传对了」。
   本地没有这个环境变量时跳过——本地要么显式传参，要么本来就不发布。 */
(function checkDerivedUrl() {
  const repo = String(process.env.GITHUB_REPOSITORY || '').trim();
  if (!repo) return;
  const [owner, name] = repo.split('/');
  const want = `https://${owner}.github.io/${name}/`;
  const mf = path.join(root, 'tools', 'dist-manifest.json');
  if (!fs.existsSync(mf)) { errors.push('dist-manifest.json 缺失，无法核对产物地址'); return; }
  const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
  if (m.ogUrl !== want) errors.push(`manifest 的 ogUrl 是 ${m.ogUrl || '空'}，按仓库推导应为 ${want}`);
  const html = fs.readFileSync(path.join(root, 'docs', 'index.html'), 'utf8');
  [['og:image', `${want}og.png`], ['og:url', want]].forEach(([prop, val]) => {
    if (!html.includes(`property="${prop}" content="${val}"`)) errors.push(`docs/index.html 的 ${prop} 不是 ${val}`);
  });
  const h404 = fs.readFileSync(path.join(root, 'docs', '404.html'), 'utf8');
  if (!h404.includes(`href="${want}"`)) errors.push(`docs/404.html 的回站链接不是 ${want}`);
})();

/* 统计输出 */
console.log('=== 德爷生存 数据自检 ===');
console.log(`已收录条目 ${items.length} 条 | 待补归档 ${archive.length} 条 | 合计 ${items.length + archive.length} 条`);
console.log(`灰方（口径 A，页面口径）${GREY.length} 条`);
console.log(`攻略 ${guides.length} 篇 / ${guides.reduce((s, g) => s + g.sections.length, 0)} 节`);

if (warn.length) { console.log('\n[提示]'); warn.forEach(w => console.log('  - ' + w)); }
if (errors.length) {
  console.log(`\n[错误] ${errors.length} 项`);
  errors.slice(0, 60).forEach(e => console.log('  × ' + e));
  if (errors.length > 60) console.log(`  …… 其余 ${errors.length - 60} 项省略`);
  process.exit(1);
}
console.log('\n全部通过 ✅');


