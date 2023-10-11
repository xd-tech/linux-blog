---
title: clang-tidyでC/C++のバグを減らそう！
description: エディタにclang-tidyを導入する方法を解説
date: 2021-02-23
category: programming
author: pineapplehunter
tag:
- clang
- compiler
- vscode
---

# clang-tidyでC/C++のバグを減らそう！
## clang-tidyとは
C/C++用の静的解析ツール(linter)です。これを使うことによりプログラミングしているときに見逃すような細かいバグを早期に発見することができます。

簡単に言うと、下のようなバグがありそうなコードを
![no linter](/imgs/clang-tidy/nolint.png)
下のようにワーニングを出すことができるようになります。
![with linter](/imgs/clang-tidy/lint.png)
ワーニングを見ると、`s`や`i`の初期化を行っていなかったことや、if文の条件に`==`ではなく`=`を間違えて使ってしまっていたことがわかります。

## インストール方法
LLVMをインストールすることで、一緒に`clang`や`clang-tidy`、`clang-format`等を一気にインストールすることができます。LLVMのインストールについては私が以前書いた次の記事を参考にしてみてください。

[Clangのインストール](https://students-tech.blog/post/install-clang.html)

### Linuxでのインストール方法
Linuxではclangをインストールするだけではclang-tidyが入ってこないので別でインストールします。次のコマンドはUbuntuでの例です。

```bash
$ sudo apt install clang-tidy
``` 

## VSCodeのプラグイン導入
VSCodeの拡張機能のインストールで`Clang-Tidy`をインストールします。

![clang-tidy plugin](/imgs/clang-tidy/plugin.png)

これだけで使えるようになるはずです！

### macでの注意
macではclang-tidyのインストール場所が違うのでプラグインの設定を変える必要があります。
VSCodeの設定から、`Extensions > clang-tidy > Executable`の中身を、

```
clang-tidy
```

から

```
/usr/local/opt/llvm/bin/clang-tidy
```

に変更してください。
こうすることで、clang-tidyがPATHに含まれていなくても動作させることができます。

## Error Lens
これはオプションですが、Error Lensというプラグインを入れると、更にワーニングやエラーが見やすくなるのでおすすめです。

![Error Lens](/imgs/clang-tidy/error-lens.png)

## まとめ
clang-tidyを導入することで今後書くコードの紛失をあげていくことができるようになると思います。これからもよいプログラミングを！
