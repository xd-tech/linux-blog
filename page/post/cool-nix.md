---
title: Nixのビルドシステムとしての優秀さについて語るだけのページ
description: Nixは初見では分かりづらい麺が多いですが、ビルドシステムとして非常に優秀なのでそれを伝えるだけのページです
date: 2025-07-14
category: linux
author: pineapplehunter
tag:
- nix
- linux
- darwin
---

# Nixのビルドシステムとしての優秀さについて語るだけのページ
多くのLinuxディストリビューションでのパッケージ作成は非常に難しい問題である。
ビルド手順をスクリプトにまとめる作業、またそのメンテナンスは骨の折れる作業である。

Nixでは関数型言語のアプローチを用いることでこれらの面倒な大部分を解消している。
このページではその仕組みについて紹介し、感想としてNixを触ってみようかと思ってもらえるようなものを目指している。

## Nixにおけるパッケージ（Derivation）について
[nix]ではパッケージに相当する（がより柔軟な）Derivationという単位を扱っている。
基本的な機能としてファイルやツールを入力としてとり、最終的なファイルやディレクトリ構造を出力する関数の機能を持つ。

`/nix/store`を覗いてみると、`/nix/store/94lg0shvsfc845zy8gnflvpqxxiyijbz-bash-interactive-5.2p37`のような名前が並んでいることが分かる。
先頭の一見ランダムな文字列はDerivationのハッシュである。
`-`以降はderivation名である。

更にNixでは主に2種類のDerivationが存在する。

- content-addressing derivation (Fixed output derivation)
- input-addressing derivation

https://nix.dev/manual/nix/2.29/store/derivation/outputs/index.html#types-of-output-addressing

これらの違いによりDerivationのパスに用いられるHashが決まっている。
この表現では長く分かりづらいため、この記事では特に前者を指す場合にfixed-derivation、後者をinput-addressing derivation もしくは単にderivationと呼ぶことにする。
どちらも基本的な機能としては類似しているため基本的に誤解はないと思われる。
また、nixのderivationのことをパッケージと呼ぶこともある。

この後の説明のためにそれぞれについて軽く解説する

## Fixed-derivation
この種類は、出力結果を固定することで入力をより柔軟にしたものである。
ネットワーク等の非決定論的な機能に依存することは構わないが、最終的な出力が固定されている。
最終的な出力のハッシュが一致しない場合をビルド失敗とすることで、どのようなシステムでもビルドが成功した場合にバイナリレベルで同一のファイルが生成されていることについて確信が持てる。
また、`/nix/store`のパスに使われているパスのハッシュにもファイルのハッシュが使われている

ここに擬似的なDerivationを書いてみた。


```nix
# `psuedoDerivation`は関数であり`attrset`(dictonary型のようなもの)を取りderivationを返す
psuedoDerivation {
  # derivationの名前
  name = "some-fixed-derivation";
  # 依存関係（curl等のダウンローダやコンパイラなど）
  deps = [ ... ];
  # ビルド手順（bashのスクリプトとして書かれる）
  build = ''
    # curlを使ったダウンロードなど
  '';
  # 最終的なファイルのハッシュ
  outputHash = "sha256-...";
}
```

このように素の状態でfixed-derivationを書くことを殆どないが、省略された形でネットからファイルをダウンロードしてくる関数としてfetchurlやfetchFromGitHubなどが使われている。
例として私の管理しているパッケージのソースをダウンロードしてくるfixed-derivationのリンクを乗せておく。

https://github.com/NixOS/nixpkgs/blob/650e572363c091045cdbc5b36b0f4c1f614d3058/pkgs/by-name/ci/circt/package.nix#L23-L29

outputHashのようなattributeについてはこちらにもう少し詳しく書かれている。

https://nix.dev/manual/nix/2.28/language/advanced-attributes#setting-the-derivation-type

### (input-addressing) derivation
この種類ではネットワークを筆頭とした非決定論的な機能を制限された環境でのビルドを強制している。
ビルド環境に提供されるのは事前にDerivationに書かれた依存関係のderivationやファイル、環境変数のみである。
`/nix/store`のパスに使われているパスは入力のderivationやビルド手順のハッシュで構成されている。
入力がすべて決定論的に記述されているため、すべてのderivationは決定論的である。

ここに擬似的なDerivationを書いてみた。


```nix
# `psuedoDerivation`は関数であり`attrset`(dictonary型のようなもの)を取りderivationを返す
psuedoDerivation {
  # derivationの名前
  name = "some-derivation";
  # パッケージのソースとなるファイル（基本的にfixed-derivationで構成されている）
  src = ...;
  # 依存関係（コンパイラなど）
  deps = [ gcc make ... ];
  # ビルド手順（bashのスクリプトとして書かれる）
  build = ''
    # makeを使ったビルドなど
  '';
}
```

Fixed-derivationと比べて`outputHash`がないことに注意してもらいたい。

