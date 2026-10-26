/* 生徒用アップロード（コード不要）。Turnstile検証と最終承認はWorker側。 */
(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const form=$('#photo-form'),submit=$('#photo-submit'),fileInput=$('#student-photo');
  const preview=$('#photo-preview'),videoPreview=$('#photo-video-preview'),notice=$('#photo-setup'),msg=$('#photo-status');
  const caption=$('#student-caption'),nickname=$('#student-nickname'),permission=$('#photo-permission');
  const uploader=$('.upload-field-caption');
  const siteKey=typeof window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY==='string'?
    window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY.trim():'';
  let api='',ready=false,working=false,token='',widgetId=null,previewUrl='';
  let uploadFormats=['image/webp']; // Preserve compatibility with an older Worker.
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
  const isVideo=file=>/^video\//.test(file.type)||/\.(mp4|mov)$/i.test(file.name);
  function clearPreview(){
    videoPreview.pause();videoPreview.hidden=true;videoPreview.removeAttribute('src');
    videoPreview.load();
    preview.hidden=true;preview.removeAttribute('src');
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    previewUrl='';
    uploader.textContent='写真・動画を選択する';
  }
  fileInput.addEventListener('change',()=>{
    clearPreview();
    const file=fileInput.files?.[0];if(!file)return;
    const movie=isVideo(file);
    const maximum=movie?50:30;
    if(file.size>maximum*1024*1024){
      fileInput.value='';
      report('ファイルが'+maximum+'MBを超えています。別のファイルを選んでください。',true);
      return;
    }
    if(!movie && !(file.type.startsWith('image/')||/\.(heic|heif|avif|jpg|jpeg|png|webp|gif)$/i.test(file.name))){
      fileInput.value='';report('画像（JPEG・PNG・HEICなど）またはMP4・MOV動画を選んでください。',true);return;
    }
    previewUrl=URL.createObjectURL(file);
    if(movie){
      videoPreview.src=previewUrl;videoPreview.hidden=false;
    }else{
      preview.src=previewUrl;preview.hidden=false;
      preview.onerror=()=>{preview.hidden=true;};
    }
    uploader.textContent='選択中：'+file.name.slice(0,60);
    report(movie?'この動画から静止画を1枚切り出して投稿します。':'写真を自動圧縮して投稿します。');
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
      const config=await response.json();
      uploadFormats=Array.isArray(config.upload_formats)?
        config.upload_formats.filter(t=>t==='image/webp'||t==='image/jpeg'):
        ['image/webp'];
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
  // The original file is NEVER uploaded: Canvas strips location/EXIF metadata.
  // MP4/MOV are optional input sources, only ONE still frame is submitted.
  async function readMedia(file){
    const movie=isVideo(file);
    const maximum=movie?50:30;
    if(file.size>maximum*1024*1024)throw Error('ファイルは'+maximum+'MB以下にしてください。');
    const srcUrl=URL.createObjectURL(file);
    let source=null;
    const release=()=>{
      if(source instanceof ImageBitmap)source.close();
      if(source instanceof HTMLVideoElement){source.pause();source.removeAttribute('src');source.load();}
      URL.revokeObjectURL(srcUrl);
    };
    try{
      if(movie){
        const video=document.createElement('video');
        video.muted=true;video.playsInline=true;video.preload='auto';
        source=video;
        await new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>reject(Error('動画の読み込みができません。MP4・MOVをお試しください。')),15000);
          video.addEventListener('loadeddata',()=>{clearTimeout(timer);resolve()},{once:true});
          video.addEventListener('error',()=>{clearTimeout(timer);reject(Error('この動画はブラウザーで開けません。MP4・MOVをお試しください。'))},{once:true});
          video.src=srcUrl;video.load();
        });
        if(Number.isFinite(video.duration)&&video.duration>1){
          await new Promise(resolve=>{
            const timer=setTimeout(resolve,3000);
            video.addEventListener('seeked',()=>{clearTimeout(timer);resolve()},{once:true});
            try{video.currentTime=Math.min(.7,video.duration*.15)}catch{clearTimeout(timer);resolve()}
          });
        }
        if(!video.videoWidth||!video.videoHeight)throw Error('動画から静止画を取得できません。');
        return {source:video,width:video.videoWidth,height:video.videoHeight,release};
      }
      if(typeof createImageBitmap==='function'){
        try{source=await createImageBitmap(file)}catch{}
      }
      if(!source){
        const image=new Image();
        image.src=srcUrl;
        await image.decode().catch(()=>{throw Error('この画像を開けません。JPEGまたはPNGへの変換をお試しください。')});
        source=image;
      }
      const width=source.width||source.naturalWidth;
      const height=source.height||source.naturalHeight;
      if(!width||!height)throw Error('画像のサイズを確認できません。');
      return {source,width,height,release};
    }catch(error){release();throw error}
  }
  async function encodeCanvas(canvas,type,quality){
    let blob=null;
    try{blob=await new Promise(resolve=>canvas.toBlob(resolve,type,quality))}catch{}
    if(blob?.type===type)return blob;
    // Some browsers cannot export WebP with toBlob but can with toDataURL.
    if(type==='image/webp'){
      try{
        const data=canvas.toDataURL('image/webp',quality);
        if(data.startsWith('data:image/webp;base64,')){
          const raw=atob(data.slice(data.indexOf(',')+1));
          const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
          return new Blob([bytes],{type:'image/webp'});
        }
      }catch{}
      // OffscreenCanvas uses a separate encoder on some platforms.
      if(typeof OffscreenCanvas!=='undefined'){
        try{
          const other=new OffscreenCanvas(canvas.width,canvas.height);
          other.getContext('2d').drawImage(canvas,0,0);
          const result=await other.convertToBlob({type:'image/webp',quality});
          if(result.type==='image/webp')return result;
        }catch{}
      }
    }
    return null;
  }
  async function compressPhoto(file){
    const media=await readMedia(file);
    try{
      const {source,width,height}=media;
      if(width>12000||height>12000)throw Error('この画像の大きさを処理できません。');
      const sizes=[1350,1150,950,800,650,480,360];
      const qualities=[.76,.68,.59,.53,.47,.40,.34];
      const canvases=sizes.map(size=>{
        const factor=Math.min(1,size/Math.max(width,height));
        const canvas=document.createElement('canvas');
        canvas.width=Math.max(1,Math.round(width*factor));
        canvas.height=Math.max(1,Math.round(height*factor));
        const ctx=canvas.getContext('2d',{alpha:false});
        if(!ctx)throw Error('このブラウザーでは画像を変換できません。');
        ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(source,0,0,canvas.width,canvas.height);
        return canvas;
      });
      // Continue sending WebP to existing Cloudflare installations.
      for(let i=0;i<canvases.length;i++){
        const out=await encodeCanvas(canvases[i],'image/webp',qualities[i]);
        if(!out)break;
        if(out.size<=300000)return out;
      }
      // JPEG only when the API explicitly advertises secure JPEG support.
      if(!uploadFormats.includes('image/jpeg')){
        throw Error('このブラウザーではWebPを生成できないか、画像を300KBに圧縮できません。投稿サーバーのJPEG対応版が必要です。');
      }
      for(let i=0;i<canvases.length;i++){
        const out=await encodeCanvas(canvases[i],'image/jpeg',qualities[i]);
        if(!out)break;
        if(out.size<=300000)return out;
      }
      throw Error('画像を300KB以下に圧縮できませんでした。別の画像をお試しください。');
    }finally{
      media.release();
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
      data.append('image',image,image.type==='image/jpeg'?'hokkaido.jpg':'hokkaido.webp');
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
