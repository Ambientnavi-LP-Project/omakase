// src/urls.11ty.js
// stores.js の全ページ定義から URL 一覧 CSV を生成し /urls.csv として出力する。
// 店舗を stores.js に追加してデプロイすると、このCSVが自動で更新される。
// Googleスプレッドシートからは =IMPORTDATA("https://<domain>/urls.csv") で自動取り込み可能。
//
// 出力列: 店舗 / 地域 / slug / 状態 / 種別 / 用途 / LP_URL / Google広告用URL / GBP用URL / TableCheck予約URL

const stores = require("./_data/stores.js");

const USE = {
  default: "直接訪問・SEO",
  japan: "日本向け広告(混在)",
  global: "海外向け広告(混在)",
  map: "GBP経由",
  sushi: "寿司訴求 広告",
  wagyu: "和牛/ステーキ訴求 広告",
  simple: "簡易版",
  test: "テスト用",
};

const AD_CHANNELS = new Set(["japan", "global", "sushi", "wagyu"]);
const AD_SUFFIX =
  "?utm_source=google-ads-website&utm_medium=cpc&utm_campaign=store";
const GBP_SUFFIX =
  "?utm_source=google-maps-hp&utm_medium=organic&utm_campaign=profile";

module.exports = class {
  data() {
    return {
      permalink: "/urls.csv",
      eleventyExcludeFromCollections: true,
    };
  }

  render() {
    const domain = stores.brand.domain;
    const groups = [
      ["pages", "live"],
      ["pagesV2", "live"],       // 新デザイン(v2)の本番LP。store-v2.njk が使う。
      ["pagesSushi", "live"],
      ["pagesWagyu", "live"],
      ["pagesSimple", "live"],
      ["pagesRelocated", "移転"],
    ];

    const header = [
      "店舗", "地域", "slug", "状態", "種別", "用途",
      "LP_URL", "Google広告用URL", "GBP用URL", "TableCheck予約URL",
    ];

    const rows = [header];
    for (const [key, state] of groups) {
      (stores[key] || []).forEach((p) => {
        const lp = `https://${domain}/${p.region}/${p.slug}/${p.channel_suffix}`;
        const ch = p.channel_id;
        const adUrl = AD_CHANNELS.has(ch) ? lp + AD_SUFFIX : "";
        const gbpUrl = ch === "map" ? lp + GBP_SUFFIX : "";
        let tcUrl = "";
        if (p.tablecheck_url && p.tablecheck_url !== "TBD") {
          const src = p.channel_utm_source || "lp";
          tcUrl = `${p.tablecheck_url}?utm_source=${src}&utm_medium=referral`;
        }
        rows.push([
          p.name_jp || p.slug, p.region, p.slug, state, ch, USE[ch] || "",
          lp, adUrl, gbpUrl, tcUrl,
        ]);
      });
    }

    return rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
  }
};
