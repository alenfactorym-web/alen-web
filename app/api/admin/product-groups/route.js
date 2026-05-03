import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const dynamic = "force-dynamic";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

export async function GET() {
  try {
    const query = `
      {
        "productGroups": *[_type=="productGroup"]
          | order(coalesce(order,9999) asc, _createdAt asc){
            _id,
            "title_en": title.en,
            "title_ar": title.ar,
            "title_ku": title.ku,
"image": image.asset->url,
"brandId": brand->_id,
            "categoryId": category->_id,
            "brandTitle_en": brand->title.en,
            "categoryTitle_en": category->title.en,
            "imageUrl": image.asset->url
          },
        "brands": *[_type=="brand"]{
          _id,
          "title_en": title.en,
          "slugValue": slug.current
        },
        "categories": *[_type=="category"]{
          _id,
          "title_en": title.en,
          "brandId": brand->_id
        }
      }
    `;

    const data = await client.fetch(query);
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET PRODUCT GROUPS ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const brandId = String(formData.get("brandId") || "");
    const categoryId = String(formData.get("categoryId") || "");
    const titleEn = String(formData.get("title_en") || "").trim();
    const titleAr = String(formData.get("title_ar") || "").trim();
    const titleKu = String(formData.get("title_ku") || "").trim();

    if (!brandId || !categoryId || !titleEn) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            brandId,
            categoryId,
            title_en: titleEn,
          },
        },
        { status: 400 }
      );
    }

    const image = await uploadImageIfExists(formData.get("image"));

    const doc = {
      _type: "productGroup",
      title: {
        en: titleEn,
        ar: titleAr,
        ku: titleKu,
      },
      slug: {
        _type: "slug",
        current: slugify(`${titleEn}-${Date.now()}`),
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      category: {
        _type: "reference",
        _ref: categoryId,
      },
      isActive: true,
      ...(image ? { image } : {}),
    };

    const created = await writeClient.create(doc);
    return NextResponse.json({ success: true, id: created._id });
  } catch (err) {
    console.error("CREATE PRODUCT GROUP ERROR:", err);
    return NextResponse.json(
      { error: "Failed", details: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();

    const id = String(formData.get("id") || "");
    const brandId = String(formData.get("brandId") || "");
    const categoryId = String(formData.get("categoryId") || "");
    const titleEn = String(formData.get("title_en") || "").trim();
    const titleAr = String(formData.get("title_ar") || "").trim();
    const titleKu = String(formData.get("title_ku") || "").trim();
    const removeImage = String(formData.get("removeImage") || "false") === "true";

    if (!id || !brandId || !categoryId || !titleEn) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            id,
            brandId,
            categoryId,
            title_en: titleEn,
          },
        },
        { status: 400 }
      );
    }

    const image = await uploadImageIfExists(formData.get("image"));

    let patch = writeClient.patch(id).set({
      title: {
        en: titleEn,
        ar: titleAr,
        ku: titleKu,
      },
      slug: {
        _type: "slug",
        current: slugify(titleEn),
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      category: {
        _type: "reference",
        _ref: categoryId,
      },
    });

    if (image) {
      patch = patch.set({ image });
    } else if (removeImage) {
      patch = patch.unset(["image"]);
    }

    await patch.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE PRODUCT GROUP ERROR:", err);
    return NextResponse.json(
      { error: "Failed", details: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE PRODUCT GROUP ERROR:", err);
    return NextResponse.json(
      { error: "Failed", details: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

