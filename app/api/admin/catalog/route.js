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

async function uploadPdfIfExists(file) {
  if (!file || typeof file === "string") return null;
  if (!(file instanceof File)) return null;
  if (file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const asset = await client.assets.upload("file", buffer, {
    filename: file.name,
    contentType: file.type || "application/pdf",
  });

  return {
    _type: "file",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

export async function GET() {
  try {
    const catalogs = await client.fetch(`
      *[_type == "catalog"] | order(coalesce(publishDate, _createdAt) desc) {
        _id,
        title,
        publishDate,
        "fileUrl": file.asset->url,
        "coverImageUrl": coverImage.asset->url
      }
    `);

    return NextResponse.json(Array.isArray(catalogs) ? catalogs : []);
  } catch (error) {
    console.error("ADMIN CATALOG GET ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to load catalogs.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = String(formData.get("title") || "").trim();
    const publishDate = String(formData.get("publishDate") || "").trim();

    if (!title) {
      return NextResponse.json(
        { ok: false, message: "Title is required." },
        { status: 400 }
      );
    }

    const file = await uploadPdfIfExists(formData.get("file"));
    if (!file) {
      return NextResponse.json(
        { ok: false, message: "PDF file is required." },
        { status: 400 }
      );
    }

    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    const doc = await client.create({
      _type: "catalog",
      title,
      file,
      publishDate: new Date().toISOString(),
      ...(coverImage ? { coverImage } : {}),
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN CATALOG POST ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to create catalog.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();

    const id = String(formData.get("id") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const publishDate = String(formData.get("publishDate") || "").trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Catalog id is required." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { ok: false, message: "Title is required." },
        { status: 400 }
      );
    }

    const removeFile = String(formData.get("removeFile") || "false") === "true";
    const removeCoverImage =
      String(formData.get("removeCoverImage") || "false") === "true";

    const file = await uploadPdfIfExists(formData.get("file"));
    const coverImage = await uploadImageIfExists(formData.get("coverImage"));

    let patch = client.patch(id).set({
      title,
      publishDate: new Date().toISOString(),
    });

    if (file) {
      patch = patch.set({ file });
    } else if (removeFile) {
      patch = patch.unset(["file"]);
    }

    if (coverImage) {
      patch = patch.set({ coverImage });
    } else if (removeCoverImage) {
      patch = patch.unset(["coverImage"]);
    }

    const doc = await patch.commit();

    return NextResponse.json(doc);
  } catch (error) {
    console.error("ADMIN CATALOG PUT ERROR:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Failed to update catalog.",
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
        { ok: false, message: "Catalog id is required." },
        { status: 400 }
      );
    }

    await client.delete(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN CATALOG DELETE ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to delete catalog." },
      { status: 500 }
    );
  }
}

