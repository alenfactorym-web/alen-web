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
    const brandSlug = String(searchParams.get("brand") || "").trim();

    const query = brandSlug
      ? `
        *[_type == "packaging" && brand->slug.current == $brandSlug]
        | order(coalesce(order, 9999) asc, _createdAt desc) {
          _id,
          order,
          isActive,
          cartonQty,
          title,
          "title_en": coalesce(title.en, ""),
          "title_ar": coalesce(title.ar, ""),
          "title_ku": coalesce(title.ku, ""),
          "brandId": brand->_id,
          "brandTitle_en": coalesce(brand->title.en, ""),
          "brandTitle_ar": coalesce(brand->title.ar, ""),
          "brandTitle_ku": coalesce(brand->title.ku, ""),
          "categoryId": category->_id,
                 "productGroupId": productGroup->_id,
          "categoryTitle_en": coalesce(category->title.en, ""),
          "categoryTitle_ar": coalesce(category->title.ar, ""),
          "categoryTitle_ku": coalesce(category->title.ku, ""),
          "imageUrl": image.asset->url
        }
      `
      : `
        *[_type == "packaging"]
        | order(coalesce(order, 9999) asc, _createdAt desc) {
          _id,
          order,
          isActive,
          cartonQty,
          title,
          "title_en": coalesce(title.en, ""),
          "title_ar": coalesce(title.ar, ""),
          "title_ku": coalesce(title.ku, ""),
          "brandId": brand->_id,
          "brandTitle_en": coalesce(brand->title.en, ""),
          "brandTitle_ar": coalesce(brand->title.ar, ""),
          "brandTitle_ku": coalesce(brand->title.ku, ""),
          "categoryId": category->_id,
                  "productGroupId": productGroup->_id,
          "categoryTitle_en": coalesce(category->title.en, ""),
          "categoryTitle_ar": coalesce(category->title.ar, ""),
          "categoryTitle_ku": coalesce(category->title.ku, ""),
          "imageUrl": image.asset->url
        }
      `;

    const packaging = await client.fetch(
      query,
      brandSlug ? { brandSlug } : {}
    );

    return NextResponse.json(packaging);
  } catch (error) {
    console.error("ADMIN PACKAGING GET ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to load packaging." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
const productGroupId = String(formData.get("productGroupId") || "");
    const brandId = String(formData.get("brandId") || "");
    const categoryId = String(formData.get("categoryId") || "");

    if (!brandId || !categoryId) {
      return NextResponse.json(
        { ok: false, message: "Brand and category are required." },
        { status: 400 }
      );
    }

    const title = {
      en: String(formData.get("title_en") || ""),
      ar: String(formData.get("title_ar") || ""),
      ku: String(formData.get("title_ku") || ""),
    };

    const cartonQtyRaw = String(formData.get("cartonQty") || "");
    const currentMaxOrder = await client.fetch(`
      coalesce(
        *[_type == "packaging" && defined(order)] | order(order desc)[0].order,
        -1
      )
    `);

    const packagingImage = await uploadImageIfExists(formData.get("image"));

    const doc = await writeClient.create({
      _type: "packaging",
      brand: {
        _type: "reference",
        _ref: brandId,
      },
     category: {
  _type: "reference",
  _ref: categoryId,
},
...(productGroupId && {
  productGroup: {
    _type: "reference",
    _ref: productGroupId,
  },
}),
      slug: {
        _type: "slug",
        current: makeSlug(title.en),
      },
      title,
      cartonQty:
        cartonQtyRaw === "" || cartonQtyRaw === null || cartonQtyRaw === undefined
          ? undefined
          : Number(cartonQtyRaw),
      isActive: true,
      order: Number(currentMaxOrder) + 1,
      ...(packagingImage ? { image: packagingImage } : {}),
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN PACKAGING POST ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to create packaging.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
const productGroupId = String(formData.get("productGroupId") || "");
    const id = String(formData.get("id") || "");
    const brandId = String(formData.get("brandId") || "");
    const categoryId = String(formData.get("categoryId") || "");

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Packaging id is required." },
        { status: 400 }
      );
    }

    if (!brandId || !categoryId) {
      return NextResponse.json(
        { ok: false, message: "Brand and category are required." },
        { status: 400 }
      );
    }

    const title = {
      en: String(formData.get("title_en") || ""),
      ar: String(formData.get("title_ar") || ""),
      ku: String(formData.get("title_ku") || ""),
    };

    const cartonQtyRaw = String(formData.get("cartonQty") || "");
    const removeImage = String(formData.get("removeImage") || "false") === "true";
    const packagingImage = await uploadImageIfExists(formData.get("image"));

    let patch = writeClient.patch(id).set({
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      category: {
  _type: "reference",
  _ref: categoryId,
},
...(productGroupId
 ? {
      productGroup: {
        _type: "reference",
        _ref: productGroupId,
      },
    }
  : {}),
      slug: {
        _type: "slug",
        current: makeSlug(title.en),
      },
      title,
      cartonQty:
        cartonQtyRaw === "" || cartonQtyRaw === null || cartonQtyRaw === undefined
          ? null
          : Number(cartonQtyRaw),
    });

    if (packagingImage) {
      patch = patch.set({ image: packagingImage });
    } else if (removeImage) {
      patch = patch.unset(["image"]);
    }
if (!productGroupId) {
  patch = patch.unset(["productGroup"]);
}
    const doc = await patch.commit();

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN PACKAGING PUT ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to update packaging.",
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
        { ok: false, message: "Packaging id is required." },
        { status: 400 }
      );
    }

    await writeClient.delete(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN PACKAGING DELETE ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to delete packaging." },
      { status: 500 }
    );
  }
}

