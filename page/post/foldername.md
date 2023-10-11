---
title: homeディレクトリの名前を英語にしたいよなぁ...
description: Ubuntuのhomeディレクトリの名前を英語にしてみましょう
date: 2019-4-3
category: linux
author: AstPy_ms
tag:
- Ubuntu
---

## こんなことありませんか？
???「さーて今日はdebファイル落としてきてアプリインストールしよーっと」
ここでterminalを開く
???「$ cd ./Download」

```bash
bash: cd: ./.Download: そのようなファイルやディレクトリはありません
```


## あ゛あ゛あ゛あ゛あ゛あ゛あ゛あ゛
なんでいちいちmozcで入力しなきゃいけねぇんだよお゛お゛お゛お゛

## そんなあなたにいいコマンドがあります

```bash
$ LANG=C xdg-user-dirs-gtk-update
```

これを実行すると何やら怖そうなダイアログが出ますが、落ち着いて`Update Names`をクリックして完了です。必要なら`Don't ask me again`にチェックを入れておきましょう。

## まとめ
英語のほうが楽ですよね
