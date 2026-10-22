/* ホーム: 承認済み投稿写真のうち最新2枚だけを表示。閲覧API以外は使用しない。 */
(() => {
  'use strict';
  const grid=document.querySelector('#home-photo-grid');
  const status=document.querySelector('#home-photo-status');
  if(!grid||!status)return;

  let api='';
  try{
    const url=new URL(window.HOKKAIDO_NEWS_API_URL);
    if(url.protocol==='https:'&&!url.username&&!url.password&&!url.search&&!url.hash&&
       (url.pathname===''||url.pathname==='/'))api=url.origin;
  }catch{}

  async function loadLatest(){
    if(!api){status.textContent='写真の読み込み先が設定されていません。';return}
    try{
      const response=await fetch(api+'/api/photos',{
        method:'GET',cache:'no-store',credentials:'omit'
      });
      if(!response.ok)throw new Error('Photos API unavailable');
      const result=await response.json();
      const approved=Array.isArray(result.items)?result.items.filter(item=>
        item && typeof item.id==='string' && /^[0-9a-f-]{36}$/.test(item.id)).slice(0,2):[];
      grid.replaceChildren();
      if(!approved.length){
        status.textContent='まだ公開された写真はありません。アルバムから写真を投稿できます。';
        return;
      }
      for(const item of approved){
        const link=document.createElement('a');
        link.className='home-photo-card';
        link.href='photos.html';
        const img=document.createElement('img');
        img.src=api+'/api/photos/'+item.id+'/image';
        img.alt='';
        img.loading='lazy';
        img.decoding='async';
        img.referrerPolicy='no-referrer';
        const info=document.createElement('span');
        info.className='home-photo-caption';
        const author=document.createElement('span');
        author.className='home-photo-author';
        author.textContent=typeof item.nickname==='string'?item.nickname:'匿名';
        const caption=document.createElement('span');
        caption.className='home-photo-text';
        caption.textContent=typeof item.caption==='string'?item.caption:'';
        info.append(author,caption);
        link.append(img,info);
        grid.append(link);
      }
      status.textContent='';
    }catch{
      status.textContent='写真を読み込めませんでした。アルバムからも確認できます。';
    }
  }
  loadLatest();
})();
