/* ==========================================================================
   德爷生存（Better Than Wolves CE 中文模组版）· 物品图鉴数据
   --------------------------------------------------------------------------
   字段说明：
     id      唯一标识（按字母序排列，新增请插到对应位置）
     cn      中文名（本站译名）
     en      英文名（对应 wiki.btwce.com 条目）
     alias   中文异名 / 视频俗称数组，可留空 []
     pinyin  拼音全拼，逐字对应中文名，音节间空格分隔（首字母搜索用）
     cat     分类 key：tool / block / metal / pottery / farm / misc
     icon    图标占位字（分类配色方块里显示的字）
     img     可选：图标贴图路径，如 'icons/bark.png'；缺省或加载失败时回落成 icon 首字
     imgNeed 仅供归档数组：候选贴图文件名（如 'btw/items/bark.png'），不是资源，不参与渲染
     inherit 仅供归档数组：共用母材质的条目 id，转正时解析成母条目的 img
   --------------------------------------------------------------------------
   注意：imgNeed / inherit 都是「候选」，不是可用的图片地址。只有主数组 BTW_ITEMS
   允许写 img，且 img 必须指向 icons/ 下真实存在的文件（入库前会校验）。
   归档条目转正时，需把候选贴图解析成真实 img 并拷入 icons/。
     grid    3×3 合成网格，行优先；空位写 null；非网格配方写 null
     mats    配方材料清单。只在真有材料时写；没有就整个字段不出现，严禁写 ["待补充"] 占位
     origin  来源（掉落 / 生物产出 / 开采与工序），例：'蝙蝠掉落'、'铁矿石（开采掉落）'
             与 obtain 分工：origin 说「东西从哪来」，obtain 说「怎么得到（含机器与配比）」
     effect  效果 / 用途
     obtain  获取方式
   --------------------------------------------------------------------------
   数据来源：BTW 官方百科 wiki.btwce.com（Blocks and Items / Wiki Items）。
   凡未在百科中逐条核对的配方，一律不写 mats，不写猜测值。
   --------------------------------------------------------------------------
   【两个数组的分工】
     window.BTW_ITEMS          已收录条目：参与图鉴渲染、搜索与合成反查
     window.BTW_ITEMS_ARCHIVE  待补归档条目：配方与获取都未核实，不参与任何渲染
   把一条从归档转正：补上真实 mats / obtain 后，把对象从 ARCHIVE 移到 ITEMS，
   并重新跑数据校验。
   -------------------------------------------------------------------------- */

window.BTW_ITEMS_SHOWN = 141; // 已上图鉴条数 = window.BTW_ITEMS.length（不含归档）

