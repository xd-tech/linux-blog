---
title: i3wmでバッテリーが認識しないゾ
description: i3wmで No battery になってしまうときの対処法を紹介します。
date: 2019-12-07
category: linux
author: AstPy_ms
tag:
- i3wm
- Ubuntu
---

## LG GRAM買ったぞ！Linux入れてやるぜ！

私事ながら、今年の3月にLG GRAMを購入しました。最高です。後日コレについてもレビューしようと思います。

## おや？

i3wmを[この記事](https://students-tech.blog/post/i3setting.html)を見ながらインストールしていると...

**バッテリーのところが No battery になってるやないかい！！**

これは非常に困りました。

いくらバッテリー持ちがいいラップトップとは言え、いつ電源が切れるのかわからないと厳しいものがあります。

いろいろ試行錯誤した結果解決策が見つかったので書いていきます。

今回は**Ubuntu19.10 + i3wm** のときでを記述しますが、Ubuntu18.04 LTSでも同じように対策できます。

## 直していこう！！

### バッテリーのデータを探す

大抵は`/sys/class/power_supply`にあります。

```bash
cd /sys/class/power_supply
ls

# こんな感じのが出てきます
# ADP1  CMB0  hidpp_battery_0

# LG GRAMはバッテリーが2個あるのでこうなりますが、普通はCMB0だけのように1つです。
```

これでバッテリー情報は確認できました。

この情報を`i3status.conf`に書き込んでいきます。

### i3status.conf をいじる

```bash
cd /etc
sudo vim i3status.conf
```

そうするといろいろ出てきます。

ファイルの割と上の方に`order += "battery all"` または `order L= "batttery n" (nはなんらかの数字)`みたいなものがあります。

LG GRAMでは`battery all`となっていて、こいつが悪さをしている様子。

これを下のように修正します。

```/etc/i3status.conf
# 修正前
order += "battery all"

# 修正後
order += "battery 1"
```

さらにその下の方にも

```/etc/i3status.conf
battery all {
        format = "%status %percentage %remaining"
}
```

となっているところがあるので、これも修正します

```/etc/i3status.conf
# 修正前
battery all {
        format = "%status %percentage %remaining"
}

# 修正後
battery 1 {
        format = "%status %percentage %remaining"
        path = "/sys/class/power_supply/[さっき見たバッテリーの名前]/uevent"
}
```

LG GRAMの場合は`path = "/sys/class/power_supply/CMB0/uevent"`となります。

これで**ログアウトして再ログイン** すれば直っているはずです

## まとめ

LG GRAMは最高です。