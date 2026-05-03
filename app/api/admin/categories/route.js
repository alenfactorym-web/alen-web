import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";


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

  const asset = await writeClient.assets.upload("image", buffer, {
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
    const brandSlug = searchParams.get("brand");

    const categories = await client.fetch(
      `
      *[
        _type == "category" &&
        (!defined($brandSlug) || brand->slug.current == $brandSlug)
      ] | order(coalesce(order, 9999) asc, _createdAt desc) {
        _id,
        order,
        isActive,
        "slugValue": slug.current,
        title,
        "title_en": coalesce(title.en, ""),
        "title_ar": coalesce(title.ar, ""),
        "title_ku": coalesce(title.ku, ""),
        "brandId": brand->_id,
        "brandSlug": brand->slug.current,
        "brandTitle_en": brand->title.en,
        "coverImageUrl": coverImage.asset->url
      }
      `,
      { brandSlug }
    );

    return NextResponse.json(categories);
  } catch (error) {
    console.error("ADMIN CATEGORIES GET ERROR:", error);
    return NextResponse.json(
      { ok: false, message: error?.message || "Failed to load categories." },
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

    const brandId = String(formData.get("brandId") || "");
    const slugRaw = String(formData.get("slug") || "");
    const isActive = String(formData.get("isActive") || "true") === "true";

    if (!brandId) {
      return NextResponse.json(
        { ok: false, message: "Brand is required." },
        { status: 400 }
      );
    }

    const currentMaxOrder = await client.fetch(
      `
      coalesce(
        *[_type == "category" && defined(order)] | order(order desc)[0].order,
        -1
      )
      `
    );

    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    const doc = await writeClient.create({
      _type: "category",
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      slug: {
        _type: "slug",
        current: makeSlug(slugRaw || title.en),
      },
      title,
      isActive,
      order: Number(currentMaxOrder) + 1,
      ...(coverImage ? { coverImage } : {}),
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN CATEGORIES POST ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to create category.",
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
        { ok: false, message: "Category id is required." },
        { status: 400 }
      );
    }

    const title = {
      en: String(formData.get("title_en") || ""),
      ar: String(formData.get("title_ar") || ""),
      ku: String(formData.get("title_ku") || ""),
    };

    const brandId = String(formData.get("brandId") || "");
    const slugRaw = String(formData.get("slug") || "");
    const isActive = String(formData.get("isActive") || "true") === "true";
    const removeCoverImage =
      String(formData.get("removeCoverImage") || "false") === "true";

    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    let patch = writeClient.patch(id).set({
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      slug: {
        _type: "slug",
        current: makeSlug(slugRaw || title.en),
      },
      title,
      isActive,
    });

    if (coverImage) {
      patch = patch.set({ coverImage });
    } else if (removeCoverImage) {
      patch = patch.unset(["coverImage"]);
    }

    const doc = await patch.commit();

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN CATEGORIES PUT ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to update category.",
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
        { ok: false, message: "Category id is required." },
        { status: 400 }
      );
    }

    await writeClient.delete(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN CATEGORIES DELETE ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to delete category.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

