// 公開サイト用データ／年度：2026年。私的資料や名簿は含めない。
const venuePhotos = {
  "airport": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/New_Chitose_Airport.jpg/800px-New_Chitose_Airport.jpg",
    "label": "新千歳空港",
    "source": "https://commons.wikimedia.org/wiki/File:New_Chitose_Airport.jpg",
    "author": "Hykw-a4",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2005年"
  },
  "otaru": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Otaru_canal.jpg/800px-Otaru_canal.jpg",
    "label": "小樽運河",
    "source": "https://commons.wikimedia.org/wiki/File:Otaru_canal.jpg",
    "author": "欅（Keyaki）",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2009年"
  },
  "music": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Otaru_Music_Box_Museum_interior.jpg/800px-Otaru_Music_Box_Museum_interior.jpg",
    "label": "小樽オルゴール堂（館内）",
    "source": "https://commons.wikimedia.org/wiki/File:Otaru_Music_Box_Museum_interior.jpg",
    "author": "Liandrei",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "year": "2017年"
  },
  "hilton": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hilton_Niseko.jpg/800px-Hilton_Niseko.jpg",
    "label": "ヒルトンニセコビレッジ",
    "source": "https://commons.wikimedia.org/wiki/File:Hilton_Niseko.jpg",
    "author": "Jun Kaneko",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "year": "2010年"
  },
  "niseko": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Niseko_Gondola_and_Hilton_Niseko_Village.jpg/800px-Niseko_Gondola_and_Hilton_Niseko_Village.jpg",
    "label": "ニセコビレッジ（ゴンドラとホテル）",
    "source": "https://commons.wikimedia.org/wiki/File:Niseko_Gondola_and_Hilton_Niseko_Village.jpg",
    "author": "Excellent moniteur de ski",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "year": "2022年"
  },
  "lake": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/4/40/Lake_Toya.JPG",
    "label": "洞爺湖",
    "source": "https://commons.wikimedia.org/wiki/File:Lake_Toya.JPG",
    "author": "RickardA",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Lake_Toya.JPG",
    "year": "2010年"
  },
  "jigokudani": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Noboribetsu-jigokudani.JPG/800px-Noboribetsu-jigokudani.JPG",
    "label": "登別・地獄谷",
    "source": "https://commons.wikimedia.org/wiki/File:Noboribetsu-jigokudani.JPG",
    "author": "Prosperosity",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2012年"
  },
  "shiroi": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Shiroi_Koibito_Park_20260703m.jpg/800px-Shiroi_Koibito_Park_20260703m.jpg",
    "label": "白い恋人パーク",
    "source": "https://commons.wikimedia.org/wiki/File:Shiroi_Koibito_Park_20260703m.jpg",
    "author": "掬茶",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "year": "2026年"
  },
  "beer": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/9/90/Sapporo_beer_garden.jpg",
    "label": "サッポロビール園",
    "source": "https://commons.wikimedia.org/wiki/File:Sapporo_beer_garden.jpg",
    "author": "Nissy-KITAQ",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2006年"
  },
  "asahiyama": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Asahiyama_Memorial_Park.jpg/800px-Asahiyama_Memorial_Park.jpg",
    "label": "旭山記念公園",
    "source": "https://commons.wikimedia.org/wiki/File:Asahiyama_Memorial_Park.jpg",
    "author": "Ozizo",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Asahiyama_Memorial_Park.jpg",
    "year": "2009年"
  },
  "newotani": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Asahi_Building_Sapporo_20070601-001.jpg/800px-Asahi_Building_Sapporo_20070601-001.jpg",
    "label": "ニューオータニイン札幌が入る朝日ビル",
    "source": "https://commons.wikimedia.org/wiki/File:Asahi_Building_Sapporo_20070601-001.jpg",
    "author": "J o",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2007年"
  }
};

