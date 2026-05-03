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

function makeSlug(input) {
  return (input || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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

async function uploadImageIfExists(file) {
  if (!file || typeof file === "string") return null;
  if (!(file instanceof File)) return null;
  if (file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const asset = await client.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  });

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandSlug = String(searchParams.get("brand") || "").trim();
    const normalizedBrand = normalizeBrandKey(brandSlug);
    const aliases = BRAND_ALIASES[normalizedBrand] || [normalizedBrand];

    const matchedBrand = brandSlug
      ? await client.fetch(
          `
          *[_type == "brand"]{
            _id,
            "slugValue": slug.current,
            "title_en": coalesce(title.en, "")
          }
          `,
          {}
        )
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
        *[_type == "news" && references($brandId)]
        | order(coalesce(publishDate, _createdAt) desc) {
          _id,
          publishDate,
          "slugValue": slug.current,
          "brandId": brand->_id,
          "brandSlugValue": brand->slug.current,
          "brandTitle_en": coalesce(brand->title.en, ""),
          "brandTitle_ar": coalesce(brand->title.ar, ""),
          "brandTitle_ku": coalesce(brand->title.ku, ""),
          "title_en": coalesce(title.en, ""),
          "title_ar": coalesce(title.ar, ""),
          "title_ku": coalesce(title.ku, ""),
          "excerpt_en": coalesce(excerpt.en, ""),
          "excerpt_ar": coalesce(excerpt.ar, ""),
          "excerpt_ku": coalesce(excerpt.ku, ""),
          "coverImageUrl": coverImage.asset->url
        }
      `
      : `
        *[_type == "news"]
        | order(coalesce(publishDate, _createdAt) desc) {
          _id,
          publishDate,
          "slugValue": slug.current,
          "brandId": brand->_id,
          "brandSlugValue": brand->slug.current,
          "brandTitle_en": coalesce(brand->title.en, ""),
          "brandTitle_ar": coalesce(brand->title.ar, ""),
          "brandTitle_ku": coalesce(brand->title.ku, ""),
          "title_en": coalesce(title.en, ""),
          "title_ar": coalesce(title.ar, ""),
          "title_ku": coalesce(title.ku, ""),
          "excerpt_en": coalesce(excerpt.en, ""),
          "excerpt_ar": coalesce(excerpt.ar, ""),
          "excerpt_ku": coalesce(excerpt.ku, ""),
          "coverImageUrl": coverImage.asset->url
        }
      `;

    const news = await client.fetch(query, brandId ? { brandId } : {});

    return NextResponse.json(Array.isArray(news) ? news : []);
  } catch (error) {
    console.error("ADMIN NEWS GET ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to load news.",
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

    const excerpt = {
      en: String(formData.get("excerpt_en") || ""),
      ar: String(formData.get("excerpt_ar") || ""),
      ku: String(formData.get("excerpt_ku") || ""),
    };

    const publishDate = String(formData.get("publishDate") || "");
    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    const doc = await client.create({
      _type: "news",
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      title,
      excerpt,
      content: {
        en: [],
        ar: [],
        ku: [],
      },
      featured: false,
      publishDate: toPublishDate(publishDate),
      slug: {
        _type: "slug",
        current: makeSlug(title.en),
      },
      ...(coverImage ? { coverImage } : {}),
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN NEWS POST ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to create news.",
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
        { ok: false, message: "News id is required." },
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

    const excerpt = {
      en: String(formData.get("excerpt_en") || ""),
      ar: String(formData.get("excerpt_ar") || ""),
      ku: String(formData.get("excerpt_ku") || ""),
    };

    const publishDate = String(formData.get("publishDate") || "");
    const removeCoverImage =
      String(formData.get("removeCoverImage") || "false") === "true";

    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    let patch = client.patch(id).set({
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      title,
      excerpt,
      featured: false,
      publishDate: toPublishDate(publishDate),
      slug: {
        _type: "slug",
        current: makeSlug(title.en),
      },
    });

    if (coverImage) {
      patch = patch.set({ coverImage });
    } else if (removeCoverImage) {
      patch = patch.unset(["coverImage"]);
    }

    const doc = await patch.commit();

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN NEWS PUT ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to update news.",
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
        { ok: false, message: "News id is required." },
        { status: 400 }
      );
    }

    await client.delete(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN NEWS DELETE ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to delete news." },
      { status: 500 }
    );
  }
}

