# セキュリティ強化版のWorkerを本番へ反映する手順（2026-10-30）

## このリポジトリで反映済み
- 公開ページのCSP強化：インラインJavaScript禁止、許可するAPIのホストを固定
- 管理者ログインにCloudflare Turnstile（`action: admin_login`）を追加
- 管理セッションを30分に短縮し、終了時・ログアウト時はブラウザー側メモリから破棄
- APIのJSONと画像multipartの読み込みを最大サイズまでに制限（Content-Lengthがなくても適用）
- APIレスポンスへ `nosniff`、CSP、キャッシュ禁止などのヘッダーを付与
- 認証・送信・CSPの自動回帰テストを追加

## 重要：GitHub Pagesの更新だけではAPIは変わりません
APIはCloudflareの **`hokkaido-trip-news-api` Worker** です。
`admin-backend/src/index.js` を本番Workerへデプロイする必要があります。
これが完了するまでは、Worker側の新しい制御は本番に反映されません。

### 反映手順
1. GitHub Actionsの「Worker authorization tests」が成功していることを確認する。
2. Cloudflare → Workers & Pages → `hokkaido-trip-news-api` → Settingsで、次の**Secret**とD1 Bindingを確認する。
   - `ADMIN_PASSWORD`（12文字以上、リポジトリには書かない）
   - `SESSION_SECRET`（32文字以上のランダム値）
   - `TURNSTILE_SECRET`（`ban-ikura.github.io` に対応したTurnstile Secret）
   - D1 Binding `DB`（既存の `hokkaido-trip-news`）
3. CloudflareのWorker編集画面に `admin-backend/src/index.js` の最新版を貼り付けて **Deploy** する。GitHubの `wrangler.toml` にはD1 UUIDのプレースホルダーがあるため、UUIDを設定していないローカル環境からそのまま `wrangler deploy` しないこと。
4. 公開中の `admin.html` には `photos-config.js` の既存Turnstile Site keyを使用したログイン安全確認が表示される。安全確認を完了後に、共通パスワードでログインする。
5. お知らせ投稿、承認待ち写真の取得、承認、アルバム表示、一般写真投稿を確認する。古いセッションは短期化により無効になる場合がある。
6. 不審なログインや鍵漏えいの疑いがある場合は `ADMIN_PASSWORD` と `SESSION_SECRET` を**Cloudflare Secret管理画面でローテーション**する。ローテーション後はWorkerの再デプロイが必要な場合がある。

### 動作確認例
- `GET /api/announcements`: 既存のお知らせを取得できる
- `GET /api/photos`: 承認済みの写真のみ表示
- `POST /api/login`: パスワードだけでは **403**。Turnstileの有効トークン＋正しいパスワードが必要
- `POST /api/announcements`: 未認証なら **401**、ログイン後は投稿可能
- `POST /api/admin/photos/{id}/approve`: 未認証なら **401**
- 管理セッションは発行から最大 **30分**。期限切れ後は再ログイン

## 残る運用上の注意
- **TurnstileはMFAではありません**。共通パスワードでの運用が続くため、管理者専用アカウント・Cloudflare Access等の本人認証を導入すると、さらに安全です。
- CSPは防御層の一つであり、XSS対策の代わりにすべてを任せるものではありません。外部入力は今後も `textContent` とDOM APIで描画し、`innerHTML` に渡さないでください。
- `Origin` とCORSは補助策であり、認証そのものではありません。サーバー側のセッショントークン検証が必須です。
- Cloudflare側のデプロイとログインの実機確認はリポジトリのテストだけでは代替できません。
