[![Netlify Status](https://api.netlify.com/api/v1/badges/82b06f1b-59f6-4a77-9741-f5983e94ad10/deploy-status)](https://app.netlify.com/sites/students-tech-blog/deploys)

# Linux のブログを書こうかなと思っているところ

## 実行方法

### localhostで実行する
#### nixを使った方法

```shell
$ nix run
vitepress v1.0.0-rc.24

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### 通常のbunを使った手法
次のコマンドで依存関係をインストールする
```bash
$ bun install
```
次のコマンドでdevサーバーをローカルで立ち上げる
```bash
$ bun dev
```
この状態で`page`に好きな`markdown`を追加して[localhost:5173](http://localhost:5173)にアクセスすればページが反映されてる

### web上にアップロードしてあるサイト
https://students-tech.blog
