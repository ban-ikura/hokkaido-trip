/* Lightweight same-document navigation for HOKKAIDO 2026.
 * Pages remain accessible as ordinary links if enhancement is unavailable. */
(()=>{
  'use strict';
  const order=['index.html','day1.html','day2.html','day3.html','day4.html',
               'stay.html','guide.html','safety.html','photos.html'];
  const known=new Set(order);
  const base=location.pathname.slice(0,location.pathname.lastIndexOf('/')+1);
  const currentFile=location.pathname.split('/').pop()||'index.html';
  if(!known.has(currentFile))return;
  const nav=document.querySelector('.site-header nav');
  const menu=document.querySelector('.site-menu');
  if(!nav)return;
  const cache=new Map();
  const pending=new Map();
  const resources=new Map();
  let page=currentFile;
  let busy=false;
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const firstMain=document.querySelector('main');
  const firstFooter=document.querySelector('footer');
  if(!firstMain||!firstFooter)return;
  cache.set(page,{main:firstMain,footer:firstFooter,title:document.title,ready:true,
                  action:document.querySelector('body > a.floating-post')});
  // Top-right shortcuts stay fixed while scrolling; CSS shows them on home only.
  // Body-level placement avoids the main/hero stacking and clipping contexts.
  let photoActions=document.querySelector('body > nav.home-photo-floating-actions');
  if(!photoActions){
    photoActions=document.createElement('nav');
    photoActions.className='home-photo-floating-actions';
    photoActions.setAttribute('aria-label','写真の操作');
    const makeAction=(href,label,cls)=>{
      const link=document.createElement('a');
      link.href=href;
      link.className=cls;
      link.textContent=label;
      return link;
    };
    photoActions.append(
      makeAction('photos-post.html','＋ 写真を投稿','home-photo-floating-post'),
      makeAction('photos.html','アルバムを見る ↗','home-photo-floating-album')
    );
    document.body.append(photoActions);
  }


  // Header and floating photo controls gently fade while scrolling.
  // Both remain clickable, and an open menu always stays fully readable.
  let photoScrollIdle=0;
  function onPhotoScroll(){
    if(!menu?.open)document.body.classList.add('site-header-scrolling');
    if(document.body.dataset.page==='home'||document.body.dataset.photoPage==='gallery')
      document.body.classList.add('photo-action-scrolling');
    clearTimeout(photoScrollIdle);
    photoScrollIdle=setTimeout(()=>{
      document.body.classList.remove('photo-action-scrolling','site-header-scrolling');
    },250);
  }
  document.addEventListener('scroll',onPhotoScroll,{capture:true,passive:true});
  menu?.addEventListener('toggle',()=>{
    if(menu.open)document.body.classList.remove('site-header-scrolling');
  });
  window.addEventListener('pagehide',()=>{
    clearTimeout(photoScrollIdle);
    document.body.classList.remove('photo-action-scrolling','site-header-scrolling');
  },{once:true});


  function route(raw){
    let url;
    try{url=new URL(raw,location.href)}catch{return null}
    if(url.origin!==location.origin)return null;
    const pathname=url.pathname===base?base+'index.html':url.pathname;
    if(!pathname.startsWith(base))return null;
    const name=pathname.slice(base.length);
    if(!known.has(name)||pathname!==base+name)return null;
    return {name,url,hash:url.hash};
  }

  async function getPage(name){
    if(cache.has(name))return cache.get(name);
    if(pending.has(name))return pending.get(name);
    const task=(async()=>{
      const response=await fetch(base+name,{credentials:'same-origin',cache:'force-cache'});
      if(!response.ok)throw Error('Page not available');
      const markup=new DOMParser().parseFromString(await response.text(),'text/html');
      const main=markup.querySelector('main'),footer=markup.querySelector('footer');
      if(!main||!footer||!markup.title)throw Error('Incomplete public page');
      const galleryAction=markup.querySelector('body > a.floating-post');
      const item={main:document.importNode(main,true),footer:document.importNode(footer,true),
                  action:galleryAction?document.importNode(galleryAction,true):null,
                  title:markup.title,ready:false};
      cache.set(name,item);
      return item;
    })();
    pending.set(name,task);
    try{return await task}finally{pending.delete(name)}
  }

  function resource(tag,filename){
    return [...document.querySelectorAll(tag)].find(element=>{
      const src=(element.getAttribute('src')||element.getAttribute('href')||'').split('?')[0];
      return src===filename||src.endsWith('/'+filename);
    });
  }
  function css(filename,version){
    if(resource('link[rel="stylesheet"]',filename))return Promise.resolve();
    if(resources.has(filename))return resources.get(filename);
    const job=new Promise(resolve=>{
      const element=document.createElement('link');
      element.rel='stylesheet';
      element.href=filename+'?v='+version;
      if(filename==='photos.css')element.media='not all';
      element.onload=()=>resolve();
      element.onerror=()=>resolve();
      document.head.append(element);
    });
    resources.set(filename,job);
    return job;
  }
  function js(filename,version){
    if(resource('script[src]',filename))return Promise.resolve();
    if(resources.has(filename))return resources.get(filename);
    const job=new Promise((resolve,reject)=>{
      const element=document.createElement('script');
      element.src=filename+'?v='+version;
      element.async=false;
      element.onload=()=>resolve();
      element.onerror=()=>reject(Error('Missing script: '+filename));
      document.head.append(element);
    });
    resources.set(filename,job);
    return job;
  }

  async function prepare(name){
    await css('style.css','20261023-focus-v2');
    if(name==='photos.html'){
      await css('photos.css','20261028-album-large-tiles-v2');
      // Keep the common minimal theme after the optional gallery stylesheet.
      const theme=resource('link[rel="stylesheet"]','site-swipe.css');
      if(theme)document.head.append(theme);
    }
    if(name==='index.html'){
      await css('photos-home.css','20261023-tap-zoom-v1');
      await css('home-video.css','20261023-compact-toggle-v2');
    }
    if(name==='stay.html')await css('allergy-link.css','20261022-clickable-docs-2');
  }

  async function hydrate(name,item,returning){
    if(name==='photos.html'){
      if(typeof window.HOKKAIDO_NEWS_API_URL!=='string')
        await js('admin-config.js','20261021-worker-connected-1');
      if(!item.ready)await js('photos-gallery.js','20261023-gallery-grid-v2');
      else if(returning)window.HOKKAIDO_REFRESH_GALLERY?.();
    }else{
      if(name==='index.html'&&typeof window.HOKKAIDO_NEWS_API_URL!=='string')
        await js('admin-config.js','20261021-worker-connected-1');
      if(typeof window.HOKKAIDO_REINIT_PUBLIC_PAGE!=='function'){
        await js('trip-data.js','20261026-niseko-thumb-v2');
        await js('app.js','20261024-next-detail-v1');
      }else if(!item.ready){
        window.HOKKAIDO_REINIT_PUBLIC_PAGE();
      }
      if(name==='index.html'){
        if(!item.ready)await js('photos-home.js','20261023-tap-zoom-v1');
        else if(returning){
          window.HOKKAIDO_REFRESH_PUBLIC_HOME?.();
          window.HOKKAIDO_REFRESH_HOME_PHOTOS?.();
        }
      }
      if(name==='stay.html'&&!item.ready)
        await js('allergy-link.js','20261022-2');
    }
    item.ready=true;
  }

  function updateMenu(){
    for(const a of nav.querySelectorAll('a[href]')){
      const target=route(a.getAttribute('href'));
      const selected=target?.name===page;
      a.classList.toggle('swipe-current',!!selected);
      if(selected)a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    }
  }
  function closeMenu(){
    if(menu?.open)menu.open=false;
  }
  function scrollTarget(hash){
    let target=null;
    if(hash){try{target=document.getElementById(decodeURIComponent(hash.slice(1)))}catch{}}
    if(target)target.scrollIntoView({behavior:'instant',block:'start'});
    else window.scrollTo({top:0,behavior:'instant'});
  }

  function swap(name,item){
    document.querySelector('main').replaceWith(item.main);
    document.querySelector('footer').replaceWith(item.footer);
    // Gallery upload link sits at body level, outside the main stacking context.
    document.querySelector('body > a.floating-post')?.remove();
    if(name==='photos.html'&&item.action)document.body.append(item.action);
    delete document.body.dataset.day;
    delete document.body.dataset.photoPage;
    delete document.body.dataset.page;
    if(name==='photos.html')document.body.dataset.photoPage='gallery';
    else if(/^day[1-4]\.html$/.test(name)){
      document.body.dataset.page='day';
      document.body.dataset.day=name.slice(0,-5);
    }else document.body.dataset.page=name==='index.html'?'home':name.slice(0,-5);
    const photoStyle=resource('link[rel="stylesheet"]','photos.css');
    if(photoStyle){
      photoStyle.media=name==='photos.html'?'all':'not all';
      if(name==='photos.html'){
        document.head.append(photoStyle);
        const theme=resource('link[rel="stylesheet"]','site-swipe.css');
        if(theme)document.head.append(theme);
      }
    }
    document.title=item.title;
    page=name;
    updateMenu();
    closeMenu();
    document.dispatchEvent(new Event('hokkaido:pagechange'));
  }

  async function navigate(info,{push=true,direction}={}){
    if(!info||busy)return;
    if(info.name===page){
      closeMenu();
      if(push)history.pushState({tab:page},'',info.url.href);
      scrollTarget(info.hash);
      return;
    }
    busy=true;
    try{
      const item=await getPage(info.name);
      await prepare(info.name);
      const previous=order.indexOf(page),next=order.indexOf(info.name);
      const dir=direction||(next>=previous?'left':'right');
      const returning=item.ready;
      document.documentElement.dataset.tabDirection=dir;
      // Swap content immediately; remote image and data fetching never holds the slide open.
      const perform=()=>{
        swap(info.name,item);
        if(push)history.pushState({tab:page},'',info.url.href);
        scrollTarget(info.hash);
        void hydrate(info.name,item,returning).catch(error=>console.warn('Page module:',error));
      };
      if(document.startViewTransition&&!reduced()){
        const vt=document.startViewTransition(perform);
        await vt.finished;
      }else{
        perform();
        if(!reduced()){
          const main=document.querySelector('main');
          main.classList.add('tab-enter-'+dir);
          main.addEventListener('animationend',()=>main.classList.remove('tab-enter-'+dir),{once:true});
        }
      }
    }catch(error){
      if(push)location.assign(info.url.href);
      else console.warn('Navigation restore:',error);
    }finally{
      busy=false;
      delete document.documentElement.dataset.tabDirection;
    }
  }

  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||
       event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const a=event.target.closest?.('a[href]');
    if(!a){if(menu?.open&&!menu.contains(event.target))closeMenu();return}
    if(a.closest('.site-menu'))closeMenu();
    if(a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
    const target=route(a.href);
    if(!target)return;
    event.preventDefault();
    void navigate(target);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&menu?.open){
      closeMenu();menu.querySelector('summary')?.focus();
    }
  });
  window.addEventListener('popstate',()=>{
    const target=route(location.href);
    if(target)void navigate(target,{push:false});
  });
  window.addEventListener('hashchange',()=>{
    if(route(location.href)?.name===page)updateMenu();
  });

  // Horizontal page swipes are supported on blank/card surfaces.
  // Forms, buttons, map links and the schedule's own horizontal scrolling win.
  const excluded=[
    'a','button','input','textarea','select','label','summary','details',
    '[contenteditable]','[role="button"]','[role="slider"]',
    '.timeline-viewport','.timeline-track','.timeline-controls',
    '.home-photo-grid','.course-tabs','.scroll-button','.route-event',
    '.carousel','.swipe-exempt'
  ].join(',');
  let touch=null;
  document.addEventListener('touchstart',e=>{
    touch=null;
    if(busy||e.touches.length!==1||!document.querySelector('main')?.contains(e.target))return;
    if(e.target.closest(excluded))return;
    const p=e.touches[0];
    if(p.clientX<25||p.clientX>innerWidth-25)return;
    touch={x:p.clientX,y:p.clientY,time:Date.now()};
  },{passive:true});
  document.addEventListener('touchcancel',()=>{touch=null},{passive:true});
  document.addEventListener('touchend',e=>{
    if(!touch||busy||e.changedTouches.length!==1){touch=null;return}
    const start=touch;touch=null;const p=e.changedTouches[0];
    const dx=p.clientX-start.x,dy=p.clientY-start.y;
    if(Math.abs(dx)<78||Math.abs(dx)<Math.abs(dy)*1.65||Date.now()-start.time>900)return;
    const next=order.indexOf(page)+(dx<0?1:-1);
    if(next<0||next>=order.length)return;
    const target=route(new URL(order[next],location.href).href);
    void navigate(target,{direction:dx<0?'left':'right'});
  },{passive:true});

  updateMenu();
  // Optional approved-photo decoration for public informational pages only.
  void (async()=>{
    await css('photo-ambient.css','20261026-niseko-credit-corner-v3');
    if(typeof window.HOKKAIDO_NEWS_API_URL!=='string')
      await js('admin-config.js','20261021-worker-connected-1');
    await js('photo-ambient.js','20261026-niseko-credit-corner-v3');
  })().catch(error=>console.warn('Optional photo decoration:',error));
  // Prefetch at most the neighbouring two HTML pages, not the full itinerary.
  const prefetch=()=>{
    const at=order.indexOf(page);
    [order[at-1],order[at+1]].filter(Boolean).forEach(name=>getPage(name).catch(()=>{}));
  };
  if('requestIdleCallback' in window)requestIdleCallback(prefetch,{timeout:2300});
  else setTimeout(prefetch,1200);
})();
