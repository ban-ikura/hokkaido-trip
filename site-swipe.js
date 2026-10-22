/* モバイル: 上部ナビの通常ページ間を左右スワイプで移動。
 * フォーム・写真・行程表などの横方向操作は優先して干渉しない。 */
(() => {
  'use strict';
  const routes=[
    'index.html','index.html#schedule','guide.html','stay.html','safety.html','photos.html'
  ];
  const pathname=location.pathname.split('/').pop()||'index.html';
  const current=pathname==='index.html' && location.hash==='#schedule'?
    'index.html#schedule':pathname;
  const position=routes.indexOf(current);
  if(position<0)return;

  const nav=document.querySelector('.site-header nav');
  if(nav){
    const currentAnchor=Array.from(nav.querySelectorAll('a')).find(a=>
      a.getAttribute('href')===current
    );
    if(currentAnchor){
      currentAnchor.classList.add('swipe-current');
      // 横スクロール可能なスマホナビでは現在のタブを見える位置に置く。
      if(nav.scrollWidth>nav.clientWidth+8){
        const left=currentAnchor.offsetLeft-nav.offsetLeft-
          (nav.clientWidth-currentAnchor.offsetWidth)/2;
        nav.scrollLeft=Math.max(0,left);
      }
    }
  }

  // スワイプ後に遷移してきたページに、移動方向を示す短いアニメーション。
  try{
    const direction=sessionStorage.getItem('hokkaido-page-swipe');
    if(direction==='left'||direction==='right'){
      sessionStorage.removeItem('hokkaido-page-swipe');
      if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
        document.body.classList.add('swipe-arrive-'+direction);
      }
    }
  }catch{}

  const content=document.querySelector('main');
  if(!content)return;
  const exclude=[
    'a','button','input','textarea','select','label','summary','details',
    '[contenteditable]','[role="button"]','[role="slider"]',
    '.timeline-viewport','.timeline-track','.timeline-controls',
    '.photo-grid','.home-photo-grid','.checklist-grid','.course-tabs',
    '.scroll-button','.route-event','.day-card',
    '.carousel','.gallery','.swipe-exempt'
  ].join(',');
  let touch=null;
  let navigating=false;
  content.addEventListener('touchstart',event=>{
    touch=null;
    if(navigating||event.touches.length!==1)return;
    if(event.target.closest(exclude))return;
    const point=event.touches[0];
    // ブラウザー標準の「戻る」エッジスワイプを奪わない。
    if(point.clientX<30||point.clientX>window.innerWidth-30)return;
    touch={x:point.clientX,y:point.clientY,time:Date.now()};
  },{passive:true});
  content.addEventListener('touchcancel',()=>{touch=null},{passive:true});
  content.addEventListener('touchend',event=>{
    if(!touch||navigating||event.changedTouches.length!==1){touch=null;return}
    const start=touch;
    touch=null;
    const point=event.changedTouches[0];
    const dx=point.clientX-start.x,dy=point.clientY-start.y;
    if(Math.abs(dx)<85||Math.abs(dx)<Math.abs(dy)*1.8||
       Date.now()-start.time>850)return;
    const step=dx<0?1:-1;
    const destination=routes[position+step];
    if(!destination)return;
    navigating=true;
    const direction=step>0?'left':'right';
    try{sessionStorage.setItem('hokkaido-page-swipe',direction)}catch{}
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.body.classList.add('swipe-away-'+direction);
      setTimeout(()=>{location.assign(destination)},145);
    }else{
      location.assign(destination);
    }
  },{passive:true});
})();
