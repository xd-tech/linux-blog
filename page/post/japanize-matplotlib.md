---
title: Matplotlibでグラフを作ると文字化けするのを解決する
description: japanize-matplotlibを紹介します
date: 2021-02-04
author: AstPy_ms
category: programming
tag:
  - python
  - linux
  - ubuntu
---

## 動作環境

- Ubuntu 20.10
- Python 3.8.6
- pip 20.1.1

## なんだこれ

matplotlibを使って棒グラフを作っていたときのことです。

![50%](/imgs/japanize-matplotlib/1.png)

**なんだこれは**

タイトルが文字化けをしていて豆腐になっています。
これの解決方法を探してみたのですが、**色んな方法が紹介されている上に全部動かない。**
設定ファイルをいじるのはちょっと怖いので、特にやりたくありませんでした。

## japanize-matplotlibだと！？

Matplotlibにおいて日本語が文字化けしてしないようにする、japanize-matplotlibというモジュールが用意されていました。

インストール方法は、

```bash
pip install japanize-matplotlib
```

でできます。

使用方法は、プログラムの先頭に

```python
import japanize-matpolotlib
```

と記述するだけでOKです。
これを使ってさきほどの棒グラフを生成してみると...

![](/imgs/japanize-matplotlib/2.png)

**やったぜ。**

これは、もちろん棒グラフだけでなく散布図などの他のグラフでも使えます。


## 最後に

英語でラベルを書くことも多いかも知れませんが、日本語で書けなくても困るのでぜひ利用してみてください。