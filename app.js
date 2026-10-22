/* HOKKAIDO 2026 — 静的サイト用アプリケーション
 * 外部ライブラリ、Cookie、解析タグ、個人情報の送信なし。
 * JSONお知らせ等はtextContentで描画し、HTMLとして実行しない。
 */
'use strict';
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
const node = (tag, className='', text=null) => {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text !== null) item.textContent = String(text);
  return item;
};
const add = (parent, ...children) => {children.forEach(child=>parent.append(child));return parent};
const minOf = time => {const [h,m]=time.split(':').map(Number);return h*60+m};
const dateStrings = ['2026-12-07','2026-12-08','2026-12-09','2026-12-10'];
const dateNames = ['12月7日（月）','12月8日（火）','12月9日（水）','12月10日（木）'];
const prefsPrefix='hokkaido26-course-';
const choice = Object.create(null);
const getStored=(key)=>{try{return localStorage.getItem(key)}catch(_){return null}};
const setStored=(key,value)=>{try{localStorage.setItem(key,value)}catch(_){/* Storage restricted */}};
const rmStored=key=>{try{localStorage.removeItem(key)}catch(_){}};
const selectedCourse=day=>{
  const id=choice[day.id]||getStored(prefsPrefix+day.id);
  return day.courses.find(course=>course.id===id)||day.courses[0];
};

// 写真は実在する撮影資料のみに限定。読み込み失敗時は案内カードへ切り替える。
const bundledTimelinePhotos = Object.freeze({});
function placePhoto(key,alt){
  const placeholder=node('div','photo-pending');
  placeholder.setAttribute('role','img');
  placeholder.setAttribute('aria-label',alt||'写真は学校の確認後に掲載します');
  placeholder.append(node('span','','写真は確認後に掲載'));
  return placeholder;
}

