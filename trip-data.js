// 公開サイト用データ／年度：2026年。私的資料や名簿は含めない。
const venuePhotos = {
  "airport": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/New_Chitose_Airport.jpg/960px-New_Chitose_Airport.jpg",
    "label": "新千歳空港",
    "source": "https://commons.wikimedia.org/wiki/File:New_Chitose_Airport.jpg",
    "author": "Hykw-a4",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2005年"
  },
  "otaru": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Otaru_canal.jpg/960px-Otaru_canal.jpg",
    "label": "小樽運河",
    "source": "https://commons.wikimedia.org/wiki/File:Otaru_canal.jpg",
    "author": "欅（Keyaki）",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2009年"
  },
  "music": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Otaru_Music_Box_Museum_interior.jpg/960px-Otaru_Music_Box_Museum_interior.jpg",
    "label": "小樽オルゴール堂（館内）",
    "source": "https://commons.wikimedia.org/wiki/File:Otaru_Music_Box_Museum_interior.jpg",
    "author": "Liandrei",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "year": "2017年"
  },
  "hilton": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hilton_Niseko.jpg/960px-Hilton_Niseko.jpg",
    "label": "ヒルトンニセコビレッジ",
    "source": "https://commons.wikimedia.org/wiki/File:Hilton_Niseko.jpg",
    "author": "Jun Kaneko",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "year": "2010年"
  },
  "niseko": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Niseko_Gondola_and_Hilton_Niseko_Village.jpg/960px-Niseko_Gondola_and_Hilton_Niseko_Village.jpg",
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
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Noboribetsu-jigokudani.JPG/960px-Noboribetsu-jigokudani.JPG",
    "label": "登別・地獄谷",
    "source": "https://commons.wikimedia.org/wiki/File:Noboribetsu-jigokudani.JPG",
    "author": "Prosperosity",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2012年"
  },
  "shiroi": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Shiroi_Koibito_Park_20260703m.jpg/960px-Shiroi_Koibito_Park_20260703m.jpg",
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
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Asahiyama_Memorial_Park.jpg/960px-Asahiyama_Memorial_Park.jpg",
    "label": "旭山記念公園",
    "source": "https://commons.wikimedia.org/wiki/File:Asahiyama_Memorial_Park.jpg",
    "author": "Ozizo",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Asahiyama_Memorial_Park.jpg",
    "year": "2009年"
  },
  "newotani": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Asahi_Building_Sapporo_20070601-001.jpg/960px-Asahi_Building_Sapporo_20070601-001.jpg",
    "label": "ニューオータニイン札幌が入る朝日ビル",
    "source": "https://commons.wikimedia.org/wiki/File:Asahi_Building_Sapporo_20070601-001.jpg",
    "author": "J o",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "year": "2007年"
  }
};

