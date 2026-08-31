# LP作成・改修プロンプト（計測要件）

このドキュメントは、Ambientnavi-LP-Project 配下のLPを新規作成・デザイン変更・テンプレート追加する際に、**AIアシスタントへ最初に渡すプロンプト**として使う。

計測が壊れると広告の成果測定ができなくなり、スマート入札が誤った方向に学習する。デザインの自由度より計測要件が優先される。

---

## このドキュメントの使い方

新しいLPを作る、既存LPのデザインを変える、新しいテンプレートを追加する。そのいずれの場合も、作業開始時に以下を伝える。

```
Ambientnavi-LP-Project のLPを作成/改修します。
docs/LP作成プロンプト.md の計測要件を必ず守ってください。
特に「絶対に守るルール」の5項目は例外なく適用してください。
```

---

# 絶対に守るルール

この5つはデザイン上の都合があっても変更しない。過去に全て実際に破られ、そのたびに広告計測が停止した。

## ルール1  TableCheckへのCTAは `<a href>` で書く

```html
<!-- 正しい -->
<a class="cta" href="{{ tablecheck_with_utm }}" rel="noopener"
   data-ga-event="reserve_click" data-ga-location="hero">予約する</a>

<!-- 禁止 -->
<button onclick="location.href='...'">予約する</button>
<button onclick="openReserve('hero')">予約する</button>
```

**理由**　GA4のリンカーとGoogle広告のConversion Linkerは、`<a>` のクリックにしか働かない。`window.location.href` による遷移では `_gl`（GA4のクロスドメインパラメータ）と `_gcl_aw`（gclid）が付与されず、TableCheck側が別ユーザー・別セッションとして記録される。結果として広告経由の予約が1件も計測されなくなる。

**JavaScriptで `<a>` を動的生成して `a.click()` する回避策は機能しない。** リンカーは実ユーザーのクリック（`isTrusted`）のみを対象とするため、プログラムから発火したクリックは無視される。2026年8月に実測で確認済み。

**例外**　自社フォームで予約する店舗（`store.reserve_system == 'form'`）はモーダルを開くだけなので `<button>` でよい。テンプレート内で分岐させる。

```html
{% if store.reserve_system == 'form' %}<button class="cta" onclick="openReserve('hero')" data-ga-event="reserve_click" data-ga-location="hero">
{% else %}<a class="cta" href="{{ tablecheck_with_utm }}" rel="noopener" data-ga-event="reserve_click" data-ga-location="hero">
{% endif %}
  予約する
{% if store.reserve_system == 'form' %}</button>{% else %}</a>{% endif %}
```

CSSは `button.cta` のようなタグ名指定を避け、`.cta` のようにクラスだけで書く。タグが切り替わってもスタイルが崩れないようにするため。

---

## ルール2  TableCheckのURLにUTMパラメータを付けない

```
✅ https://www.tablecheck.com/en/halal-wagyu-shinjuku-5w-tokyo/reserve/message
❌ https://www.tablecheck.com/en/.../reserve/message?utm_source=lp-wagyu&utm_medium=referral
❌ https://www.tablecheck.com/en/.../reserve/message?utm_content=lp_cta
```

**理由**　GA4は着地URLにUTMパラメータがあると、そこで新しいセッションを開始する。せっかくリンカーが `_gl` を付けても、UTMがあるとセッションが切り直され、広告経由という情報が `lp-wagyu / referral` などに上書きされる。

`utm_content` だけでも同じ結果になる。**1つも付けてはいけない。**

**CTA位置を知りたい場合**　`data-ga-location` 属性を使う。これは `reserve_click` イベントの `event_label` パラメータとしてGA4に送られるため、UTMを使う必要がない。

---

## ルール3  TableCheckのURLはリダイレクト後の最終URLを直接指定する

```
✅ https://www.tablecheck.com/en/{slug}/reserve/landing    ← 即時予約型の店舗
✅ https://www.tablecheck.com/en/{slug}/reserve/message    ← リクエスト予約型の店舗
❌ https://www.tablecheck.com/shops/{slug}/reserve         ← リダイレクトされる
❌ https://www.tablecheck.com/en/{slug}/reserve            ← リダイレクトされる
❌ https://tablecheck.com/...                              ← www なしもリダイレクトされる
```

**理由**　TableCheckは `/reserve` へのアクセスを `/reserve/landing` または `/reserve/message` にリダイレクトする。**このリダイレクトでURLのクエリパラメータが全て削除される。** `_gl` も `gclid` も届かなくなる。

