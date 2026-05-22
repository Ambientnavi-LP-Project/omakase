# Japan Omakase LP

業態: **Halal Omakase Sushi & Wagyu(おまかせ 墨)**
ドメイン: `japan-omakase.wagyu-sushi.com`
GA4測定ID: `G-71QJSRH923`

Eleventy(11ty)製の静的サイト。1つのテンプレ + 店舗データ × チャネルから、全ページを自動生成。

## ⚠️ 画像フォルダ名は `images/`(この業態だけ)

- ✅ `omakase` → `src/images/`
- ✅ `tofu-vegan` → `src/tofu-image/`
- ✅ `steak`, `sandwich` → `src/assets/`
- ✅ `japanese-burger` → `src/image/`

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

## チャネル別ページ生成

1店舗あたり4つのページを自動生成:

| URL | チャネル | TableCheckUTM | SEO |
|---|---|---|---|
| `/tokyo/asakusa-kominka/` | default | `utm_source=lp` | index |
| `/tokyo/asakusa-kominka/japan/` | japan | `utm_source=lp-japan` | noindex(canonical→default) |
| `/tokyo/asakusa-kominka/global/` | global | `utm_source=lp-global` | noindex(canonical→default) |
| `/tokyo/asakusa-kominka/map/` | map | `utm_source=lp-map` | noindex(canonical→default) |

すべてのチャネル別ページは `utm_medium=referral` 共通。
default以外は noindex + canonical で、検索エンジンに重複コンテンツと判定されない設計。

## 予約

すべての予約ボタンは TableCheck の予約ページへ外部リンク:
`https://www.tablecheck.com/shops/halal-omakase-asakusa/reserve`

予約ボタンを押すと、ページのチャネルに応じたUTMが**自動付与**される。
TableCheckの予約管理画面で「どのチャネルから予約が来たか」が一目でわかる。

## GA4の計測内容

すべてのイベントに `store_name`, `store_area`, `brand`, **`channel`** を付与。

### カスタムイベント
- `reserve_click`: sticky_cta, header, hero, reservation_section, footer
- `tel_click`: access
- `directions_click`: access, footer
- `map_click`: hero

## 広告/GBPに貼るURL(覚え書き)

### Google広告(日本)に貼るURL:
```
https://japan-omakase.wagyu-sushi.com/tokyo/asakusa-kominka/japan/
```

### Google広告(海外)に貼るURL:
```
https://japan-omakase.wagyu-sushi.com/tokyo/asakusa-kominka/global/
```

### Googleマップのプロフィールに貼るURL:
```
https://japan-omakase.wagyu-sushi.com/tokyo/asakusa-kominka/map/
```

### SEO・直接訪問:
```
https://japan-omakase.wagyu-sushi.com/tokyo/asakusa-kominka/
```
