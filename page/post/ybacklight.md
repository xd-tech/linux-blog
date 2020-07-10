---
title: xbacklightに代わるものとは...?
description: i3wmにはybacklightで画面輝度を変えてみよう
category: linux
author: AstPy_ms
date: 2019-02-30
tag:
- Ubuntu
- i3wm
---

## xbacklightじゃないの?

i3wm + Ubuntuをつかっているあなた、xbacklightを使ってディスプレイの輝度変更をしたい、またはショートカットキーを作りたいようですね...

```ruby:termial
$ xbacklight -inc 10
No outputs have backlight property
```

あれ?変更できないしなんか変なコメント出てきた...調べてみよう...
そこで出てくるほとんどのサイトが**英語**なのです...~~まじで許さん~~

## そこで!

今回は~~ちょっと怪しい~~`ybacklight`というコマンドを使って、輝度変更をかんたんに行います!

## 必要なコマンドたち

今回は`vim`,`git`,`build-essential`,`meson`を使います。vimではなく`emacs`でも可です。

```ruby:terminal
sudo apt install vim
sudo apt install git
sudo apt-get install meson
sudo apt-get install build-essential
```

## ybacklightのインストール

gitといえばの`git clone`から始めます。今回はホームディレクトリにcloneします。

```ruby:terminal
cd ~
git clone https://github.com/szekelyszilv/ybacklight
cd ./ybacklight
make
sudo make install
```

インストールは完了しました。ただ、この`ybacklight`は特定のファイルに権限を与えなければならないので

```ruby:terminal
sudo chmod 666 /sys/class/backlight/intel_backlight/brightness
```

これ、事案なのが、**PCの起動時に毎回やらなきゃいけないこと**
これ本当にきつい。

## i3 Window Managerに適用させる

`i3wm`の`.config`に書き込んでいきます。

```ruby:terminal
cd ~/.config/i3
vim config
```

```ruby:~/.config/i3/config
# Screen brightness controls
bindsym mod1+Shift+u exec ybacklight -inc 3 # Alt+Shift+u
bindsym mod1+Shift+i exec ybacklight -dec 3 # Alt+Shift+i
```

ここでPCの**再起動**をかけます。
そのあと**chmod**します。なぜか半角全角が効かなくなることがあったので、`chmod`をする前に、**半角全角キーを押して変更できるか確認してから**権限を与えるとできるはずです。

## 終わりに

起動時は`chmod`を忘れずに!
`sudo`にパスワードをかけていない人は、`~/.config/i3/config`に`exec --no-startup-id sudo chmod 666 /sys/class/backlight/intel_backlight/brightness`でいけたりするのかな?
