/* 投稿専用管理画面。パスワードとセッショントークンは永続保存しない。 */
(() => {
  'use strict';
  const loginPanel=document.querySelector('#login-panel');
  const postPanel=document.querySelector('#post-panel');
  const loginForm=document.querySelector('#login-form');
  const postForm=document.querySelector('#post-form');
  const loginButton=document.querySelector('#login-button');
  const publishButton=document.querySelector('#publish-button');
  const passwordInput=document.querySelector('#admin-password');
  const loginStatus=document.querySelector('#login-status');
  const postStatus=document.querySelector('#post-status');
  const setupStatus=document.querySelector('#setup-status');
  const publishedLink=document.querySelector('#published-link');
  const logout=document.querySelector('#logout-button');
  const managementTabs={
    news:document.querySelector('#admin-tab-news'),
    photos:document.querySelector('#admin-tab-photos')
  };
  const managementPanels={
    news:document.querySelector('#admin-news-panel'),
    photos:document.querySelector('#admin-photos-panel')
  };
  let activeManagementTab='news';
  let accessToken='';
  let expiresAt=0;
  const siteKey=typeof window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY==='string'?
    window.HOKKAIDO_PHOTO_TURNSTILE_SITE_KEY.trim():'';
  let challengeToken='',challengeWidget=null;
  let photoFilter='pending';
  let photoGeneration=0;
  let photoObserver=null;
  const photoUrls=[];

  function configuredApi(){
    const value=window.HOKKAIDO_NEWS_API_URL;
    if(typeof value!=='string'||!value.trim())return '';
    try{
      const url=new URL(value.trim());
      if(url.protocol!=='https:'||url.username||url.password||url.hash||url.search||
         (url.pathname!==''&&url.pathname!=='/'))return '';
      return url.origin;
    }catch{return ''}
  }
  const api=configuredApi();
  function challengeReady(){loginButton.disabled=!api||!challengeToken}
  function resetChallenge(){
    challengeToken='';
    if(challengeWidget!==null&&window.turnstile){
      try{window.turnstile.reset(challengeWidget)}catch{}
    }
    challengeReady();
  }
  function initLoginChallenge(){
    if(!siteKey){status(loginStatus,'安全確認の設定が必要です。','error');return}
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true;
    script.onload=()=>{
      try{
        challengeWidget=window.turnstile.render('#admin-turnstile',{
          sitekey:siteKey,theme:'light',action:'admin_login',
          callback:value=>{challengeToken=value;challengeReady()},
          'expired-callback':resetChallenge,
          'error-callback':()=>{
            resetChallenge();
            status(loginStatus,'安全確認に失敗しました。再読み込みしてください。','error');
          }
        });
      }catch{
        status(loginStatus,'安全確認を起動できませんでした。','error');
      }
    };
    script.onerror=()=>status(loginStatus,'安全確認を読み込めませんでした。','error');
    document.head.append(script);
  }
  function status(element,message,type){
    element.textContent=message||'';
    element.dataset.kind=type||'';
  }
  function showLogin(message,type){
    accessToken='';expiresAt=0;
    resetChallenge();
    passwordInput.value='';
    postForm.reset();
    publishedLink.hidden=true;
    loginPanel.hidden=false;
    postPanel.hidden=true;
    status(loginStatus,message||'',type||'');
    status(postStatus,'','');
    clearPhotoPreviews();
    document.querySelector('#photo-mod-list').replaceChildren();
    switchManagementTab('news');
  }
  function showPost(){
    passwordInput.value='';
    loginPanel.hidden=true;
    postPanel.hidden=false;
    status(loginStatus,'','');
    status(postStatus,'','');
    switchManagementTab('news');
    document.querySelector('#notice-title').focus();
  }
  async function readResponse(response){
    let data;
    try{data=await response.json()}catch{data={}}
    if(!response.ok){
      const error=new Error(typeof data.error==='string'?data.error:'通信に失敗しました。時間をおいて再試行してください。');
      error.status=response.status;
      throw error;
    }
    return data;
  }
  if(!api){
    setupStatus.hidden=false;
    status(loginStatus,'認証サーバー接続先を設定すると利用できます。','error');
  }else{
    initLoginChallenge();
  }
  loginForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!api||!challengeToken||loginButton.disabled||!loginForm.reportValidity())return;
    const password=passwordInput.value;
    const turnstileToken=challengeToken;
    loginButton.disabled=true;
    status(loginStatus,'確認中…','');
    try{
      const response=await fetch(api+'/api/login',{
        method:'POST',mode:'cors',credentials:'omit',cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({password,turnstile_token:turnstileToken})
      });
      const data=await readResponse(response);
      if(typeof data.token!=='string'||!Number.isInteger(data.expires_at)){
        throw new Error('認証結果が不正です。');
      }
      accessToken=data.token;
      expiresAt=data.expires_at;
      showPost();
    }catch(error){
      status(loginStatus,error instanceof TypeError?'接続できません。管理担当者に認証サーバーの設定を確認してください。':error.message,'error');
    }finally{
      passwordInput.value='';
      resetChallenge();
    }
  });
  postForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!postForm.reportValidity()||publishButton.disabled)return;
    if(!accessToken||Math.floor(Date.now()/1000)>=expiresAt){
      showLogin('ログインの有効期限が切れました。もう一度ログインしてください。','error');
      return;
    }
    const title=document.querySelector('#notice-title').value.trim();
    const body=document.querySelector('#notice-body').value.trim();
    const important=document.querySelector('#notice-important').checked;
    if(title.length<2||title.length>120||body.length<1||body.length>1500){
      status(postStatus,'タイトル2〜120文字、本文1〜1500文字で入力してください。','error');
      return;
    }
    publishButton.disabled=true;
    publishedLink.hidden=true;
    status(postStatus,'投稿中…','');
    try{
      const response=await fetch(api+'/api/announcements',{
        method:'POST',mode:'cors',credentials:'omit',cache:'no-store',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+accessToken},
        body:JSON.stringify({title,body,important})
      });
      const data=await readResponse(response);
      if(data.ok!==true)throw new Error('投稿の確認に失敗しました。');
      postForm.reset();
      status(postStatus,'お知らせを投稿しました。','success');
      publishedLink.hidden=false;
    }catch(error){
      if(error.status===401){
        showLogin('ログインの有効期限が切れました。もう一度ログインしてください。','error');
      }else{
        status(postStatus,error instanceof TypeError?'通信できませんでした。通信状態をご確認ください。':error.message,'error');
      }
    }finally{
      publishButton.disabled=false;
    }
  });

  /* 上位タブ：お知らせ投稿／写真承認。どちらも同じ認証セッションを利用する。 */
  function switchManagementTab(name,focusTab=false,swipeDirection=''){
    if(name!=='news'&&name!=='photos')return;
    const previous=activeManagementTab;
    activeManagementTab=name;
    for(const key of ['news','photos']){
      const selected=key===name;
      managementTabs[key].classList.toggle('is-active',selected);
      managementTabs[key].setAttribute('aria-selected',String(selected));
      managementTabs[key].tabIndex=selected?0:-1;
      managementPanels[key].hidden=!selected;
    }
    if(previous==='photos'&&name!=='photos'){
      clearPhotoPreviews();
      modList.replaceChildren();
    }
    const newPanel=managementPanels[name];
    newPanel.classList.remove('swipe-in-from-left','swipe-in-from-right');
    if(swipeDirection==='left'||swipeDirection==='right'){
      // タブの移動方向に応じて、中身が滑り込むアニメーションを表示。
      requestAnimationFrame(()=>{
        if(!newPanel.hidden)newPanel.classList.add(
          swipeDirection==='left'?'swipe-in-from-right':'swipe-in-from-left'
        );
      });
    }
    if(name==='photos'&&previous!=='photos'&&accessToken)loadModeration();
    if(focusTab)managementTabs[name].focus();
  }
  const managementKeys=['news','photos'];
  for(const [index,key] of managementKeys.entries()){
    managementTabs[key].addEventListener('click',()=>switchManagementTab(key));
    managementTabs[key].addEventListener('keydown',event=>{
      let target=-1;
      if(event.key==='ArrowRight')target=(index+1)%managementKeys.length;
      if(event.key==='ArrowLeft')target=(index+managementKeys.length-1)%managementKeys.length;
      if(event.key==='Home')target=0;
      if(event.key==='End')target=managementKeys.length-1;
      if(target<0)return;
      event.preventDefault();
      switchManagementTab(managementKeys[target],true);
    });
  }

  function attachHorizontalSwipe(surface,onSwipe,exclude=''){
    let start=null;
    surface.addEventListener('touchstart',event=>{
      start=null;
      if(event.touches.length!==1)return;
      if(exclude && event.target.closest(exclude))return;
      const point=event.touches[0];
      if(point.clientX<28||point.clientX>window.innerWidth-28)return;
      start={x:point.clientX,y:point.clientY,at:Date.now()};
    },{passive:true});
    surface.addEventListener('touchcancel',()=>{start=null},{passive:true});
    surface.addEventListener('touchend',event=>{
      if(!start||event.changedTouches.length!==1){start=null;return}
      const origin=start;
      start=null;
      const point=event.changedTouches[0];
      const dx=point.clientX-origin.x;
      const dy=point.clientY-origin.y;
      if(Math.abs(dx)<75||Math.abs(dx)<Math.abs(dy)*1.7||
         Date.now()-origin.at>900)return;
      onSwipe(dx<0?'left':'right');
    },{passive:true});
  }
  // 大きな管理者タブ：左右のスワイプ。フォーム入力中や画像操作は除外。
  const changeManagementBySwipe=direction=>{
    const target=direction==='left'?'photos':'news';
    if(target!==activeManagementTab)switchManagementTab(target,false,direction);
  };
  attachHorizontalSwipe(document.querySelector('.admin-tabs'),changeManagementBySwipe);
  attachHorizontalSwipe(postPanel,changeManagementBySwipe,
    'input,textarea,select,label,a,button,.admin-tabs,.photo-mod-list,.photo-mod-tabs,.photo-mod-card');

  /* 生徒写真の承認画面。ログイン時の同じ署名付きトークンを利用する。 */
  const modStatus=document.querySelector('#photo-mod-status');
  const modList=document.querySelector('#photo-mod-list');
  const tabPending=document.querySelector('#photo-tab-pending');
  const tabApproved=document.querySelector('#photo-tab-approved');
  function clearPhotoPreviews(){
    photoGeneration++;
    if(photoObserver){photoObserver.disconnect();photoObserver=null}
    for(const url of photoUrls)URL.revokeObjectURL(url);
    photoUrls.length=0;
  }
  function setPhotoFilter(name){
    photoFilter=name;
    tabPending.classList.toggle('selected',name==='pending');
    tabApproved.classList.toggle('selected',name==='approved');
    tabPending.setAttribute('aria-pressed',String(name==='pending'));
    tabApproved.setAttribute('aria-pressed',String(name==='approved'));
    loadModeration();
  }
  async function adminFetch(url,options={}){
    const headers={'Authorization':'Bearer '+accessToken,...(options.headers||{})};
    return fetch(api+url,{
      ...options,mode:'cors',credentials:'omit',cache:'no-store',headers
    });
  }
  async function loadPhotoPreview(img,id,generation){
    try{
      if(!accessToken)return;
      const response=await adminFetch('/api/admin/photos/'+id+'/image');
      if(!response.ok)return;
      const blob=await response.blob();
      if(generation!==photoGeneration||!accessToken)return;
      const objectUrl=URL.createObjectURL(blob);
      photoUrls.push(objectUrl);
      img.src=objectUrl;
    }catch{}
  }
  async function reviewAction(id,action,button){
    const message=action==='approve'?'この写真を公開しますか？':
      action==='reject'?'この写真を却下し、保存画像を削除しますか？':
      'この写真の公開を取り消し、保存画像を削除しますか？';
    if(!window.confirm(message))return;
    button.disabled=true;
    status(modStatus,'処理中…','');
    try{
      await readResponse(await adminFetch('/api/admin/photos/'+id+'/'+action,{method:'POST'}));
      await loadModeration();
      status(modStatus,'写真を処理しました。','success');
    }catch(error){
      status(modStatus,error.message,'error');
      button.disabled=false;
    }
  }
  async function loadModeration(){
    if(!accessToken || !api)return;
    clearPhotoPreviews();
    const generation=photoGeneration;
    modList.replaceChildren();
    status(modStatus,'写真を読み込み中…','');
    try{
      const data=await readResponse(await adminFetch('/api/admin/photos?status='+photoFilter));
      if(generation!==photoGeneration)return;
      const items=Array.isArray(data.items)?data.items:[];
      status(modStatus,items.length?items.length+'件の'+(photoFilter==='pending'?'承認待ち':'公開中')+'の写真があります。':
        (photoFilter==='pending'?'承認待ちの写真はありません。':'公開中の写真はありません。'),'');
      if('IntersectionObserver' in window){
        photoObserver=new IntersectionObserver(entries=>{
          for(const entry of entries){
            if(entry.isIntersecting){
              photoObserver?.unobserve(entry.target);
              loadPhotoPreview(entry.target,entry.target.dataset.photoId,generation);
            }
          }
        },{rootMargin:'250px'});
      }
      for(const item of items){
        if(!/^[0-9a-f-]{36}$/.test(item.id))continue;
        const article=document.createElement('article');
        article.className='photo-mod-card';
        const img=document.createElement('img');
        img.alt='承認審査する投稿写真';
        img.dataset.photoId=item.id;
        const meta=document.createElement('div');
        meta.className='photo-mod-meta';
        const name=document.createElement('strong');
        name.textContent=typeof item.nickname==='string'?item.nickname:'匿名';
        const caption=document.createElement('p');
        caption.textContent=typeof item.caption==='string'?item.caption:'';
        const date=document.createElement('small');
        date.textContent=new Date(item.created_at).toLocaleString('ja-JP');
        const buttons=document.createElement('div');
        buttons.className='photo-mod-buttons';
        const actions=photoFilter==='pending'?
          [['approve','承認・公開'],['reject','却下']]:
          [['unpublish','掲載取り消し']];
        for(const [action,label] of actions){
          const button=document.createElement('button');
          button.type='button';
          button.className=action;
          button.textContent=label;
          button.addEventListener('click',()=>reviewAction(item.id,action,button));
          buttons.append(button);
        }
        meta.append(name,caption,date,buttons);
        article.append(img,meta);
        modList.append(article);
        if(photoObserver)photoObserver.observe(img);
        else loadPhotoPreview(img,item.id,generation);
      }
    }catch(error){
      if(error.status===401){
        showLogin('ログインの有効期限が切れました。もう一度ログインしてください。','error');
      }else{
        status(modStatus,'写真の承認機能は準備中、または通信できません。お知らせの投稿は引き続き利用できます。','error');
      }
    }
  }
  tabPending.addEventListener('click',()=>setPhotoFilter('pending'));
  tabApproved.addEventListener('click',()=>setPhotoFilter('approved'));
  // 写真承認タブの「承認待ち」「公開中」も左右スワイプで切り替えられる。
  const changePhotoFilterBySwipe=direction=>{
    if(activeManagementTab!=='photos')return;
    const target=direction==='left'?'approved':'pending';
    if(target!==photoFilter){
      setPhotoFilter(target);
      modList.classList.remove('swipe-in-from-left','swipe-in-from-right');
      requestAnimationFrame(()=>modList.classList.add(
        direction==='left'?'swipe-in-from-right':'swipe-in-from-left'
      ));
    }
  };
  attachHorizontalSwipe(modList,changePhotoFilterBySwipe,'button,a,input,textarea,select');
  attachHorizontalSwipe(document.querySelector('.photo-mod-tabs'),changePhotoFilterBySwipe);
  document.querySelector('#photo-mod-reload').addEventListener('click',loadModeration);

  logout.addEventListener('click',()=>showLogin('ログアウトしました。','success'));
  window.addEventListener('pagehide',()=>{
    accessToken='';expiresAt=0;
    passwordInput.value='';
  });
})();
