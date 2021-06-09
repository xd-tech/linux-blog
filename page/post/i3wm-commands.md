---
title: i3wmを使いこなすために
description: i3wmで知っておきたいコマンドたちを紹介します
date: 2019-02-27
category: linux
author: AstPy_ms
tag:
- Ubuntu
- i3wm
---

## 最初に

今回の環境は、Ubuntu18.10です。
あと、i3wm設計者はvimerなんでしょうか。以下に記載する`vimのアレ`とは`j k l ;`のことです。

## 日頃使う系

### 基礎

| command | meanings |
| :------ | :------- |
| Mod + Enter | terminalを開く |
| Mod + r | vimのアレを打つとウィンドウのリサイズができる |
| Mod + d | dmenuを開く |
| Mod + Shift + Q | kill |
| Mod + Shift + E | Exit i3?(logoutを促す) |
| Mod + f | 任意のウィンドウをフルスクリーン表示 |
| Mod + Shift + Space | ウィンドウを独立させる | 

### 新規ウィンドウの追加方式

| command | meanings |
| :------ | :------- |
| Mod + s | "スタック", 上に上に重なる |
| Mod + w | "タブ", ブラウザのように出る |
| Mod + e | "デフォルト", WMの標準 |

一度打つとこの表内の他のコマンドを打つまでは効果が持続する

### 新規ウィンドウの追加場所

| command | meanings |
| :------ | :------- |
| Mod + h | ウィンドウを右に追加していく |
| Mod + v | ウィンドウを下に追加していく |

`Mod + h`がデフォルト
一度打つとこの表内の他のコマンドを打つまでは効果が持続する

### ワークスペース

| command | meanings |
| :------ | :------- |
| Mod + Num | 任意のワークスペースに移動 |
| Mod + Shift + Num | ウィンドウを任意のワークスペースに移動 |

ただしNumは `0 ≦ Num ≦ 9`の`自然数`

### 同ワークスペース内でのウィンドウの移動

| command | meanings |
| :------ | :------- |
| Mod + Shift + Vim | ウィンドウをvimのアレの方向に移動 |

## .configに追加する系

### 壁紙を設定する

```ruby: ~/.config/i3/config
exec --no-startup-id "feh --bg-scale $HOME/.config/i3/wallpaper.jpg"
```

このpathは任意で決められます。この場合は`~/.config/i3`の中に`wallpaper.jpg`を入れていますね

これはconfig内のどこにでも追加してOK

### スクリーンショットの設定(Ubuntu)

```ruby: ~/.config/i3/config
bindsym mod1+a exec gnome-screenshot
bindsym mod1+s exec gnome-screenshot --window
```

この場合、`Alt + a`で画面に写っているものすべてを、`Alt + s`で任意のウィンドウだけをスクリーンショットしてくれます

これはconfig内のどこにでも追加してOK

### Mod+Shift+Eを豪華に

```ruby: ~/.config/i3/config
bindsym $mod+Shift+e exec --no-startup-id \
"i3-nagbar -t warning -m 'Do you really want to exit i3?' -b 'Shutdown' 'systemctl poweroff' -b 'Reboot' 'systemctl reboot' -b 'Logout' 'i3-msg exit'"
```
`exit i3?`だけだったのを`Shutdown`,`Reboot`,`Logout`の3つに増やします

これはもともとあったキーバインドのところと置き換えて使います。おそらく`bindsym $mod+Shift+e`の行があるのでそこと置き換えます

### Mod+dをdmenuからi3-dmenu-desktopに変える

```ruby: ~/.config/i3/config
bindsym $mod+d exec --no-startup-id i3-dmenu-desktop
```

これもdmenuを開くキーバインドのところと置き換えて使います。おそらく`bindsym $mod+d exec --no-startup-id dmenu`みたいな行があるのでそこと置き換えます

## 終わりに

これでi3wmマスターへ一歩近づけました。i3wmのインストールは[こちら](https://students-tech.blog/post/i3setting.html)

## 参考文献
- https://qiita.com/gyu-don/items/d61b03e0222a7f1ce9f7
- https://i3wm.org/docs/refcard.html