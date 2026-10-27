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

    headerChip: {
      bg: "bg-white/35",
      text: "text-[#111111]",
      border: "border-white/40",
      hover: "hover:bg-white/50",

      activeBg: "bg-[#c99a3a]/35",
      activeText: "text-[#070707]",
      activeBorder: "border-[#f0cf7a]/60",
    },

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

  "goly-rozh": {
    key: "goly-rozh",
    accent: "#facc15",
    accentSoft: "rgba(250, 204, 21, 0.18)",
    dark: "#8f0e18",
    text: "#231f20",
    muted: "#686365",
    cardAccent: "#a81720",
    productsNavStyle: "tabs",

   headerChip: {
  bg: "bg-[#fff8f0]/90",
  text: "text-[#7f1119]",
  border: "border-white/40",
  hover: "hover:bg-white",

  activeBg: "bg-white",
  activeText: "text-[#a81720]",
  activeBorder: "border-[#facc15]/70",
},

    headerLogoClassName: "scale-[1.55]",
    headerLogoGap: "28px",
    headerOnLightText: "#7f1119",
    headerActiveBg: "#ffffff",
       headerActiveText: "#a81720",
  },
};

export function getBrandTheme(brand) {
  return brandThemes?.[brand] || brandThemes.alen;
}