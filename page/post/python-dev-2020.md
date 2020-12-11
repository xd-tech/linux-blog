---
title: Poetryを使った最強Python開発環境(2020)
description: Poetryを使ったPythonの環境構築について
date: 2020-06-05
category: programming
author: pineapplehunter
tag:
- python
- dev
---
# Poetryを使った最強Python開発環境(2020)

## Python開発環境について

まず、Pythonの開発環境がどうして必要になるのかについて話します。

### Pythonコマンドだけじゃだめなの？

まあ、いいんですけど。問題は`pip install`をし始めたときです。インストールされたパッケージがどこにインストールされる場所が問題です。

例えば`foo`というパッケージがあったとしましょう。

ある時`foo`を使ったプロジェクトを作り、またある程度時間が立ってから`foo`を使った別のプロジェクトに取り組んだとしましょう。
その時もしかすると次のようなことが起きるかもしれません。

```
最初にfooをインストールしたとき
fooのバージョン = 1.0

次にfooをインストールしたとき
fooのバージョン = 2.0
```

同じ場所にパッケージがインストールされてしまうので、このような状態になるともしかすると**以前動いていたプロジェクトが新しい`foo`と互換性がなくなり動かなくなる**かもしれません。Pythonのライブラリは開発が激しいものが多いのでこういうものがありえます。

### じゃあ仮想環境を作ればいいじゃない
このような問題に対応するためにpythonの仮想環境を作ります。
仮想環境とはプロジェクト毎にpipのインストール場所を変えて、パッケージのインストール場所を排他的にする技術です。

### じゃあやってみよう
ということで、「Python　仮想環境」とでも調べてみると山ほど文献が出てきます。古いのから新しいものまで多くの情報があります。

### どれをつかえばいい？
正直正解はありません。仮想環境を作る技術も日々進歩しています。なので、どれがいいと言うことはありませんが、今回は私のおすすめする`Poetry`を使ったセットアップについて紹介します。

## Poetryとは
PoetryとはPythonの仮想環境を簡単に作ったり、パッケージを管理したり、PyPIにパッケージを投稿したりできる便利ツールです。

ホームページ
https://python-poetry.org/
Github
https://github.com/python-poetry/poetry

### Poetryインストール
次のようにインストールします。

Mac、Linuxならターミナルで
```bash
$ curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
```

WindowsならPower Shellで
```bash
$ (Invoke-WebRequest -Uri https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py -UseBasicParsing).Content | python
```

とラーミナルに打ち込んで**再起動します**。
これだけです簡単ですね。

### 新しいプロジェクトを立ち上げる
プロジェクトを作りたい場所にターミナルで行き、
```bash
$ poetry new **プロジェクト名**
```
としてください。(`**プロジェクト名**`は自分のプロジェクト名と置き換える)

### プロジェクトの構成
`poetry new poetry-demo`と実行すると下のような入る構成が出てきます。
```
poetry-demo
├── pyproject.toml
├── README.rst
├── poetry_demo
│   └── __init__.py
└── tests
    ├── __init__.py
    └── test_poetry_demo.py
```
それぞれが何かを説明すると、こんな感じです。

* `pyproject.toml` -> プロジェクトの概要を書いてあるファイル。とても重要。基本的にPoetryが管理するのであまり触らなくて良い。ここに依存関係が書いてある。(`foo==1.0`とか)
* `README.rst` -> プロジェクトの概要を書くところ。他の人が見たときにどんなプロジェクトかわかるように書いておく。
* `poetry_demo` -> 実際のプロジェクトを書く場所。`main.py`とか`app.py`とか作って書き始めるといい。
* `tests` -> テストを書くディレクトリ。今回は触れないがプロジェクトが大きくなると便利になるだろうと思う。
* `__init__.py` -> このディレクトリにPythonファイルが含まれてますよと示すファイル。`poetry_demo`の中で新しくフォルダを作ってPythonファイルを入れる場合、このファイルを作る必要がある。からでも良い。詳しくは「\_\_init\_\_.py python」とかで検索すれば出てくると思う。

### 依存関係を追加する
```bash
$ poetry add **依存関係**
```
`foo`の場合
```bash
$ poetry add foo
```
バージョン固定する場合
```bash
$ poetry add foo==1.0
```

### Pythonファイルを実行する
普通なら
```bash
$ python script.py
```
のように実行できるが、`poetry`を使って下のように実行する。
```bash
$ poetry run python script.py
```
このように`poetry`経由でpythonを呼び出す必要がある。
他にも
```bash
$ poetry shell
$ python script.py
```
のようにすればいつも通りに実行ができる。

### 完成
このようにプロジェクトを作れます。

## 応用
### vscode対応
このままだとvscode対応が甘いので、次のようにconfigを変更しプロジェクトのディレクトリに`.venv`というディレクトリを作りそこで仮想環境を管理するようにします。
```bash
$ poetry config virtualenvs.in-project true
```
### pyenv
ここで更にPyenvを使うことで、多数のPythonバージョンに対応させることができます。古いバージョンのpythonを使わないといけない場合等に重宝します。

pyenvを予めインストールしておき、プロジェクトのディレクトリで
```bash
$ pyenv local 3.6.10
```
コマンドを打つとPoetryがPython3.6で動作します。
他のバージョンでも動きます。

## トラブルシューティング
### 依存関係
エラーが出た場合
```bash
$ poetry run pip install -U pip
```
とすると解決する場合があった。

他に見つかれば追記します。
