-- Cloudflare D1: 投稿は追加のみ。編集・削除用APIは実装しません。
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL CHECK(length(title) BETWEEN 2 AND 120),
  body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 1500),
  important INTEGER NOT NULL DEFAULT 0 CHECK(important IN (0,1)),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at
  ON announcements(created_at DESC);
CREATE TABLE IF NOT EXISTS login_attempts (
  ip_hash TEXT PRIMARY KEY,
  failures INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);
