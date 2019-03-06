---
title: nvmでlinuxに気楽にnodejsをインストールする
description: nvmを使ったnodejsのインストール方法を紹介します
date: 2019-2-3
category: linux
author: pineapplehunter
tag:
- nvm
- node
---
# nvmでlinuxに気楽にnodejsをインストールする
## nvmとは
nvmとは**Node Version Manager**の略で、複数のバージョンのNodeを簡単にインストールを行えるツールです。
下のリンクが公式Githubのレポジトリです
https://github.com/creationix/nvm

## nvmのインストール
まずはnvmをインストールします。
インストールはBashに一行書くだけでできます。
最新のインストールコマンドは https://github.com/creationix/nvm#install-script で確認できます
2019/2/3現在ではインストールコマンドは次のとおりです。
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```
自動的に`.bashrc`等に設定が書き込まれます。

コマンドが実行できたら、**一度ターミナルを閉じて開き直してください!**
開き直すことで設定が反映されます。
`nvm`と入力してEnterを押して次のような出力がでてくればインストール成功です。

```bash
$ nvm

Node Version Manager

Note: <version> refers to any version-like string nvm understands. This includes:
  - full or partial version numbers, starting with an optional "v" (0.10, v0.1.2, v1)
  - default (built-in) aliases: node, stable, unstable, iojs, system
  - custom aliases you define with `nvm alias foo`

...
...
...
```

## nodeのインストール
nvmがインストールできたのでNodeをインストールします。
最新のLTSバージョンをインストールするには次のコマンドです。
```bash
$ nvm install --lts
```
とても簡単ですね！
ちなみにバージョン8を指定すると
```bash
$ nvm install 8
```
これでインストールできます。

これで`node`と`npm`が使えるようになったはずです。
試すには次のようなコマンドが使えます。
```bash
$ node -v
v10.15.1
$ npm -v
6.4.1
```

## 最後に
nvmを使ったインストール方法では管理者権限が必要ないのでとりあえずNodeをインストールしたいときにとても気楽で良い方法だと思います。
ただ、逆に`sudo node`など管理者権限を使うことがデフォルトでは使えないので他に設定する必要があります。
