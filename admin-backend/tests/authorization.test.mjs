import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import worker from '../src/index.js';

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const SITE_ORIGIN = 'https://ban-ikura.github.io';
const API_URL = 'https://example.workers.dev';

function fakeDB() {
  const writes = [];
  return {
    writes,
    prepare(sql) {
      const statement = {
        bind() { return this; },
        async first() { return null; },
        async all() { return { results: [] }; },
        async run() {
          writes.push(sql);
          return { meta: { changes: 1 } };
        }
      };
      return statement;
    },
    async batch(statements) {
      writes.push('PHOTO_BATCH:' + statements.length);
      return statements.map(() => ({ meta: { changes: 1 } }));
    }
  };
}
function makeEnv(db = fakeDB()) {
  return {
    DB: db,
    ADMIN_PASSWORD: 'test-admin-password-only',
    SESSION_SECRET: 'test-session-secret-must-be-long-enough-123456',
    TURNSTILE_SECRET: 'test-turnstile-secret-only'
  };
}
function request(path, options = {}) {
  return new Request(API_URL + path, {
    ...options,
    headers: { Origin: SITE_ORIGIN, ...(options.headers || {}) }
  });
}

test('removing hidden cannot create an announcement without an admin session', async () => {
  const db = fakeDB();
  const env = makeEnv(db);
  const res = await worker.fetch(request('/api/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'test post', body: 'no authorization', important: false })
  }), env);
  assert.equal(res.status, 401);
  assert.equal(db.writes.length, 0);
});

test('forged bearer tokens are rejected even with the expected Origin', async () => {
  const db = fakeDB();
  const res = await worker.fetch(request('/api/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer fake-session' },
    body: JSON.stringify({ title: 'test post', body: 'forged session', important: false })
  }), makeEnv(db));
  assert.equal(res.status, 401);
  assert.equal(db.writes.length, 0);
});

test('photo approval and pending-photo access require an admin session', async () => {
  const db = fakeDB();
  const env = makeEnv(db);
  const id = '00000000-0000-4000-8000-000000000000';
  const approval = await worker.fetch(request('/api/admin/photos/' + id + '/approve', {
    method: 'POST'
  }), env);
  const pending = await worker.fetch(request('/api/admin/photos?status=pending'), env);
  assert.equal(approval.status, 401);
  assert.equal(pending.status, 401);
  assert.equal(db.writes.length, 0);
});

test('photo submissions require server-verified Turnstile, not just an enabled button', async () => {
  const db = fakeDB();
  const form = new FormData();
  form.append('turnstile_token', 'invalid');
  const res = await worker.fetch(request('/api/photos/submissions', {
    method: 'POST', body: form
  }), makeEnv(db));
  assert.equal(res.status, 403);
  assert.equal(db.writes.length, 0);
});

test('an authenticated administrator can still create a new announcement', async () => {
  const db = fakeDB();
  const env = makeEnv(db);
  const login = await worker.fetch(request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: env.ADMIN_PASSWORD })
  }), env);
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const post = await worker.fetch(request('/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ title: 'valid new post', body: 'allowed', important: false })
  }), env);
  assert.equal(post.status, 201);
  assert.ok(db.writes.some(sql => sql.includes('INSERT INTO announcements')));
});

test('a normal photo submission remains permitted with valid Turnstile', async () => {
  const db = fakeDB();
  const env = makeEnv(db);
  const form = new FormData();
  form.append('turnstile_token', 'valid-test-turnstile-token');
  form.append('nickname', '匿名');
  form.append('caption', '旅行の風景');
  form.append('permission', 'yes');
  const webp = Buffer.from('UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA=', 'base64');
  form.append('image', new Blob([webp], { type: 'image/webp' }), 'photo.webp');

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    assert.equal(String(url), 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    return Response.json({
      success: true,
      hostname: 'ban-ikura.github.io',
      action: 'photo_upload'
    });
  };
  try {
    const res = await worker.fetch(request('/api/photos/submissions', {
      method: 'POST', body: form
    }), env);
    assert.equal(res.status, 201);
    assert.ok(db.writes.includes('PHOTO_BATCH:2'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
