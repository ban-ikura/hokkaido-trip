CREATE TABLE IF NOT EXISTS photo_images (
  id TEXT PRIMARY KEY,
  data BLOB NOT NULL CHECK(length(data) BETWEEN 32 AND 300000),
  FOREIGN KEY(id) REFERENCES photo_submissions(id)
);
