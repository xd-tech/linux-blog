---
title: Nixを使って簡単クロスコンパイル！
description: クロスコンパイルもクロスコンパイラのビルドもこれで一発
date: 2025-3-10
author: pineapplehunter
category: compile
tag:
  - nix
  - cross compile
---

# Nix を使って簡単クロスコンパイル！

クロスコンパイルもクロスコンパイラのビルドもこれで一発

## TL;DR

aarch64 向けの curl のビルドを例にすると...

nixpkgs に含まれているパッケージのクロスコンパイルがしたい！

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.curl
$ file ./result-bin/bin/curl
./result-bin/bin/curl: ELF ..., ARM aarch64, ..., dynamically linked, ...
```

静的リンクされていないと困る！

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.pkgsStatic.curl
$ file ./result-bin/bin/curl
./result-bin/bin/curl: ELF ..., ARM aarch64, ..., statically linked, ...
```

クロスコンパイラがほしい！

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.buildPackages.gcc
$ ./result/bin/aarch64-unknown-linux-gnu-gcc --version
aarch64-unknown-linux-gnu-gcc (GCC) 14.2.1 20241116
```

静的リンク用のクロスコンパイラがほしい！

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.pkgsStatic.buildPackages.gcc
$ ./result/bin/aarch64-unknown-linux-musl-gcc --version
aarch64-unknown-linux-musl-gcc (GCC) 14.2.1 20241116
```

さらに binfmt を使うとローカルで別のアーキテクチャのプログラムを楽に動かせる！

