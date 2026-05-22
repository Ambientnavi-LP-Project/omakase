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
 */

const STORES = [
  // ============================================================
  // 1. 浅草古民家店(東京)
  // ============================================================
  {
    region: "tokyo",
    slug: "asakusa-kominka",

    name_full_en: "Omakase Sushi Wagyu (Muslim-Friendly) Tokyo Asakusa Restaurant",
    name_short: "Omakase 墨 — Asakusa",
    name_jp: "おまかせ 墨 浅草店",
    name_zh: "浅草寿司和牛餐厅",

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

    tablecheck_url: "https://www.tablecheck.com/shops/halal-omakase-asakusa/reserve",
    maps_link: "https://maps.app.goo.gl/pxiMce5bhj1WMLpo9",

    rating: "4.8",
    rating_count: "500+",
    rating_source: "Google reviews",

    // Google Maps embed iframe src(各店舗で違う)
    maps_embed: "https://www.google.com/maps?q=Omakase+Sushi+Wagyu+Asakusa+Tokyo&output=embed"
  },

  // ============================================================
  // 2. 京都祇園店(京都)
  // ============================================================
  {
    region: "kyoto",
    slug: "gion",

    name_full_en: "Kyoto Omakase Sushi & Wagyu Steak (Muslim-Friendly) Gion Restaurant",
    name_short: "Omakase 墨 — Gion",
    name_jp: "おまかせ 墨 祇園店",
    name_zh: "京都寿司和牛餐厅",

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

    tablecheck_url: "TBD",  // ⏳ 後で差し替え
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

    name_full_en: "Tsukiji Fish Market Sushi Omakase & Wagyu (Muslim-Friendly) Restaurant",
    name_short: "Omakase 墨 — Tsukiji",
    name_jp: "おまかせ 墨 築地店",
    name_zh: "筑地寿司和牛餐厅",

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

    tablecheck_url: "TBD",  // ⏳ 後で差し替え
    maps_link: "https://maps.app.goo.gl/dUzfn2z9UQnkC8k57",

    rating: "4.8",
    rating_count: "500+",
    rating_source: "Google reviews",

    maps_embed: "https://www.google.com/maps?q=Tsukiji+Fish+Market+Sushi+Omakase+Wagyu&output=embed"
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

module.exports = {
  brand: {
    domain: "japan-omakase.wagyu-sushi.com",
    ga4_id: "G-71QJSRH923",
    brand_name: "Halal Omakase Sushi & Wagyu",
    brand_slug: "japan-omakase"
  },
  stores: STORES,
  channels: CHANNELS,
  pages: pages
};
