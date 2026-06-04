/**
 * 店舗データ定義(omakase業態)
 * 新しい店舗を追加するときは、stores配列に store オブジェクトを追加するだけ。
 *
 * channels配列で、店舗ごとに複数のチャネル別ページを生成:
 *  - default → /{region}/{slug}/         (直接訪問・SEO)
 *  - japan   → /{region}/{slug}/japan/   (日本向け広告)
 *  - global  → /{region}/{slug}/global/  (海外向け広告)
 *  - map     → /{region}/{slug}/map/     (Googleマップ GBP)
 *
 * 予約ボタンを押すと、TableCheckリンクに channel に応じたUTMが自動付与:
 *  - default → ?utm_source=lp&utm_medium=referral
 *  - japan   → ?utm_source=lp-japan&utm_medium=referral
 *  - global  → ?utm_source=lp-global&utm_medium=referral
 *  - map     → ?utm_source=lp-map&utm_medium=referral
 *
 * 【予約導線の切り替え】reserve_system フィールドで店舗ごとに選択:
 *  - "tablecheck" → 予約ボタンを押すと外部TableCheck画面に遷移(現状の全店構成)
 *  - "form"       → ページ内モーダルで予約フォーム(EmailJS)を表示
 *
 * フォーム体制で必要な設定はすべて `form_config` にまとめてある。
 * 切り替えるときは store の reserve_system を "form" にして、
 * 必要なら form_config の値(EmailJS情報・工事休業日など)を上書きするだけ。
 *
 * 【店名】name_full_en に英語+中国語をまとめて1つのフル表記で入れている。
 * ヒーロー等は name_full_en をそのまま1ブロックで表示する。
 * (name_zh は空。中国語を別行で分けたい店だけ name_zh に入れる)
 */

// ============================================================
// ブランド共通: フォーム送信時の EmailJS 設定
// (全店共通。テンプレート側で store.location を送るので、
//  メール本文の差別化はテンプレ側でやる)
// ============================================================
const FORM_DEFAULT = {
  emailjs: {
    public_key:        "6I-wkxv05ZwY-PpXa",
    service_id:        "service_41qov79",
    template_id_owner: "template_uk1m5wn",  // 店舗側へ届くメール
    template_id_guest: "template_f9w6hmy"   // ゲストへの自動返信
  },
  // 予約不可日(YYYY-MM-DD)。店舗ごとに上書き可。
  blocked_dates: []
};

