/* 生徒用アップロード（コード不要）。Turnstile検証と最終承認はWorker側。 */
(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const form=$('#photo-form'),submit=$('#photo-submit'),fileInput=$('#student-photo');
  const preview=$('#photo-preview'),notice=$('#photo-setup'),msg=$('#photo-status');
  const caption=$('#student-caption'),nickname=$('#student-nickname'),permission=$('#photo-permission');
  const uploader=$('.upload-field-caption');
  const siteKey=typeof window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY==='string'?
    window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY.trim():'';
  let api='',ready=false,working=false,token='',widgetId=null,previewUrl='';
  try{
    const u=new URL(window.HOKKAIDO_NEWS_API_URL);
    if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&
      (u.pathname===''||u.pathname==='/'))api=u.origin;
  }catch{}
  function report(message,error=false){
    msg.textContent=message;
    msg.className='message'+(error?' error':' success');
  }
  function submitState(){submit.disabled=!ready||working||!token||!siteKey}
  function clearPreview(){
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    previewUrl='';preview.hidden=true;preview.removeAttribute('src');
    uploader.textContent='写真を選択する';
  }
  fileInput.addEventListener('change',()=>{
    clearPreview();
    const file=fileInput.files?.[0];if(!file)return;
    if(file.size>30*1024*1024){fileInput.value='';report('元の写真が30MBを超えています。別の写真を選んでください。',true);return}
    previewUrl=URL.createObjectURL(file);
    preview.src=previewUrl;preview.hidden=false;
    uploader.textContent='選択中：'+file.name.slice(0,60);
    msg.textContent='';
  });
  function initTurnstile(){
    if(!siteKey){notice.textContent='投稿機能の安全確認は準備中です。';return}
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true;
    script.onload=()=>{
      try{
        widgetId=window.turnstile.render('#photo-turnstile',{
          sitekey:siteKey,theme:'light',action:'photo_upload',appearance:'interaction-only',
          callback:value=>{token=value;submitState()},
          'expired-callback':()=>{token='';submitState()},
          'error-callback':()=>{token='';submitState();report('安全確認に失敗しました。ページを再読み込みしてください。',true)}
        });
      }catch{report('安全確認を開始できませんでした。ブラウザーを更新してください。',true)}
    };
    script.onerror=()=>report('安全確認を読み込めません。通信環境を確認してください。',true);
    document.head.append(script);
  }
  async function checkSetup(){
    if(!api||!siteKey){
      notice.textContent='写真投稿システムは準備中です。設定が完了するまで投稿できません。';
      return;
    }
    try{
      const response=await fetch(api+'/api/photos',{cache:'no-store',credentials:'omit'});
      if(!response.ok)throw Error('not ready');
      ready=true;
      notice.textContent='送信すると管理者の承認待ちになります。承認後だけアルバムに表示されます。';
    }catch{
      ready=false;
      notice.textContent='写真投稿機能は準備中です。設定担当者の作業完了までお待ちください。';
    }
    submitState();
  }
  async function readResponse(response){
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(typeof data.error==='string'?data.error:'通信に失敗しました。');
    return data;
  }
  async function compressPhoto(file){
    if(file.size>30*1024*1024)throw Error('元の写真が30MBを超えています。');
    let source=null,free=()=>{};
    try{
      if(typeof createImageBitmap==='function'){
        try{source=await createImageBitmap(file)}catch{}
      }
      if(!source){
        const objectUrl=URL.createObjectURL(file);
        free=()=>URL.revokeObjectURL(objectUrl);
        const image=new Image();image.src=objectUrl;await image.decode();source=image;
      }
      const width=source.width||source.naturalWidth,height=source.height||source.naturalHeight;
      if(!width||!height||width>12000||height>12000)throw Error('この画像の大きさを処理できません。');
      const factor=Math.min(1,1600/Math.max(width,height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(width*factor));
      canvas.height=Math.max(1,Math.round(height*factor));
      const context=canvas.getContext('2d',{alpha:false});
      if(!context)throw Error('このブラウザーでは写真の変換ができません。');
      context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);
      context.drawImage(source,0,0,canvas.width,canvas.height);
      const blob=await new Promise((resolve,reject)=>{
        canvas.toBlob(output=>output?resolve(output):reject(Error('WebP画像を作れませんでした。')),'image/webp',0.82);
      });
      if(blob.type!=='image/webp')throw Error('WebP変換に対応したブラウザーでお試しください。');
      if(blob.size>5*1024*1024)throw Error('写真が5MBを超えています。別の写真を選んでください。');
      return blob;
    }finally{
      if(source&&typeof source.close==='function')source.close();
      free();
    }
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!ready||working||!form.reportValidity())return;
    if(!token){report('安全確認が完了するまでお待ちください。',true);return}
    const file=fileInput.files?.[0];if(!file)return;
    working=true;submitState();report('写真を送信できる形式に変換しています…');
    try{
      const image=await compressPhoto(file);
      const data=new FormData();
      data.append('turnstile_token',token);
      data.append('nickname',nickname.value.trim()||'匿名');
      data.append('caption',caption.value.trim());
      data.append('permission',permission.checked?'yes':'no');
      data.append('image',image,'hokkaido.webp');
      report('管理者の承認待ちとして送信しています…');
      await readResponse(await fetch(api+'/api/photos/submissions',{
        method:'POST',mode:'cors',credentials:'omit',cache:'no-store',body:data
      }));
      form.reset();clearPreview();
      report('送信完了！ 管理者が承認するとアルバムに表示されます。');
    }catch(error){
      report(error instanceof TypeError?'接続できません。通信状態を確認してください。':error.message,true);
    }finally{
      token='';
      if(widgetId!==null&&window.turnstile)window.turnstile.reset(widgetId);
      working=false;submitState();
    }
  });
  window.addEventListener('pagehide',()=>{token='';clearPreview()});
  initTurnstile();checkSetup();
})();
