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
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(options.body.get('response'), 'admin-valid-token');
    return Response.json({ success: true, hostname: 'ban-ikura.github.io', action: 'admin_login' });
  };
  let login;
  try {
    login = await worker.fetch(request('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: env.ADMIN_PASSWORD, turnstile_token: 'admin-valid-token' })
    }), env);
  } finally {
    globalThis.fetch = originalFetch;
  }
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

test('password alone cannot log in without a server-verified challenge', async () => {
  const env=makeEnv();
  const response=await worker.fetch(request('/api/login',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({password:env.ADMIN_PASSWORD})
  }),env);
  assert.equal(response.status,403);
  assert.equal((await response.json()).token,undefined);
});

test('a challenge for photo upload is not valid for administrator login', async () => {
  const env=makeEnv();
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>Response.json({
    success:true,hostname:'ban-ikura.github.io',action:'photo_upload'
  });
  try{
    const response=await worker.fetch(request('/api/login',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({password:env.ADMIN_PASSWORD,turnstile_token:'admin-valid-token'})
    }),env);
    assert.equal(response.status,403);
  }finally{globalThis.fetch=originalFetch}
});

test('cross-origin requests cannot obtain an administrator session', async () => {
  const env=makeEnv();
  const response=await worker.fetch(request('/api/login',{
    method:'POST',headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},
    body:JSON.stringify({password:env.ADMIN_PASSWORD,turnstile_token:'admin-valid-token'})
  }),env);
  assert.equal(response.status,403);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
});

test('oversized JSON bodies are rejected even without Content-Length', async () => {
  const env=makeEnv();
  const response=await worker.fetch(request('/api/login',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({password:'x'.repeat(10000),turnstile_token:'admin-valid-token'})
  }),env);
  assert.equal(response.status,400);
});

test('oversized multipart uploads are rejected before parsing', async () => {
  const env=makeEnv();
  const form=new FormData();
  form.append('turnstile_token','admin-valid-token');
  form.append('image',new Blob([new Uint8Array(450000)],{type:'image/webp'}),'over.webp');
  const response=await worker.fetch(request('/api/photos/submissions',{
    method:'POST',body:form
  }),env);
  assert.equal(response.status,413);
  assert.equal(env.DB.writes.length,0);
});

test('API responses prohibit content sniffing and inline document execution', async () => {
  const response=await worker.fetch(request('/api/announcements'),makeEnv());
  assert.equal(response.status,200);
  assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');
  assert.match(response.headers.get('Content-Security-Policy'),/default-src 'none'/);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
});

test('admin sessions expire within thirty minutes', async () => {
  const env=makeEnv();
  const originalFetch=globalThis.fetch;
  const originalNow=Date.now;
  const at=originalNow();
  globalThis.fetch=async()=>Response.json({
    success:true,hostname:'ban-ikura.github.io',action:'admin_login'
  });
  try{
    Date.now=()=>at;
    const login=await worker.fetch(request('/api/login',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({password:env.ADMIN_PASSWORD,turnstile_token:'admin-valid-token'})
    }),env);
    assert.equal(login.status,200);
    const {token,expires_at}=await login.json();
    assert.ok(expires_at-Math.floor(at/1000)<=1800);
    Date.now=()=>at+31*60*1000;
    const response=await worker.fetch(request('/api/announcements',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
      body:JSON.stringify({title:'expired',body:'denied',important:false})
    }),env);
    assert.equal(response.status,401);
  }finally{
    globalThis.fetch=originalFetch;
    Date.now=originalNow;
  }
});
