# 新デザインLP 2案（test-a / test-b）

`src/` にそのまま上書き・追加してデプロイすれば、既存URLに一切影響せず2種類のLPが増えます。

## 1. 入れるファイル（6つ）

| ファイル | 種別 |
|---|---|
| `src/_data/stores.js` | **上書き**（pagesTestA / pagesTestB を追加しただけ。店舗データは無変更） |
| `src/_data/courses.js` | 新規・コースデータ（多言語） |
| `src/_data/ui.js` | 新規・UI文言（多言語） |
| `src/store-test-a.njk` | 新規・A案 |
| `src/store-test-b.njk` | 新規・B案 |
| `src/_includes/partials/reserve-v2.njk` | 新規・予約フォーム |

既存の `store.njk` / `store-sushi.njk` / `store-wagyu.njk` などには一切触れていません。

## 2. プレビューURL

寿司訴求／和牛訴求で導線を分けた **4パターン** を生成します（各店舗ごと）。

**新宿三丁目**
| | HP型 | 広告LP型 |
|---|---|---|
| 寿司 | `/tokyo/shinjuku-sanchome/test-a-sushi/` | `/tokyo/shinjuku-sanchome/test-b-sushi/` |
| 和牛 | `/tokyo/shinjuku-sanchome/test-a-wagyu/` | `/tokyo/shinjuku-sanchome/test-b-wagyu/` |

フルURL：
- https://japan-omakase.wagyu-sushi.com/tokyo/shinjuku-sanchome/test-a-sushi/
- https://japan-omakase.wagyu-sushi.com/tokyo/shinjuku-sanchome/test-a-wagyu/
- https://japan-omakase.wagyu-sushi.com/tokyo/shinjuku-sanchome/test-b-sushi/
- https://japan-omakase.wagyu-sushi.com/tokyo/shinjuku-sanchome/test-b-wagyu/

祇園・東心斎橋も同じ4パターンが `/kyoto/gion/test-a-sushi/` `/osaka/higashi-shinsaibashi/test-b-wagyu/` のように生成されます（計12ページ）。

言語指定：`?lang=en` / `?lang=zhs` / `?lang=zht` / `?lang=ko` / `?lang=id`

すべて noindex + canonical（本番URL）付きです。

### 寿司／和牛での出し分け

**テーマ外のコースは一切出しません。** 寿司LPには和牛のステーキ・すき焼きが載らず、和牛LPには寿司コースが載りません。
掲載カテゴリは `src/_data/courses.js` の `THEMES` で定義しています。

| | 掲載カテゴリ | 掲載コース | ヒーロー見出し | メニュー見出し |
|---|---|---|---|---|
| sushi | Sushi のみ | Sushi Standard / Sushi Premium | Sushi / Halal Omakase Experience | Sushi Omakase Course |
| wagyu | Wagyu のみ | Wagyu Standard / Kobe Beef Premium | Wagyu / Halal Omakase Experience | Wagyu Omakase Course |

- **予約フォームのコース選択肢もテーマで絞られます**（寿司LPの予約からは和牛コースを選べません）
- 広告LP型のコースカードは2枚（プレミアム側を強調枠）。比較表もテーマ別の項目に切替
  - 寿司：握り数 / 手巻 / 雲丹・蟹 / 茶碗蒸し
  - 和牛：牛の等級 / フィレg数 / すき焼き / 春巻き / 肉寿司
- 予約ボタンは `Reserve Your Sushi Omakase` / `Reserve Your Wagyu Omakase`
- カテゴリ紹介文は既存LPの `story` / `note` をそのまま使用
- dataLayer に `theme: 'sushi' | 'wagyu'` を追加したので、GA4で4本を並べて比較できます

> `THEMES` を `sushi: ["mix", "sushi"]` に戻せば、Sushi & Wagyu の複合コースも併載できます。

## 3. 掲載情報のルール

**このLPに載っている文言は、すべて既存 `store.njk` / `reserve-form-modal.njk` / `stores.js` に実在するものだけです。**
新しい訴求文言・実績・設備・サービス内容は一切書き足していません。多言語版はその英語原文の翻訳です。

