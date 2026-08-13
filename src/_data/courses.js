/**
 * コースデータ（多言語）— 全LP共通のシングルソース
 * ------------------------------------------------------------
 * これまで store.njk / store-sushi.njk / store-wagyu.njk / store-simple.njk に
 * 同じ COURSES 配列が 4〜5回ハードコードされていたものを 1ファイルに集約。
 * 11ty の _data 配下なので、テンプレートからは `courses` でそのまま参照できる。
 *
 *   {{ courses.list }}   … 全コース
 *   {{ courses.cats }}   … カテゴリ定義（mix / sushi / wagyu）
 *
 * 価格ルール（既存踏襲）
 *   実売（税抜） = base + (noadj ? 0 : store.price_adjust)
 *   税込        = floor(実売 * 1.1)
 *
 * 多言語は { en, ja, zh } の3キー。テンプレ側で lang 属性を出し分け、
 * クライアントの言語切替（data-i18n-*）で表示を差し替える。
 */

const CATS = [
  {
    key: "mix",
    img: "/images/cat-mix.jpg",
    label: { en: "Sushi & Wagyu", ja: "寿司と和牛", zh: "寿司与和牛" },
    lead: {
      en: "Both counters in one seating — nigiri from the cutting board, wagyu from the iron plate.",
      ja: "握りと和牛を、一度の席で。まな板と鉄板、二つの仕事を続けて味わうコース。",
      zh: "一席之间，兼得两味。握寿司与和牛铁板，依序上桌。"
    }
  },
  {
    key: "sushi",
    img: "/images/cat-sushi.jpg",
    label: { en: "Sushi", ja: "寿司", zh: "寿司" },
    lead: {
      en: "Edomae nigiri and hand rolls, shaped one at a time in front of you.",
      ja: "江戸前の握りと手巻き。目の前で一貫ずつ握ります。",
      zh: "江户前握寿司与手卷，师傅当面逐贯捏制。"
    }
  },
  {
    key: "wagyu",
    img: "/images/cat-wagyu.jpg",
    label: { en: "Wagyu", ja: "和牛", zh: "和牛" },
    lead: {
      en: "Sukiyaki, fillet steak and nikuzushi — three ways with the same cut.",
      ja: "すき焼き、フィレステーキ、肉寿司。ひとつの部位を三通りで。",
      zh: "寿喜烧、菲力牛排、肉寿司。同一部位，三种吃法。"
    }
  }
];

/** 献立の流れ（品書き）。順番そのものが情報なので配列順＝提供順。 */
const R = (l_en, l_ja, l_zh, t_en, t_ja, t_zh) => ({
  label: { en: l_en, ja: l_ja, zh: l_zh },
  text: { en: t_en, ja: t_ja, zh: t_zh }
});

const HASSUN_SUSHI = R("Hassun", "八寸", "八寸",
  "Chef's seasonal appetizers", "季節の前菜盛り合わせ", "时令前菜拼盘");
const HASSUN_WAGYU = R("Hassun", "八寸", "八寸",
  "Wagyu hassun — seasonal appetizers", "和牛の八寸・季節の前菜", "和牛八寸・时令前菜");
const TOFU = R("Starter", "序", "前菜",
  "Chilled tofu", "冷やし豆腐", "冷豆腐");
const SOUP = R("Soup", "椀", "汤品",
  "Aka-dashi miso soup", "赤出汁", "赤味噌汤");
const SWEETS = R("Tea & sweets", "茶と甘味", "茶与甜点",
  "Matcha and mini Japanese sweets", "抹茶と季節の和菓子", "抹茶与迷你和果子");