window.BTW_ITEMS = [

  { id:'anchor', cn:'锚', en:'Anchor', alias:['固定锚'], pinyin:'mao', cat:'metal', icon:'锚',
    img:'icons/anchor.png',
    grid:[[null,'铁粒',null],['石砖类','石砖类','石砖类'],[null,null,null]], mats:['铁粒','石砖类'],
    effect:'把绳索固定在空中，用作吊运与升降的支点。',
    obtain:'合成：铁粒 1 + 石砖类 3（反编译 BTWBlocks.anchor 得到；石砖类为标签 stoneBrickItems，任意石砖方块可替代）。' },

  { id:'ancient-manuscript', cn:'远古手稿', en:'Ancient Manuscript', alias:['古卷'], pinyin:'yuan gu shou gao', cat:'misc', icon:'卷',
    img:'icons/ancient-manuscript.png',
    grid:null, effect:'解锁高级附魔与村民交易的关键文书。', obtain:'探索遗迹、与图书管理员交易获得。' },

  { id:'arcane-scroll', cn:'奥术卷轴', en:'Arcane Scroll', alias:['卷轴'], pinyin:'ao shu juan zhou', cat:'misc', icon:'卷',
    variants:['耐久','水下速掘','爆炸保护','摔落缓冲','火焰保护','力量','保护','水下呼吸','锋利'],
    img:'icons/arcane-scroll.png',
    grid:null, effect:'一件物品，附魔种类随机/固定，共 8 种（见 variants）；并非八个独立物品。', obtain:'探索与交易获得。' },

  { id:'axe-refined', cn:'精炼斧', en:'Refined Axe', alias:['灵魂钢斧','钢斧'], pinyin:'jing lian fu', cat:'tool', icon:'斧',
    img:'icons/axe-refined.png',
    grid:null, noGrid:true, proc:['灵魂熔炉：灵魂钢锭 + 优质工具柄 → 精炼斧 ×1', '坩埚（猛火）：精炼斧 → 灵魂钢锭 ×2'], effect:'灵魂锻造钢打造的斧，耐久与伤害高于钻石斧；代码字段名为 steelAxe（官方名 Refined Axe，不是另一件「钢斧」）。', obtain:'灵魂熔炉锻造（灵魂钢锭 + 优质工具柄 → 精炼斧 ×1，见上方「加工配方」）；坩埚（猛火）可回收灵魂钢锭 ×2。' },

  { id:'axle', cn:'传动轴', en:'Axle', alias:['齿轮轴','Gear Shaft'], pinyin:'chuan dong zhou', cat:'metal', icon:'轴',
    img:'icons/axle.png',
    grid:[['高效木线脚','绳索','高效木线脚'],[null,null,null],[null,null,null]], mats:['高效木线脚','绳索'], effect:'连接动力源与机械，可多段拼接传递旋转动力。', obtain:'合成：高效木线脚×2 + 绳索×1（由 class 文件反编译得到，排布见网格）' },

  { id:'bark-birch', cn:'白桦树皮', en:'Birch Bark', alias:['白桦皮'], pinyin:'bai hua shu pi', cat:'misc', icon:'皮',
    img:'icons/bark-birch.png',
    noGrid:true,
    grid:null, effect:'白桦剥下的树皮，可作燃料，也是鞣制皮革的前置材料。', proc:['锯：桦木原木 → 木板 ×4 + 锯末 ×2 + 树皮 ×1'],
    obtain:'锯木副产物，见上方「加工配方」' },

  { id:'bark-blood', cn:'血木树皮', en:'Blood Bark', alias:['血木皮'], pinyin:'xue mu shu pi', cat:'misc', icon:'皮',
    img:'icons/bark-blood.png',
    noGrid:true,
    grid:null, effect:'血木剥下的树皮，可作燃料，也是鞣制皮革的前置材料。', proc:['锯：血木原木 → 木板 ×4 + 灵魂尘 ×2 + 树皮 ×1'],
    obtain:'锯木副产物，见上方「加工配方」' },

  { id:'bark-jungle', cn:'丛林树皮', en:'Jungle Bark', alias:['丛林木皮'], pinyin:'cong lin shu pi', cat:'misc', icon:'皮',
    img:'icons/bark-jungle.png',
    noGrid:true,
    grid:null, effect:'丛林木剥下的树皮，可作燃料，也是鞣制皮革的前置材料。', proc:['锯：丛林木原木 → 木板 ×4 + 锯末 ×2 + 树皮 ×1'],
    obtain:'锯木副产物，见上方「加工配方」' },

  { id:'bark-oak', cn:'橡树皮', en:'Oak Bark', alias:['橡木皮'], pinyin:'xiang shu pi', cat:'misc', icon:'皮',
    img:'icons/bark-oak.png',
    noGrid:true,
    grid:null, effect:'橡木剥下的树皮，可作燃料，也是鞣制皮革的前置材料。', proc:['锯：橡木原木 → 木板 ×4 + 锯末 ×2 + 树皮 ×1'],
    obtain:'锯木副产物，见上方「加工配方」' },

  { id:'bark-spruce', cn:'云杉树皮', en:'Spruce Bark', alias:['云杉皮'], pinyin:'yun shan shu pi', cat:'misc', icon:'皮',
    img:'icons/bark-spruce.png',
    noGrid:true,
    grid:null, effect:'云杉剥下的树皮，可作燃料，也是鞣制皮革的前置材料。', proc:['锯：云杉原木 → 木板 ×4 + 锯末 ×2 + 树皮 ×1'],
    obtain:'锯木副产物，见上方「加工配方」' },

  { id:'bat-wing', cn:'蝙蝠翼', en:'Bat Wing', alias:['蝠翼'], pinyin:'bian fu yi', cat:'misc', icon:'翼',
    noGrid:true,
    img:'icons/bat-wing.png',
    grid:null, origin:'蝙蝠掉落', effect:'炼药与部分合成用的生物材料。', obtain:'击杀蝙蝠掉落。' },

  { id:'battleaxe', cn:'战斧', en:'Battle Axe', alias:['战斧（灵魂钢）'], pinyin:'zhan fu', cat:'tool', icon:'斧',
    img:'icons/battleaxe.png', noGrid:true, grid:null, proc:["灵魂熔炉：灵魂钢锭 + 优质工具柄 → 战斧 ×1","坩埚（猛火）：战斧 → 灵魂钢锭 ×5"], effect:'灵魂锻造钢打造的重型战斧，伤害高于精炼斧，挥动更慢。', obtain:'灵魂熔炉锻造（灵魂钢锭 + 优质工具柄 → 战斧 ×1，见上方「加工配方」）；坩埚（猛火）可回收灵魂钢锭 ×5' },

  { id:'bellows', cn:'风箱', en:'Bellows', alias:['鼓风器'], pinyin:'feng xiang', cat:'metal', icon:'箱',
    img:'icons/bellows.png',
    grid:[['木侧板','木侧板','木侧板'],['鞣制皮革类','鞣制皮革类','鞣制皮革类'],['齿轮','传动皮带','齿轮']], mats:['木侧板','鞣制皮革类','齿轮','传动皮带'], effect:'向火盆鼓风，把普通火升为猛火。', obtain:'合成：木侧板×3 + 鞣制皮革类×3 + 齿轮×2 + 传动皮带×1（由 class 文件反编译得到，排布见网格）' },

  { id:'belt', cn:'传动皮带', en:'Belt', alias:['皮带'], pinyin:'chuan dong pi dai', cat:'misc', icon:'带',
    img:'icons/belt.png',
    grid:[['皮革带',null,null],['皮革带',null,'皮革带'],[null,'皮革带',null]], mats:['皮革带 ×5'],
    effect:'机械传动的最小单元，大部分装置都要它。',
    obtain:'合成：皮革带×5（图案 " # / # / # "，#=皮革带，由 class 文件反编译得到，排布见网格）' },

  { id:'bench', cn:'橡木长凳', en:'Oak Wood Bench', alias:['德爷工作台','硬核工作台'], pinyin:'xiang mu chang deng', cat:'block', icon:'台',
    img:'icons/bench.png',
    grid:null, effect:'家具方块（siding 子类型），材质随木材变化；「模组唯一合成台」的说法待核', obtain:'配方与用途待核，以图鉴手册为准' },

  { id:'blasting-oil', cn:'爆破油', en:'Blasting Oil', alias:['爆炸油'], pinyin:'bao po you', cat:'misc', icon:'油',
    noGrid:true, img:'icons/blasting-oil.png',
    grid:null,
    effect:'定向爆破，比炸药更适合挖矿。',
    proc:['釜锅：地狱火尘 + 油脂 → 爆破油 ×2'],
    obtain:'釜锅：地狱火尘 + 油脂 熬制获得（见上方「加工配方」）。' },

  { id:'block-dispenser', cn:'方块发射器', en:'Block Dispenser', alias:['方块放置器'], pinyin:'fang kuai fa she qi', cat:'block', icon:'射',
    noGrid:true, img:'icons/block-dispenser.png',
    grid:null, effect:'整块放置与收回方块，自动化核心部件。', proc:['灵魂熔炉：苔石类 + 红石 + 石砖类 + 灵魂陶瓮 + 红石火把 → 方块发射器 ×14'], obtain:'灵魂熔炉锻造获得（配比见上方「加工配方」）。' },

  { id:'blood-wood-corner', cn:'血木转角', en:'Blood Wood Corner', alias:['血木拐角'], pinyin:'xue mu zhuan jiao', cat:'block', icon:'角',
    noGrid:true, img:'icons/blood-wood-corner.png', imgApprox:true, inherit:'blood-wood-plank', imgApproxFrom:'血木板',
    grid:null, effect:'血木建筑转角收口的装饰件。', proc:['锯：血木木板 → 血木转角'], obtain:'锯木获得（SawRecipeList 传 bloodWoodSidingAndCorner + 三个 stub；lang tile.fcWoodBirchSiding.blood.name 名为 Corner）' },

  { id:'blood-wood-fence', cn:'血木栅栏', en:'Blood Wood Fence', alias:['血木围栏'], pinyin:'xue mu zha lan', cat:'block', icon:'栏',
    img:'icons/blood-wood-fence.png', imgApprox:true, inherit:'blood-wood-plank', imgApproxFrom:'血木板',
    grid:null, effect:'血木围栏，用于圈养与围挡。', obtain:'以图鉴手册为准。' },

  { id:'blood-wood-moulding', cn:'血木线脚', en:'Blood Wood Moulding', alias:['血木线脚块'], pinyin:'xue mu xian jiao', cat:'block', icon:'线',
    noGrid:true, img:'icons/blood-wood-moulding.png', imgApprox:true, inherit:'blood-wood-plank', imgApproxFrom:'血木板',
    grid:null, effect:'血木建筑收边装饰件。', proc:['锯：血木木板 → 血木线脚'], obtain:'锯木获得（SawRecipeList#10 的 moulding 侧；lang tile.fcWoodSpruceMoulding.blood.name）' },

  { id:'blood-wood-plank', cn:'血木板', en:'Blood Wood Planks', alias:['血木木板'], pinyin:'xue mu ban', cat:'block', icon:'板',
    noGrid:true, img:'icons/blood-wood-plank.png',
    grid:null, effect:'血木系列建筑的基础板材。', proc:['锯：血木原木 → 木板 ×4 + 灵魂尘 ×2 + 树皮 ×1'],
    obtain:'锯木获得（SawRecipeList#addSawRecipe，输入血木原木，一次出 3 种产物：木板 ×4 + 灵魂尘 ×2 + 树皮 ×1）' },

  { id:'blood-wood-siding', cn:'血木壁板', en:'Blood Wood Siding', alias:['血木墙板'], pinyin:'xue mu bi ban', cat:'block', icon:'壁',
    noGrid:true, img:'icons/blood-wood-siding.png', imgApprox:true, inherit:'blood-wood-plank', imgApproxFrom:'血木板',
    grid:null, effect:'血木墙面装饰板材。', proc:['锯：血木木板 → 血木壁板'], obtain:'锯木获得（SawRecipeList#10 的 siding 侧；lang tile.fcWoodSpruceSiding.blood.name）' },

  { id:'blood-wood-stairs', cn:'血木楼梯', en:'Blood Wood Stairs', alias:['血木阶梯'], pinyin:'xue mu lou ti', cat:'block', icon:'梯',
    img:'icons/blood-wood-stairs.png', imgApprox:true, inherit:'blood-wood-plank', imgApproxFrom:'血木板',
    grid:[['木板类',null,null],['木板类','木板类',null],['木板类','木板类','木板类']], mats:['木板类'], effect:'血木装饰楼梯。', obtain:'合成：木板类×6（由 class 文件反编译得到，排布见网格）' },

  { id:'bone-club', cn:'骨棒槌', en:'Bone Club', alias:['骨棒'], pinyin:'gu bang chui', cat:'tool', icon:'棒',
    img:'icons/bone-club.png',
    grid:[['骨头',null,null],['骨头',null,null],[null,null,null]], mats:['骨头'], effect:'早期钝器，对付野兽比空手可靠。', obtain:'合成：骨头×2（由 class 文件反编译得到，排布见网格）' },

  { id:'breeding-harness', cn:'繁殖挽具', en:'Breeding Harness', alias:['配种具'], pinyin:'fan zhi wan ju', cat:'tool', icon:'具',
    img:'icons/breeding-harness.png',
    grid:[['皮革带','鞣制皮革类','皮革带'],['鞣制皮革类','鞣制皮革类','鞣制皮革类'],['皮革带','鞣制皮革类','皮革带']], mats:['皮革带','鞣制皮革类'], effect:'控制动物繁殖的挽具，村民交易可获得。', obtain:'与村民交易获得。' },

  { id:'brick', cn:'红砖', en:'Brick', alias:['晒砖','干砖'], pinyin:'hong zhuan', cat:'pottery', icon:'砖',
    noGrid:true, img:'icons/brick.png',
    grid:null, effect:'搭窑、砌炉与建筑的主材。', proc:['窑：未烧粗砖（已放置） → 红砖 ×4','窑：未烧陶器 → 红砖 ×2'],
    obtain:'湿黏土砖在阳光下晒干（约 20 分钟）成未烧粗砖，放置后进窑烧成红砖（窑：已放置的未烧粗砖 → 红砖 ×4）。' },

  { id:'broadhead-arrowhead', cn:'宽头箭头头', en:'Broadhead', alias:['宽箭头头'], pinyin:'kuan tou jian tou tou', cat:'misc', icon:'头',
    img:'icons/broadhead-arrowhead.png', noGrid:true, grid:null, proc:["灵魂熔炉：钢粒 → 宽头箭头头 ×2","坩埚（猛火）：宽头箭头头 → 钢粒 ×3"], effect:'宽头箭的箭头部件；官方 lang 名就是 Broadhead，与「宽头箭」（Broadhead Arrow）是两件东西。', obtain:'灵魂熔炉：钢粒 → 宽头箭头头 ×2（见上方「加工配方」）；坩埚可回收钢粒 ×3' },

  { id:'buddy-block', cn:'伙伴方块', en:'Buddy Block', alias:['伴侣方块','同伴方块'], pinyin:'huo ban fang kuai', cat:'block', icon:'伴',
    noGrid:true, img:'icons/buddy-block.png',
    grid:null, effect:'相邻方块变化时输出脉冲，可做触发器与计数器。', proc:['灵魂熔炉：石砖类 + 红石之眼 + 红石火把 → 伙伴方块 ×1'], obtain:'灵魂熔炉锻造获得（配比见上方「加工配方」）。' },

  { id:'candle', cn:'蜡烛', en:'Candle', alias:['蜡烛块'], pinyin:'la zhu', cat:'misc', icon:'烛',
    img:'icons/candle.png',
    grid:[['亚麻纤维',null,null],['油脂',null,null],[null,null,null]], mats:['亚麻纤维','油脂'],
    effect:'透明光源，适合做无痕照明。',
    obtain:'合成：亚麻纤维×1 + 油脂×1（图案 "H/T"，H=亚麻纤维、T=油脂，一次出 4，由 class 文件反编译得到）' },

  { id:'canvas', cn:'画布', en:'Canvas', alias:['帆布画'], pinyin:'hua bu', cat:'misc', icon:'布',
    noGrid:true, img:'icons/canvas.png',
    grid:null, effect:'画与装饰的画布材料。', proc:['灵魂熔炉：布料 + 木线脚 → 画布 ×8'], obtain:'灵魂熔炉锻造获得（配比见上方「加工配方」）。' },

  { id:'cauldron', cn:'釜锅', en:'Cauldron', alias:['大锅'], pinyin:'fu guo', cat:'metal', icon:'釜',
    img:'icons/cauldron.png',
    grid:[['铁锭','骨头','铁锭'],['铁锭','水桶','铁锭'],['铁锭','铁锭','铁锭']], mats:['铁锭','骨头','水桶'],
    effect:'熔炼粗铁块、煮制与染色，工业起点。',
    obtain:'合成：铁锭 7 + 水桶 1 + 骨头 1（反编译 BTWBlocks.cauldron 的图案 "#Y#/#X#/###" 得到；#=铁锭、X=水桶、Y=骨头，建议游戏内复核一次）。' },

  { id:'chisel', cn:'凿子', en:'Iron Chisel', alias:['錾子'], pinyin:'zao zi', cat:'tool', icon:'凿',
    img:'icons/chisel.png',
    grid:[['铁粒','铁粒',null],['铁粒','铁粒',null],[null,null,null]], mats:['铁粒'], effect:'凿原木取木棍与树皮；凿工作台有约 15% 成功率。', obtain:'尖锐石头与木棍合成。' },

  { id:'coal-dust', cn:'煤粉', en:'Pile of Coal Dust', alias:['煤炭粉'], pinyin:'mei fen', cat:'metal', icon:'煤',
    noGrid:true, img:'icons/coal-dust.png',
    grid:null, origin:'煤（石磨研磨）', effect:'地狱煤炭与灵魂锻造钢的原料。', obtain:'把煤放进石磨研磨。' },

  { id:'composite-bow', cn:'复合弓', en:'Composite Bow', alias:['复合长弓'], pinyin:'fu he gong', cat:'tool', icon:'弓',
    img:'icons/composite-bow.png',
    grid:[['骨头','木线脚','胶'],['细线','骨头','木线脚'],['骨头','木线脚','胶']], mats:['骨头','木线脚','胶','细线'], effect:'射程与威力高于普通弓，后期主力远程武器。', obtain:'合成：骨头×3 + 木线脚×3 + 胶×2 + 细线×1（由 class 文件反编译得到，排布见网格）' },

  { id:'concentrated-hellfire', cn:'浓缩地狱火', en:'Concentrated Hellfire', alias:['浓缩狱火'], pinyin:'nong suo di yu huo', cat:'misc', icon:'焰',
    noGrid:true, img:'icons/concentrated-hellfire.png',
    grid:null, effect:'顶级燃料，猛火与高级冶炼的燃料来源。', proc:['釜锅：地狱火尘 → 浓缩地狱火 ×1'], obtain:'釜锅：地狱火尘熬制获得（见上方「加工配方」）。' },

  { id:'creeper-head', cn:'苦力怕头颅', en:'Creeper Head', alias:['爬行者头'], pinyin:'ku li pa tou lu', cat:'misc', icon:'头',
    noGrid:true,
    grid:null, origin:'苦力怕掉落（概率）', effect:'头颅装饰与部分合成材料。', obtain:'击杀苦力怕概率掉落。' },

  { id:'creeper-oyster-block', cn:'苦力怕牡蛎块', en:'Block of Oysters', alias:['牡蛎块','苦力怕牡蛎'], pinyin:'ku li pa mu li kuai', cat:'block', icon:'蛎',
    img:'icons/creeper-oyster-block.png', noGrid:true, grid:null, proc:["锯：苦力怕牡蛎 → 苦力怕牡蛎块 ×8"], effect:'整块的苦力怕牡蛎，可锯成散料，也可再压成台阶。', obtain:'锯：苦力怕牡蛎 → 苦力怕牡蛎块 ×8（见上方「加工配方」）' },

  { id:'creeper-oyster-slab', cn:'苦力怕牡蛎台阶', en:'Oyster Slab', alias:['牡蛎台阶','苦力怕牡蛎半砖'], pinyin:'ku li pa mu li tai jie', cat:'block', icon:'阶',
    img:'icons/creeper-oyster-slab.png', imgApprox:true, inherit:'creeper-oyster-block', imgApproxFrom:'苦力怕牡蛎块', grid:[["苦力怕牡蛎块","苦力怕牡蛎块","苦力怕牡蛎块"],[null,null,null],[null,null,null]], mats:["苦力怕牡蛎块"], effect:'牡蛎质地的装饰台阶，一次合成出 6 个。贴图为块材近似。', obtain:'合成：苦力怕牡蛎块 3（图案 ###，一次出 6 个）' },

  { id:'creeper-oysters', cn:'苦力怕荔枝', en:'Creeper Oysters', alias:['舍利子','爬行者荔枝'], pinyin:'ku li pa li zhi', cat:'misc', icon:'荔',
    noGrid:true, img:'icons/creeper-oysters.png',
    grid:null, effect:'苦力怕牡蛎块锯切得到的材料，模组部分配方的材料之一；具体用途以图鉴手册为准。', proc:['锯：苦力怕牡蛎块 → 苦力怕荔枝 ×8','锯：苦力怕牡蛎台阶 → 苦力怕荔枝 ×4'], obtain:'锯：苦力怕牡蛎块 → 苦力怕荔枝 ×8（牡蛎台阶 → ×4）' },

  { id:'crucible', cn:'坩埚', en:'Crucible', alias:['熔炉埚'], pinyin:'gan guo', cat:'pottery', icon:'埚',
    noGrid:true, img:'icons/crucible.png',
    grid:null, effect:'高温熔炼钢与钻石锭的唯一容器，需架在猛火上。', proc:['窑：未烧陶器 → 坩埚 ×1'], obtain:'陶土塑形后入窑烧制。' },

  { id:'detector-block', cn:'探测方块', en:'Detector Block', alias:['探测块'], pinyin:'tan ce fang kuai', cat:'block', icon:'探',
    noGrid:true, img:'icons/detector-block.png',
    grid:null, effect:'探测实体经过并输出红石信号。', proc:['灵魂熔炉：石砖类 + 红石之眼 + 红石 + 红石火把 → 探测方块 ×12'], obtain:'灵魂熔炉锻造获得（配比见上方「加工配方」）。' },

  { id:'diamond-armor-plate', cn:'钻石甲板', en:'Diamond Armor Plate', alias:['钻石护甲板'], pinyin:'zuan shi jia ban', cat:'misc', icon:'甲',
    img:'icons/diamond-armor-plate.png', grid:[["皮革带","钻石锭","皮革带"],[null,"衬垫",null],[null,null,null]], mats:["皮革带","钻石锭","衬垫"], proc:["坩埚（猛火）：钻石甲板 → 钻石锭 ×1"], effect:'钻石护甲的板件，配皮革带与衬垫成型。', obtain:'合成：皮革带 ×2 + 钻石锭 1 + 衬垫 1（图案 #X# /  Y ）；坩埚可回收钻石锭 ×1' },

  { id:'diamond-chisel', cn:'钻石凿', en:'Diamond Chisel', alias:['钻石錾'], pinyin:'zuan shi zao', cat:'tool', icon:'凿',
    img:'icons/diamond-chisel.png', grid:[["钻石锭",null,null],[null,null,null],[null,null,null]], mats:["钻石锭"], proc:["坩埚（猛火）：钻石凿 → 钻石锭 ×1"], effect:'钻石级雕刻工具，耐久高于铁凿。', obtain:'合成：钻石锭 1（图案 X  ）；坩埚可回收钻石锭 ×1（见上方「加工配方」）' },

  { id:'diamond-ingot', cn:'钻石锭', en:'Diamond Ingot', alias:['钻石锭'], pinyin:'zuan shi ding', cat:'metal', icon:'钻',
    img:'icons/diamond-ingot.png',
    grid:[['钻石','铁锭','苦力怕荔枝'],[null,null,null],[null,null,null]],
    mats:['钻石','铁锭','苦力怕荔枝'], effect:'钻石级工具与装备的前置金属，由钻石、铁锭与苦力怕荔枝合成。', proc:['坩埚：钻石甲板 → 钻石锭 ×1','坩埚：钻石凿 → 钻石锭 ×1','坩埚：钻石剪刀 → 钻石锭 ×2','坩埚：钻石镐 → 钻石锭 ×3','坩埚：钻石斧 → 钻石锭 ×2','坩埚：钻石剑 → 钻石锭 ×2','坩埚：钻石锄 → 钻石锭 ×1','坩埚：钻石锹 → 钻石锭 ×1','另有 6 条同类加工'], obtain:'按上述配方合成，配比以图鉴手册为准。' },

  { id:'diamond-shears', cn:'钻石剪刀', en:'Diamond Shears', alias:['钻石剪'], pinyin:'zuan shi jian dao', cat:'tool', icon:'剪',
    img:'icons/diamond-shears.png', grid:[["钻石锭",null,null],[null,"钻石锭",null],[null,null,null]], mats:["钻石锭"], proc:["坩埚（猛火）：钻石剪刀 → 钻石锭 ×2"], effect:'剪羊毛与大麻的耐久之选，比铁剪刀耐用得多。', obtain:'合成：钻石锭 2（图案 X / X）；坩埚可回收钻石锭 ×2（见上方「加工配方」）' },

  { id:'dormant-soulforge', cn:'沉睡灵魂锻造炉', en:'Dormant Soulforge', alias:['未激活魂炉','休眠灵魂锻造炉'], pinyin:'chen shui ling hun duan zao lu', cat:'block', icon:'炉',
    img:'icons/dormant-soulforge.png',
    grid:null, effect:'未激活的灵魂锻造炉。单方块，非多方块：与灵魂锻造炉共用同一套模型，放置时朝向背对玩家；自身没有容器界面，激活后才是可右键打开的锻造炉。', obtain:'获取方式待核（代码的合成与锻造表中未找到本体来源）。' },

  { id:'dung', cn:'粪便', en:'Dung', alias:['肥料'], pinyin:'fen bian', cat:'farm', icon:'粪',
    noGrid:true,
    img:'icons/dung.png',
    grid:null, effect:'肥料与鞣制皮革的辅料。', obtain:'生物产出（具体来源待核）' },

  { id:'dynamite', cn:'炸药', en:'Dynamite', alias:['雷管炸药'], pinyin:'zha yao', cat:'misc', icon:'炸',
    img:'icons/dynamite.png',
    grid:[['纸','导火线',null],['纸','爆破油',null],['纸','锯末类',null]], mats:['纸','导火线','爆破油','锯末类'], effect:'可控爆破，用于采矿与清障。', obtain:'合成：纸×3 + 导火线×1 + 爆破油×1 + 锯末类×1（由 class 文件反编译得到，排布见网格）' },

  { id:'egg', cn:'蛋', en:'Egg', alias:['鸡蛋'], pinyin:'dan', cat:'farm', icon:'蛋',
    noGrid:true,
    img:'icons/egg.png',
    grid:null, origin:'鸡产出', effect:'烹饪与合成材料。', obtain:'鸡下蛋。' },

  { id:'element', cn:'元素', en:'Element', alias:['元素粉'], pinyin:'yuan su', cat:'misc', icon:'元',
    noGrid:true, img:'icons/element.png',
    grid:null,
    effect:'仪式与高级附魔的关键道具。',
    proc:['釜锅：烈焰粉 + 红石 + 线 → 元素 ×1'],
    obtain:'釜锅：烈焰粉 + 红石 + 线 熬制获得（见上方「加工配方」）。' },

  { id:'ender-spectacles', cn:'末影眼镜', en:'Ender Spectacles', alias:['末影护目镜'], pinyin:'mo ying yan jing', cat:'tool', icon:'镜',
    img:'icons/ender-spectacles.png',
    grid:null, effect:'戴上后可直视末影人而不被激怒。', obtain:'与图书管理员交易获得。' },

  { id:'fabric', cn:'布料', en:'Fabric', alias:['亚麻布'], pinyin:'bu liao', cat:'misc', icon:'布',
    img:'icons/fabric.png', grid:[["大麻纤维","大麻纤维","大麻纤维"],["大麻纤维","大麻纤维","大麻纤维"],["大麻纤维","大麻纤维","大麻纤维"]], mats:["大麻纤维"], proc:["织机：大麻纤维 → 布料 ×1"], effect:'织机与工作台都能做的织物，风车帆、衬垫、画布的上游材料。', obtain:'合成：大麻纤维 9（图案 ###/###/###）；织机：大麻纤维 → 布料 ×1（见上方「加工配方」）' },

  { id:'feather', cn:'羽毛', en:'Feather', alias:['鸡毛'], pinyin:'yu mao', cat:'misc', icon:'羽',
    noGrid:true,
    img:'icons/feather.png',
    grid:null, origin:'鸡掉落', effect:'箭矢与部分合成的基础材料。', obtain:'击杀鸡掉落。' },

  { id:'fire-plough', cn:'火犁', en:'Fire Plough', alias:['取火犁'], pinyin:'huo li', cat:'tool', icon:'犁',
    img:'icons/fire-plough.png',
    grid:[['木棍','木棍',null],[null,null,null],[null,null,null]], mats:['木棍'], effect:'手工取火工具，前期没有火源时的救命道具。', obtain:'合成：木棍×2（由 class 文件反编译得到，排布见网格）' },

  { id:'fuse', cn:'导火线', en:'Fuse', alias:['引信'], pinyin:'dao huo xian', cat:'misc', icon:'火',
    noGrid:true, img:'icons/fuse.png',
    grid:null,
    effect:'炸药与部分爆破装置的点火材料。',
    proc:['釜锅：火药 + 线 → 导火线 ×2'],
    obtain:'釜锅：火药 + 线 熬制获得（见上方「加工配方」）。' },

  { id:'gear', cn:'齿轮', en:'Gear', alias:['木齿轮'], pinyin:'chi lun', cat:'metal', icon:'轮',
    img:'icons/gear.png',
    grid:[[null,'木棍',null],['木棍','原木类','木棍'],[null,'木棍',null]], mats:['木棍','原木类'], effect:'机械传动的最小单元，大部分装置都要它。', obtain:'合成：木棍 2 + 原木类 1（反编译所得，图案 X／X#X／X）' },

  { id:'gear-box', cn:'齿轮箱', en:'Gear Box', alias:['变速箱'], pinyin:'chi lun xiang', cat:'metal', icon:'齿',
    img:'icons/gear-box.png',
    grid:[['高效木侧板','齿轮','高效木侧板'],['齿轮','传动轴','齿轮'],['高效木侧板','齿轮','高效木侧板']], mats:['高效木侧板','齿轮','传动轴'], effect:'改变传动方向，把动力分配到多条产线。', obtain:'合成：高效木侧板×4 + 齿轮×4 + axle×1（由 class 文件反编译得到，排布见网格）' },

  { id:'glue', cn:'胶', en:'Glue', alias:['胶水','黏胶'], pinyin:'jiao', cat:'misc', icon:'胶',
    noGrid:true, img:'icons/glue.png',
    grid:null,
    effect:'复合弓与部分合成用的黏合剂。',
    proc:['釜锅（猛火）：整张皮革 → 胶 ×1', '釜锅（猛火）：切制皮革 → 胶 ×1', '另有 15 条同类加工（各类皮革甲、马鞍、繁殖挽具、书等均可熬成胶）'],
    obtain:'釜锅（需猛火）：皮革类熬制获得（见上方「加工配方」）。' },

  { id:'grate', cn:'格栅板', en:'Grate', alias:['格栅'], pinyin:'ge zha ban', cat:'block', icon:'栅',
    img:'icons/grate.png',
    grid:[['线类','木棍','线类'],['木棍','木棍','木棍'],['线类','木棍','线类']], mats:['线类','木棍'],
    effect:'透气格栅块，做隔断与漏斗过滤。',
    obtain:'合成：线类×4 + 木棍×5（图案 "S#S/###/S#S"，#=木棍、S=线类，由 class 文件反编译得到，排布见网格）' },

  { id:'ground-netherrack', cn:'碎地狱岩', en:'Ground Netherrack', alias:['磨碎地狱岩'], pinyin:'sui di yu yan', cat:'misc', icon:'岩',
    noGrid:true, img:'icons/ground-netherrack.png',
    grid:null, effect:'地狱火尘与地狱煤炭的中间料。', proc:['磨石：地狱岩 → 碎地狱岩 ×1'], obtain:'地狱岩进石磨研磨。' },

  { id:'hand-crank', cn:'手摇曲柄', en:'Hand Crank', alias:['摇把'], pinyin:'shou yao qu bing', cat:'metal', icon:'柄',
    img:'icons/hand-crank.png',
    grid:[[null,null,'木棍'],[null,'木棍',null],['石砖类','齿轮','石砖类']], mats:['木棍','石砖类','齿轮'], effect:'最廉价的动力源，前期带动石磨与锯。', obtain:'合成：木棍×2 + 石砖类×2 + 齿轮×1（由 class 文件反编译得到，排布见网格）' },

  { id:'hellfire-dust', cn:'地狱火尘', en:'Hellfire Dust', alias:['狱火粉'], pinyin:'di yu huo chen', cat:'misc', icon:'尘',
    noGrid:true, img:'icons/hellfire-dust.png',
    grid:null, effect:'高强度燃料粉末，用于火盆与坩埚。', proc:['漏斗：碎地狱岩 → 地狱火尘 ×1'], obtain:'碎地狱岩研磨获得。' },

  { id:'hemp', cn:'大麻', en:'Hemp', alias:['麻'], pinyin:'da ma', cat:'farm', icon:'麻',
    noGrid:true, img:'icons/hemp.png',
    grid:null, origin:'大麻种子（种植）', effect:'纤维作物，绳子与柳条的唯一来源。', obtain:'种下大麻种子后成熟收割。' },

  { id:'hemp-fiber', cn:'亚麻纤维', en:'Hemp Fibers', alias:['大麻纤维','纤维'], pinyin:'ya ma xian wei', cat:'misc', icon:'纤',
    noGrid:true, img:'icons/hemp-fiber.png',
    grid:null, effect:'编织柳条与绳子的原材料。', proc:['磨石：大麻 → 亚麻纤维 ×4'], obtain:'磨石：大麻 → 亚麻纤维 ×4' },

  { id:'hemp-seeds', cn:'大麻种子', en:'Hemp Seeds', alias:['麻种'], pinyin:'da ma zhong zi', cat:'farm', icon:'种',
    noGrid:true, img:'icons/hemp-seeds.png',
    grid:null, origin:'大麻（收获）', effect:'大麻的种植起点，可反复播种。', obtain:'收割大麻时掉落。' },

  { id:'hibachi', cn:'火盆', en:'Hibachi', alias:['炭盆'], pinyin:'huo pen', cat:'metal', icon:'盆',
    img:'icons/hibachi.png',
    grid:[['浓缩地狱火','浓缩地狱火','浓缩地狱火'],['石砖类','元素','石砖类'],['石砖类','红石','石砖类']], mats:['浓缩地狱火','石砖类','元素','红石'], effect:'稳定高温火源，釜锅与坩埚的灶台。', obtain:'合成：浓缩地狱火×3 + 石砖类×4 + 元素×1 + 红石×1（由 class 文件反编译得到，排布见网格）' },

  { id:'hoe-refined', cn:'精炼锄', en:'Refined Hoe', alias:['灵魂钢锄','钢锄'], pinyin:'jing lian chu', cat:'tool', icon:'锄',
    img:'icons/hoe-refined.png',
    grid:null, noGrid:true, proc:['灵魂熔炉：灵魂钢锭 + 优质工具柄 → 精炼锄 ×1', '坩埚（猛火）：精炼锄 → 灵魂钢锭 ×2'], effect:'灵魂锻造钢锄，耐久极高；代码字段名 steelHoe（官方名 Refined Hoe，不是另一件「钢锄」）。', obtain:'灵魂熔炉锻造（灵魂钢锭 + 优质工具柄 → 精炼锄 ×1，见上方「加工配方」）；坩埚（猛火）可回收灵魂钢锭 ×2。' },

  { id:'hopper', cn:'漏斗', en:'Hopper', alias:['料斗'], pinyin:'lou dou', cat:'metal', icon:'斗',
    img:'icons/hopper.png',
    grid:[['木侧板',null,'木侧板'],['齿轮','木压力板','齿轮'],[null,'木转角类',null]], mats:['木侧板','齿轮','木压力板','木转角类'], effect:'自动收集与转运物品，自动化流水线必备。', obtain:'合成：木侧板×2 + 齿轮×2 + 木压力板×1 + woodenCorners×1（由 class 文件反编译得到，排布见网格）' },

  { id:'infernal-enchanter', cn:'地狱附魔台', en:'Infernal Enchanter', alias:['炼狱附魔台'], pinyin:'di yu fu mo tai', cat:'block', icon:'魔',
    img:'icons/infernal-enchanter.png',
    grid:[['蜡烛','骨头','蜡烛'],['灵魂钢锭','附魔台','灵魂钢锭'],['灵魂钢锭','灵魂钢锭','灵魂钢锭']], mats:['蜡烛','骨头','灵魂钢锭','附魔台'], effect:'地狱系附魔的高级台座。', obtain:'合成：candle×2 + 骨头×1 + soulforgedSteelIngot×5 + enchanting_table×1（由 class 文件反编译得到，排布见网格）' },

  { id:'iron-chunk', cn:'粗铁块', en:'Chunk of Iron Ore', alias:['粗铁'], pinyin:'cu tie kuai', cat:'metal', icon:'铁',
    noGrid:true, img:'icons/iron-chunk.png',
    grid:null, origin:'铁矿石（开采掉落）', effect:'不能直接使用，必须熔炼成铁粒。', obtain:'开采铁矿石掉落。' },

  { id:'iron-ingot', cn:'铁锭', en:'Iron Ingot', alias:['铁块锭'], pinyin:'tie ding', cat:'metal', icon:'锭',
    img:'icons/iron-ingot.png',
    grid:[['铁粒','铁粒','铁粒'],['铁粒','铁粒','铁粒'],['铁粒','铁粒','铁粒']], mats:['铁粒'], effect:'工具、釜锅与机械部件的通用金属。', proc:['坩埚：铁镐 → 铁锭 ×2','坩埚：锯 → 铁锭 ×2','坩埚：铁块 → 铁锭 ×9','坩埚：铁马铠 → 铁锭 ×4','窑：铁矿石碎块堆 → 铁锭 ×8'], obtain:'合成：铁粒 9（反编译所得，图案 ###/###/###；坩埚回收铁粒那条已并入本条主配方，不再单列）。' },

  { id:'iron-nugget', cn:'铁粒', en:'Iron Nugget', alias:['铁力'], pinyin:'tie li', cat:'metal', icon:'粒',
    noGrid:true, img:'icons/iron-nugget.png',
    grid:null, effect:'九粒合成一锭铁，也是箭矢与零件的原料。', proc:['坩埚：锁子甲 → 铁粒 ×2','坩埚：桶 → 铁粒 ×5','坩埚：岩浆桶 → 铁粒 ×5','坩埚：水桶 → 铁粒 ×5','坩埚：奶桶 → 铁粒 ×5','坩埚：水泥桶 → 铁粒 ×5','坩埚：铁斧 → 铁粒 ×12','坩埚：铁剑 → 铁粒 ×12','另有 35 条同类加工'], obtain:'粗铁块在釜锅中熔炼。' },

  { id:'large-basket', cn:'大篮子', en:'Wicker Basket', alias:['大筐'], pinyin:'da lan zi', cat:'tool', icon:'筐',
    img:'icons/large-basket.png',
    grid:[['大麻纤维','大麻纤维',null],['柳条板','柳条板',null],['柳条板','柳条板',null]], mats:['大麻纤维','柳条板'], effect:'大容量收纳容器，可放在地面。', obtain:'合成：大麻纤维×2 + 柳条板×4（由 class 文件反编译得到，排布见网格）' },

  { id:'lens', cn:'透镜', en:'Lens', alias:['凸透镜'], pinyin:'tou jing', cat:'block', icon:'镜',
    img:'icons/lens.png',
    grid:[['金锭','玻璃','金锭'],['金锭',null,'金锭'],['金锭','钻石','金锭']], mats:['金锭','玻璃','钻石'], effect:'聚光与聚焦，可用于点燃与光学装置。', obtain:'合成：金锭 6 + 玻璃 1 + 钻石 1（反编译所得；镜像排布 G#G／G G／GDG 同样成立）' },

  { id:'loose-stone', cn:'松散石头', en:'Loose Rock', alias:['松散岩石'], pinyin:'song shi shi tou', cat:'misc', icon:'石',
    img:'icons/loose-stone.png',
    grid:null, effect:'可以加工成尖锐石头，是开局第一块材料。', obtain:'空手敲击地表裸石获得。' },

  { id:'mill-stone', cn:'石磨', en:'Millstone', alias:['磨盘'], pinyin:'shi mo', cat:'metal', icon:'磨',
    img:'icons/mill-stone.png',
    grid:[['石砖类','石砖类','石砖类'],['石砖类','石砖类','石砖类'],['石砖类','齿轮','石砖类']], mats:['石砖类','齿轮'], effect:'研磨煤、地狱岩与谷物，中前期核心机械。', obtain:'合成：石砖类×8 + 齿轮×1（由 class 文件反编译得到，排布见网格）' },

  { id:'mining-charge', cn:'采矿炸药', en:'Mining Charge', alias:['矿用炸药'], pinyin:'cai kuang zha yao', cat:'misc', icon:'炸',
    img:'icons/mining-charge.png',
    grid:[['绳索','黏液球','绳索'],['炸药','炸药','炸药'],['炸药','炸药','炸药']], mats:['绳索','黏液球','炸药'], effect:'定向爆破，比炸药更适合挖矿。', obtain:'合成：绳索×2 + 黏液球×1 + 炸药×6（由 class 文件反编译得到，排布见网格）' },

  { id:'nethercoal', cn:'地狱煤炭', en:'Nethercoal', alias:['狱炭'], pinyin:'di yu mei tan', cat:'metal', icon:'炭',
    noGrid:true, img:'icons/nethercoal.png',
    grid:null, effect:'燃烧时间远超普通煤，长途冶炼首选。', proc:['釜锅：地狱火尘 + 煤粉 → 地狱煤炭 ×1'], obtain:'釜锅：地狱火尘 + 煤粉 → 地狱煤炭 ×1' },

  { id:'packed-earth', cn:'压实土', en:'Packed Earth', alias:['夯实土'], pinyin:'ya shi tu', cat:'block', icon:'土',
    noGrid:true, img:'icons/packed-earth.png',
    grid:null, effect:'稳定的土质建材，可做墙体与地基。', proc:['活塞打包：松散泥土 → 压实土'], obtain:'活塞打包获得（PistonPackingRecipeList#1 首参 aestheticEarth、子类型 6）' },

  { id:'padding', cn:'衬垫', en:'Padding', alias:['垫料'], pinyin:'chen dian', cat:'misc', icon:'垫',
    img:'icons/padding.png',
    grid:[['布料',null,null],['羊毛',null,null],['布料',null,null]], mats:['布料 ×2','羊毛'],
    effect:'板甲与鞍具的内衬材料。',
    obtain:'合成：布料×2 + 羊毛×1（图案 "C/W/C"，C=布料、W=羊毛，由 class 文件反编译得到；织机也能编出，一次 2 个）' },

  { id:'pickaxe-refined', cn:'精炼镐', en:'Refined Pickaxe', alias:['灵魂钢镐','钢镐'], pinyin:'jing lian gao', cat:'tool', icon:'镐',
    img:'icons/pickaxe-refined.png',
    grid:null, noGrid:true, proc:['灵魂熔炉：灵魂钢锭 + 优质工具柄 → 精炼镐 ×1', '坩埚（猛火）：精炼镐 → 灵魂钢锭 ×3'], effect:'可挖动黑曜石级方块的高级镐；代码字段名 steelPickaxe（官方名 Refined Pickaxe，不是另一件「钢镐」）。', obtain:'灵魂熔炉锻造（灵魂钢锭 + 优质工具柄 → 精炼镐 ×1，见上方「加工配方」）；坩埚（猛火）可回收灵魂钢锭 ×3。' },

  { id:'planter', cn:'种植箱', en:'Planter', alias:['花盆','种植槽'], pinyin:'zhong zhi xiang', cat:'pottery', icon:'种',
    noGrid:true, img:'icons/planter.png',
    grid:null,
    effect:'一格自动播种与收获的陶制农具。\n本体合成配方未找到；字节码只证实「种植箱 + 灵魂沙 → 装土种植箱」这条无序装填操作。', proc:['窑：未烧陶器 → 种植箱 ×1'], obtain:'黏土塑形后入窑烧制。' },

  { id:'plate-boots', cn:'板甲靴', en:'Plate Boots', alias:['钢制脚部甲'], pinyin:'ban jia xue', cat:'tool', icon:'甲',
    noGrid:true, img:'icons/plate-boots.png',
    grid:null, effect:'钢制脚部护甲，减伤高于皮甲。', proc:['灵魂熔炉：灵魂锻造钢 + 钢护甲板 → 板甲靴 ×1'], obtain:'灵魂熔炉锻造获得（灵魂锻造钢 + 钢护甲板，见上方「加工配方」）。' },

  { id:'plate-breastplate', cn:'板甲胸甲', en:'Breastplate', alias:['钢制胸部甲'], pinyin:'ban jia xiong jia', cat:'tool', icon:'甲',
    img:'icons/plate-breastplate.png',
    noGrid:true, grid:null, effect:'钢制胸部护甲，减伤高于皮甲。', proc:['灵魂熔炉：灵魂锻造钢 + 钢护甲板 → 板甲胸甲 ×1'],
    obtain:'灵魂熔炉锻造获得（灵魂锻造钢 + 钢护甲板，见上方「加工配方」）。' },

  { id:'plate-helm', cn:'板甲头盔', en:'Plate Helm', alias:['钢制头部甲'], pinyin:'ban jia tou kui', cat:'tool', icon:'甲',
    img:'icons/plate-helm.png',
    noGrid:true, grid:null, effect:'钢制头部护甲，减伤高于皮甲。', proc:['灵魂熔炉：灵魂锻造钢 + 钢护甲板 → 板甲头盔 ×1'],
    obtain:'灵魂熔炉锻造获得（灵魂锻造钢 + 钢护甲板，见上方「加工配方」）。' },

  { id:'plate-leggings', cn:'板甲护腿', en:'Plate Leggings', alias:['钢制腿部甲'], pinyin:'ban jia hu tui', cat:'tool', icon:'甲',
    noGrid:true, img:'icons/plate-leggings.png',
    grid:null, effect:'钢制腿部护甲，减伤高于皮甲。', proc:['灵魂熔炉：灵魂锻造钢 + 钢护甲板 → 板甲护腿 ×1'], obtain:'灵魂熔炉锻造获得（灵魂锻造钢 + 钢护甲板，见上方「加工配方」）。' },

  { id:'platform', cn:'平台', en:'Platform', alias:['吊台'], pinyin:'ping tai', cat:'block', icon:'台',
    img:'icons/platform.png',
    grid:[['高效木线脚','柳条板','高效木线脚'],[null,'高效木线脚',null],['高效木线脚','柳条板','高效木线脚']], mats:['高效木线脚','柳条板'], effect:'挂在绳上作为可移动的作业平台。', obtain:'合成：高效木线脚 4 + 柳条板 2（反编译所得）' },

  { id:'potash', cn:'草木灰', en:'Potash', alias:['钾盐'], pinyin:'cao mu hui', cat:'misc', icon:'灰',
    noGrid:true,
    img:'icons/potash.png',
    grid:null, effect:'用于玻璃与部分冶炼流程，以图鉴手册为准。', proc:['釜锅：原木类 → 草木灰 ×1','釜锅：木板类 → 草木灰 ×1','釜锅：木侧板 → 草木灰 ×1','釜锅：木线脚 → 草木灰 ×1','釜锅：木转角类 → 草木灰 ×1','釜锅：锯末 → 草木灰 ×1','釜锅：树皮类 → 草木灰 ×1','釜锅：稻草 → 草木灰 ×1'], obtain:'釜锅：原木类 → 草木灰 ×1（8 种原木皆可）' },

  { id:'pulley', cn:'滑轮', en:'Pulley', alias:['吊轮'], pinyin:'hua lun', cat:'metal', icon:'轮',
    img:'icons/pulley.png',
    grid:[['高效木侧板','铁锭','高效木侧板'],['齿轮','红石锁存器','齿轮'],['高效木侧板','铁锭','高效木侧板']], mats:['高效木侧板','铁锭','齿轮','红石锁存器'], effect:'绳索升降的动力部件，配合锚与平台。', obtain:'合成：高效木侧板×4 + 铁锭×2 + 齿轮×2 + 红石锁存器×1（由 class 文件反编译得到，排布见网格）' },

  { id:'raw-beef', cn:'生牛肉', en:'Raw Beef', alias:['生牛柳'], pinyin:'sheng niu rou', cat:'farm', icon:'肉',
    noGrid:true,
    img:'icons/raw-beef.png',
    grid:null, origin:'牛掉落', effect:'生食有风险，烹饪后更安全。', obtain:'击杀牛掉落。' },

  { id:'raw-chicken', cn:'生鸡肉', en:'Raw Chicken', alias:['生鸡块'], pinyin:'sheng ji rou', cat:'farm', icon:'肉',
    noGrid:true,
    img:'icons/raw-chicken.png',
    grid:null, origin:'鸡掉落', effect:'生食可能中毒，建议烹饪。', obtain:'击杀鸡掉落。' },

  { id:'raw-fish', cn:'生鱼', en:'Raw Fish', alias:['生鱼肉'], pinyin:'sheng yu', cat:'farm', icon:'鱼',
    noGrid:true,
    img:'icons/raw-fish.png',
    grid:null, origin:'钓鱼产出', effect:'钓鱼获得的生食。', obtain:'钓鱼获得。' },

  { id:'raw-mutton', cn:'生羊肉', en:'Raw Mutton', alias:['生羊排'], pinyin:'sheng yang rou', cat:'farm', icon:'肉',
    noGrid:true,
    img:'icons/raw-mutton.png',
    grid:null, origin:'羊掉落', effect:'生食回复少，烹饪后更好。', obtain:'击杀羊掉落。' },

  { id:'raw-wolfchop', cn:'生狼排', en:'Raw Wolfchop', alias:['狼肉'], pinyin:'sheng lang pai', cat:'farm', icon:'排',
    noGrid:true, img:'icons/raw-wolfchop.png',
    grid:null, effect:'模组特色的生肉，来源为狼。', proc:['磨石：伴侣方块 → 生狼排 ×1'], obtain:'磨石研磨伴侣方块获得（见上方「加工配方」）。' },

  { id:'redstone-clutch', cn:'红石离合器', en:'Redstone Clutch', alias:['红石离合'], pinyin:'hong shi li he qi', cat:'metal', icon:'合',
    img:'icons/redstone-clutch.png',
    grid:[['高效木侧板','齿轮','高效木侧板'],['齿轮','红石锁存器','齿轮'],['高效木侧板','齿轮','高效木侧板']], mats:['高效木侧板','齿轮','红石锁存器'], effect:'用红石信号断开机械动力的传动部件。', obtain:'合成：高效木侧板×4 + 齿轮×4 + 红石锁存器×1（由 class 文件反编译得到，排布见网格）' },

  { id:'redstone-eye', cn:'红石之眼', en:'Redstone Eye', alias:['红石眼'], pinyin:'hong shi zhi yan', cat:'misc', icon:'眼',
    img:'icons/redstone-eye.png', grid:[["染料类","染料类","染料类"],["金粒","金粒","金粒"],["红石",null,null]], mats:["染料类","金粒","红石"], effect:'侦测与红石装置的核心元件，一次合成出 2 个。', obtain:'合成：染料 + 金粒 3 + 红石 1（图案 ###/GGG/R  ，一次出 2 个）' },

  { id:'redstone-latch', cn:'红石锁存器', en:'Redstone Latch', alias:['锁存器'], pinyin:'hong shi suo cun qi', cat:'misc', icon:'锁',
    img:'icons/redstone-latch.png',
    grid:[['金粒','金粒','金粒'],[null,'红石',null],[null,null,null]], mats:['金粒 ×3','红石'],
    effect:'用红石信号断开机械动力的传动部件。',
    obtain:'合成：金粒×3 + 红石×1（图案 "ggg/ r "，g=金粒、r=红石，由 class 文件反编译得到）' },

  { id:'rope', cn:'绳子', en:'Rope', alias:['绳索'], pinyin:'sheng zi', cat:'misc', icon:'绳',
    img:'icons/rope.png',
    grid:[['大麻纤维','大麻纤维',null],['大麻纤维','大麻纤维',null],['大麻纤维','大麻纤维',null]], mats:['大麻纤维'], effect:'滑轮、锚、平台与陷阱的承重材料。', proc:['织机：亚麻纤维 → 绳子 ×1'], obtain:'合成：大麻纤维 6（反编译所得，图案 2×3）' },

  { id:'runed-skull', cn:'符文头颅', en:'Runed Skull', alias:['刻文头骨'], pinyin:'fu wen tou lu', cat:'misc', icon:'颅',
    img:'icons/runed-skull.png',
    grid:null, effect:'仪式与高级附魔的关键道具。', obtain:'与牧师交易获得。' },

  { id:'saw', cn:'锯', en:'Saw', alias:['手锯'], pinyin:'ju', cat:'tool', icon:'锯',
    img:'icons/saw.png',
    grid:[['铁锭','铁锭','铁锭'],['齿轮','传动皮带','齿轮'],['高效木侧板','齿轮','高效木侧板']], mats:['铁锭','齿轮','传动皮带','高效木侧板'], effect:'把原木切成木板，是木工线的核心工具。', obtain:'合成：铁锭×3 + 齿轮×3 + 传动皮带×1 + 高效木侧板×2（由 class 文件反编译得到，排布见网格）' },

  { id:'saw-dust', cn:'锯末', en:'Saw Dust', alias:['木屑'], pinyin:'ju mo', cat:'misc', icon:'末',
    noGrid:true,
    img:'icons/saw-dust.png',
    grid:null, effect:'燃料与填充材料，也能压制成块。', proc:['漏斗：灵魂之尘 → 锯末 ×1'], obtain:'用锯切割木板时的副产物。' },

  { id:'scoured-leather', cn:'去毛皮革', en:'Scoured Leather', alias:['生皮'], pinyin:'qu mao pi ge', cat:'misc', icon:'皮',
    noGrid:true,
    img:'icons/scoured-leather.png',
    grid:null, effect:'鞣制前的半成品皮革。', proc:['磨石：皮革 → 去毛皮革 ×1'], obtain:'磨石：皮革 → 去毛皮革 ×1' },

  { id:'screw', cn:'螺杆', en:'Screw', alias:['螺丝'], pinyin:'luo gan', cat:'metal', icon:'螺',
    img:'icons/screw.png',
    grid:[['铁粒','铁锭',null],[null,'铁锭','铁粒'],['铁粒','铁锭',null]], mats:['铁锭 ×3','铁粒 ×3'],
    effect:'机械与装置的紧固件，也是部分合成材料。',
    obtain:'合成：铁锭×3 + 铁粒×3（图案 "n# / #n / n# "，#=铁锭、n=铁粒，由 class 文件反编译得到）' },

  { id:'screw-pump', cn:'螺旋泵', en:'Screw Pump', alias:['水泵'], pinyin:'luo xuan beng', cat:'metal', icon:'泵',
    img:'icons/screw-pump.png',
    grid:[['胶','格栅板','胶'],['木侧板','螺杆','木侧板'],['木侧板','齿轮','木侧板']], mats:['胶','格栅板','木侧板','螺杆','齿轮'], effect:'把水与物品向上输送，可做循环水路。', obtain:'合成：胶×2 + gratePane×1 + 木侧板×4 + screw×1 + 齿轮×1（由 class 文件反编译得到，排布见网格）' },

  { id:'shovel-refined', cn:'精炼铲', en:'Refined Shovel', alias:['灵魂钢铲','钢铲','钢锹'], pinyin:'jing lian chan', cat:'tool', icon:'铲',
    img:'icons/shovel-refined.png',
    grid:null, noGrid:true, proc:['灵魂熔炉：灵魂钢锭 + 优质工具柄 → 精炼铲 ×1', '坩埚（猛火）：精炼铲 → 灵魂钢锭 ×1'], effect:'挖掘效率最高的铲子；代码字段名 steelShovel（官方名 Refined Shovel，不是另一件「钢铲」）。', obtain:'灵魂熔炉锻造（灵魂钢锭 + 优质工具柄 → 精炼铲 ×1，见上方「加工配方」）；坩埚（猛火）可回收灵魂钢锭 ×1。' },

  { id:'sinew', cn:'筋腱', en:'Sinew', alias:['动物筋'], pinyin:'jin jian', cat:'misc', icon:'筋',
    noGrid:true,
    img:'icons/sinew.png',
    grid:null, effect:'绑扎材料，用于绳子、弓与骨棒槌。', obtain:'生物产出（具体来源待核）' },

  { id:'skeleton-skull', cn:'骷髅头', en:'Skeleton Skull', alias:['骷髅头颅'], pinyin:'ku lou tou', cat:'misc', icon:'颅',
    noGrid:true,
    img:'icons/skeleton-skull.png',
    grid:null, origin:'骷髅掉落（概率）', effect:'头颅装饰与部分仪式合成。', obtain:'击杀骷髅概率掉落。' },

  { id:'slats', cn:'板条', en:'Slats', alias:['木条'], pinyin:'ban tiao', cat:'block', icon:'条',
    img:'icons/slats.png',
    grid:[['木线脚','木线脚',null],['木线脚','木线脚',null],[null,null,null]], mats:['木线脚'], effect:'漏斗过滤与装饰用的板条。', obtain:'合成：木线脚 4（反编译所得，图案 ##/##）。' },

  { id:'soap', cn:'肥皂', en:'Soap', alias:['皂块'], pinyin:'fei zao', cat:'misc', icon:'皂',
    noGrid:true, img:'icons/soap.png',
    grid:null, effect:'清洁与部分合成用材料。', proc:['釜锅：草木灰 + 油脂 → 肥皂 ×1'], obtain:'釜锅：草木灰 + 油脂 熬制获得（见上方「加工配方」）。' },

  { id:'soulforge', cn:'灵魂锻造炉', en:'Soulforge', alias:['魂炉'], pinyin:'ling hun duan zao lu', cat:'block', icon:'炉',
    img:'icons/soulforge.png',
    shape:'shapeless',
    grid:null, mats:['沉睡灵魂锻造炉 ×1','下界之星 ×1','灵魂助熔剂 ×1'],
    effect:'无序合成：沉睡灵魂锻造炉 ×1 + 下界之星 ×1 + 灵魂助熔剂 ×1，材料摆放顺序无所谓。\n放置形态已核：单方块，非多方块——SoulforgeBlock 为带容器方块的普通单格方块，只按朝向旋转模型，代码中没有邻块或结构检测；右键打开锻造界面。',
    obtain:'由沉睡灵魂锻造炉激活，以图鉴手册为准。' },

  { id:'soulforged-steel', cn:'灵魂锻造钢', en:'Soulforged Steel Ingot', alias:['灵魂钢','SFS','灵魂钢锭'], pinyin:'ling hun duan zao gang', cat:'metal', icon:'钢',
    img:'icons/soulforged-steel.png',
    grid:[['钢粒','钢粒','钢粒'],['钢粒','钢粒','钢粒'],['钢粒','钢粒','钢粒']], mats:['钢粒'], effect:'在猛火上的坩埚中冶炼：铁锭配煤粉与灵魂助熔剂，灵魂陶瓮提供灵魂介质。模组最高级金属。', proc:['坩埚：战斧 → 灵魂锻造钢 ×5','坩埚：钢斧 → 灵魂锻造钢 ×2','坩埚：钢镐 → 灵魂锻造钢 ×3','坩埚：鹤嘴锄 → 灵魂锻造钢 ×4','坩埚：钢剑 → 灵魂锻造钢 ×3','坩埚：钢锄 → 灵魂锻造钢 ×2','坩埚：钢锹 → 灵魂锻造钢 ×1','坩埚：钢护甲板 → 灵魂锻造钢 ×1','另有 9 条同类加工'], obtain:'击败凋零后解锁灵魂锻造炉，用坩埚在猛火上冶炼。' },

  { id:'stake', cn:'木桩', en:'Stake', alias:['界桩'], pinyin:'mu zhuang', cat:'block', icon:'桩',
    img:'icons/stake.png',
    grid:[['线',null,null],['木线脚',null,null],[null,null,null]], mats:['线','木线脚'], effect:'围挡、支撑与绳索固定的基础构件。', obtain:'合成：线×1 + 木线脚×1（由 class 文件反编译得到，排布见网格）' },

  { id:'steel-armor-plate', cn:'钢护甲板', en:'Steel Armor Plate', alias:['护甲钢板'], pinyin:'gang hu jia ban', cat:'misc', icon:'板',
    img:'icons/steel-armor-plate.png',
    grid:[['皮革带','灵魂钢锭','皮革带'],[null,'衬垫',null],[null,null,null]], mats:['皮革带','灵魂钢锭','衬垫'], effect:'锻造板甲的半成品。', obtain:'合成：皮革带×2 + 灵魂钢锭×1 + 衬垫×1（由 class 文件反编译得到，排布见网格）' },

  { id:'steel-nugget', cn:'钢粒', en:'Soulforged Steel Nugget', alias:['灵魂锻造钢粒'], pinyin:'gang li', cat:'metal', icon:'粒',
    noGrid:true, img:'icons/steel-nugget.png',
    grid:null,
    effect:'灵魂锻造钢的零碎回收形态，可再炼回钢。',
    proc:['坩埚：宽头箭头头 → 钢粒 ×3', '坩埚：旧灵魂钢杆 → 钢粒 ×12', '另有 1 条同类加工（宽头箭头 → 钢粒 ×3）'],
    obtain:'坩埚（猛火）：钢制零件回收获得（见上方「加工配方」）。' },

  { id:'strap', cn:'皮革带', en:'Strap', alias:['绑带'], pinyin:'pi ge dai', cat:'misc', icon:'带',
    img:'icons/strap.png', noGrid:true,
    grid:null,
    effect:'本版本（CE 3.1.1）无合成配方，只作为锯、风箱的构件，以及板甲、鞍具、腰带、枪柄等的工作台材料出现；英文官方名为 Strap。',
    obtain:'构件：锯、风箱被破坏时掉落；铁匠（3 级）收购 8–12 件。' },

  { id:'straw', cn:'茅草', en:'Straw', alias:['稻草'], pinyin:'mao cao', cat:'farm', icon:'草',
    img:'icons/straw.png', grid:[["茅草",null,null],[null,null,null],[null,null,null]], mats:["茅草"], effect:'茅草捆的散料，一次由茅草捆拆出 9 份；可烧、可做过滤与堆肥。', obtain:'合成：茅草捆 1（图案 #  ，一次出 9 份）' },

  { id:'sword-refined', cn:'精炼剑', en:'Refined Sword', alias:['灵魂钢剑','钢剑'], pinyin:'jing lian jian', cat:'tool', icon:'剑',
    img:'icons/sword-refined.png',
    grid:null, noGrid:true, proc:['灵魂熔炉：灵魂钢锭 + 优质工具柄 → 精炼剑 ×1', '坩埚（猛火）：精炼剑 → 灵魂钢锭 ×3'], effect:'全模组伤害最高的单手剑；代码字段名 steelSword（官方名 Refined Sword，不是另一件「钢剑」）。', obtain:'灵魂熔炉锻造（灵魂钢锭 + 优质工具柄 → 精炼剑 ×1，见上方「加工配方」）；坩埚（猛火）可回收灵魂钢锭 ×3。' },

  { id:'tallow', cn:'油脂', en:'Tallow', alias:['动物脂'], pinyin:'you zhi', cat:'misc', icon:'脂',
    noGrid:true,
    img:'icons/tallow.png',
    grid:null, effect:'肥皂与炸药的材料。', proc:['釜锅：熟猪肉 → 油脂 ×1','釜锅：生猪肉 → 油脂 ×1','釜锅：熟狼排 → 油脂 ×1','釜锅：生狼排 → 油脂 ×1','釜锅：熟牛肉 → 油脂 ×1','釜锅：生牛肉 → 油脂 ×1','釜锅：熟羊肉 → 油脂 ×1','釜锅：生羊肉 → 油脂 ×1','另有 4 条同类加工'], obtain:'釜锅：生肉 → 油脂 ×1（12 种肉类皆可）' },

  { id:'tanned-leather', cn:'鞣制皮革', en:'Tanned Leather', alias:['熟皮'], pinyin:'rou zhi pi ge', cat:'misc', icon:'革',
    noGrid:true,
    img:'icons/tanned-leather.png',
    grid:null, effect:'风箱、护甲与容器的关键材料。', proc:['釜锅：粪便 + 去毛皮革 + 低单宁树皮 → 鞣制皮革 ×1','釜锅：粪便 + 去毛皮革 + 中单宁树皮 → 鞣制皮革 ×1','釜锅：粪便 + 去毛皮革 + 高单宁树皮 → 鞣制皮革 ×1','釜锅：粪便 + 去毛皮革 + 超高单宁树皮 → 鞣制皮革 ×1'], obtain:'釜锅：粪便 + 去毛皮革 + 树皮（低/中/高/极高单宁，任一）→ 鞣制皮革 ×1' },

  { id:'tanned-leather-boots', cn:'鞣制皮靴', en:'Tanned Leather Boots', alias:['熟皮靴'], pinyin:'rou zhi pi xue', cat:'tool', icon:'甲',
    img:'icons/tanned-leather-boots.png',
    grid:[['鞣制皮革类',null,'鞣制皮革类'],['鞣制皮革类',null,'鞣制皮革类'],[null,null,null]], mats:['鞣制皮革类'], effect:'轻便的早期脚部护甲，减伤低于板甲。', obtain:'合成：鞣制皮革类×4（由 class 文件反编译得到，排布见网格）' },

  { id:'tanned-leather-cap', cn:'鞣制皮帽', en:'Tanned Leather Cap', alias:['熟皮帽'], pinyin:'rou zhi pi mao', cat:'tool', icon:'甲',
    img:'icons/tanned-leather-cap.png',
    grid:[['鞣制皮革类','鞣制皮革类','鞣制皮革类'],['鞣制皮革类',null,'鞣制皮革类'],[null,null,null]], mats:['鞣制皮革类'], effect:'轻便的早期头部护甲，减伤低于板甲。', obtain:'合成：鞣制皮革类 5（反编译所得，图案 ###/# #）。' },

  { id:'tanned-leather-pants', cn:'鞣制皮裤', en:'Tanned Leather Pants', alias:['熟皮裤'], pinyin:'rou zhi pi ku', cat:'tool', icon:'甲',
    img:'icons/tanned-leather-pants.png',
    grid:[['鞣制皮革类','鞣制皮革类','鞣制皮革类'],['鞣制皮革类',null,'鞣制皮革类'],['鞣制皮革类',null,'鞣制皮革类']], mats:['鞣制皮革类'], effect:'轻便的早期腿部护甲，减伤低于板甲。', obtain:'合成：鞣制皮革类 7（反编译所得，图案 ###/# #/# #）。' },

  { id:'tanned-leather-tunic', cn:'鞣制皮衣', en:'Tanned Leather Tunic', alias:['熟皮衣'], pinyin:'rou zhi pi yi', cat:'tool', icon:'甲',
    img:'icons/tanned-leather-tunic.png',
    grid:[['鞣制皮革类',null,'鞣制皮革类'],['鞣制皮革类','鞣制皮革类','鞣制皮革类'],['鞣制皮革类','鞣制皮革类','鞣制皮革类']], mats:['鞣制皮革类'], effect:'轻便的早期胸部护甲，减伤低于板甲。', obtain:'合成：鞣制皮革类 8（反编译所得，图案 # #/###/###）。' },

  { id:'turntable', cn:'转盘', en:'Turntable', alias:['旋转台'], pinyin:'zhuan pan', cat:'metal', icon:'盘',
    img:'icons/turntable.png',
    grid:[['木侧板','木侧板','木侧板'],['石砖类','时钟','石砖类'],['石砖类','齿轮','石砖类']], mats:['木侧板','石砖类','时钟','齿轮'], effect:'把旋转动力转为间歇旋转，驱动窑与自动装置。', obtain:'合成：木侧板×3 + 石砖类×4 + clock×1 + 齿轮×1（由 class 文件反编译得到，排布见网格）' },

  { id:'unfired-pottery', cn:'未烧陶器', en:'Unfired Pottery', alias:['陶坯'], pinyin:'wei shao tao qi', cat:'pottery', icon:'坯',
    noGrid:true, img:'icons/unfired-pottery.png',
    grid:null, effect:'入窑前的陶坯，不能直接用。', proc:['旋转台：黏土球 → 未烧陶器'], obtain:'黏土球在旋转台塑形（TurntableRecipeList#6；#1–#5 再按 potteryEffect 逐档转）' },

  { id:'urn', cn:'陶瓮', en:'Urn', alias:['陶罐'], pinyin:'tao weng', cat:'pottery', icon:'瓮',
    noGrid:true, img:'icons/urn.png',
    grid:null, effect:'储存液体与散装材料的大容器。', proc:['窑：未烧陶器 → 陶瓮 ×3'], obtain:'陶坯入窑烧制。' },

  { id:'vase', cn:'花瓶', en:'Vase', alias:['陶瓶'], pinyin:'hua ping', cat:'pottery', icon:'瓶',
    noGrid:true, img:'icons/vase.png',
    grid:null, effect:'纯装饰陶器，可染色。', proc:['窑：未烧陶器 → 花瓶 ×2'], obtain:'陶坯入窑烧制。' },

  { id:'venom-sack', cn:'毒囊', en:'Venom Sac', alias:['毒腺'], pinyin:'du nang', cat:'misc', icon:'囊',
    noGrid:true,
    grid:null, origin:'毒系生物掉落', effect:'炼药用的生物材料。', obtain:'击杀毒系生物掉落。' },

  { id:'vessel-of-the-dragon', cn:'龙之容器', en:'Vessel of the Dragon', alias:['龙瓶'], pinyin:'long zhi rong qi', cat:'misc', icon:'器',
    img:'icons/vessel-of-the-dragon.png',
    grid:null, effect:'单方块机械容器，非多方块：侧面可接入并传出机械动力，过载会损毁；具体内部功能尚未逐条核实。', obtain:'获取方式待核（交易说法未在代码中找到依据）。' },

  { id:'water-wheel', cn:'水车', en:'Water Wheel', alias:['水轮'], pinyin:'shui che', cat:'metal', icon:'水',
    img:'icons/water-wheel.png',
    grid:[['木叶片','木叶片','木叶片'],['木叶片',null,'木叶片'],['木叶片','木叶片','木叶片']], mats:['木叶片'], effect:'水流驱动的持续动力，昼夜不停。', obtain:'合成：木叶片×8（由 class 文件反编译得到，排布见网格）' },

  { id:'wet-brick', cn:'湿黏土砖', en:'Wet Brick', alias:['生砖'], pinyin:'shi nian tu zhuan', cat:'pottery', icon:'砖',
    img:'icons/wet-brick.png',
    grid:null, effect:'未定型的砖坯，晒干后才是红砖。', obtain:'黏土压制获得。' },

  { id:'white-cobble-stairs', cn:'白圆石楼梯', en:'White Cobble Stairs', alias:['白圆石阶梯'], pinyin:'bai yuan shi lou ti', cat:'block', icon:'梯',
    img:'icons/white-cobble-stairs.png',
    grid:[['白圆石',null,null],['白圆石','白圆石',null],['白圆石','白圆石','白圆石']], mats:['白圆石'], effect:'白圆石装饰楼梯。', obtain:'合成：白圆石×6（由 class 文件反编译得到，排布见网格）' },

  { id:'white-stone-stairs', cn:'白石楼梯', en:'White Stone Stairs', alias:['白石阶梯'], pinyin:'bai shi lou ti', cat:'block', icon:'梯',
    img:'icons/white-stone-stairs.png',
    grid:[['白石',null,null],['白石','白石',null],['白石','白石','白石']], mats:['白石'], effect:'白石装饰楼梯。', obtain:'合成：白石×6（由 class 文件反编译得到，排布见网格）；另有 1 条：白圆石×6 → 同款台阶的圆石外观（meta 8）' },

  { id:'wicker-pane', cn:'柳条板', en:'Wicker Pane', alias:['柳条窗板'], pinyin:'liu tiao ban', cat:'block', icon:'板',
    noGrid:true, img:'icons/wicker-pane.png', imgApprox:true, inherit:'wicker', imgApproxFrom:'柳条',
    grid:null, effect:'透气的编织板，做隔断与围栏。', proc:['锯：柳条台阶 → 柳条板 ×2','织机：甘蔗 → 柳条板 ×1','织机：木棍 + 柳条板 → 柳条板 ×2','织机：木棍 + 甘蔗 → 柳条板 ×2'], obtain:'织机编织或锯切获得（三种织法与一次锯切见上方「加工配方」）。' },

  { id:'wicker-slab', cn:'柳条台阶', en:'Wicker Slab', alias:['柳条半砖'], pinyin:'liu tiao tai jie', cat:'block', icon:'阶',
    img:'icons/wicker-slab.png', imgApprox:true, inherit:'wicker', imgApproxFrom:'柳条',
    grid:[['柳条块','柳条块',null],[null,null,null],[null,null,null]], mats:['柳条块'], effect:'装饰用台阶，用于棚屋与仓库。', proc:['锯：柳条块 → 柳条台阶 ×2','锯：旧柳条块 → 柳条台阶 ×2'], obtain:'合成：柳条板×2（由 class 文件反编译得到，排布见网格）' },

  { id:'wind-mill', cn:'风车', en:'Windmill', alias:['风力机'], pinyin:'feng che', cat:'metal', icon:'风',
    img:'icons/wind-mill.png',
    grid:[[null,'风车叶片',null],['风车叶片',null,'风车叶片'],[null,'风车叶片',null]], mats:['风车叶片'], effect:'稳定动力源，可同时带动多台机械。', obtain:'合成：风车叶片×4（由 class 文件反编译得到，排布见网格）' },

  { id:'windmill-blade', cn:'风车叶片', en:'Sail', alias:['风车帆','船帆','帆','风车翼'], pinyin:'feng che ye pian', cat:'block',
    img:'icons/sail.png',
    grid:[['布料','布料','布料'],['布料','布料','布料'],['高效木线脚','高效木线脚','高效木线脚']], mats:['布料','高效木线脚'],
    effect:'风车的叶片部件（BTWItems.windMillBlade，官方 lang 登记名为 Sail：item.fcItemBladeWindMill；贴图 btw/items/sail.png）。拆解：1 个风车可拆出 3 片、1 个立式风车可拆出 7 片（无序合成，不占网格）。',
    obtain:'合成：布料 6 + 高效木线脚 3（反编译所得，图案 ###/###/XXX）；另可由风车/立式风车拆解获得。' },

  { id:'wolfchop', cn:'狼排', en:'Raw Wolfchop', alias:['狼肉排'], pinyin:'lang pai', cat:'farm', icon:'排',
    noGrid:true, img:'icons/wolfchop.png',
    grid:null, effect:'模组特色肉类。', proc:['磨石：伴侣方块 → 狼排 ×1'], obtain:'磨石研磨伴侣方块获得（见上方「加工配方」）。' },

  { id:'wood-blade', cn:'木叶片', en:'Wood Blade', alias:['木桨叶'], pinyin:'mu ye pian', cat:'misc', icon:'叶',
    img:'icons/wood-blade.png',
    grid:[['木侧板',null,null],['木侧板','胶','木侧板'],['木侧板',null,null]], mats:['木侧板','胶'], effect:'水车等木制叶轮的材料。', obtain:'合成：木侧板 4 + 胶 1（反编译所得，图案 #  /#X#/#  ）。' },

  { id:'wool-slab', cn:'羊毛台阶', en:'Wool Slab', alias:['羊毛半砖'], pinyin:'yang mao tai jie', cat:'block', icon:'阶',
    img:'icons/wool-slab.png',
    grid:null, effect:'柔软的装饰台阶，消音效果好。', proc:['釜锅：染料类 + 羊毛台阶 → 换色 ×16（给已有台阶换色，不是产出途径）'], obtain:'釜锅染色获得（见上方「加工配方」）。' },

  { id:'zombie-head', cn:'僵尸头颅', en:'Zombie Head', alias:['僵尸头'], pinyin:'jiang shi tou lu', cat:'misc', icon:'头',
    noGrid:true,
    grid:null, origin:'僵尸掉落（概率）', effect:'头颅装饰与部分合成材料。', obtain:'击杀僵尸概率掉落。' },

];

