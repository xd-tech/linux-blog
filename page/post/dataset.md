---
title: pythonのライブラリ"dataset"でデータベースを簡単に触る！
description: datasetライブラリの紹介・使い方
date: 2019-08-11
author: pineapplehunter
---

# pythonのライブラリ"dataset"でデータベースを簡単に触る！

## datasetとは
Pythonからデータベースを簡単に操作できるようにするためのライブラリである．
個人的にはSQL Alchemyよりも簡単に使えると思う．~~と言うか簡単に使えすぎて少し怖いくらいだ~~

## 使い方
簡単な使用例をここに示す．
ここで示す流れは，

1. "test.slite"というデータベースに接続（作成）
2. データベースの"address"というテーブルを開く(作成する)
3. 住所のレコードをいくつか追加する
4. 特定の名前の人のレコードを取得し，printする

というものにする．

```python
import dataset

# データベースに接続(なければ自動的に作成)
db = dataset.connect("sqlite:///test.sqlite")

# "address"テーブルを開く(なければ自動的に作成)
address = db["address"]

# レコードの追加(dictのキーによって自動的にフィールドが追加される)
address.insert({"name":"aaa", "address": "an address"})
address.insert({"name":"bbb", "address": "some address"})
address.insert({"name":"ccc", "address": "any address"})

# "aaa"さんのレコードを取り出す
aaa = address.find_one(name="aaa")
print(aaa)
```

ね？かんたんでしょ！

## 細かい解説
例で，だいたいのことはわかってもらえたと思うが，しっかり細かい部分を解説しておく

### データベースに接続
```python
# "test.sqlite"に接続（作成）
db = dataset.connect("sqlite:///test.sqlite")

# 一時的なデータベースをメモリに作成
db = dataset.connect("sqlite:///:memory:")

# mysqlデータベースに接続
db = dataset.connect('mysql://user:password@localhost/mydatabase')
```

### テーブルの読み込み（作成）

```python
# "cool_table"というテーブルの読み込み（作成）
table = db["cool_table"]
```

### テーブルに新しいデータの挿入
```python
# データの挿入(idは自動生成)
table.insert({"name":"some name", "number": 12345})
# フィールドを追加するとデータベースを自動的に調整してくれる (fooフィールドの追加)
table.insert({"name":"another name", "number": 67890, "foo":"bar"})
```

### データの読み込み
```python
# すべてのデータの読み込み．そして出力
data = table.find()

for d in data:
    print(d)

# 名前が"aaa"のデータの読み込み
data = table.find(name="aaa")
for d in data:
    print(d)

# 名前が"bbb"のデータを一つだけ読み込む
data = table.find_one(name="bbb")
print(data)

```

### データのアップデート
```python
# 第一引数に変更後のデータと絞り込むための項を入れておく
# 第二引数にどの項を使い絞り込むか決める
table.update({"id":1, "name":"change name!"}, ["id"])
```

### データの削除
```python
# 名前が"aaa"なデータを削除する
table.delete(name="aaa")
```

### その他
他にも数個機能がありますが，ここでは説明しないので公式のドキュメントを呼んでみてほしい．
https://dataset.readthedocs.io/en/latest/index.html

## まとめ
今までデータベースをpythonから触るなら，SQL Alchemyだ！とおもっていたが，このdatasetがメチャクチャ使いやすいので今後はこれを使う気がする．
データベースを触りたいけどデータベースについて考えたくない人はこれを使ってみてほしい．
