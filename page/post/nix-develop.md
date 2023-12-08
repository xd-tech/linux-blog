---
title: Nixを使って共有できる開発環境を作ろう
description: flake.NixとdevShellをプロジェクトに追加し開発環境を楽に構築できるようにする
date: 2023-12-05
category: linux
author: pineapplehunter
tag:
  - linux
  - Nix
---

この記事は読者が、ある程度ターミナルに慣れていることを前提として書いています。

# TLDR

- Nix の`flake.nix`に開発環境を書く
- `Nix develop`を使用して開発環境を利用

# Nix って何？

ざっくり言ってしまうと再現性をかんたんに確保できるビルドシステムと、それを扱うための言語のことです。
Nix はできることがあまりにも多いので、この記事では Nix を使った開発環境の作り方についてのみ説明します。

ちなみに、Nix を利用した Linux ディストリビューションの NixOS もあり、便利です！

## Nix のインストール

2 つの方法を紹介しておきます。

### 方法1: 公式のインストーラ

[Nix公式のダウンロードページ]から自分の OS にあったインストーラを選択し、インストールします。
この方法を使用する場合いくつかの試験的機能のフラグを有効化する必要があります。Linux の場合`~/.config/nix/nix.conf`もしくは`/etc/nix/nix.conf`に次の内容を書き込んでください。

```shell
experimental-features = nix-command flakes
```

[Nix公式のダウンロードページ]: https://nixos.org/download#nix-install-linux

### 方法2: nix-installer(非公式)
[Zero to Nixの公式インストールページ]のインストーラを実行してインストールします。こちらは勝手に試験的機能を有効化してくれます。

[Zero to Nixの公式インストールページ]: https://zero-to-nix.com/start/install

### インストールの確認

ターミナルで次のように表示されていればインストールができています。
ターミナルを読み込み直す必要があるかもしれません。

```shell
$ nix --version
nix (Nix) 2.18.1
```

## Nix developを使ってみる

適当なディレクトリを作成し、その中に`flake.nix`という名前のファイルを作成します。

`flake.nix`
```nix
{
  outputs = { self, nixpkgs }: let
    pkgs = nixpkgs.legacyPackages.x86_64-linux;
  in {
    devShells.x86_64-linux.default = pkgs.mkShell {
      packages = with pkgs;[ hello ];
    };
  };
}
```

次のようにコマンドを打つと`hello`というコマンドがnix developを使用している最中に使用できることが解ると思います。こうすることで一時的にhelloの入ったシェルを作ることができます。

```shell
$ hello
hello: command not found

$ nix develop
warning: creating lock file '/home/shogo/tmp/flake-example/flake.lock'

[***]$ hello
世界よ、こんにちは！

[***]$ exit
exit

$ hello
hello: command not found
```

::: tip
シェルの表示に何も変化がないかもしれませんが、実際に`nix develop`が正しく機能している場合もあります。`hello`を実行して確認してみましょう。
:::

::: warning
上記のスクリプトはx86_64のLinuxで動かすことを前提としています。もし異なるプラットフォームで試したい場合は次の表を参考にして`flake.nix`の`x86_64-linux`を二箇所書き換えてください。

|プラットフォーム|nixでの表現|
|---:|:---|
|x86_64 Linux | `x86_64-linux` |
|arm 64bit Linux | `aarch64-linux` | 
| intel mac | `x86_64-darwin` |
| apple silicon mac | `aarch64-darwin` |
:::

## 使えるパッケージを追加してみる

では、`cowsay`を使えるパッケージに追加してみましょう。

```diff
{
  outputs = { self, nixpkgs }: let
    pkgs = nixpkgs.legacyPackages.x86_64-linux;
  in {
    devShells.x86_64-linux.default = pkgs.mkShell {
-     packages = with pkgs;[ hello ];
+     packages = with pkgs;[ hello cowsay ];
    };
  };
}
```

こうすることで`cowsay`が使えるようになっているはずです。

```shell
$ nix develop
$ cowsay Nix is COOL!
 ______________ 
< Nix is COOL! >
 -------------- 
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
$ exit
```

## ゆるふわ解説
nix developを使用することで任意のパッケージが用意されたシェルを作ることができます。
実行時には`/nix/store/...`に格納されている実行ファイルを`$PATH`に追加しているような仕様です。ライブラリ周りの事情もあるので実際にはより複雑ですが、おおよそその認識で大丈夫でしょう（ゆるふわ感）

::: tip
Nixで使えるパッケージ数は**80,000件を超えます**。自分の使いたいパッケージがあるか調べたいときは[search.nixos.org]を参考にしましょう！
:::

::: tip
nix developで追加されたバイナリの位置を確認してみると次のようになっています。

