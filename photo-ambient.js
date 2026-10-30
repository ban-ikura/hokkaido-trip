/* Approved photos: random left/right editorial backgrounds plus hero slideshow.
 * Public GET /api/photos is the only data source; wallpaper attribution uses approved caption and nickname. */
(()=>{
'use strict';
const valid=/^[0-9a-f-]{36}$/,types=new Set(['home','day','stay','guide','safety']);
let api='';
try{
 const u=new URL(window.HOKKAIDO_NEWS_API_URL);
 if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&
  (u.pathname==='/'||u.pathname===''))api=u.origin;
}catch{}
if(!api)return;
const url=p=>api+'/api/photos/'+p.id+'/image';
const random=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){
 const k=Math.floor(Math.random()*(i+1));[a[i],a[k]]=[a[k],a[i]]
}return a};
let cache=null,loadedAt=0,pending=null,serial=0,timer=null;

/* The full-page wallpaper displays its own approved public author and caption.
   This badge is created only after the actual selected image has loaded. */
function clearBackgroundCredit(){
 document.querySelectorAll('main > .ambient-photo-credit').forEach(node=>node.remove());
 document.querySelector('main')?.classList.remove('ambient-photo-credited');
}
function showBackgroundCredit(item,ticket){
 if(ticket!==serial||!item)return;
 const main=document.querySelector('main');
 if(!main||!types.has(document.body.dataset.page))return;
 clearBackgroundCredit();
 const badge=document.createElement('aside');
 badge.className='ambient-photo-credit';
 badge.setAttribute('aria-label','背景写真の情報');
 const title=document.createElement('span');
 title.className='ambient-photo-credit-title';
 const caption=typeof item.caption==='string'&&item.caption.trim()?item.caption.trim():'無題';
 title.textContent='「'+caption+'」';
 title.title=caption;
 const author=document.createElement('span');
 author.className='ambient-photo-credit-author';
 const nickname=typeof item.nickname==='string'&&item.nickname.trim()?item.nickname.trim():'匿名';
 author.textContent='撮影：'+nickname;
 badge.append(title,author);
 main.classList.add('ambient-photo-credited');
 main.prepend(badge);
}
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
/* Scatter small, unframed photos into gaps. Soft edge masks are provided in CSS. */
function addBackground(target,item,position){
 if(!target||!item)return;
 const side=Math.random()<.5?'left':'right';
 const layer=document.createElement('div');
 layer.className='ambient-photo-background ambient-art-'+side;
 layer.hidden=true; // Prevent any overlap while safe geometry is being calculated.
 layer.setAttribute('aria-hidden','true');
 layer.style.setProperty('--ambient-art-top',position+'%');
 // Natural size variance makes the spacing less repetitive.
 layer.style.setProperty('--ambient-art-size',Math.round(195+Math.random()*120)+'px');
 const img=document.createElement('img');
 img.src=url(item);img.alt='';
 img.decoding='async';img.loading='lazy';img.referrerPolicy='no-referrer';
 img.addEventListener('error',()=>{
  layer.remove();
  schedulePlacement();
 },{once:true});
 layer.append(img);
 target.classList.add('ambient-photo-target');
 target.prepend(layer);
 return layer;
}
function decorate(main,items){
 const page=document.body.dataset.page;
 let selectors=[];
 if(page==='home'){
  // Two of the three sections, never every section, to retain quiet whitespace.
  selectors=random(['.home-days-section','.home-news-section','.home-useful-section']).slice(0,2);
 }else if(page==='day'){
  selectors=['.day-facts','.day-schedule-section'];
 }else if(page==='stay'||page==='guide'||page==='safety'){
  selectors=['.subhero','.section-section'];
 }
 const photos=random(items);
 const layers=[];
 let used=0;
 for(const selector of selectors){
  const target=main.querySelector(selector);
  if(!target)continue;
  const height=target.getBoundingClientRect().height;
  // Extra photos only in genuinely long gaps, with substantial distance between.
  const positions=height>1150?[24+Math.random()*10,68+Math.random()*10]:
    [31+Math.random()*37];
  for(const top of positions){
   const layer=addBackground(target,photos[used%photos.length],top);
   if(layer)layers.push(layer);
   used++;
  }
 }
 // Placement is validated against actual button, link and card geometry.
 schedulePlacement();
}

