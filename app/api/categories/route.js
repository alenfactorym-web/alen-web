import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export async function GET() {
  const categories = await client.fetch(`
    *[_type == "category"] | order(coalesce(order, 9999) asc, _createdAt desc) {
      _id,
      order,
      title,
      "title_en": coalesce(title.en, ""),
      "title_ar": coalesce(title.ar, ""),
      "title_ku": coalesce(title.ku, "")
    }
  `);

  return Response.json(categories);
}

export async function POST(request) {
  const body = await request.json();

  const currentMaxOrder = await client.fetch(`
    coalesce(max(*[_type == "category"].order), -1)
  `);

  const doc = await writeClient.create({
    _type: "category",
    title: {
      en: body.title?.en || "",
      ar: body.title?.ar || "",
      ku: body.title?.ku || "",
    },
    order:
      body.order === "" || body.order === null || body.order === undefined
        ? Number(currentMaxOrder) + 1
        : Number(body.order),
  });

  return Response.json(doc);
}

export async function PUT(request) {
  const body = await request.json();

  const patch = {
    title: {
      en: body.title?.en || "",
      ar: body.title?.ar || "",
      ku: body.title?.ku || "",
    },
  };

  if (body.order === "" || body.order === null || body.order === undefined) {
    patch.order = null;
  } else {
    patch.order = Number(body.order);
  }

  const doc = await writeClient.patch(body.id).set(patch).commit();

  return Response.json(doc);
}

export async function DELETE(request) {
  const body = await request.json();

  await writeClient.delete(body.id);

  return Response.json({ success: true });
}

