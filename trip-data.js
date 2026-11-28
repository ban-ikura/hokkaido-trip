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
// 2026-11-18：提供された「北海道2026しおり Ver3」（18ページ）を優先。未記入の時刻は推測して補わない。
const dayRows=[
  {
    "id": "day1",
    "num": "01",
    "date": "12月7日（月）",
    "title": "出発・ゲレンデ班／観光班",
    "desc": "11月28日版しおり p.12〜13。班によって行程が異なります。",
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
            "6:30までに点呼完了。クラスごとに整列。"
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
            "11:30",
            "新千歳空港 発・バス移動",
            "travel",
            "途中休憩：きのこ王国 大滝本店。11:30ごろヒルトンニセコビレッジ着。"
          ],
          [
            "11:30",
            "11:30",
            "ヒルトンニセコビレッジ 到着",
            "activity",
            ""
          ],
          [
            "13:30",
            "13:50",
            "昼食（ポテトカレー）",
            "food",
            "ヒルトンにて昼食。昼食後にレンタル品を受け取る（受取時刻は未記入）。"
          ],
          [
            "14:30",
            "14:45",
            "開校式（ゲレンデ）",
            "activity",
            ""
          ],
          [
            "14:45",
            "16:00",
            "午後の班別スキー・スノーボード講習",
            "activity",
            ""
          ],
          [
            "18:00",
            "19:00",
            "夕食（バイキング）",
            "food",
            "ゲレンデ班。"
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
          "レンタル品の受取時刻は未記入です。"
        ],
        "places": [
          [
            "羽田空港第2旅客ターミナル",
            "6:30までに点呼完了。地下1階のマクドナルド羽田空港第2ターミナル駅店前。"
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
            "11:30ごろ到着。13:30〜13:50昼食、14:30開校式。"
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
            "6:30までに点呼完了。クラスごとに整列。"
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
            "11:30",
            "新千歳空港 発・バス移動",
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
            "17:45",
            "バス移動",
            "travel",
            "17:45ヒルトンニセコビレッジ着。"
          ],
          [
            "17:45",
            "17:45",
            "ヒルトンニセコビレッジ 到着",
            "activity",
            ""
          ],
          [
            "19:00",
            "20:00",
            "夕食（バイキング）",
            "food",
            "観光班。"
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
            "羽田空港第2旅客ターミナル",
            "6:30までに点呼完了。"
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
            "17:45到着。19:00〜20:00夕食。"
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
    "desc": "11月28日版しおり p.14〜15。ゲレンデ班と観光班で行程が異なります。",
    "start": "06:00",
    "end": "22:00",
    "courses": [
      {
        "id": "ski",
        "label": "ゲレンデ班",
        "rows": [
          [
            "06:00",
            "06:00",
            "起床",
            "activity",
            ""
          ],
          [
            "06:30",
            "07:30",
            "朝食（ゲレンデ班）",
            "food",
            ""
          ],
          [
            "09:00",
            "11:00",
            "午前の班別スキー・スノーボード講習",
            "activity",
            "朝食後にスキー・スノーボードの準備。"
          ],
          [
            "11:30",
            "12:15",
            "昼食（ハンバーグステーキ）",
            "food",
            "ヒルトンニセコビレッジに戻って昼食。"
          ],
          [
            "12:40",
            "16:00",
            "午後の班別スキー・スノーボード講習",
            "activity",
            "14:40〜16:00は閉会式終了後のフリー滑走あり。終了後、ホテルへ戻る。"
          ],
          [
            "18:00",
            "19:00",
            "夕食（バイキング）",
            "food",
            "ゲレンデ班。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            "チェックアウトに備えて荷物をまとめておく。"
          ]
        ],
        "unknown": [
          "朝食後の準備および講習終了後にホテルへ戻る時刻は未記入です。"
        ],
        "places": [
          [
            "ヒルトンニセコビレッジ",
            "1・2泊目の宿泊先。朝食・昼食・夕食の会場。"
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
            "06:00",
            "06:00",
            "起床",
            "activity",
            ""
          ],
          [
            "07:30",
            "08:30",
            "朝食（観光班）",
            "food",
            ""
          ],
          [
            "09:00",
            "09:00",
            "ヒルトンニセコビレッジ 発",
            "travel",
            "バス移動。"
          ],
          [
            "10:20",
            "12:45",
            "洞爺湖 自由行動・各自昼食",
            "activity",
            "バスは洞爺湖文化センター駐車場で待機。12:45に文化センター横駐車場へ集合。"
          ],
          [
            "12:45",
            "13:00",
            "洞爺湖文化センター横駐車場 集合",
            "activity",
            "点呼後、13:00に出発。"
          ],
          [
            "13:00",
            "13:50",
            "洞爺湖 発・登別へバス移動",
            "travel",
            ""
          ],
          [
            "13:50",
            "15:35",
            "登別・地獄谷 自由行動",
            "activity",
            "バスは登別地獄谷バス駐車場で待機。15:35に集合。"
          ],
          [
            "15:35",
            "15:50",
            "登別地獄谷バス駐車場 集合",
            "activity",
            "点呼後、15:50に出発。"
          ],
          [
            "15:50",
            "17:50",
            "登別地獄谷 発・ホテルへバス移動",
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
            "19:00",
            "20:00",
            "夕食（バイキング）",
            "food",
            "観光班。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            "チェックアウトに備えて荷物をまとめておく。"
          ]
        ],
        "unknown": [],
        "places": [
          [
            "洞爺湖文化センター横駐車場",
            "10:20から自由行動・各自昼食。12:45集合、13:00出発。"
          ],
          [
            "登別地獄谷バス駐車場",
            "13:50から自由行動。15:35集合、15:50出発。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "17:50到着。19:00〜20:00夕食。"
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
    "desc": "11月28日版しおり p.16。全体共通の行程です。",
    "start": "06:00",
    "end": "22:00",
    "courses": [
      {
        "id": "all",
        "label": "共通行程",
        "rows": [
          [
            "06:00",
            "06:00",
            "起床・部屋の清掃",
            "activity",
            ""
          ],
          [
            "06:30",
            "07:30",
            "朝食（ゲレンデ班）",
            "food",
            ""
          ],
          [
            "07:30",
            "08:30",
            "朝食（観光班）",
            "food",
            ""
          ],
          [
            "09:00",
            "09:00",
            "ヒルトンニセコビレッジ 発",
            "travel",
            "バス移動。"
          ],
          [
            "11:00",
            "14:30",
            "小樽・小樽運河 自由行動／各自昼食",
            "activity",
            "14:30に小樽観光バス駐車場へ集合。"
          ],
          [
            "14:30",
            "14:45",
            "小樽観光バス駐車場 集合・点呼",
            "activity",
            "14:45に出発。"
          ],
          [
            "14:45",
            "15:20",
            "小樽 発・白い恋人パークへバス移動",
            "travel",
            ""
          ],
          [
            "15:20",
            "16:45",
            "白い恋人パーク 班別自由見学",
            "activity",
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
            "19:00",
            "19:30",
            "旭山記念公園 夜景観賞",
            "activity",
            ""
          ],
          [
            "20:00",
            "20:00",
            "ニューオータニイン札幌 到着・荷物輸送手続き",
            "activity",
            "3泊目の宿泊先。"
          ],
          [
            "22:00",
            "22:00",
            "就寝",
            "activity",
            "チェックアウトに備えて荷物をまとめておく。"
          ]
        ],
        "unknown": [],
        "places": [
          [
            "ヒルトンニセコビレッジ",
            "9:00出発。"
          ],
          [
            "小樽観光バス駐車場",
            "14:30集合、14:45出発。"
          ],
          [
            "小樽・小樽運河",
            "11:00から自由行動・各自昼食。"
          ],
          [
            "白い恋人パーク",
            "15:20〜16:45班別自由見学。"
          ],
          [
            "アサヒビール園",
            "17:30〜18:30夕食。ジンギスカン・焼肉三種。"
          ],
          [
            "旭山記念公園",
            "19:00〜19:30夜景観賞。"
          ],
          [
            "ニューオータニイン札幌",
            "20:00到着・3泊目。荷物輸送手続き。"
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
    "desc": "11月28日版しおり p.17。空港集合時刻はp.11とp.17で記載に差があります。",
    "start": "06:00",
    "end": "17:10",
    "courses": [
      {
        "id": "all",
        "label": "共通行程",
        "rows": [
          [
            "06:00",
            "06:00",
            "起床・部屋の清掃",
            "activity",
            ""
          ],
          [
            "06:45",
            "08:30",
            "朝食（1グループ目）",
            "food",
            "約70人。"
          ],
          [
            "07:00",
            "08:30",
            "朝食（2グループ目）",
            "food",
            "約60人。"
          ],
          [
            "09:00",
            "09:00",
            "ニューオータニイン札幌 出発",
            "travel",
            "ルームキーを返却し、ホテル前のトラックに荷物を積み込んだ班から出発。"
          ],
          [
            "09:00",
            "12:15",
            "札幌市内 班別行動・各自昼食",
            "activity",
            "12:15にニューオータニイン札幌へ集合。"
          ],
          [
            "12:15",
            "12:30",
            "ニューオータニイン札幌 集合",
            "activity",
            "点呼後、12:30に出発。"
          ],
          [
            "12:30",
            "14:00",
            "札幌 発・新千歳空港へバス移動",
            "travel",
            ""
          ],
          [
            "14:00",
            "15:00",
            "新千歳空港 到着・保安検査・搭乗手続き",
            "activity",
            "搭乗ゲート集合時刻は、行程表p.17では15:00、空港の流れp.11では15:05と記載。学校の最終指示を確認。"
          ],
          [
            "15:00",
            "15:00",
            "出発ゲート集合（行程表p.17）",
            "activity",
            "空港の流れp.11では15:05集合と記載。時刻に差があるため要確認。"
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
          "出発ゲート集合時刻は、しおりp.11で15:05、p.17で15:00と異なります。学校の最終指示を確認してください。"
        ],
        "places": [
          [
            "ニューオータニイン札幌",
            "9:00出発。12:15集合、12:30出発。"
          ],
          [
            "札幌市内",
            "9:00から班別行動。昼食は各自。"
          ],
          [
            "新千歳空港",
            "14:00到着。出発ゲート集合時刻は15:00または15:05の記載差があるため要確認。15:30発。"
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
