# Japan Omakase LP

業態: **Halal Omakase Sushi & Wagyu(おまかせ 墨)**
ドメイン: `japan-omakase.wagyu-sushi.com`
GA4測定ID: `G-71QJSRH923`

Eleventy(11ty)製の静的サイト。1つのテンプレ + 店舗データ × チャネルから、全ページを自動生成。

## 店舗一覧(4店舗 × 4チャネル = 16ページ生成)

| 店舗 | URL | 予約導線 | TableCheck slug |
|---|---|---|---|
| 🍣 浅草古民家店 | `/tokyo/asakusa-kominka/` | ✅ TableCheck | `halal-omakase-asakusa` |
| 🥢 京都祇園店 | `/kyoto/gion/` | ✅ TableCheck | `5wshijo` |
| 🐟 築地店 | `/tokyo/tsukiji/` | ✅ TableCheck | `yakiniku-burger-ramen-zen` |
| 🏯 大阪東心斎橋店 | `/osaka/higashi-shinsaibashi/` | ⏳ TBD(stores.js書き換えで反映) | TBD |

## 予約導線の切り替え機構

各店舗の `reserve_system` で予約ボタンの挙動を切り替えられる:

| 値 | 挙動 |
|---|---|
| `"tablecheck"` | 予約ボタンが TableCheck 予約画面に外部遷移する(現状の全店構成) |
| `"form"` | ページ内モーダルでフォーム(EmailJS送信)を表示する |

**切り替え方法:**

```javascript
// src/_data/stores.js
{
  slug: "asakusa-kominka",
  reserve_system: "form",   // "tablecheck" → "form" に変えるだけ
  ...
  form_config: FORM_DEFAULT  // EmailJS設定・予約不可日など
}
```

フォーム版に必要なEmailJS設定・予約不可日(工事休業など)は `form_config` にまとめてある。
店舗ごとに異なる設定にしたい場合は `FORM_DEFAULT` を spread して上書きする:

```javascript
form_config: { ...FORM_DEFAULT, blocked_dates: ['2026-05-25', '2026-05-26'] }
```

## チャネル別ページ生成

1店舗あたり4つのページを自動生成:

| URL | チャネル | TableCheck UTM | SEO |
|---|---|---|---|
| `/{region}/{slug}/` | default | `utm_source=lp` | index |
| `/{region}/{slug}/japan/` | japan | `utm_source=lp-japan` | noindex(canonical→default) |
| `/{region}/{slug}/global/` | global | `utm_source=lp-global` | noindex(canonical→default) |
| `/{region}/{slug}/map/` | map | `utm_source=lp-map` | noindex(canonical→default) |

すべて共通: `utm_medium=referral`

## ディレクトリ

```
.
├── .eleventy.js                            ← Eleventy設定(images/ をパススルー)
├── package.json
├── vercel.json                             ← / → /tokyo/asakusa-kominka/ リダイレクト
├── src/
│   ├── _data/stores.js                     ← 業態設定 + 店舗データ + チャネル定義 + 予約導線設定
│   ├── _includes/
│   │   └── partials/
│   │       └── reserve-form-modal.njk      ← フォーム版予約モーダル(reserve_system="form"時のみ)
│   ├── store.njk                           ← 全店舗・全チャネル共通テンプレ
│   └── images/                             ← 画像(配信)
└── _site/                                  ← ビルド成果物
```

## ⚠️ 画像フォルダ名は `images/`(この業態だけ)

- ✅ `omakase` → `src/images/`
- ✅ `tofu-vegan` → `src/tofu-image/`
- ✅ `steak`, `sandwich` → `src/assets/`
- ✅ `japanese-burger` → `src/image/`

## 予約リンクの差し替え方法(店舗追加時 / 東心斎橋確定時など)

`src/_data/stores.js` を開いて、該当店舗の `tablecheck_url: "TBD"` を本物のリンクに書き換えるだけ。

```javascript
// 変更前
tablecheck_url: "TBD",

// 変更後
tablecheck_url: "https://www.tablecheck.com/shops/halal-omakase-shinsaibashi/reserve",
```

コミットすると、Vercelが自動デプロイして即反映。

## Muslim-Friendly統一表示

全店舗、ハラール認証ではなく「Muslim-Friendly」として統一表示:
- NO PORK
- NO ALCOHOL IN FOOD
- MUSLIM-FRIENDLY

## GA4の計測内容

すべてのイベントに `store_name`, `store_area`, `brand`, `channel` を付与。

### カスタムイベント
- `reserve_click`: sticky_cta, header, hero, reservation_section, footer
- `reserve_modal_open`: フォーム版で予約モーダルが開かれたとき
- `reservation_form_submit`: フォーム版で予約送信が成功したとき(conversion扱い)
- `tel_click`: access
- `directions_click`: access, footer
- `map_click`: hero

## ビルド・開発

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # _site/ に出力
```
