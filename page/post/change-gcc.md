---
title: Ubuntuでgccのバージョンを変更する
description: ubuntuでgccのバージョンを下げるにはどうすればいいか解説
date: 2021-03-05
author: pineapplehunter
category: compiler
tag:
  - ubuntu
---

# Ubuntuでgccのバージョンを変更する

## なぜgccのバージョンを変更するのか？
基本的にgccのバージョンは変更する必要はありません。しかし、特定のプログラムではgccのバージョンが新しすぎるとコンパイルできないという自体が発生します。
私はOpenposeのコンパイル中に「`gcc=<9`じゃないとコンパイルできません」と言われてしまいました。（正確にはnvccが要求していました）
そこで、gccのバージョンを変更する手順を調べてみたのですが意外と複雑になりやすかったのでまとめてみました。
今回困っていた環境が`Ubuntu`だったのでそれについてのみ記事にします。

## 古いgccのインストール(Ubuntu)
インストール自体は簡単にできます。どんなバージョンのgccがインストールできるか確認するには、

```bash
$ sudo apt search '^gcc-[0-9]+$'
ソート中... 完了
全文検索... 完了  
gcc-10/groovy,groovy,now 10.2.0-13ubuntu1 amd64 [インストール済み、自動]
  GNU C コンパイラ

gcc-7/groovy,groovy 7.5.0-6ubuntu3 amd64
  GNU C コンパイラ

gcc-8/groovy,groovy 8.4.0-4ubuntu1 amd64
  GNU C コンパイラ

gcc-9/groovy,groovy,now 9.3.0-18ubuntu1 amd64 [インストール済み、自動]
  GNU C コンパイラ
```

私の環境では上のように出力されていました。ここから必要なバージョンをインストールしましょう。
ここに必要なバージョンが書かれていない場合はソースからインストールしたりppaを探す必要があります。

## gccのバージョンを変更（一時的）
gccは複数バージョンインストールされているとき一番最新のものを指すようになっています。しかし、一時的に別のバージョンを使いたい場合は単に

```bash
$ gcc-9 hoge.c
```

のように`gcc-{version}`というコマンドから実行することができます。

## gccのバージョンを変更する(システムワイド)
一時的な方法が目的に合わない場合は`gcc`コマンドが古いバージョンを指すよう変更する必要があります。

そこで、このようなバージョンが複数あるプログラムをUbuntuではどのように管理しているのかを確認してみましょう。

### /usr/bin/gcc
これは実際のコンパイラのように見えますが、実は別のバージョンへのリンクになっています。
私の環境で確認してみると、

```bash
$ ls -l /usr/bin/gcc
lrwxrwxrwx 6 root 18  9月  2020 /usr/bin/gcc -> gcc-10
```

と、`gcc-10`にリンクされていました。

そこで、このリンクを別のバージョンに指定してあげることで解決することができます。

### リンクを貼り直すのは怖い
しかし、リンクを直接貼り直すのは少し危険があります。コマンドを打っているときにリンク元とリンク先を書き間違えると実行ファイルが上書きされてしまい、プログラムを再インストールする必要が出てきたり、最悪OSの再インストールになってしまいます。

### update-alternatives
そこで登場するのが`update-alternatives`コマンドです。Ubuntuでは安全にリングをバージョンごとや種類ごとに切り替えるためにこのような便利なプログラムを用意してくれています。

### 登録
こちらのプログラムを使ったリンクの貼り直しをしてみましょう。まずバージョンごとに実行ファイルを登録しておく必要があります。次のコマンドを見てみましょう。

```bash
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 10
update-alternatives: /usr/bin/gcc (gcc) を提供するために自動モードで /usr/bin/gcc-10 を使います
```

これは、`/usr/bin/gcc`のリンクの候補として`/usr/bin/gcc-10`を優先度`10`で登録する。また、`/usr/bin/gcc`の後の`gcc`はグループ名です。

このようにいくつかのバージョンを登録していきます。

```bash
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-9 9
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-8 8
```

今回は優先度をバージョンの数字に合わせていますが、実際にはどんな数字でも大丈夫です。

### 変更
登録ができたので変更してみましょう。グループ名で変更ができます。

```bash
$ sudo update-alternatives --config gcc
alternative gcc (/usr/bin/gcc を提供) には 3 個の選択肢があります。

  選択肢    パス           優先度  状態
------------------------------------------------------------
* 0            /usr/bin/gcc-10   10        自動モード
  1            /usr/bin/gcc-10   10        手動モード
  2            /usr/bin/gcc-8    8         手動モード
  3            /usr/bin/gcc-9    9         手動モード

現在の選択 [*] を保持するには <Enter>、さもなければ選択肢の番号のキーを押してください: 3
update-alternatives: /usr/bin/gcc (gcc) を提供するためにマニュアルモードで /usr/bin/gcc-9 を使います
```

このように選択することができます。
実際に確認してみると、

```bash
$ gcc --version
gcc (Ubuntu 9.3.0-18ubuntu1) 9.3.0
Copyright (C) 2019 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

と、このように正しく変更できていることが確認できると思います。

### もとに戻す
もとに戻したい場合は変更するときと同じ方法を使い、バージョンをもとに戻します。自動モードを選択すると、優先度が最も高いものが選ばれます。

```bash
gcc --version
gcc (Ubuntu 9.3.0-18ubuntu1) 9.3.0
Copyright (C) 2019 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

## g++
g++についても同じように変更することができます。

## 余談:/usr/bin/ccについて
Ubuntuには`/usr/bin/cc`というリンクがあります。これは`update-alternatives`で管理されているので中身を確認してみると、

```bash
$ sudo update-alternatives --display cc
cc - 自動モード
  最適なリンクのバージョンは '/usr/bin/gcc' です
  リンクは現在 /usr/bin/gcc を指しています
  リンク cc は /usr/bin/cc です
  スレーブ cc.1.gz は /usr/share/man/man1/cc.1.gz です
/usr/bin/clang - 優先度 10
/usr/bin/gcc - 優先度 20
  スレーブ cc.1.gz: /usr/share/man/man1/gcc.1.gz
```

このように、`gcc`と`clang`で選択できるようになっています。デフォルトではgccを使うようになっていますね。`c++`についても同様に、

```bash
$ sudo update-alternatives --display c++
c++ - 自動モード
  最適なリンクのバージョンは '/usr/bin/g++' です
  リンクは現在 /usr/bin/g++ を指しています
  リンク c++ は /usr/bin/c++ です
  スレーブ c++.1.gz は /usr/share/man/man1/c++.1.gz です
/usr/bin/clang++ - 優先度 10
/usr/bin/g++ - 優先度 20
  スレーブ c++.1.gz: /usr/share/man/man1/g++.1.gz
```

となっています。gnu Make等で使用されるデフォルトのコンパイラをシステムワイドに変更したい場合はこちらを変更してみても良いかもしれません。

## 愚痴
今回のgccのバージョン変更はnvidiaのコンパイラnvccに「gccのバージョンが新しすぎるからコンパイルしない！」と言われてしまったことで調べることになりました。できれば、「バージョンを下げなきゃコンパイルしない！」ではなく、「このバージョンでチェックはしてないから動作は保証しないけど、コンパイルはする。」というポリシーに変更していただけるとありがたいと思います。

## まとめ
この方法はgccのバージョンを変更するだけでなく複数バージョンをうまくシステムワイドに切り替えなければならないときに役立つと思います。（そんなことはそうそうないと思いますが）
