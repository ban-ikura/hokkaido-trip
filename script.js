// 旅行会社作成の2026年10月5日版行程表に基づく。未確定区間は推定しない。
// 写真は訪問先そのものではなく、北海道の雰囲気を伝えるイメージ画像。
const photos = {
  airport:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80',
  otaru:'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=900&q=80',
  snow:'https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=900&q=80',
  music:'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&q=80',
  glass:'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=900&q=80',
  lake:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&q=80',
  mountain:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
  food:'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80',
  city:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&q=80',
  sweets:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80'
};
const place=(name,desc,photo)=>({name,desc,photo});
const ev=(start,end,title,type='activity',note='')=>({start,end,title,type,note});
const days=[
 {id:'day1',num:'01',date:'12月7日（月）',title:'羽田・小樽・ニセコ',desc:'午後はコース別行程。',start:'08:00',end:'18:00',courses:[
  {id:'ski',label:'ゲレンデ班',events:[ev('08:00','09:30','ANA53 羽田 → 新千歳','travel'),ev('10:00','11:30','空港から小樽方面へ移動','travel','行程表記載の移動枠'),ev('11:30','12:20','小樽で昼食（全体）','food','会場未確定'),ev('12:20','14:20','ニセコへ移動（時間枠）','travel','ホテル14:20頃到着')],unknown:['ホテル到着：14:20頃。午後のスキー／スノボ講習時間：未確定。'],places:[place('小樽で昼食','昼食会場候補：北海あぶりやき運河倉庫／ニュー三幸。確定会場は未発表。',photos.food),place('ニセコビレッジスキーリゾート','ゲレンデ班の講習エリア。防寒装備・集合時刻に注意。',photos.snow),place('ヒルトンニセコビレッジ','1・2泊目の宿泊施設。',photos.mountain)]},
  {id:'tour',label:'観光班',events:[ev('08:00','09:30','ANA53 羽田 → 新千歳','travel'),ev('10:00','11:30','空港から小樽方面へ移動','travel'),ev('11:30','12:20','小樽で昼食（全体）','food','会場未確定'),ev('12:30','13:30','小樽オルゴール堂 遊工房','activity','手廻しオルゴール制作'),ev('15:15','17:15','ガラスエッチング体験','activity','ニセコ方面'),ev('17:15','17:30','ホテルへ移動・到着','travel')],unknown:['昼食：11:30〜12:20（全体行程）。体験会場への移動方法・中間時刻：未確定。'],places:[place('小樽オルゴール堂 遊工房','手廻しオルゴール制作体験（予定）。',photos.music),place('ガラスエッチング体験','ガラスに模様を施す制作体験。',photos.glass),place('ヒルトンニセコビレッジ','ニセコでの宿泊先。',photos.snow)]}
 ]},
 {id:'day2',num:'02',date:'12月8日（火）',title:'ニセコ・洞爺湖・登別',desc:'ゲレンデ班・観光班の別行程。',start:'09:00',end:'18:00',courses:[
  {id:'ski',label:'ゲレンデ班',events:[ev('09:00','11:00','午前のスキー・スノボ講習'),ev('11:00','13:00','昼食・休憩','food','昼食はホテル'),ev('13:00','15:00','午後のスキー・スノボ講習')],unknown:['15:00以降の詳細時刻：未確定。ヒルトンニセコビレッジ連泊。'],places:[place('ニセコビレッジスキーリゾート','午前・午後に各2時間の講習。',photos.snow),place('ヒルトンニセコビレッジ','昼食はホテル。2泊目も同じ宿泊先。',photos.mountain)]},
  {id:'tour',label:'観光班',events:[ev('09:00','10:20','洞爺湖方面へ移動（概略）','travel','10:20到着予定'),ev('10:20','11:20','洞爺湖自由行動'),ev('11:20','11:30','昼食会場へ移動','travel','10分枠'),ev('11:30','12:20','民芸御殿で昼食','food'),ev('12:20','13:20','登別方面へ移動（概略）','travel'),ev('13:20','13:50','登別自由行動'),ev('13:50','15:50','地獄谷自由行動'),ev('15:50','17:50','ホテルへ移動（概略）','travel','17:50到着予定')],unknown:[],places:[place('洞爺湖','湖畔での自由行動。集合時刻厳守。',photos.lake),place('民芸御殿','観光班全体で昼食。',photos.food),place('登別・地獄谷','登別周辺・地獄谷の見学。歩行に適した靴を着用。',photos.mountain)]}
 ]},
 {id:'day3',num:'03',date:'12月9日（水）',title:'小樽・札幌',desc:'小樽自由行動・札幌観光・旭山記念公園。',start:'09:00',end:'20:00',courses:[
  {id:'all',label:'共通行程',events:[ev('09:00','11:00','ホテルから小樽へ移動','travel'),ev('11:00','14:55','小樽自由行動・各自昼食','activity'),ev('14:55','15:30','白い恋人パークへ移動','travel'),ev('15:30','17:00','白い恋人パーク'),ev('17:00','17:30','札幌ビール園へ移動','travel'),ev('17:30','18:30','札幌ビール園で夕食','food','行程表では想定時刻'),ev('18:30','19:00','旭山記念公園へ移動','travel'),ev('19:00','19:30','旭山記念公園','activity'),ev('19:30','20:00','ホテルへ移動','travel','20:00頃到着')],unknown:[],places:[place('小樽運河','運河周辺で自由行動・各自昼食。',photos.otaru),place('白い恋人パーク','お菓子をテーマにした札幌の観光施設。',photos.sweets),place('札幌ビール園','夕食会場として予定。候補会場の記載もあり。',photos.food),place('旭山記念公園','札幌市街を望む展望スポット。訪問予定は変更の可能性あり。',photos.city),place('ニューオータニイン札幌','3泊目の宿泊先。到着予定：20:00頃。',photos.city)]}
 ]},
 {id:'day4',num:'04',date:'12月10日（木）',title:'札幌・新千歳・羽田',desc:'札幌市内で班別行動後、新千歳空港から帰京。',start:'09:00',end:'17:30',courses:[
  {id:'all',label:'共通行程',events:[ev('09:00','14:00','札幌班別行動＋空港移動（内訳未確定）','activity','ホテル出発9:00・空港着14:00'),ev('14:00','15:30','新千歳空港・搭乗準備','travel'),ev('15:30','17:10','ANA68 新千歳 → 羽田','travel')],unknown:['班別行動終了・空港方面への出発時刻：未確定。9:00〜14:00の枠は移動時間を含む。'],places:[place('札幌市内','班別行動。昼食は各自。',photos.city),place('新千歳空港','14:00到着予定。ANA68便は15:30発。',photos.airport),place('羽田空港','17:10到着予定。',photos.airport)]}
 ]}
];
function minutes(time){const [h,m]=time.split(':').map(Number);return h*60+m}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function makeAxis(day,course){
 const start=minutes(day.start),end=minutes(day.end),unit=22,height=(end-start)/30*unit;
 let html=`<div class="time-axis" style="height:${height}px" aria-label="30分刻みの時間軸">`;
 for(let m=Math.ceil(start/30)*30;m<=end;m+=30){
  const top=(m-start)/30*unit,h=String(Math.floor(m/60)).padStart(2,'0'),mi=String(m%60).padStart(2,'0');
  html+=`<span class="axis-label" style="top:${top}px">${h}:${mi}</span><span class="axis-line ${m%60===0?'hour':''}" style="top:${top}px"></span>`;
 }
 for(const e of course.events){
  const top=(minutes(e.start)-start)/30*unit,duration=(minutes(e.end)-minutes(e.start))/30*unit;
  const tiny=duration<19,compact=duration<55;
  const body=tiny?'':`<span class="event-time">${e.start}–${e.end}</span><span class="event-title">${escapeHTML(e.title)}</span>${!compact&&e.note?`<span class="event-note">${escapeHTML(e.note)}</span>`:''}`;
  html+=`<div class="event ${e.type} ${compact?'compact':''} ${tiny?'tiny':''}" style="top:${top+1}px;height:${Math.max(4,duration-2)}px" title="${escapeHTML(e.start+'〜'+e.end+' '+e.title+(e.note?' / '+e.note:''))}">${body}</div>`;
 }
 html+='</div>';
 html+=`<details class="agenda"><summary>時刻一覧を開く</summary><div class="agenda-grid">${course.events.map(e=>`<div class="agenda-row"><span class="agenda-clock">${e.start}–${e.end}</span><span class="agenda-label">${escapeHTML(e.title)}${e.note?`<small>${escapeHTML(e.note)}</small>`:''}</span></div>`).join('')}</div></details>`;
 if(course.unknown.length){html+=`<div class="unknown-box"><h5>時刻・内容未確定の項目</h5><ul>${course.unknown.map(t=>`<li>${escapeHTML(t)}</li>`).join('')}</ul></div>`;}
 return html;
}
function makePlaces(course){return `<div class="place-list">${course.places.map(p=>`<article class="place-card"><img src="${p.photo}" alt="${escapeHTML(p.name)}のイメージ写真" loading="lazy" referrerpolicy="no-referrer"><div class="place-content"><h5>${escapeHTML(p.name)}</h5><details class="place-details"><summary>詳細</summary><p>${escapeHTML(p.desc)}</p><small class="photo-note">イメージ写真</small></details></div></article>`).join('')}</div>`}
function renderCourse(day,course){return `<div class="day-layout"><div><h4 class="timeline-heading">時間軸</h4>${makeAxis(day,course)}</div><aside><h4 class="places-heading">訪問先</h4>${makePlaces(course)}</aside></div>`}
function renderDay(day){return `<article class="day-card" id="${day.id}"><div class="day-header"><span class="day-badge">DAY ${day.num}</span><h3>${day.date}｜${day.title}</h3></div>${day.courses.length>1?`<div class="course-tabs" role="group" aria-label="${day.date}のコース">${day.courses.map((c,i)=>`<button type="button" class="course-tab ${i===0?'active':''}" data-course="${c.id}" aria-pressed="${i===0}">${c.label}</button>`).join('')}</div>`:''}<div class="course-content">${renderCourse(day,day.courses[0])}</div></article>`}
const root=document.getElementById('schedule-root');if(root)root.innerHTML=days.map(renderDay).join('');
if(root)root.addEventListener('click',event=>{const button=event.target.closest('.course-tab');if(!button)return;const card=button.closest('.day-card');const day=days.find(d=>d.id===card.id);const course=day.courses.find(c=>c.id===button.dataset.course);card.querySelectorAll('.course-tab').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});card.querySelector('.course-content').innerHTML=renderCourse(day,course)});
const items=['学生証・学校指定の書類','財布・現金','スマートフォン','充電器・モバイルバッテリー','着替え・下着・靴下','防寒着・手袋・帽子','滑りにくい靴','洗面用具・タオル','常備薬（必要な人）','筆記用具・旅行のしおり','スキー用品・防寒小物（該当者）','その他学校指定の持ち物'];
const key='hokkaido-checklist-2026-v2';let saved=[];try{saved=JSON.parse(localStorage.getItem(key)||'[]')}catch(e){}
const list=document.getElementById('checklist-root');if(list)list.innerHTML=items.map((name,i)=>`<label><input type="checkbox" data-index="${i}" ${saved[i]?'checked':''}><span>${name}</span></label>`).join('');if(list)list.addEventListener('change',()=>{try{localStorage.setItem(key,JSON.stringify([...list.querySelectorAll('input')].map(i=>i.checked)))}catch(e){console.warn('保存できませんでした',e)}});
