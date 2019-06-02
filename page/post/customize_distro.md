---
title: Linuxは見た目が9割(大嘘)
description: KDEやXfceなどのインストール方法を紹介します。
date: 2019-6-2
category: linux
author: AstPy_ms
tag:
- Ubuntu
---

## Ubuntuを使い始めてみたそこのあなた！！

Ubuntuをインストールしようと思って調べてみると、**Lubuntu**や**Kubuntu**なーんてものが出てきませんでしたか？~~私は初めてそれらを見たときパクリOSだと思いましたよ。ええ。~~
でも...

## それって見た目が違うだけ

結局それらは、簡単に言うと**もとはUbuntuで見た目だけ変えたもの**たちです。
でも、**UbuntuをインストールしちゃったからKubuntuの見た目にはできないってわけでもないんですよ！**
ではインストール方法を書いていきますよ

## インストール方法

```
$ sudo apt-get install [インストールしたいものの名前]

# 大量のなにか

$ sudo reboot
```

**はい。これだけです。** このとき`# 大量のなにか`のところに怖い文みたいなものが出ますが基本Enter連打でOKです。
あと、全体的に容量が大きいので**時間はかかります。**

## どれをインストールしよう...

ここでは代表的な[KDE](https://kubuntu.org/)、[Xfce](https://xfce.org/?lang=ja)、[LXDE](https://lxde.org/)を紹介します。

```
# KDE
$ sudo apt-get install kubuntu-desktop 
```

```
# Xfce
$ sudo apt-get install xfce4
```

```
# LXDE
$ sudo apt-get install lubuntu-desktop
```

各々インストールしたあとは`sudo reboot`してくださいね。

ちょっとやばい[i3wm](https://i3wm.org/)をインストールしたい人は[こちら](https://students-tech.blog/post/i3setting.html)

## Rebootしたあとは

再起動が終わったら、実際に見た目を変えてみましょう。
もうログインしてしまっている人は一旦ログアウトしてもらって、ログイン画面にある歯車をクリックして適用させたいものを選択したあと、ログインしてください。
これでOK

## まとめ
自分のお気に入りを探してみよう！！