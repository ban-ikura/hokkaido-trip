/* HOKKAIDO — Same-document tab navigation. Static HTML is prefetched and cached.
 * Only approved public pages participate. Admin and upload stay isolated.
 * No full document reload on tab taps or touch swipes after startup. */
(() => {
  'use strict';
  const order=['index.html','index.html#schedule','guide.html','stay.html','safety.html','photos.html'];
  const pages=['index.html','guide.html','stay.html','safety.html','photos.html'];
  const base=location.pathname.slice(0,location.pathname.lastIndexOf('/')+1);
  const pageName=location.pathname.split('/').pop()||'index.html';
  if(!pages.includes(pageName)||!document.querySelector('.site-header nav'))return;
  const mediaReduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pageCache=new Map();
  const pending=new Map();
  const assets=new Map();
  let currentPage=pageName;
  let currentRoute=currentPage==='index.html'&&location.hash==='#schedule'?
    'index.html#schedule':currentPage;
  let busy=false;
  const nav=document.querySelector('.site-header nav');
  const initialMain=document.querySelector('main');
  const initialFooter=document.querySelector('footer');
  if(!initialMain||!initialFooter)return;
  pageCache.set(currentPage,{main:initialMain,footer:initialFooter,title:document.title,initialized:true});

  function parseRoute(value){
    let url;
    try{url=new URL(value,location.href)}catch{return null}
    if(url.origin!==location.origin)return null;
    const indexAlias=url.pathname===base;
    const page=indexAlias?'index.html':url.pathname.slice(base.length);
    if(!url.pathname.startsWith(base)||!pages.includes(page)||
       (!indexAlias&&url.pathname!==base+page))return null;
    const route=page==='index.html'&&url.hash==='#schedule'?'index.html#schedule':page;
    return {page,route,hash:url.hash,url};
  }

  async function fetchPage(page){
    if(pageCache.has(page))return pageCache.get(page);
    if(pending.has(page))return pending.get(page);
    const task=(async()=>{
      const response=await fetch(base+page,{credentials:'same-origin',cache:'force-cache'});
      if(!response.ok)throw new Error('Page request failed');
      const html=await response.text();
      const parsed=new DOMParser().parseFromString(html,'text/html');
      const main=parsed.querySelector('main');
      const footer=parsed.querySelector('footer');
      if(!main||!footer||!parsed.title)throw new Error('Unexpected page markup');
      const pack={
        main:document.importNode(main,true),
        footer:document.importNode(footer,true),
        title:parsed.title,
        initialized:false
      };
      pageCache.set(page,pack);
      return pack;
    })();
    pending.set(page,task);
    try{return await task}finally{pending.delete(page)}
  }

  function findResource(tag,file){
    return [...document.querySelectorAll(tag)].find(el=>{
      const path=(el.getAttribute('href')||el.getAttribute('src')||'').split('?')[0];
      return path===file||path.endsWith('/'+file);
    });
  }
  function stylesheet(file,version){
    const existing=findResource('link[rel="stylesheet"]',file);
    if(existing)return Promise.resolve(existing);
    if(assets.has(file))return assets.get(file);
    const task=new Promise(resolve=>{
      const link=document.createElement('link');
      link.rel='stylesheet';link.href=file+'?v='+version;
      // Prefetched gallery styles must not restyle the current tab before it slides.
      if(file==='photos.css')link.media='not all';
      link.onload=()=>resolve(link);
      link.onerror=()=>resolve(link);
      document.head.append(link);
    });
    assets.set(file,task);
    return task;
  }
  function script(file,version){
    if(findResource('script[src]',file))return Promise.resolve();
    if(assets.has(file))return assets.get(file);
    const task=new Promise((resolve,reject)=>{
      const node=document.createElement('script');
      node.src=file+'?v='+version;
      node.async=false;
      node.onload=resolve;
      node.onerror=()=>reject(new Error('Script not available: '+file));
      document.head.append(node);
    });
    assets.set(file,task);
    return task;
  }

  async function prepareStyle(page){
    // Keep the universal navigation and website style available on every tab.
    await stylesheet('style.css','20261021-hokkaido-scrollbar-news');
    if(page==='photos.html'){
      await stylesheet('photos.css','20261023-alpine-v1');
    }
    if(page==='index.html')await stylesheet('photos-home.css','20261022-home-photo-post-2');
    if(page==='stay.html')await stylesheet('allergy-link.css','20261022-clickable-docs-2');
  }

  async function initialize(page,pack,restoring){
    if(page==='photos.html'){
      if(typeof window.HOKKAIDO_NEWS_API_URL!=='string')
        await script('admin-config.js','20261021-worker-connected-1');
      if(!pack.initialized){
        await script('photos-gallery.js','20261022-gallery-refresh-1');
      }else if(restoring && typeof window.HOKKAIDO_REFRESH_GALLERY==='function'){
        window.HOKKAIDO_REFRESH_GALLERY();
      }
    }else{
      // News and photo modules must have the Worker URL before home is hydrated.
      if(page==='index.html'&&typeof window.HOKKAIDO_NEWS_API_URL!=='string')
        await script('admin-config.js','20261021-worker-connected-1');
      const initializedApp=typeof window.HOKKAIDO_REINIT_PUBLIC_PAGE==='function';
      if(!initializedApp){
        await script('trip-data.js','20261021-nihontravel-priority-r2');
        await script('app.js','20261023-no-news-v1');
      }else if(!pack.initialized){
        window.HOKKAIDO_REINIT_PUBLIC_PAGE();
      }
      if(page==='index.html'){
        if(!pack.initialized){
          await script('photos-home.js','20261022-home-refresh-1');
        }else if(restoring && typeof window.HOKKAIDO_REFRESH_HOME_PHOTOS==='function'){
          window.HOKKAIDO_REFRESH_HOME_PHOTOS();
        }
      }
      if(page==='stay.html'&&!pack.initialized){
        await script('allergy-link.js','20261022-2');
      }
    }
    pack.initialized=true;
  }

  function selectTab(route){
    for(const anchor of nav.querySelectorAll('a')){
      const target=parseRoute(anchor.getAttribute('href'));
      const active=target?.route===route;
      anchor.classList.toggle('swipe-current',!!active);
      if(active)anchor.setAttribute('aria-current','page');
      else anchor.removeAttribute('aria-current');
    }
    const selected=nav.querySelector('a.swipe-current');
    if(selected&&nav.scrollWidth>nav.clientWidth+8){
      const offset=selected.offsetLeft-nav.offsetLeft-
        (nav.clientWidth-selected.offsetWidth)/2;
      nav.scrollTo({left:Math.max(0,offset),behavior:mediaReduced()?'instant':'smooth'});
    }
  }

  function jumpToHash(hash){
    if(hash){
      let element=null;
      try{element=document.getElementById(decodeURIComponent(hash.slice(1)))}catch{}
      if(element){element.scrollIntoView({behavior:'instant',block:'start'});return}
    }
    window.scrollTo({top:0,behavior:'instant'});
  }

  function swap(page,pack){
    const oldMain=document.querySelector('main');
    const oldFooter=document.querySelector('footer');
    if(!oldMain||!oldFooter)throw new Error('Current page missing');
    oldMain.replaceWith(pack.main);
    oldFooter.replaceWith(pack.footer);
    delete document.body.dataset.photoPage;
    delete document.body.dataset.page;
    if(page==='photos.html')document.body.dataset.photoPage='gallery';
    else document.body.dataset.page=page==='index.html'?'home':page.slice(0,-5);
    const photoStyle=findResource('link[rel="stylesheet"]','photos.css');
    if(photoStyle){
      photoStyle.media=page==='photos.html'?'all':'not all';
      if(page==='photos.html')document.head.append(photoStyle);
    }
    document.title=pack.title;
    currentPage=page;
  }

  async function navigate(target,{push=true,direction=''}={}){
    const info=typeof target==='string'?parseRoute(target):target;
    if(!info||busy)return;
    if(info.page===currentPage){
      currentRoute=info.route;
      if(push)history.pushState({publicTab:info.route},'',info.url.href);
      selectTab(currentRoute);
      jumpToHash(info.hash);
      return;
    }
    busy=true;
    try{
      // The destination HTML and styles are prepared before the visible slide.
      const pack=await fetchPage(info.page);
      await prepareStyle(info.page);
      const source=order.indexOf(currentRoute);
      const destination=order.indexOf(info.route);
      const side=direction||(destination>=source?'left':'right');
      document.documentElement.dataset.tabDirection=side;
      const isRestore=pack.initialized;
      const update=async()=>{
        swap(info.page,pack);
        currentRoute=info.route;
        selectTab(currentRoute);
        if(push)history.pushState({publicTab:currentRoute},'',info.url.href);
        await initialize(info.page,pack,isRestore);
        jumpToHash(info.hash);
      };
      if(document.startViewTransition&&!mediaReduced()){
        const transition=document.startViewTransition(update);
        await transition.finished;
      }else{
        await update();
        if(!mediaReduced()){
          const main=document.querySelector('main');
          main.classList.add('tab-enter-'+side);
          main.addEventListener('animationend',()=>main.classList.remove('tab-enter-'+side),{once:true});
        }
      }
    }catch(error){
      // Full navigation only if enhancement fails; links remain usable.
      if(push)location.assign(info.url.href);
      else console.warn('Tab restore failed',error);
    }finally{
      busy=false;
      delete document.documentElement.dataset.tabDirection;
    }
  }

  window.addEventListener('hashchange',()=>{
    const route=parseRoute(location.href);
    if(route&&route.page===currentPage){
      currentRoute=route.route;
      selectTab(currentRoute);
    }
  });

  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const anchor=event.target.closest?.('a[href]');
    if(!anchor||anchor.hasAttribute('download')||
       (anchor.target&&anchor.target!=='_self'))return;
    const info=parseRoute(anchor.href);
    if(!info)return;
    event.preventDefault();
    void navigate(info);
  });

  window.addEventListener('popstate',()=>{
    const url=parseRoute(location.href);
    if(url)void navigate(url,{push:false});
  });

  // Native vertical scroll and timeline horizontal scroll take precedence.
  const excluded=[
    'a','button','input','textarea','select','label','summary','details',
    '[contenteditable]','[role="button"]','[role="slider"]',
    '.timeline-viewport','.timeline-track','.timeline-controls',
    '.home-photo-grid','.checklist-grid','.course-tabs',
    '.scroll-button','.route-event','.day-card','.carousel','.swipe-exempt'
  ].join(',');
  let touch=null;
  document.addEventListener('touchstart',event=>{
    touch=null;
    if(busy||event.touches.length!==1||!document.querySelector('main')?.contains(event.target))return;
    if(event.target.closest(excluded))return;
    const point=event.touches[0];
    if(point.clientX<28||point.clientX>innerWidth-28)return;
    touch={x:point.clientX,y:point.clientY,time:Date.now()};
  },{passive:true});
  document.addEventListener('touchcancel',()=>{touch=null},{passive:true});
  document.addEventListener('touchend',event=>{
    if(!touch||busy||event.changedTouches.length!==1){touch=null;return}
    const start=touch;touch=null;
    const point=event.changedTouches[0];
    const dx=point.clientX-start.x,dy=point.clientY-start.y;
    if(Math.abs(dx)<85||Math.abs(dx)<Math.abs(dy)*1.8||
       Date.now()-start.time>850)return;
    const step=dx<0?1:-1;
    const destination=order.indexOf(currentRoute)+step;
    if(destination<0||destination>=order.length)return;
    const route=order[destination];
    void navigate(new URL(route,base?location.origin+base:location.href).href,{
      direction:dx<0?'left':'right'
    });
  },{passive:true});

  selectTab(currentRoute);
  // Prefetch only the small HTML documents, then switch instantly from cache.
  const prefetch=()=>pages.filter(page=>page!==currentPage).forEach(page=>{
    fetchPage(page).catch(()=>{});
  });
  if('requestIdleCallback' in window)
    window.requestIdleCallback(prefetch,{timeout:2000});
  else setTimeout(prefetch,650);
})();
