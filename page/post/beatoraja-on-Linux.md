---
title: beatorajaをUbuntuでも楽しもう
description: Ubuntu上でbeatorajaをプレイできるようになるまでの話をします
date: 2020-4-10
category: games
author: Astpy_ms
tag:
  - Ubuntu
  - games
  - BMS
---

## TL;DR

   1. Javaをインストール
   2. beatorajaをダウンロードして展開
   3. コマンドライン上で実行


## 動作確認環境

- Ubuntu 19.10


## Javaをインストール

beatorajaは`Java`で書かれているので、動作環境にもJavaをインストールする必要があります。

```
$ wget -q -O - https://download.bell-sw.com/pki/GPG-KEY-bellsoft | sudo apt-key add -
$ echo "deb [arch=amd64] https://apt.bell-sw.com/ stable main" | sudo tee /etc/apt/sources.list.d/bellsoft.list
$ sudo apt update
$ sudo apt install bellsoft-java11-runtime-full
```

これでOKです。


## beatorajaをダウンロード

[ここ](https://mocha-repository.info/download.php)から、最新版のbeatorajaを落としてきます。

編集時点では、`0.7.6`が最新です。

ダウンロードしたbeatorajaファイルを、自分の好きなところに解凍してください。


## 楽曲パックをダウンロード

**すでに楽曲データを持っている方は読み飛ばしてください。**

このままではBMSファイルがないので、有名な**GENOCIDE**という楽曲パックをダウンロードします。

[ここ](https://mocha-repository.info/download.php)から、**GENOSIDE -BMS StarterPackage 2018-** というものを落としてきます。

![](../.vuepress/public/imgs/beatoraja1.png)

画像の少し暗くなっているボタンをクリックすると、Google Driveに飛ばされるので、そこでダウンロードをしてください。


## 楽曲パックを展開

GENOCIDEは`rar`ファイルなので、そのままでは展開できません。

そこで**unrar**というものを使います。

```
$ sudo apt update
$ sudo apt install unrar
```

次にGENOCIDEを展開します。

```
$ cd [GENOCIDEファイルがある場所]
# だいたい cd ~/ダウンロード でできると思います。

$ unrar x [GENOCIDEファイル] 

# example
$ cd ~/ダウンロード
$ unrar x GENOSIDE2018_SP.rar
```