/* Approved photos: random left/right editorial backgrounds plus hero slideshow.
 * Public GET /api/photos is the only data source. No captions in backgrounds. */
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
 layer.setAttribute('aria-hidden','true');
 layer.style.setProperty('--ambient-art-top',position+'%');
 // Natural size variance makes the spacing less repetitive.
 layer.style.setProperty('--ambient-art-size',Math.round(195+Math.random()*120)+'px');
 const img=document.createElement('img');
 img.src=url(item);img.alt='';
 img.decoding='async';img.loading='lazy';img.referrerPolicy='no-referrer';
 img.addEventListener('error',()=>{
  const picked=layer.classList.contains('ambient-desktop-pick');
  layer.remove();
  // If the featured image fails to load, pick another public approved photo.
  if(picked){
   const main=target.closest('main');
   const options=main?[...main.querySelectorAll('.ambient-photo-background')]:[];
   if(options.length)options[Math.floor(Math.random()*options.length)].classList.add('ambient-desktop-pick');
  }
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
 // Desktop shows exactly one random crisp ambient photo on each page.
 // Smaller screens keep the sparse, scattered photos.
 if(layers.length){
  // Prefer a roomy section so the full sharp center is visible rather than clipped.
  const roomy=layers.filter(layer=>layer.parentElement?.getBoundingClientRect().height>=280);
  const pool=roomy.length?roomy:layers;
  pool[Math.floor(Math.random()*pool.length)].classList.add('ambient-desktop-pick');
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
 const main=document.querySelector('main');
 if(!main||!types.has(document.body.dataset.page))return;
 main.querySelectorAll('.ambient-photo-background').forEach(n=>n.remove());
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
  decorate(main,items);
  if(document.body.dataset.page==='home')heroSlides(main,items);
 }catch{/* Decorative photos must not affect essential travel information. */}
}
document.addEventListener('hokkaido:pagechange',render);
window.addEventListener('pagehide',()=>{++serial;if(timer)clearInterval(timer);timer=null});
render();
})();
