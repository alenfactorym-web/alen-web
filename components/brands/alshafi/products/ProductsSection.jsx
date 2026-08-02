import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";
import styles from "./ProductsSection.module.css";

function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

function getCardClass(slug) {
  const map = {
    spices:
      "lg:col-span-2 lg:h-[220px] xl:col-span-2 xl:h-[260px] 2xl:col-span-3 2xl:h-[320px]",

    "pasta-assistants":
      "lg:col-span-2 lg:h-[220px] xl:col-span-2 xl:h-[260px] 2xl:col-span-3 2xl:h-[320px]",

    dessert:
      "lg:col-span-1 lg:h-[220px] xl:col-span-1 xl:h-[260px] 2xl:col-span-2 2xl:h-[320px]",

    "sauce-ketchup":
      "lg:col-span-2 lg:h-[220px] xl:col-span-2 xl:h-[260px] 2xl:col-span-3 2xl:h-[320px]",

    "sauce-and-ketchup":
      "lg:col-span-2 lg:h-[220px] xl:col-span-2 xl:h-[260px] 2xl:col-span-3 2xl:h-[320px]",

    "bouillon-soup":
      "lg:col-span-1 lg:h-[220px] xl:col-span-1 xl:h-[260px] 2xl:col-span-1 2xl:h-[320px]",

    "bouillon-and-soup":
      "lg:col-span-1 lg:h-[220px] xl:col-span-1 xl:h-[260px] 2xl:col-span-1 2xl:h-[320px]",

    liquids:
      "lg:col-span-2 lg:h-[220px] xl:col-span-2 xl:h-[260px] 2xl:col-span-3 2xl:h-[320px]",

    "salt-sumac":
      "lg:col-span-1 lg:h-[220px] xl:col-span-1 xl:h-[260px] 2xl:col-span-1 2xl:h-[320px]",

    vinegar:
      "lg:col-span-2 lg:h-[220px] xl:col-span-2 xl:h-[260px] 2xl:col-span-2 2xl:h-[320px]",
  };
  return (
    map[slug] ||
    "lg:col-span-1 lg:h-[220px] xl:col-span-1 xl:h-[260px] 2xl:col-span-1 2xl:h-[320px]"
  );
}
function AnimatedLetters({ text, lang }) {
  if (lang !== "en") return <>{text}</>;

  return (
    <span className="alshafi-letter-wave">
      {String(text).split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="alshafi-letter"
          style={{ animationDelay: `${i * 0.09}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
export default async function ProductsSection({ brand = "alshafi", lang = "en" }) {
 const categories = await client.fetch(
  `
    *[
      _type == "category" &&
      brand->slug.current == $brand &&
      coalesce(isActive, true) == true
    ]
    | order(coalesce(order, 999999) asc, _createdAt asc) {
      _id,
      "slug": slug.current,
      title,
      "image": select(
        slug.current == "spices" => "/alshafi-category-pics/spices-cover-001.webp",
        slug.current == "pasta-assistants" => "/alshafi-category-pics/pasta-cover-001.webp",
        slug.current == "dessert" => "/alshafi-category-pics/dessert-cover-001.webp",
        slug.current == "sauce-ketchup" => "/alshafi-category-pics/ketchup-cover-001.webp",
        slug.current == "sauce-and-ketchup" => "/alshafi-category-pics/ketchup-cover-001.webp",
        slug.current == "bouillon-soup" => "/alshafi-category-pics/bouillon-cover-001.webp",
        slug.current == "bouillon-and-soup" => "/alshafi-category-pics/bouillon-cover-001.webp",
        slug.current == "liquids" => "/alshafi-category-pics/liquids-cover-002.webp",
        slug.current == "salt-and-sumac" => "/alshafi-category-pics/salt-cover-001.webp",
        slug.current == "vinegar" => "/alshafi-category-pics/vinegar-cover-001.webp",
        coverImage.asset->url
      ),

      "hasProductGroups": count(*[
        _type == "productGroup" &&
        category._ref == ^._id &&
        coalesce(isActive, true) == true
      ]) > 0,

      "hasPackaging": count(*[
        _type == "packaging" &&
        category._ref == ^._id &&
        coalesce(isActive, true) == true
      ]) > 0,

      "hasDirectProducts": count(*[
        _type == "product" &&
        category._ref == ^._id &&
        !defined(productGroup) &&
        !defined(packaging) &&
        coalesce(isActive, true) == true
      ]) > 0,

      order
    }
  `,
  { brand }
);

const isRTL = lang === "ar" || lang === "ku";
const titleFont =
  lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

const bodyFont =
  lang === "ar" ? "font-ar-body" : lang === "ku" ? "ku-title" : "";

const cardFont =
  lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const copy =
    {
      en: {
        eyebrow: "EXPLORE",
        titleTop: "ALSHAFI",
        titleBottom: "COLLECTION",
        desc: "Discover our premium product categories crafted for exceptional taste and quality.",
        explore: "Explore",
        featureOne: "PREMIUM QUALITY",
        featureOneDesc: "Carefully selected ingredients",
        featureTwo: "NATURAL & AUTHENTIC",
        featureTwoDesc: "Crafted for exceptional taste",
      },
      ar: {
        eyebrow: "استكشف",
        titleTop: "الشافي",
        titleBottom: "المجموعة",
        desc: "اكتشف فئات منتجاتنا المميزة المصممة لمذاق استثنائي وجودة عالية",
        explore: "استكشف",
        featureOne: "جودة فاخرة",
        featureOneDesc: "مكونات مختارة بعناية",
        featureTwo: "طبيعي وأصيل",
        featureTwoDesc: "مصمم لمذاق استثنائي",
      },
      ku: {
        eyebrow: "بگەڕێ",
        titleTop: "ئەشفی",
        titleBottom: "کۆمەڵە",
        desc: "پۆلەکانی بەرهەمە تایبەتەکانمان بدۆزەرەوە، دروستکراو بۆ تام و کوالیتییەکی بەرز",
        explore: "بگەڕێ",
        featureOne: "کوالیتی بەرز",
        featureOneDesc: "پێکهاتەی بە وردی هەڵبژێردراو",
        featureTwo: "سروشتی و ڕەسەن",
        featureTwoDesc: "دروستکراو بۆ تامێکی تایبەت",
      },
    }[lang] || {
      eyebrow: "EXPLORE",
      titleTop: "ALSHAFI",
      titleBottom: "COLLECTION",
      desc: "Discover our premium product categories crafted for exceptional taste and quality",
      explore: "Explore",
      featureOne: "PREMIUM QUALITY",
      featureOneDesc: "Carefully selected ingredients",
      featureTwo: "NATURAL & AUTHENTIC",
      featureTwoDesc: "Crafted for exceptional taste",
    };

  return (
    <section id="products" className={`${styles.productsSection} relative px-4 py-24 sm:px-6 lg:py-45`}>
      <div className="mx-auto flex w-full max-w-[1780px] flex-col gap-10 px-6 lg:flex-row lg:gap-10 xl:gap-10">
      <AlshafiSectionHeading
  className={`alshafi-products-heading ${titleFont}`}
  eyebrow={copy.eyebrow}
  titleTop={copy.titleTop}
  bottomTitle={copy.titleBottom}
  desc={copy.desc}
  featureOne={copy.featureOne}
  featureOneDesc={copy.featureOneDesc}
  featureTwo={copy.featureTwo}
  featureTwoDesc={copy.featureTwoDesc}
  imageSrc="/A-spices-vector-001.webp"
  animateLetters={lang === "en"}
/>

<div className="alshafi-products-wrap min-w-0 flex-1 lg:ml-1 lg:origin-top-left">
         <div className="alshafi-products-grid grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-auto lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6">
{(Array.isArray(categories) ? categories : []).map((cat, index) => {
  const label = capitalize(pickLang(cat.title, lang));

  const categoryHref =
    !cat.hasProductGroups &&
    !cat.hasPackaging &&
    cat.hasDirectProducts
      ? `/brand/${brand}/products/${cat.slug}/direct?lang=${lang}&page=1`
      : `/brand/${brand}/products/${cat.slug}?lang=${lang}`;

  return (
    <Link
      key={cat._id}
      href={categoryHref}
      className={`alshafi-cat-${cat.slug} group relative overflow-hidden rounded-[28px] border border-[#c99a3a]/35 bg-[#111] shadow-[0_28px_80px_-45px_rgba(201,154,58,0.35)] ${getCardClass(cat.slug)}`}
    >                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#c99a3a]/60">
                      NO IMAGE
                    </div>
                  )}

                  

                  <div className="absolute bottom-6 left-6 right-6">

                   <h3 className={`flex items-center gap-3 text-lg xl:text-lg 2xl:text-2xl font-semibold leading-tight text-white ${cardFont}`}>
  <span>{label}</span>

  <span className="text-sm text-[#c99a3a] transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</h3>

                                     </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}