使っている既存コピー：
- `Gastronomic Tour of JAPAN` / `Sushi & Wagyu Halal Omakase Experience`（ヒーロー）
- `The Experience` / `A Journey Through Japan` とその本文
- `Sushi & Wagyu Course × Projection Mapping` とその本文（`projection_mapping: true` の店のみ表示＝新宿三丁目）
- `Omakase Course Experience` / `All Muslim-friendly · Seasonal menu` / `* Ingredients may vary depending on the season.`
- `"Sushi & Wagyu Indulgence"` とその本文
- `Our Story` 1962年〜五代目のストーリー全文
- `Muslim-Friendly Dining` とその本文、`NO PORK` / `NO ALCOHOL IN FOOD` / `MUSLIM-FRIENDLY`
- `Guest Voices` / `From Around the World` と4件のレビュー、Google評価スコア
- `Access` / `Find Us` / `Open in Google Maps`
- `Reserve` / `Begin Your Experience` / `Reservations recommended 2 weeks in advance. Walk-ins welcome subject to availability.`
- `* Reservation is confirmed after email from ...` / `* Reservation handled by TableCheck — secure & instant.`
- キャンセルポリシー（48時間前以内 ¥5,000 / 24時間前以内 ¥10,000）
- コース名・説明・献立7コース分（`courses.js` に転記）

`stores.js` の `rating_count`（新宿三丁目 = `1,000+`）を表示しています。件数が変わったらここを直せば全LPに反映されます。

**削除した創作コピー**（前回入れてしまっていたもの）：席数の記載、調理場の描写、礼拝スペースの案内、英語・中国語対応の明記、「みりん・料理酒を代替」の詳細、「今週の空席あり」バッジ、「約60秒」「数時間以内に返信」、独自に書いたFAQ回答。

## 4. 多言語

英語 / 简体中文 / 繁體中文 / 한국어 / Bahasa Indonesia の5言語。日本語は持っていません。

- ヘッダーの**地球アイコン付きボタン**（現在の言語を表示）→ タップで**言語選択シート**が中央に開く
- シートには各言語のネイティブ表記＋略号を一覧表示。選択中はハイライト
- 背景クリック / Esc で閉じる。狭い画面ではボタンがアイコンのみになる
- フッターの言語リンクからも直接切り替え可能
- 初回は `?lang=` → localStorage → ブラウザ言語 の順で自動判定。既定は英語
- 中国語・韓国語のフォント（Noto Serif SC / TC / KR）は**その言語を選んだ時だけ**動的に読み込むので、英語表示時の速度に影響しません
- 文言は `src/_data/ui.js` の1ファイルに集約。言語リスト（表示名・略号・フォント）も同ファイルの `langs`
- コース名・説明は `src/_data/courses.js`

> 献立の各行（`Nigiri 10 — Chutoro / Salmon / ...` など）は素材名の羅列なので、全言語で英語のまま出しています。各言語に訳す場合は `courses.js` の `rows` を `{en,zhs,zht,ko,id}` 形式に変えれば対応できます。

## 5. 今回の修正（①〜⑤）

1. **創作情報を全削除** → 上記「3. 掲載情報のルール」のとおり
2. **左右の余白** → 全セクションが `--gut: clamp(24px, 6vw, 72px)` の共通ガターを使うように変更。スマホで最低24px、PCで最大72px確保
3. **多言語5言語＋ドロップダウン切替**
4. **地図** → グレースケール・暗転フィルタを削除して通常表示に
5. **フル店名** → ヒーロー動画直下に罫線付きで表示。加えてアクセス欄・フッター・B案のスティッキーバーにも表示

## 6. 予約導線

**検証ページは全店TableCheck遷移になっています**（稼働3店の本番設定に合わせています）。

`src/_data/stores.js`：

```js
const TEST_RESERVE = "store";
//   "store"      … 各店舗の本番設定に従う（既定・現状=全店TableCheck）
//   "tablecheck" … 本番設定にかかわらず全店TableCheckへ遷移
//   "form"       … ページ内フォーム(EmailJS)。新デザインの予約UIを確認したいとき
```

**TableCheck時**（現在）
- 予約ボタンが `{{ store.tablecheck_url }}?utm_source=lp-test-a-sushi&utm_medium=referral` へ遷移します（UTMは4チャンネル別）
- `reserve-v2.njk` はページに出力されず、EmailJSのSDKも読み込まれません
- ボタンの文言は `Reserve on TableCheck`

