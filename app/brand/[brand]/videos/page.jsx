export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import VideosClient from "./VideosClient";
import AlshafiVideosClient from "@/components/brands/alshafi/video/AlshafiVideosClient";

export default async function BrandVideosPage({ params, searchParams }) {
  const p = await Promise.resolve(params);
  const sp = await Promise.resolve(searchParams);

  const brand = String(p?.brand || "").toLowerCase();

  const langRaw = (sp?.lang || "en").toString().toLowerCase();
  const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";

  const pageRaw = (sp?.page || "1").toString();
  const page = Math.max(1, parseInt(pageRaw, 10) || 1);

  const PER_PAGE = 9;

  const totalQuery = /* groq */ `
    count(*[
      _type=="video" &&
      brand->slug.current == $brand
    ])
  `;

  const total = await client.fetch(totalQuery, { brand });

  const totalPages = Math.max(1, Math.ceil((total || 0) / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const safeStart = (safePage - 1) * PER_PAGE;
  const safeEnd = safeStart + PER_PAGE;

  const listQuery = /* groq */ `
    *[
      _type=="video" &&
      brand->slug.current == $brand
    ]
      | order(coalesce(publishDate, publishedAt, date, _createdAt) desc)
      [${safeStart}...${safeEnd}]{
        _id,
        "title": coalesce(title[$lang], title.en, title),
        "image": coalesce(coverImage.asset->url, thumbnail.asset->url),
        "date": coalesce(publishDate, publishedAt, date, _createdAt),
        source,
        youtubeUrl,
        "videoUrl": videoFile.asset->url
      }
  `;

  const list = await client.fetch(listQuery, { lang, brand });

  const props = {
    list: list || [],
    lang,
    page: safePage,
    totalPages,
  };

  if (brand === "alshafi") {
    return <AlshafiVideosClient {...props} />;
  }

  if (brand === "alen") {
    return <VideosClient {...props} />;
  }

  notFound();
}