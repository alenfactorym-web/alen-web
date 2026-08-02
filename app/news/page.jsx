export const dynamic = "force-dynamic";

import Link from "next/link";
import { client } from "@/sanity/lib/client";

export default async function NewsIndexPage({ searchParams }) {
  const params = await Promise.resolve(searchParams);

  const langRaw = (params?.lang || "en").toString().toLowerCase();
  const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";

  // ✅ pagination
  const pageRaw = (params?.page || "1").toString();
  const page = Math.max(1, parseInt(pageRaw, 10) || 1);

  const PER_PAGE = 9;
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  // ✅ total + items (9تایی)
  const query = /* groq */ `
    {
      "total": count(*[_type=="news"]),
      "items": *[_type=="news"] | order(coalesce(publishDate, publishedAt, _createdAt) desc)
        [${start}...${end}]{
          _id,
          "title": select(
            $lang == "ar" => title.ar,
            $lang == "ku" => title.ku,
            title.en
          ),
          "slug": slug.current,
          "image": coverImage.asset->url
        }
    }
  `;

  const data = await client.fetch(query, { lang });

  const total = data?.total || 0;
  const list = data?.items || [];
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  // ✅ اگر page خارج از رنج بود، همون امن رو در لینک‌ها استفاده می‌کنیم
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const prevPage = safePage > 1 ? safePage - 1 : null;
  const nextPage = safePage < totalPages ? safePage + 1 : null;

  return (
    <main
      className={`relative min-h-screen bg-transparent overflow-hidden isolate ${uiFont}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
     

<div className="relative w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] py-16">
        {/* ✅ Title + Yellow Arc (centered like home) */}
        <div className="flex flex-col items-center text-center mb-10">
  <h1
    key={`news-title-${lang}`}  // ✅ با تغییر زبان ریست میشه
    className="text-4xl md:text-5xl font-black text-zinc-500 news-title-anim"
  >
    {lang === "ar" ? "الأخبار" : lang === "ku" ? "هەواڵ" : "News"}
  </h1>

  <svg
    key={`news-arc-${lang}`} // ✅ با تغییر زبان ریست میشه
    className="mt-3 text-yellow-500 max-w-[220px] mx-auto"
    width="220"
    height="20"
    viewBox="0 0 220 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      className="news-arc-anim"
      d="M20 10 C 60 2, 160 2, 200 10"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
</div>

       <div
  className="
  alen-laptop-grid-3
  alen-news-grid
  grid grid-cols-1 md:grid-cols-3
  gap-4 md:gap-4 lg:gap-4 xl:gap-4
  max-w-[1100px] 2xl:max-w-[1400px]
  mx-auto
"
>
          {list.map((n) => (
            <Link
              key={n._id}
              href={`/news/${n.slug}?lang=${lang}`}
              className="group block overflow-hidden rounded-3xl bg-white backdrop-blur-xl
border border-black/10 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)]
hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.85)]
border-b-[8px] border-b-yellow-400 transition-transform duration-300 hover:-translate-y-1 hover:scale-[0.97]"
            >
              <div className="relative aspect-[16/9] bg-zinc-200">
                {n.image && (
                  <img
                    src={n.image}
                    alt={n.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-6">
                <div
                  className={`font-black text-zinc-500 text-[13px] leading-tight line-clamp-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {n.title || "Untitled"}
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-xs font-black text-yellow-500 group-hover:text-yellow-600">
                  {lang === "ar"
                    ? "اقرأ المزيد"
                    : lang === "ku"
                    ? "زیاتر بخوێنە"
                    : "Read more"}
                  <span className={isRTL ? "rotate-180" : ""}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ✅ دکمه‌های پایین: Back + Prev/Next (فقط صفحه‌ها) */}
        <div
 className={`
  alen-laptop-wrap-1088
  mt-10
  max-w-[1100px] 2xl:max-w-[1400px]
  mx-auto
  flex items-center justify-between gap-3
  px-2 lg:px-0
  ${uiFont}
`}
>
          {/* Back → Home News section */}
          <Link
            href={`/?lang=${lang}#news`}
            className="rounded-full border bg-white/90 px-6 py-3 text-sm font-bold text-zinc-500 hover:bg-white shadow-sm transition-transform active:scale-95"
          >
            {lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back"}
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={prevPage ? `/news?lang=${lang}&page=${prevPage}` : "#"}
              className={`rounded-full border px-6 py-3 text-sm font-bold shadow-sm ${
                !prevPage
                  ? "bg-white/50 text-zinc-300 cursor-not-allowed pointer-events-none"
                  : "bg-white/90 text-zinc-500 hover:bg-white active:scale-95 transition-all"
              }`}
            >
              {lang === "ar" ? "السابق" : lang === "ku" ? "پێشوو" : "Prev"}
            </Link>

            <Link
              href={nextPage ? `/news?lang=${lang}&page=${nextPage}` : "#"}
              className={`rounded-full border px-6 py-3 text-sm font-bold shadow-sm ${
                !nextPage
                  ? "bg-white/50 text-zinc-300 cursor-not-allowed pointer-events-none"
                  : "bg-white/90 text-zinc-500 hover:bg-white active:scale-95 transition-all"
              }`}
            >
              {lang === "ar" ? "التالي" : lang === "ku" ? "داهاتوو" : "Next"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

