---
title: SystemdでLinuxのスクリプトを起動時に実行する
description: Systemdを利用してLinuxでスクリプトろ自動実行する方法を解説します。
date: 2019-03-06
author: pineapplehunter
category: linux
---
# Systemdで起動時にスクリプトを実行する
## 自動起動について
Linuxを使っていると何かとプログラムを自動起動したいときがあると思います。
例えば

 * minecraft serverを立てる
 * 起動時のバックアップ
 * 自作のデーモンを動かす

というときに必要になると思います。

今回はその自動起動をSystemdのUnitファイルを書くことでやろうと思います！

## Systemd？
Systemdとは最近のLinuxにほとんど入っているサービス管理用のプログラム？システム管理用のプログラム？カーネル用の…？…Linuxのシステム用の多機能ツールです（笑）。
プログラムを自動起動するには様々な方法があり、`cron`を使ったり`init`用にスクリプトを書いたり…
なぜSystemdを使うかというと、ほとんどのLinuxで動き、もしプログラムがクラッシュしてしまったときに再起動するなどの設定が簡単に実行できるからです。

## Unit、Serviceとは？
Systemdで管理されるものについて書かれたファイルです。
これを特定のディレクトリに置き、実行権限をあげると、Systemdが見つけて実行できるようになります。
Unitの中でも特にプロセスを立ち上げたり終了したりするものをServiceと呼びます。

## Unitファイルを置くディレクトリについて
はじめに、Unitファイルを作成する必要があります。
Unitファイルは置く場所によって多少意味が変わってきます。

### ユーザーの権限で実行する場合
次のディレクトリならどこでも良いです

 * ~/.local/share/systemd/user/
 * ~/.config/systemd/user/

::: tip
ユーザーのディレクトリにUnitファイルをおいたとき、**コマンドに`--user`オプションをつけないとうまく動きません！！！**
:::

### rootユーザー権限の場合
次のディレクトリならどこでも良いです

 * /etc/systemd/system/
 * /usr/lib/systemd/system/

## Serviceファイルを書く
すべてのオプションを書いてもいいですが、多すぎて分かりづらいので、いくつかテンプレートを載せておきます。もしすべてのオプションを見たい場合は、[DegitalOceanのこのサイト](https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files)がまとまっていてわかりやすいです。

Serviceファイルには書くことが３つあります。テンプレートして書くと、

#### template.service

```
[Unit]
...

[Service]
...

[Install]
...

```

こんな感じになります。

### [Unit]
**[Unit]** には主に

 * Description (説明)
 * After (〜が実行されたあとに実行)

を書きます。
他にも`Before`や`Documentation`書くことはできますが、あまり必要になることはないと思います。
**空でも問題ありませんが[Unit]自体は残しておきましょう。**

#### 例：（minecraft server）
```
[Unit]
Description=a minecraft server service
```

### [Service]
**[Service]** 何をするのかを書きます。主に、

 * Type (プロセスの種類)
 * ExecStart, ExecStop (開始、終了用のコマンド)
 * Restart (どんなときプロセスを再起動するか)

を書きます。

#### 例：（開始、終了用に別々のコマンドがある場合、終了した場合常に再起動）
```
[Service]
Type=fork
ExecStart=/path/to/binary/start --options
ExecStop=/path/to/binary/stop --options
Restart=always
```

#### 例：（開始したらそのまま処理し続ける、異常終了した場合再起動）
```
[Service]
Type=simple
ExecStart=/path/to/binary/start --options
Restart=on-failure
```

### [Install]
**[Install]** は自動起動の場合基本的に一通りしかありません。
**WantedBy** にはどのプロセスと一緒に立ち上げるかを指定します。
**default.target** は「起動したとき」という意味になります。（他にも`multi-user.target`）

#### 例
```
[Install]
WantedBy=default.target
```

## 完成したファイル
このようなファイルができると思います

```
[Unit]
Description=a minecraft server service

[Service]
Type=simple
ExecStart=/path/to/binary/start --options
Restart=on-failure

[Install]
WantedBy=default.target
```

## systemdに登録する
まずは、作ったファイルに実行権限を付与します

```bash
$ chmod +x サービス名.service
```

そして`systemctlコマンドを使って実行してみます`

```bash
###開始
$ systemctl start サービス名.service
###ユーザー用に作成した場合 --user をつける（status,stopでもつける）
$ systemctl --user start サービス名.service

###起動確認
$ systemctl status サービス名.service

###終了
$ systemctl stop サービス名.service
```

うまく動いた場合は、次のコマンドを打つと自動起動になります。

```bash
$ systemctl enable サービス名.service
```

## 自動起動をやめたいとき
次のコマンドでできます

```bash
$ systemctl disable サービス名.service
```


## うまく行かない場合
次のことを確認してみてください
 * 正しいディレクトリにファイルが入っているか
 * 実行方法が正しいか（template.serviceだった場合: `systemctl start template.service` ）
 * ユーザーフラグをつけているか(`--user`)
 * 実行権限を付与したか

## 感想
Systemdに賛成派と反対派がいるようですが、この方法を使ったサービス管理はとても簡単なので私はおすすめです。
ここに書いたような`systemctl`を使ったコマンドはとても便利で、起動が遅いときとかに必要のないサービスを`disable`するなどできて面白いです。


## 参考サイト
Digital OceanのSystemdのUnitファイルについてまとまってるサイトです。（英語）
https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files
