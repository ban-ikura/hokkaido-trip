/* Approved gallery: square photo grid; tap any thumbnail for full-screen vertical reels. */
(()=>{
'use strict';
const grid=document.querySelector('#photo-grid');
const status=document.querySelector('#gallery-status');
const count=document.querySelector('#photo-count');
const refresh=document.querySelector('#photo-reload');
if(!grid||!status||!count||!refresh)return;
grid.classList.add('gallery-photo-grid','swipe-exempt');
grid.setAttribute('aria-label','管理者承認済み写真のギャラリー');

let api='';
try{
 const u=new URL(window.HOKKAIDO_NEWS_API_URL);
 if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&
 (u.pathname==='/'||u.pathname===''))api=u.origin;
}catch{}
const valid=/^[0-9a-f-]{36}$/;
const photoUrl=p=>api+'/api/photos/'+p.id+'/image';
const name=p=>typeof p.nickname==='string'&&p.nickname.trim()?p.nickname:'匿名';
const caption=p=>typeof p.caption==='string'?p.caption:'';

const dialog=document.createElement('dialog');
dialog.className='gallery-reel-dialog swipe-exempt';
dialog.setAttribute('aria-label','全画面の写真リール');
const viewport=document.createElement('div');
viewport.className='gallery-reel-viewport swipe-exempt';
viewport.tabIndex=0;
viewport.setAttribute('role','region');
viewport.setAttribute('aria-label','上下にスワイプして写真を切り替え');
const close=document.createElement('button');
close.type='button';close.className='gallery-reel-close';
close.setAttribute('aria-label','アルバムに戻る');close.textContent='×';
const progress=document.createElement('span');
progress.className='gallery-reel-progress';
progress.setAttribute('aria-live','polite');
const hint=document.createElement('span');
hint.className='gallery-reel-hint';hint.textContent='上下にスワイプ';
const controls=document.createElement('div');
controls.className='gallery-reel-controls';
const up=document.createElement('button');
const down=document.createElement('button');
for(const [button,symbol,label] of [[up,'↑','前の写真'],[down,'↓','次の写真']]){
 button.type='button';button.textContent=symbol;
 button.setAttribute('aria-label',label);controls.append(button);
}
dialog.append(viewport,progress,hint,close,controls);
document.body.append(dialog);

let photos=[],selected=0,lastFocus=null,requestId=0,scrollScheduled=false;
function update(index){
 if(!photos.length)return;
 selected=Math.max(0,Math.min(photos.length-1,index));
 progress.textContent=(selected+1)+' / '+photos.length;
 up.disabled=selected===0;
 down.disabled=selected===photos.length-1;
}
function stepTo(index,animate=true){
 if(!photos.length)return;
 const target=Math.max(0,Math.min(photos.length-1,index));
 update(target);
 viewport.scrollTo({
  top:target*viewport.clientHeight,
  behavior:animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'
 });
}
function dismiss(){if(dialog.open)dialog.close()}
function show(index,button){
 if(!photos.length||typeof dialog.showModal!=='function')return;
 lastFocus=button;
 dialog.showModal();
 document.documentElement.classList.add('gallery-reel-open');
 // Reset the scroll position immediately, even on repeat openings.
 requestAnimationFrame(()=>{
  if(!dialog.open)return;
  stepTo(index,false);
  close.focus({preventScroll:true});
 });
}
close.addEventListener('click',dismiss);
up.addEventListener('click',()=>stepTo(selected-1));
down.addEventListener('click',()=>stepTo(selected+1));
dialog.addEventListener('close',()=>{
 document.documentElement.classList.remove('gallery-reel-open');
 if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
 lastFocus=null;
});
viewport.addEventListener('scroll',()=>{
 if(scrollScheduled||!dialog.open)return;
 scrollScheduled=true;
 requestAnimationFrame(()=>{
  scrollScheduled=false;
  if(viewport.clientHeight)update(Math.round(viewport.scrollTop/viewport.clientHeight));
 });
},{passive:true});
dialog.addEventListener('keydown',event=>{
 if(event.key==='ArrowDown'||event.key==='PageDown'){
  event.preventDefault();stepTo(selected+1);
 }else if(event.key==='ArrowUp'||event.key==='PageUp'){
  event.preventDefault();stepTo(selected-1);
 }else if(event.key==='Home'){
  event.preventDefault();stepTo(0);
 }else if(event.key==='End'){
  event.preventDefault();stepTo(photos.length-1);
 }
});
document.addEventListener('hokkaido:pagechange',dismiss);
window.addEventListener('pagehide',dismiss);

function render(items){
 grid.replaceChildren();
 viewport.replaceChildren();
 photos=items;
 const tiles=document.createDocumentFragment();
 const reels=document.createDocumentFragment();
 items.forEach((p,index)=>{
  const tile=document.createElement('button');
  tile.type='button';tile.className='photo-card album-thumb';
  tile.setAttribute('aria-label',name(p)+'さんの写真、'+(index+1)+' / '+items.length+'。拡大表示');
  const preview=document.createElement('img');
  preview.src=photoUrl(p);preview.alt='承認済みの旅行写真';
  preview.loading=index<8?'eager':'lazy';
  preview.decoding='async';preview.referrerPolicy='no-referrer';
  const symbol=document.createElement('span');
  symbol.className='album-thumb-expand';symbol.setAttribute('aria-hidden','true');symbol.textContent='↗';
  tile.append(preview,symbol);
  tile.addEventListener('click',()=>show(index,tile));
  tiles.append(tile);

  const slide=document.createElement('article');
  slide.className='gallery-reel-slide';
  slide.setAttribute('aria-label','写真 '+(index+1)+' / '+items.length);
  const photo=document.createElement('img');
  photo.src=photoUrl(p);photo.alt='承認された北海道旅行の写真';
  photo.decoding='async';photo.loading='lazy';photo.referrerPolicy='no-referrer';
  const info=document.createElement('div');
  info.className='gallery-reel-info';
  const author=document.createElement('strong');author.textContent=name(p);
  const text=document.createElement('p');text.textContent=caption(p);
  info.append(author,text);
  slide.append(photo,info);reels.append(slide);
 });
 grid.append(tiles);
 viewport.append(reels);
}
async function load(){
 const call=++requestId;
 dismiss();
 grid.replaceChildren();viewport.replaceChildren();photos=[];
 count.textContent='';status.textContent='読み込み中…';
 refresh.disabled=true;
 if(!api){status.textContent='写真アルバムは準備中です。';refresh.disabled=false;return}
 try{
  const r=await fetch(api+'/api/photos',{method:'GET',cache:'no-store',credentials:'omit'});
  if(!r.ok)throw Error('Public photos unavailable');
  const data=await r.json();
  if(call!==requestId)return;
  const items=Array.isArray(data.items)?data.items.filter(p=>
   p&&typeof p.id==='string'&&valid.test(p.id)):[];
  count.textContent='· '+items.length+'枚';
  if(!items.length){
   status.textContent='まだ公開された写真はありません。最初の1枚を待っています。';
   return;
  }
  render(items);
  status.textContent='';
 }catch{
  if(call===requestId)status.textContent='写真アルバムを取得できませんでした。更新してお試しください。';
 }finally{if(call===requestId)refresh.disabled=false}
}
refresh.addEventListener('click',load);
window.HOKKAIDO_REFRESH_GALLERY=load;
load();
})();