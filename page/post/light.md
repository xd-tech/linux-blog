---
title: i3wmで簡単にバックライトを調整する方法（xbacklightではない）
description: xbacklightがうまく行かないケースがいっぱいあるのでArch Wikiから見つけた`light`を紹介します
date: 2019-04-30
category: linux
author: pineapplehunter
tag:
- i3wm
- backlight
---
# i3wmで簡単にバックライトを調整する方法(xbacklightではない)
## TLDR
[light](https://github.com/haikarainen/light)ってやつで簡単にバックライトが調整できます。おすすめです。

## lightを見つけるに至った経緯
### i3wmをインストールした
[i3wm](https://i3wm.org/)をインストールしました。
インストールすると気づくと思うのですが、画面の輝度、音量調整などの`Fnキー`に割り当てられているショートカットが使えません。
音量の調整は割とすぐ見つけられるのですが、画面の輝度に関しては`xbacklight`についての記事が殆どで、どれも私の環境では動きませんでした。

### Arch Linuxをインストールした
[Arch Linux](https://archlinux.org)をインストールしました。そこで、[Arch Wiki](https://wiki.archlinux.jp/)に出会いました。情報が多くて素晴らしい！！！
そこでバックライトについて調べていたら[light](https://github.com/haikarainen/light)を見つけました。

## インストールのしかた
簡単です。

Ubuntu（Debian系）の方は[ここ](https://github.com/haikarainen/light/releases)から`.deb`ファイルをダウンロードして、
```bash
$ sudo dpkg -i light_1.2_amd64.deb # バージョンは適宜変えてください
```
これでOKです。

Arch系の方は`AUR`から`light`をインストールしてください。

## 使い方
輝度を10%上げるには
```bash
$ light -A 10
```
輝度を5%下げるには
```bash
$ light -U 5
```
輝度を30%にするには
```bash
$ light -S 30
```
簡単ですね！

## 最後に
i3wmのキーバインドに割り当てるのは`xbacklight`と同じなので各自調べてやってみてください。
これで、かなり快適なi3wmライフを満喫できそうです！
