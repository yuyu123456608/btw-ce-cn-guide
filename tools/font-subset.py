"""重新生成像素字体子集：读 tools/font-charset.txt，切 fonts/pixel.woff2。

字符清单由 verify 第 31 条守着（站点文本里出现清单外的字符就报错），
所以正常流程是：改完文案/加完条目 → verify 报「字体子集缺字」→ 跑本脚本 → verify 通过。

依赖：pip install fonttools brotli
源字体：Fusion Pixel 12px Monospaced（zh_hans），OFL-1.1，作者 TakWolf。
"""
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHARSET = ROOT / 'tools' / 'font-charset.txt'
SRC = ROOT / 'fontwork' / 'fusion-pixel-12px-monospaced-zh_hans.ttf.woff2'
OUT = ROOT / 'fonts' / 'pixel.woff2'


def main():
    if not SRC.exists():
        sys.exit(f'源字体缺失：{SRC}\n重新下载：https://github.com/TakWolf/fusion-pixel-font/releases')
    chars = CHARSET.read_text(encoding='utf-8')
    print(f'字符清单 {len(chars)} 个（汉字 {sum(1 for c in chars if "\u4e00" <= c <= "\u9fff")}）')
    subprocess.run([
        sys.executable, '-m', 'fontTools.subset', str(SRC),
        f'--text-file={CHARSET}',
        '--flavor=woff2', '--layout-features=kern,liga',
        '--no-hinting', '--desubroutinize',
        f'--output-file={OUT}',
    ], check=True)
    print(f'已生成 {OUT.relative_to(ROOT)}：{OUT.stat().st_size / 1024:.1f} KB')


if __name__ == '__main__':
    main()