window.BTW_ITEMS_ARCHIVE = [

  { id:'anvil', cn:'铁砧', en:'Anvil', alias:['砧台'], pinyin:'tie zhen', cat:'block', icon:'砧',
    imgNeed:'minecraft/blocks/anvil.png',
    grid:null, effect:'锻造与修理钢制装备的台面，需配合灵魂锻造钢。', obtain:'以图鉴手册为准。' },

  { id:'baited-fishing-rod', cn:'带饵钓竿', en:'Baited Fishing Rod', alias:['饵钓'], pinyin:'dai er diao gan', cat:'tool', icon:'竿',
    imgNeed:'btw/items/baited_fishing_rod_uncast.png',
    grid:null, effect:'挂上鱼饵的钓竿，上钩率高于普通钓竿。', obtain:'以图鉴手册为准。' },

  { id:'beacon', cn:'信标', en:'Beacon', alias:['灯塔'], pinyin:'xin biao', cat:'block', icon:'标',
    imgNeed:'minecraft/blocks/beacon.png',
    grid:null, effect:'提供区域增益，模组中作为高级方块存在。', obtain:'以图鉴手册为准。' },

  { id:'block-of-diamond-ingot', cn:'钻石锭块', en:'Block of Diamond Ingots', alias:['钻石块'], pinyin:'zuan shi ding kuai', cat:'block', icon:'钻',
    imgNeed:'minecraft/blocks/diamond_block.png',
    grid:null, effect:'钻石锭的储存与建筑形式，一块顶九锭。', obtain:'以图鉴手册为准。' },

  { id:'block-of-flesh', cn:'肉块', en:'Block of Flesh', alias:['血肉方块'], pinyin:'rou kuai', cat:'block', icon:'肉',
    imgNeed:'btw/blocks/rotten_flesh_block.png',
    grid:null, effect:'生物质方块，可用于陷阱与装饰。', obtain:'以图鉴手册为准。' },

  { id:'block-of-sfs', cn:'灵魂锻造钢块', en:'Block of Soulforged Steel', alias:['钢块'], pinyin:'ling hun duan zao gang kuai', cat:'block', icon:'钢',
    imgNeed:'btw/blocks/soulforged_steel_block.png',
    grid:null, effect:'储存与建筑两用，一块顶九锭。', obtain:'以图鉴手册为准。' },

  { id:'blood-wood', cn:'血木', en:'Blood Wood', alias:['血树原木'], pinyin:'xue mu', cat:'block', icon:'血',
    imgNeed:'btw/blocks/blood_wood_log.png',
    grid:null, effect:'血木系列方块的原木，用于整套血木建筑。', obtain:'以图鉴手册为准。' },

  { id:'blood-wood-sapling', cn:'血木树苗', en:'Blood Wood Sapling', alias:['血树苗'], pinyin:'xue mu shu miao', cat:'farm', icon:'苗',
    imgNeed:'btw/blocks/blood_wood_sapling.png',
    grid:null, effect:'种下后长成血木，是血木材料的来源。', obtain:'以图鉴手册为准。' },

  { id:'blood-wood-slab', cn:'血木台阶', en:'Blood Wood Slab', alias:['血木半砖'], pinyin:'xue mu tai jie', cat:'block', icon:'阶',
    inherit:'blood-wood-plank',
    grid:null, effect:'血木装饰台阶。', obtain:'以图鉴手册为准。' },

  { id:'bloody-chopping-block', cn:'血砧板', en:'Bloody Chopping Block', alias:['血迹砧板'], pinyin:'xue zhen ban', cat:'block', icon:'砧',
    imgNeed:'btw/blocks/dirty_chopping_block.png',
    grid:null, effect:'屠宰专用砧板，处理动物尸体。', obtain:'以图鉴手册为准。' },

  { id:'bow-drill', cn:'弓钻', en:'Bow Drill', alias:['钻弓'], pinyin:'gong zuan', cat:'tool', icon:'钻',
    imgNeed:'btw/items/bow_drill.png',
    grid:null, effect:'比火犁更省力的取火工具。', obtain:'以图鉴手册为准。' },

  { id:'broadhead-arrow', cn:'宽头箭', en:'Broadhead Arrow', alias:['阔头箭'], pinyin:'kuan tou jian', cat:'tool', icon:'箭',
    imgNeed:'btw/items/broadhead_arrow.png',
    grid:null, effect:'穿透力强于普通箭矢，对末影人更有效。', obtain:'以图鉴手册为准。' },

  { id:'campfire', cn:'篝火', en:'Campfire', alias:['营火'], pinyin:'gou huo', cat:'block', icon:'火',
    imgNeed:'btw/blocks/campfire.png',
    grid:null, effect:'照明、取暖与烹饪火源，不能当熔炉用。', obtain:'以图鉴手册为准。' },

  { id:'chopping-block', cn:'砧板', en:'Chopping Block', alias:['切菜台'], pinyin:'zhen ban', cat:'block', icon:'砧',
    imgNeed:'btw/blocks/chopping_block.png',
    grid:null, effect:'加工食物与材料的操作台。', obtain:'以图鉴手册为准。' },

  { id:'cooked-chicken', cn:'熟鸡肉', en:'Cooked Chicken', alias:['烤鸡'], pinyin:'shu ji rou', cat:'farm', icon:'肉',
    imgNeed:'minecraft/items/chicken_cooked.png',
    grid:null, effect:'烹饪后的鸡肉，回复更多饱食度。', obtain:'以图鉴手册为准。' },

  { id:'cooked-mutton', cn:'熟羊肉', en:'Cooked Mutton', alias:['烤羊排'], pinyin:'shu yang rou', cat:'farm', icon:'肉',
    imgNeed:'btw/items/cooked_mutton.png',
    grid:null, effect:'烹饪后的羊肉，回复更多饱食度。', obtain:'以图鉴手册为准。' },

  { id:'cooked-wolfchop', cn:'熟狼排', en:'Cooked Wolfchop', alias:['烤狼肉'], pinyin:'shu lang pai', cat:'farm', icon:'排',
    imgNeed:'btw/items/cooked_wolfchop.png',
    grid:null, effect:'烹饪后的狼排，模组特色料理。', obtain:'以图鉴手册为准。' },

  { id:'corpse-eye', cn:'尸眼', en:'Corpse Eye', alias:['亡者之眼'], pinyin:'shi yan', cat:'misc', icon:'眼',
    imgNeed:'btw/items/corpse_eye.png',
    grid:null, effect:'特殊生物掉落材料，用于高级合成。', obtain:'以图鉴手册为准。' },

  { id:'crude-torch', cn:'粗糙火把', en:'Crude Torch', alias:['土火把'], pinyin:'cu cao huo ba', cat:'block', icon:'炬',
    noIcon:true,
    grid:null, effect:'照明范围小，但材料门槛极低。', obtain:'以图鉴手册为准。' },

  { id:'ham-and-eggs', cn:'火腿蛋', en:'Ham and Eggs', alias:['火腿煎蛋'], pinyin:'huo tui dan', cat:'farm', icon:'蛋',
    imgNeed:'btw/items/ham_and_eggs.png',
    grid:null, effect:'高饱食度料理。', obtain:'以图鉴手册为准。' },

  { id:'ice', cn:'冰', en:'Ice', alias:['冰块'], pinyin:'bing', cat:'misc', icon:'冰',
    imgNeed:'minecraft/blocks/ice.png',
    grid:null, effect:'降温与保鲜用的方块材料。', obtain:'以图鉴手册为准。' },

  { id:'kebab', cn:'烤肉串', en:'Raw Kebab', alias:['烤串'], pinyin:'kao rou chuan', cat:'farm', icon:'串',
    imgNeed:'btw/items/raw_kebab.png',
    grid:null, effect:'生熟两版的便携料理。', obtain:'以图鉴手册为准。' },

  { id:'kiln', cn:'窑', en:'Kiln', alias:['砖窑'], pinyin:'yao', cat:'pottery', icon:'窑',
    noIcon:true,
    grid:null, effect:'烧陶、烧砖、干馏焦煤的多用途炉体。', obtain:'以图鉴手册为准。' },

  { id:'light-block', cn:'光源方块', en:'Light Block', alias:['隐形光源'], pinyin:'guang yuan fang kuai', cat:'block', icon:'光',
    imgNeed:'btw/blocks/light_block.png',
    grid:null, effect:'透明光源，适合做无痕照明。', obtain:'以图鉴手册为准。' },

  { id:'liver-of-the-beast', cn:'野兽肝脏', en:'Liver of the Beast', alias:['兽肝'], pinyin:'ye shou gan zang', cat:'misc', icon:'肝',
    imgNeed:'btw/items/raw_beast_liver.png',
    grid:null, effect:'高级料理与仪式的材料。', obtain:'以图鉴手册为准。' },

  { id:'mushroom-omelet', cn:'蘑菇煎蛋', en:'Raw Mushroom Omelet', alias:['蘑菇蛋饼'], pinyin:'mo gu jian dan', cat:'farm', icon:'蛋',
    imgNeed:'btw/items/raw_mushroom_omelet.png',
    grid:null, effect:'回复饱食度较高的料理。', obtain:'以图鉴手册为准。' },

  { id:'mystery-meat', cn:'神秘肉', en:'Raw Mystery Meat', alias:['神秘肉块'], pinyin:'shen mi rou', cat:'farm', icon:'肉',
    imgNeed:'btw/items/raw_mystery_meat.png',
    grid:null, effect:'来源不明的肉，可烹饪但风险自负。', obtain:'以图鉴手册为准。' },

  { id:'nether-brick-corner', cn:'地狱砖转角', en:'Nether Brick Corner', alias:['地狱砖拐角'], pinyin:'di yu zhuan zhuan jiao', cat:'block', icon:'角',
    imgNeed:'btw/items/nether_brick.png',
    grid:null, effect:'地狱砖建筑转角收口。', obtain:'以图鉴手册为准。' },

  { id:'nether-brick-fence', cn:'地狱砖栅栏', en:'Nether Brick Fence', alias:['地狱砖围栏'], pinyin:'di yu zhuan zha lan', cat:'block', icon:'栏',
    imgNeed:'btw/items/nether_brick.png',
    grid:null, effect:'耐火的围挡与装饰。', obtain:'以图鉴手册为准。' },

  { id:'nether-brick-moulding', cn:'地狱砖线脚', en:'Nether Brick Moulding', alias:['地狱砖线脚块'], pinyin:'di yu zhuan xian jiao', cat:'block', icon:'线',
    imgNeed:'btw/items/nether_brick.png',
    grid:null, effect:'地狱砖建筑收边装饰件。', obtain:'以图鉴手册为准。' },

  { id:'nether-brick-siding', cn:'地狱砖壁板', en:'Nether Brick Siding', alias:['地狱砖墙板'], pinyin:'di yu zhuan bi ban', cat:'block', icon:'壁',
    imgNeed:'btw/items/nether_brick.png',
    grid:null, effect:'地狱砖墙面装饰板材。', obtain:'以图鉴手册为准。' },

  { id:'nether-brick-slab', cn:'地狱砖台阶', en:'Nether Brick Slab', alias:['地狱砖半砖'], pinyin:'di yu zhuan tai jie', cat:'block', icon:'阶',
    imgNeed:'btw/items/nether_brick.png',
    grid:null, effect:'地狱砖装饰台阶。', obtain:'以图鉴手册为准。' },

  { id:'nether-brick-stairs', cn:'地狱砖楼梯', en:'Nether Brick Stairs', alias:['地狱砖阶梯'], pinyin:'di yu zhuan lou ti', cat:'block', icon:'梯',
    imgNeed:'btw/items/nether_brick.png',
    grid:null, effect:'地狱砖装饰楼梯。', obtain:'以图鉴手册为准。' },

  { id:'packed-earth-slab', cn:'压实土台阶', en:'Packed Earth Slab', alias:['压实土半砖'], pinyin:'ya shi tu tai jie', cat:'block', icon:'阶',
    imgNeed:'btw/blocks/packed_earth.png',
    grid:null, effect:'压实土装饰台阶。', obtain:'以图鉴手册为准。' },

  { id:'planter-dirt', cn:'种植土', en:'Planter With Soil', alias:['箱土'], pinyin:'zhong zhi tu', cat:'farm', icon:'土',
    imgNeed:'btw/blocks/planter_inside.png',
    grid:null, effect:'种植箱专用的填充土。', obtain:'以图鉴手册为准。' },

  { id:'pork-dinner', cn:'猪肉大餐', en:'Pork Dinner', alias:['猪肉晚宴'], pinyin:'zhu rou da can', cat:'farm', icon:'餐',
    imgNeed:'btw/items/pork_dinner.png',
    grid:null, effect:'高饱食度的高级料理。', obtain:'以图鉴手册为准。' },

  { id:'porkchop-cooked', cn:'熟猪排', en:'Cooked Porkchop', alias:['烤猪排'], pinyin:'shu zhu pai', cat:'farm', icon:'排',
    imgNeed:'minecraft/items/porkchop_cooked.png',
    grid:null, effect:'烹饪后的猪排，回复更多饱食度。', obtain:'以图鉴手册为准。' },

  { id:'raw-cheval', cn:'生马肉', en:'Raw Cheval', alias:['马肉'], pinyin:'sheng ma rou', cat:'farm', icon:'肉',
    imgNeed:'btw/items/raw_cheval.png',
    grid:null, effect:'模组新增的生肉种类。', obtain:'以图鉴手册为准。' },

  { id:'raw-egg', cn:'生蛋', en:'Raw Egg', alias:['生鸡蛋'], pinyin:'sheng dan', cat:'farm', icon:'蛋',
    imgNeed:'btw/items/raw_egg.png',
    grid:null, effect:'烹饪与合成材料。', obtain:'以图鉴手册为准。' },

  { id:'rotted-arrow', cn:'腐化箭', en:'Rotted Arrow', alias:['腐烂箭'], pinyin:'fu hua jian', cat:'tool', icon:'箭',
    imgNeed:'btw/items/rotten_arrow.png',
    grid:null, effect:'命中后附加腐烂效果的箭矢。', obtain:'以图鉴手册为准。' },

  { id:'scrambled-egg', cn:'炒蛋', en:'Raw Scrambled Egg', alias:['炒鸡蛋'], pinyin:'chao dan', cat:'farm', icon:'蛋',
    imgNeed:'btw/items/raw_scrambled_eggs.png',
    grid:null, effect:'简单料理，回复少量饱食度。', obtain:'以图鉴手册为准。' },

  { id:'shaft', cn:'木棍', en:'Shaft', alias:['手柄','木杆'], pinyin:'mu gun', cat:'misc', icon:'棍',
    imgNeed:'btw/items/haft.png',
    grid:null, effect:'所有工具、传动件的基础手柄。', obtain:'用凿子处理原木获得，以图鉴手册为准。' },

  { id:'sharp-stone', cn:'尖锐石头', en:'Sharp Stone', alias:['尖石'], pinyin:'jian rui shi tou', cat:'tool', icon:'尖',
    imgNeed:'btw/items/sharp_stone.png',
    grid:null, effect:'最原始的切割工具，也是凿子的刃部。', obtain:'由松散石头加工，以图鉴手册为准。' },

  { id:'soul-dust', cn:'灵魂之尘', en:'Soul Dust', alias:['魂尘','灵魂尘'], pinyin:'ling hun zhi chen', cat:'misc', icon:'尘',
    imgNeed:'btw/items/soul_dust.png',
    grid:null, effect:'灵魂锻造流程的中间材料。', obtain:'锯末与灵魂陶瓮相关流程，以图鉴手册为准。' },

  { id:'soul-flux', cn:'灵魂助熔剂', en:'Soul Flux', alias:['灵魂熔剂','灵魂通量'], pinyin:'ling hun zhu rong ji', cat:'metal', icon:'熔',
    imgNeed:'btw/items/soul_flux.png',
    grid:null, effect:'灵魂锻造钢冶炼必需的助熔剂。', obtain:'由灵魂陶瓮相关流程产出，以图鉴手册为准。' },

  { id:'soul-urn', cn:'灵魂陶瓮', en:'Soul Urn', alias:['灵魂瓮'], pinyin:'ling hun tao weng', cat:'pottery', icon:'魂',
    imgNeed:'btw/items/soul_urn.png',
    grid:null, effect:'灵魂助熔剂与灵魂锻造流程的核心容器。', obtain:'陶瓮加工而成，以图鉴手册为准。' },

  { id:'spider-eye-slab', cn:'蜘蛛眼台阶', en:'Spider Eye Slab', alias:['蛛眼半砖'], pinyin:'zhi zhu yan tai jie', cat:'block', icon:'阶',
    noIcon:true,
    grid:null, effect:'特殊的生物风格装饰台阶。', obtain:'以图鉴手册为准。' },

  { id:'steak-and-potatoes', cn:'牛排配土豆', en:'Steak and Potatoes', alias:['牛排土豆'], pinyin:'niu pai pei tu dou', cat:'farm', icon:'餐',
    imgNeed:'btw/items/steak_and_potatoes.png',
    grid:null, effect:'饱食度与回复量都很高的正餐。', obtain:'以图鉴手册为准。' },

  { id:'white-cobble', cn:'白圆石', en:'White Cobble', alias:['白卵石'], pinyin:'bai yuan shi', cat:'block', icon:'石',
    imgNeed:'btw/blocks/white_cobble.png',
    grid:null, effect:'白石系列的圆石建材。', obtain:'以图鉴手册为准。' },

  { id:'white-cobble-slab', cn:'白圆石台阶', en:'White Cobble Slab', alias:['白圆石半砖'], pinyin:'bai yuan shi tai jie', cat:'block', icon:'阶',
    imgNeed:'btw/blocks/white_cobble.png',
    grid:null, effect:'白圆石装饰台阶。', obtain:'以图鉴手册为准。' },

  { id:'white-stone', cn:'白石', en:'White Stone', alias:['白岩'], pinyin:'bai shi', cat:'block', icon:'石',
    imgNeed:'btw/blocks/white_stone.png',
    grid:null, effect:'白石系列的基础方块。', obtain:'以图鉴手册为准。' },

  { id:'white-stone-corner', cn:'白石转角', en:'White Stone Corner', alias:['白石拐角'], pinyin:'bai shi zhuan jiao', cat:'block', icon:'角',
    imgNeed:'btw/blocks/white_stone.png',
    grid:null, effect:'白石建筑转角收口。', obtain:'以图鉴手册为准。' },

  { id:'white-stone-moulding', cn:'白石线脚', en:'White Stone Moulding', alias:['白石线脚块'], pinyin:'bai shi xian jiao', cat:'block', icon:'线',
    imgNeed:'btw/blocks/white_stone.png',
    grid:null, effect:'白石收边装饰件。', obtain:'以图鉴手册为准。' },

  { id:'white-stone-siding', cn:'白石壁板', en:'White Stone Siding', alias:['白石墙板'], pinyin:'bai shi bi ban', cat:'block', icon:'壁',
    imgNeed:'btw/blocks/white_stone.png',
    grid:null, effect:'白石墙面装饰板材。', obtain:'以图鉴手册为准。' },

  { id:'white-stone-slab', cn:'白石台阶', en:'White Stone Slab', alias:['白石半砖'], pinyin:'bai shi tai jie', cat:'block', icon:'阶',
    imgNeed:'btw/blocks/white_stone.png',
    grid:null, effect:'白石装饰台阶。', obtain:'以图鉴手册为准。' },

  { id:'wicker', cn:'柳条', en:'Wicker', alias:['编织条'], pinyin:'liu tiao', cat:'misc', icon:'柳',
    imgNeed:'btw/items/wicker.png',
    grid:null, effect:'编织容器与柳条方块的基础材料。', obtain:'以图鉴手册为准。' },

  { id:'wicker-block', cn:'柳条块', en:'Block of Wicker', alias:['柳条方块'], pinyin:'liu tiao kuai', cat:'block', icon:'柳',
    inherit:'wicker',
    grid:null, effect:'轻质装饰方块，也可作为编织基底。', obtain:'以图鉴手册为准。' },

];
