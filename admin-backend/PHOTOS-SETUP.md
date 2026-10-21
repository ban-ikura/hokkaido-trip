# 写真投稿・管理者承認の有効化（Cloudflareダッシュボード）

この機能のコードはGitHubに準備済みです。**既存のお知らせ機能を残したまま**有効化します。
順番は **D1 → 非公開R2 → 生徒用Secret → Workerのコード更新 → 動作確認** です。

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

## 3. 生徒用の投稿コードをSecretで登録

同じWorkerの Settings → Runtime variables and secrets → Add variable。

- Type: **Secret**
- Key: **`STUDENT_UPLOAD_CODE`**
- Value: **ランダムな12文字以上の新しい文字列**

**ADMIN_PASSWORD（管理者用）やSESSION_SECRETとは別の文字列**にする。コードの中やGitHub、チャットには書かない。
管理者用の既存Secret **ADMIN_PASSWORD / SESSION_SECRET** はそのまま残す。

学生に共有するのは **写真ページのURLとSTUDENT_UPLOAD_CODEだけ**。
この共通コードは厳密な本人確認ではないため、学校の関係者だけに配布し、漏えい時は変更する。
悪用防止のためIPあたりの送信試行を1時間20回までに制限している。学校で同じネットワークを使う場合は複数人にこの制限が共有されることがある。

## 4. Workerのプログラムを更新

Workers & Pages → **hokkaido-trip-news-api** → Edit code。

GitHubの [src/index.js](src/index.js) のコード**全体**で、現在の `worker.js` を置き換えてDeploy。

*既存のWorkerを削除したり、別Workerを作成したりしない。*
お知らせAPI（GET/POST）とログインAPIの既存機能は保持される。

## 5. 動作確認（写真機能が未準備なら503が返る）

1. `https://hokkaido-trip-news-api.banse-oji.workers.dev/api/announcements` → 既存のお知らせが表示される。
2. `https://hokkaido-trip-news-api.banse-oji.workers.dev/api/photos` → `{"items":[]}`（まだ写真がない場合）。
3. `https://ban-ikura.github.io/hokkaido-trip/photos.html` → 生徒用コードで写真投稿。「承認待ち」になる。
4. `https://ban-ikura.github.io/hokkaido-trip/admin.html` → 既存の管理者共通パスワードでログイン → 「生徒の写真を承認」から承認。
5. `photos.html` を再読み込みして、**承認済みの写真だけ**表示されることを確認。
6. テスト写真を「掲載取り消し」したら一覧から消えることを確認。

**重要な運用上の注意**
- 公開サイトはURLを知る人以外にも閲覧可能。検索エンジン向けのnoindexはアクセス制御ではない。
- 未成年者が写る写真の公開には、学校の方針と本人等の許可を必ず確認する。
- 投稿者の本名、学籍情報、連絡先などは入力させない。
- 投稿写真はブラウザ側でリサイズしてメタデータを除去したWebP形式に変換し、サーバーでは追加のWebPチェックを行う。画像の内容そのものの安全性・著作権・個人情報は管理者が判断する必要がある。
- R2バケットは必ず非公開のままにする。公開・却下の判定はWorker経由でのみ行う。
- 承認後に掲載を取り消しても、すでに保存・撮影されたコピーまで削除できるわけではない。
