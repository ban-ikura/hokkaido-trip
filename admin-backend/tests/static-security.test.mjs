import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const htmlPages=[
  'index.html','day1.html','day2.html','day3.html','day4.html',
  'stay.html','guide.html','safety.html','photos.html','photos-post.html','admin.html'
];
const dynamicScripts=[
  'admin.js','app.js','photos-gallery.js','photos-home.js','photos-submit.js',
  'photos.js','photo-ambient.js','site-swipe.js'
];
const read=name=>readFileSync(resolve(root,name),'utf8');

test('every public HTML entry has a restrictive script policy and precise API host',()=>{
  for(const file of htmlPages){
    const html=read(file);
    const match=html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
    assert.ok(match,file+' CSP meta tag missing');
    const policy=match[1];
    assert.match(policy,/script-src 'self'/,file);
    assert.doesNotMatch(policy,/script-src[^;]*'unsafe-inline'/,file);
    assert.match(policy,/script-src-attr 'none'/,file);
    assert.match(policy,/base-uri 'none'/,file);
    assert.doesNotMatch(policy,/https:\/\/\*\.workers\.dev/,file);
    assert.match(policy,/https:\/\/hokkaido-trip-news-api\.banse-oji\.workers\.dev/,file);
    assert.doesNotMatch(html,/\son(?:error|load|click|focus)\s*=/i,file);
  }
});

test('untrusted API text is not fed to HTML-parsing execution sinks',()=>{
  for(const file of dynamicScripts){
    const js=read(file);
    assert.doesNotMatch(js,/\.(?:innerHTML|outerHTML)\s*=/,file);
    assert.doesNotMatch(js,/\.insertAdjacentHTML\s*\(/,file);
    assert.doesNotMatch(js,/\bdocument\.write\s*\(/,file);
    assert.doesNotMatch(js,/\beval\s*\(/,file);
    assert.doesNotMatch(js,/\bnew\s+Function\s*\(/,file);
  }
});

test('administrator UI requires a site-verified login challenge',()=>{
  const html=read('admin.html');
  const js=read('admin.js');
  const api=read('admin-backend/src/index.js');
  assert.match(html,/id="admin-turnstile"/);
  assert.match(html,/photos-config\.js/);
  assert.match(js,/action:'admin_login'/);
  assert.match(js,/turnstile_token:turnstileToken/);
  assert.match(api,/verifyTurnstile\(request,env,data\.turnstile_token,'admin_login'\)/);
});