const STORES = [
  // ============================================================
  // 1. 浅草古民家店(東京)
  // ============================================================
  {
    region: "tokyo",
    slug: "asakusa-kominka",
    same_day_reserve: false,
    time_slots: ['11:00','13:00','15:00','17:00','19:00','21:00'],
    max_guests: 14,
    stations: [ { name: 'Asakusa Sta. (Tsukuba Express)', line: 'つくばエクスプレス', min: 5 }, { name: 'Asakusa Sta.', line: 'Ginza / Toei Asakusa / Tobu Lines', min: 8 } ],

    name_full_en: "Omakase Sushi Wagyu (Halal) Tokyo Asakusa Restaurant 浅草寿司和牛餐厅",
    name_short: "Omakase 墨 — Asakusa",
    name_jp: "おまかせ 墨 浅草店",
    name_zh: "",

    city: "Asakusa, Tokyo",
    region_label: "Asakusa · Tokyo",
    station_en: "Asakusa Station",
    address_jp_line1: "東京都台東区浅草3丁目27-5",
    address_en_line1: "3-27-5 Asakusa, Taito-ku, Tokyo",
    address_postal: "111-0032",

    tel_display: "03-3872-2010",
    tel_raw: "+81338722010",

    hours: "11:00 – 23:00",
    hours_note: "Open Daily",

    // ▼ 予約導線
    reserve_system: "form",  // 全店フォーム予約に統一
    tablecheck_url: "https://www.tablecheck.com/shops/halal-omakase-asakusa/reserve",
    form_config: FORM_DEFAULT,

    maps_link: "https://maps.app.goo.gl/pxiMce5bhj1WMLpo9",

    rating: "4.8",
    rating_count: "500+",
    rating_source: "Google reviews",

    maps_embed: "https://www.google.com/maps?q=Omakase+Sushi+Wagyu+Asakusa+Tokyo&output=embed"
  },

  // ============================================================
  // 2. 京都祇園店(京都)
  // ============================================================
  {
    region: "kyoto",
    slug: "gion",
    same_day_reserve: false,
    time_slots: ['11:00','13:00','15:00','17:00','19:00','21:00'],
    max_guests: 12,
    stations: [ { name: 'Gion-Shijo Sta. (Keihan)', line: '京阪本線', min: 2 }, { name: 'Kyoto-Kawaramachi Sta. (Hankyu)', line: '阪急京都線', min: 3 } ],

    name_full_en: "Kyoto Omakase Sushi & Wagyu Halal Gion Restaurant 京都寿司和牛餐厅",
    name_short: "Omakase 墨 — Gion",
    name_jp: "おまかせ 墨 祇園店",
    name_zh: "",

    city: "Gion, Kyoto",
    region_label: "Gion · Kyoto",
    station_en: "Gion-Shijo Station",
    address_jp_line1: "京都府京都市東山区富永町135",
    address_en_line1: "135 Tominaga-cho, Higashiyama-ku, Kyoto",
    address_postal: "605-0078",

    tel_display: "070-3527-8163",
    tel_raw: "+817035278163",

    hours: "11:00 – 23:00",
    hours_note: "Open Daily",

    reserve_system: "form",
    tablecheck_url: "https://www.tablecheck.com/shops/5wshijo/reserve",
    form_config: FORM_DEFAULT,

    maps_link: "https://maps.app.goo.gl/TbMo3qDpCAJdZxQ28",

    rating: "4.8",
    rating_count: "300+",
    rating_source: "Google reviews",

    maps_embed: "https://www.google.com/maps?q=Kyoto+Omakase+Sushi+Wagyu+Gion&output=embed"
  },

  // ============================================================
  // 3. 築地店(東京)
  // ============================================================
  {
    region: "tokyo",
    slug: "tsukiji",
    same_day_reserve: false,
    time_slots: ['11:00','13:00','15:00','17:00','19:00','21:00'],
    max_guests: 10,
    stations: [ { name: 'Tsukiji Sta.', line: 'Hibiya Line · Exit 1', min: 7 }, { name: 'Tsukijishijo Sta.', line: 'Toei Oedo Line', min: 7 }, { name: 'Higashi-ginza Sta.', line: 'Hibiya / Toei Asakusa', min: 9 } ],

    name_full_en: "Tsukiji Fish Market Sushi Omakase & Wagyu (Halal) Restaurant 筑地寿司和牛餐厅",
    name_short: "Omakase 墨 — Tsukiji",
    name_jp: "おまかせ 墨 築地店",
    name_zh: "",

    city: "Tsukiji, Tokyo",
    region_label: "Tsukiji · Tokyo",
    station_en: "Tsukiji Station",
    address_jp_line1: "東京都中央区築地6丁目24-7",
    address_en_line1: "6-24-7 Tsukiji, Chuo-ku, Tokyo",
    address_postal: "104-0061",

    tel_display: "090-3787-5518",
    tel_raw: "+819037875518",

    hours: "11:00 – 23:00",
    hours_note: "Open Daily",

    reserve_system: "form",
    tablecheck_url: "https://www.tablecheck.com/shops/yakiniku-burger-ramen-zen/reserve",
    form_config: FORM_DEFAULT,

    maps_link: "https://maps.app.goo.gl/dUzfn2z9UQnkC8k57",

    rating: "4.8",
    rating_count: "500+",
    rating_source: "Google reviews",

    maps_embed: "https://www.google.com/maps?q=Tsukiji+Fish+Market+Sushi+Omakase+Wagyu&output=embed"
  },

  // ============================================================
  // 4. 東心斎橋店(大阪)
  // ============================================================
  // ⏳ TODO: tablecheck_url / maps_link / maps_embed を確定したら差し替える
  {
    region: "osaka",
    slug: "higashi-shinsaibashi",
    same_day_reserve: false,
    time_slots: ['11:00','13:00','15:00','17:00','19:00','21:00'],
    max_guests: 15,
    stations: [ { name: 'Nagahoribashi Sta.', line: 'Sakaisuji / Nagahori-Tsurumiryokuchi', min: 4 }, { name: 'Shinsaibashi Sta.', line: 'Midosuji / Nagahori-Tsurumiryokuchi', min: 5 }, { name: 'Namba Sta.', line: 'Midosuji / Yotsubashi / Sennichimae', min: 12 } ],

    name_full_en: "Osaka Omakase Sushi & Wagyu Steak Halal Dotonbori Restaurant 大阪寿司和牛餐厅",
    name_short: "Omakase 墨 — Higashi-Shinsaibashi",
    name_jp: "おまかせ 墨 東心斎橋店",
    name_zh: "",

    city: "Higashi-Shinsaibashi, Osaka",
    region_label: "Higashi-Shinsaibashi · Osaka",
    station_en: "Shinsaibashi Station",
    address_jp_line1: "大阪府大阪市中央区東心斎橋1-18-6 ギャラリービルディング 4F",
    address_en_line1: "1-18-6 Higashi-Shinsaibashi, Chuo-ku, Osaka, Gallery Bldg. 4F",
    address_postal: "542-0083",

    tel_display: "090-4467-3409",
    tel_raw: "+819081295414",

    hours: "11:00 – 23:00",
    hours_note: "Open Daily",

    reserve_system: "form",
    tablecheck_url: "TBD",     // ⏳ 確定したら差し替え
    form_config: FORM_DEFAULT,

    maps_link: "TBD",          // ⏳ GoogleマップURLが来たら差し替え

    rating: "4.8",
    rating_count: "100+",
    rating_source: "Google reviews",

    maps_embed: "TBD"          // ⏳ 埋め込みHTMLが来たら差し替え
  },

  // ============================================================
  // 5. 新宿三丁目店(東京)  ← フォーム予約(EmailJS)・工事休業あり
  // ============================================================
  {
    region: "tokyo",
    slug: "shinjuku-sanchome",
    same_day_reserve: true,
    projection_mapping: true,
    time_slots: ['13:00','15:00','17:00','19:00','21:00'],
    max_guests: 12,
    stations: [ { name: 'Shinjuku-sanchome Sta.', line: 'Marunouchi / Fukutoshin / Shinjuku Line · Exit C3', min: 2 }, { name: 'Shinjuku Sta.', line: 'JR / Private & Subway Lines · East Exit', min: 5 }, { name: 'Shinjuku-gyoenmae Sta.', line: 'Marunouchi Line', min: 7 } ],
    price_adjust: 5000,  // 新宿三丁目のみ全コース税抜+5000(税込は×1.1で再計算)

    name_full_en: "Tokyo Omakase Sushi Wagyu (Muslim-Friendly) Shinjuku Restaurant 新宿寿司和牛餐厅",
    name_short: "Omakase 墨 — Shinjuku",
    name_jp: "おまかせ 墨 新宿三丁目店",
    name_zh: "",

    city: "Shinjuku, Tokyo",
    region_label: "Shinjuku · Tokyo",
    station_en: "Shinjuku-sanchome Station",
    address_jp_line1: "東京都新宿区新宿3-7-5 一兆ビル 2F",
    address_en_line1: "3-7-5 Shinjuku, Shinjuku-ku, Tokyo, Iccho Bldg. 2F",
    address_postal: "160-0022",   // ⚠️ HTMLに記載なし。新宿区新宿3丁目の郵便番号として補完。要確認

    tel_display: "070-3524-8272",
    tel_raw: "+817035248272",

    hours: "11:00 – 23:00",
    hours_note: "Open Daily",

    // ▼ この店はフォーム予約のまま。"tablecheck" に変えるだけでURL予約に切替可能。
    reserve_system: "form",   // "tablecheck" | "form"
    tablecheck_url: "https://www.tablecheck.com/shops/halal-wagyu-shinjuku-5w-tokyo/reserve",
    form_config: {
      ...FORM_DEFAULT,
      // 店舗工事のため休業(YYYY-MM-DD)
      blocked_dates: [
        "2026-05-25",
        "2026-05-26",
        "2026-05-27",
        "2026-05-28",
        "2026-05-29",
        "2026-05-30",
        "2026-05-31"
      ]
    },

    maps_link: "https://maps.app.goo.gl/MbPytsPEsMee3WeG8",

    rating: "4.8",        // ⚠️ HTMLに評価データなし(レビューはサンプル)。要確認
    rating_count: "100+", // ⚠️ 同上。要確認
    rating_source: "Google reviews",

    // HTMLのiframeから取得した実埋め込みURL
    maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2864.9117174052094!2d139.70598719999998!3d35.6910264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d15e9f7526b%3A0x3182f34b1761d38c!2zVG9reW8gT21ha2FzZSBTdXNoaSBXYWd5dSAoSGFsYWwpIFNoaW5qdWt1IFJlc3RhdXJhbnQg5paw5a6_5a-_5Y-45ZKM54mb6aSQ5Y6F!5e1!3m2!1sja!2sjp!4v1775612822829!5m2!1sja!2sjp",

    gads_conversion: 'AW-17988602222/6kOSCImRqbUcEO6S0YFD',
  }
];