**`landing` と `message` の判別方法**　ブラウザで `https://www.tablecheck.com/en/{slug}/reserve` を開き、リダイレクト後のアドレスバーを見る。店舗の予約タイプ（即時予約かリクエスト予約か）で決まっており、URLを書き換えても元に戻される。

**言語は `/en/` で統一する**　訪日客向けのため。`/ja/` にすると日本語の予約フォームが表示され、離脱の原因になる。

**新店舗を追加したとき**　必ず上記の方法で実URLを確認してから `stores.js` に書く。推測で書かない。

---

## ルール4  イベントは `data-ga-event` 属性で計測する

```html
<a href="..." data-ga-event="reserve_click" data-ga-location="hero">
```

テンプレート内の汎用ハンドラが `[data-ga-event]` を持つ要素のクリックを捕捉し、dataLayerへpushする。GTMはこれをカスタムイベントとして受け取る。

```javascript
document.addEventListener('click', function(e){
  var t = e.target.closest('[data-ga-event]'); if(!t) return;
  var ev = t.getAttribute('data-ga-event'), loc = t.getAttribute('data-ga-location') || '';
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event:ev, event_label:loc});
});
```

**同じクリックで dataLayer に二重pushしない。** 属性による計測とJavaScript内の `dataLayer.push` を両方書くと、1クリックが2回計上される。2026年8月にこれが起き、click数が実態の2倍になった。

`onclick` ハンドラの中で計測処理を書きたくなったら、まず属性で足りないか検討する。

---

## ルール5  既存の計測用スクリプトを消さない

テンプレートには以下が埋め込まれている。デザイン変更時に削除しないこと。

| 名前 | 役割 |
|---|---|
| ACQ-FORWARD | 流入時の `utm_*` / `gclid` / `gbraid` / `wbraid` を sessionStorage に保持し、`a[href*="tablecheck.com"]` に転記する。リンカーが働かなかった場合の保険 |
| `[data-ga-event]` 汎用クリックハンドラ | ルール4の計測処理 |
| GTMスニペット | `<head>` と `<body>` 直後の2箇所 |

ACQ-FORWARD は `a[href*="tablecheck.com"]` を対象にしている。**ルール1で `<a>` にする必要がある理由のひとつでもある。**

---

# イベント設計

## 使用中のイベント名

新しいイベントを作る前に、既存で表現できないか確認する。名前が揺れると集計できなくなる。

| イベント名 | 発火タイミング |
|---|---|
| `reserve_click` | TableCheckまたは予約モーダルへのCTAクリック |
| `tel_click` | 電話番号（`tel:`）のタップ |
| `map_click` | 地図リンクのクリック |
| `directions_click` | 経路案内リンクのクリック |
| `course_view` | コース情報の表示 |
| `course_detail_view` | コース詳細の展開 |
| `course_category_open` | コースカテゴリの開閉 |
| `reviews_click` | クチコミへのリンククリック |
| `call_reserve_click` | 電話予約ボタンのクリック |
| `scroll_depth` | スクロール到達（25/50/75/90%） |

TableCheck側で発火するイベント（LP側の実装対象外）。

| イベント名 | 発火タイミング |
|---|---|
| `reserve_form` | 予約フォームに到達 |
| `reserve_review` | 予約確認画面に到達 |
| `reserve_success` | 予約完了 |

## `data-ga-location` の値

CTAの設置位置を表す。分析でどの位置が効いているかを見るために使う。

```
header / hero / float_cta / reservation_section / footer /
course_modal_{コースID} / entry_{セクション名}
```

新しい位置を追加する場合は、既存の命名に揃える。スペースや日本語は使わない。

---

# カスタムディメンション

全てのイベントに以下のパラメータを付与する。GA4側でイベントスコープのカスタムディメンションとして登録済み。

| パラメータ | 内容 | 例 |
|---|---|---|
| `store_name` | 店舗を表すslug | `shinjuku-sanchome` |
| `store_area` | 店舗の所在エリア | `tokyo` |
| `brand` | 業態・ブランド | `japan-omakase` |
| `channel` | LPの配信チャネル種別 | `default` / `japan` / `global` / `map` / `wagyu` / `sushi` |
| `event_label` | イベント発生箇所 | `hero` |