/* iPad Safari does not consistently paint fixed CSS body/pseudo backgrounds.
   Reuse the already loaded image as a real, fixed, non-interactive layer. */
function isTabletViewport(){
 return (navigator.maxTouchPoints>1||
         window.matchMedia('(pointer:coarse)').matches)&&
        window.matchMedia('(min-width:700px) and (max-width:1366px)').matches;
}
function clearTabletWallpaper(){
 document.body.classList.remove('ambient-tablet-wallpaper');
 document.querySelectorAll('body > img.ambient-tablet-photo').forEach(img=>img.remove());
}
function installTabletWallpaper(image){
 if(!isTabletViewport())return;
 clearTabletWallpaper();
 image.className='ambient-tablet-photo';
 image.alt='';
 image.setAttribute('aria-hidden','true');
 image.draggable=false;
 document.body.prepend(image);
 document.body.classList.add('ambient-tablet-wallpaper');
}

/* On desktop the approved photo covers the page background itself, instead of
 * inserting a separate full-height photo-only section between information. */
function clearDesktopBackground(){
 document.body.classList.remove('ambient-desktop-page');
 document.body.style.removeProperty('--ambient-desktop-photo');
}
function desktopBackground(items,ticket){
 const chosen=random(items);
 // Keep the original background when the photo API or all images fail.
 function attempt(index){
  if(index>=chosen.length||ticket!==serial)return;
  const test=new Image();
  test.referrerPolicy='no-referrer';
  test.onload=async()=>{
   if(isTabletViewport()&&typeof test.decode==='function'){
    try{await test.decode()}catch{}
   }
   if(ticket!==serial||!document.querySelector('main'))return;
   if(!test.naturalWidth){attempt(index+1);return}
   document.body.style.setProperty('--ambient-desktop-photo','url("'+url(chosen[index])+'")');
   document.body.classList.add('ambient-desktop-page');
   installTabletWallpaper(test);
   showBackgroundCredit(chosen[index],ticket);
  };
  test.onerror=()=>attempt(index+1);
  test.src=url(chosen[index]);
 }
 attempt(0);
}

/* MOBILE HOME FULL-PAGE PHOTO TRIAL (2026-10-26).
   One approved image remains behind the entire scrolling mobile homepage.
   The previous hero slideshow is retained above for easy rollback. */
function clearMobileHomeBackground(){
 document.body.classList.remove('ambient-mobile-home-page');
 document.body.style.removeProperty('--ambient-mobile-home-photo');
}
function mobileHomeBackground(items,ticket){
 const choices=random(items);
 function attempt(i){
  if(i>=choices.length||ticket!==serial||document.body.dataset.page!=='home')return;
  const img=new Image();
  img.referrerPolicy='no-referrer';
  img.onload=async()=>{
   // Decode the approved background fully before revealing it on mobile.
   // Loading alone may still show one frame of the previous fallback.
   if(typeof img.decode==='function'){
    try{await img.decode()}catch{}
   }
   if(ticket!==serial||document.body.dataset.page!=='home'||!document.querySelector('main.home-page'))return;
   if(!img.naturalWidth){attempt(i+1);return}
   document.body.style.setProperty('--ambient-mobile-home-photo','url("'+url(choices[i])+'")');
   document.body.classList.add('ambient-mobile-home-page');
   installTabletWallpaper(img);
   showBackgroundCredit(choices[i],ticket);
  };
  img.onerror=()=>attempt(i+1);
  img.src=url(choices[i]);
 }
 attempt(0);
}

