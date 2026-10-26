# 写真投稿・承認機能を無料プランで有効化（R2不要）

このサイトの写真保存には、すでに使用中の **Cloudflare D1（無料枠）** を利用します。
**R2を契約・作成する必要はありません。支払い情報も新たに登録しないでください。**

現在の構成：
- `photos.html` — アルバム（承認済み写真だけ）
- `photos-post.html` — 生徒の投稿画面（投稿コードなし）
- `admin.html` — 管理者の既存共通パスワードでログインし、写真を承認・却下・取り消し
- `hokkaido-trip-news-api` — 既存のWorker。お知らせAPIを維持
- `hokkaido-trip-news` — 既存D1に投稿情報と写真データを保存

## 1. D1に「画像用テーブル」を1つ追加する

Cloudflareダッシュボード → **D1** → **hokkaido-trip-news** → **Console**。

次のSQLをそのまま貼って **Execute** を押す。

```sql
CREATE TABLE IF NOT EXISTS photo_images (
  id TEXT PRIMARY KEY,
  data BLOB NOT NULL CHECK(length(data) BETWEEN 32 AND 300000),
  FOREIGN KEY(id) REFERENCES photo_submissions(id)
);
```

すでに作成した `photo_submissions`、`photo_upload_limits` と2つのインデックスは
**そのまま使います。消さないでください。**
既存のお知らせデータは一切消しません。

## 2. Cloudflare Turnstileを作る（無料のスパム対策）

Cloudflare → **Turnstile** → **Add widget / Create widget**。

- Widget name：`hokkaido-trip-photos`（任意の名前でも可）
- Hostname：`ban-ikura.github.io`（後ろに `/hokkaido-trip` は付けない）
- Widget mode：**Managed（推奨）**

作成後、Site keyとSecret keyが表示されます。

**Site key（公開用）**：
GitHub `photos-config.js` の
`window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY = '';`
の空欄に**Site keyだけ**を入力して保存。

**Secret key（非公開）**：
Cloudflare → Workers & Pages → `hokkaido-trip-news-api` →
Settings → Runtime variables and secrets → Add variable。

- Type：**Secret**
- Key：`TURNSTILE_SECRET`
- Value：TurnstileのSecret key

**Secret key / ADMIN_PASSWORD / SESSION_SECRETをGitHubやチャットに書かないでください。**
既存の `ADMIN_PASSWORD`・`SESSION_SECRET`・D1バインディング `DB` は変更不要です。

## 3. 既存Workerのコードを更新する

Cloudflare → Workers & Pages → **hokkaido-trip-news-api** → **Edit code**。

GitHubの `admin-backend/src/index.js` の**全文**をコード編集画面に貼り付けて **Deploy**。

既存Workerを削除したり、新しいWorkerを作ったりする必要はありません。
既存のお知らせ機能はそのまま維持します。


## 画像形式の追加（2026年10月26日）

新しい投稿画面では、JPEG・PNG・WebP・HEIC・HEIF・AVIFなどの写真をブラウザーで静止画に再描画し、位置情報等の原本メタデータを取り除いて保存します。MP4・MOV動画は動画そのものを保存せず、静止画1コマを切り出して処理します。ブラウザーがその画像・動画をデコードできる必要があります。

通常はWebPで圧縮しますが、ブラウザーがWebPを書き出せない場合はJPEGで圧縮できます。**JPEGの投稿を有効にするには、ステップ3のCloudflare WorkerをGitHubの `admin-backend/src/index.js` の最新版に更新してDeployしてください。** GitHub Pagesを更新するだけではWorkerは更新されません。APIの `GET /api/photos` に `upload_formats: ["image/webp","image/jpeg"]` が含まれていることを確認してください。

- 旧WorkerのままでもWebPを出力できるブラウザーでは従来どおり投稿できます。
- 新Workerは既存のWebP写真も配信し、JPEG写真は `image/jpeg` として返します。
- 画像の上限は引き続き1枚300KBで、管理者の承認が必須です。
- MP5は一般的な画像・動画形式ではありません。MP4・MOVをお試しください。

## 4. 動作確認

1. `https://hokkaido-trip-news-api.banse-oji.workers.dev/api/announcements` で従来のお知らせを確認。
2. `https://hokkaido-trip-news-api.banse-oji.workers.dev/api/photos` で、写真がなければ `{"items":[]}` と表示。
3. `https://ban-ikura.github.io/hokkaido-trip/photos.html` の右下「写真を投稿」から `photos-post.html` へ。
4. 顔や個人情報が写らないテスト画像を選んで投稿。Turnstileの安全確認が必要。送信後は「承認待ち」。
5. `https://ban-ikura.github.io/hokkaido-trip/admin.html` でログインして「生徒の写真を承認」から承認。
6. アルバムに承認済み写真だけが表示されることを確認。掲載取り消しもテスト。

## 無料プランの制約・安全管理

- **写真は1枚あたり300KB以下**に圧縮（原本の高画質画像は保存されません）。大きな写真でも端末のブラウザーで段階的に圧縮します。
- D1無料プランは**1データベース最大500MB、アカウント合計5GB**。お知らせと写真が同じデータベースなので、容量を分け合います。写真が増えれば容量上限になる可能性があります。
- D1無料プランには読み書き回数の上限もあります。上限に達すると一時的に利用できなくなる場合があります。
- 写真の保存はD1のBLOB。読み取りAPIは投稿の**承認状態をDBで確認**し、承認前の画像データを返しません。
- **顔（小さな写り込み・鏡の反射を含む）や個人情報を含む写真は公開禁止**。顔を自動検出する機能はないため、管理者が1枚ずつ確認します。
- 投稿コードは不要ですが、Turnstileによるボット対策、IPごとの時間当たり制限、管理者の承認が必須です。これらは完全な本人確認・荒らし対策ではありません。
- 公開サイトは誰でも閲覧可能で、`noindex` はアクセス制限ではありません。学校の方針を確認して運用してください。
- 掲載を取り消しても、すでに閲覧者が保存した写真のコピーまで回収できません。

## トラブルシューティング

- `/api/photos` が503：追加SQLが未実行、Workerコード未更新、`TURNSTILE_SECRET` 未設定などを確認。
- 投稿ボタンが無効：公開用Site keyの登録・Turnstileウィジェットの読み込みを確認。
- 送信時403：TurnstileのHostnameとSecret key、サイトに設定したSite keyの対応を確認。
- ストレージ不足：D1の容量を確認し、不要な写真は管理者画面から掲載取り消しするか、上限内に写真を収める。

公式情報：https://developers.cloudflare.com/d1/platform/limits/
