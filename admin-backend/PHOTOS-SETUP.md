# 写真投稿・管理者承認の有効化（Cloudflareダッシュボード）

この機能のコードはGitHubに準備済みです。**既存のお知らせ機能を残したまま**有効化します。
順番は **D1 → 非公開R2 → Turnstile → Workerのコード更新 → 動作確認** です。
**生徒用の投稿コードは不要です。**

## 1. 既存D1に写真テーブルを追加

Cloudflare → Storage & databases → D1 → **hokkaido-trip-news** → Console を開く。

GitHubの [photos-schema.sql](photos-schema.sql) の**全SQL**を実行する。
既存の `announcements` と `login_attempts` は変更・削除しない。

## 2. 非公開R2バケットを作成

Cloudflare → R2 Object Storage → **Create bucket**。

- バケット名: `hokkaido-trip-photos`
- **Public URL / r2.dev / Custom Domains は有効にしない。**
- 初期状態の **Private** のまま使用する。

Workers & Pages → 既存Worker **hokkaido-trip-news-api** → Settings → Bindings → Add binding → R2 bucket。

- Variable name (Key): **`PHOTOS`**
- R2 bucket: **`hokkaido-trip-photos`**

大文字小文字を含めて名前を一致させて保存する。

## 3. Cloudflare Turnstileで自動投稿を防ぐ（生徒用コードなし）

**Cloudflareダッシュボード → Turnstile → Add widget / Create widget**。

- 表示名：`hokkaido-trip-photos`（好きな名前でも構いません）
- 対象Hostname：**`ban-ikura.github.io`**（`/hokkaido-trip` のようなパスは不要）
- ウィジェットの種類：**Managed（推奨）**
- 作成後の**Site key（公開キー）**と**Secret key（秘密キー）**を区別する

Site keyは公開してよいものです。GitHubの **[../photos-config.js](../photos-config.js)** の
`window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY = '';`
の空欄に **Site keyだけ** を入力してGitHubに保存します。

Secret key は絶対にGitHubやチャットに書かないでください。
同じWorkerの Settings → Runtime variables and secrets → Add variable から登録します。

- Type：**Secret**
- Key：**`TURNSTILE_SECRET`**
- Value：先ほどの **Secret key**

既存の **ADMIN_PASSWORD / SESSION_SECRET** は**変更不要**です。
写真は生徒用コード無しで送信できますが、毎回Cloudflareの安全確認を通過する必要があります。
バックエンドはTurnstileのSiteverifyで成功／hostname／actionを検証します。
IPごとの送信上限（1時間20回）も残しています。学校Wi-Fiでは複数の生徒に同じ上限が適用されることがあります。
**投稿の身元を特定するものではなく、写真の内容は管理者が審査する必要があります。**

## 4. Workerのプログラムを更新

Workers & Pages → **hokkaido-trip-news-api** → Edit code。

GitHubの [src/index.js](src/index.js) のコード**全体**で、現在の `worker.js` を置き換えてDeploy。

*既存のWorkerを削除したり、別Workerを作成したりしない。*
お知らせAPI（GET/POST）とログインAPIの既存機能は保持される。

## 5. 動作確認（写真機能が未準備なら503が返る）

1. `https://hokkaido-trip-news-api.banse-oji.workers.dev/api/announcements` → 既存のお知らせが表示される。
2. `https://hokkaido-trip-news-api.banse-oji.workers.dev/api/photos` → `{"items":[]}`（まだ写真がない場合）。
3. `https://ban-ikura.github.io/hokkaido-trip/photos.html` → コードを入力せず、Turnstileの安全確認後に写真投稿。「承認待ち」になる。
4. `https://ban-ikura.github.io/hokkaido-trip/admin.html` → 既存の管理者共通パスワードでログイン → 「生徒の写真を承認」から承認。
5. `photos.html` を再読み込みして、**承認済みの写真だけ**表示されることを確認。
6. テスト写真を「掲載取り消し」したら一覧から消えることを確認。

**投稿ルール／重要な運用上の注意**
- 公開サイトはURLを知る人以外にも閲覧可能。検索エンジン向けのnoindexはアクセス制御ではない。
- **顔が写っている写真は一切投稿・承認しない。** 自撮り・集合写真・鏡や窓の反射も同様。
- 名札、制服で本人を特定できるもの、氏名、学生証、連絡先、住所、部屋番号、車のナンバーなどの個人情報を掲載しない。
- いじめ、差別、誹謗中傷、無断撮影、危険・迷惑行為、他人の写真の無断転載、著作権侵害は投稿禁止。
- **顔の自動検出機能はありません。** 管理者は承認前に写真とコメントを1件ずつ確認する。
- 投稿者の本名、学籍情報、連絡先などは入力させない。
- 投稿写真はブラウザ側でリサイズしてメタデータを除去したWebP形式に変換し、サーバーでは追加のWebPチェックを行う。画像の内容そのものの安全性・著作権・個人情報は管理者が判断する必要がある。
- R2バケットは必ず非公開のままにする。公開・却下の判定はWorker経由でのみ行う。
- 承認後に掲載を取り消しても、すでに保存・撮影されたコピーまで削除できるわけではない。