**form時**
- 送信ロジックは既存 `reserve-form-modal.njk` と同一（GASで空席判定 → EmailJSで送信）
- 入力欄のIDも同一なので EmailJSテンプレートとGAS側は無変更で動きます
- コース選択肢はテーマで絞られます（寿司LPからは和牛コースを選べません）

## 7. 価格表示

```js
const FORCE_PRICES = false;   // true にすると test-a / test-b で価格を表示
```

稼働3店はすべて `hide_prices: true` のため既定では非表示です。

## 8. 計測

dataLayer に `design: 'test-a' | 'test-b'` と `channel` を積んでいます。
イベント：`reserve_click` / `reserve_open` / `course_select` / `course_detail_view` / `final_check_view` / `reservation_form_submit` / `lang_switch` / `tel_click` / `directions_click`

## 9. ⑥ 参考画像の反映

いただいた4枚をもとに、以下を両案に実装しました。

**サイドメニュー**
ハンバーガーで開く**全画面オーバーレイ**。左寄せの大きなセリフ体リストが上から順に少しずつ遅れてフェードインします。ヘッダーは overlay の上に残り、ハンバーガーは×に変形、ラベルが MENU → CLOSE に変わります。最下部に店舗名・住所・電話を配置。

**言語切替**
参考サイトと同じ **`EN / 简 / 繁 / 한 / ID` のスラッシュ区切り**に変更しました。5言語あるので、狭い画面では横スクロールします（スクロールバーは非表示）。フッターにも同じ並びを置いています。

**View more ボタン**
丸い枠 + シェブロン「＞」+ 右にラベル。ホバーで**円が朱色に塗りつぶされ、矢印が右へ滑る**動きです。ヒーロー下・コンセプト・内観・アクセス・予約ボタンで使用しています。

**フッター**
参考サイトと同じ構成に作り替えました。左に朱印・ブランド名・店名（大きくセリフ体）・〒住所・営業時間・電話・コピーライト、右にセリフ体の縦並びナビ。下段バーに地域名と言語切替。

**内観セクション（新規 `#interior`）**
横長21:9の全幅写真の右側にテキストを重ね、その下に**大小2枚をずらして重ねるコラージュ**を配置しました。参考画像3枚目の構成です。

**A案の配色を参考サイトに寄せました**
黒×金 → **濃紺 `#111a2b` + 同心円の微細なテクスチャ + 朱印の赤**。書体も Marcellus → **Zilla Slab**（参考サイトのスラブ系セリフに近いもの）に変更しています。B案は広告LPなのでCTAのコントラストを優先し、明色地＋朱赤のままです。

### 写真の割り当て

テーマごとに使う画像を、各テンプレ冒頭の `IMG` で一括管理しています。差し替えはここ7行だけです。

```njk
{% if store.theme == "wagyu" %}
{% set IMG = {
  lead:    "/images/sukiyaki.jpg",              // ヒーロー右の写真
  concept: "/images/course-kobe-premium.jpg",   // コンセプト動画のポスター
  band:    "/images/cat-wagyu.jpg",             // 内観の全幅21:9
  col_a:   "/images/course-wagyu-standard.jpg", // コラージュ大
  col_b:   "/images/chef2.jpg",                 // コラージュ小
  story:   "/images/chef1.jpg",                 // Our Story
  halal:   "/images/chef3.jpg"                  // Muslim-Friendly
} %}
{% else %}  // sushi は sushi1 / sushi2 / cat-sushi / course-sushi-premium / chef2 / chef1 / sushi4
```

**内観写真がリポジトリにないため、`band` には暫定で `cat-sushi.jpg` / `cat-wagyu.jpg` を当てています。**
21:9で使うので横長の内観写真をご用意いただければ差し替えます。`col_a` / `col_b` も同様です。

またこのセクションの文言は、①のルールに従い既存LPにある文言（"Sushi & Wagyu Indulgence" と "A Journey Through Japan"）を流用しています。内観を描写する文章を入れる場合は原稿をいただければ差し替えます。

## 10. ローカル確認

```bash
npx @11ty/eleventy --serve
```
