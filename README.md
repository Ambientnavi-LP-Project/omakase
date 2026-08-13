# 新デザインLP 2案（test-a / test-b）

`src/` にそのまま上書き・追加してデプロイすれば、既存URLに一切影響せず2種類のLPが増えます。

## 1. 入れるファイル

| ファイル | 種別 | 説明 |
|---|---|---|
| `src/_data/stores.js` | **上書き** | `pagesTestA` / `pagesTestB` を追加しただけ。既存の定義・店舗データは無変更 |
| `src/_data/courses.js` | 新規 | コースデータ（日英中）のシングルソース。従来 njk に4〜5回重複していたもの |
| `src/store-test-a.njk` | 新規 | A案：HP型（参考サイト寄せ） |
| `src/store-test-b.njk` | 新規 | B案：広告LP型（CV重視） |
| `src/_includes/partials/reserve-v2.njk` | 新規 | 予約フォーム（両案で共有・多言語対応） |

既存の `store.njk` / `store-sushi.njk` などには一切触れていません。

## 2. プレビューURL

デプロイ後、以下で開けます（`{{domain}}` = `japan-omakase.wagyu-sushi.com`）。

**A案（HP型）**
- https://japan-omakase.wagyu-sushi.com/tokyo/shinjuku-sanchome/test-a/
- https://japan-omakase.wagyu-sushi.com/kyoto/gion/test-a/
- https://japan-omakase.wagyu-sushi.com/osaka/higashi-shinsaibashi/test-a/

**B案（広告LP型）**
- https://japan-omakase.wagyu-sushi.com/tokyo/shinjuku-sanchome/test-b/
- https://japan-omakase.wagyu-sushi.com/kyoto/gion/test-b/
- https://japan-omakase.wagyu-sushi.com/osaka/higashi-shinsaibashi/test-b/

言語を指定して開くこともできます：`...?lang=ja` / `?lang=en` / `?lang=zh`

いずれも `channel_id` が `default` 以外なので **noindex + canonical（本番URL）** が自動で付き、本番SEOには影響しません。

## 3. 設定スイッチ

`src/_data/stores.js` の上のほうにあります。

```js
const FORCE_PRICES = false;   // true にすると test-a / test-b で価格を表示
```

稼働3店（新宿三丁目・祇園・東心斎橋）はすべて `hide_prices: true` なので、既定では価格が出ません。
価格ありの見え方を比較したいときだけ `true` にしてください（本番LPには影響しません）。

## 4. 予約導線

`src/_data/stores.js` で切り替えられます（本番LPの挙動は変わりません）。

```js
const TEST_RESERVE = "form";
//   "form"       … ページ内フォーム(EmailJS)。新デザインの予約UIを確認したいとき（既定）
//   "tablecheck" … 予約ボタンで外部TableCheckへ遷移
//   "store"      … 各店舗の本番設定をそのまま使う（現状=全店TableCheck）
```

"tablecheck" / "store" にすると、`openReserve()` の中身だけがTableCheckへの遷移に差し替わります。
ボタンのマークアップは共通なので、どちらに切り替えてもレイアウトは変わりません。

**form の場合**（既定）

- 送信ロジックは既存 `reserve-form-modal.njk` と同一：GASで空席・上限判定 → EmailJSで店舗＋ゲストへ送信
- 入力欄のIDも同一（`r_name` `r_email` …）なので **EmailJSテンプレートとGAS側は無変更で動きます**
- 追加で `lang` パラメータ（`ja`/`en`/`zh`）を送っているので、必要なら店舗側メールで言語を出し分けられます

**tablecheck / store の場合**

予約ボタンが `{{ store.tablecheck_url }}?utm_source=lp-test-a|lp-test-b&utm_medium=referral` へ遷移します。
`reserve-v2.njk` はページに出力されません（読み込みも走りません）。

## 5. 計測

両案とも既存GTM（`GTM-TJKTLQJ6`）をそのまま読み込み、dataLayer に `design: 'test-a' | 'test-b'`、`channel: 'test-a' | 'test-b'` を積んでいます。GA4で並べて比較できます。

主なイベント：
`reserve_open` / `course_select` / `course_detail_view` / `final_check_view` / `reservation_form_submit` / `lang_switch` / `tel_click` / `maps_click` / `exit_intent_view`（B案のみ）

