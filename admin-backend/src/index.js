/*
 * Hokkaido 2026 news-only API for Cloudflare Workers + D1.
 * Public: GET /api/announcements
 * Administrator: POST /api/login, POST /api/announcements
 * No editing, deleting, itinerary mutation, password exposure, or GitHub token.
 */
const SITE_ORIGIN = 'https://ban-ikura.github.io';
const SESSION_SECONDS = 2 * 60 * 60;
const WINDOW_SECONDS = 15 * 60;
const MAX_FAILURES = 5;
const encoder = new TextEncoder();

function json(data, status=200, request=null, extra={}) {
  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'no-referrer',
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
async function requestData(request){
  if(!/application\/json/i.test(request.headers.get('Content-Type')||''))return null;
  if(Number(request.headers.get('Content-Length')||'0')>8000)return null;
  const text=await request.text();
  if(text.length>6000)return null;
  try{const obj=JSON.parse(text);return obj && typeof obj==='object'&&!Array.isArray(obj)?obj:null}
  catch{return null}
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
  if(!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<12||
     !env.SESSION_SECRET||env.SESSION_SECRET.length<32){
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
  const header=request.headers.get('Authorization')||'';
  if(!header.startsWith('Bearer ')||
     !await verifySession(header.slice(7),env.SESSION_SECRET)){
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
