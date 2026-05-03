export const brandThemes = {
  alen: {
    key: "alen",
    accent: "#facc15",
    accentSoft: "rgba(250, 204, 21, 0.18)",
    dark: "#111111",
    text: "#171717",
    muted: "#71717a",
    cardAccent: "#facc15",
    productsNavStyle: "cylinder",
  },

 alshafi: {
  key: "alshafi",
  accent: "#c99a3a",
  accentSoft: "rgba(201, 154, 58, 0.18)",
  dark: "#070707",
  text: "#111111",
  muted: "#525252",
  cardAccent: "#070707",
  productsNavStyle: "tabs",
  sectionArc: "line",
   headerLogoClassName: "scale-[1.55]",
   headerLogoGap: "28px",
   headerOnLightText: "#111111",
   headerActiveBg: "rgba(201, 154, 58, 0.32)",
   headerActiveText: "#070707",
   headerHoverBg: "rgba(201,154,58,0.08)",

productsBackground: {
  type: "split",
  light: "#ffffff",
  dark: ["#070707", "#0e0e0e"],
  splitAt: "66%",
},
  products: {
    slogan: {
      en: "PREMIUM QUALITY SPICES",
      ar: "بهارات عالية الجودة",
      ku: "بەهاراتی کوالیتی بەرز",
    },
subtitle: {
  en: "Browse ALSHAFI product categories.",
  ar: "اختر فئات منتجات الشافي",
  ku: "پۆلەکانی بەرهەمەکانی ئەلشافی هەڵبژێرە",
},
    description: {
      en: "Natural flavors crafted for everyone",
      ar: "نكهات طبيعية مميزة لكل الأذواق",
      ku: "تامە سروشتییە تایبەتەکان بۆ هەموو کەس",
    },
  },
},
};

export function getBrandTheme(brand) {
  return brandThemes?.[brand] || brandThemes.alen;
}