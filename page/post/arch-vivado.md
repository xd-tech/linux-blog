---
title: ArchでVivadoをインストールするときに気をつけること
description: インストール時に引っかかることがあるのでメモ
date: 2022-01-06
category: linux
author: pineapplehunter
tag:
  - Arch
---

# ArchでVivadoをインストールするときに気をつけること

Arch LinuxにXilinxのVivadoというFPGAの開発ツールをインストールする際にいくつか詰まってしまうポイントがあったのでまとめておきました。

## generating installed device listで止まる

インストールする際に**generating installed device list**というメッセージが出て止まってしまうことがあります。

この原因として`libncurses.so.5`が入っていないことがあります。Archではncursesは6なんですよね。なので古いバージョンをインストールする必要があります。他にもlibcryptの古いバージョンが必要です。

AURで次のパッケージが用意されているのでこちらをインストールしましょう。AURが使えるようにしておきましょう。(私はyayを使っています)

```sh
$ sudo pacman -S ncurses5-compat-libs libxcrypt-compat
```

これでうまくインストールができるはずです。

## インストーラがOSを32bitだと認識してしまってインストールできない。
これはVivadoの2015.4をインストールしようとしたときに発生しました。原因としては`uname`コマンドの出力が間違っていたことが原因とわかりました。

インストーラーの32bitを判定している部分のスクリプトを見ると、

```sh
...
if [ "$(uname -i)" != "x86_64" ]; then
...
```

と判定している行があります。こちらの`uname`の出力を確認してみると

```sh
$ uname -i
unknown
```

となっており、確かに`x86_64`にはなっていません。ここで`-i`を`-m`に変えて出力を確認してみると

```sh
$ uname -m
x86_64
```

正しく出力できていることがわかります。そこで、スクリプトの一部を修正し、`uname -i`を`uanme -m`に変更します。（私の見た限り一箇所です）

めんどくさい人は次のコマンドでも同じことができます。

```sh
$ cd **インストーラーがある場所**
$ sed 's/uname -i/uname -m/g' -i xsetup
```

~~最悪`uanme`のチェックを完全に回避するように`if true; then`に置き換えてしまうのも手ですねｗ~~

これでインストーラーが実行できるはずです。