const LIST = [
  // ---------- Sushi & Wagyu（mix） ----------
  {
    id: "sushi-wagyu-light",
    cat: "mix",
    tier: "entry",
    base: 19800,
    noadj: true,
    web_only: true,
    img: "/images/course-sushi-wagyu-standard.jpg",
    minutes: "60–75",
    name: {
      en: "Sushi & Wagyu — Web Exclusive",
      ja: "寿司と和牛 — Web予約限定",
      zh: "寿司与和牛 — 网络预约限定"
    },
    lead: {
      en: "The full flow in lighter portions: three nigiri and a 50g fillet. Bookable online only.",
      ja: "流れはそのまま、量を軽く。握り三貫とフィレ50g。Web予約からのみ承ります。",
      zh: "完整流程、分量轻盈。握寿司三贯与50克菲力，仅限网络预约。"
    },
    rows: [
      HASSUN_WAGYU, TOFU,
      R("Nigiri ×3", "握り 三貫", "握寿司 三贯",
        "Lean tuna / salmon / sea bream", "赤身・サーモン・鯛", "赤身・三文鱼・鲷鱼"),
      R("Steak", "和牛", "牛排",
        "Wagyu fillet steak 50g", "和牛フィレステーキ 50g", "和牛菲力牛排 50克"),
      R("Hot pot", "温物", "热菜",
        "Wagyu sukiyaki", "和牛すき焼き", "和牛寿喜烧"),
      R("Roll & nikuzushi", "手巻と肉寿司", "手卷与肉寿司",
        "Salmon & ikura hand roll · wagyu nikuzushi", "サーモンいくら手巻・和牛の肉寿司", "三文鱼鲑鱼子手卷・和牛肉寿司"),
      SOUP, SWEETS
    ]
  },
  {
    id: "sushi-wagyu-lunch",
    cat: "mix",
    tier: "lunch",
    base: 29800,
    noadj: true,
    lunch_only: true,
    img: "/images/course-sushi-wagyu-standard.jpg",
    minutes: "60–75",
    name: {
      en: "Sushi & Wagyu — Lunch",
      ja: "寿司と和牛 — ランチ",
      zh: "寿司与和牛 — 午市"
    },
    lead: {
      en: "Lunch seating only. Five nigiri and a 50g fillet.",
      ja: "昼の部限定。握り五貫とフィレ50g。",
      zh: "仅限午市。握寿司五贯与50克菲力。"
    },
    rows: [
      HASSUN_WAGYU, TOFU,
      R("Nigiri ×5", "握り 五貫", "握寿司 五贯",
        "Chutoro / salmon / sea bream / tamago / scallop", "中トロ・サーモン・鯛・玉子・帆立", "中脂金枪鱼・三文鱼・鲷鱼・玉子・扇贝"),
      R("Steak", "和牛", "牛排",
        "Wagyu fillet steak 50g", "和牛フィレステーキ 50g", "和牛菲力牛排 50克"),
      R("Hot pot", "温物", "热菜",
        "Wagyu sukiyaki", "和牛すき焼き", "和牛寿喜烧"),
      R("Roll & nikuzushi", "手巻と肉寿司", "手卷与肉寿司",
        "Salmon & ikura hand roll · wagyu nikuzushi", "サーモンいくら手巻・和牛の肉寿司", "三文鱼鲑鱼子手卷・和牛肉寿司"),
      SOUP, SWEETS
    ]
  },
  {
    id: "sushi-wagyu-standard",
    cat: "mix",
    tier: "standard",
    base: 59800,
    img: "/images/course-sushi-wagyu-standard.jpg",
    minutes: "60–75",
    name: {
      en: "Sushi & Wagyu — Standard",
      ja: "寿司と和牛 — スタンダード",
      zh: "寿司与和牛 — 标准"
    },
    lead: {
      en: "Five nigiri, a 100g fillet, sukiyaki and nikuzushi. The house course.",
      ja: "握り五貫、フィレ100g、すき焼き、肉寿司。当店の基本形。",
      zh: "握寿司五贯、100克菲力、寿喜烧与肉寿司。本店基本款。"
    },
    rows: [
      HASSUN_SUSHI, TOFU,
      R("Nigiri ×5", "握り 五貫", "握寿司 五贯",
        "Chutoro / salmon / sea bream / tamago / scallop", "中トロ・サーモン・鯛・玉子・帆立", "中脂金枪鱼・三文鱼・鲷鱼・玉子・扇贝"),
      R("Steak", "和牛", "牛排",
        "Wagyu fillet steak 100g", "和牛フィレステーキ 100g", "和牛菲力牛排 100克"),
      R("Hot pot", "温物", "热菜",
        "Wagyu sukiyaki", "和牛すき焼き", "和牛寿喜烧"),
      R("Roll & nikuzushi", "手巻と肉寿司", "手卷与肉寿司",
        "Salmon & ikura hand roll · wagyu nikuzushi", "サーモンいくら手巻・和牛の肉寿司", "三文鱼鲑鱼子手卷・和牛肉寿司"),
      SOUP, SWEETS
    ]
  },
  {
    id: "sushi-kobe-premium",
    cat: "mix",
    tier: "premium",
    base: 79800,
    img: "/images/course-sushi-kobe-premium.jpg",
    minutes: "60–75",
    name: {
      en: "Sushi & Kobe Beef — Premium",
      ja: "寿司と神戸牛 — プレミアム",
      zh: "寿司与神户牛 — 尊享"
    },
    lead: {
      en: "Standard, with sea urchin and crab added and every beef cut raised to Kobe.",
      ja: "スタンダードに雲丹と蟹を加え、牛はすべて神戸牛に。",
      zh: "在标准之上加入海胆与蟹，牛肉全数升级为神户牛。"
    },
    rows: [
      HASSUN_SUSHI, TOFU,
      R("Nigiri ×5", "握り 五貫", "握寿司 五贯",
        "Chutoro / salmon / sea bream / tamago / crab gunkan", "中トロ・サーモン・鯛・玉子・蟹軍艦", "中脂金枪鱼・三文鱼・鲷鱼・玉子・蟹军舰"),
      R("Steak", "神戸牛", "牛排",
        "Kobe beef fillet steak 100g", "神戸牛フィレステーキ 100g", "神户牛菲力牛排 100克"),
      R("Hot pot", "温物", "热菜",
        "Kobe beef sukiyaki", "神戸牛すき焼き", "神户牛寿喜烧"),
      R("Roll & nikuzushi", "手巻と肉寿司", "手卷与肉寿司",
        "Sea urchin hand roll · Kobe beef nikuzushi", "雲丹の手巻・神戸牛の肉寿司", "海胆手卷・神户牛肉寿司"),
      SOUP, SWEETS
    ]
  },

  // ---------- Sushi ----------
  {
    id: "sushi-standard",
    cat: "sushi",
    tier: "standard",
    base: 49800,
    img: "/images/course-sushi-standard.jpg",
    minutes: "60–75",
    name: {
      en: "Sushi — Standard",
      ja: "寿司 — スタンダード",
      zh: "寿司 — 标准"
    },
    lead: {
      en: "Ten nigiri, two hand rolls and shrimp chawanmushi.",
      ja: "握り十貫、手巻き二本、海老の茶碗蒸し。",
      zh: "握寿司十贯、手卷两条、鲜虾茶碗蒸。"
    },
    rows: [
      HASSUN_SUSHI, TOFU,
      R("Hand roll", "手巻", "手卷",
        "Salmon & ikura", "サーモンいくら", "三文鱼鲑鱼子"),
      R("Nigiri ×10", "握り 十貫", "握寿司 十贯",
        "Chutoro / salmon / sea bream / shrimp / scallop · lean tuna / seared salmon / tamago / seared sea bream / ikura gunkan",
        "中トロ・サーモン・鯛・海老・帆立／赤身・炙りサーモン・玉子・炙り鯛・いくら軍艦",
        "中脂金枪鱼・三文鱼・鲷鱼・甜虾・扇贝／赤身・炙烤三文鱼・玉子・炙烤鲷鱼・鲑鱼子军舰"),
      R("Hand roll", "手巻", "手卷",
        "Chopped lean tuna", "赤身のたたき", "剁赤身"),
      R("Soup", "椀", "汤品",
        "Aka-dashi miso soup & shrimp chawanmushi", "赤出汁と海老の茶碗蒸し", "赤味噌汤与鲜虾茶碗蒸"),
      SWEETS
    ]
  },
  {
    id: "sushi-premium",
    cat: "sushi",
    tier: "premium",
    base: 69800,
    img: "/images/course-sushi-premium.jpg",
    minutes: "60–75",
    name: {
      en: "Sushi — Premium",
      ja: "寿司 — プレミアム",
      zh: "寿司 — 尊享"
    },
    lead: {
      en: "Adds sea urchin and crab nigiri, an extra sea urchin roll, and snow crab chawanmushi.",
      ja: "雲丹と蟹の握り、雲丹の手巻きを追加。茶碗蒸しは香箱蟹に。",
      zh: "加入海胆与蟹握寿司、海胆手卷，茶碗蒸换为松叶蟹。"
    },
    rows: [
      HASSUN_SUSHI, TOFU,
      R("Hand rolls", "手巻", "手卷",
        "Sea urchin · salmon & ikura", "雲丹／サーモンいくら", "海胆／三文鱼鲑鱼子"),
      R("Nigiri ×10", "握り 十貫", "握寿司 十贯",
        "Chutoro / salmon / sea bream / sea urchin gunkan / scallop · lean tuna / seared salmon / tamago / crab gunkan / ikura gunkan",
        "中トロ・サーモン・鯛・雲丹軍艦・帆立／赤身・炙りサーモン・玉子・蟹軍艦・いくら軍艦",
        "中脂金枪鱼・三文鱼・鲷鱼・海胆军舰・扇贝／赤身・炙烤三文鱼・玉子・蟹军舰・鲑鱼子军舰"),
      R("Hand roll", "手巻", "手卷",
        "Chopped chutoro", "中トロのたたき", "剁中脂金枪鱼"),
      R("Soup", "椀", "汤品",
        "Aka-dashi miso soup & snow crab chawanmushi", "赤出汁と香箱蟹の茶碗蒸し", "赤味噌汤与松叶蟹茶碗蒸"),
      SWEETS
    ]
  },

  // ---------- Wagyu ----------
  {
    id: "wagyu-standard",
    cat: "wagyu",
    tier: "standard",
    base: 49800,
    img: "/images/course-wagyu-standard.jpg",
    minutes: "60–75",
    name: {
      en: "Wagyu — Standard",
      ja: "和牛 — スタンダード",
      zh: "和牛 — 标准"
    },
    lead: {
      en: "Sukiyaki, a 100g fillet, spring roll and nikuzushi.",
      ja: "すき焼き、フィレ100g、春巻き、肉寿司。",
      zh: "寿喜烧、100克菲力、春卷与肉寿司。"
    },
    rows: [
      HASSUN_WAGYU, TOFU,
      R("Hot pot", "温物", "热菜",
        "Wagyu sukiyaki, thin-sliced", "和牛すき焼き（薄切り）", "和牛寿喜烧（薄切）"),
      R("Steak", "和牛", "牛排",
        "Wagyu fillet steak 100g", "和牛フィレステーキ 100g", "和牛菲力牛排 100克"),
      R("Specialty", "逸品", "招牌",
        "Wagyu spring roll", "和牛の春巻き", "和牛春卷"),
      R("Nikuzushi", "鮨", "肉寿司",
        "Wagyu nikuzushi & steak hand roll 20g", "和牛の肉寿司とステーキ手巻 20g", "和牛肉寿司与牛排手卷 20克"),
      R("Soup", "椀", "汤品",
        "Shijimi aka-dashi & bite-size gyudon", "しじみの赤出汁と一口牛丼", "蚬赤味噌汤与一口牛丼"),
      SWEETS
    ]
  },
  {
    id: "kobe-premium",
    cat: "wagyu",
    tier: "premium",
    base: 69800,
    img: "/images/course-kobe-premium.jpg",
    minutes: "60–75",
    name: {
      en: "Kobe Beef — Premium",
      ja: "神戸牛 — プレミアム",
      zh: "神户牛 — 尊享"
    },
    lead: {
      en: "The same course, every cut raised to certified Kobe beef.",
      ja: "構成はそのまま、牛をすべて神戸牛に。",
      zh: "构成不变，牛肉全数升级为认证神户牛。"
    },
    rows: [
      HASSUN_WAGYU, TOFU,
      R("Hot pot", "温物", "热菜",
        "Kobe beef sukiyaki, thin-sliced", "神戸牛すき焼き（薄切り）", "神户牛寿喜烧（薄切）"),
      R("Steak", "神戸牛", "牛排",
        "Kobe beef fillet steak 100g", "神戸牛フィレステーキ 100g", "神户牛菲力牛排 100克"),
      R("Specialty", "逸品", "招牌",
        "Kobe beef spring roll", "神戸牛の春巻き", "神户牛春卷"),
      R("Nikuzushi", "鮨", "肉寿司",
        "Kobe beef nikuzushi & steak hand roll 20g", "神戸牛の肉寿司とステーキ手巻 20g", "神户牛肉寿司与牛排手卷 20克"),
      R("Soup", "椀", "汤品",
        "Shijimi aka-dashi & bite-size Kobe gyudon", "しじみの赤出汁と一口神戸牛丼", "蚬赤味噌汤与一口神户牛丼"),
      SWEETS
    ]
  }
];

module.exports = {
  cats: CATS,
  list: LIST,
  /** 予約フォームの選択肢に出す順番 */
  order: [
    "sushi-wagyu-light",
    "sushi-wagyu-standard",
    "sushi-kobe-premium",
    "sushi-wagyu-lunch",
    "sushi-standard",
    "sushi-premium",
    "wagyu-standard",
    "kobe-premium"
  ]
};
