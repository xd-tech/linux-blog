---
title: 保存するごとにコマンドを実行させたい！
description: entrコマンドを紹介します
date: 2021-01-08
author: AstPy_ms
category: automation
tag:
  - bash
  - linux
  - ubuntu
---


## まだ毎回毎回保存した後にコマンド打ってるんですか？

煽ってすみません。つい1ヶ月くらい前まで私もそうだったので許してください。

今回はそんな無駄をなくす、`entr` コマンドを紹介します。


## entrコマンドとは

`entr` コマンドとは、**自分で指定したファイルが保存されるたびにコマンドを実行してくれるコマンドです。**

この記事では、最も実用的な使い方のみの紹介となります。

より詳しい情報は、[ぼっち勉強会様の記事](https://kannokanno.hatenablog.com/entry/2018/12/08/165702)で紹介されているので、こちらを参照いただければと思います。

使い方を見ていただいたほうが早いので、さっそく例を書いていきます。

```bash
# 文法
$ {echoやfindやlsなどのファイル名を表示するコマンド} | entr [実行したいコマンド]

# 例1 : 保存されるごとにpython3コマンドが走る
$ echo hello_world.py | entr python3 /_  # /_ にはechoしたファイル名が入ります

# 例2 : 複数のファイルを指定してentrに流す
$ ls *.py | entr python3 main.py  # main.pyで複数の別ファイルをimportしてる場合はこれが有効

# 例3 : 複数コマンドを走らせる場合 -> bashやzshなどのシェルスクリプトを利用
$ echo hello_world.c | entr sh -c "clang hello_world.c && ./a.out"
```

先日このサイトで紹介した、素晴らしいLaTeXコンパイラである `tectonic` を使うと

```bash
$ echo sample.tex | entr tectonic /_
```

と記述することで、texファイルが保存されるたびにコンパイルが走り、PDFを出力してくれます。素晴らしいですね。


## 最後に

少しずつ無駄を削ぎ落としていきましょう!!!