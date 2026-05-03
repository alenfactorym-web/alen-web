export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";

export async function GET() {
  const query = `
    *[_type=="catalog"]
    | order(coalesce(publishDate, _createdAt) desc){
      _id,
      title,
      "file": file.asset->url,
      "cover": coverImage.asset->url,
      publishDate
    }
  `;

  try {
    const list = await client.fetch(query);

   return Response.json({ list });
  } catch (err) {
   return Response.json({ error: err.message }, { status: 500 });
  }
}

