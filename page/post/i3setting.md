# i3WMの設定
## はじめにインストールしておくコマンドたち

今回は`vim`を使う。

```terminal
sudo apt install vim
```

## i3 Window Managerのインストール

```terminal
sudo apt-get update
sudo apt-get install i3
```

このあとPCの**再起動**をかける。ログイン画面にある歯車マークをクリックしたときに、`i3`と表示されていれば成功。

## fcitx-mozcのインストール

```terminal
cd ~
sudo apt install fcitx-mozc
vim .profile
```

vimで`.profile`を開いたら、↓これらを1番下にでも追加する。
vimのコマンドは[こちら](https://eng-entrance.com/linux-vi-save)

```.config
export DefaultImModule=fcitx
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```
また、起動時にmozcが勝手に起動するようにする。  
 
```./.config/i3
cd ./.config/i3
vim config
```
このあとに、どこでもいいので`exec --no-startup-id fcitx`を追加して、**ログアウト**します。再ログインして、

```terminal
fcitx-config-gtk3
```

上のコマンドを打ったあとに、Ubuntuのインストール時の設定したキーボードレイアウト(今回は`日本語`)と`mozc`が出ていれば成功です。半角/全角キーの切り替えで日本語が打てるようになっているはず。
デフォルトで日本語入力にしたい人は、クルマのナビみたいな矢印を使ってmozcを1番上に持ってくる。

## インストールしたほうがいいかも?なコマンドたち

個人的に`gdebi`はよく使うのでおすすめしておく。`dpkg`よりも優秀で、依存関係にあるものをすべて持ってきてくれる。確か、GUIにも対応している。

```ruby:terminal
sudo apt-get install gdebi
```

実行の仕方は

```ruby:terminal
sudo gdebi [ダウンロードしてきた.debファイルの名前]
```

お好みで、`sl`と`nyancat`もどうぞ。lsではありませんよ。

```ruby:terminal
sudo apt install sl
sl
sudo apt install nyancat
nyancat
```

## 終わりに

どうあがいてもArch Linuxのソースしかなくてしばらく頭を抱えていたので、そんな人がもう出ないようにここに書いておきました :)
ここまでやれば日本語も打てるようになっているはずなので、ある程度はi3wmで暮らせるようになる(はず)。
