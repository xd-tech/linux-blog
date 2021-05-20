---
title: Juliaでopenblasが読み込めない！
description: Juliaのインストールで問題が起きることがあったのでまとめてみました。
date: 2021-05-20
category: programming
author: pineapplehunter
tag:
- julia
---

# Juliaでopenblasが読み込めない！

## Juliaでopenblasがないと言われる
Juliaをインストールしてライブラリをインストールしようとすると、「対応しているopenblasが入っていません！」みたいなエラーが出てくることがあります。

正確にはこんな感じ

```
ERROR: LoadError: LoadError: InitError: could not load library "libopenblas64_.so"
libopenblas64_.so: 共有オブジェクトファイルを開けません: そのようなファイルやディレクトリはありません
```

困ったことにこのエラーはlibopenblasがインストールされていても起きるようです。

## 環境
* Linux
* Julia 1.6.1

## 原因
Juliaは特定のバージョンのlibopenblasが必要らしく、OSの提供しているライブラリに対応できていないことがあるようです。
私は２度この現象に遭遇しましたが、どちらもOSにもとから用意されていたレポジトリからインストールした場合でした。

## 対処法
### Juliaを公式サイトからダウンロードする
公式が提供しているバイナリの中には、libopenblasを入れているようです。なので、こちらからインストールすればエラーは起きないと思います。

### Archでの対処法
AURから`julia-bin`をインストールする
Archを使っている人は全部Archのレポジトリか、AURからインストールしたいですよね。
Juliaのcommunityバージョンはopenblasの互換性がないようです。

### OpenSUSEでの対処法
Tumbleweedの環境で`zypper`を使い、juliaをインストールしました。
/usr/lib64/libopenblas.soが普通に使えるようですが、名前が違うのでうまく行ってないようです。

```bash
$ ln -s /usr/lib64/libopenblas.so /usr/lib64/libopenblas64_.so
```

## その他
他の環境ではとりあえず遭遇していないので、もしまた遭遇したら追記します。
