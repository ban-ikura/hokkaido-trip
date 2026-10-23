/* 公開アルバム: 管理者承認済みの写真を縦スワイプで一枚ずつ表示。 */
(() => {
  'use strict';
  const grid=document.querySelector('#photo-grid');
  const status=document.querySelector('#gallery-status');
  const count=document.querySelector('#photo-count');
  const refresh=document.querySelector('#photo-reload');
  if(!grid||!status||!count||!refresh)return;

  const frame=document.createElement('div');
  frame.className='photo-reels-frame swipe-exempt';
  frame.hidden=true;
  grid.before(frame);
  frame.append(grid);
  grid.tabIndex=0;
  grid.setAttribute('role','region');
  grid.setAttribute('aria-label','承認済み写真。上下にスワイプするか、上下矢印キーで切り替えられます');

  const progress=document.createElement('span');
  progress.className='photo-reel-progress';
  progress.setAttribute('aria-live','polite');
  const hint=document.createElement('span');
  hint.className='photo-reel-hint';
  hint.textContent='上下にスワイプ';
  const controls=document.createElement('div');
  controls.className='photo-reel-controls';
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
    const target=new URL(window.HOKKAIDO_NEWS_API_URL);
    if(target.protocol==='https:'&&!target.username&&!target.password&&!target.search&&!target.hash&&
       (target.pathname===''||target.pathname==='/'))api=target.origin;
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

  async function load(){
    frame.hidden=true;
    grid.replaceChildren();
    total=0;
    count.textContent='';
    status.textContent='アルバムを読み込み中…';
    refresh.disabled=true;
    if(!api){
      status.textContent='写真アルバムは準備中です。';
      refresh.disabled=false;
      return;
    }
    try{
      const response=await fetch(api+'/api/photos',{method:'GET',cache:'no-store',credentials:'omit'});
      if(!response.ok)throw Error('準備中');
      const data=await response.json();
      // 公開APIから取得できる承認済み写真だけを表示。
      const items=Array.isArray(data.items)?data.items.filter(x=>
        x && typeof x.id==='string' && /^[0-9a-f-]{36}$/.test(x.id)):[];
      count.textContent='· '+items.length+'枚';
      if(!items.length){
        status.textContent='まだ公開された写真はありません。最初の1枚を待っています。';
        return;
      }
      for(const [index,p] of items.entries()){
        const card=document.createElement('article');
        card.className='photo-card';
        card.setAttribute('aria-label','写真 '+(index+1)+' / '+items.length);
        const img=document.createElement('img');
        img.loading=index===0?'eager':'lazy';
        img.decoding='async';
        img.alt='承認された北海道旅行の写真';
        img.referrerPolicy='no-referrer';
        img.src=api+'/api/photos/'+p.id+'/image';
        const info=document.createElement('div');
        info.className='photo-info';
        const author=document.createElement('strong');
        author.textContent=typeof p.nickname==='string'?p.nickname:'匿名';
        const caption=document.createElement('p');
        caption.textContent=typeof p.caption==='string'?p.caption:'';
        info.append(author,caption);
        card.append(img,info);
        grid.append(card);
      }
      total=items.length;
      frame.hidden=false;
      grid.scrollTop=0;
      update(0);
      status.textContent='';
    }catch{
      status.textContent='写真アルバムは準備中です。少し時間をおいてお試しください。';
    }finally{
      refresh.disabled=false;
    }
  }
  refresh.addEventListener('click',load);
  window.HOKKAIDO_REFRESH_GALLERY=load;
  load();
})();