/* Keep every decorative photo strictly outside interactive controls and content
 * cards. Viewport and asynchronously loaded schedules are rechecked on change. */
let placementFrame=0,layoutObserver=null;
const blockedSelector=[
 'a','button','input','select','textarea','label','summary','[role="button"]',
 '[role="link"]','[tabindex]:not([tabindex="-1"])',
 '.home-section-heading','.home-day-list','.news-list','.home-quick-links',
 '.home-photos-section','.home-photo-grid',
 '.day-fact','.day-breadcrumb','.section-heading','.schedule-root',
 '.day-notes','.day-page-nav','.info-card','.content-grid > article',
 '.subhero .shell','.floating-post'
].join(',');

function collision(a,b,pad=15){
 return a.left < b.right+pad && a.right > b.left-pad &&
        a.top < b.bottom+pad && a.bottom > b.top-pad;
}
function findSafePosition(layer,desktop){
 const host=layer.parentElement;
 if(!host||!host.isConnected)return null;
 const bounds=host.getBoundingClientRect();
 if(bounds.width<120||bounds.height<128)return null;
 // The desktop photo-only band contains no buttons or text: fill it edge-to-edge.
 // This avoids clipping the photograph into a centered 980px rectangle.
 if(desktop&&host.classList.contains('ambient-photo-break')){
  return {x:0,y:0,w:bounds.width,h:bounds.height,
          side:'full',area:bounds.width*bounds.height};
 }
 const blockers=[...host.querySelectorAll(blockedSelector)]
  .filter(e=>!layer.contains(e)&&!e.closest('.ambient-photo-background'))
  .map(e=>e.getBoundingClientRect())
  .filter(r=>r.width>2&&r.height>2);
 const featured=host.classList.contains('ambient-photo-break');
 const big=Math.min(980,Math.floor(bounds.width*.91));
 const widths=desktop?
  (featured?[big,Math.floor(big*.88),Math.floor(big*.75),640,510,370]:
            [Math.min(750,Math.floor(bounds.width*.7)),600,480,370,290,190]):
  [200,165,130,105];
 const preference=layer.classList.contains('ambient-art-left')?'left':'right';
 const sides=Math.random()<.15?[preference==='left'?'right':'left',preference]:
   [preference,preference==='left'?'right':'left'];
 const preferred=Number.parseFloat(layer.style.getPropertyValue('--ambient-art-top'))||50;
 const tops=[preferred,18,78,48,35,64,9,90];
 for(const width of widths){
  const w=Math.min(width,bounds.width-18);
  const h=Math.min(Math.round(w*(desktop?.56:.73)),desktop?560:175,bounds.height-16);
  if(w<95||h>bounds.height-12)continue;
  const xs={
   left:[9,Math.max(9,Math.round(bounds.width*.08))],
   right:[bounds.width-w-9,Math.max(9,bounds.width-w-Math.round(bounds.width*.08))]
  };
  for(const side of sides){
   for(const x of xs[side]){
    if(x<0||x+w>bounds.width)continue;
    for(const percent of tops){
     const y=Math.max(7,Math.min(bounds.height-h-7,bounds.height*percent/100-h/2));
     const candidate={
      left:bounds.left+x,top:bounds.top+y,
      right:bounds.left+x+w,bottom:bounds.top+y+h
     };
     if(blockers.every(blocker=>!collision(candidate,blocker))){
      return {x,y,w,h,side,area:w*h};
     }
    }
   }
  }
 }
 return null;
}
function layoutPhotos(){
 const main=document.querySelector('main');
 if(!main)return;
 const layers=[...main.querySelectorAll('.ambient-photo-background')];
 if(!layers.length)return;
 const desktop=window.matchMedia('(min-width:900px)').matches;
 const feasible=[];
 for(const layer of layers){
  layer.hidden=true;
  layer.classList.remove('ambient-desktop-pick');
  const safe=findSafePosition(layer,desktop);
  if(!safe)continue;
  layer.style.left=safe.x+'px';
  layer.style.right='auto';
  layer.style.top=safe.y+'px';
  layer.style.transform='none';
  layer.style.width=safe.w+'px';
  layer.style.height=safe.h+'px';
  feasible.push({layer,area:safe.area});
 }
 if(desktop){
  // Prefer the large photo-only background zone; ordinary sections are fallback.
  if(!feasible.length)return;
  const featured=feasible.filter(x=>x.layer.classList.contains('ambient-desktop-feature'));
  const largest=Math.max(...feasible.map(x=>x.area));
  const roomy=featured.length?featured:feasible.filter(x=>x.area>=largest*.66);
  const chosen=roomy[Math.floor(Math.random()*roomy.length)].layer;
  chosen.classList.add('ambient-desktop-pick');
  chosen.hidden=false;
 }else{
  for(const {layer} of feasible)layer.hidden=false;
 }
}
function schedulePlacement(){
 if(placementFrame)return;
 placementFrame=requestAnimationFrame(()=>{
  placementFrame=0;
  layoutPhotos();
 });
}
function observeLayout(main){
 if(layoutObserver)layoutObserver.disconnect();
 layoutObserver=new MutationObserver(()=>schedulePlacement());
 // Child additions from announcements or schedules may create new collision zones.
 layoutObserver.observe(main,{childList:true,subtree:true});
 schedulePlacement();
}
window.addEventListener('resize',schedulePlacement,{passive:true});
const desktopBreakpoint=window.matchMedia('(min-width:900px)');
desktopBreakpoint.addEventListener?.('change',()=>render());
window.addEventListener('load',schedulePlacement,{once:true});
if(document.fonts?.ready)document.fonts.ready.then(schedulePlacement).catch(()=>{});