function getPhotoKey(title){
 if(/ヒルトンニセコ/.test(title))return 'hilton';
 if(/ニセコビレッジ|スキー|スノボ|ゲレンデ/.test(title))return 'niseko';
 if(/オルゴール/.test(title))return 'music';
 if(/小樽運河|小樽自由行動/.test(title))return 'otaru';
 if(/洞爺湖/.test(title))return 'lake';
 if(/地獄谷|登別/.test(title))return 'jigokudani';
 if(/白い恋人/.test(title))return 'shiroi';
 if(/札幌ビール園/.test(title))return 'beer';
 if(/旭山記念/.test(title))return 'asahiyama';
 if(/ニューオータニイン/.test(title))return 'newotani';
 if(/新千歳空港/.test(title))return 'airport';
 return null;
}
const place=(name,desc)=>({name,desc,photo:getPhotoKey(name)});
const ev=(start,end,title,type='activity',note='')=>({start,end,title,type,note});
const days=[
 {id:'day1',num:'01',date:'12月7日（月）',title:'羽田・小樽・ニセコ',desc:'午後はコース別行程。',start:'08:00',end:'18:00',courses:[
  {id:'ski',label:'ゲレンデ班',events:[ev('08:00','09:30','ANA53 羽田 → 新千歳','travel'),ev('10:00','11:30','空港から小樽方面へ移動','travel','行程表記載の移動枠'),ev('11:30','12:20','小樽で昼食（全体）','food','会場未確定'),ev('12:20','14:20','ニセコへ移動（時間枠）','travel','ホテル14:20頃到着')],unknown:['ホテル到着：14:20頃。午後のスキー／スノボ講習時間：未確定。'],places:[place('小樽で昼食','昼食会場候補：北海あぶりやき運河倉庫／ニュー三幸。確定会場は未発表。',null),place('ニセコビレッジスキーリゾート','ゲレンデ班の講習エリア。防寒装備・集合時刻に注意。',null),place('ヒルトンニセコビレッジ','1・2泊目の宿泊施設。',null)]},
  {id:'tour',label:'観光班',events:[ev('08:00','09:30','ANA53 羽田 → 新千歳','travel'),ev('10:00','11:30','空港から小樽方面へ移動','travel'),ev('11:30','12:20','小樽で昼食（全体）','food','会場未確定'),ev('12:30','13:30','小樽オルゴール堂 遊工房','activity','手廻しオルゴール制作'),ev('15:15','17:15','ガラスエッチング体験','activity','ニセコ方面'),ev('17:15','17:30','ホテルへ移動・到着','travel')],unknown:['昼食：11:30〜12:20（全体行程）。体験会場への移動方法・中間時刻：未確定。'],places:[place('小樽オルゴール堂 遊工房','手廻しオルゴール制作体験（予定）。',null),place('ガラスエッチング体験','ガラスに模様を施す制作体験。',null),place('ヒルトンニセコビレッジ','ニセコでの宿泊先。',null)]}
 ]},
 {id:'day2',num:'02',date:'12月8日（火）',title:'ニセコ・洞爺湖・登別',desc:'ゲレンデ班・観光班の別行程。',start:'09:00',end:'18:00',courses:[
  {id:'ski',label:'ゲレンデ班',events:[ev('09:00','11:00','午前のスキー・スノボ講習'),ev('11:00','13:00','昼食・休憩','food','昼食はホテル'),ev('13:00','15:00','午後のスキー・スノボ講習')],unknown:['15:00以降の詳細時刻：未確定。ヒルトンニセコビレッジ連泊。'],places:[place('ニセコビレッジスキーリゾート','午前・午後に各2時間の講習。',null),place('ヒルトンニセコビレッジ','昼食はホテル。2泊目も同じ宿泊先。',null)]},
  {id:'tour',label:'観光班',events:[ev('09:00','10:20','洞爺湖方面へ移動（概略）','travel','10:20到着予定'),ev('10:20','11:20','洞爺湖自由行動'),ev('11:20','11:30','昼食会場へ移動','travel','10分枠'),ev('11:30','12:20','民芸御殿で昼食','food'),ev('12:20','13:20','登別方面へ移動（概略）','travel'),ev('13:20','13:50','登別自由行動'),ev('13:50','15:50','地獄谷自由行動'),ev('15:50','17:50','ホテルへ移動（概略）','travel','17:50到着予定')],unknown:[],places:[place('洞爺湖','湖畔での自由行動。集合時刻厳守。',null),place('民芸御殿','観光班全体で昼食。',null),place('登別・地獄谷','登別周辺・地獄谷の見学。歩行に適した靴を着用。',null)]}
 ]},
 {id:'day3',num:'03',date:'12月9日（水）',title:'小樽・札幌',desc:'小樽自由行動・札幌観光・旭山記念公園。',start:'09:00',end:'20:00',courses:[
  {id:'all',label:'共通行程',events:[ev('09:00','11:00','ホテルから小樽へ移動','travel'),ev('11:00','14:55','小樽自由行動・各自昼食','activity'),ev('14:55','15:30','白い恋人パークへ移動','travel'),ev('15:30','17:00','白い恋人パーク'),ev('17:00','17:30','札幌ビール園へ移動','travel'),ev('17:30','18:30','札幌ビール園で夕食','food','行程表では想定時刻'),ev('18:30','19:00','旭山記念公園へ移動','travel'),ev('19:00','19:30','旭山記念公園','activity'),ev('19:30','20:00','ホテルへ移動','travel','20:00頃到着')],unknown:[],places:[place('小樽運河','運河周辺で自由行動・各自昼食。',null),place('白い恋人パーク','お菓子をテーマにした札幌の観光施設。',null),place('札幌ビール園','夕食会場として予定。候補会場の記載もあり。',null),place('旭山記念公園','札幌市街を望む展望スポット。訪問予定は変更の可能性あり。',null),place('ニューオータニイン札幌','3泊目の宿泊先。到着予定：20:00頃。',null)]}
 ]},
 {id:'day4',num:'04',date:'12月10日（木）',title:'札幌・新千歳・羽田',desc:'札幌市内で班別行動後、新千歳空港から帰京。',start:'09:00',end:'17:30',courses:[
  {id:'all',label:'共通行程',events:[ev('09:00','14:00','札幌班別行動＋空港移動（内訳未確定）','activity','ホテル出発9:00・空港着14:00'),ev('14:00','15:30','新千歳空港・搭乗準備','travel'),ev('15:30','17:10','ANA68 新千歳 → 羽田','travel')],unknown:['班別行動終了・空港方面への出発時刻：未確定。9:00〜14:00の枠は移動時間を含む。'],places:[place('札幌市内','班別行動。昼食は各自。',null),place('新千歳空港','14:00到着予定。ANA68便は15:30発。',null),place('羽田空港','17:10到着予定。',null)]}
 ]}
];