```shell
$ which hello
/nix/store/sbldylj3clbkc0aqvjjzfa6slp4zdvlj-hello-2.12.1/bin/hello
```

パスの途中のハッシュ値は依存関係によって決まるのでバージョンによって値が異なるかもしれません。
:::

[search.nixos.org]: https://search.nixos.org/packages

## 活用方法
友人に自分の作ったプログラムを動かしてほしいとき、またはサーバに新しいプログラムをアップロードするときに　**「俺の/サーバの 環境では動かないわ」**　といったことはありませんできたか？全人類の全マシンが自分と同じ環境であれば楽なんですけどね…

**そのような方に朗報**、ここがNix developの出番です！プロジェクトをコンパイルするためのパッケージや依存関係をすべて`flake.nix`に記述してプロジェクトと一緒に渡してしまいましょう！こうすれば、相手は`nix develop`を実行するだけであなたと同じ環境を瞬時に作成することができます！これで自分の~~バグたっぷりの~~プログラムがどこでも再現できるはずです！

## まとめ

この記事では`nix develop`を使って環境構築する方法について軽く紹介しました。

Nixの機能はもちろんこれだけではありません！一つの`flake.nix`に複数の環境を作れたり、自分のパッケージをまとめたり、OSごと作成してしまうこともできます。とても奥が深い沼なので気をつけながら楽しんでください！

## トラブルシューティング
### 1. ` ‘error: experimental Nix feature ‘nix-command’ is disabled; use ‘–extra-experimental-features nix-command’ to override’`

Nixの試験的な機能が有効化されていません。

Linux の場合`~/.config/nix/nix.conf`もしくは`/etc/nix/nix.conf`に次の内容を書き込んでください。

```shell
experimental-features = nix-command flakes
```

Macの方は`nix enable flakes mac`等で調べてみてください。

### 2. `*****/flake.nix': No such file or directory`
このようなエラーが出る場合です。
```shell
$ nix develop
warning: Git tree '/****/flake-example' is dirty
error: getting status of '/nix/store/0ccnxa25whszw7mgbgyzdm4nqc0zwnm8-source/flake.nix': No such file or directory
```
これはGitレポジトリでこの作業を始めたときにありがちです。NixはGitリポジトリ内にある場合は`git add`されていないファイルは無視されてしまいます。`git add flake.nix`をしてからもう一度実行してみてください。

### 3. パッケージが見つからない
このようなエラーが出る場合です。

::: details

```shell
$ nix develop
warning: Git tree '/****/flake-example' is dirty
error:
       … while calling the 'derivationStrict' builtin

         at /builtin/derivation.nix:9:12: (source not available)

       … while evaluating derivation 'nix-shell'
         whose name attribute is located at /nix/store/wk5dq7iwpd8yb4mnhb98k687kgdqachh-source/pkgs/stdenv/generic/make-derivation.nix:348:7

       … while evaluating attribute 'nativeBuildInputs' of derivation 'nix-shell'

         at /nix/store/wk5dq7iwpd8yb4mnhb98k687kgdqachh-source/pkgs/stdenv/generic/make-derivation.nix:392:7:

          391|       depsBuildBuild              = elemAt (elemAt dependencies 0) 0;
          392|       nativeBuildInputs           = elemAt (elemAt dependencies 0) 1;
             |       ^
          393|       depsBuildTarget             = elemAt (elemAt dependencies 0) 2;

       error: undefined variable 'cowsa'

       at /nix/store/b18qhqshgpcpgha4r3hh1c4nkc3z5pn0-source/flake.nix:7:36:

            6|     devShells.x86_64-linux.default = pkgs.mkShell {
            7|       packages = with pkgs;[ hello cowsa ];
             |                                    ^
            8|     };
```
:::

これは`cowsay`の綴が間違っていることから発生しているエラーです。パッケージ名の綴、実際にそのパッケージが存在するのかを確認してからもう一度試してみてください。

### 4. アーキテクチャが間違っている
このようなエラーが出る場合です。

::: details
```shell
$ nix develop
warning: Git tree '/home/shogo/tmp/flake-example' is dirty
error: flake 'git+file:///home/shogo/tmp/flake-example' does not provide attribute 'devShells.x86_64-linux.default', 'devShell.x86_64-linux', 'packages.x86_64-linux.default' or 'defaultPackage.x86_64-linux'
       Did you mean devShells?
```
:::

これはアーキテクチャが間違っていたり、`devShells.x86_64-linux.default`のような部分の綴が間違っていることで起こります。アーキテクチャの文言を修正したり綴をチェックしてみてください。

### 5. その他
もしわからないことがあればX(旧:Twitter)で`@daniel_program`に質問してみてください。（最近あまり活動していませんが返事は書くと思います。）