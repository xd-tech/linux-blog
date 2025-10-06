---
title: sudoはどのようにroot権限を得るのか(setuidについて)
description: Linuxではsetuidビットのついているファイルはroot権限で実行されるようにすることができる。調べていく中で直感的ではなかった部分についてまとめている。
date: 2025-10-06
category: linux
author: pineapplehunter
tag:
- sudo
- setuid
- linux
---
# sudoはどのようにroot権限を得るのか(setuidについて)
LinuxやMacOSでターミナルを使用する際にsudoを使ってrootの権限でプログラムを動かした経験のある人は多いと思うが、実際にsudoはどのように権限を得ているのか知らない人は多いのではないだろうか。
私もつい最近まで知らなかった上に想定していた挙動とは異なっていたため面白いと思いこの記事にまとめてみることにした。
今回は特にLinuxについてまとめている。

この記事ではLinuxを使ったファイル管理をしたことがあり、chmodやchown使ったことがあるような方を想定しています。

## sudoとは
sudoは、ほとんどのLinuxディストリビューションに含まれているプログラムで、他のプログラムをroot権限、または別のユーザーの権限として実行するために使用される。
例えば、`/etc/shadow`ファイルは一般にユーザーのパスワード情報が含まれており通常ユーザーには開けないようになっている。これは`ls`コマンドで確認できる。

```shell
$ ls -l /etc/shadow
-rw-r----- 1 root shadow 1905 Jan 28  2024 /etc/shadow
```

一般ユーザーがファイルの中身を確認しようとするとエラーが発生する。

```shell
$ cat /etc/shadow
cat: /etc/shadow: Permission denied
```

ここで、sudoを利用することで表示することができる。
(もちろんパスワードハッシュは適当なものです。)

```shell
$ sudo cat /etc/shadow
root:$y$j9T$PylXg4kwCAZ35taAL44TS1$y4zYlM4rScj0s3CFoqz2K27wgm7/n64yRPTxy/0xLB4:18659:0:99999:7:::
daemon:*:18659:0:99999:7:::
bin:*:18659:0:99999:7:::
sys:*:18659:0:99999:7:::
sync:*:18659:0:99999:7:::
...
```

sudoを使う際にはパスワードが求められることが多いと思います。

## Linuxではプロセスは途中からroot権限を得られない
では、sudoはどのようにユーザーのシェルからroot権限でプログラムを実行しているのでしょうか？
私は長い間パスワードを入力した際に何らかの仕組みでroot権限を取得しているものと思っていました。
しかし、**Linuxのユーザープロセスは実行中にroot権限を取得することはできません**。

もし途中から権限を取得できないとしたらいつroot権限を取得するのでしょうか？
実はsudoの実行開始時点からroot権限を取得しているのです。
Linuxではsetuidビットをファイルに付けることで実行ファイルを呼び出した時点からroot権限で動くような実行ファイルを作成することができるのです。

## setuidを使ったroot権限の取得
setuidビット(もしくはsuidビット)はファイルのメタデータに記録されている権限のビットで読み書き実行の権限(rwx)のように記録されています。
試しにsudoの実行ファイルを`ls`で確認してみると通常`x`ビットがついている位置に`s`が書かれていることがわかると思います。

```shell
$ ls -l /usr/bin/sudo
-rwsr-xr-x 1 root root 277936 Jun 25 21:42 /usr/bin/sudo*
```

setuidビットのついている実行ファイルは実行時に**所有者として実行されます**。
先程のsudoのファイルを見ると`root`にファイルが所有されているので`root`としてsudoが実行されます。
これは誰がこのファイルを実行しても`root`としてプログラムが実行されることを意味します。

なので権限取得のフローを見ると、次の図のようになっています。
（これを調べるまで私は青線のようにパスワード入力時点で権限が取得されると考えていました。）

![sudo binary gaining root priviledges on exec](/imgs/sudo.svg)

同様の機能がグループに対してもsetgidとして実装されています。


## どの様に保護しているのか 
この様に見ると何でもsetuidをつけてしまえば脆弱性の山になってしまうのではないかと思う人も居るのではないでしょうか？
実際、次のようなCプログラムを書いてsetuidビットをつけて動かすことでパスワード無しで任意のプログラムを動かせてしまいます。
（userという名前のユーザーが実行していると仮定しています。）

```shell
$ whoami # ユーザーとしてログインしていることを確認
user
$ cat main.c
#include <unistd.h>

int main(void) {
    setuid(0);
    execl("/bin/bash", "bash", NULL);
}
$ gcc main.c -o main
$ ./main # setuidがついていないのでuserとして実行される
(main shell)$ whoami
user
$ sudo chown root:root main
$ sudo chmod +s main
$ ./main # パスワード無しでrootのshellを立ち上げられる
(main shell)# whoami # root権限で動いていることを確認
root
```

この様に単純なプログラムでパスワードの入力を求められることなくsudo同様のことができるようなものが実装できてしまいます。
ただし、上記のコマンドの通りsetuidバイナリを作るためにroot権限が必要です。
実際Linuxではどの様な脅威モデルでこのファイルを管理しているのか見てみましょう。


