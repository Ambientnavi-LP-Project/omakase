/**
 * コースデータ（多言語）— 全LP共通のシングルソース
 * ------------------------------------------------------------
 * 【重要】コース名・説明・献立はすべて既存 store.njk / reserve-form-modal.njk の
 *   COURSES 定義からそのまま持ってきています。新規に創作した表現は入れていません。
 *
 * 対応言語: en / zhs(簡体) / zht(繁体) / ko(韓国語) / id(インドネシア語)
 *   ※ 日本語は不要とのことなので持っていません。
 *   ※ rows(献立の流れ)は素材名の羅列のため全言語で英語のまま出しています。
 *      訳す場合は rows を {en,zhs,zht,ko,id} 形式に変えるだけで対応できます。
 *
 * 価格ルール（既存踏襲）
 *   実売(税抜) = base + (noadj ? 0 : store.price_adjust) / 税込 = floor(実売 * 1.1)
 */

const CATS = [
  {
    key: "mix",
    img: "/images/cat-mix.jpg",
    tag: true,   // Most Popular
    label: { en: "Sushi & Wagyu", zhs: "寿司与和牛", zht: "壽司與和牛", ko: "스시 & 와규", id: "Sushi & Wagyu" },
    // 既存 store-sushi.njk / store-wagyu.njk の CATS[].story より
    lead: {
      en: "The best of both worlds — the season\u2019s finest nigiri and hand rolls served alongside premium wagyu, course by course, in one indulgent journey.",
      zhs: "两全其美——当季最上乘的握寿司与手卷，伴随顶级和牛逐道呈上，成就一场尽兴的旅程。",
      zht: "兩全其美——當季最上乘的握壽司與手卷，伴隨頂級和牛逐道呈上，成就一場盡興的旅程。",
      ko: "두 가지의 정수 — 제철 최상급 니기리와 핸드롤을 프리미엄 와규와 함께 한 코스씩, 아낌없는 여정으로.",
      id: "Yang terbaik dari keduanya — nigiri dan hand roll terbaik musim ini disajikan bersama wagyu premium, hidangan demi hidangan, dalam satu perjalanan yang memanjakan."
    },
    note: {
      en: "A Kobe beef premium course is also available.",
      zhs: "另有神户牛尊享套餐。", zht: "另有神戶牛尊享套餐。",
      ko: "고베규 프리미엄 코스도 준비되어 있습니다.", id: "Tersedia juga kursus premium daging Kobe."
    }
  },
  {
    key: "sushi",
    img: "/images/cat-sushi.jpg",
    label: { en: "Sushi", zhs: "寿司", zht: "壽司", ko: "스시", id: "Sushi" },
    lead: {
      en: "Edomae-style omakase — nigiri and hand rolls crafted piece by piece from the day\u2019s finest fish, each served at the peak of its flavor.",
      zhs: "江户前风格的 omakase——以当日最上乘的鱼货逐贯捏制握寿司与手卷，在风味最佳的时刻呈上。",
      zht: "江戶前風格的 omakase——以當日最上乘的魚貨逐貫捏製握壽司與手卷，在風味最佳的時刻呈上。",
      ko: "에도마에 스타일 오마카세 — 그날 가장 좋은 생선으로 한 점씩 쥐어낸 니기리와 핸드롤을, 가장 맛있는 순간에.",
      id: "Omakase gaya Edomae — nigiri dan hand roll dibuat satu per satu dari ikan terbaik hari itu, disajikan pada puncak rasanya."
    },
    note: {
      en: "A Premium course with sea urchin and chutoro tuna is also available.",
      zhs: "另有加入海胆与中脂金枪鱼的尊享套餐。", zht: "另有加入海膽與中脂鮪魚的尊享套餐。",
      ko: "성게와 주토로를 더한 프리미엄 코스도 준비되어 있습니다.", id: "Tersedia juga kursus Premium dengan bulu babi dan tuna chutoro."
    }
  },
  {
    key: "wagyu",
    img: "/images/cat-wagyu.jpg",
    label: { en: "Wagyu Beef", zhs: "和牛", zht: "和牛", ko: "와규", id: "Wagyu" },
    lead: {
      en: "Premium Japanese wagyu at its finest — fillet steak, sukiyaki and wagyu sushi, each cut chosen for its marbling and melt-in-the-mouth richness.",
      zhs: "顶级日本和牛的极致——菲力牛排、寿喜烧与和牛寿司，每一块皆因霜降与入口即化的丰腴而选。",
      zht: "頂級日本和牛的極致——菲力牛排、壽喜燒與和牛壽司，每一塊皆因霜降與入口即化的豐腴而選。",
      ko: "최상급 일본 와규의 정수 — 안심 스테이크, 스키야키, 와규 스시. 마블링과 입안에서 녹는 풍미로 고른 부위만.",
      id: "Wagyu Jepang premium terbaik — steak fillet, sukiyaki, dan sushi wagyu; setiap potongan dipilih karena marbling dan kelembutannya."
    },
    note: {
      en: "A Kobe beef course is also available.",
      zhs: "另有神户牛套餐。", zht: "另有神戶牛套餐。",
      ko: "고베규 코스도 준비되어 있습니다.", id: "Tersedia juga kursus daging Kobe."
    }
  }
];

