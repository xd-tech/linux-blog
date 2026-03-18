---
title: Linuxの仮想マシンでWindows11を動かす(NixOS編)
description: NixOSでもWindowsを動かしたい
date: 2026-03-17
author: pineapplehunter
tag:
  - nixos
  - linux
  - windows
  - virtual machine
---
# Linuxの仮想マシンでWindows11を動かす(NixOS編)

## Linux上でWindowsを動かしたい
Linuxは近年の多くの開発者によってかなり快適に使えるようになりましたが、いくつか重要なソフトウェアが使えないのが現状です。
特に**Microsoft Office**や**Photoshop**は欲しい方が多いのではないでしょうか。

その問題を解決するために、**Linux上の仮想マシンでWindowsを動かす**方法があります。Linuxでは様々な仮想マシンを立ち上げる技術が定着していますが、実はWindowsを動かす場合は少し厄介な点があります。**UEFI**と**TPM**が必須であるという点です。

この記事ではある程度直感的にWindowsを立ち上げるまでの手順について説明します。
今回はLinuxの中でもNixOSをベースに説明していきます。
段階的に必要なものを紹介したあとに必要なコードの全体を乗せておきます。

## 環境設定
このセクションではNixOSでWindowsを動かすための仮想環境の設定方法について書きます。

![全体像](/imgs/win-virt-nixos/virt-win.drawio.svg)

### libvirtとvirt-manager
仮想環境を立ち上げるには複数のやり方がありますが、この記事ではlibvirtとvirt-managerを使ったやり方について解説します。
libvirtはqemuをバックエンドとして動作する仮想化プラットフォームで、virt-managerはlibvirtを操作するためのGUI画面です。
KVMが有効化されているPCでは自動でKVMが活用されます。

![仮想マシンの概要](/imgs/win-virt-nixos/libvirt.drawio.svg)

NixOSでlibvirtとvirt-managerを有効化するには次のオプションを有効化します。

```nix
{
    virtualisation.libvirtd.enable = true;
    programs.virt-manager.enable = true;
}
```

NixOS Wikiにもセットアップ方法について書かれています。
https://wiki.nixos.org/wiki/Virt-manager

### 仮想マシンのTPMの有効化
仮想マシンでTPMのエミュレーションをするために[swtpm]というソフトウェアがあります。
これを仮想マシンに使用させることでWindowsを起動させることができます。

```nix
{
    virtualisation.libvirtd.qemu.swtpm.enable = true;
}
```

[swtpm]: https://github.com/stefanberger/swtpm

### ネットワーク設定
デフォルトではvirt-managerのネットワークはFirewallによってブロックされてしまいます。そこで次のオプションを有効化してネットワークの制限を解除します。

```nix
{
    networking.firewall.trustedInterfaces = [ "virbr0" ];
}
```

### 再起動後の挙動の設定(オプション)
libvirtではデフォルトでホストの再起動の際に自動的に仮想マシンのスナップショットを作成し、起動が完了した時点で復元、実行します。

![勝手に仮想マシンを復元・実行してしまう図](/imgs/win-virt-nixos/reboot.drawio.svg)

常に仮想マシンが実行されるということは良いのですが、virt-managerを起動するまで裏で動いていることに気が付かず、リソースを食っていたことがあります。

```nix
{
    virtualisation.libvirtd.onBoot = "ignore";
}
```

![勝手に仮想マシンを復元させない](/imgs/win-virt-nixos/no-reboot.drawio.svg)


### 設定の全体像
必要な設定は以上です。これらを有効にして次のステップに進みましょう。

```nix
{
    virtualisation.libvirtd = {
        # libvirtの有効化
        enable = true;
        # swtpmを使用
        qemu.swtpm.enable = true;
        # ホストの起動時に自動でゲストを起動しない(optional)
        onBoot = "ignore";
    };
    # virt-managerを有効化
    programs.virt-manager.enable = true;
    # libvirtの使うネットワークのFirewall解除
    networking.firewall.trustedInterfaces = [ "virbr0" ];
}
```

設定ファイルを書き込んだら`nixos-rebuild`しましょう。

## Windowsのインストール

### Windows ISOの入手
現状Windows11のISOは公式サイトからダウンロードできます。
インストールメディアではなくISOを選択します。

https://www.microsoft.com/en-us/software-download/windows11

### 仮想マシンの設定
ダウンロードが完了したらvirt-managerを起動して仮想マシンのセットアップを進めていきます。
起動時にパスワードを求められるかもしれません。

1. `Create a new virtual machine`を選択して`Local install media`を選択。
2. メディアの選択では`Browse` → `Browse Local`からダウンロードしたISO選択して進む
3. 適当なメモリサイズとCPUを選択して進む
4. 適当なディスクサイズを選んで進む
5. **Customize configuration before install**にチェックを入れて進む

ここで設定が正しく反映されていることを確認します。

### UEFI設定
Windowsを起動するためにはUEFIが必要になります。概要画面から正しく選択されていることを確認しましょう。

![UEFIの設定](/imgs/win-virt-nixos/uefi.webp)

### CPU設定
libvirtではデフォルトでCPUのコアがそれぞれ別のソケットに接続されているとしてトポロジーが構成されています。
Linuxの場合問題ないのですがWindowsでは正しく認識しないので手動で設定してSocketsの内容をCoresに移しましょう。


![CPUの設定](/imgs/win-virt-nixos/cpu.webp)

### TPM設定
最後に起動に必要なTPMの設定をしておきましょう。
どの種類でも起動するかとは思うのですが、モダンなTPM2.0を設定しておくと無難でしょう。

![TPMの設定](/imgs/win-virt-nixos/tpm.webp)

### 起動と設定
あとは`Begin installation`を押して進めるだけで設定は完了するはずです。

![インストール完了](/imgs/win-virt-nixos/installed.webp)

## インストール後の設定
### Microsoftアカウント無しで起動
他の記事で多く取り上げられているので省略します。

手順としてネットワークを切断したい場合、virt-managerのNICのLink stateを切った状態で起動することでネットワークがないように認識させることができます。

### ゲストドライバのインストール
こちらのウェブサイトの`Guest → Windows binaries`の文中にある`spice-guest-tools`をダウンロードしてインストールします。
ディスプレイドライバが設定されることでウインドウのリサイズに応じてディスプレイのサイズ変更をしてくれるようになります。

https://www.spice-space.org/download.html

## Q&A
### ライセンス無しで動くのか
数年使っていますが全く問題なく使えています。

### 仮想マシンからネットに繋がらない
私はVPNに繋いでいる際にこの問題に遭遇しました。
単純にVPNを切ることで解決はできましたが、他の解決策はあると思います。
(ネットワークのルーティングテーブル周りの仕様が影響しているはず)


## まとめ
これでNixOSでWindowsを動かすことができたかと思います。