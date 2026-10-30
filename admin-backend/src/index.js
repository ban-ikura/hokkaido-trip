/*
 * Hokkaido 2026 news-only API for Cloudflare Workers + D1.
 * Public: GET /api/announcements
 * Administrator: POST /api/login, POST /api/announcements
 * No editing, deleting, itinerary mutation, password exposure, or GitHub token.
 */
const SITE_ORIGIN = 'https://ban-ikura.github.io';
const SESSION_SECONDS = 30 * 60;
const WINDOW_SECONDS = 15 * 60;
const MAX_FAILURES = 5;
const encoder = new TextEncoder();

function json(data, status=200, request=null, extra={}) {
  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'no-referrer',
    'Content-Security-Policy':"default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    'X-Frame-Options':'DENY',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
    'Pragma':'no-cache',
    ...extra
  });
  if(request && request.headers.get('Origin')===SITE_ORIGIN){
    headers.set('Access-Control-Allow-Origin', SITE_ORIGIN);
    headers.set('Vary','Origin');
  }
  return new Response(JSON.stringify(data),{status,headers});
}
function decodeBase64Url(input){
  const raw=atob(input.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-input.length%4)%4));
  return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
function encodeBase64Url(buffer){
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function hmacKey(secret){
  return crypto.subtle.importKey('raw',encoder.encode(secret),
    {name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
async function createSession(secret){
  const expires=Math.floor(Date.now()/1000)+SESSION_SECONDS;
  const nonce=crypto.randomUUID();
  const body='news:write.'+expires+'.'+nonce;
  const signature=await crypto.subtle.sign('HMAC',await hmacKey(secret),encoder.encode(body));
  return {token:expires+'.'+nonce+'.'+encodeBase64Url(signature),expiresAt:expires};
}
async function verifySession(token,secret){
  if(typeof token!=='string'||token.length>250)return false;
  const match=token.match(/^(\d{10})\.([0-9a-f-]{36})\.([A-Za-z0-9_-]{40,50})$/);
  if(!match)return false;
  const expiry=Number(match[1]), now=Math.floor(Date.now()/1000);
  if(expiry<=now||expiry>now+SESSION_SECONDS)return false;
  const body='news:write.'+match[1]+'.'+match[2];
  try{
    return await crypto.subtle.verify('HMAC',await hmacKey(secret),
      decodeBase64Url(match[3]),encoder.encode(body));
  }catch{return false}
}
async function safeCompare(a,b){
  const [one,two]=await Promise.all([
    crypto.subtle.digest('SHA-256',encoder.encode(a)),
    crypto.subtle.digest('SHA-256',encoder.encode(b))
  ]);
  const x=new Uint8Array(one),y=new Uint8Array(two);
  let diff=0;
  for(let i=0;i<x.length;i++)diff|=x[i]^y[i];
  return diff===0;
}
// Bound memory usage, including requests without a Content-Length header.
async function limitedBody(request,limit){
  const length=request.headers.get('Content-Length');
  if(length!==null&&(!/^\d+$/.test(length)||Number(length)>limit))return null;
  if(!request.body)return null;
  const reader=request.body.getReader(),chunks=[];
  let total=0;
  try{
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      total+=value.byteLength;
      if(total>limit){await reader.cancel().catch(()=>{});return null}
      chunks.push(value);
    }
  }catch{await reader.cancel().catch(()=>{});return null}
  const bytes=new Uint8Array(total);
  let offset=0;
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
  return bytes;
}
async function requestData(request){
  if(!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('Content-Type')||''))return null;
  const bytes=await limitedBody(request,8000);
  if(!bytes)return null;
  try{
    const obj=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    return obj&&typeof obj==='object'&&!Array.isArray(obj)?obj:null;
  }catch{return null}
}
function todayInJapan(){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',
    year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const values=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return values.year+'-'+values.month+'-'+values.day;
}
async function clientKey(request,secret){
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  const digest=await crypto.subtle.digest('SHA-256',encoder.encode(secret+'|'+ip));
  return encodeBase64Url(digest);
}
async function login(request,env){
  if(!env.DB||!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<12||
     !env.SESSION_SECRET||env.SESSION_SECRET.length<32||
     !env.TURNSTILE_SECRET||env.TURNSTILE_SECRET.length<12){
    return json({error:'管理者認証の初期設定が終わっていません。'},503,request);
  }
  const data=await requestData(request);
  if(!data||typeof data.password!=='string'||data.password.length>256){
    return json({error:'パスワードを入力してください。'},400,request);
  }
  const now=Math.floor(Date.now()/1000);
  const key=await clientKey(request,env.SESSION_SECRET);
  const row=await env.DB.prepare('SELECT failures,window_start FROM login_attempts WHERE ip_hash=?')
    .bind(key).first();
  if(row&&now-Number(row.window_start)<WINDOW_SECONDS&&Number(row.failures)>=MAX_FAILURES){
    return json({error:'ログイン試行回数の上限です。15分ほど後にお試しください。'},429,request);
  }
  if(!await verifyTurnstile(request,env,data.turnstile_token,'admin_login')){
    return json({error:'安全確認を完了してからログインしてください。'},403,request);
  }
  if(!await safeCompare(data.password,env.ADMIN_PASSWORD)){
    await env.DB.prepare(
      'INSERT INTO login_attempts(ip_hash,failures,window_start) VALUES(?,1,?) '+
      'ON CONFLICT(ip_hash) DO UPDATE SET '+
      'failures=CASE WHEN ?-window_start>=? THEN 1 ELSE failures+1 END,'+
      'window_start=CASE WHEN ?-window_start>=? THEN excluded.window_start ELSE window_start END'
    ).bind(key,now,now,WINDOW_SECONDS,now,WINDOW_SECONDS).run();
    return json({error:'パスワードが違います。'},401,request);
  }
  await env.DB.prepare('DELETE FROM login_attempts WHERE ip_hash=?').bind(key).run();
  const session=await createSession(env.SESSION_SECRET);
  return json({token:session.token,expires_at:session.expiresAt},200,request);
}
async function getAnnouncements(request,env){
  const result=await env.DB.prepare(
    'SELECT id,date,title,body,important,created_at FROM announcements '+
    'ORDER BY created_at DESC LIMIT 100'
  ).all();
  return json({items:(result.results||[]).map(x=>({
    id:x.id,date:x.date,title:x.title,body:x.body,
    important:x.important===1,created_at:x.created_at
  }))},200,request);
}
async function postAnnouncement(request,env){
  if(!env.SESSION_SECRET||env.SESSION_SECRET.length<32){
    return json({error:'管理者認証の初期設定が終わっていません。'},503,request);
  }
  // hidden/disabled等のHTML表示状態には依存せず、署名付きセッションを検証する。
  // 写真承認APIと同じサーバー側の権限チェックを必ず通す。
  if(!await adminAuthorized(request,env)){
    return json({error:'ログインが必要です。もう一度ログインしてください。'},401,request);
  }
  const data=await requestData(request);
  if(!data||typeof data.title!=='string'||typeof data.body!=='string'){
    return json({error:'タイトルと本文を入力してください。'},400,request);
  }
  const title=data.title.trim(),body=data.body.trim();
  if(title.length<2||title.length>120||body.length<1||body.length>1500||
    typeof data.important!=='boolean'){
    return json({error:'タイトル2〜120文字、本文1〜1500文字で入力してください。'},400,request);
  }
  const id=crypto.randomUUID(),date=todayInJapan(),createdAt=new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO announcements(id,date,title,body,important,created_at) VALUES(?,?,?,?,?,?)'
  ).bind(id,date,title,body,data.important?1:0,createdAt).run();
  return json({ok:true,id,date,title},201,request);
}
/* --- 生徒写真: D1 BLOB小容量保存、承認制、Turnstile、サーバー側のアクセス制御 --- */
// Free D1での運用向け: 投稿写真は最大300KB、写真専用行にBLOBで保存。
const PHOTO_LIMIT_BYTES = 300000;
const PHOTO_WINDOW_SECONDS = 60 * 60;
const PHOTO_MAX_ATTEMPTS = 20;
const PHOTO_ID_PATTERN = '[0-9a-f-]{36}';

function photoReady(env) {
  return !!(env.DB && typeof env.TURNSTILE_SECRET === 'string' &&
    env.TURNSTILE_SECRET.length >= 12 && env.SESSION_SECRET && env.SESSION_SECRET.length >= 32);
}
function photoError(request) {
  return json({error:'写真投稿機能は準備中です。'},503,request);
}
async function adminAuthorized(request,env) {
  const authorization=request.headers.get('Authorization')||'';
  return !!(env.SESSION_SECRET && authorization.startsWith('Bearer ') &&
    await verifySession(authorization.slice(7),env.SESSION_SECRET));
}
function photoListRow(x) {
  return {
    id:x.id, nickname:x.nickname, caption:x.caption,
    created_at:x.created_at, reviewed_at:x.reviewed_at||null,
    image_url:'/api/photos/'+x.id+'/image'
  };
}
function photoId(pathname, admin) {
  const prefix=admin?'/api/admin/photos/':'/api/photos/';
  if(!pathname.startsWith(prefix))return null;
  const rest=pathname.slice(prefix.length);
  const match=rest.match(new RegExp('^('+PHOTO_ID_PATTERN+')(?:/(image|approve|reject|unpublish))?$'));
  return match?{id:match[1],action:match[2]||''}:null;
}
async function publicPhotos(request,env) {
  if(!photoReady(env))return photoError(request);
  const result=await env.DB.prepare(
    "SELECT id,nickname,caption,created_at,reviewed_at FROM photo_submissions "+
    "WHERE status='approved' ORDER BY reviewed_at DESC LIMIT 60"
  ).all();
  return json({items:(result.results||[]).map(photoListRow),upload_formats:['image/webp','image/jpeg']},200,request);
}
async function photoImage(request,env,id,requiresAdmin) {
  if(!photoReady(env))return photoError(request);
  if(requiresAdmin && !await adminAuthorized(request,env)){
    return json({error:'ログインが必要です。'},401,request);
  }
  // 画像バイナリを返すSQLでも承認状態を確認し、未承認の写真の直接公開を拒否。
  const row=await env.DB.prepare(
    "SELECT pi.data AS data FROM photo_images pi JOIN photo_submissions ps "+
    "ON ps.id=pi.id WHERE ps.id=? AND ps.status IN ("+
    (requiresAdmin?"'pending','approved'":"'approved'")+")"
  ).bind(id).first();
  if(!row||!Array.isArray(row.data)||row.data.length<32||
     row.data.length>PHOTO_LIMIT_BYTES)return json({error:'Not found'},404,request);
  const headers=new Headers({
    'Content-Type':(row.data[0]===0xff&&row.data[1]===0xd8)?'image/jpeg':'image/webp',
    'X-Content-Type-Options':'nosniff',
    'Content-Security-Policy':"default-src 'none'; sandbox",
    'Cache-Control':'no-store', 'Referrer-Policy':'no-referrer',
    'Content-Disposition':'inline'
  });
  if(request.headers.get('Origin')===SITE_ORIGIN){
    headers.set('Access-Control-Allow-Origin',SITE_ORIGIN);
    headers.set('Vary','Origin');
  }
  return new Response(new Uint8Array(row.data),{status:200,headers});
}
async function adminPhotos(request,env,status) {
  if(!photoReady(env))return photoError(request);
  if(!await adminAuthorized(request,env)){
    return json({error:'ログインが必要です。'},401,request);
  }
  if(status!=='pending' && status!=='approved'){
    return json({error:'不正な状態です。'},400,request);
  }
  const result=await env.DB.prepare(
    'SELECT id,nickname,caption,created_at,reviewed_at FROM photo_submissions '+
    'WHERE status=? ORDER BY created_at DESC LIMIT 80'
  ).bind(status).all();
  return json({items:(result.results||[]).map(photoListRow)},200,request);
}
async function moderatePhoto(request,env,id,action){
  if(!photoReady(env))return photoError(request);
  if(!await adminAuthorized(request,env)){
    return json({error:'ログインが必要です。'},401,request);
  }
  const row=await env.DB.prepare(
    'SELECT object_key,status FROM photo_submissions WHERE id=?'
  ).bind(id).first();
  const wanted=action==='unpublish'?'approved':'pending';
  if(!row || row.status!==wanted){
    return json({error:'写真が見つからないか、すでに処理されています。'},409,request);
  }
  const at=new Date().toISOString();
  if(action==='approve'){
    const result=await env.DB.prepare(
      "UPDATE photo_submissions SET status='approved',reviewed_at=? "+
      "WHERE id=? AND status='pending'"
    ).bind(at,id).run();
    if((result.meta?.changes||0)!==1)return json({error:'処理済みです。'},409,request);
    return json({ok:true},200,request);
  }
  // 却下・掲載取り消しは、状態変更後にD1から写真データを削除する。
  const result=await env.DB.prepare(
    "UPDATE photo_submissions SET status='rejected',reviewed_at=? "+
    "WHERE id=? AND status=?"
  ).bind(at,id,wanted).run();
  if((result.meta?.changes||0)!==1)return json({error:'処理済みです。'},409,request);
  // 削除の途中で失敗しても、承認状態がrejectedなら画像取得APIは拒否する。
  await env.DB.prepare('DELETE FROM photo_images WHERE id=?').bind(id).run();
  return json({ok:true},200,request);
}
async function uploadQuota(request,env){
  const key=await clientKey(request,env.SESSION_SECRET);
  const now=Math.floor(Date.now()/1000);
  const row=await env.DB.prepare(
    'SELECT requests,window_start FROM photo_upload_limits WHERE ip_hash=?'
  ).bind(key).first();
  if(row && now-Number(row.window_start)<PHOTO_WINDOW_SECONDS &&
     Number(row.requests)>=PHOTO_MAX_ATTEMPTS)return false;
  await env.DB.prepare(
    'INSERT INTO photo_upload_limits(ip_hash,requests,window_start) VALUES(?,1,?) '+
    'ON CONFLICT(ip_hash) DO UPDATE SET '+
    'requests=CASE WHEN ?-window_start>=? THEN 1 ELSE requests+1 END,'+
    'window_start=CASE WHEN ?-window_start>=? THEN excluded.window_start ELSE window_start END'
  ).bind(key,now,now,PHOTO_WINDOW_SECONDS,now,PHOTO_WINDOW_SECONDS).run();
  return true;
}
// canvasで作られた標準の静止WebPだけを許可。EXIF等の付加チャンクやアニメは拒否。
function simpleWebp(bytes){
  // WebPのRIFF構造を確認。Chrome等の単純形式に加えて、スマホなどが生成する
  // VP8X（拡張静止画）も許可する。アニメーションとEXIF/XMPは受け付けない。
  if(!(bytes instanceof Uint8Array)||bytes.length<32||bytes.length>PHOTO_LIMIT_BYTES)return false;
  const ascii=(n,s)=>[...s].every((c,i)=>bytes[n+i]===c.charCodeAt(0));
  const le32=n=>(bytes[n]|(bytes[n+1]<<8)|(bytes[n+2]<<16)|(bytes[n+3]<<24))>>>0;
  if(!ascii(0,'RIFF')||!ascii(8,'WEBP')||le32(4)!==bytes.length-8)return false;
  let at=12, imageCount=0, extended=false, alpha=false, colorProfile=false, flags=0;
  let imageSeen=false;
  while(at+8<=bytes.length){
    const kind=String.fromCharCode(...bytes.subarray(at,at+4));
    const size=le32(at+4);
    const next=at+8+size+(size&1);
    if(size>PHOTO_LIMIT_BYTES||next>bytes.length)return false;
    if(kind==='VP8X'){
      if(at!==12||extended||size!==10)return false;
      extended=true;
      flags=bytes[at+8];
      // animation, EXIF, XMP and reserved bits are disallowed.
      if(flags&0xCF)return false; // 0xC0 reserved, 0x08 EXIF, 0x04 XMP, 0x02 animation, 0x01 reserved
      const w=1+bytes[at+12]+(bytes[at+13]<<8)+(bytes[at+14]<<16);
      const h=1+bytes[at+15]+(bytes[at+16]<<8)+(bytes[at+17]<<16);
      if(w>4096||h>4096)return false;
    }else if(kind==='ICCP'){
      if(!extended||colorProfile||imageSeen||size<1||size>32768)return false;
      colorProfile=true;
    }else if(kind==='ALPH'){
      if(!extended||alpha||imageSeen||size<1)return false;
      alpha=true;
    }else if(kind==='VP8 '||kind==='VP8L'){
      if(imageSeen||size<(kind==='VP8 '?10:5))return false;
      imageCount++;
      imageSeen=true;
      const start=at+8;
      if(kind==='VP8 '){
        // VP8 lossy key-frame signature.
        if(bytes[start+3]!==0x9d||bytes[start+4]!==0x01||bytes[start+5]!==0x2a)return false;
      }else{
        if(alpha||bytes[start]!==0x2f)return false;
      }
    }else{
      // EXIF/XMP/ANIM/ANMF and unknown chunks are forbidden.
      return false;
    }
    at=next;
  }
  if(at!==bytes.length||imageCount!==1)return false;
  if(extended){
    if(Boolean(flags&0x10)!==alpha)return false;
    if(Boolean(flags&0x20)!==colorProfile)return false;
  }else if(alpha||colorProfile)return false;
  return true;
}
// Canvasで再描画した静止JPEGのみ受け付ける。EXIF、XMP、コメント、
// 埋め込みメタデータが含まれる元画像は拒否する。
function simpleJpeg(bytes){
 if(!(bytes instanceof Uint8Array)||bytes.length<32||bytes.length>PHOTO_LIMIT_BYTES)return false;
 const n=bytes.length;
 if(bytes[0]!==0xff||bytes[1]!==0xd8||bytes[n-2]!==0xff||bytes[n-1]!==0xd9)return false;
 let at=2,frame=false;
 while(at+3<n){
  if(bytes[at++]!==0xff)return false;
  while(bytes[at]===0xff)at++;
  const marker=bytes[at++];
  if(marker===0xda){
   const length=(bytes[at]<<8)|bytes[at+1];
   return frame&&length>=6&&at+length<n-2;
  }
  if(marker===0xd8||marker===0xd9||marker===0x01||marker===0x00||
     marker>=0xd0&&marker<=0xd7)return false;
  if(at+2>n)return false;
  const length=(bytes[at]<<8)|bytes[at+1];
  if(length<2||at+length>n-2)return false;
  // Canvas JPEG from Chromium and Safari may carry a standard ICC profile.
  // ICC only describes colors; EXIF, XMP, comments and arbitrary APP markers
  // still remain forbidden (including location/camera metadata).
  if(marker===0xfe||marker>=0xe1&&marker<=0xef&&![0xe2,0xee].includes(marker))return false;
  if(marker===0xe0){
   if(length<7||String.fromCharCode(...bytes.subarray(at+2,at+7))!=='JFIF\0')return false;
  }else if(marker===0xe2){
   if(length<16||String.fromCharCode(...bytes.subarray(at+2,at+14))!=='ICC_PROFILE\0')return false;
  }else if(marker===0xee){
   if(length<14||String.fromCharCode(...bytes.subarray(at+2,at+8))!=='Adobe\0')return false;
  }
  if([0xc0,0xc1,0xc2].includes(marker)){
   if(frame||length<11)return false;
   const height=(bytes[at+3]<<8)|bytes[at+4];
   const width=(bytes[at+5]<<8)|bytes[at+6];
   if(width<1||height<1||width>4096||height>4096)return false;
   frame=true;
  }
  at+=length;
 }
 return false;
}
// Verify the challenge at the server and bind each token to its specific action.
async function verifyTurnstile(request,env,token,expectedAction){
  if(typeof env.TURNSTILE_SECRET!=='string'||env.TURNSTILE_SECRET.length<12||
     typeof token!=='string'||token.length<10||token.length>2048)return false;
  const form=new FormData();
  form.append('secret',env.TURNSTILE_SECRET);
  form.append('response',token);
  const ip=request.headers.get('CF-Connecting-IP');
  if(ip)form.append('remoteip',ip);
  try{
    const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
      method:'POST',body:form,signal:AbortSignal.timeout(6000)
    });
    if(!result.ok)return false;
    const verdict=await result.json();
    return !!(verdict&&verdict.success===true&&
      verdict.hostname==='ban-ikura.github.io'&&verdict.action===expectedAction);
  }catch{return false}
}
async function submitPhoto(request,env){
  if(!photoReady(env))return photoError(request);
  const contentType=request.headers.get('Content-Type')||'';
  if(!/^multipart\/form-data\s*;\s*boundary=[a-zA-Z0-9'()+_,.\/:=?-]{1,120}\s*$/i.test(contentType)){
    return json({error:'画像を選択してください。'},400,request);
  }
  const bodyBytes=await limitedBody(request,PHOTO_LIMIT_BYTES+100000);
  if(!bodyBytes)return json({error:'画像が大きすぎます。'},413,request);
  let data;
  try{
    data=await new Request(request.url,{method:'POST',
      headers:{'Content-Type':contentType},body:bodyBytes}).formData();
  }catch{return json({error:'送信形式が正しくありません。'},400,request)}
  if(!await verifyTurnstile(request,env,data.get('turnstile_token'),'photo_upload')){
    return json({error:'安全確認に失敗しました。再度確認して送信してください。'},403,request);
  }
  if(!await uploadQuota(request,env)){
    return json({error:'送信回数が多すぎます。1時間ほど待ってください。'},429,request);
  }
  const caption=data.get('caption'),nickname=data.get('nickname')||'匿名';
  const permission=data.get('permission');
  const file=data.get('image');
  if(typeof caption!=='string'||caption.trim().length<1||caption.trim().length>200||
     typeof nickname!=='string'||nickname.trim().length<1||nickname.trim().length>24){
    return json({error:'コメントは1〜200文字、表示名は1〜24文字で入力してください。'},400,request);
  }
  if(permission!=='yes')return json({error:'顔写真禁止と投稿ルールを確認して同意してください。'},400,request);
  if(!file || typeof file.arrayBuffer!=='function' ||
     !['image/webp','image/jpeg'].includes(file.type) ||
     file.size>PHOTO_LIMIT_BYTES || file.size<32){
    return json({error:'写真を300KB以下のWebPまたはJPEGに圧縮して送信してください。'},400,request);
  }
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(!(file.type==='image/webp'?simpleWebp(bytes):simpleJpeg(bytes))){
    return json({error:'画像の形式を確認できません。別の写真をお試しください。'},400,request);
  }
  const id=crypto.randomUUID(),key='d1/'+id+(file.type==='image/jpeg'?'.jpg':'.webp');
  // D1 batchはトランザクション。画像と投稿記録を一緒に保存する。
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO photo_submissions(id,object_key,nickname,caption,status,created_at) "+
      "VALUES(?,?,?,?,'pending',?)"
    ).bind(id,key,nickname.trim(),caption.trim(),new Date().toISOString()),
    env.DB.prepare('INSERT INTO photo_images(id,data) VALUES(?,?)').bind(id,bytes)
  ]);
  return json({ok:true,message:'管理者の承認待ちです。承認後に写真一覧へ表示されます。'},201,request);
}

