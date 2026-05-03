import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/shorts/")[1] || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export async function GET(req) {
  const url = new URL(req.url);

  const langRaw = (url.searchParams.get("lang") || "en").toString().toLowerCase();
  const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";
  const brandRaw = String(url.searchParams.get("brand") || "").trim().toLowerCase();

  const featuredQuery = /* groq */ `
    *[_type=="videoSettings"][0]{
      featuredVideo->{
        _id,
        "title": coalesce(title[$lang], title.en),
        brand,
        source,
        youtubeUrl,
        "fileUrl": videoFile.asset->url,
        "date": coalesce(date, _createdAt),
        "image": thumbnail.asset->url
      }
    }
  `;

  const listQuery = /* groq */ `
    *[
      _type == "video" &&
      (
        !defined($brand) ||
        $brand == "" ||
        brand->slug.current == $brand
      )
    ] | order(coalesce(date, _createdAt) desc){
      _id,
      "title": coalesce(title[$lang], title.en),
      brand,
      source,
      youtubeUrl,
      "fileUrl": videoFile.asset->url,
      "date": coalesce(date, _createdAt),
      "image": thumbnail.asset->url
    }
  `;

 const [featuredWrap, list] = await Promise.all([
  client.fetch(featuredQuery, { lang }),
  client.fetch(listQuery, { lang, brand: brandRaw || "" }),
]);

  const featuredRaw = featuredWrap?.featuredVideo || null;

  const featured = featuredRaw
  ? {
      ...featuredRaw,
      videoUrl: featuredRaw.fileUrl || null,
      resolvedVideoUrl:
        featuredRaw.fileUrl ||
        featuredRaw.youtubeUrl ||
        null,
      image:
        featuredRaw.image ||
        (featuredRaw.youtubeUrl ? getYouTubeThumb(featuredRaw.youtubeUrl) : null),
    }
  : null;

 const normalizedList = (list || []).map((v) => ({
  ...v,
  videoUrl: v.fileUrl || null,
  resolvedVideoUrl: v.source === "upload" ? v.fileUrl : v.youtubeUrl,
  image: v.image || null,
  youtubeThumb: v.youtubeUrl ? getYouTubeThumb(v.youtubeUrl) : null,
}));
  const filteredList =
    featured?._id ? normalizedList.filter((v) => v._id !== featured._id) : normalizedList;

  return NextResponse.json({
    featured,
    list: filteredList,
  });
}

