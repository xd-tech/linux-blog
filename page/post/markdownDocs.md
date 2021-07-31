---
title: Markdownでノートを取ろう！
description: Markdown,Libreoffice Writer,pandocを使ってノートを取る方法を伝授します。
date: 2019-06-18
category: other
author: AstPy_ms
tag:
- useful
- campuslife
- ubuntu
---

## 大学に入ってラップトップを買ったそこのあなた！

せっかく大学に入ってパソコンを買ったのなら、**パソコンでノートを取ってドヤ顔しましょう！！！**
ただそのためには条件があります。

## ノートを取るための条件

- Terminalが使える環境である

|    OS   |        環境        |
| :------ | :----------------- |
| Windows | コマンドプロンプト |
|   Mac   |   端末(Terminal)   |
|  Linux  |   端末(Terminal)   |


**これだけです。**
あとはインターネットが使えればOKです。

## Pandocをインストールする

Windows,Macの方は[こちら](https://qiita.com/sky_y/items/3c5c46ebd319490907e8)
Linuxの方は`$ sudo apt install pandoc`でできます。

## Libreoffice Writerをインストールする

ダウンロードは[こちら](https://www.libreoffice.org/download/download/)
Libreofficeとは**Microsoft Office**のオープンソース版と言うべきでしょうか。無料で使うことができます。**決して怪しいものではありません。**

## 手順

#### 1. 好きなMarkdownエディターでノートを取る

おすすめは[Hackmd](https://hackmd.io)です。githubのアカウントさえあれば始められます。
githubのアカウントはこれからプログラミングや科学技術関係のウェブサイトで使うことが多くなるので、作っていない方はサインアップすることをおすすめします。

#### 2. 自分のパソコンにmarkdownファイルをダウンロードする

hackmdなら直接ダウンロードできます。hackmdの右上にある...(三点リーダ)のダウンロードの項目からダウンロードシましょう。
最悪パソコン内に新しいmarkdownファイルを作ってコピペでも可です。

#### 3. PandocでMarkdownをodtにする

```
# Linux/Mac/Wondows
$ pandoc 自分がダウンロードしたmdファイル.md -o 好きな名前.odt

# 例
$ pandoc memo.md -o notebook.odt
```

## 最後に

Hackmdを使っている方は気づいてしまったかもしれませんが、**beta版としてODFファイルとしてダウンロードできるようになっています。**
いつの日かPandocを使わなくてもノートが取りやすくなるかもしれません...

## まとめ

これであなたもドヤれます。