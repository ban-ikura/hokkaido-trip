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
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Niseko_Gondola_and_Hilton_Niseko_Village.jpg/960px-Niseko_Gondola_and_Hilton_Niseko_Village.jpg",
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
// 権利・撮影場所が未確認の提供画像は公開画面に反映しない。
// 検証済みのWikimedia Commons画像のみvenuePhotosに残す。

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
 if(/旭山記念/.test(title))return 'asahiyama';
 if(/ニューオータニイン/.test(title))return 'newotani';
 if(/新千歳空港/.test(title))return 'airport';
 return null;
}
const place=(name,desc)=>({name,desc,photo:getPhotoKey(name)});
const ev=(start,end,title,type='activity',note='')=>({start,end,title,type,note});
// 2026-11-15：提供された「北海道2026しおり Ver3」（20ページ）を優先。未記入の00:00は時刻として採用しない。
const dayRows=[
  {
    "id": "day1",
    "num": "01",
    "date": "12月7日（月）",
    "title": "出発・ゲレンデ班／観光班",
    "desc": "11月18日版しおり p.6〜8。班によって行程が異なります。",
    "start": "06:30",
    "end": "22:00",
    "courses": [
      {
        "id": "ski",
        "label": "ゲレンデ班",
        "rows": [
          [
            "06:30",
            "06:30",
            "羽田空港第2旅客ターミナル地下1階・マクドナルド羽田空港第2ターミナル駅店前 集合",
            "activity",
            "クラスごとに整列して点呼。"
          ],
          [
            "06:30",
            "08:00",
            "保安検査・搭乗手続き",
            "activity",
            ""
          ],
          [
            "08:00",
            "09:30",
            "ANA53便 羽田空港 → 新千歳空港",
            "travel",
            ""
          ],
          [
            "09:30",
            "09:30",
            "新千歳空港 到着・点呼",
            "activity",
            "クラスごとに整列して点呼後、バスへ。"
          ],
          [
            "10:00",
            "10:00",
            "新千歳空港 発",
            "travel",
            "途中休憩：きのこ王国 大滝本店。"
          ],
          [
            "13:00",
            "13:00",
            "ヒルトンニセコビレッジ 到着",
            "activity",
            ""
          ],
          [
            "13:00",
            "13:50",
            "昼食（ポテトカレー）",
            "food",
            "ヒルトンにて昼食。"
          ],
          [
            "14:30",
            "14:45",
            "開校式",
            "activity",
            ""
          ],
          [
            "14:45",
            "16:00",
            "午後の班別スキー・スノーボード講習",
            "activity",
            "しおりでは「14:30〜14:45 開校式」「〜16:00 PM班別講習」と記載。"
          ],
          [
            "未定",
            "未定",
            "夕食（バイキング）",
            "food",
            "夕食時刻はしおりに記載なし。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            ""
          ]
        ],
        "unknown": [
          "夕食の時刻は未記入です。"
        ],
        "places": [
          [
            "羽田空港第2旅客ターミナル",
            "6:30集合。地下1階のマクドナルド羽田空港第2ターミナル駅店前。"
          ],
          [
            "新千歳空港",
            "9:30到着、10:00出発。"
          ],
          [
            "きのこ王国 大滝本店",
            "新千歳空港からホテルへのバス移動途中に休憩。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "13:00到着、昼食後に開校式・講習。"
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
            "羽田空港第2旅客ターミナル地下1階・マクドナルド羽田空港第2ターミナル駅店前 集合",
            "activity",
            "クラスごとに整列して点呼。"
          ],
          [
            "06:30",
            "08:00",
            "保安検査・搭乗手続き",
            "activity",
            ""
          ],
          [
            "08:00",
            "09:30",
            "ANA53便 羽田空港 → 新千歳空港",
            "travel",
            ""
          ],
          [
            "09:30",
            "09:30",
            "新千歳空港 到着・点呼",
            "activity",
            ""
          ],
          [
            "10:00",
            "10:00",
            "新千歳空港 発",
            "travel",
            ""
          ],
          [
            "11:30",
            "12:20",
            "小樽で昼食（ニュー三幸）",
            "food",
            ""
          ],
          [
            "12:45",
            "13:45",
            "小樽オルゴール堂 遊工房",
            "activity",
            "トッピングキット・手廻しオルゴール。"
          ],
          [
            "14:00",
            "15:45",
            "サンドブラスト体験（北一硝子製作体験工房）",
            "activity",
            ""
          ],
          [
            "15:45",
            "15:45",
            "バス移動",
            "travel",
            ""
          ],
          [
            "17:45",
            "17:45",
            "ヒルトンニセコビレッジ 到着",
            "activity",
            ""
          ],
          [
            "未定",
            "未定",
            "夕食（バイキング）",
            "food",
            "夕食時刻はしおりに記載なし。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            ""
          ]
        ],
        "unknown": [
          "夕食の時刻は未記入です。"
        ],
        "places": [
          [
            "羽田空港第2旅客ターミナル",
            "6:30集合。"
          ],
          [
            "小樽・ニュー三幸",
            "11:30〜12:20に昼食。"
          ],
          [
            "小樽オルゴール堂 遊工房",
            "12:45〜13:45。トッピングキット・手廻しオルゴール。"
          ],
          [
            "北一硝子製作体験工房",
            "14:00〜15:45にサンドブラスト体験。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "17:45到着。"
          ]
        ]
      }
    ]
  },
  {
    "id": "day2",
    "num": "02",
    "date": "12月8日（火）",
    "title": "スキー・スノーボード／洞爺湖・登別",
    "desc": "11月18日版しおり p.7・9。ゲレンデ班と観光班で行程が異なります。",
    "start": "09:00",
    "end": "22:00",
    "courses": [
      {
        "id": "ski",
        "label": "ゲレンデ班",
        "rows": [
          [
            "09:00",
            "11:00",
            "午前の班別スキー・スノーボード講習",
            "activity",
            ""
          ],
          [
            "11:00",
            "12:40",
            "昼食・休憩",
            "food",
            "昼食はハンバーグステーキ。しおりの昼食枠は11:00〜12:40。"
          ],
          [
            "12:40",
            "16:00",
            "午後の班別スキー・スノーボード講習",
            "activity",
            "14:40〜16:00は閉会式終了後のフリー滑走あり。"
          ],
          [
            "未定",
            "未定",
            "夕食（バイキング）",
            "food",
            "夕食時刻はしおりに記載なし。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            ""
          ]
        ],
        "unknown": [
          "夕食の時刻は未記入です。"
        ],
        "places": [
          [
            "ヒルトンニセコビレッジ",
            "終日滞在。1・2泊目の宿泊先。"
          ],
          [
            "ニセコビレッジスキーリゾート",
            "9:00〜11:00午前講習、12:40〜16:00午後講習。14:40〜16:00はフリー滑走あり。"
          ]
        ]
      },
      {
        "id": "tour",
        "label": "観光班",
        "rows": [
          [
            "09:00",
            "09:00",
            "ヒルトンニセコビレッジ 発",
            "travel",
            "バス移動。"
          ],
          [
            "10:20",
            "13:00",
            "洞爺湖 自由行動・各自昼食",
            "activity",
            "バスは洞爺湖文化センター駐車場で待機。"
          ],
          [
            "13:00",
            "13:50",
            "バス移動",
            "travel",
            ""
          ],
          [
            "13:50",
            "15:50",
            "登別・地獄谷 自由行動",
            "activity",
            "バスは登別地獄谷バス駐車場で待機。"
          ],
          [
            "15:50",
            "17:50",
            "バス移動",
            "travel",
            ""
          ],
          [
            "17:50",
            "17:50",
            "ヒルトンニセコビレッジ 着",
            "activity",
            ""
          ],
          [
            "未定",
            "未定",
            "夕食（バイキング）",
            "food",
            "夕食時刻はしおりに記載なし。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            ""
          ]
        ],
        "unknown": [
          "洞爺湖・地獄谷の自由行動中、バスの待機場所が指定されています。",
          "夕食の時刻は未記入です。"
        ],
        "places": [
          [
            "洞爺湖文化センター",
            "10:20〜13:00自由行動・各自昼食。バス待機場所。"
          ],
          [
            "登別地獄谷",
            "13:50〜15:50自由行動。バス待機場所は登別地獄谷バス駐車場。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "17:50到着。"
          ]
        ]
      }
    ]
  },
  {
    "id": "day3",
    "num": "03",
    "date": "12月9日（水）",
    "title": "小樽・白い恋人パーク・札幌",
    "desc": "11月18日版しおり p.10。全体共通の行程です。",
    "start": "09:00",
    "end": "22:00",
    "courses": [
      {
        "id": "all",
        "label": "共通行程",
        "rows": [
          [
            "09:00",
            "09:00",
            "ヒルトンニセコビレッジ 発",
            "travel",
            "バス移動。"
          ],
          [
            "11:00",
            "14:45",
            "小樽 自由行動・各自昼食",
            "activity",
            ""
          ],
          [
            "14:45",
            "15:20",
            "バス移動",
            "travel",
            ""
          ],
          [
            "15:20",
            "16:45",
            "白い恋人パーク",
            "activity",
            ""
          ],
          [
            "16:45",
            "17:30",
            "バス移動",
            "travel",
            ""
          ],
          [
            "17:30",
            "18:30",
            "アサヒビール園で夕食",
            "food",
            "ジンギスカン・焼肉三種。"
          ],
          [
            "18:30",
            "19:00",
            "バス移動",
            "travel",
            ""
          ],
          [
            "19:00",
            "19:30",
            "旭山記念公園",
            "activity",
            ""
          ],
          [
            "19:30",
            "20:00",
            "バス移動",
            "travel",
            ""
          ],
          [
            "20:00",
            "20:00",
            "ニューオータニイン札幌 到着",
            "activity",
            "3泊目の宿泊先。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            ""
          ]
        ],
        "unknown": [],
        "places": [
          [
            "ヒルトンニセコビレッジ",
            "9:00出発。"
          ],
          [
            "小樽",
            "11:00〜14:45自由行動・各自昼食。"
          ],
          [
            "白い恋人パーク",
            "15:20〜16:45。"
          ],
          [
            "アサヒビール園",
            "17:30〜18:30夕食。ジンギスカン・焼肉三種。"
          ],
          [
            "旭山記念公園",
            "19:00〜19:30。"
          ],
          [
            "ニューオータニイン札幌",
            "20:00到着・3泊目。"
          ]
        ]
      }
    ]
  },
  {
    "id": "day4",
    "num": "04",
    "date": "12月10日（木）",
    "title": "札幌市内・新千歳空港・帰京",
    "desc": "11月18日版しおり p.11。札幌市内の出発時刻はしおりに未記入です。",
    "start": "09:00",
    "end": "17:10",
    "courses": [
      {
        "id": "all",
        "label": "共通行程",
        "rows": [
          [
            "09:00",
            "09:00",
            "ニューオータニイン札幌",
            "activity",
            ""
          ],
          [
            "09:00",
            "未定",
            "札幌市内 班別行動・各自昼食",
            "activity",
            "さっぽろテレビ塔付近からバスに乗車。集合・出発時刻はしおりに記載なし。"
          ],
          [
            "未定",
            "14:00",
            "さっぽろテレビ塔付近 発・新千歳空港へ",
            "travel",
            "バス移動。"
          ],
          [
            "14:00",
            "15:30",
            "新千歳空港 到着・保安検査・搭乗手続き",
            "activity",
            ""
          ],
          [
            "15:30",
            "17:10",
            "ANA68便 新千歳空港 → 羽田空港",
            "travel",
            ""
          ],
          [
            "17:10",
            "17:10",
            "羽田空港 到着・流れ解散",
            "activity",
            ""
          ]
        ],
        "unknown": [
          "札幌市内班別行動の終了時刻と、さっぽろテレビ塔付近からのバス出発時刻は未記入です。"
        ],
        "places": [
          [
            "ニューオータニイン札幌",
            "9:00から最終日の行動開始。"
          ],
          [
            "札幌市内",
            "班別行動・各自昼食。"
          ],
          [
            "さっぽろテレビ塔付近",
            "新千歳空港行きバスの出発場所。時刻は未記入。"
          ],
          [
            "新千歳空港",
            "14:00到着、15:30発。"
          ],
          [
            "羽田空港",
            "17:10到着・流れ解散。"
          ]
        ]
      }
    ]
  }
];

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
const offlineSceneForVenue = {"airport":"landscape","otaru":"forest","glass":"sunrise","music":"sunrise","hilton":"mountains","niseko":"mountains","lake":"landscape","jigokudani":"mountains","shiroi":"sunrise","asahiyama":"landscape","newotani":"sunrise"};
