---
title: Wacomの液タブの色をMacのディスプレイに合わせて変換する話
description: 思考錯誤して色を調整して最終的に自動化する話
date: 2020-4-1
category: python
author: pineapplehunter
tag:
- color
- automation
- mac
---

# Wacomの液タブの色をMacのディスプレイに合わせて変換する話
## TL;DR
Wacomの液タブ(Wacom Mobile Studio Pro 13)で描いた絵をMacで表示するときは

1. 色空間を変換し(`sRGB` → `GENERIC RGB`)
2. 彩度を上げて(x1.3)
3. 輝度を上げる(x1.1)

と手順を踏むとかなり描いたときの色に近づく。

この変換を自動化するスクリプトを作った。

## Wacomの液タブで書いた色がMacでそのまま表示できない！
ある日、私の恋人であるNさんがWacomの液タブで絵を描いるときに相談を持ちかけられた。

Nさん「Wacomの液タブで絵を描いてたんだけど」
Nさん「画像に出力してMacのディスプレイで見たら色が変わって見えるんだけど」
Nさん「なんとかできるかな？」

私「うーん。俺には違いがよくわからないんだけどな…~~（色音痴）~~」

Nさん「かなりはっきり違うと思うんだけどな〜」

私「まあ色調整すればそれっぽくなるんじゃない？」

Nさん「まあ試しにやってみて！」

ということでWacomの液タブ（Wacom Mobile Studio Pro 13）で描いた絵をMacのディスプレイで表示したときに色が同じに見えるように色を調整してみることにしてみた。

## 試行錯誤
### 単純な色調整を試す
とりあえずはじめに思いついた方法を試してみた。

* RGBの色調整

GIMPを使いRGBを調整してみた。

結果: **Nさん「全然違う」**

### 輝度、彩度、コントラストを調整する
全然違うものができたようなので次はこれを調整してみた。

* 輝度
* 彩度
* コントラスト

調整しある程度似たと思ったところでまた見せてみた。

結果: **Nさん「まだ全然違う」**

### 色空間を調整してみる
半分諦めムードで最後に思いついたものを調整してみた。

* 色空間

ディスプレイによって色の表示の仕方が違って見え方が変わっていると考えて色空間をいろいろ試し、似た色になるか試してみた。

試し方はMacのディスプレイで画像を表示し、Wacom液タブで表示されている画像と比較し似ているか見てみるという方法で行った。

結果: **Nさん「相当似てるやつがあった！」**

## 色空間を調整すればいいのか！
という流れで色空間を調整すればなんとなく似た画像に変換できることがわかった。
そこで、画像が似る色空間のファイルを見つけ、描いた絵を変換してみることにした。

### 色空間の変換
画像を表示したときに`Generic RGB Profile`でWacom液タブに近いことがわかり、もとのMacの色空間は`sRGB`にかなり近いことがわかった。また色空間のファイルは次の場所に保管されていた。

```
* Generic RGB Profile
/System/Library/ColorSync/Profiles/Generic RGB Profile.icc

* sRGB
/System/Library/ColorSync/Profiles/sRGB Profile.icc
```

そこでGIMPを使い次のように画像を変換した

1. 画像を読み込む
2. 画像を`sRGB`の色空間で保存されていたとする
3. 色空間を`Generic RGB Profile`に変換する

結果: **Nさん「おしい！！！」**

### 仕上げ
これまででほとんど色は~~私には~~同じに見えたが、仕上げをすることにした。
適当に次を調整してみた。

* 輝度
* 彩度

両方共少し上げてみた

結果: **Nさん「これだ！」**

## ついに完成！ただし…
ここまで進めるとだんだん私にも色の違いがわかるようになってきたが、いくつかの絵で試してみたとき次の手順を踏めばだいたい描いているときと同じ色で表示されることがわかった。

1. 色空間を変換し(`sRGB` → `GENERIC RGB`)
2. 彩度を上げて(x1.3)
3. 輝度を上げる(x1.1)

これでいいのだが、一つ問題が残った。
**いちいちGIMPで変換するのが面倒くさい**

### 自動化
一プログラマとして、単純な作業は自動化させていので、`Python`で自動化してみようとしました

## Pythonで自動化
`Python`の`Pillow`ライブラリをインストールし次のようなスクリプトを作成した。

`wacom2mac.py`
```python
from PIL import Image, ImageCms, ImageEnhance
from sys import argv
from pathlib import Path

file_names = list(argv)[1:]

icc_path = {
    "GENERIC RGB": "/System/Library/ColorSync/Profiles/Generic RGB Profile.icc",
    "sRGB": "/System/Library/ColorSync/Profiles/sRGB Profile.icc"
}

for f in file_names:
    path = Path(f)
    im: Image.Image = Image.open(path)

    transform = ImageCms.buildTransform(
        icc_path["sRGB"], icc_path["GENERIC RGB"], im.mode, im.mode)

    im = ImageCms.applyTransform(im, transform)

    converter = ImageEnhance.Color(im)
    im = converter.enhance(1.3)

    brightness_converter = ImageEnhance.Brightness(im)
    im = brightness_converter.enhance(1.1)

    im.save(path.parent / f"{path.stem}_w2m{path.suffix}")
```

これで色空間の変換、輝度、彩度の調整を一気にやってくれるスクリプトができました
次のように実行できます

```bash
$ python3 wacom2mac.py 変換したい画像ファイル
```

ここで`test.jpg`を入力すると同じディレクトリに`test_w2m.jpg`というファイルが生成されます。

## 更に自動化
Automatorを使い次のようなクイックアクションを追加した

![automator screenshot](../.vuepress/public/imgs/wacom2mac/automator.png)

`/path/to/python`,`/path/to/wacom2mac.py`は各自の環境に合わせて置き換えてほしい。
`/path/to/python`は`$ which python3`の結果を入れればいい。

これで`Finder`を開いて画像ファイルを選択したとき、`wacom2mac`というオプションが表示され、クリックすることで自動で変換できるようになった

## おわりに
Nさん「これで満足に描かけるようになった！」

と言っていただけたのでこれで完成にした。

画像の色変換はGIMPでいろいろと試し、自動化するときは`Python`の`Pillow`ライブラリで変換するとうまく行くことがわかった。

色って大事なんだな〜