function heroSlides(main,photos){
 // Desktop uses the single shared page wallpaper, not a separate hero slideshow.
 if(window.matchMedia('(min-width:900px)').matches)return;
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
 clearBackgroundCredit();
 clearTabletWallpaper();
 clearDesktopBackground();
 clearMobileHomeBackground();
 if(layoutObserver)layoutObserver.disconnect();
 if(placementFrame){cancelAnimationFrame(placementFrame);placementFrame=0}
 if(timer){clearInterval(timer);timer=null}
 const main=document.querySelector('main');
 if(!main||!types.has(document.body.dataset.page))return;
 main.querySelectorAll('.ambient-photo-background').forEach(n=>n.remove());
 main.querySelectorAll('.ambient-photo-break').forEach(n=>n.remove());
 main.querySelectorAll('.ambient-photo-target').forEach(n=>{
  n.classList.remove('ambient-photo-target');
 });
 // Remove the outdated thumbnail strips left by any older cached page.
 main.querySelectorAll('.ambient-photo-strip').forEach(n=>n.remove());
 const hero=main.querySelector('.home-lead');
 if(hero)hero.classList.remove('ambient-hero-ready');
 main.querySelector('.ambient-hero-images')?.remove();
 try{
  const items=await load();
  if(ticket!==serial||main!==document.querySelector('main')||!items.length)return;
  if(window.matchMedia('(min-width:900px)').matches){
   // Desktop background unchanged.
   desktopBackground(items,ticket);
  }else if(document.body.dataset.page==='home'){
   // Trial: one full-page background replaces the small hero slideshow.
   mobileHomeBackground(items,ticket);
  }else{
   decorate(main,items);
   observeLayout(main);
  }
 }catch{/* Decorative photos must not affect essential travel information. */}
}
document.addEventListener('hokkaido:pagechange',render);
window.addEventListener('pagehide',()=>{++serial;clearBackgroundCredit();clearTabletWallpaper();clearDesktopBackground();clearMobileHomeBackground();if(timer)clearInterval(timer);timer=null;if(layoutObserver)layoutObserver.disconnect();if(placementFrame)cancelAnimationFrame(placementFrame)});
render();
})();
