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
function placePhoto(key,alt){
  const meta=venuePhotos[key];
  if(!meta)return null;
  const img=node('img');
  img.src=meta.url;
  img.alt=alt===undefined ? meta.label+'（過去に撮影された写真）' : alt;
  img.loading='lazy';
  img.decoding='async';
  img.referrerPolicy='no-referrer';
  img.addEventListener('error',()=>{
    const card=img.closest('.destination-card')||img.closest('.route-event')||img.closest('.hotel-figure');
    img.remove();
    if(card){
      card.classList.add('photo-unavailable','route-event-image-off');
      if(card.classList.contains('hotel-figure'))card.prepend(node('div','photo-fallback','施設写真を読み込めませんでした'));
    }
  });
  return img;
}
const externalLink=(text,url)=>{
  const a=node('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';return a;
};

function renderCredits(){
  const host=$('#credits-list');if(!host)return;
  Object.values(venuePhotos).forEach(meta=>{
    const p=node('p','credit');
    p.append(document.createTextNode(meta.label+'（'+meta.year+'撮影） — '+meta.author+' / '));
    p.append(externalLink(meta.license,meta.licenseUrl));
    p.append(document.createTextNode(' · '));
    p.append(externalLink('原典',meta.source));
    host.append(p);
  });
  host.append(node('p','credit','画像は表示用にトリミングしています。CC BY-SA画像の再利用には原ライセンス条件が適用されます。'));
}

// HTML文字列ではなくテキストノードを作るため、お知らせにHTML文字列があっても実行されません。
async function loadAnnouncements(){
  const host=$('#announcement-list');if(!host)return;
  const count=$('#announcement-count');
  try{
    const response=await fetch('announcements.json',{cache:'no-store',credentials:'same-origin'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const data=await response.json();
    const items=Array.isArray(data.items)?data.items.filter(item=>item&&typeof item==='object'&&!Array.isArray(item)).slice(0,30):[];
    items.sort((a,b)=>String(b?.date??'').localeCompare(String(a?.date??'')));
    host.replaceChildren();
    if(count)count.textContent=items.length+'件';
    if(!items.length){host.append(node('p','news-empty','現在のお知らせはありません。'));return}
    items.forEach(item=>{
      const row=node('article','news-item'+(item.important===true?' important':''));
      const date=node('time','news-date',/^\d{4}-\d{2}-\d{2}$/.test(String(item.date))?item.date:'日付未設定');
      if(/^\d{4}-\d{2}-\d{2}$/.test(String(item.date)))date.dateTime=item.date;
      const body=node('div','news-body');
      const h=node('h3');if(item.important===true)h.append(node('mark','','重要'));
      h.append(document.createTextNode(String(item.title??'お知らせ').slice(0,140)));
      body.append(h);
      const message=String(item.body??'').slice(0,2000);
      if(message)body.append(node('p','',message));
      row.append(date,body);host.append(row);
    });
  }catch(_){
    if(count)count.textContent='';
    host.replaceChildren(node('p','news-empty','お知らせを読み込めませんでした。しばらくしてから再読み込みしてください。'));
  }
}

// 日本時間（UTC+09:00）固定。閲覧端末のタイムゾーンに左右されません。
const dateOf=(dayIndex,time)=>Date.parse(dateStrings[dayIndex]+'T'+time+':00+09:00');
const timelineRate=2.5; // 30分 = 75px
function hasImage(event){
  if(event.type==='travel'||event.type==='food')return null;
  return getPhotoKey(event.title);
}
function renderTimeline(day,course){
  const wrapper=node('div','timeline-wrapper');
  const toolbar=node('div','timeline-toolbar');
  const left=node('div','timeline-label','横スクロール行程表');
  left.append(node('span','','30分刻み'));
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
  toolbar.append(left,controls);wrapper.append(toolbar);
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
  const now=Date.now();const idx=days.indexOf(day);
  for(const event of course.events){
    const len=(minOf(event.end)-minOf(event.start))*timelineRate;
    const w=Math.max(6,len-4);
    const key=hasImage(event);
    const card=node('article','route-event '+event.type+(key?' has-photo':'')+(w<133?' compact':'')+(w<74?' tiny':''));
    card.style.left=((minOf(event.start)-minOf(day.start))*timelineRate)+'px';
    card.style.width=w+'px';
    card.dataset.start=event.start;
    card.setAttribute('aria-label',event.start+'〜'+event.end+' '+event.title+(event.note?'、'+event.note:''));
    card.title=event.start+'〜'+event.end+' '+event.title+(event.note?' / '+event.note:'');
    if(key)card.append(placePhoto(key,''));
    const text=node('div','route-event-content');
    if(w>=74)text.append(node('span','route-event-time',event.start+'–'+event.end));
    text.append(node('strong','route-event-title',w>=74?event.title:'•'));
    card.append(text);
    if(now>=dateOf(idx,event.start)&&now<dateOf(idx,event.end))card.classList.add('is-current');
    track.append(card);
  }
  canvas.append(axis,track);viewport.append(canvas);wrapper.append(viewport);
  const progress=node('div','timeline-progress');progress.setAttribute('aria-hidden','true');
  const fill=node('span');progress.append(fill);wrapper.append(progress);
  const updateProgress=()=>{
    const max=Math.max(1,viewport.scrollWidth-viewport.clientWidth);
    fill.style.width=(100*(viewport.scrollLeft/max)).toFixed(2)+'%';
  };
  viewport.addEventListener('scroll',updateProgress,{passive:true});
  if(typeof ResizeObserver!=='undefined'){new ResizeObserver(updateProgress).observe(viewport)}
  requestAnimationFrame(updateProgress);
  const list=node('details','collapse');
  list.append(node('summary','','全予定の時刻一覧'));
  const agenda=node('div','agenda-grid');
  course.events.forEach(event=>{
    const row=node('div','agenda-row');
    row.append(node('span','agenda-clock',event.start+'–'+event.end));
    const txt=node('div','agenda-label',event.title);
    if(event.note)txt.append(node('small','',event.note));
    row.append(txt);agenda.append(row);
  });list.append(agenda);wrapper.append(list);
  if(course.unknown.length){
    const unknown=node('div','unknown-box');unknown.append(node('strong','','未確定・要確認'));
    const ul=node('ul');course.unknown.forEach(x=>ul.append(node('li','',x)));
    unknown.append(ul);wrapper.append(unknown);
  }
  return wrapper;
}
function renderPlaces(course){
  const section=node('section','destinations');section.setAttribute('aria-label','訪問先の詳細');
  const details=node('details','collapse');
  details.append(node('summary','','訪問先の詳細を見る'));
  const grid=node('div','destination-grid');
  course.places.forEach(p=>{
    const image=p.photo&&venuePhotos[p.photo];
    const card=node('article','destination-card'+(image?'':' no-photo'));
    if(image)card.append(placePhoto(p.photo,image.label+'の過去の写真'));
    const desc=node('div','destination-copy');
    desc.append(node('h4','',p.name),node('p','',p.desc));
    if(image)desc.append(externalLink('写真の出典',image.source));
    card.append(desc);grid.append(card);
  });
  details.append(grid);section.append(details);return section;
}
function renderCourseContent(day,course){
  const layout=node('div','day-layout');layout.append(renderTimeline(day,course),renderPlaces(course));return layout;
}
function renderDay(day){
  const article=node('article','day-card');article.id=day.id;
  const head=node('div','day-top');
  const badge=node('div','day-badge');badge.append(node('small','','DAY'),node('strong','',day.num));
  const title=node('div','day-titles');title.append(node('h3','',day.date+'｜'+day.title),node('p','',day.desc));
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
  days.forEach(day=>host.append(renderDay(day)));
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
  const link=node('a','next-jump','行程表で確認 ↗');link.href='#'+event.dayId;
  link.addEventListener('click',()=>{
    setTimeout(()=>{
      const card=document.getElementById(event.dayId);
      const view=$('.timeline-viewport',card);
      const target=$$('.route-event',card).find(e=>e.dataset.start===event.start);
      if(view&&target)view.scrollTo({left:Math.max(0,target.offsetLeft-45),behavior:'smooth'});
    },160);
  });
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
    const meta=venuePhotos[holder.dataset.venuePhoto];if(!meta)return;
    const fig=node('figure','hotel-figure');
    fig.append(placePhoto(holder.dataset.venuePhoto,meta.label+'（'+meta.year+'撮影）'));
    const caption=node('figcaption','',meta.label+'（'+meta.year+'撮影）　');
    caption.append(externalLink('写真出典 ↗',meta.source));fig.append(caption);
    holder.append(fig);
  });
}
renderCredits();renderHotelImages();renderSchedule();renderChecklist();renderNextSchedule();loadAnnouncements();
if($('#next-schedule'))setInterval(renderNextSchedule,60_000);
