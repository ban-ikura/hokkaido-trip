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
  const isVideo=file=>/^video\//.test(file.type)||/\.(mp4|mov|mp5)$/i.test(file.name);
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
    previewUrl=URL.createObjectURL(/\.mp5$/i.test(file.name)?new Blob([file],{type:'video/mp4'}):file);
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
    const srcUrl=URL.createObjectURL(/\.mp5$/i.test(file.name)?new Blob([file],{type:'video/mp4'}):file);
    let source=null;
    const release=()=>{
      if(typeof ImageBitmap!=='undefined' && source instanceof ImageBitmap)source.close();
      if(source instanceof HTMLVideoElement){source.pause();source.removeAttribute('src');source.load();}
      URL.revokeObjectURL(srcUrl);
    };
    try{
      if(movie){
        const video=document.createElement('video');
        video.muted=true;video.playsInline=true;video.preload='auto';
        source=video;
        await new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>reject(Error('動画の読み込みができません。MP4に変換してお試しください。')),15000);
          video.addEventListener('loadeddata',()=>{clearTimeout(timer);resolve()},{once:true});
          video.addEventListener('error',()=>{clearTimeout(timer);reject(Error('この動画を再生できません。MP5形式の場合はMP4に変換してお試しください。'))},{once:true});
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
  // Validate pixels against the same strict image parser as Cloudflare Worker.
  // Never send a compressed image unless the server's format validator accepts
  // its exact bytes. This avoids a wasted Turnstile token on unsupported output.
  const PHOTO_LIMIT_BYTES=300000;
  function workerCompatibleWebp(bytes){
    // WebPのRIFF構造を確認。Chrome等の単純形式に加えて、スマホなどが生成する
    // VP8X（拡張静止画）も許可する。アニメーションとEXIF/XMPは受け付けない。
    if(!(bytes instanceof Uint8Array)||bytes.length<32||bytes.length>PHOTO_LIMIT_BYTES)return false;
    const ascii=(n,s)=>[...s].every((c,i)=>bytes[n+i]===c.charCodeAt(0));
    const le32=n=>(bytes[n]|(bytes[n+1]<<8)|(bytes[n+2]<<16)|(bytes[n+3]<<24))>>>0;
    if(!ascii(0,'RIFF')||!ascii(8,'WEBP')||le32(4)!==bytes.length-8)return false;
    let at=12, imageCount=0, extended=false, alpha=false, colorProfile=false, flags=0;
    let imageSeen=false;
    while(at+8<=bytes.length){
      const kind=String.fromCharCode(...bytes.subarray(at,at+4));
      const size=le32(at+4);
      const next=at+8+size+(size&1);
      if(size>PHOTO_LIMIT_BYTES||next>bytes.length)return false;
      if(kind==='VP8X'){
        if(at!==12||extended||size!==10)return false;
        extended=true;
        flags=bytes[at+8];
        // animation, EXIF, XMP and reserved bits are disallowed.
        if(flags&0xCF)return false; // 0xC0 reserved, 0x08 EXIF, 0x04 XMP, 0x02 animation, 0x01 reserved
        const w=1+bytes[at+12]+(bytes[at+13]<<8)+(bytes[at+14]<<16);
        const h=1+bytes[at+15]+(bytes[at+16]<<8)+(bytes[at+17]<<16);
        if(w>4096||h>4096)return false;
      }else if(kind==='ICCP'){
        if(!extended||colorProfile||imageSeen||size<1||size>32768)return false;
        colorProfile=true;
      }else if(kind==='ALPH'){
        if(!extended||alpha||imageSeen||size<1)return false;
        alpha=true;
      }else if(kind==='VP8 '||kind==='VP8L'){
        if(imageSeen||size<(kind==='VP8 '?10:5))return false;
        imageCount++;
        imageSeen=true;
        const start=at+8;
        if(kind==='VP8 '){
          // VP8 lossy key-frame signature.
          if(bytes[start+3]!==0x9d||bytes[start+4]!==0x01||bytes[start+5]!==0x2a)return false;
        }else{
          if(alpha||bytes[start]!==0x2f)return false;
        }
      }else{
        // EXIF/XMP/ANIM/ANMF and unknown chunks are forbidden.
        return false;
      }
      at=next;
    }
    if(at!==bytes.length||imageCount!==1)return false;
    if(extended){
      if(Boolean(flags&0x10)!==alpha)return false;
      if(Boolean(flags&0x20)!==colorProfile)return false;
    }else if(alpha||colorProfile)return false;
    return true;
  }
  // Canvasで再描画した静止JPEGのみ受け付ける。EXIF、XMP、コメント、
  // 埋め込みメタデータが含まれる元画像は拒否する。
  function workerCompatibleJpeg(bytes){
   if(!(bytes instanceof Uint8Array)||bytes.length<32||bytes.length>PHOTO_LIMIT_BYTES)return false;
   const n=bytes.length;
   if(bytes[0]!==0xff||bytes[1]!==0xd8||bytes[n-2]!==0xff||bytes[n-1]!==0xd9)return false;
   let at=2,frame=false;
   while(at+3<n){
    if(bytes[at++]!==0xff)return false;
    while(bytes[at]===0xff)at++;
    const marker=bytes[at++];
    if(marker===0xda){
     const length=(bytes[at]<<8)|bytes[at+1];
     return frame&&length>=6&&at+length<n-2;
    }
    if(marker===0xd8||marker===0xd9||marker===0x01||marker===0x00||
       marker>=0xd0&&marker<=0xd7)return false;
    if(at+2>n)return false;
    const length=(bytes[at]<<8)|bytes[at+1];
    if(length<2||at+length>n-2)return false;
    // Canvas JPEG from Chromium and Safari may carry a standard ICC profile.
    // ICC only describes colors; EXIF, XMP, comments and arbitrary APP markers
    // still remain forbidden (including location/camera metadata).
    if(marker===0xfe||marker>=0xe1&&marker<=0xef&&![0xe2,0xee].includes(marker))return false;
    if(marker===0xe0){
     if(length<7||String.fromCharCode(...bytes.subarray(at+2,at+7))!=='JFIF\0')return false;
    }else if(marker===0xe2){
     if(length<16||String.fromCharCode(...bytes.subarray(at+2,at+14))!=='ICC_PROFILE\0')return false;
    }else if(marker===0xee){
     if(length<14||String.fromCharCode(...bytes.subarray(at+2,at+8))!=='Adobe\0')return false;
    }
    if([0xc0,0xc1,0xc2].includes(marker)){
     if(frame||length<11)return false;
     const height=(bytes[at+3]<<8)|bytes[at+4];
     const width=(bytes[at+5]<<8)|bytes[at+6];
     if(width<1||height<1||width>4096||height>4096)return false;
     frame=true;
    }
    at+=length;
   }
   return false;
  }
  

  async function scrubCanvasOutput(blob){
    if(!blob)return null;
    const bytes=new Uint8Array(await blob.arrayBuffer());
    if(blob.type==='image/jpeg'){
      if(bytes.length<4||bytes[0]!==0xff||bytes[1]!==0xd8)return blob;
      let at=2,last=0,parts=[],removed=false;
      while(at+4<bytes.length){
        if(bytes[at]!==0xff)return blob;
        let cursor=at+1;
        while(bytes[cursor]===0xff)cursor++;
        const marker=bytes[cursor];
        if(marker===0xda)break; // Preserve the entire encoded scan.
        if(marker===0xd8||marker===0xd9||marker===0x00||
           (marker>=0xd0&&marker<=0xd7))return blob;
        if(cursor+2>=bytes.length)return blob;
        const size=(bytes[cursor+1]<<8)|bytes[cursor+2];
        const next=cursor+1+size;
        if(size<2||next>bytes.length)return blob;
        // Discard every APPn/COM block: ICC, EXIF, XMP, Adobe and camera data.
        // Re-encoding via Canvas has already removed the original EXIF/GPS.
        if((marker>=0xe0&&marker<=0xef)||marker===0xfe){
          parts.push(bytes.subarray(last,at));
          last=next;removed=true;
        }
        at=next;
      }
      if(!removed)return blob;
      parts.push(bytes.subarray(last));
      return new Blob(parts,{type:'image/jpeg'});
    }
    if(blob.type==='image/webp'&&bytes.length>=32){
      const ascii=(offset,value)=>[...value].every((c,i)=>bytes[offset+i]===c.charCodeAt(0));
      if(!ascii(0,'RIFF')||!ascii(8,'WEBP'))return blob;
      const read32=at=>(bytes[at]|(bytes[at+1]<<8)|(bytes[at+2]<<16)|(bytes[at+3]<<24))>>>0;
      if(read32(4)!==bytes.length-8)return blob;
      const header=bytes.slice(0,12),chunks=[header];
      let at=12,removed=false;
      while(at+8<=bytes.length){
        const kind=String.fromCharCode(...bytes.subarray(at,at+4));
        const size=read32(at+4),next=at+8+size+(size&1);
        if(next>bytes.length)return blob;
        if(kind==='ICCP'||kind==='EXIF'||kind==='XMP '){
          removed=true;
        }else{
          const part=bytes.slice(at,next);
          if(kind==='VP8X')part[8]&=~0x2c;
          chunks.push(part);
        }
        at=next;
      }
      if(at!==bytes.length||!removed)return blob;
      const length=chunks.reduce((total,item)=>total+item.length,0)-8;
      header[4]=length&255;header[5]=(length>>>8)&255;
      header[6]=(length>>>16)&255;header[7]=(length>>>24)&255;
      return new Blob(chunks,{type:'image/webp'});
    }
    return blob;
  }
  async function verifiedOutput(blob){
    if(!blob)return null;
    const clean=await scrubCanvasOutput(blob);
    if(!clean||clean.size<32||clean.size>PHOTO_LIMIT_BYTES)return null;
    const bytes=new Uint8Array(await clean.arrayBuffer());
    if(clean.type==='image/jpeg'&&workerCompatibleJpeg(bytes))return clean;
    if(clean.type==='image/webp'&&workerCompatibleWebp(bytes))return clean;
    return null;
  }
  async function compressPhoto(file){
    const media=await readMedia(file);
    try{
      const {source,width,height}=media;
      if(width>12000||height>12000)throw Error('この画像の大きさを処理できません。');
      const sizes=[1350,1150,950,800,650,480,360];
      const qualities=[.76,.68,.59,.53,.47,.40,.34];
      const createCanvas=(limit)=>{
        const factor=Math.min(1,limit/Math.max(width,height));
        const canvas=document.createElement('canvas');
        canvas.width=Math.max(1,Math.round(width*factor));
        canvas.height=Math.max(1,Math.round(height*factor));
        const ctx=canvas.getContext('2d',{alpha:false});
        if(!ctx)throw Error('このブラウザーでは画像を変換できません。');
        ctx.fillStyle='#fff';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(source,0,0,canvas.width,canvas.height);
        return canvas;
      };
      // JPEG is better supported on iOS and Android and is the first choice
      // when the server explicitly advertises support for it.
      const types=uploadFormats.includes('image/jpeg')?
        ['image/jpeg','image/webp']:['image/webp'];
      for(const type of types){
        for(let i=0;i<sizes.length;i++){
          const canvas=createCanvas(sizes[i]);
          const result=await encodeCanvas(canvas,type,qualities[i]);
          canvas.width=0;canvas.height=0; // Release large phone canvases.
          if(!result)break;
          const clean=await verifiedOutput(result);
          if(clean)return clean;
        }
      }
      throw Error('このブラウザーの変換画像を送信形式にできませんでした。ページを更新し、JPEGまたはPNGの写真でもお試しください。');
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
