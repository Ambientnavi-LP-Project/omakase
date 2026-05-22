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
  {
    // ===== URL/識別 =====
    region: "tokyo",
    slug: "asakusa-kominka",

    // ===== 店名 =====
    name_full_en: "Omakase Sushi Wagyu (Halal) Tokyo Asakusa Restaurant",
    name_short: "Omakase 墨 — Asakusa",
    name_jp: "おまかせ 墨 浅草店",
    name_zh: "浅草寿司和牛餐厅",

    // ===== 立地 =====
    city: "Asakusa, Tokyo",
    station_en: "Asakusa Station",
    address_en: "3-27-5 Asakusa, Taito-ku, Tokyo",
    address_postal: "111-0032",

    // ===== 連絡先 =====
    tel_display: "03-3872-2010",
    tel_raw: "+81338722010",

    // ===== 営業 =====
    hours: "11:00 – 23:00",
    hours_note: "Open Daily",

    // ===== 予約・地図 =====
    tablecheck_url: "https://www.tablecheck.com/shops/halal-omakase-asakusa/reserve",
    maps_link: "https://maps.app.goo.gl/pxiMce5bhj1WMLpo9",

    // ===== 評価 =====
    rating: "4.8",
    rating_count: "500+",
    rating_source: "Google reviews"
  }

  // ===== 2店舗目を追加するときはこの下にもう1つ { ... } を書くだけ =====
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