const CHANNELS = [
  { id: "default", suffix: "",        utm_source: "lp" },
  { id: "japan",   suffix: "japan/",  utm_source: "lp-japan" },
  { id: "global",  suffix: "global/", utm_source: "lp-global" },
  { id: "map",     suffix: "map/",    utm_source: "lp-map" }
];

// 店舗 × チャネルの全組み合わせを生成
const pages = [];
STORES.forEach(store => {
  CHANNELS.forEach(channel => {
    pages.push({
      ...store,
      channel_id: channel.id,
      channel_suffix: channel.suffix,
      channel_utm_source: channel.utm_source
    });
  });
});

// ============================================================
// テスト用チャンネル(新宿三丁目だけ)
// 本番URLを変えずに、/tokyo/shinjuku-sanchome/test/ で確認するための派生ページ。
// channel_id が "default" 以外なので、テンプレ側で自動的に
// noindex + canonical(本番URL) が付与され、本番SEOには影響しない。
// 価格+5000・当日予約ありは store 側の price_adjust / same_day_reserve で反映済み。
// 確認が済んだら、この test チャンネルのブロックは削除してよい。
// ============================================================
const pagesTest = [];
STORES.forEach(s => {
  pagesTest.push({
    ...s,
    channel_id: "test",
    channel_suffix: "test/",
    channel_utm_source: "lp-test"
  });
});

module.exports = {
  brand: {
    domain: "japan-omakase.wagyu-sushi.com",
    ga4_id: "G-71QJSRH923",
    gas_endpoint: "https://script.google.com/macros/s/AKfycbyqKnuZysH7fLhL7etze1eMOuS003cB5v2YIQeBfhRFGE19RpD8oA0HHOTMizYRRDda/exec",
    brand_name: "Halal Omakase Sushi & Wagyu",
    brand_slug: "japan-omakase"
  },
  stores: STORES,
  channels: CHANNELS,
  pages: pages,        // 本番用(default/japan/global/map)。testは含まない。
  pagesTest: pagesTest // テスト用(新宿三丁目のtestチャンネルのみ)。store-test.njk が使う。
};
