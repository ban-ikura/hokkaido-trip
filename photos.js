/* 写真は管理者が承認したものだけ公開。生徒用コード不要、Cloudflare Turnstileを利用。 */
(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const form=$('#photo-form'),submit=$('#photo-submit');
  const fileInput=$('#student-photo'),preview=$('#photo-preview');
  const formStatus=$('#photo-status'),setup=$('#photo-setup'),galleryStatus=$('#gallery-status');
  const grid=$('#photo-grid');
  let previewUrl='',ready=false,working=false,captchaToken='',captchaWidget=null;
  const siteKey=typeof window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY==='string'?
    window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY.trim():'';
  const raw=window.HOKKAIDO_NEWS_API_URL;
  let api='';
  try{
    const url=new URL(raw);
    if(url.protocol==='https:' && !url.search && !url.hash && !url.username && !url.password &&
       (url.pathname==='/'||url.pathname===''))api=url.origin;
  }catch{}
  function status(msg,isError=false){
    formStatus.textContent=msg;
    formStatus.className='message'+(isError?' error':' success');
  }
  function updateSubmit(){submit.disabled=!ready||!captchaToken||working}
  function initTurnstile(){
    if(!siteKey){
      setup.textContent='写真の安全確認（Turnstile）の設定がまだ完了していません。';
      return;
    }
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true;
    script.onload=()=>{
      try{
        captchaWidget=window.turnstile.render('#photo-turnstile',{
          sitekey:siteKey,theme:'light',action:'photo_upload',appearance:'interaction-only',
          callback:token=>{captchaToken=token;updateSubmit()},
          'expired-callback':()=>{captchaToken='';updateSubmit()},
          'error-callback':()=>{captchaToken='';updateSubmit();status('安全確認が完了できません。ページを再読み込みしてください。',true)}
        });
      }catch{
        status('安全確認の読み込みに失敗しました。ページを再読み込みしてください。',true);
      }
    };
    script.onerror=()=>status('安全確認が読み込めません。通信環境を確認してください。',true);
    document.head.append(script);
  }
  async function jsonResponse(response){
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'通信に失敗しました。');
    return data;
  }
  async function loadGallery(){
    grid.replaceChildren();
    if(!api){
      galleryStatus.textContent='写真機能は準備中です。';
      setup.textContent='写真投稿システムは準備中です。';
      return;
    }
    galleryStatus.textContent='アルバムを読み込み中…';
    try{
      const result=await jsonResponse(await fetch(api+'/api/photos',{cache:'no-store',credentials:'omit'}));
      ready=true;
      setup.textContent=siteKey?'投稿コードは不要です。安全確認が完了すれば写真を送信できます。投稿後は承認待ちになります。':'写真投稿の安全確認の設定がまだ完了していません。';
      updateSubmit();
      const items=Array.isArray(result.items)?result.items:[];
      galleryStatus.textContent=items.length?items.length+'枚の写真を公開中':'まだ公開された写真はありません。';
      for(const p of items){
        if(!/^[0-9a-f-]{36}$/.test(p.id))continue;
        const card=document.createElement('article');
        card.className='photo-card';
        const img=document.createElement('img');
        img.loading='lazy';
        img.decoding='async';
        img.alt='承認された旅行写真';
        img.referrerPolicy='no-referrer';
        img.src=api+'/api/photos/'+p.id+'/image';
        const info=document.createElement('div');
        info.className='photo-info';
        const name=document.createElement('strong');
        name.textContent=typeof p.nickname==='string'?p.nickname:'匿名';
        const caption=document.createElement('p');
        caption.textContent=typeof p.caption==='string'?p.caption:'';
        info.append(name,caption);
        card.append(img,info);
        grid.append(card);
      }
    }catch(error){
      ready=false;
      setup.textContent='写真投稿システムは準備中です。設定担当者の作業完了までお待ちください。';
      updateSubmit();
      galleryStatus.textContent='写真を取得できませんでした。';
    }
  }
  function clearPreview(){
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    previewUrl='';
    preview.hidden=true;
    preview.removeAttribute('src');
  }
  fileInput.addEventListener('change',()=>{
    clearPreview();
    const file=fileInput.files?.[0];
    if(!file)return;
    if(file.size>30*1024*1024){
      fileInput.value='';
      status('元画像が30MBを超えています。別の画像をお選びください。',true);
      return;
    }
    previewUrl=URL.createObjectURL(file);
    preview.src=previewUrl;
    preview.hidden=false;
    formStatus.textContent='';
  });
  async function reencode(file){
    if(file.size>30*1024*1024)throw new Error('元画像が大きすぎます。');
    let source=null;
    let release=()=>{};
    try{
      if(typeof createImageBitmap==='function'){
        try{source=await createImageBitmap(file)}catch{}
      }
      if(!source){
        const url=URL.createObjectURL(file);
        release=()=>URL.revokeObjectURL(url);
        const image=new Image();
        image.src=url;
        await image.decode();
        source=image;
      }
      const w=source.width||source.naturalWidth,h=source.height||source.naturalHeight;
      if(!w||!h||w>12000||h>12000)throw new Error('画像の大きさを確認できません。');
      const scale=Math.min(1,1600/Math.max(w,h));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(w*scale));
      canvas.height=Math.max(1,Math.round(h*scale));
      const ctx=canvas.getContext('2d',{alpha:false});
      if(!ctx)throw new Error('この端末では画像を処理できません。');
      ctx.fillStyle='#ffffff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(source,0,0,canvas.width,canvas.height);
      const output=await new Promise((resolve,reject)=>{
        canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('このブラウザーはWebP画像の作成に対応していません。')),'image/webp',0.82);
      });
      if(output.type!=='image/webp')throw new Error('WebPへの変換に対応したブラウザーでお試しください。');
      if(output.size>5*1024*1024)throw new Error('画像が5MBを超えています。別の写真でお試しください。');
      return output;
    }finally{
      if(source && typeof source.close==='function')source.close();
      release();
    }
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!ready||submit.disabled||!form.reportValidity())return;
    const file=fileInput.files?.[0];
    if(!file)return;
    if(!captchaToken){status('安全確認が完了するまでお待ちください。',true);return}
    working=true;
    updateSubmit();
    status('写真を圧縮しています…');
    try{
      const photo=await reencode(file);
      const data=new FormData();
      data.append('turnstile_token',captchaToken);
      data.append('nickname',$('#student-nickname').value.trim()||'匿名');
      data.append('caption',$('#student-caption').value.trim());
      data.append('permission',$('#photo-permission').checked?'yes':'no');
      data.append('image',photo,'hokkaido.webp');
      status('承認待ちとして送信しています…');
      await jsonResponse(await fetch(api+'/api/photos/submissions',{
        method:'POST',mode:'cors',credentials:'omit',cache:'no-store',body:data
      }));
      form.reset();
      clearPreview();
      status('送信しました！ 管理者の承認後にアルバムへ表示されます。');
    }catch(error){
      status(error instanceof TypeError?'接続できません。通信状態を確認してください。':error.message,true);
    }finally{
      captchaToken='';
      if(captchaWidget!==null && window.turnstile)window.turnstile.reset(captchaWidget);
      working=false;updateSubmit();
    }
  });
  $('#photo-reload').addEventListener('click',loadGallery);
  window.addEventListener('pagehide',()=>{clearPreview();captchaToken=''});
  initTurnstile();
  loadGallery();
})();
