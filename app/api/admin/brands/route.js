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

export async function GET() {
  try {
    const brands = await client.fetch(`
      *[_type == "brand"] | order(coalesce(order, 9999) asc, _createdAt desc) {
        _id,
        order,
        isActive,
        color,
        slug,
        "slugValue": slug.current,
        title,
        "title_en": coalesce(title.en, ""),
        "title_ar": coalesce(title.ar, ""),
        "title_ku": coalesce(title.ku, ""),
        "logoUrl": logo.asset->url
      }
    `);

    return NextResponse.json(brands);
  } catch (error) {
    console.error("ADMIN BRANDS GET ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to load brands." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = {
      en: String(formData.get("title_en") || ""),
      ar: String(formData.get("title_ar") || ""),
      ku: String(formData.get("title_ku") || ""),
    };

    const color = String(formData.get("color") || "");

    const currentMaxOrder = await client.fetch(`
      coalesce(
        *[_type == "brand" && defined(order)] | order(order desc)[0].order,
        -1
      )
    `);

    const logoImage = await uploadImageIfExists(formData.get("logo"));

    const doc = await client.create({
      _type: "brand",
      title,
      slug: {
        _type: "slug",
        current: makeSlug(title.en),
      },
      color,
      isActive: true,
      order: Number(currentMaxOrder) + 1,
      ...(logoImage ? { logo: logoImage } : {}),
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN BRANDS POST ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to create brand.",
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
    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Brand id is required." },
        { status: 400 }
      );
    }

    const title = {
      en: String(formData.get("title_en") || ""),
      ar: String(formData.get("title_ar") || ""),
      ku: String(formData.get("title_ku") || ""),
    };

    const color = String(formData.get("color") || "");
    const removeLogo = String(formData.get("removeLogo") || "false") === "true";

    const logoImage = await uploadImageIfExists(formData.get("logo"));

    let patch = client.patch(id).set({
      title,
      slug: {
        _type: "slug",
        current: makeSlug(title.en),
      },
      color,
    });

    if (logoImage) {
      patch = patch.set({ logo: logoImage });
    } else if (removeLogo) {
      patch = patch.unset(["logo"]);
    }

    const doc = await patch.commit();

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN BRANDS PUT ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to update brand.",
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
        { ok: false, message: "Brand id is required." },
        { status: 400 }
      );
    }

    await client.delete(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN BRANDS DELETE ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to delete brand." },
      { status: 500 }
    );
  }
}

