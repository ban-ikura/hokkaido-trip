# 管理者共通パスワード・お知らせ投稿機能の有効化

## 状態
サイトには [admin.html](../admin.html)（お知らせ新規投稿のみ）を追加済みです。
**認証／保存サーバーを未接続のため、ログインはまだ利用できません。**
このフォルダーにある Cloudflare Worker + D1 を管理担当者が一度だけ設定すると使えます。

## なぜ外部サーバーが必要？
GitHub Pages は静的サイトのため、HTML／JavaScriptだけでは安全なパスワード検証もお知らせ保存もできません。
共通パスワードは Cloudflare Workers の **Secret** として非公開で保存します。
**パスワードをこのリポジトリやChatGPTなどのチャットに貼り付けないでください。**

## 初期設定（管理担当者のみ）

Cloudflare アカウントと Node.js が必要です。作業ディレクトリはこの `admin-backend` フォルダーです。

1. `npx wrangler login` でCloudflareにログイン。
2. `npx wrangler d1 create hokkaido-trip-news` でデータベースを作成。
3. 画面に表示される UUID を `wrangler.toml` の `database_id` に設定。**UUIDはパスワードではありません**。
4. `npx wrangler d1 execute hokkaido-trip-news --remote --file=./schema.sql` でテーブル作成。
5. `npx wrangler deploy` で Worker を作成。
6. `npx wrangler secret put ADMIN_PASSWORD` に、共有する **12文字以上の強力なパスワード**を設定。
7. `npx wrangler secret put SESSION_SECRET` に、管理者パスワードとは別のランダムな **32文字以上**の署名キーを設定。これも非公開。
8. `npx wrangler deploy` を再実行し、発行された `https://...workers.dev` のURLを控える。
9. ルートの `admin-config.js` の URL だけを以下のように変更（パスワードは絶対に書かない）。

```js
window.HOKKAIDO_NEWS_API_URL = 'https://発行されたワーカー名.アカウント名.workers.dev';
```

10. GitHub Pages の公開完了後に `/admin.html` へアクセスし、ログインとテスト投稿を確認。
    公開トップページの「お知らせ」から投稿内容を確認。
    `admin-config.js` の更新がブラウザに反映されない場合はキャッシュを更新してください。

Worker のURL以外のリソースや権限をブラウザで設定する必要はありません。
`workers.dev` 以外の独自ドメインを使用する場合は、`admin.html` と `index.html` の CSP `connect-src` にその HTTPS ドメインを追加してください。

## 管理者ができること
- 共通パスワードでログイン（2時間有効、ページを閉じるとログイン状態は破棄）
- **新しいお知らせを追加することだけ**
- タイトル2〜120文字、本文1〜1500文字、重要フラグ
- 投稿は自動的に日本時間の日付となり、トップページの最新表示・過去履歴へ追加

**できないこと**：投稿後の編集、削除、行程表変更、持ち物一覧変更、パスワード変更、ユーザー管理。
Worker のAPIにも `PUT`、`PATCH`、`DELETE` 操作は実装していません。
Cloudflareアカウントの所有者には基盤の管理権限が残ります。

## セキュリティ
- パスワードは Worker Secret に保持し、GitHub Pages や公開リポジトリには含めない。
- ログインに5回失敗すると、その送信元からの試行を15分間停止（D1にIPのハッシュのみ記録）。
- HTTPS / サイトOrigin検証 / 署名付き有効期限2時間のトークン / 文字数制限。
- ログイン状態はメモリーにのみ保存。localStorage、Cookie、GitHubリポジトリにセッションを書き込まない。
- 端末や他人と共有するパスワードなので、離任者が出たら `ADMIN_PASSWORD` を変更する。既存セッションも直ちに無効化するには `SESSION_SECRET` も変更する。
- 適宜CloudflareのWAF／レート制限を追加することを推奨。
- 投稿は公開情報になるため、生徒の個人情報、名簿、部屋割り等は投稿しない。

## 過去記事
投稿済みの記事は D1 の `announcements` テーブルに残ります。
サイトに従来からある `announcements.json` と合わせ、公開サイトに表示します。
古い記事の編集・削除は管理画面からできません。誤投稿への対応は Cloudflare の管理担当者に依頼してください。

## 費用など
Cloudflare の料金・無料枠・制限・必要条件は契約プランおよび変更に左右されます。導入時に最新の公式情報を確認してください。

公式参考：
- https://developers.cloudflare.com/d1/get-started/
- https://developers.cloudflare.com/d1/worker-api/
- https://developers.cloudflare.com/workers/configuration/secrets/
