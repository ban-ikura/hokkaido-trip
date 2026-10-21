-- 写真投稿: 管理者の承認まで一般公開しない。既存のニューステーブルは変更しない。
CREATE TABLE IF NOT EXISTS photo_submissions (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL CHECK(length(nickname) BETWEEN 1 AND 24),
  caption TEXT NOT NULL CHECK(length(caption) BETWEEN 1 AND 200),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK(status IN ('pending','approved','rejected')),
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_photo_status_date
  ON photo_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photo_approved_date
  ON photo_submissions(status, reviewed_at DESC);

-- IPそのものではなく秘密鍵でハッシュ化した識別子のみ保持
CREATE TABLE IF NOT EXISTS photo_upload_limits (
  ip_hash TEXT PRIMARY KEY,
  requests INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);