export default {
  async fetch(request,env){
    const pathname=new URL(request.url).pathname;
    const origin=request.headers.get('Origin');
    if(request.method==='OPTIONS'){
      if(origin!==SITE_ORIGIN)return json({error:'Forbidden'},403,request);
      return new Response(null,{status:204,headers:{
        'Access-Control-Allow-Origin':SITE_ORIGIN,
        'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type,Authorization',
        'Access-Control-Max-Age':'300',
        'Vary':'Origin'
      }});
    }
    // 写真: GETの一覧は承認済みのみ。画像もD1の承認状態を都度確認する。
    if(pathname==='/api/photos'&&request.method==='GET'){
      try{return await publicPhotos(request,env)}
      catch{return json({error:'写真を取得できません。'},503,request)}
    }
    const studentPhoto=photoId(pathname,false);
    if(studentPhoto && studentPhoto.action==='image' && request.method==='GET'){
      try{return await photoImage(request,env,studentPhoto.id,false)}
      catch{return json({error:'写真を取得できません。'},503,request)}
    }
    if(pathname==='/api/photos/submissions'&&request.method==='POST'){
      if(origin!==SITE_ORIGIN)return json({error:'Forbidden'},403,request);
      try{return await submitPhoto(request,env)}
      catch{return json({error:'写真の送信に失敗しました。'},503,request)}
    }
    if(pathname==='/api/admin/photos'&&request.method==='GET'){
      if(origin!==SITE_ORIGIN)return json({error:'Forbidden'},403,request);
      try{return await adminPhotos(request,env,new URL(request.url).searchParams.get('status')||'pending')}
      catch{return json({error:'写真を取得できません。'},503,request)}
    }
    const adminPhoto=photoId(pathname,true);
    if(adminPhoto && origin===SITE_ORIGIN){
      try{
        if(adminPhoto.action==='image'&&request.method==='GET'){
          return await photoImage(request,env,adminPhoto.id,true);
        }
        if(['approve','reject','unpublish'].includes(adminPhoto.action)&&request.method==='POST'){
          return await moderatePhoto(request,env,adminPhoto.id,adminPhoto.action);
        }
      }catch{return json({error:'写真の処理に失敗しました。'},503,request)}
    }

    if(pathname==='/api/announcements'&&request.method==='GET'){
      try{
        if(!env.DB)return json({error:'データベース未設定'},503,request);
        return await getAnnouncements(request,env);
      }catch{return json({error:'お知らせを取得できません。'},503,request)}
    }
    if(pathname==='/api/login'&&request.method==='POST'||
       pathname==='/api/announcements'&&request.method==='POST'){
      if(origin!==SITE_ORIGIN)return json({error:'Forbidden'},403,request);
      if(!env.DB)return json({error:'データベース未設定'},503,request);
      try{
        return pathname==='/api/login'?await login(request,env):await postAnnouncement(request,env);
      }catch{return json({error:'サーバー処理に失敗しました。'},503,request)}
    }
    if(pathname==='/api/login'||pathname==='/api/announcements'){
      return json({error:'この操作は許可されていません。'},405,request,{Allow:pathname==='/api/login'?'POST':'GET, POST'});
    }
    return json({error:'Not found'},404,request);
  }
};
