import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

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
   const data = await client.fetch(`
{
  "products": *[_type == "product"] | order(coalesce(order, 9999) asc, _createdAt desc) {
    _id,
    order,
    isActive,
    sku,
    title,
    desc,
    "title_en": coalesce(title.en, ""),
    "title_ar": coalesce(title.ar, ""),
    "title_ku": coalesce(title.ku, ""),
    "desc_en": coalesce(desc.en, ""),
    "desc_ar": coalesce(desc.ar, ""),
    "desc_ku": coalesce(desc.ku, ""),
    "brandId": brand->_id,
    "brandSlugValue": brand->slug.current,
    "brandTitle_en": coalesce(brand->title.en, ""),
    "brandTitle_ar": coalesce(brand->title.ar, ""),
    "brandTitle_ku": coalesce(brand->title.ku, ""),
    "categoryId": category->_id,
    "categoryTitle_en": coalesce(category->title.en, ""),
    "categoryTitle_ar": coalesce(category->title.ar, ""),
    "categoryTitle_ku": coalesce(category->title.ku, ""),
    "productGroupId": productGroup->_id,
    "productGroupTitle_en": coalesce(productGroup->title.en, ""),
    "productGroupTitle_ar": coalesce(productGroup->title.ar, ""),
    "productGroupTitle_ku": coalesce(productGroup->title.ku, ""),
    "packagingId": packaging->_id,
    "packagingTitle_en": coalesce(packaging->title.en, ""),
    "packagingTitle_ar": coalesce(packaging->title.ar, ""),
    "packagingTitle_ku": coalesce(packaging->title.ku, ""),
    "coverImageUrl": coverImage.asset->url,
    "imageUrls": images[].asset->url,
       "unitsPerPack": unitsPerPack,
       "packsPerCarton": packsPerCarton
  },

  "brands": *[_type == "brand"] {
    _id,
    "slugValue": slug.current,
    title,
    "title_en": coalesce(title.en, "Untitled"),
    "title_ar": coalesce(title.ar, ""),
    "title_ku": coalesce(title.ku, "")
  },

  "categories": *[_type == "category"] {
    _id,
    "brandId": brand->_id,
    title,
    "title_en": coalesce(title.en, "Untitled"),
    "title_ar": coalesce(title.ar, ""),
    "title_ku": coalesce(title.ku, "")
  },

 "packagingOptions": *[_type == "packaging"] {
  _id,
  "brandId": brand->_id,
  "categoryId": category->_id,
  "productGroupId": productGroup->_id,
  title,
  "title_en": coalesce(title.en, "Untitled"),
  "title_ar": coalesce(title.ar, ""),
  "title_ku": coalesce(title.ku, "")
},

  "productGroups": *[_type == "productGroup"] {
    _id,
    "brandId": brand->_id,
    "categoryId": category->_id,
    title,
    "title_en": coalesce(title.en, "Untitled"),
    "title_ar": coalesce(title.ar, ""),
    "title_ku": coalesce(title.ku, "")
  }
}
`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("ADMIN PRODUCTS GET ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to load products." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const brandId = String(formData.get("brandId") || "");
    const categoryId = String(formData.get("categoryId") || "");
    const packagingId = String(formData.get("packagingId") || "");
    const productGroupId = String(formData.get("productGroupId") || "");
    const unitsPerPack = Number(formData.get("unitsPerPack") || 0);
    const packsPerCarton = Number(formData.get("packsPerCarton") || 0);

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

    const desc = {
      en: String(formData.get("desc_en") || ""),
      ar: String(formData.get("desc_ar") || ""),
      ku: String(formData.get("desc_ku") || ""),
    };

    const currentMaxOrder = await client.fetch(`
      coalesce(
        *[_type == "product" && defined(order)] | order(order desc)[0].order,
        -1
      )
    `);

    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    const imageFiles = formData.getAll("images");
    const uploadedImages = [];

    for (const file of imageFiles) {
      const image = await uploadImageIfExists(file);
      if (image) uploadedImages.push(image);
    }

  const doc = await writeClient.create({
  _type: "product",
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
...(packagingId
  ? {
      packaging: {
        _type: "reference",
        _ref: packagingId,
      },
    }
  : {}),
  title,
  desc,
  sku: "",
  isActive: true,
 order: Number(currentMaxOrder) + 1,

unitsPerPack,
packsPerCarton,

...(coverImage ? { coverImage } : {}),
...(uploadedImages.length ? { images: uploadedImages } : {}),

});

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN PRODUCTS POST ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to create product.",
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
    const categoryId = String(formData.get("categoryId") || "");
    const packagingId = String(formData.get("packagingId") || "");
    const productGroupId = String(formData.get("productGroupId") || "");
    const unitsPerPack = Number(formData.get("unitsPerPack") || 0);
    const packsPerCarton = Number(formData.get("packsPerCarton") || 0);

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Product id is required." },
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

    const desc = {
      en: String(formData.get("desc_en") || ""),
      ar: String(formData.get("desc_ar") || ""),
      ku: String(formData.get("desc_ku") || ""),
    };

    const removeCoverImage =
      String(formData.get("removeCoverImage") || "false") === "true";
    const replaceImages =
      String(formData.get("replaceImages") || "false") === "true";

    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    const imageFiles = formData.getAll("images");
    const uploadedImages = [];

    for (const file of imageFiles) {
      const image = await uploadImageIfExists(file);
      if (image) uploadedImages.push(image);
    }

    let patch = writeClient.patch(id).set({
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      category: {
        _type: "reference",
        _ref: categoryId,
      },
      title,
      desc,
      unitsPerPack,
      packsPerCarton,
    });

    if (productGroupId) {
      patch = patch.set({
        productGroup: {
          _type: "reference",
          _ref: productGroupId,
        },
      });
    } else {
      patch = patch.unset(["productGroup"]);
    }

    if (packagingId) {
      patch = patch.set({
        packaging: {
          _type: "reference",
          _ref: packagingId,
        },
      });
    } else {
      patch = patch.unset(["packaging"]);
    }

    if (coverImage) {
      patch = patch.set({ coverImage });
    } else if (removeCoverImage) {
      patch = patch.unset(["coverImage"]);
    }

    if (replaceImages) {
      patch = patch.set({ images: uploadedImages });
    }

    const doc = await patch.commit();

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN PRODUCTS PUT ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to update product.",
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
        { ok: false, message: "Product id is required." },
        { status: 400 }
      );
    }

    await writeClient.delete(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN PRODUCTS DELETE ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to delete product." },
      { status: 500 }
    );
  }
}

