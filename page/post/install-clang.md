---
title: Clangのインストール
description: Clangのインストール方法をOS別にまとめました
date: 2019-12-12
category: other
author: pineapplehunter
tag:
- clang
- compiler
---

# Clangのインストール
## Clangとは
![LLVM Logo](../.vuepress/public/imgs/clang-install/DragonMedium.png)
Clangはコンパイラの一つでC,C++等の言語のコンパイルに使えます。Gccと比較されることが多いツールです。LLVMをバックエンドに動作しています。

## どうしてClangを使うか
私はGccと比べてClangのほうがより細かいワーニング、エラー文を表示してくれるので気にいっています。LLVMをバックエンドとして使用していることもあり、高度な最適化ができるのも魅力です。また、LLVM-IRを吐くことができるのでLLVMの勉強にも使えます。

## Mac
### 最新版をインストールする前に
MacにはXcodeをインストールすると、自動的にデフォルトのコンパイラとしてClangがインストールされます。しかし、そのClangはAppleが手を加えているある程度古いバージョンのClangのため、最新機能が使えません。最新版のほうがより多くのバグ検出ができたり、より最適化ができる場合があるので最新版を入れることをおすすめします。

### 最新版のインストール方法
まずXcodeをインストールしてください。

次にHomebrewをインストールします。Homebrewは公式ホームページにあるスクリプトを実行するだけです。
[Homebrew公式サイト](https://brew.sh/)

最後にbrewから最新の`llvm`をインストールします。`llvm`パッケージに`clang`がついてきます。
```bash
# アップデート
$ brew update
$ brew upgrade
# インストール
$ brew llvm --with-toolchain

# 動作テスト
$ clang
clang-9: error: no input files。
```

これでインストールは完了です。

## Windows
Windowsではコマンドライン上からインストールする簡単な方法はありませんがLLVMの公式サイトからビルド済みのバイナリをダウンロードできます。
LLVMのダウンロードページ [LLVMのダウンロードページ](http://releases.llvm.org/download.html)

ページの`Download LLVM *.*.*` -> `Pre-Built Binaries` -> `Windows (64-bit)`を選んでダウンロードします。

ダウンロードしてきたファイルを実行してインストールします。
**このとき`Install Options`で、`Add LLVM to the system PATH for current user`をチェックしてインストールしてください。**
自動的にパスを通してくれるので簡単に使えるようになります。

さて、これでWindows版のインストールは完了です。
適当なPowershellを開いて次のように試してみましょう。

```powershell
> clang
clang: error: no input files
```

## Linux
まあLinuxユーザーはインストール方法はわかるでしょう。
Ubuntuでの例だとこうです。

```bash
$ apt install clang
```
パッケージ名が若干違ったりインストーラが違ったりするとは思いますがそこは適宜調整してインストールしてください。

## 最後に
これで皆さんはClangを使う環境が整ったはずです。
Clangの恩恵を受けてC言語等での開発を進めていきましょう！
