/* 宿泊・食事ページ: PDFが公開済みの場合だけ閲覧リンクを表示。 */
(() => {
  'use strict';
  const link=document.querySelector('#allergy-pdf-link');
  const status=document.querySelector('#allergy-pdf-status');
  if(!link||!status)return;
  const path=link.getAttribute('href');
  if(path!=='allergy-guide.pdf')return;

  fetch(path,{method:'HEAD',cache:'no-store',credentials:'omit'})
    .then(response=>{
      if(!response.ok)throw new Error('not found');
      const type=response.headers.get('content-type')||'';
      // HTMLの404フォールバック等をPDFとして案内しない。
      if(type.includes('text/html'))throw new Error('wrong content type');
      link.hidden=false;
      status.hidden=true;
    })
    .catch(()=>{
      link.hidden=true;
      status.textContent='PDFの掲載準備中です。学校配布の資料をご確認ください。';
    });
})();