const externalLink=(text,url)=>{
  const a=node('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';return a;
};

function renderCredits(){
  const host=$('#credits-list');if(!host)return;
  // 公開サイトには提供された画像の著作者や再利用条件を推定で記載しない。
  for(const meta of Object.values(venuePhotos)){
    const p=node('p','credit');
    if(meta.permissionPending){
      p.append(document.createTextNode(meta.label+' — '+meta.author+'／著作者・転載条件：'+meta.license+'（公開前に要確認） · '));
      p.append(externalLink(meta.sourceType==='official'?'公式掲載画像':'提供された縮小画像',meta.source));
    }else{
      p.append(document.createTextNode(meta.label+'（'+meta.year+'撮影） — '+meta.author+' / '));
      p.append(externalLink(meta.license,meta.licenseUrl));
      p.append(document.createTextNode(' · '));
      p.append(externalLink('原典',meta.source));
    }
    host.append(p);
  }
  host.append(node('p','credit','ユーザー提供のGoogle画像6点は行程との対応が未確認の仮配置です。施設そのものを撮影したと保証するものではありません。画像の掲載・転載許可を確認してから公開してください。'));
  host.append(node('p','credit','画像は表示用にトリミングしています。CC BY-SA画像の再利用には原ライセンス条件が適用されます。'));
}

// HTML文字列ではなくテキストノードを作るため、お知らせにHTML文字列があっても実行されません。
function configuredNewsApi(){
  const value=window.HOKKAIDO_NEWS_API_URL;
  if(typeof value!=='string'||!value.trim())return '';
  try{
    const url=new URL(value.trim());
    if(url.protocol!=='https:'||url.username||url.password||url.hash||url.search||
      (url.pathname!==''&&url.pathname!=='/'))return '';
    return url.origin;
  }catch{return ''}
}
async function loadAnnouncements(){
  const host=$('#announcement-list');if(!host)return;
  const count=$('#announcement-count');
  try{
    const api=configuredNewsApi();
    const jobs=[
      fetch('announcements.json',{cache:'no-store',credentials:'same-origin'})
        .then(r=>{if(!r.ok)throw new Error('local '+r.status);return r.json()})
    ];
    if(api)jobs.push(
      fetch(api+'/api/announcements',{cache:'no-store',mode:'cors',credentials:'omit'})
        .then(r=>{if(!r.ok)throw new Error('remote '+r.status);return r.json()})
    );
    const results=await Promise.allSettled(jobs);
    if(results.every(x=>x.status==='rejected'))throw new Error('すべての情報源が使用できません。');
    const listFor=result=>result.status==='fulfilled'&&Array.isArray(result.value.items)
      ? result.value.items.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).slice(0,100)
      : [];
    // 公開APIからの新着投稿を先に置き、同日付ならcreated_atを優先。
    const remoteItems=api?listFor(results[1]):[];
    const localItems=listFor(results[0]);
    const items=[...remoteItems,...localItems].sort((a,b)=>{
      const date=String(b.date??'').localeCompare(String(a.date??''));
      return date||String(b.created_at??'').localeCompare(String(a.created_at??''));
    }).slice(0,200);
    host.replaceChildren();
    if(count)count.textContent=items.length+'件';
    if(!items.length){host.append(node('p','news-empty','現在のお知らせはありません。'));return}
    const renderItem=item=>{
      const row=node('article','news-item'+(item.important===true?' important':''));
      const date=node('time','news-date',/^\d{4}-\d{2}-\d{2}$/.test(String(item.date))?item.date:'日付未設定');
      if(/^\d{4}-\d{2}-\d{2}$/.test(String(item.date)))date.dateTime=item.date;
      const body=node('div','news-body');
      const h=node('h3');if(item.important===true)h.append(node('mark','','重要'));
      h.append(document.createTextNode(String(item.title??'お知らせ').slice(0,140)));
      body.append(h);
      const message=String(item.body??'').slice(0,2000);
      if(message)body.append(node('p','',message));
      row.append(date,body);
      return row;
    };
    const current=node('div','news-current');
    current.append(renderItem(items[0]));host.append(current);
    const history=node('details','news-history');
    const summary=node('summary','news-history-toggle','過去のお知らせの履歴（'+(items.length-1)+'件）を見る');
    const older=node('div','news-history-list');
    items.slice(1).forEach(item=>older.append(renderItem(item)));
    if(items.length===1)older.append(node('p','news-empty','過去のお知らせはまだありません。'));
    history.append(summary,older);host.append(history);
    if(api&&results[1]?.status==='rejected'){
      host.append(node('p','news-sync-warning','新しいお知らせの取得に失敗しました。公開済みのお知らせのみ表示しています。'));
    }
  }catch(_){
    if(count)count.textContent='';
    host.replaceChildren(node('p','news-empty','お知らせを読み込めませんでした。しばらくしてから再読み込みしてください。'));
  }
}
// 日本時間（UTC+09:00）固定。閲覧端末のタイムゾーンに左右されません。
const dateOf=(dayIndex,time)=>Date.parse(dateStrings[dayIndex]+'T'+time+':00+09:00');
const timelineRate=2.5; // 30分 = 75px
// 移動手段は最新行程表の表記に従う。便名・貸切種別は推測しない。
function transportFor(event){
  if(event.type!=='travel')return null;
  if(/飛行機|航空機|ANA53|ANA68/.test(event.title)){
    const flight=event.title.match(/ANA\s*(53|68)\b/);
    return {label:flight?'航空機 ANA'+flight[1]:'飛行機（便名要確認）',icon:'✈'};
  }
  if(/バス/.test(event.title))return {label:'バス',icon:'▰'};
  if(/移動/.test(event.title))return {label:'移動手段 要確認',icon:'↗'};
  return {label:'移動手段 要確認',icon:'↗'};
}
function hasImage(event){
  const key=getPhotoKey(event.title);
  if(!key)return null;
  // ANA便や昼食など、行程に対応した写真がある場合は種類に関わらず掲載。
  if(event.type==='travel' && !/ANA53|ANA68|空港|飛行機|航空機/.test(event.title))return null;
  return key;
}
function renderTimeline(day,course){
  const wrapper=node('div','timeline-wrapper');
  const toolbar=node('div','timeline-toolbar');
  const controls=node('div','timeline-controls');
  controls.append(node('span','scroll-tip','左右にスクロール'));
  for(const [sign,label] of [[-1,'前の時間へ'],[1,'次の時間へ']]){
    const button=node('button','scroll-button',sign===-1?'‹':'›');
    button.type='button';button.setAttribute('aria-label',label);
    button.addEventListener('click',()=>{
      const delta=Math.max(280,Math.round(viewport.clientWidth*.8));
      viewport.scrollBy({left:sign*delta,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
    controls.append(button);
  }
  toolbar.append(controls);wrapper.append(toolbar);
  const viewport=node('div','timeline-viewport');
  viewport.tabIndex=0;viewport.setAttribute('role','region');
  viewport.setAttribute('aria-label',day.date+' '+course.label+'の横スクロール行程表');
  const width=Math.round((minOf(day.end)-minOf(day.start))*timelineRate);
  const canvas=node('div','timeline-inner');canvas.style.width=width+'px';
  const axis=node('div','timeline-axis');axis.setAttribute('aria-hidden','true');
  for(let time=minOf(day.start);time<=minOf(day.end);time+=30){
    const tick=node('div','axis-tick'+(time%60===0?' hour':''));
    tick.style.left=((time-minOf(day.start))*timelineRate)+'px';
    tick.append(node('span','',String(Math.floor(time/60)).padStart(2,'0')+':'+String(time%60).padStart(2,'0')));
    axis.append(tick);
  }
  const track=node('div','timeline-track');
  // すべての予定をクリック／タップ／キーボードで開けるようにする。
  // 単一時刻の予定は画面端へ寄せ、近接する時刻ボタンは上下に分ける。
  const pointWidth=54;
  const pointRows=[-Infinity,-Infinity];
  const detailId='event-detail-'+day.id+'-'+course.id;
  const detail=node('section','point-detail event-detail');
  detail.id=detailId;
  detail.hidden=true;
  detail.setAttribute('aria-live','polite');
  let selectedTrigger=null;
  const closeDetail=(restoreFocus=false)=>{
    detail.hidden=true;
    if(selectedTrigger){
      selectedTrigger.classList.remove('selected');
      selectedTrigger.setAttribute('aria-expanded','false');
      if(restoreFocus)selectedTrigger.focus({preventScroll:true});
      selectedTrigger=null;
    }
  };
  const openDetail=(button,event)=>{
    if(selectedTrigger===button){closeDetail();return}
    if(selectedTrigger){
      selectedTrigger.classList.remove('selected');
      selectedTrigger.setAttribute('aria-expanded','false');
    }
    selectedTrigger=button;
    button.classList.add('selected');
    button.setAttribute('aria-expanded','true');
    const isPoint=event.start===event.end;
    const transport=transportFor(event);
    const content=node('div','point-detail-content');
    const kind=transport?'移動':event.type==='food'?'食事':'行動';
    content.append(node('span','point-detail-label',day.date+' / '+course.label+' / '+kind));
    content.append(node('div','point-detail-clock',isPoint?event.start:event.start+' 〜 '+event.end));
    content.append(node('h4','point-detail-title',event.title));
    if(transport)content.append(node('p','point-detail-note','移動手段：'+transport.label));
    if(event.note)content.append(node('p','point-detail-note',event.note));
    if(isPoint)content.append(node('p','point-detail-context','資料に記載の時刻は1つのみです。もう一方の時刻や所要時間は推測していません。'));
    const close=node('button','point-detail-close','閉じる ×');
    close.type='button';
    close.setAttribute('aria-label','詳細を閉じる');
    close.addEventListener('click',()=>closeDetail(true));
    detail.replaceChildren(content,close);
    detail.hidden=false;
    requestAnimationFrame(()=>detail.scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  };
  wrapper.addEventListener('keydown',e=>{if(e.key==='Escape'&&!detail.hidden){e.preventDefault();closeDetail(true)}});
  const now=Date.now();const idx=days.indexOf(day);
  for(const event of course.events){
    const len=(minOf(event.end)-minOf(event.start))*timelineRate;
    const w=Math.max(6,len-4);
    const transport=transportFor(event);
    // 移動は画像カードではなく、所要時間に比例する棒で表す。
    const isPoint=event.start===event.end;
    const key=null; // Approved photographs can be added after school approval.
    const showScene=false;
    const pointX=(minOf(event.start)-minOf(day.start))*timelineRate;
    const pointRow=isPoint && pointX-pointRows[0]<pointWidth ? 1 : 0;
    if(isPoint)pointRows[pointRow]=pointX;
    const card=node('button','route-event '+event.type+(isPoint?' is-point point-row-'+(pointRow+1):'')+(transport?' transport-bar':'')+((key||showScene)?' has-photo':'')+(w<133?' compact':'')+(w<74?' tiny':''));
    card.style.left=(isPoint?Math.max(0,Math.min(width-pointWidth,pointX-pointWidth/2)):pointX)+'px';
    card.style.width=(isPoint?pointWidth:w)+'px';
    card.type='button';
    card.setAttribute('aria-controls',detailId);
    card.setAttribute('aria-expanded','false');
    card.dataset.start=event.start;
    const modeInfo=transport?' / '+transport.label:'';
    const displayTime=event.start===event.end?event.start:event.start+'〜'+event.end;
    card.setAttribute('aria-label',displayTime+' '+event.title+modeInfo+(event.note?'、'+event.note:''));
    card.title=displayTime+' '+event.title+modeInfo+(event.note?' / '+event.note:'');
    card.setAttribute('aria-label',displayTime+' '+event.title+modeInfo+'。詳細を表示');
    if(isPoint){
      card.append(node('span','point-event-time',event.start));
    }else if(key){
      card.append(placePhoto(key));
      if(venuePhotos[key]?.permissionPending && w>=150){
        card.append(node('span','route-photo-note',venuePhotos[key].sourceType==='official'?'公式掲載画像':'参考画像（仮配置）'));
      }
    }else if(showScene){
      const scenic=node('img');scenic.src=bundledTimelinePhotos.landscape;
      scenic.alt='北海道の冬景色（イメージ）';scenic.loading='lazy';scenic.decoding='async';
      card.append(scenic);
    }
    if(isPoint){
      // 単一時刻は上側の時刻ボタンのまま表示する。
    }else if(transport){
      const label=node('div','transport-content');
      label.append(node('span','transport-icon',transport.icon));
      if(w>=115){
        const information=node('span','transport-info');
        information.append(node('strong','transport-mode',transport.label));
        if(w>=245)information.append(node('small','transport-destination',event.title));
        label.append(information);
      }else if(w>=64){
        label.append(node('span','transport-short',/ANA/.test(transport.label)?'航空機':'バス'));
      }
      card.append(label);
    }else{
      const text=node('div','route-event-content');
      if(w>=74)text.append(node('span','route-event-time',(event.start===event.end?event.start:event.start+'–'+event.end)));
      text.append(node('strong','route-event-title',w>=74?event.title:'•'));
      card.append(text);
    }
    if(!isPoint && now>=dateOf(idx,event.start)&&now<dateOf(idx,event.end))card.classList.add('is-current');
    card.addEventListener('click',()=>openDetail(card,event));
    track.append(card);
  }
  canvas.append(axis,track);viewport.append(canvas);wrapper.append(viewport);
  wrapper.append(detail);
  const list=node('details','collapse');
  list.append(node('summary','','全予定の時刻一覧'));
  const agenda=node('div','agenda-grid');
  course.events.forEach(event=>{
    const row=node('button','agenda-row agenda-event');
    row.type='button';
    row.setAttribute('aria-controls',detailId);
    row.setAttribute('aria-expanded','false');
    row.setAttribute('aria-label',(event.start===event.end?event.start:event.start+'から'+event.end)+' '+event.title+'。詳細を表示');
    row.append(node('span','agenda-clock',(event.start===event.end?event.start:event.start+'–'+event.end)));
    const txt=node('div','agenda-label',event.title);
    const transport=transportFor(event);
    if(transport)txt.append(node('small','agenda-transport','移動手段：'+transport.label));
    if(event.note)txt.append(node('small','',event.note));
    row.append(txt);
    row.addEventListener('click',()=>openDetail(row,event));
    agenda.append(row);
  });list.append(agenda);wrapper.append(list);
  if(course.unknown.length){
    const unknown=node('details','unknown-box');
    unknown.append(node('summary','','未確定・要確認'));
    const ul=node('ul');course.unknown.forEach(x=>ul.append(node('li','',x)));
    unknown.append(ul);wrapper.append(unknown);
  }
  return wrapper;
}
function renderPlaces(course){
  const section=node('section','destinations');
  const details=node('details','collapse');
  details.append(node('summary','','訪問先と補足'));
  const grid=node('div','destination-grid');
  course.places.forEach(place=>{
    const card=node('article','destination-card no-photo');
    const copy=node('div','destination-copy');
    copy.append(node('h4','',place.name),node('p','',place.desc));
    card.append(copy);
    grid.append(card);
  });
  details.append(grid);section.append(details);
  return section;
}
function renderCourseContent(day,course){
  const layout=node('div','day-layout');layout.append(renderTimeline(day,course),renderPlaces(course));return layout;
}
function renderDay(day){
  const article=node('article','day-card');article.id=day.id;
  const head=node('div','day-top');
  const badge=node('div','day-badge');badge.append(node('small','','DAY'),node('strong','',day.num));
  const title=node('div','day-titles');title.append(node('h3','',day.date+'｜'+day.title));
  head.append(badge,title);article.append(head);
  const active=selectedCourse(day);
  const content=node('div','course-content');
  if(day.courses.length>1){
    const tabs=node('div','course-tabs');tabs.setAttribute('role','group');tabs.setAttribute('aria-label',day.date+' コース');
    day.courses.forEach(course=>{
      const b=node('button','course-tab'+(course.id===active.id?' active':''),course.label);
      b.type='button';b.dataset.course=course.id;
      b.setAttribute('aria-pressed',String(course.id===active.id));
      b.addEventListener('click',()=>{
        choice[day.id]=course.id;setStored(prefsPrefix+day.id,course.id);
        $$('button',tabs).forEach(button=>{
          const isActive=button===b;button.classList.toggle('active',isActive);button.setAttribute('aria-pressed',String(isActive));
        });
        content.replaceChildren(renderCourseContent(day,course));
        renderNextSchedule();
      });
      tabs.append(b);
    });
    article.append(tabs);
  }
  content.append(renderCourseContent(day,active));article.append(content);return article;
}
function renderSchedule(){
  const host=$('#schedule-root');if(!host)return;
  host.replaceChildren();
  const selected=host.dataset.day||document.body.dataset.day;
  days.filter(day=>!selected||day.id===selected).forEach(day=>host.append(renderDay(day)));
}
function eventsForCourse(){
  return days.flatMap((day,idx)=>selectedCourse(day).events.map(e=>({...e,index:idx,dayId:day.id,course:selectedCourse(day).label,begin:dateOf(idx,e.start),finish:dateOf(idx,e.end)}))).sort((a,b)=>a.begin-b.begin);
}
function renderNextSchedule(){
  const box=$('#next-schedule');if(!box)return;
  const events=eventsForCourse();const now=Date.now();
  const upcoming=events.find(e=>e.begin>now);
  const current=events.find(e=>e.begin<=now&&now<e.finish);
  box.replaceChildren();
  const label=node('span','next-label');label.append(node('span','pulse-dot'),document.createTextNode(upcoming?'NEXT / 次の行程':current?'NOW / 現在の行程':'TRIP / 全行程'));
  box.append(label);
  const event=upcoming||current;
  if(!event){
    box.append(node('p','next-title','全日程終了'),node('p','next-day','2026年12月7日〜10日の行程を掲載。'));
    return;
  }
  box.append(node('div','next-time',event.start));
  box.append(node('p','next-day',dateNames[event.index]+'　'+(upcoming?'開始予定':'進行中')));
  box.append(node('p','next-title',event.title));
  const bottom=node('div','next-bottom');bottom.append(node('span','next-course',event.course));
  const link=node('a','next-jump','この日の予定を見る ↗');
  link.href='day'+(event.index+1)+'.html#schedule';
  bottom.append(link);box.append(bottom);
}
const packingList=['学生証・学校指定の書類','財布・現金','スマートフォン','充電器・モバイルバッテリー','着替え・下着・靴下','防寒着・手袋・帽子','滑りにくい靴','洗面用具・タオル','常備薬（必要な人）','筆記用具・旅行のしおり','スキー用品・防寒小物（該当者）','その他学校指定の持ち物'];
const checklistKey='hokkaido26-checklist-public-v3';
function renderChecklist(){
  const host=$('#checklist-root');if(!host)return;
  let checks=[];try{checks=JSON.parse(getStored(checklistKey)||'[]');if(!Array.isArray(checks))checks=[]}catch(_){checks=[]}
  packingList.forEach((item,i)=>{
    const label=node('label','checklist-item');const input=node('input');input.type='checkbox';input.checked=checks[i]===true;
    input.setAttribute('aria-label',item);
    input.addEventListener('change',()=>{
      const values=$$('input[type="checkbox"]',host).map(x=>x.checked);
      setStored(checklistKey,JSON.stringify(values));
    });
    label.append(input,node('span','',item));host.append(label);
  });
  $('#reset-checklist')?.addEventListener('click',()=>{
    $$('input[type="checkbox"]',host).forEach(x=>x.checked=false);rmStored(checklistKey);
  });
}
function renderHotelImages(){
  $$('[data-venue-photo]').forEach(holder=>{
    if(holder.childElementCount)return;
    holder.append(placePhoto(holder.dataset.venuePhoto,'施設写真は学校承認後に掲載'));
  });
}
renderCredits();renderHotelImages();renderSchedule();renderChecklist();renderNextSchedule();loadAnnouncements();
// When a public tab is first loaded by the same-document router, hydrate
// its locally rendered sections without rerunning this large data bundle.
window.HOKKAIDO_REINIT_PUBLIC_PAGE=function(){
  const host=document.querySelector('main');
  if(!host)return;
  renderCredits();
  if(host.querySelector('[data-venue-photo]'))renderHotelImages();
  if(host.querySelector('#schedule-root'))renderSchedule();
  if(host.querySelector('#checklist-root'))renderChecklist();
  if(host.querySelector('#next-schedule'))renderNextSchedule();
  if(host.querySelector('#announcement-list'))loadAnnouncements();
};

// Returning to the home tab must refresh live information, even when its DOM is cached.
window.HOKKAIDO_REFRESH_PUBLIC_HOME=function(){
  if($('#next-schedule'))renderNextSchedule();
  if($('#announcement-list'))loadAnnouncements();
};
// Activate the clock on every entry page, not only when the initial document was home.
setInterval(()=>{
  if($('#next-schedule'))renderNextSchedule();
},60_000);

// Page content is immediately visible. Animations never hide or delay information.