簡略化された実装として[`stdenv.mkDerivation`](https://ryantm.github.io/nixpkgs/stdenv/stdenv/)や[`buildPythonPackage`](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/python.section.md#buildpythonpackage-function-buildpythonpackage-function)などがある。

### derivationの出力
記述されたderivationはnix-daemonによりビルドされる。その際にビルド環境のシェルには`$out`という変数が渡される。
`$out`はderivationの出力結果を保存する際のパスとして使用されている。
Nixのビルドシステムでmakeやcmake等を使用する場合は自動的に`--prefix`として`$out`が指定される。
独自のビルド方法を採用しているパッケージはマニュアルで`$out`にファイルを配置するという内容をビルドのスクリプトで指定する必要がある。

derivationについてより詳しくはこれらを参照してもらいたい。

- https://zenn.dev/asa1984/books/nix-hands-on/viewer/ch01-04-derivation
- https://nix.dev/manual/nix/2.22/language/derivations
- https://zero-to-nix.com/concepts/derivations/



## 再現可能なビルドの嬉しさ
ここでは任意の環境でパッケージをビルドする場合に考慮すべき事項をまとめることでNixの優位性について考える。
比較対象は次のとおりである。

- Ubuntu等の環境でmakeを使ったパッケージのビルド
- Dockerfile

|考えること| Nix|ubuntu+make|Dockerfile|
|--|--|--|--|
|URLからファイルをダウンロード方法|fixed-derivationで表現|curlなど|curlなど|
|ダウンロードされたファイルの同一性|hashで固定されているためファイルが変わっている場合ビルドエラー| ビルドスクリプトでダウンロードしている場合はハッシュ確認の追加の記述が必要| ビルドスクリプトでダウンロードしている場合はハッシュ確認の追加の記述が必要 |
|依存関係の追加|derivationを依存関係として追加|apt等で追加|apt等で追加|
|依存関係の同一性|derivationは決定論体なのでもととなるfixed-derivationが変わらない限り同一|Ubuntuのバージョン固定、パッケージのバージョン固定で実現できるが通常パッケージごとにOSのバージョンを合わせることは難しい|OSのバージョン、パッケージのバージョンを固定することで実現|
|依存関係のセキュリティパッチ|対象となるderivationのソースを固定し、その他パッケージは最新にすることで固定されたパッケージ以外のセキュリティパッチは適用済み|固定されたバージョン以降のセキュリティパッチは当たらない。|固定されたバージョン以降のセキュリティパッチは当たらない。|
|ビルドエラーの要因|ビルド用のスクリプトの記述ミス。ネットワークエラー（fixed-derivationの場合のみ）|ビルド用のスクリプトの記述ミス、ネットワークエラー、依存関係のバージョン違い、OSのバージョン違い、すでにインストール済みのパッケージとの競合、周辺機器の動作不良など|ビルド用のスクリプトの記述ミス、ネットワークエラー、依存関係のバージョン違い、OSのバージョン違い、すでにインストール済みのパッケージとの競合、周辺機器の動作不良など|

ここで特に注目してもらいたいのは「ビルドエラーの要因」の違いである。
Nixを使った場合ビルド用のスクリプトが間違っている以外の要因を排除しているのである。
そのため、問題が起きた際の原因究明が極端に簡単になる。

## Overlayの柔軟さ
ここで、nixのパッケージ管理の柔軟さの例として`overlay`に着目したい。
[nixpkgs]はnix言語で記述された非常に大きなソフトウェアライブラリだが、一つのパッケージに任意の変更を加えたい場合、や自分が新しくパッケージを一時的に追加したい場合にgithubからそのすべてをダウンロードしてきて編集するのは現実的ではない。

そこで、nixではoverlayという機能を採用している。
overlayとはこれまでに定義されているすべてのパッケージと_これから定義されるすべてのパッケージ_を引数にパッケージに変更を加えたり、パッケージを追加したりできる機能である。
_これから定義される_という表現は一見不思議かもしれないが、関数型言語のfix point operatorをイメージしてもらえば問題ない。

基本的にoverlayは次のような形で書かれている。

```nix
# final: 最終的なパッケージセット
# prev: overlayを適用する前のパッケージセット
my-overlay = final: prev: {
  # overlay適用前のopensslに対して編集を加える
  openssl = prev.openssl.override { ... };
  # カスタムパッケージの追加
  custom-package = ... some derivation definition ...;
}
```

このoverlayは次のように使える

```nix
pkgs = import nixpkgs { overlays = [ my-overlay ]; }
```

これで`pkgs.openssl`にアクセスするとパッチされたgccがビルドされ、`pkgs.custom-package`にアクセスすると独自のパッケージが追加される。また、興味深い点として、opensslにパッチをあてたことでopensslに依存しているすべてのderivationがパッチされたopensslを使用するようになることである。

これは、パッケージにカスタムのパッチを当てる場合や、まだnixpkgsにマージされていないPRのローカルでの適用が可能となる。

overlayについて詳しくはこちら参照してもらいたい。

https://wiki.nixos.org/wiki/Overlays

### セキュリティの観点から
この手法をセキュリティの観点から見ても非常にありがたいものである。
ここでは仮に`openssl`に問題が見つかったと仮定する。

Ubuntuのようなディストリビューションの場合opensslに依存するパッケージをすべて洗い出し、改めてビルドする必要がある。
また、ユーザーからすると、どのパッケージにパッチがあたっているのかいないのか判別がつきづらい。

Nixの場合依存関係はderivationで定義されている。
これを再帰的に遡ることで依存しているopensslのダウンロード元URL、ハッシュまで確認可能である。
よってユーザーからするとパッチがあたっているかいないか一目瞭然である。

## さいごに
Nixには他にも面白い機能が用意されているが、今回は割愛する。

NixのDerivationが記述されたファイルは初見での解読は難しいが、慣れてくると非常にシンプルなものである。
2種類のDerivationの仕組みさえ押さえておけば、ビルドスクリプトの内容も`$out`に成果物を配置するだけの単純なものに見えてくる。

[nixpkgs]を見ると非常に多くのパッケージのDerivationの記述例が見つかる。
ぜひそれを眺めながら、独自のパッケージのコントリビューションや、管理しているシステムの一部をNixを使って決定論的に構築してみるなど試してみてもらいたい。


[nixpkgs]: https://github.com/nixos/nixpkgs
[nix]: https://nixos.org/