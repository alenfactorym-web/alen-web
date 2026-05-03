export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const langRaw = (searchParams.get("lang") || "en").toLowerCase();
  const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";

 const query = /* groq */ `
{
  "list": *[_type == "news"]
  | order(coalesce(publishDate, publishedAt, _createdAt) desc)[0..2]{
      _id,
      "slug": slug.current,
      "date": coalesce(publishDate, publishedAt, _createdAt),
      "image": coverImage.asset->url,

      "title": select(
        $lang == "ar" => coalesce(title.ar, title.en),
        $lang == "ku" => coalesce(title.ku, title.en),
        coalesce(title.en, title.ar, title.ku)
      ),

      "excerpt": select(
        $lang == "ar" => coalesce(excerpt.ar, excerpt.en),
        $lang == "ku" => coalesce(excerpt.ku, excerpt.en),
        coalesce(excerpt.en, excerpt.ar, excerpt.ku)
      )
    }
  }
  `;

  try {
  const data = await client.fetch(query, { lang });

    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