/** 訴求テーマごとに出すカテゴリ。既存 store-sushi.njk / store-wagyu.njk と同じ組み合わせ。 */
const THEMES = { sushi: ["mix", "sushi"], wagyu: ["mix", "wagyu"], all: ["mix", "sushi", "wagyu"] };

const META = {
  en: "8 courses · 60–75 min",
  zhs: "8 道菜 · 60–75 分钟",
  zht: "8 道菜 · 60–75 分鐘",
  ko: "8코스 · 60–75분",
  id: "8 hidangan · 60–75 menit"
};

const LIST = [
  {
    id: "sushi-wagyu-light", cat: "mix", base: 19800, noadj: true, web_only: true,
    img: "/images/course-sushi-wagyu-standard.jpg",
    name: {
      en: "Sushi & Wagyu Course — Web Exclusive",
      zhs: "寿司与和牛套餐 — 网络限定",
      zht: "壽司與和牛套餐 — 網路限定",
      ko: "스시 & 와규 코스 — 웹 한정",
      id: "Kursus Sushi & Wagyu — Khusus Web"
    },
    lead: {
      en: "Online-only entry · the full sushi & wagyu flow.",
      zhs: "仅限线上预约的入门款 · 完整的寿司与和牛流程。",
      zht: "僅限線上預約的入門款 · 完整的壽司與和牛流程。",
      ko: "온라인 전용 입문 코스 · 스시와 와규의 전체 흐름.",
      id: "Hanya lewat pemesanan online · alur lengkap sushi & wagyu."
    },
    rows: [
      "Wagyu Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Nigiri 3 — Lean Tuna / Salmon / Sea Bream",
      "Wagyu Fillet Steak 50g",
      "Wagyu Sukiyaki",
      "Salmon & Ikura Hand Roll · Wagyu Nikuzushi",
      "Aka-dashi Miso Soup · Matcha & Sweets"
    ]
  },
  {
    id: "sushi-wagyu-standard", cat: "mix", base: 59800,
    img: "/images/course-sushi-wagyu-standard.jpg",
    name: {
      en: "Sushi & Wagyu Course Standard",
      zhs: "寿司与和牛套餐 标准",
      zht: "壽司與和牛套餐 標準",
      ko: "스시 & 와규 코스 스탠다드",
      id: "Kursus Sushi & Wagyu Standard"
    },
    lead: {
      en: "The standard sushi + wagyu combo.",
      zhs: "标准的寿司＋和牛组合。",
      zht: "標準的壽司＋和牛組合。",
      ko: "표준 스시＋와규 조합.",
      id: "Kombinasi standar sushi + wagyu."
    },
    rows: [
      "Sushi Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Nigiri 5 — Chutoro / Salmon / Sea Bream / Tamago / Scallop",
      "Wagyu Fillet Steak 100g",
      "Wagyu Sukiyaki",
      "Salmon & Ikura Hand Roll · Wagyu Nikuzushi",
      "Aka-dashi Miso Soup · Matcha & Sweets"
    ]
  },
  {
    id: "sushi-kobe-premium", cat: "mix", base: 79800, premium: true,
    img: "/images/course-sushi-kobe-premium.jpg",
    name: {
      en: "Sushi & Kobe Beef Course Premium",
      zhs: "寿司与神户牛套餐 尊享",
      zht: "壽司與神戶牛套餐 尊享",
      ko: "스시 & 고베규 코스 프리미엄",
      id: "Kursus Sushi & Daging Kobe Premium"
    },
    lead: {
      en: "Adds Sea Urchin & Crab sushi; beef upgraded to Kobe Beef.",
      zhs: "增加海胆与蟹寿司；牛肉升级为神户牛。",
      zht: "增加海膽與蟹壽司；牛肉升級為神戶牛。",
      ko: "성게와 게 스시를 추가하고, 소고기는 고베규로 업그레이드.",
      id: "Menambah sushi bulu babi & kepiting; daging naik ke Kobe Beef."
    },
    rows: [
      "Sushi Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Nigiri 5 — Chutoro / Salmon / Sea Bream / Tamago / Crab Gunkan",
      "Kobe Beef Fillet Steak 100g",
      "Kobe Beef Sukiyaki",
      "Sea Urchin Hand Roll · Kobe Beef Nikuzushi",
      "Aka-dashi Miso Soup · Matcha & Sweets"
    ]
  },
  {
    id: "sushi-wagyu-lunch", cat: "mix", base: 29800, noadj: true, lunch_only: true,
    img: "/images/course-sushi-wagyu-standard.jpg",
    name: {
      en: "Sushi & Wagyu Lunch Course",
      zhs: "寿司与和牛 午间套餐",
      zht: "壽司與和牛 午間套餐",
      ko: "스시 & 와규 런치 코스",
      id: "Kursus Makan Siang Sushi & Wagyu"
    },
    lead: {
      en: "Lunch-only · the full sushi & wagyu flow.",
      zhs: "仅限午间 · 完整的寿司与和牛流程。",
      zht: "僅限午間 · 完整的壽司與和牛流程。",
      ko: "런치 전용 · 스시와 와규의 전체 흐름.",
      id: "Hanya saat makan siang · alur lengkap sushi & wagyu."
    },
    rows: [
      "Wagyu Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Nigiri 5 — Chutoro / Salmon / Sea Bream / Tamago / Scallop",
      "Wagyu Fillet Steak 50g",
      "Wagyu Sukiyaki",
      "Salmon & Ikura Hand Roll · Wagyu Nikuzushi",
      "Aka-dashi Miso Soup · Matcha & Sweets"
    ]
  },
  {
    id: "sushi-standard", cat: "sushi", base: 49800,
    img: "/images/course-sushi-standard.jpg",
    name: {
      en: "Sushi Course Standard",
      zhs: "寿司套餐 标准", zht: "壽司套餐 標準",
      ko: "스시 코스 스탠다드", id: "Kursus Sushi Standard"
    },
    lead: {
      en: "The standard sushi omakase.",
      zhs: "标准的寿司 omakase。", zht: "標準的壽司 omakase。",
      ko: "표준 스시 오마카세.", id: "Omakase sushi standar."
    },
    rows: [
      "Sushi Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Salmon & Ikura Hand Roll",
      "Nigiri 10 — Chutoro / Salmon / Sea Bream / Shrimp / Scallop · Lean Tuna / Seared Salmon / Tamago / Seared Sea Bream / Ikura Gunkan",
      "Chopped Lean Tuna (Akami)",
      "Aka-dashi Miso Soup & Shrimp Chawanmushi",
      "Matcha & Mini Japanese Sweets"
    ]
  },
  {
    id: "sushi-premium", cat: "sushi", base: 69800, premium: true,
    img: "/images/course-sushi-premium.jpg",
    name: {
      en: "Sushi Course Premium",
      zhs: "寿司套餐 尊享", zht: "壽司套餐 尊享",
      ko: "스시 코스 프리미엄", id: "Kursus Sushi Premium"
    },
    lead: {
      en: "Adds Sea Urchin & Crab nigiri, an extra Sea Urchin hand roll, snow-crab chawanmushi.",
      zhs: "增加海胆与蟹握寿司、海胆手卷，以及松叶蟹茶碗蒸。",
      zht: "增加海膽與蟹握壽司、海膽手卷，以及松葉蟹茶碗蒸。",
      ko: "성게·게 니기리와 성게 핸드롤, 대게 차완무시를 추가.",
      id: "Menambah nigiri bulu babi & kepiting, hand roll bulu babi, dan chawanmushi kepiting salju."
    },
    rows: [
      "Sushi Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Sea Urchin Hand Roll · Salmon & Ikura Hand Roll",
      "Nigiri 10 — Chutoro / Salmon / Sea Bream / Urchin Gunkan / Scallop · Lean Tuna / Seared Salmon / Tamago / Crab Gunkan / Ikura Gunkan",
      "Chopped Chutoro Tuna",
      "Aka-dashi Miso Soup & Snow Crab Chawanmushi",
      "Matcha & Mini Japanese Sweets"
    ]
  },
  {
    id: "wagyu-standard", cat: "wagyu", base: 49800,
    img: "/images/course-wagyu-standard.jpg",
    name: {
      en: "Wagyu Course Standard",
      zhs: "和牛套餐 标准", zht: "和牛套餐 標準",
      ko: "와규 코스 스탠다드", id: "Kursus Wagyu Standard"
    },
    lead: {
      en: "The standard wagyu omakase.",
      zhs: "标准的和牛 omakase。", zht: "標準的和牛 omakase。",
      ko: "표준 와규 오마카세.", id: "Omakase wagyu standar."
    },
    rows: [
      "Wagyu Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Wagyu Sukiyaki (thin-sliced)",
      "Wagyu Fillet Steak 100g",
      "Wagyu Spring Roll",
      "Wagyu Nikuzushi & Steak Hand Roll (20g)",
      "Aka-dashi Miso Soup — Shijimi · Bite-Size Gyudon · Matcha & Sweets"
    ]
  },
  {
    id: "kobe-premium", cat: "wagyu", base: 69800, premium: true,
    img: "/images/course-kobe-premium.jpg",
    name: {
      en: "Kobe Beef Course Premium",
      zhs: "神户牛套餐 尊享", zht: "神戶牛套餐 尊享",
      ko: "고베규 코스 프리미엄", id: "Kursus Daging Kobe Premium"
    },
    lead: {
      en: "Same as Standard, upgraded to premium Kobe Beef.",
      zhs: "内容与标准款相同，牛肉升级为尊享神户牛。",
      zht: "內容與標準款相同，牛肉升級為尊享神戶牛。",
      ko: "스탠다드와 동일한 구성, 프리미엄 고베규로 업그레이드.",
      id: "Sama seperti Standard, ditingkatkan ke Kobe Beef premium."
    },
    rows: [
      "Kobe Beef Hassun — Seasonal Appetizers",
      "Chilled Tofu",
      "Kobe Beef Sukiyaki (thin-sliced)",
      "Kobe Beef Fillet Steak 100g",
      "Kobe Beef Spring Roll",
      "Kobe Beef Nikuzushi & Steak Hand Roll (20g)",
      "Aka-dashi Miso Soup — Shijimi · Bite-Size Kobe Beef Gyudon · Matcha & Sweets"
    ]
  }
];

module.exports = {
  themes: THEMES,
  langs: ["en", "zhs", "zht", "ko", "id"],
  cats: CATS,
  list: LIST,
  meta: META,
  order: [
    "sushi-wagyu-light", "sushi-wagyu-standard", "sushi-kobe-premium", "sushi-wagyu-lunch",
    "sushi-standard", "sushi-premium", "wagyu-standard", "kobe-premium"
  ]
};