詳しくは[こちら](https://nixos.org/manual/nixpkgs/stable/#chap-cross)!

:::info
nix は flakes 機能を有効にしておく必要があります。
:::

## クロスコンパイルとは

現在使用している PC のアーキテクチャとは異なるアーキテクチャへプログラムをコンパイルすることを指します。例えば、私のノートパソコン(x86_64)から Raspberry PI(aarch64)にコンパイルするというようなことですね。

クロスコンパイルをしたいケース:

- 作っているパッケージを複数のプラットフォーム向けに配布したい
- 動かしたい対象の CPU が非力なのでより強力な CPU でコンパイルしたい

ちなみに別のアーキテクチャの仮想マシンを立ち上げてコンパイルすることとは異なります。コンパイラは現在のアーキテクチャで動作し、コンパイラの出力結果が別のアーキテクチャを対象になっています。

このように一つの PC から様々なアーキテクチャを対象にコンパイルすることができるとても強力な手法です！

## クロスコンパイルの苦労

しかし、クロスコンパイルを行う手順はかなり複雑です。

例として`hello.c`というソースがあったとして、通常のコンパイルとクロスコンパイルを比較してみてみましょう。コンパイラをインストールするところから実行するところまでを書いています。

**通常のコンパイルの場合:**

1. gcc のインストール
2. `gcc -o hello hello.c`
3. `./hello`の実行！

**クロスコンパイルの場合:**

1. gcc のインストール
2. クロスコンパイラのインストール（もしくはビルド）
3. `xxx-yyy-zzz-gcc -o hello hello.c`
4. コンパイルされた`hello`を動かすデバイスに移動
5. `hello`の実行！

手順が少し増えただけのように見えるかもしれませんが、複数のコンパイラの管理と、デバイス間のファイルの移動が入るだけで圧倒的にデバッグが大変になります。また、クロスコンパイラのビルドはかなり時間がかかるので、ステップ 2 で諦めたくなることがあります。

## Nix を使ってクロスコンパイル!

では、Nix を使って curl を x86_64 マシンから aarch64 にクロスコンパイルをする例を見てみましょう。

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.curl
$ file ./result-bin/bin/curl
./result-bin/bin/curl: ELF ..., ARM aarch64, ..., dynamically linked, ...
```

簡単ですね！

:::warning
パッケージによってはかなり時間がかかるかもしれません。
:::

### 解説

nix は nixpkgs という巨大なパッケージのレポジトリを持っています。
この中からパッケージのビルドを行うには次のようなコマンドを実行します。

```shell
$ nix build nixpkgs#curl
```

これは`nixpkgs`のリポジトリの`curl`をビルドすることに相当します。

では、クロスコンパイルの際のコマンドを見ると`curl`の前に`pkgsCross.aarch64-multiplatform`がついています。
`pkgsCross`のあとに対象としたいアーキテクチャを書くことで nixpkgs のパッケージをビルドする際の設定を編集し、すべてのパッケージを`aarch64-linux`を対象にビルドするように変更します。

pkgsCross の次にかけるアーキテクチャの例としては次のものがあります。
|名前|アーキテクチャと OS|
|-|-|
|gnu64| よく見かける x86_64-linux。intel、AMD など|
|aarch64-multiplatform| aarch64-linux。ラズパイやスマートフォンなど|
|aarch64-darwin|最近の Apple silicon Mac。Linux からだとビルドできない|
|riscv64|RISC-V 64GC の Linux 向け。RISC-V はいいぞ|

他のアーキテクチャの例 ↓
::: details

```shell
$ nix repl
Nix 2.25.5
Type :? for help.
nix-repl> :l <nixpkgs>
Added 23988 variables.

nix-repl> pkgsCross. <TAB>
pkgsCross.aarch64-android             pkgsCross.mmix
pkgsCross.aarch64-android-prebuilt    pkgsCross.msp430
pkgsCross.aarch64-darwin              pkgsCross.musl-power
pkgsCross.aarch64-embedded            pkgsCross.musl32
pkgsCross.aarch64-freebsd             pkgsCross.musl64
pkgsCross.aarch64-multiplatform       pkgsCross.muslpi
pkgsCross.aarch64-multiplatform-musl  pkgsCross.or1k
pkgsCross.aarch64be-embedded          pkgsCross.pogoplug4
pkgsCross.arm-embedded                pkgsCross.powernv
pkgsCross.armhf-embedded              pkgsCross.ppc-embedded
pkgsCross.armv7a-android-prebuilt     pkgsCross.ppc64
pkgsCross.armv7l-hf-multiplatform     pkgsCross.ppc64-musl
pkgsCross.avr                         pkgsCross.ppcle-embedded
pkgsCross.ben-nanonote                pkgsCross.raspberryPi
pkgsCross.bluefield2                  pkgsCross.remarkable1
pkgsCross.fuloongminipc               pkgsCross.remarkable2
pkgsCross.ghcjs                       pkgsCross.riscv32
pkgsCross.gnu32                       pkgsCross.riscv32-embedded
pkgsCross.gnu64                       pkgsCross.riscv64
pkgsCross.gnu64_simplekernel          pkgsCross.riscv64-embedded
pkgsCross.i686-embedded               pkgsCross.rx-embedded
pkgsCross.iphone32                    pkgsCross.s390
pkgsCross.iphone32-simulator          pkgsCross.s390x
pkgsCross.iphone64                    pkgsCross.sheevaplug
pkgsCross.iphone64-simulator          pkgsCross.ucrt64
pkgsCross.loongarch64-linux           pkgsCross.ucrtAarch64
pkgsCross.m68k                        pkgsCross.vc4
pkgsCross.microblaze-embedded         pkgsCross.wasi32
pkgsCross.mingw32                     pkgsCross.wasm32-unknown-none
pkgsCross.mingwW64                    pkgsCross.x86_64-darwin
pkgsCross.mips-embedded               pkgsCross.x86_64-embedded
pkgsCross.mips-linux-gnu              pkgsCross.x86_64-freebsd
pkgsCross.mips64-embedded             pkgsCross.x86_64-netbsd
pkgsCross.mips64-linux-gnuabi64       pkgsCross.x86_64-netbsd-llvm
pkgsCross.mips64-linux-gnuabin32      pkgsCross.x86_64-openbsd
pkgsCross.mips64el-linux-gnuabi64     pkgsCross.x86_64-unknown-redox
pkgsCross.mips64el-linux-gnuabin32
pkgsCross.mipsel-linux-gnu
```

:::

## クロスコンパイラのコンパイル

例えば x86_64 から aarch64 にコンパイルするコンパイラがほしいとします。
先程の方法で gcc をコンパイルすると、aarch64 で aarch64 のコンパイルをするコンパイラがビルドされます。
これでは x86_64 で使えませんね。

そこで次の方法でビルドを行います。

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.buildPackages.gcc
$ ./result/bin/aarch64-unknown-linux-gnu-gcc --version
aarch64-unknown-linux-gnu-gcc (GCC) 14.2.1 20241116
```

先程のコマンドに`buildPackages`が追加されていますね。これで**aarch64 向けにビルドするため**のパッケージがほしいと指示できます。便利ですね。

このようにビルドするマシンで使用するが、別のデバイスを対象にしたいという場合には`buildPackages`が有用です。

このようなパッケージで使うことが多いかと思います。

- gcc
- rustc
- gdb

## 静的リンク

これまでの紹介したクロスコンパイルの手法の場合、出力されたバイナリが他のパッケージに依存することがあります。
例として aarch64-linux 向けにビルドした curl を見てみるとこのようなライブラリに依存しています。

(ちなみにここで使用している ldd は glibc を aarch64 向けに nix でクロスコンパイルしたものです。早速便利ですね。)

```
$ ldd ./result-bin/bin/curl
  linux-vdso.so.1 (0x00007f1f7503c000)
  libcurl.so.4 => /nix/store/jqcg2x2b16rz35ymq3p2jf53aq7axzgv-curl-aarch64-unknown-linux-gnu-8.12.0/lib/libcurl.so.4 (0x00007f1f73260000)
  libnghttp2.so.14 => /nix/store/9sn36a31ilv694lr7snnvq8bydqy9f5p-nghttp2-aarch64-unknown-linux-gnu-1.64.0-lib/lib/libnghttp2.so.14 (0x00007f1f73210000)
  libidn2.so.0 => /nix/store/04v1aibhprclps2qmhnhcp8sc0hbm677-libidn2-aarch64-unknown-linux-gnu-2.3.7/lib/libidn2.so.0 (0x00007f1f731b0000)
  libssh2.so.1 => /nix/store/kdycxqij3r0rp7sqin46fyygyvziqmbl-libssh2-aarch64-unknown-linux-gnu-1.11.1/lib/libssh2.so.1 (0x00007f1f73140000)
  libpsl.so.5 => /nix/store/b8mpjii2i7g10arv16nwxf3r0ic3jmmp-libpsl-aarch64-unknown-linux-gnu-0.21.5/lib/libpsl.so.5 (0x00007f1f73100000)
  libssl.so.3 => /nix/store/dl48472i2cp1vjm46smj407frhagy8kl-openssl-aarch64-unknown-linux-gnu-3.4.1/lib/libssl.so.3 (0x00007f1f72fe0000)
  libcrypto.so.3 => /nix/store/dl48472i2cp1vjm46smj407frhagy8kl-openssl-aarch64-unknown-linux-gnu-3.4.1/lib/libcrypto.so.3 (0x00007f1f72b30000)
  libgssapi_krb5.so.2 => /nix/store/34pr9bcimq69dd2rivajphlljrmxzlgm-krb5-aarch64-unknown-linux-gnu-1.21.3-lib/lib/libgssapi_krb5.so.2 (0x00007f1f72ab0000)
  libzstd.so.1 => /nix/store/87q2938j2f7l8b51w67djq082gzjvvdg-zstd-aarch64-unknown-linux-gnu-1.5.6/lib/libzstd.so.1 (0x00007f1f729d0000)
  libbrotlidec.so.1 => /nix/store/9ljbp2cx2kxi7w28diyqkmmprrzm24dc-brotli-aarch64-unknown-linux-gnu-1.1.0-lib/lib/libbrotlidec.so.1 (0x00007f1f729a0000)
  libz.so.1 => /nix/store/qps189byprd9cg5nkm97qqkcrixgg5b8-zlib-aarch64-unknown-linux-gnu-1.3.1/lib/libz.so.1 (0x00007f1f72960000)
  ...
```

これを別のデバイスで動かす場合は、この依存関係とそれぞれの依存関係の依存関係と、またその依存関係と...をインストールする必要があり、大変です。

そこで静的リンクをしてみましょう。`pkgsStatic`を追加することで実現できます。

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.pkgsStatic.curl
$ file ./result-bin/bin/curl
./result-bin/bin/curl: ELF ..., ARM aarch64, ..., statically linked, ...
```

依存しているライブラリを見ると...

```shell
$ ldd ./result-1-bin/bin/curl
  not a dynamic executable
```

依存しているライブラリが一切なくスッキリしていますね。これで成果物のバイナリをコピーするだけで対象のマシンで動かすことができます。

クロスコンパイラも同様にビルドできます。

```shell
$ nix build nixpkgs#pkgsCross.aarch64-multiplatform.pkgsStatic.buildPackages.gcc
$ ./result/bin/aarch64-unknown-linux-musl-gcc --version
aarch64-unknown-linux-musl-gcc (GCC) 14.2.1 20241116
```

## build,host,target の違い

nix では stdenv にビルドをする際のアーキテクチャの情報が記載されています。
stdenv を覗いてみると`buildPlatform`, `hostPlatform`, `targetPlatform`が定義されていることが確認できます。
それぞれのプラットフォームは次の意味を持ちます。

| プラットフォーム | 意味                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| buildPlatform    | ビルドをするマシンのアーキテクチャ情報。これまでの例だと x86_64-linux                                   |
| hostPlatform     | 実際に動かすマシンのアーキテクチャ情報。これまでの例の場合 aarch64-linux                                |
| targetPlatform   | クロスコンパイラのみで使用。hostPlatform で動かうコンパイラの出力するバイナリのターゲットアーキテクチャ |

また、これまでのビルドコマンドは次のように対応しています。(OS は省略しています)

| コマンド                                  | buildPlatform | hostPlatform | targetPlatform | 成果物の説明                                       |
| ----------------------------------------- | :-----------: | :----------: | :------------: | -------------------------------------------------- |
| curl                                      |    x86_64     |    x86_64    |   (関係なし)   | x86_64 で動く curl                                 |
| pkgsCross.aarch64-multiplatform.curl      |    x86_64     |   aarch64    |   (関係なし)   | aarch64 で動く curl                                |
| gcc                                       |    x86_64     |    x86_64    |     x86_64     | x86_64 -> x86_64 の gcc を x86_64 でコンパイル     |
| pkgsCross.aarch64-linux.gcc               |    x86_64     |   aarch64    |    aarch64     | aarch64 -> aarch64 の gcc を x86_64 でコンパイル   |
| pkgsCross.aarch64-linux.buildPackages.gcc |    x86_64     |    x86_64    |    aarch64     | **x86_64 -> aarch64**の gcc を x86_64 でコンパイル |

## コンパイルされたバイナリを動かしてみる(binfmt)

最後に成果物をローカルで動かしてみましょう。qemu をインストールして次のコマンドを試してみましょう。

```shell
$ qemu-aarch64 ./result-bin/bin/curl --version
curl 8.12.0 (aarch64-unknown-linux-musl) ...
...
```

このように x86_64 マシン上で aarch64 のバイナリを動かすことができました！
NixOS を使っているユーザーはさらにこれを binfmt と呼ばれる場所に登録をする config をこのようにつけられます。

```nix
{ ... }: {
  boot.binfmt.emulatedSystems = [ "aarch64-linux" ];
}
```

こうすると、qemu をつけることなくこのように実行できるようになります。

```shell
$ ./result-bin/bin/curl --version
curl 8.12.0 (aarch64-unknown-linux-musl) ...
...
```

便利ですね。他のアーキテクチャでも可能ですが少し面倒です。

## 余談(overlay と併用)

nix には overlay という機能があり、あるパッケージを override するとそのパッケージに依存するすべてのパッケージが override されたパッケージに依存するように変更され、自動で再ビルドが必要なパッケージのビルドを行ってくれます。

私は以前に古い Arm チップ向けに上記方法でクロスコンパイルを行い、ソフトウェアを動かそうとしていました。そこで、何故かとあるシステムコールが正しく機能していないことがわかり、その対応のために musl を編集する必要があることがわかりました。

そこでパッチをあてた musl を overlay に設定したところ、Rust 製のパッケージだったのですが、**musl→musl-gcc→rustc→ 目的のパッケージ**と自動でコンパイルが行われ感動しました。もちろん正しくパッチがあてられていました。

## まとめ

この記事ではクロスコンパイルの仕方やクロスコンパイラのコンパイルの仕方、binfmt の設定などについて解説をしました。
より詳しい内容については nixpkgs のドキュメントの cross compile のセクションに書いてあるので確認してみてください。
[Nixpkgs Reference Manual - Cross-compilation](https://nixos.org/manual/nixpkgs/stable/#chap-cross)