// 2026-10-21: ユーザーから提供された写真リンク。
// Google画像検索の6枚は撮影場所が確認できないため仮配置。
// 公式画像も再利用の許可が与えられたことを意味しません。
const userSubmittedPhotos = {
  "airport": {
    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOmB7jNHkZf-CiXWunLcGix97qCl8bpXn-OHpqgCDlw&s=10",
    "label": "ユーザー提供画像 1（場所未確認）",
    "source": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOmB7jNHkZf-CiXWunLcGix97qCl8bpXn-OHpqgCDlw&s=10",
    "author": "未確認",
    "license": "未確認",
    "licenseUrl": "",
    "year": "不明",
    "sourceType": "google-thumbnail",
    "permissionPending": true,
    "usage": "仮配置（撮影場所・著作者・利用条件は未確認）"
  },
  "otaru": {
    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvmx3mLYlkRKem-04ltBrix2Q8MHQhfwG8w9ooWUgoUw&s=10",
    "label": "ユーザー提供画像 2（場所未確認）",
    "source": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvmx3mLYlkRKem-04ltBrix2Q8MHQhfwG8w9ooWUgoUw&s=10",
    "author": "未確認",
    "license": "未確認",
    "licenseUrl": "",
    "year": "不明",
    "sourceType": "google-thumbnail",
    "permissionPending": true,
    "usage": "仮配置（撮影場所・著作者・利用条件は未確認）"
  },
  "glass": {
    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnLDx9qf2eTcgzIYxIDlsyeXtc0PAJqmh-Tk_ApZMr2Q&s=10",
    "label": "ユーザー提供画像 3（場所未確認）",
    "source": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnLDx9qf2eTcgzIYxIDlsyeXtc0PAJqmh-Tk_ApZMr2Q&s=10",
    "author": "未確認",
    "license": "未確認",
    "licenseUrl": "",
    "year": "不明",
    "sourceType": "google-thumbnail",
    "permissionPending": true,
    "usage": "仮配置（撮影場所・著作者・利用条件は未確認）"
  },
  "lake": {
    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrE54fxkqnoyeUm3hLHAAXcZczYAvG3MLx68NPY3c68Q&s=10",
    "label": "ユーザー提供画像 4（場所未確認）",
    "source": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrE54fxkqnoyeUm3hLHAAXcZczYAvG3MLx68NPY3c68Q&s=10",
    "author": "未確認",
    "license": "未確認",
    "licenseUrl": "",
    "year": "不明",
    "sourceType": "google-thumbnail",
    "permissionPending": true,
    "usage": "仮配置（撮影場所・著作者・利用条件は未確認）"
  },
  "jigokudani": {
    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4NtyEaHzG_z5C02TTV8R6CC5hClzUep5NXyP5LNde9g&s=10",
    "label": "ユーザー提供画像 5（場所未確認）",
    "source": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4NtyEaHzG_z5C02TTV8R6CC5hClzUep5NXyP5LNde9g&s=10",
    "author": "未確認",
    "license": "未確認",
    "licenseUrl": "",
    "year": "不明",
    "sourceType": "google-thumbnail",
    "permissionPending": true,
    "usage": "仮配置（撮影場所・著作者・利用条件は未確認）"
  },
  "shiroi": {
    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXEQaf3EjUIZxGERDINvMG7Tsn2HFYM_RuLzgWYj11yg&s=10",
    "label": "ユーザー提供画像 6（場所未確認）",
    "source": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXEQaf3EjUIZxGERDINvMG7Tsn2HFYM_RuLzgWYj11yg&s=10",
    "author": "未確認",
    "license": "未確認",
    "licenseUrl": "",
    "year": "不明",
    "sourceType": "google-thumbnail",
    "permissionPending": true,
    "usage": "仮配置（撮影場所・著作者・利用条件は未確認）"
  },
  "music": {
    "url": "https://www.otaru-orgel.co.jp/cms/wp-content/themes/otaru-orgel/images/shop/img_honkan01.jpg",
    "label": "小樽オルゴール堂 本館 外観",
    "source": "https://www.otaru-orgel.co.jp/cms/wp-content/themes/otaru-orgel/images/shop/img_honkan01.jpg",
    "author": "小樽オルゴール堂公式サイト",
    "license": "公開利用条件は未確認",
    "licenseUrl": "",
    "year": "不明",
    "sourceType": "official",
    "permissionPending": true,
    "usage": "公式サイト掲載画像。転載許諾は未確認"
  }
};
Object.assign(venuePhotos,userSubmittedPhotos);

