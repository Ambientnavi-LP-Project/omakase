# Japan Omakase LP

業態: **Halal Omakase Sushi & Wagyu(おまかせ 墨)**
ドメイン: `japan-omakase.wagyu-sushi.com`
GA4測定ID: `G-71QJSRH923`

Eleventy(11ty)製の静的サイト。1つのテンプレ + 店舗データ × チャネルから、全ページを自動生成。

## 店舗一覧

| 店舗 | URL | 予約 | GA4 store_name |
|---|---|---|---|
| 🍣 浅草古民家店 | `/tokyo/asakusa-kominka/` | ✅ TableCheck | `asakusa-kominka` |
| 🥢 京都祇園店 | `/kyoto/gion/` | ⏳ TBD(stores.js書き換えで反映) | `gion` |
| 🐟 築地店 | `/tokyo/tsukiji/` | ⏳ TBD(stores.js書き換えで反映) | `tsukiji` |

## チャネル別ページ生成

1店舗あたり4つのページを自動生成(計 3店舗 × 4チャネル = 12ページ):

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
├── .eleventy.js              ← Eleventy設定(images/ をパススルー)
├── package.json
├── vercel.json               ← / → /tokyo/asakusa-kominka/ リダイレクト
├── src/
│   ├── _data/stores.js       ← 業態設定 + 店舗データ + チャネル定義
│   ├── store.njk             ← 全店舗・全チャネル共通テンプレ
│   └── images/               ← 画像(配信)
└── _site/                    ← ビルド成果物
```

## ⚠️ 画像フォルダ名は `images/`(この業態だけ)

- ✅ `omakase` → `src/images/`
- ✅ `tofu-vegan` → `src/tofu-image/`
- ✅ `steak`, `sandwich` → `src/assets/`
- ✅ `japanese-burger` → `src/image/`

## 予約リンクの差し替え方法(店舗追加時)

`src/_data/stores.js` を開いて、該当店舗の `tablecheck_url: "TBD"` を本物のリンクに書き換えるだけ。

```javascript
// 変更前
tablecheck_url: "TBD",

// 変更後
tablecheck_url: "https://www.tablecheck.com/shops/halal-omakase-gion/reserve",
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
- `tel_click`: access
- `directions_click`: access, footer
- `map_click`: hero