## 6. 動画について

ヒーローは `/images/hero1.mp4` を **16:9のまま**大きく出す設計です（切り抜かず、動きを潰さないため）。
スマホでも横長のまま全幅で出し、見出しとCTAは動画の**下**に置いています。

- 差し替えるときは `store-test-a.njk` / `store-test-b.njk` の `<source src="/images/hero1.mp4">` を変更
- ポスター画像は `/images/top.jpg`。動画読み込み前に一瞬表示されるので、動画1コマ目に近い画像にするとより滑らかです
- A案の下部セクションでは `hero2.mp4`（コンセプト）と `hero3.mp4`（カウンター）も使っています

**推奨**：ヒーロー動画は 1920×1080 / 8〜15秒ループ / 音なし / 3MB以下にエンコードし直すと、モバイルの初期表示が目に見えて速くなります。

## 7. 2案の設計意図

### A案 `/test-a/` — HP型
参考サイトの構造に寄せています。全幅動画 → コンセプト → お品書き → カウンター → ハラル → 店舗情報 → 予約。

- 配色：温かみのある墨黒 `#12100e` × 生成り `#e9e3d6` × くすんだ真鍮 `#a98a52`（既存の金 `#c9a96e` より彩度を落とし、別ブランドに見えるように）
- 書体：見出し Marcellus（英）／ Shippori Mincho（和）、キャプション Jost
- 署名要素：ヒーロー左端の**縦書き**「旬を、握る。」と、見出しの下で1本だけ引かれる真鍮の罫線
- 番号は「献立の流れ（01→08）」にだけ使用。順序が意味を持つ箇所以外では使っていません
- CTAは控えめ（ヘッダー・各コース・最下部の3箇所のみ、スティッキーバーなし）

### B案 `/test-b/` — 広告LP型
CV導線を前面に。**背景を明るくして朱赤のCTAを最大コントラストで置く**構成にしています（黒地に金より、広告流入のCVRは明色地＋高彩度CTAのほうが安定します）。

構成：オファー帯 → 動画 → 見出し＋CTA＋信頼バッジ → 選ばれる理由3点 → コース3枚＋比較表 → レビュー → 予約の流れ3ステップ → FAQ → アクセス → 最終CTA
- 配色：生成り `#f4efe5` × 墨 `#191512` × 朱 `#a8342a`
- 書体：Zen Old Mincho ＋ Jost
- 署名要素：**判子（朱印）**モチーフ。理由カード・離脱防止ダイアログで使用
- 追加装置：スティッキー下部CTA（ヒーローのCTAが画面外に出たら出現）、離脱防止ダイアログ（PCはマウスアウト／スマホは45秒、1セッション1回まで）

### 予約したくなる構造として両案に入れているもの
- CTAの文言を「予約する」ではなく **「空席を確認する」**（心理的コストが低い）
- ボタン直下に必ず **「約60秒・事前決済なし」**
- フォームを **01 日時 → 02 コース → 03 連絡先** の3ブロックに分割。最初の質問が一番答えやすい「日付」
- コースはサブモーダルではなく **ネイティブselect**（optgroup付き）。タップ数を減らし、スマホで確実に動く
- 送信前の最終確認と **48時間前まで無料キャンセル** の明示

## 8. 多言語

日本語・英語・中国語（簡体）をクライアント側で切替。
- ヘッダーの EN / 日本語 / 中文 ボタン
- 初回は `?lang=` → localStorage → ブラウザ言語 の順で自動判定
- `<html lang>` と `data-lang` を切り替え、中国語のときは Noto Serif SC に自動で差し替わります
- 翻訳は各njk下部の `window.I18N` にキー単位でまとまっています。文言修正はここだけ触ればOK
- コース名・献立の翻訳は `_data/courses.js` の `{ en, ja, zh }` から自動生成されます

> 注：現状はクライアント側切替なので、3言語別のURLは生成していません。SEO用に `/ja/` `/zh/` を別URLで持ちたい場合は、チャンネルと同じ要領でページ複製に切り替えられます。ご要望があればそちらに変更します。

## 9. ローカルで確認する場合

```bash
npx @11ty/eleventy --serve
```

画像・動画は `src/images/`（または既存の配置）に置いてください。本zipには含めていません。
