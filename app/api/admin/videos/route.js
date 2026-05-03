import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId:
    process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:
    process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    process.env.SANITY_API_VERSION ||
    "2026-01-26",
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
useCdn: false,
});

function normalizeBrandKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

const BRAND_ALIASES = {
  alen: ["alen", "alen-factory", "alenfactory"],
  alshafi: ["alshafi", "al-shafi"],
  "goly-rozh": ["goly-rozh", "goly-rozhh", "golyrozh", "goly rozh"],
  "goli-alen": ["goli-alen", "golialen", "goli alen"],
  "alen-plus": ["alen-plus", "alenplus", "alen plus"],
};

function toPublishDate(dateOnlyValue) {
  const value = String(dateOnlyValue || "").trim();
  if (!value) return new Date().toISOString();

  const now = new Date();
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date().toISOString();
  }

  const localDateTime = new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );

  return localDateTime.toISOString();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandSlug = String(searchParams.get("brand") || "").trim();
    const normalizedBrand = normalizeBrandKey(brandSlug);
    const aliases = BRAND_ALIASES[normalizedBrand] || [normalizedBrand];

    const matchedBrand = brandSlug
      ? await client.fetch(`
          *[_type == "brand"]{
            _id,
            "slugValue": slug.current,
            "title_en": coalesce(title.en, "")
          }
        `)
      : [];

    const brandMatch = Array.isArray(matchedBrand)
      ? matchedBrand.find((item) => {
          const slugKey = normalizeBrandKey(item?.slugValue);
          const titleEnKey = normalizeBrandKey(item?.title_en);
          return aliases.includes(slugKey) || aliases.includes(titleEnKey);
        })
      : null;

    const brandId = brandMatch?._id || null;

    const query = brandId
      ? `
        *[_type == "video" && references($brandId)]
        | order(coalesce(date, _createdAt) desc) {
          _id,
          date,
          youtubeUrl,
          "brandId": brand->_id,
          "title_en": coalesce(title.en, ""),
          "title_ar": coalesce(title.ar, ""),
          "title_ku": coalesce(title.ku, ""),
          "thumbnailUrl": thumbnail.asset->url
        }
      `
      : `
        *[_type == "video"]
        | order(coalesce(date, _createdAt) desc) {
          _id,
          date,
          youtubeUrl,
          "brandId": brand->_id,
          "title_en": coalesce(title.en, ""),
          "title_ar": coalesce(title.ar, ""),
          "title_ku": coalesce(title.ku, ""),
          "thumbnailUrl": thumbnail.asset->url
        }
      `;

    const videos = await client.fetch(query, brandId ? { brandId } : {});
    return NextResponse.json(Array.isArray(videos) ? videos : []);
  } catch (error) {
    console.error("ADMIN VIDEOS GET ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to load videos.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const brandId = String(formData.get("brandId") || "");
    if (!brandId) {
      return NextResponse.json(
        { ok: false, message: "Brand is required." },
        { status: 400 }
      );
    }

    const title = {
      en: String(formData.get("title_en") || ""),
      ar: String(formData.get("title_ar") || ""),
      ku: String(formData.get("title_ku") || ""),
    };

    const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();
    const date = String(formData.get("date") || "").trim();

    if (!youtubeUrl) {
      return NextResponse.json(
        { ok: false, message: "YouTube URL is required." },
        { status: 400 }
      );
    }

    const doc = await client.create({
      _type: "video",
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      title,
      youtubeUrl,
      date: toPublishDate(date),
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN VIDEOS POST ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to create video.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();

    const id = String(formData.get("id") || "");
    const brandId = String(formData.get("brandId") || "");

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Video id is required." },
        { status: 400 }
      );
    }

    if (!brandId) {
      return NextResponse.json(
        { ok: false, message: "Brand is required." },
        { status: 400 }
      );
    }

    const title = {
      en: String(formData.get("title_en") || ""),
      ar: String(formData.get("title_ar") || ""),
      ku: String(formData.get("title_ku") || ""),
    };

    const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();
    const date = String(formData.get("date") || "").trim();

    if (!youtubeUrl) {
      return NextResponse.json(
        { ok: false, message: "YouTube URL is required." },
        { status: 400 }
      );
    }

    const doc = await client
      .patch(id)
      .set({
        brand: {
          _type: "reference",
          _ref: brandId,
        },
        title,
        youtubeUrl,
        date: toPublishDate(date),
      })
      .commit();

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN VIDEOS PUT ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to update video.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    if (!body?.id) {
      return NextResponse.json(
        { ok: false, message: "Video id is required." },
        { status: 400 }
      );
    }

    await client.delete(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN VIDEOS DELETE ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to delete video." },
      { status: 500 }
    );
  }
}

