/* Show only approved public photos in whitespace and the homepage hero. */
(()=>{
'use strict';
const valid=/^[0-9a-f-]{36}$/, types=new Set(['home','day','stay','guide','safety']);
let api='';
try{const u=new URL(window.HOKKAIDO_NEWS_API_URL);
 if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&(u.pathname==='/'||!u.pathname))api=u.origin;
}catch{}
if(!api)return;
const url=p=>api+'/api/photos/'+p.id+'/image';
const nick=p=>typeof p.nickname==='string'&&p.nickname.trim()?p.nickname:'匿名';
const caption=p=>typeof p.caption==='string'?p.caption:'';
const random=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){let k=Math.floor(Math.random()*(i+1));[a[i],a[k]]=[a[k],a[i]]}return a};
let cache=null,loadedAt=0,pending=null,serial=0,timer=null;
async function load(){
 if(cache&&Date.now()-loadedAt<180000)return cache;
 if(pending)return pending;
 pending=(async()=>{
  const r=await fetch(api+'/api/photos',{method:'GET',cache:'no-store',credentials:'omit'});
  if(!r.ok)throw Error('Public photos unavailable');
  const j=await r.json();
  cache=Array.isArray(j.items)?j.items.filter(p=>p&&typeof p.id==='string'&&valid.test(p.id)):[];
  loadedAt=Date.now();return cache;
 })();
 try{return await pending}finally{pending=null}
}

// Shared accessible full-screen viewer for photos placed in content gaps.
const dialog=document.createElement('dialog');dialog.className='ambient-viewer';
dialog.setAttribute('aria-label','投稿写真の拡大表示');
const scene=document.createElement('div');scene.className='ambient-viewer-scene';
const image=document.createElement('img');image.alt='管理者承認済みの投稿写真';image.referrerPolicy='no-referrer';scene.append(image);
const button=(label,symbol,cls)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=symbol;b.setAttribute('aria-label',label);return b};
const close=button('閉じる','×','ambient-close');
const prev=button('前の写真','‹','ambient-prev');
const next=button('次の写真','›','ambient-next');
const info=document.createElement('div');info.className='ambient-viewer-info';
const number=document.createElement('span'),author=document.createElement('strong'),description=document.createElement('p');
info.append(number,author,description);
dialog.append(scene,close,prev,next,info);document.body.append(dialog);
let selection=[],at=0,trigger=null;
function choose(index){
 if(!selection.length)return;
 at=Math.max(0,Math.min(selection.length-1,index));
 const p=selection[at];image.src=url(p);
 author.textContent=nick(p);description.textContent=caption(p);
 number.textContent=(at+1)+' / '+selection.length;prev.disabled=at===0;next.disabled=at===selection.length-1;
}
function dismiss(){if(dialog.open)dialog.close()}
function enlarge(photos,index,source){
 if(!dialog.showModal)return;
 selection=photos;trigger=source;choose(index);dialog.showModal();
 document.documentElement.classList.add('ambient-viewer-open');close.focus();
}
close.addEventListener('click',dismiss);prev.addEventListener('click',()=>choose(at-1));next.addEventListener('click',()=>choose(at+1));
dialog.addEventListener('close',()=>{
 document.documentElement.classList.remove('ambient-viewer-open');
 image.removeAttribute('src');if(trigger?.isConnected)trigger.focus({preventScroll:true});trigger=null;
});
dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss()});
document.addEventListener('keydown',e=>{
 if(!dialog.open)return;
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();choose(at+(e.key==='ArrowLeft'?-1:1))}
});
let finger=null;
scene.addEventListener('touchstart',e=>{finger=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{passive:true});
scene.addEventListener('touchend',e=>{
 if(!finger||e.changedTouches.length!==1)return;
 const dx=e.changedTouches[0].clientX-finger.x,dy=e.changedTouches[0].clientY-finger.y;finger=null;
 if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.2)choose(at+(dx<0?1:-1));
},{passive:true});
scene.addEventListener('touchcancel',()=>{finger=null},{passive:true});

