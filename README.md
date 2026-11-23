# 德爷生存 · BTW 中文图鉴站

Minecraft 1.6.4 整合包「德爷生存」（Better Than Wolves Community Edition **3.1.1**）的中文物品图鉴、合成速查与生存路线。

**线上站点**：https://yuyu123456608.github.io/btw-ce-cn-guide/
**非官方粉丝站**，与 Mojang 及 Better Than Wolves 作者无隶属关系。

## 数据口径

| 项 | 数量 |
|---|---|
| 核心条目总数 | 198 |
| 已在图鉴展示 | 141 |
| 配方已核实（3×3 合成） | 59 |
| 机器加工配方 | 120 行（63 条含加工方式） |
| 待补归档条目 | 57 |
| 物品图标 | 138 张（16×16） |

三条铁律：有图才写 `img`、无依据不编配方、无官方键不自拟名。未能在模组源码中定位产出方式的条目不进入展示。

## 数据来源与免责

配方、材料名与加工方式均来自对 `btwce-3.1.1.jar` 内 class 文件的反编译核对，以及 BTW 官方百科 wiki.btwce.com 的条目比对，不写猜测值。游戏素材版权归原模组及原作者所有，本仓库仅作中文资料整理。

## 字体

标题用 [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font) 12px 等宽体（作者 TakWolf 与贡献者），SIL Open Font License 1.1。站点只打包了本站用到的字符子集（`docs/fonts/pixel.woff2`，约 43 KB），许可原件随附在 `docs/fonts/OFL.txt`。

## 目录与更新流程

站点产物在 `docs/`（Pages 从该目录出站），制作现场（反编译输出、贴图池、脚本）在本地不入库。

```bash
node tools/build-dist.js --user=yuyu123456608 --repo=btw-ce-cn-guide   # 重建 docs/，写入绝对 og URL
node tools/verify.js                                                  # 31 条断言，不过不许提交
git add . && git commit -m "..." && git push
```

`--user` / `--repo` 每次都要带：少了 og:image 会退回相对路径，第 27 条会当场拦下。
