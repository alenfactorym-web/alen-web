export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import VideosClient from "./VideosClient";

export default async function VideosPage({ searchParams }) {
  const sp = await Promise.resolve(searchParams);

  const langRaw = (sp?.lang || "en").toString().toLowerCase();
  const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";

  const pageRaw = (sp?.page || "1").toString();
  const page = Math.max(1, parseInt(pageRaw, 10) || 1);

  const PER_PAGE = 9;
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  // ✅ 1) گرفتن featuredVideo _id
  const featuredIdQuery = /* groq */ `
    *[_type=="videoSettings"][0].featuredVideo._ref
  `;
  const featuredId = await client.fetch(featuredIdQuery);

  // ✅ 2) total بدون featured
  const totalQuery = /* groq */ `
    count(*[_type=="video" && _id != $featuredId])
  `;
  const total = await client.fetch(totalQuery, { featuredId });

  const totalPages = Math.max(1, Math.ceil((total || 0) / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const safeStart = (safePage - 1) * PER_PAGE;
  const safeEnd = safeStart + PER_PAGE;

  // ✅ 3) لیست 9تایی بدون featured
  const listQuery = /* groq */ `
    *[_type=="video" && _id != $featuredId]
      | order(coalesce(publishDate, publishedAt, _createdAt) desc)
      [${safeStart}...${safeEnd}]{
        _id,
        "title": coalesce(title[$lang], title.en, title),
        "image": coalesce(coverImage.asset->url, thumbnail.asset->url),
        "date": coalesce(publishDate, publishedAt, _createdAt),
        source,
        youtubeUrl,
        "videoUrl": videoFile.asset->url
      }
  `;

  const list = await client.fetch(listQuery, { lang, featuredId });

  return (
    <VideosClient
      list={list || []}
      lang={lang}
      page={safePage}
      totalPages={totalPages}
    />
  );
}