function getPhotoKey(title){
 if(/ヒルトンニセコ/.test(title))return 'hilton';
 if(/羽田空港|新千歳空港|飛行機|航空機/.test(title))return 'airport';
 if(/ガラス作り|ガラスエッチング/.test(title))return 'glass';
 if(/小樽で昼食/.test(title))return 'otaru';
 if(/ニセコビレッジ|スキー|スノボ|ゲレンデ/.test(title))return 'niseko';
 if(/オルゴール/.test(title))return 'music';
 if(/小樽運河|小樽自由行動/.test(title))return 'otaru';
 if(/洞爺湖/.test(title))return 'lake';
 if(/地獄谷|登別/.test(title))return 'jigokudani';
 if(/白い恋人/.test(title))return 'shiroi';
 if(/サッポロビール園|札幌ビール園/.test(title))return 'beer';
 if(/旭山記念/.test(title))return 'asahiyama';
 if(/ニューオータニイン/.test(title))return 'newotani';
 if(/新千歳空港/.test(title))return 'airport';
 return null;
}
const place=(name,desc)=>({name,desc,photo:getPhotoKey(name)});
const ev=(start,end,title,type='activity',note='')=>({start,end,title,type,note});
// 2026-10-21: 添付「北海道 行程表.pdf」2〜5ページの時刻に更新。
// PDFに暦日・便名の記載はないため、以前の12月7〜10日の暦日は暫定継続。
// 単一時刻の予定はstart===endとし、持続時間を推定しない。
// 優先資料：日本旅行「北海道コース行程表_261005.pdf」（2026-10-05）。
// 補完資料：提供された「北海道 行程表.pdf」の2〜5ページ詳細表。
// 重複・矛盾する時刻／場所／活動では日本旅行を優先。時刻不明は推測せず「参考枠」「要確認」と明記。
const dayRows=[
 {
  "id": "day1",
  "num": "01",
  "date": "12月7日（月）",
  "title": "羽田・小樽・ニセコ",
  "desc": "日本旅行の時刻を優先。学内行程表の集合・ホテル内行程を補完。",
  "start": "06:30",
  "end": "21:00",
  "courses": [
   {
    "id": "ski",
    "label": "ゲレンデ班",
    "rows": [
     [
      "06:30",
      "06:30",
      "羽田空港 集合",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "07:00",
      "07:00",
      "点呼終了・移動開始",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "08:00",
      "09:30",
      "ANA53 羽田 → 新千歳",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "09:30",
      "09:30",
      "新千歳空港で点呼終了",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "10:00",
      "11:30",
      "バス：新千歳空港 → 小樽",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "11:30",
      "12:20",
      "小樽で昼食",
      "food",
      "日本旅行：昼食候補は北海あぶりやき運河倉庫／ニュー三幸。会場未確定。"
     ],
     [
      "12:20",
      "14:20",
      "バス：ニセコ方面へ移動（表示枠）",
      "travel",
      "日本旅行：昼食終了12:20・ホテル到着14:20。乗車時刻そのものは未記載。"
     ],
     [
      "14:20",
      "14:50",
      "スキーの準備・着替え",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "15:00",
      "16:00",
      "スキー・スノーボード",
      "activity",
      "補完：学内行程表。日本旅行は「午後講習」と記載。"
     ],
     [
      "16:00",
      "16:30",
      "着替え",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "17:30",
      "17:30",
      "ヒルトンニセコビレッジで全体集合",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "17:30",
      "18:00",
      "荷物移動",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "18:30",
      "19:20",
      "夕食",
      "food",
      "補完：学内行程表。"
     ],
     [
      "21:00",
      "21:00",
      "就寝",
      "activity",
      "学内行程表では就寝の終了欄に21:00と記載。時刻要確認。"
     ]
    ],
    "unknown": [
     "日本旅行のホテル到着は14:20。学内行程表の用具レンタル14:05〜14:20は到着前と重なるため時刻を採用していません。現地で確認してください。",
     "12:20〜14:20のバス表示は日本旅行の昼食終了とホテル到着を結ぶ表示枠です。バス出発時刻は要確認。",
     "学内行程表に入浴時間の記載はありません。"
    ],
    "places": [
     [
      "小樽で昼食",
      "11:30〜12:20。候補：北海あぶりやき運河倉庫、ニュー三幸。会場未確定。"
     ],
     [
      "ニセコビレッジスキーリゾート",
      "日本旅行は午後講習と記載。学内行程表の15:00〜16:00を参考表示。"
     ],
     [
      "ヒルトンニセコビレッジ",
      "日本旅行による到着14:20。1・2泊目の宿泊先。"
     ]
    ]
   },
   {
    "id": "tour",
    "label": "観光班",
    "rows": [
     [
      "06:30",
      "06:30",
      "羽田空港 集合",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "07:00",
      "07:00",
      "点呼終了・移動開始",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "08:00",
      "09:30",
      "ANA53 羽田 → 新千歳",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "09:30",
      "09:30",
      "新千歳空港で点呼終了",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "10:00",
      "11:30",
      "バス：新千歳空港 → 小樽",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "11:30",
      "12:20",
      "小樽で昼食",
      "food",
      "日本旅行：昼食候補は北海あぶりやき運河倉庫／ニュー三幸。会場未確定。"
     ],
     [
      "12:30",
      "13:30",
      "小樽オルゴール堂 遊工房",
      "activity",
      "日本旅行：トッピングキット・手廻しオルゴール制作。"
     ],
     [
      "15:15",
      "17:15",
      "ニセコでガラスエッチング体験",
      "activity",
      "優先資料：日本旅行。"
     ],
     [
      "17:15",
      "17:30",
      "ホテルへ移動",
      "travel",
      "日本旅行：ホテル到着17:30。移動手段・出発時刻の詳細は要確認。"
     ],
     [
      "17:30",
      "17:30",
      "ヒルトンニセコビレッジで全体集合",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "17:30",
      "18:00",
      "荷物移動",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "18:30",
      "19:20",
      "夕食",
      "food",
      "補完：学内行程表。"
     ],
     [
      "21:00",
      "21:00",
      "就寝",
      "activity",
      "学内行程表では就寝の終了欄に21:00と記載。時刻要確認。"
     ]
    ],
    "unknown": [
     "学内行程表の小樽オルゴール堂自由行動13:30〜14:30は、日本旅行の遊工房12:30〜13:30と異なるため日本旅行の時刻・活動を優先。",
     "小樽からニセコのガラス体験会場までの出発・到着時刻は日本旅行に記載がありません。学内行程表の14:45出発も移動所要時間と整合しないため採用していません。",
     "学内行程表のガラス体験場所未定に対し、日本旅行は「ニセコ」と記載。体験施設の正式名称は未確定。"
    ],
    "places": [
     [
      "小樽オルゴール堂 遊工房",
      "12:30〜13:30にオルゴール制作体験（日本旅行）。"
     ],
     [
      "ガラスエッチング体験",
      "15:15〜17:15、ニセコ方面。具体的な会場名は未確定。"
     ],
     [
      "ヒルトンニセコビレッジ",
      "17:30到着・全体集合予定。"
     ]
    ]
   }
  ]
 },
 {
  "id": "day2",
  "num": "02",
  "date": "12月8日（火）",
  "title": "ニセコ・洞爺湖・登別",
  "desc": "日本旅行の講習・昼食・観光時刻を優先。学内行程表で朝の予定を補完。",
  "start": "06:30",
  "end": "21:00",
  "courses": [
   {
    "id": "ski",
    "label": "ゲレンデ班",
    "rows": [
     [
      "06:30",
      "06:30",
      "ヒルトンニセコビレッジで起床",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "07:00",
      "07:50",
      "朝食",
      "food",
      "補完：学内行程表。"
     ],
     [
      "08:00",
      "08:00",
      "コース別行動開始",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "08:30",
      "09:00",
      "ゲレンデで着替え",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "09:00",
      "11:00",
      "スキー・スノーボード講習（午前）",
      "activity",
      "優先資料：日本旅行。"
     ],
     [
      "11:00",
      "13:00",
      "昼食・休憩（講習間の時間帯）",
      "food",
      "日本旅行：昼食はホテル。11:00〜13:00は午前・午後講習の間の時間帯で、食事の開始・終了時刻を示すものではありません。"
     ],
     [
      "13:00",
      "15:00",
      "スキー・スノーボード講習（午後）",
      "activity",
      "優先資料：日本旅行。"
     ],
     [
      "17:10",
      "17:10",
      "ホテルで点呼",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "17:20",
      "18:10",
      "夕食",
      "food",
      "補完：学内行程表。"
     ],
     [
      "21:00",
      "21:00",
      "就寝",
      "activity",
      "補完：学内行程表。"
     ]
    ],
    "unknown": [
     "日本旅行の講習時刻9:00〜11:00／13:00〜15:00を優先。学内行程表の午前9:00〜12:40・午後14:00〜16:00は採用していません。",
     "昼食時刻そのものは日本旅行に記載がありません。11:00〜13:00の表示は講習間の時間帯です。"
    ],
    "places": [
     [
      "ニセコビレッジスキーリゾート",
      "午前9:00〜11:00・午後13:00〜15:00、日本旅行の講習時刻。"
     ],
     [
      "ヒルトンニセコビレッジ",
      "日本旅行による昼食会場。夕食は学内行程表を参考。"
     ]
    ]
   },
   {
    "id": "tour",
    "label": "観光班",
    "rows": [
     [
      "06:30",
      "06:30",
      "ヒルトンニセコビレッジで起床",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "07:00",
      "07:50",
      "朝食",
      "food",
      "補完：学内行程表。"
     ],
     [
      "08:00",
      "08:00",
      "コース別行動開始",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "09:00",
      "10:20",
      "バス：洞爺湖へ移動",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "10:20",
      "11:20",
      "洞爺湖で自由行動",
      "activity",
      "優先資料：日本旅行。"
     ],
     [
      "11:30",
      "12:20",
      "民芸御殿で昼食",
      "food",
      "優先資料：日本旅行。"
     ],
     [
      "12:20",
      "13:20",
      "登別方面へ移動（表示枠）",
      "travel",
      "日本旅行：昼食終了12:20・登別自由行動開始13:20。乗車時間は未記載。"
     ],
     [
      "13:20",
      "13:50",
      "登別で自由行動",
      "activity",
      "優先資料：日本旅行。登別駅周辺で解散・再集合。"
     ],
     [
      "13:50",
      "15:50",
      "地獄谷で自由行動",
      "activity",
      "優先資料：日本旅行。"
     ],
     [
      "16:00",
      "17:50",
      "バス：ホテルへ移動",
      "travel",
      "学内行程表の出発16:00と日本旅行のホテル到着17:50を組み合わせた参考時間。"
     ],
     [
      "21:00",
      "21:00",
      "就寝",
      "activity",
      "補完：学内行程表。"
     ]
    ],
    "unknown": [
     "学内行程表の登別昼食12:20〜13:20は、日本旅行の民芸御殿11:30〜12:20と異なるため不採用。",
     "日本旅行のホテル到着17:50と学内行程表の点呼17:10・夕食17:20〜18:10は重なるため、観光班には点呼・夕食の時刻を確定表示していません。",
     "登別方面とホテル方面のバス時刻は出発／到着の片側を別資料で補完した参考枠です。学校の最終案内を優先。"
    ],
    "places": [
     [
      "洞爺湖",
      "日本旅行の自由行動10:20〜11:20。"
     ],
     [
      "民芸御殿",
      "観光班の昼食会場。11:30〜12:20（日本旅行）。"
     ],
     [
      "登別・地獄谷",
      "登別13:20〜13:50、地獄谷13:50〜15:50（日本旅行）。"
     ],
     [
      "ヒルトンニセコビレッジ",
      "日本旅行の観光班帰着予定17:50。"
     ]
    ]
   }
  ]
 },
 {
  "id": "day3",
  "num": "03",
  "date": "12月9日（水）",
  "title": "小樽・札幌",
  "desc": "日本旅行の小樽〜札幌・夕食・夜景行程を優先。",
  "start": "07:00",
  "end": "21:00",
  "courses": [
   {
    "id": "all",
    "label": "共通行程",
    "rows": [
     [
      "07:00",
      "07:00",
      "ヒルトンニセコビレッジで起床",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "09:00",
      "11:00",
      "バス：ホテル → 小樽",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "11:00",
      "12:00",
      "小樽で自由行動（前半）",
      "activity",
      "日本旅行の自由行動11:00〜14:55を表示上区切っています。"
     ],
     [
      "12:00",
      "13:00",
      "小樽で各自昼食（参考枠）",
      "food",
      "日本旅行は「各自昼食」で時刻未記載。学内行程表の12:00〜13:00を参考表示。"
     ],
     [
      "13:00",
      "14:55",
      "小樽運河などで自由行動",
      "activity",
      "日本旅行の小樽滞在は14:55まで。学内行程表の小樽運河自由行動を補完。"
     ],
     [
      "14:55",
      "15:30",
      "バス：白い恋人パーク方面へ移動",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "15:30",
      "17:00",
      "白い恋人パーク観光",
      "activity",
      "優先資料：日本旅行。"
     ],
     [
      "17:00",
      "17:30",
      "バス：札幌夕食会場へ移動",
      "travel",
      "日本旅行の観光終了17:00・夕食想定開始17:30を結ぶ参考時間枠。"
     ],
     [
      "17:30",
      "18:30",
      "札幌ビール園で夕食（想定）",
      "food",
      "日本旅行では17:30〜18:30「想定」。会場の代替候補あり。"
     ],
     [
      "18:30",
      "19:00",
      "バス：旭山記念公園へ移動（参考枠）",
      "travel",
      "日本旅行の夕食終了想定18:30・旭山記念公園到着19:00。"
     ],
     [
      "19:00",
      "19:30",
      "旭山記念公園",
      "activity",
      "優先資料：日本旅行。"
     ],
     [
      "19:30",
      "20:00",
      "バス：ニューオータニイン札幌へ移動（参考枠）",
      "travel",
      "日本旅行：ホテル到着は20:00頃。"
     ],
     [
      "21:00",
      "21:00",
      "就寝",
      "activity",
      "補完：学内行程表。"
     ]
    ],
    "unknown": [
     "日本旅行では小樽自由行動中の昼食は各自。12:00〜13:00は学内行程表による参考時間です。",
     "学内行程表の白い恋人パーク16:45〜18:00と札幌市内夕食19:00〜20:30は日本旅行と異なるため採用していません。",
     "日本旅行の札幌夕食は「想定」で、会場は札幌ビール園のほかアサヒビール園はなます館・ジンギスカン羊々亭が候補です。",
     "学内行程表の全体点呼9:00と日本旅行のホテル出発9:00は同時刻のため、点呼実施時刻は要確認。"
    ],
    "places": [
     [
      "小樽運河",
      "日本旅行：小樽滞在11:00〜14:55、昼食各自。"
     ],
     [
      "白い恋人パーク",
      "日本旅行：15:30〜17:00。"
     ],
     [
      "サッポロビール園",
      "日本旅行の札幌夕食の想定会場。変更候補あり。"
     ],
     [
      "旭山記念公園",
      "日本旅行：19:00〜19:30。"
     ],
     [
      "ニューオータニイン札幌",
      "日本旅行：20:00頃到着、3泊目の宿泊先。"
     ]
    ]
   }
  ]
 },
 {
  "id": "day4",
  "num": "04",
  "date": "12月10日（木）",
  "title": "札幌・新千歳・羽田",
  "desc": "日本旅行の9:00出発・14:00空港着・ANA68を優先。",
  "start": "07:00",
  "end": "17:45",
  "courses": [
   {
    "id": "all",
    "label": "共通行程",
    "rows": [
     [
      "07:00",
      "07:00",
      "ニューオータニイン札幌で起床",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "07:30",
      "07:30",
      "朝食",
      "activity",
      "補完：学内行程表。終了時刻は未記載。"
     ],
     [
      "08:25",
      "08:30",
      "ホテルで点呼",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "09:00",
      "14:00",
      "札幌市内班別行動・新千歳空港へ移動（内訳未確定）",
      "activity",
      "日本旅行：ホテル出発9:00、新千歳空港着14:00。昼食は各自。空港移動はバスまたは各自。"
     ],
     [
      "14:00",
      "15:30",
      "新千歳空港・搭乗準備",
      "activity",
      "日本旅行：14:00空港到着、15:30出発。途中の搭乗手続き時間は未記載。"
     ],
     [
      "15:30",
      "17:10",
      "ANA68 新千歳 → 羽田",
      "travel",
      "優先資料：日本旅行。"
     ],
     [
      "17:30",
      "17:30",
      "羽田空港で点呼終了",
      "activity",
      "補完：学内行程表。"
     ],
     [
      "17:45",
      "17:45",
      "解散",
      "activity",
      "補完：学内行程表。"
     ]
    ],
    "unknown": [
     "学内行程表の札幌自由行動開始8:30・空港へのバス出発11:50頃・空港着13:00は、日本旅行のホテル出発9:00・空港着14:00を優先して採用していません。",
     "学内行程表の11:35〜11:45点呼とお土産購入は、日本旅行の班別行動・空港到着時刻と整合の確認が必要です。",
     "日本旅行には班別行動終了・新千歳空港への移動開始時刻がありません。9:00〜14:00は行動と移動を合わせた表示枠です。"
    ],
    "places": [
     [
      "札幌市内",
      "日本旅行：9:00ホテル出発・班別行動、昼食各自。"
     ],
     [
      "新千歳空港",
      "日本旅行：14:00到着予定・15:30出発。"
     ],
     [
      "羽田空港",
      "日本旅行：17:10到着。学内行程表：17:30点呼終了・17:45解散。"
     ]
    ]
   }
  ]
 }
]
const days=dayRows.map(day=>({
 id:day.id,num:day.num,date:day.date,title:day.title,desc:day.desc,start:day.start,end:day.end,
 courses:day.courses.map(course=>({
   id:course.id,label:course.label,
   events:course.rows.map(([start,end,title,type,note])=>ev(start,end,title,type,note)),
   unknown:course.unknown,
   places:course.places.map(([name,desc])=>place(name,desc))
 }))
}));


// 画像CDNが利用できない環境向けの、ファイルに依存しない風景イメージ。
// 実際のホテル・観光地の写真ではありません（画面でも明示）。
const offlineSceneData = {};
const offlineSceneForVenue = {"airport":"landscape","otaru":"forest","glass":"sunrise","music":"sunrise","hilton":"mountains","niseko":"mountains","lake":"landscape","jigokudani":"mountains","shiroi":"sunrise","beer":"forest","asahiyama":"landscape","newotani":"sunrise"};
