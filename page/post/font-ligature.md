---
title: Font Ligatureでエディタのフォントをかっこよくする
description: Font Ligatureという特殊フォントを使い、'==='や'=>'などの記号を見やすくします
date: 2019-02-27
category: editor
tag:
  - font
---
# Font Ligatureでエディタのフォントをかっこよくする

## Font Ligatureとは
Font Ligature(合字)はこの写真がわかりやすいです。(`Dejavu Sans`というフォントです)
![Dejavu Sans Code Samples](https://raw.githubusercontent.com/SSNikolaevich/DejaVuSansCode/master/sample.png)
左が普通のフォントで、右がFont Ligatureのフォントです。

[Wikiによると](https://ja.wikipedia.org/wiki/%E5%90%88%E5%AD%97)Font Ligatureというのは、 **複数の文字を合成して一文字にしたもの** という意味らしいです

## 使い方
使うにはやることが２つあります

 1. フォントをインストールする
 2. Font Ligatureを好きなエディタで有効にする

この２つについて解説していきます

### フォントをインストールする
フォントをインストールしていきます。
まずはFont Ligatureに対応したフォントを見つけます。
いくつか例としてあげると

 * [Fira Code](https://github.com/tonsky/FiraCode)
 * [Dejavu Sans](https://github.com/SSNikolaevich/DejaVuSansCode)
 * [Hasking](https://github.com/i-tu/Hasklig)
 * [Monoid](https://larsenwork.com/monoid/)
 * etc...

このフォントをダウンロードして自分のコンピュータにインストールしましょう。
Linuxの場合、`~/.fonts/`等においておくだけでOKです。

### Font Ligatureをエディタで有効にする
Font Ligatureはエディタによって対応していたりしていなかったりするので調べる必要があります。[Fira CodeのGithubページ](https://github.com/tonsky/FiraCode#editor-support)にわかりやすい表が乗っているのでそこから確認するのが手っ取り早いです。他のエディタを使いたい場合、「エディタ名 font ligature」とググれば方法が見つかると思います。

ここにいくつかのエディタの例を載せておきます。

#### Visual Studio Code
`settings > Text Editor > Font > Font Family` に自分の好きなフォントを初めの方に追記します。
`settings > Text Editor > Font > Font Ligature` にチェックを入れます
これでファイルを編集すればFont Ligatureが有効になっているはずです

#### Atom
`settings > Editor > Font Family` に自分の好きなフォントを初めの方に追記します。
これでファイルを編集すればFont Ligatureが有効になっているはずです

## 終わりに
私は誰かがやっていたプレゼンで、かっこいいフォントが使われていたので、あれはどういうふうに使えるんだろうと調べていたところ見つけました。
Font Ligatureはすべてのファイルで使う必要はないと思いますが、書いていて楽しいのでおすすめです！
