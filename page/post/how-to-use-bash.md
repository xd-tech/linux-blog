---
title: bashのコマンドを紹介
description: プログラミングのときに使うbashコマンドを紹介します
date: 2020-07-11
category: programming
author: Astpy_ms
tag:
  - windows
  - bash
  - powershell
---

## はじめに

~~大学で出された資料が使えない資料だったので~~ プログラミングで使うbash, powershellのコマンドをまとめました。


## めっちゃ使う

コマンドの基礎は以下のものです。

| コマンド | 意味 | 役割 |
|:--------:|:----:|:----:|
| cd | Chenge Directory | 場所の移動 |
| ls | List Segments | 今いる場所の中身を表示 |
| pwd | Print Working Directory | 今いる場所のアドレスを表示 |

| PATH | 意味 |
|:----:|:----:|
| ./ | 今いる場所(省略可能) |
| ../ | 1つ前 |

**`/` と`\`と`¥`はほとんど同じ意味を持ちます。**

```bash
# 今回はbash(Linux)です。
# PowerShell(Windows)もだいたい一緒

# ~ の部分が今いる場所です。
user@user:~$

# Downloadディレクトリに移動
user@user:~$ cd ./Downloads

# 内容表示
user@user:~/Downloads$ ls

# 1つ前に戻る
user@user:~/Downloads$ cd ..

# ~に戻ってきました
user@user:~$

# こんなこともできる
# いろいろやってるけど結局Downloadsに移動してるだけ
user@user:~$ cd ./cloned/linux-blog/../../cloned/../Downloads
```


## たまに使う

| コマンド | 意味 | 役割 | 使用例 |
|:--------:|:----:|:----:|:------:|
| touch | touch | ファイルを作成 | touch test.py
| echo | echo | 書いた**文字列**を表示 | echo "Hello World" |
| cat | :cat: | 指定した**ファイルの内容**を出力 | cat test.py |
| diff | Differ | ファイル同士の比較 | diff ./1.py ./2.py |
| \| | Pipe | 左で出てきたデータを右に渡す | - |
| > or < | - | データを渡して上書き保存する | - |
| >> or << | - | データを渡して追加する | - |

基本的には**terminal上に表示されたものが渡されます。**

つまり、`echo` やC++の`cout` されたものが渡されます

```bash
# 使ってみよう

# test.txtを作ってみる
user@user:~$ touch test.txt

# 確認
user@user:~$ ls

# echoで出力してみる
user@user:~$ echo "Hello World"
Hello World

# echoでtest.txtに文字を入れてみる(追加)
user@user:~$ echo "Hello World" >> test.txt

# catでtest.txtを表示してみる
user@user:~$ cat test.txt
Hello World

# a.outが存在すると仮定して
# catで表示したものをa.outに転送してみる
user@user:~$ cat test.txt | ./a.out

# 上の応用版、a.outの結果がanswer.txtに保存される。
# answer.txtはなくても生成される
user@user:~$ cat test.txt | ./a.out > answer.txt
```

## 実用例

```bash
# これが入っているとすると
- test_case.in # テストケースが入っている
- answer.ans # 解答が入っている
- test.cpp
- a.out # test.cppをコンパイルしたもの

# test_case.inをa.outに転送して、その結果をanswer.outに保存する
# answer.outは勝手に生成される
user@user:~$ cat ./test_case.in | ./a.out > answer.out

# diffコマンドで一致してるか確認
user@user:~$ diff ./answer.ans ./answer.out
```

## まとめ

| PATH | 意味 |
|:----:|:----:|
| ./ | 今いる場所(省略可能) |
| ../ | 1つ前 |

| コマンド | 意味 | 役割 | 使用例 |
|:--------:|:----:|:----:|:------:|
| cd | Chenge Directory | 場所の移動 | cd ./Downloads |
| ls | List Segments | 今いる場所の中身を表示 | - |
| pwd | Print Working Directory | 今いる場所のアドレスを表示 | - |
| touch | touch | ファイルを作成 | touch test.py |
| echo | echo | 書いた**文字列**を表示 | echo "Hello World" |
| cat | :cat: | 指定した**ファイルの内容**を出力 | cat test.py |
| diff | Differ | ファイル同士の比較 | diff ./1.py ./2.py |
| \| | Pipe | 左で出てきたデータを右に渡す | cat test.txt \| ./a.out |
| > or < | - | データを渡して上書き保存する | ./a.out > answer.txt |
| >> or << | - | データを渡して追加する | ./a.out >> a.txt |
