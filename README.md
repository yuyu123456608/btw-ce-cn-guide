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

仓库只存**源 + 校验器**，不存构建产物：`docs/` 由 Actions 构建后作为 Pages artifact 直接部署，改动一条数据只产生一行 diff。制作现场（反编译输出、贴图池、中间数据）在本地不入库；第 8 条核对 `imgNeed` 时读 `tools/texpool-index.json` 这份路径清单，而不是那 100 MB 贴图池。

```bash
node tools/build-dist.js --user=yuyu123456608 --repo=btw-ce-cn-guide   # 本地预览用：生成 docs/
node tools/verify.js                                                  # 33 条断言，不过不许提交
node tools/smoke.js                                                   # 可选：对线上逐个 GET 核对
git add . && git commit -m "..." && git push                          # push 后 CI 构建 → 校验 → 部署 → smoke
```

部署链路（`.github/workflows/deploy.yml`）：build → verify 33 条 → upload-pages-artifact(`docs`) → deploy-pages → 对线上 9 个 URL + 自定义 404 页跑 smoke（字节数读构建产出的 `tools/sizes.json`，并抓 index.html / items.js 做内容断言：og 绝对地址、countGuard 各数字与数组实长、404 文案总数）。**校验不过就不会部署**，坏版本进不了线上。

`--user` / `--repo` 每次都带：少了 og:image 会退回相对路径，第 27 条会当场拦下。
