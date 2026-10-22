/* 公開アルバム: サーバーで承認済みの写真だけを読み込みます。 */
(() => {
  'use strict';
  const grid=document.querySelector('#photo-grid');
  const status=document.querySelector('#gallery-status');
  const count=document.querySelector('#photo-count');
  const refresh=document.querySelector('#photo-reload');
  let api='';
  try{
    const target=new URL(window.HOKKAIDO_NEWS_API_URL);
    if(target.protocol==='https:'&&!target.username&&!target.password&&!target.search&&!target.hash&&
       (target.pathname===''||target.pathname==='/'))api=target.origin;
  }catch{}
  async function load(){
    grid.replaceChildren();
    count.textContent='';
    status.textContent='アルバムを読み込み中…';
    refresh.disabled=true;
    if(!api){status.textContent='写真アルバムは準備中です。';refresh.disabled=false;return}
    try{
      const response=await fetch(api+'/api/photos',{method:'GET',cache:'no-store',credentials:'omit'});
      if(!response.ok)throw Error('準備中');
      const data=await response.json();
      const items=Array.isArray(data.items)?data.items.filter(x=>
        x && typeof x.id==='string' && /^[0-9a-f-]{36}$/.test(x.id)):[];
      count.textContent='· '+items.length+'枚';
      if(!items.length){
        status.textContent='まだ公開された写真はありません。最初の1枚を待っています。';
        return;
      }
      status.textContent='';
      for(const p of items){
        const card=document.createElement('article');card.className='photo-card';
        const img=document.createElement('img');img.loading='lazy';img.decoding='async';
        img.alt='承認された北海道旅行の写真';img.referrerPolicy='no-referrer';
        img.src=api+'/api/photos/'+p.id+'/image';
        const info=document.createElement('div');info.className='photo-info';
        const author=document.createElement('strong');author.textContent=typeof p.nickname==='string'?p.nickname:'匿名';
        const caption=document.createElement('p');caption.textContent=typeof p.caption==='string'?p.caption:'';
        info.append(author,caption);card.append(img,info);grid.append(card);
      }
    }catch{status.textContent='写真アルバムは準備中です。少し時間をおいてお試しください。'}
    finally{refresh.disabled=false}
  }
  refresh.addEventListener('click',load);
  load();
})();