function strip(photos){
 const chosen=random(photos).slice(0,Math.min(photos.length,4));
 const outer=document.createElement('aside');outer.className='ambient-photo-strip swipe-exempt';
 outer.setAttribute('aria-label','ランダムに選んだ承認済みの投稿写真');
 const heading=document.createElement('div');heading.className='ambient-strip-heading';
 const title=document.createElement('strong');title.textContent='みんなの旅の写真';
 const guide=document.createElement('small');guide.textContent='ランダム投稿 · 左右にスワイプ';
 heading.append(title,guide);
 const track=document.createElement('div');track.className='ambient-strip-track swipe-exempt';
 track.tabIndex=0;track.setAttribute('aria-label','左右にスクロールできる投稿写真');
 chosen.forEach((p,i)=>{
   const b=button(nick(p)+'さんの写真を大画面で表示','','ambient-photo-card');
   const img=document.createElement('img');img.src=url(p);img.alt='';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
   const name=document.createElement('span');name.textContent=nick(p);b.append(img,name);
   b.addEventListener('click',()=>enlarge(chosen,i,b));track.append(b);
 });
 outer.append(heading,track);return outer;
}
function decorate(main,photos){
 const page=document.body.dataset.page;
 if(page==='home'){
  for(const cls of ['.home-news-section','.home-days-section']){
   const shell=main.querySelector(cls+' > .shell');
   if(shell)shell.append(strip(photos));
  }
 }else if(page==='day'){
  const facts=main.querySelector('.day-facts');if(facts)facts.after(strip(photos));
  const schedule=main.querySelector('.day-schedule-section');if(schedule)schedule.after(strip(photos));
 }else if(page==='stay'||page==='guide'||page==='safety'){
  const grid=main.querySelector('.section-section .content-grid');
  if(grid)grid.insertBefore(strip(photos),grid.children[2]||null);
 }
}
function heroSlides(main,photos){
 const figure=main.querySelector('.home-lead .home-feature-photo'),hero=main.querySelector('.home-lead');
 if(!figure||!hero)return;
 const selection=random(photos).slice(0,Math.min(6,photos.length));
 const layer=document.createElement('div');layer.className='ambient-hero-images';layer.setAttribute('aria-hidden','true');
 const slides=selection.map(p=>{
  const image=document.createElement('img');image.className='ambient-hero-image';
  image.src=url(p);image.alt='';image.referrerPolicy='no-referrer';image.decoding='async';
  layer.append(image);return image;
 });
 figure.append(layer);
 const token=serial;
 function activate(){
  if(token!==serial||!figure.isConnected)return;
  figure.querySelector('video')?.pause();
  hero.classList.add('ambient-hero-ready');
  slides[0].classList.add('active');
  if(slides.length<=1||matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData)return;
  let current=0;
  timer=setInterval(()=>{
   if(token!==serial||document.hidden)return;
   const next=(current+1)%slides.length;
   if(!slides[next].complete||!slides[next].naturalWidth)return;
   slides[current].classList.remove('active');slides[next].classList.add('active');
   current=next;
  },6500);
 }
 if(slides[0].complete&&slides[0].naturalWidth)activate();
 else slides[0].addEventListener('load',activate,{once:true});
}
async function render(){
 const ticket=++serial;
 if(timer){clearInterval(timer);timer=null}
 dismiss();
 const main=document.querySelector('main');
 if(!main||!types.has(document.body.dataset.page))return;
 main.querySelectorAll('.ambient-photo-strip').forEach(n=>n.remove());
 const hero=main.querySelector('.home-lead');
 if(hero)hero.classList.remove('ambient-hero-ready');
 main.querySelector('.ambient-hero-images')?.remove();
 try{
  const items=await load();
  if(ticket!==serial||main!==document.querySelector('main')||!items.length)return;
  decorate(main,items);
  if(document.body.dataset.page==='home')heroSlides(main,items);
 }catch{/* Display no extras rather than disrupting essential site information. */}
}
document.addEventListener('hokkaido:pagechange',render);
window.addEventListener('pagehide',()=>{++serial;if(timer)clearInterval(timer);timer=null;dismiss()});
render();
})();