### 脅威モデル
setuidは次のような脅威モデルで設計されています。

- 一般ユーザはsetuidバイナリを経由してのみ権限を増やすことができる（カーネルによる制約）
- 一般ユーザは任意のファイルのownerをrooかつsetuidバイナリにすることはできない（カーネルによる制約）
- setuidバイナリは実行される際に呼び出し元ユーザがこのまま実行してよいかポリシの確認する(setuidバイナリの実装依存)
- rootユーザは任意のバイナリをsetuidにすることやポリシの設定を変きる

つまり、**rootは何でもできます**。
また、一般ユーザはsetuidバイナリを作成できないので好き放題脆弱性が作れるわけではありません。
一般ユーザの権限で動いているバイナリがsudoを利用してroot権限を得ようとするケースについてもポリシを確認して、一般的にはパスワードを要求することで保護しています。

ただし、はポリシを回避して任意のコマンドが実行されてしまう脆弱性が発生してしまった際にはsudiバイナリの作成者に責任が言ってしまうので特に気をつけてプログラムの実装をする必要があります。
ポリシの設定についてはPAMが用いられることが多く、これによって様々なプログラムが別のポリシを利用してデバッグが困難になることを防いでいます。


### PAMによるポリシーの設定
Pluggable Authentication Modules for Linux(PAM)は主にLinuxのsetuidバイナリがポリシとして使用している実装です。
実際にsudoの設定を確認すると次のようになっています。PAMのポリシは主に4種類(account, auth, password, session)に分かれていますが、今回はauthに注目します。

```shell
$ cat /etc/pam.d/sudo
...
@include common-aut...

$ cat /etc/pam.d/commonuth
auth    [success=2 default=ignore]      pam_unix.so nullok
auth    [success=1 default=ignore]      pam_sss.so use_first_pass
auth    requisite                       pam_deny.so
auth    required                        pam_permit.so
auth    optional                        pam_cap.so
```

sudoのauthポリシは`common-auth`ファイルを参照しており、その中身を見ると上記の設定が書かれています。
（見やすくするためにコマンド等は消しています。）
軽くポリシについて解説します。
ここで`common-auth`の一行目を見ると`pam_unix.so`と書かれています。
`pam_unix`はunixパスワードを求めるポリシで正しいパスワードが入力されると`[success=2 ...]`の記載によって2つポリシをスキップし`pam_permit.so`が実行されています。
`pam_permit.so`は無条件でポリシのチェックが成功するものとなっています。
他のポリシについての説明は省略しますが、チェックに失敗した場合は`pam_deny.so`が適用されることでポリシが失敗したということがわかります。

sudoは起動時にsudoのポリシを読み込み、これが達成されるか確認してからユーザの指定したプログラムを実行します。


## 他のsetuidプログラム

Ubuntuでは他に次のようなファイルがsetuidを持っています。

```shell
$ find /usr/bin -type f -perm -4000 -ls 2>/dev/nushll
... -rwsr-sr-x ... /usr/bin/lpq
... -rwsr-sr-x ... /usr/bin/lpr
... -rwsr-xr-x ... /usr/bin/pkexec
... -rwsr-xr-x ... /usr/bin/mount
... -rwsr-xr-x ... /usr/bin/su
... -rwsr-xr-x ... /usr/bin/umount
... -rwsr-xr-x ... /usr/binudo
... -rwsr-xr-x ... /usr/bin/chsh
... -rwsr-xr-x ... /usr/bin/fusermount
... -rwsr-xr-x ... /usr/bin/gpawd
... -rwsr-xr-x ... /usr/bin/chfn
... -rwsr-xr-x ... /usr/bin/passwd
... -rwsr-xr-x ... /usr/bin/newgrp
... -rwsr-sr-x ... /usr/bin/lprm
```

これらのプログラムは実行時点からrootになるので特に脆弱性に目を光らせておく必要があります。


## ファイルシステムで追加保護について考える
誤ったプログラムにrootを渡してしまった場合、そのプロセスによってsuidバイナリが新たに作られてそれが脆弱性として使われてしまうことが考えられます。
このようなことが発生した際に被害を最小限に留めるためにホームを別のパーティションに設定している場合、/homeのファイルシステムを`nosuid`オプションをつけてマウントすることができます。
こうすることで/homeに作られたsetuidバイナリは機能しなくなります。
**これを`/`に適用するとsudoも動かなくなるので注意してください！**

ちなみに、私の利用しているNixOSの環境ではsetuidバイナリは/run/wrapper/binに別のファイルシステムとしてマウントされているため、`/`から全て`nosuid`に設定しています。


## まとめ
この記事でsudoが権限を得る過程について理解する方が増えると嬉しいです。
PAMについても指紋認証や顔認証を加えることができるなどかなり柔軟に設定ができて非常に面白いので調べてみると良いと思います。
（設定を間違えると悲惨ですが。）
