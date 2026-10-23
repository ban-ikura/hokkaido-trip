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

  let api='',total=0,requestId=0,scrollPending=false;
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
    else return;
    event.preventDefault();
    goTo(target);
  });
  window.addEventListener('resize',updateControls,{passive:true});

  async function loadLatest(){
    const request=++requestId;
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
        card.setAttribute('aria-label','写真 '+(index+1)+' / '+approved.length);
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
