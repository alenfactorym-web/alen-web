export const dynamic = "force-dynamic";

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";

export default async function NewsArticlePage({ params, searchParams }) {
  const p = await Promise.resolve(params);
  const slug = typeof p?.slug === "string" ? p.slug : Array.isArray(p?.slug) ? p.slug.join("/") : "";

  const sp = await Promise.resolve(searchParams);
  const langRaw = (sp?.lang || "en").toString().toLowerCase();
  const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";

  const query = /* groq */ `
    *[_type=="news" && slug.current == $slug][0]{
      _id,
      "slug": slug.current,
      "date": coalesce(publishDate, publishedAt, _createdAt),
      "title": coalesce(title[$lang], title.en, title),
      "excerpt": coalesce(excerpt[$lang], excerpt.en, excerpt),
      "content": coalesce(content[$lang], content.en, content),
      "image": coverImage.asset->url
    }
  `;

  const article = await client.fetch(query, { slug, lang });

  if (!article?._id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-3 font-sans">404</h1>
          <Link href={`/news?lang=${lang}`} className="underline text-sm font-sans">Back to News</Link>
        </div>
      </main>
    );
  }

  const navQuery = /* groq */ `
    {
      "prev": *[_type=="news" && slug.current != $slug && coalesce(publishDate, publishedAt, _createdAt) < $date] | order(coalesce(publishDate, publishedAt, _createdAt) desc)[0]{ "slug": slug.current, "title": coalesce(title[$lang], title.en, title) },
      "next": *[_type=="news" && slug.current != $slug && coalesce(publishDate, publishedAt, _createdAt) > $date] | order(coalesce(publishDate, publishedAt, _createdAt) asc)[0]{ "slug": slug.current, "title": coalesce(title[$lang], title.en, title) }
    }
  `;
  const nav = await client.fetch(navQuery, { slug: article.slug, date: article.date, lang });

  const isRTL = lang === "ar" || lang === "ku";

  // ✅ منطق انتخاب فونت بر اساس زبان
  const getTitleClass = () => {
    if (lang === "ar") return "font-ar-title";
    if (lang === "ku") return "ku-title";
    return "font-bold font-sans";


  };

  const getBodyClass = () => {
  if (lang === "ar") return "font-ar-body";
  if (lang === "ku") return "ku-body";
  return "font-en-body"; // ✅ این مهمه
};


  return (
    <main
    className="relative min-h-screen py-20 bg-transparent overflow-hidden isolate"
      dir={isRTL ? "rtl" : "ltr"}
         >
      <article className="w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] relative z-10">
        
        {/* تصویر شاخص */}
        <div className="group relative aspect-video mt-8 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
          <img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/25" />
        </div>

        {/* هدر خبر */}
        <header className="mt-12 mb-8">
          <h1 className={`${getTitleClass()} text-3xl md:text-3xl text-zinc-600 mb-6 leading-[1.2]`}>
            {article.title}
          </h1>

          {article.date && (
            <div className="mb-6 text-zinc-600 text-base font-bold font-sans">

              {new Date(article.date).toLocaleDateString(lang === "en" ? "en-US" : "ar-EG")}
            </div>
          )}

          {article.excerpt && (
            <p className={`${getBodyClass()} text-xl md:text-2xl text-zinc-500 leading-relaxed`}>
              {article.excerpt}
            </p>
          )}
        </header>

        {/* بدنه اصلی خبر (اصلاح شده و یکپارچه) */}
        {article.content && (
          <div
  className={`news-body prose prose-lg max-w-none text-zinc-600
  ${isRTL ? "text-right" : "text-left"}
  ${getBodyClass()}`}
>
  {Array.isArray(article.content) ? (
    <PortableText value={article.content} />
  ) : (
    <p>{String(article.content)}</p>
  )}
</div>

        )}

        {/* دکمه‌های ناوبری */}
        <div className={`mt-10 flex items-center justify-between gap-3 ${getTitleClass()}`}>
          <Link
            href={`/news?lang=${lang}`}
            className="rounded-full border bg-white/90 px-6 py-3 text-sm font-bold text-zinc-500 hover:bg-white shadow-sm transition-transform active:scale-95"
          >
            {lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back"}
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={nav?.prev?.slug ? `/news/${nav.prev.slug}?lang=${lang}` : "#"}
              className={`rounded-full border px-6 py-3 text-sm font-bold shadow-sm ${!nav?.prev?.slug ? 'bg-white/50 text-zinc-300 cursor-not-allowed' : 'bg-white/90 text-zinc-500 hover:bg-white           active:scale-95 transition-all'}`}
            >
              {lang === "ar" ? "السابق" : lang === "ku" ? "پێشوو" : "Prev"}
            </Link>

            <Link
              href={nav?.next?.slug ? `/news/${nav.next.slug}?lang=${lang}` : "#"}
              className={`rounded-full border px-6 py-3 text-sm font-bold shadow-sm ${!nav?.next?.slug ? 'bg-white/50 text-zinc-300 cursor-not-allowed' : 'bg-white/90 text-zinc-500 hover:bg-white active:scale-95 transition-all'}`}
            >
              {lang === "ar" ? "التالي" : lang === "ku" ? "داهاتوو" : "Next"}
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}