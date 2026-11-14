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
    "desc": "2026年11月15日提供の『北海道2026しおり Ver3』7〜8ページを基準に掲載。夕食など「00:00」の欄は時刻未記入として扱います。",
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
            "羽田空港第2旅客ターミナル地下1階・マクドナルド 羽田空港第2ターミナル駅店前 集合",
            "activity",
            "しおり7・12ページ。到着した人からクラスごとに整列・点呼。"
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
            "クラスごとに点呼後、バスへ。"
          ],
          [
            "10:00",
            "10:00",
            "新千歳空港 発（バス移動）",
            "travel",
            "バス到着までの移動時間はしおりに未記入。"
          ],
          [
            "13:00",
            "13:00",
            "ホテル 到着",
            "activity",
            "ヒルトンニセコビレッジ（宿泊先はしおり11ページ）。"
          ],
          [
            "13:10",
            "13:50",
            "昼食",
            "food",
            ""
          ],
          [
            "14:15",
            "14:30",
            "開校式",
            "activity",
            ""
          ],
          [
            "14:30",
            "16:00",
            "スキー・スノーボード講習",
            "activity",
            ""
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
          "夕食はしおりに「00:00」とあり、実際の時刻は未記入です。学校からの案内を確認してください。",
          "ゲレンデ班のホテル到着は13:00と記載されています。観光班とは別の時刻です。"
        ],
        "places": [
          [
            "羽田空港第2旅客ターミナル",
            "地下1階のマクドナルド羽田空港第2ターミナル駅店前に6:30集合。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "13:00ホテル着、13:10〜13:50昼食、14:30〜16:00講習。"
          ],
          [
            "ニセコビレッジスキーリゾート",
            "ゲレンデ班は午後スキー・スノーボード講習。"
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
            "羽田空港第2旅客ターミナル地下1階・マクドナルド 羽田空港第2ターミナル駅店前 集合",
            "activity",
            "クラスごとに整列・点呼。"
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
            "新千歳空港 発（バス移動）",
            "travel",
            ""
          ],
          [
            "11:30",
            "11:30",
            "ホテル 到着（しおり原文）",
            "activity",
            "しおり8ページに『ホテル 着』と記載。後続の小樽体験との移動経路は要確認。"
          ],
          [
            "11:30",
            "12:20",
            "昼食",
            "food",
            ""
          ],
          [
            "12:30",
            "12:30",
            "小樽オルゴール堂 遊工房 到着",
            "activity",
            ""
          ],
          [
            "12:30",
            "13:30",
            "手廻しオルゴール制作",
            "activity",
            ""
          ],
          [
            "14:00",
            "15:45",
            "サンドブラスト体験",
            "activity",
            ""
          ],
          [
            "15:45",
            "15:45",
            "バス移動",
            "travel",
            "行き先の詳細・到着までの所要時間は未記入。"
          ],
          [
            "17:45",
            "17:45",
            "ホテル 到着",
            "activity",
            ""
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
          "11:30に『ホテル 着』、12:30に『小樽オルゴール堂 遊工房 着』と記載されていますが、両地点間の移動が説明されていません。記載どおり掲載し、移動方法・場所を要確認とします。",
          "夕食は「00:00」と記載され、時刻未定です。",
          "サンドブラスト体験の具体的な施設名はしおりにありません。"
        ],
        "places": [
          [
            "小樽オルゴール堂 遊工房",
            "12:30〜13:30に手廻しオルゴール制作。"
          ],
          [
            "サンドブラスト体験",
            "14:00〜15:45。会場名はしおりに未記載。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "観光班の17:45ホテル着。"
          ]
        ]
      }
    ]
  },
  {
    "id": "day2",
    "num": "02",
    "date": "12月8日（火）",
    "title": "スキー・スノボ／洞爺湖・登別",
    "desc": "『北海道2026しおり Ver3』7・9ページの班別行程。朝食・夕食の「00:00」は未確定時刻です。",
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
            "午前スキー・スノーボード講習",
            "activity",
            ""
          ],
          [
            "11:00",
            "13:00",
            "休憩",
            "activity",
            "原文11:00〜13:00。午後講習の開始12:40と20分重複しているため要確認。"
          ],
          [
            "11:30",
            "11:30",
            "昼食",
            "food",
            "開始時刻のみ記載。終了時刻は未記入。"
          ],
          [
            "12:40",
            "14:40",
            "午後スキー・スノーボード講習",
            "activity",
            ""
          ],
          [
            "14:40",
            "16:00",
            "フリー滑走",
            "activity",
            ""
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
          "朝食・夕食は「00:00」の仮欄で、実際の時刻は未記入です。",
          "休憩11:00〜13:00と午後講習12:40〜14:40に20分の重複があります。しおり原文どおり残しています。",
          "昼食は11:30開始とありますが、終了時刻は不明です。"
        ],
        "places": [
          [
            "ニセコビレッジスキーリゾート",
            "午前講習9:00〜11:00、午後講習12:40〜14:40、フリー滑走14:40〜16:00。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "1・2泊目の宿泊先。"
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
            "ホテル 出発（バス移動）",
            "travel",
            ""
          ],
          [
            "10:20",
            "10:20",
            "洞爺湖文化センター 到着",
            "activity",
            ""
          ],
          [
            "10:20",
            "13:00",
            "洞爺湖自由散策・各自昼食",
            "food",
            "到着10:20から13:00出発までの滞在枠。実際の昼食時刻は各自。"
          ],
          [
            "13:00",
            "13:00",
            "洞爺湖文化センター 出発（バス移動）",
            "travel",
            ""
          ],
          [
            "14:00",
            "14:00",
            "登別地獄谷 到着",
            "activity",
            ""
          ],
          [
            "14:00",
            "15:50",
            "登別地獄谷 自由散策",
            "activity",
            "到着から出発までの滞在枠。"
          ],
          [
            "15:50",
            "15:50",
            "登別地獄谷 出発（バス移動）",
            "travel",
            ""
          ],
          [
            "17:50",
            "17:50",
            "ホテル 到着",
            "activity",
            ""
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
          "朝食・夕食は「00:00」の仮欄で、実際の時刻は未記入です。",
          "洞爺湖文化センターでの各自昼食は開始・終了時刻の個別指定がありません。"
        ],
        "places": [
          [
            "洞爺湖文化センター",
            "10:20着、自由散策・各自昼食、13:00発。"
          ],
          [
            "登別地獄谷",
            "14:00着、自由散策、15:50発。"
          ],
          [
            "ヒルトンニセコビレッジ",
            "17:50帰着予定。"
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
    "desc": "『北海道2026しおり Ver3』10ページの共通行程。夕食会場は『アサヒビール園』と記載。",
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
            "ホテル 出発（バス移動）",
            "travel",
            "1・2泊目のホテルはヒルトンニセコビレッジ。"
          ],
          [
            "11:00",
            "11:00",
            "小樽 到着",
            "activity",
            ""
          ],
          [
            "11:00",
            "14:45",
            "小樽自由行動",
            "activity",
            ""
          ],
          [
            "14:45",
            "14:45",
            "小樽 出発（バス移動）",
            "travel",
            ""
          ],
          [
            "15:20",
            "15:20",
            "白い恋人パーク 到着",
            "activity",
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
            "16:45",
            "白い恋人パーク 出発（バス移動）",
            "travel",
            ""
          ],
          [
            "17:30",
            "17:30",
            "アサヒビール園 到着",
            "activity",
            ""
          ],
          [
            "17:30",
            "18:30",
            "アサヒビール園で夕食",
            "food",
            ""
          ],
          [
            "18:30",
            "18:30",
            "アサヒビール園 出発（バス移動）",
            "travel",
            ""
          ],
          [
            "19:00",
            "19:00",
            "旭山記念公園 到着",
            "activity",
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
            "19:30",
            "旭山記念公園 出発（バス移動）",
            "travel",
            ""
          ],
          [
            "20:00",
            "20:00",
            "ホテル 到着",
            "activity",
            "3泊目はニューオータニイン札幌。"
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
          "朝食欄は「00:00」で、時刻は未記入です。",
          "アサヒビール園という会場名は11月15日版しおりの表記です。以前のサイトにあった札幌ビール園とは異なります。"
        ],
        "places": [
          [
            "小樽",
            "11:00〜14:45に自由行動。"
          ],
          [
            "白い恋人パーク",
            "15:20〜16:45に見学。"
          ],
          [
            "アサヒビール園",
            "17:30〜18:30に夕食（しおり記載）。"
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
    "title": "札幌市内・新千歳・羽田",
    "desc": "『北海道2026しおり Ver3』10・12ページ。市内自由行動の終了・集合時刻は未記入。",
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
            "札幌市内自由行動 開始",
            "activity",
            "終了時刻は『00:00』の仮欄で確定していません。"
          ],
          [
            "14:00",
            "14:00",
            "新千歳空港 到着・クラス別点呼",
            "activity",
            "到着した人からクラスごとに整列し点呼。"
          ],
          [
            "14:00",
            "15:30",
            "保安検査・搭乗手続き",
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
            "しおり10・12ページ。別途時刻指定なし。"
          ]
        ],
        "unknown": [
          "朝食欄は「00:00」の仮欄で、実際の時刻は未記入です。",
          "さっぽろテレビ塔付近からのバス出発はしおりに記載がありますが、出発時刻が『00:00』のため未定です。",
          "札幌市内自由行動の終了・テレビ塔付近の集合時刻は学校の最終案内を確認してください。"
        ],
        "places": [
          [
            "札幌市内",
            "9:00から自由行動。終了時刻・テレビ塔付近発の時刻は未記入。"
          ],
          [
            "さっぽろテレビ塔付近",
            "空港行きバスの出発場所として記載。時刻は未記入。"
          ],
          [
            "新千歳空港",
            "14:00到着・14:00〜15:30保安検査・搭乗手続き。"
          ],
          [
            "羽田空港",
            "ANA68便で17:10到着、到着後流れ解散。"
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
