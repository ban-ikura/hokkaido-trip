/* ホーム: 管理者承認済みの写真を小さなカードで横スクロール表示。 */
(() => {
  'use strict';
  const grid=document.querySelector('#home-photo-grid');
  const status=document.querySelector('#home-photo-status');
  if(!grid||!status)return;

  const frame=document.createElement('div');
  frame.className='home-reels-frame swipe-exempt';
  frame.hidden=true;
  grid.before(frame);

  const toolbar=document.createElement('div');
  toolbar.className='home-reels-toolbar';
  const progress=document.createElement('span');
  progress.className='home-reel-progress';
  progress.setAttribute('aria-live','polite');
  const hint=document.createElement('span');
  hint.className='home-reel-hint';
  hint.textContent='左右にスワイプ';
  const controls=document.createElement('div');
  controls.className='home-reel-controls';
  const previous=document.createElement('button');
  const next=document.createElement('button');
  for(const [button,symbol,label] of [[previous,'←','前の写真'],[next,'→','次の写真']]){
    button.type='button';
    button.textContent=symbol;
    button.setAttribute('aria-label',label);
    controls.append(button);
  }
  toolbar.append(progress,hint,controls);
  frame.append(toolbar,grid);

  grid.tabIndex=0;
  grid.setAttribute('role','region');
  grid.setAttribute('aria-label','承認済みの投稿写真。左右にスワイプするか、左右矢印キーで閲覧できます');

  // 拡大表示はアルバムへの移動ではなく、ホーム上の全画面ダイアログで行う。
  const viewer=document.createElement('dialog');
  viewer.className='home-photo-lightbox';
  viewer.setAttribute('aria-label','投稿写真の拡大表示');
  const largeImage=document.createElement('img');
  largeImage.className='home-photo-lightbox-image';
  largeImage.alt='承認された北海道旅行の写真';
  largeImage.referrerPolicy='no-referrer';
  const stage=document.createElement('div');
  stage.className='home-photo-lightbox-stage';
  stage.append(largeImage);
  const closeViewer=document.createElement('button');
  closeViewer.type='button';
  closeViewer.className='home-photo-lightbox-close';
  closeViewer.setAttribute('aria-label','拡大表示を閉じる');
  closeViewer.textContent='×';
  const prevPhoto=document.createElement('button');
  prevPhoto.type='button';
  prevPhoto.className='home-photo-lightbox-prev';
  prevPhoto.setAttribute('aria-label','前の写真を表示');
  prevPhoto.textContent='‹';
  const nextPhoto=document.createElement('button');
  nextPhoto.type='button';
  nextPhoto.className='home-photo-lightbox-next';
  nextPhoto.setAttribute('aria-label','次の写真を表示');
  nextPhoto.textContent='›';
  const viewerInfo=document.createElement('div');
  viewerInfo.className='home-photo-lightbox-info';
  const viewerCount=document.createElement('span');
  viewerCount.className='home-photo-lightbox-count';
  viewerCount.setAttribute('aria-live','polite');
  const viewerAuthor=document.createElement('strong');
  const viewerCaption=document.createElement('p');
  viewerInfo.append(viewerCount,viewerAuthor,viewerCaption);
  viewer.append(stage,closeViewer,prevPhoto,nextPhoto,viewerInfo);
  document.body.append(viewer);

  let api='',total=0,requestId=0,scrollPending=false;
  let items=[],selected=0,returnFocus=null;

  function showSelected(index){
    if(!items.length)return;
    selected=Math.max(0,Math.min(items.length-1,index));
    const item=items[selected];
    largeImage.src=api+'/api/photos/'+item.id+'/image';
    viewerAuthor.textContent=typeof item.nickname==='string'?item.nickname:'匿名';
    viewerCaption.textContent=typeof item.caption==='string'?item.caption:'';
    viewerCount.textContent=(selected+1)+' / '+items.length;
    prevPhoto.disabled=selected===0;
    nextPhoto.disabled=selected===items.length-1;
  }
  function closeLightbox(){
    if(viewer.open)viewer.close();
  }
  function openLightbox(index,card){
    if(!items.length||typeof viewer.showModal!=='function')return;
    returnFocus=card;
    showSelected(index);
    viewer.showModal();
    document.documentElement.classList.add('home-photo-lightbox-open');
    closeViewer.focus();
  }
  closeViewer.addEventListener('click',closeLightbox);
  prevPhoto.addEventListener('click',()=>showSelected(selected-1));
  nextPhoto.addEventListener('click',()=>showSelected(selected+1));
  viewer.addEventListener('close',()=>{
    document.documentElement.classList.remove('home-photo-lightbox-open');
    largeImage.removeAttribute('src');
    if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    returnFocus=null;
  });
  viewer.addEventListener('click',event=>{
    if(event.target===viewer)closeLightbox();
  });
  document.addEventListener('keydown',event=>{
    if(!viewer.open)return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();
      showSelected(selected+(event.key==='ArrowLeft'?-1:1));
    }
  });
  window.addEventListener('popstate',closeLightbox);
  window.addEventListener('pagehide',closeLightbox);
  let swipeStart=null;
  stage.addEventListener('touchstart',event=>{
    swipeStart=event.touches.length===1?
      {x:event.touches[0].clientX,y:event.touches[0].clientY}:null;
  },{passive:true});
  stage.addEventListener('touchend',event=>{
    if(!swipeStart||event.changedTouches.length!==1)return;
    const deltaX=event.changedTouches[0].clientX-swipeStart.x;
    const deltaY=event.changedTouches[0].clientY-swipeStart.y;
    swipeStart=null;
    if(Math.abs(deltaX)>60&&Math.abs(deltaX)>Math.abs(deltaY)*1.2)
      showSelected(selected+(deltaX<0?1:-1));
  },{passive:true});
  stage.addEventListener('touchcancel',()=>{swipeStart=null},{passive:true});
  grid.addEventListener('click',event=>{
    const card=event.target.closest('.home-photo-card');
    if(card&&grid.contains(card))openLightbox([...grid.children].indexOf(card),card);
  });
  try{
    const url=new URL(window.HOKKAIDO_NEWS_API_URL);
    if(url.protocol==='https:'&&!url.username&&!url.password&&!url.search&&!url.hash&&
       (url.pathname===''||url.pathname==='/'))api=url.origin;
  }catch{}

  function cardStep(){
    const cards=grid.children;
    if(cards.length>1)return Math.max(1,cards[1].offsetLeft-cards[0].offsetLeft);
    return Math.max(1,cards[0]?.offsetWidth||grid.clientWidth);
  }
  function currentIndex(){
    return Math.max(0,Math.min(total-1,Math.round(grid.scrollLeft/cardStep())));
  }
  function updateControls(){
    if(!total)return;
    const maxLeft=Math.max(0,grid.scrollWidth-grid.clientWidth);
    progress.textContent=(currentIndex()+1)+' / '+total;
    previous.disabled=grid.scrollLeft<2;
    next.disabled=grid.scrollLeft>=maxLeft-2;
  }
  function goTo(index){
    if(!total)return;
    const target=Math.max(0,Math.min(total-1,index));
    const cards=grid.children;
    const first=cards[0]?.offsetLeft||0;
    const maxLeft=Math.max(0,grid.scrollWidth-grid.clientWidth);
    const left=Math.max(0,Math.min(maxLeft,cards[target].offsetLeft-first));
    grid.scrollTo({
      left,
      behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'
    });
  }
  previous.addEventListener('click',()=>goTo(currentIndex()-1));
  next.addEventListener('click',()=>goTo(currentIndex()+1));
  grid.addEventListener('scroll',()=>{
    if(scrollPending)return;
    scrollPending=true;
    requestAnimationFrame(()=>{
      scrollPending=false;
      updateControls();
    });
  },{passive:true});
  grid.addEventListener('keydown',event=>{
    let target;
    if(event.key==='ArrowRight'||event.key==='PageDown')target=currentIndex()+1;
    else if(event.key==='ArrowLeft'||event.key==='PageUp')target=currentIndex()-1;
    else if(event.key==='Home')target=0;
    else if(event.key==='End')target=total-1;
    else if((event.key==='Enter'||event.key===' ')&&
            event.target.classList.contains('home-photo-card')){
      event.preventDefault();
      openLightbox([...grid.children].indexOf(event.target),event.target);
      return;
    }else return;
    event.preventDefault();
    goTo(target);
  });
  window.addEventListener('resize',updateControls,{passive:true});

  async function loadLatest(){
    const request=++requestId;
    closeLightbox();
    items=[];
    frame.hidden=true;
    grid.replaceChildren();
    total=0;
    if(!api){
      status.textContent='写真の読み込み先が設定されていません。';
      return;
    }
    status.textContent='写真を確認しています…';
    try{
      const response=await fetch(api+'/api/photos',{
        method:'GET',cache:'no-store',credentials:'omit'
      });
      if(!response.ok)throw new Error('Photos API unavailable');
      const result=await response.json();
      if(request!==requestId)return;
      // 公開APIから取得できる、管理者が承認済みの写真のみ。
      const approved=Array.isArray(result.items)?result.items.filter(item=>
        item && typeof item.id==='string' && /^[0-9a-f-]{36}$/.test(item.id)):[];
      if(!approved.length){
        status.textContent='まだ公開された写真はありません。アルバムから写真を投稿できます。';
        return;
      }
      const fragment=document.createDocumentFragment();
      for(const [index,item] of approved.entries()){
        const card=document.createElement('article');
        card.className='home-photo-card';
        card.tabIndex=0;
        card.setAttribute('role','button');
        card.setAttribute('aria-label','写真 '+(index+1)+' / '+approved.length+' を拡大表示');
        const img=document.createElement('img');
        img.src=api+'/api/photos/'+item.id+'/image';
        img.alt='承認された北海道旅行の写真';
        img.loading=index<3?'eager':'lazy';
        img.decoding='async';
        img.referrerPolicy='no-referrer';
        const info=document.createElement('div');
        info.className='home-photo-caption';
        const author=document.createElement('strong');
        author.className='home-photo-author';
        author.textContent=typeof item.nickname==='string'?item.nickname:'匿名';
        const caption=document.createElement('span');
        caption.className='home-photo-text';
        caption.textContent=typeof item.caption==='string'?item.caption:'';
        info.append(author,caption);
        card.append(img,info);
        fragment.append(card);
      }
      grid.append(fragment);
      items=approved;
      total=approved.length;
      frame.hidden=false;
      grid.scrollLeft=0;
      updateControls();
      status.textContent='';
    }catch{
      if(request===requestId)status.textContent='写真を読み込めませんでした。アルバムからも確認できます。';
    }
  }
  window.HOKKAIDO_REFRESH_HOME_PHOTOS=loadLatest;
  loadLatest();
})();
