/* ホーム: 管理者承認済みの写真をリール風に一枚ずつ閲覧。公開APIのみ使用。 */
(() => {
  'use strict';
  const grid=document.querySelector('#home-photo-grid');
  const status=document.querySelector('#home-photo-status');
  if(!grid||!status)return;

  const frame=document.createElement('div');
  frame.className='home-reels-frame swipe-exempt';
  frame.hidden=true;
  grid.before(frame);
  frame.append(grid);
  grid.tabIndex=0;
  grid.setAttribute('role','region');
  grid.setAttribute('aria-label','承認済み写真。上下にスワイプするか、上下矢印キーで切り替えられます');

  const progress=document.createElement('span');
  progress.className='home-reel-progress';
  progress.setAttribute('aria-live','polite');
  const hint=document.createElement('span');
  hint.className='home-reel-hint';
  hint.textContent='上下にスワイプ';
  const controls=document.createElement('div');
  controls.className='home-reel-controls';
  const previous=document.createElement('button');
  const next=document.createElement('button');
  for(const [button,symbol,label] of [[previous,'↑','前の写真'],[next,'↓','次の写真']]){
    button.type='button';
    button.textContent=symbol;
    button.setAttribute('aria-label',label);
    controls.append(button);
  }
  frame.append(progress,hint,controls);

  let api='',total=0,active=0,scrollPending=false;
  try{
    const url=new URL(window.HOKKAIDO_NEWS_API_URL);
    if(url.protocol==='https:'&&!url.username&&!url.password&&!url.search&&!url.hash&&
       (url.pathname===''||url.pathname==='/'))api=url.origin;
  }catch{}

  function update(index){
    active=Math.max(0,Math.min(total-1,index));
    progress.textContent=(active+1)+' / '+total;
    previous.disabled=active===0;
    next.disabled=active===total-1;
  }
  function go(index){
    if(!total)return;
    const target=Math.max(0,Math.min(total-1,index));
    update(target);
    grid.scrollTo({
      top:target*grid.clientHeight,
      behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'
    });
  }
  previous.addEventListener('click',()=>go(active-1));
  next.addEventListener('click',()=>go(active+1));
  grid.addEventListener('scroll',()=>{
    if(scrollPending||!total)return;
    scrollPending=true;
    requestAnimationFrame(()=>{
      scrollPending=false;
      if(grid.clientHeight)update(Math.round(grid.scrollTop/grid.clientHeight));
    });
  },{passive:true});
  grid.addEventListener('keydown',event=>{
    let destination;
    if(event.key==='ArrowDown'||event.key==='PageDown')destination=active+1;
    else if(event.key==='ArrowUp'||event.key==='PageUp')destination=active-1;
    else if(event.key==='Home')destination=0;
    else if(event.key==='End')destination=total-1;
    else return;
    event.preventDefault();
    go(destination);
  });

  async function loadLatest(){
    frame.hidden=true;
    grid.replaceChildren();
    total=0;
    if(!api){status.textContent='写真の読み込み先が設定されていません。';return}
    status.textContent='写真を確認しています…';
    try{
      const response=await fetch(api+'/api/photos',{
        method:'GET',cache:'no-store',credentials:'omit'
      });
      if(!response.ok)throw new Error('Photos API unavailable');
      const result=await response.json();
      // 一般公開APIが返す承認済み写真のみ。承認待ちAPIにはアクセスしない。
      const approved=Array.isArray(result.items)?result.items.filter(item=>
        item && typeof item.id==='string' && /^[0-9a-f-]{36}$/.test(item.id)):[];
      if(!approved.length){
        status.textContent='まだ公開された写真はありません。アルバムから写真を投稿できます。';
        return;
      }
      for(const [index,item] of approved.entries()){
        const card=document.createElement('article');
        card.className='home-photo-card';
        card.setAttribute('aria-label','写真 '+(index+1)+' / '+approved.length);
        const img=document.createElement('img');
        img.src=api+'/api/photos/'+item.id+'/image';
        img.alt='承認された北海道旅行の写真';
        img.loading=index===0?'eager':'lazy';
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
        grid.append(card);
      }
      total=approved.length;
      frame.hidden=false;
      grid.scrollTop=0;
      update(0);
      status.textContent='';
    }catch{
      status.textContent='写真を読み込めませんでした。アルバムからも確認できます。';
    }
  }
  window.HOKKAIDO_REFRESH_HOME_PHOTOS=loadLatest;
  loadLatest();
})();
