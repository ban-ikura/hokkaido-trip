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
  let accessToken='';
  let expiresAt=0;

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
  function status(element,message,type){
    element.textContent=message||'';
    element.dataset.kind=type||'';
  }
  function showLogin(message,type){
    accessToken='';expiresAt=0;
    passwordInput.value='';
    postForm.reset();
    publishedLink.hidden=true;
    loginPanel.hidden=false;
    postPanel.hidden=true;
    status(loginStatus,message||'',type||'');
    status(postStatus,'','');
  }
  function showPost(){
    passwordInput.value='';
    loginPanel.hidden=true;
    postPanel.hidden=false;
    status(loginStatus,'','');
    status(postStatus,'','');
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
    loginButton.disabled=false;
  }
  loginForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!api||loginButton.disabled||!loginForm.reportValidity())return;
    const password=passwordInput.value;
    loginButton.disabled=true;
    status(loginStatus,'確認中…','');
    try{
      const response=await fetch(api+'/api/login',{
        method:'POST',mode:'cors',credentials:'omit',cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({password})
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
      loginButton.disabled=false;
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
  logout.addEventListener('click',()=>showLogin('ログアウトしました。','success'));
  window.addEventListener('pagehide',()=>{
    accessToken='';expiresAt=0;
    passwordInput.value='';
  });
})();