**新しい店舗・業態を追加したら、値が正しく入っているか確認する。** `(not set)` になっていると店舗別の分析ができない。

確認方法はGA4の探索で、ディメンションに `store_name` を置いて `(not set)` の割合を見る。

---

# 新規テンプレート作成時のチェックリスト

既存テンプレートをコピーして作る場合、コピー元が古い実装だと問題ごと引き継ぐ。以下を必ず確認する。

```
□ CTAが <a href> になっているか（フォーム予約店舗の分岐を除く）
□ TableCheckのURLにUTMが付いていないか
□ URLが /reserve/landing または /reserve/message になっているか
□ URLが www 付き、/en/ になっているか
□ dataLayer.push が二重になっていないか
□ ACQ-FORWARD スクリプトが残っているか
□ [data-ga-event] の汎用ハンドラが残っているか
□ GTMスニペットが2箇所とも入っているか
□ store_name / store_area / brand / channel が付与されているか
□ イベント名が既存の命名と一致しているか
□ CSSがタグ名（button.xxx）ではなくクラス（.xxx）で書かれているか
```

---

# デプロイ後の検証手順

**本番反映後、必ず実施する。** 5分で終わる。

## 手順

1. Chromeのシークレットウィンドウを開く
2. LPのURLに `?gclid=TEST123` を付けてアクセス
3. `F12` → Application → Cookies → LPのドメイン → `_ga` の値をメモ
4. CTAをクリックしてTableCheckへ遷移
5. アドレスバーのURLを確認
6. Application → Cookies → `www.tablecheck.com` → `_ga` の値をメモ

## 合格条件

| 確認項目 | 期待する結果 |
|---|---|
| 遷移後のアドレスバー | `_gl=1*...` が付いている |
| LP側とTableCheck側の `_ga` | **完全に一致している** |
| TableCheck側の `_gcl_aw` | 存在し、`TEST123` を含む |
| 遷移後のURL | リダイレクトされていない（`/reserve/landing` か `/reserve/message` のまま） |

`_ga` が一致しなければクロスドメイン計測が壊れている。**リリースを止めて原因を調べる。**

## よくある失敗

| 症状 | 原因 |
|---|---|
| `_gl` が付かない | CTAが `<button>` + JS遷移になっている |
| `_ga` が一致しない | 上記、またはURLにUTMが付いている |
| クエリが全部消える | URLが `/reserve`（リダイレクト前）になっている |
| clickが実態の2倍 | dataLayer.push が二重になっている |

---

# 背景（なぜこのルールがあるか）

2026年8月に以下が実際に起きた。いずれも「デザインを新しくしただけ」のつもりの変更が原因だった。

**8月17日**　CTAに `utm_content=lp_cta` が付いていたため、TableCheck遷移時にセッションが切れていた。加えて `/reserve` のリダイレクトでクエリパラメータが全削除されていた。この2つにより、検索広告経由の予約完了は7日間で0件と記録されていた（実際には発生していた）。UTMを外し、最終URLへの直リンクに変更して解決。修正後、Paid Searchの `reserve_form` は日次1.1件から18.5件へ、16倍に増えた。

**8月28日**　新デザイン（store-v2.njk）を新宿三丁目に適用したところ、CTAが `<button>` + `window.location.href` に、URLに `utm_source` が復活していた。さらに `dataLayer.push` が二重になっており、click数が実態の2倍に膨らんだ。8月31日に修正。この間の4日分のデータは広告評価に使えない。

**同時期**　`stores.js` を一時的にアップロードした際、8月21日の修正が巻き戻り、TableCheckのURLが `/shops/.../reserve` に戻っていた。ファイルを丸ごと差し替えるときは、既存の修正を上書きしていないか差分を確認する。

---

# 参照

| 項目 | 値 |
|---|---|
| GTMコンテナ（omakase） | `GTM-TJKTLQJ6` |
| GTMコンテナ（他業態） | `GTM-5DGT9H6L` |
| GA4 ロールアップ | `G-WKH1CC5LZ6` |
| GA4 omakase専用 | `G-71QJSRH923` |
| 流入経路レポート | GA4 → スプレッドシート自動転記（日次更新） |

**GA4のクロスドメイン設定**　`管理 > データストリーム > タグの設定を行う > ドメインの設定` に `tablecheck.com` と全LPドメインが登録済み。新しいドメインでLPを公開したら、ここに追加する。追加を忘れるとそのドメインだけ計測が切れる。
