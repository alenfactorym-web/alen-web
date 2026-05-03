import { client } from "@/sanity/lib/client";

export async function GET() {
  const query = `
  *[_type=="contactSection" && coalesce(isActive,true)==true][0]{
    title,
    subtitle,
    company,
    address,
    footerText,
    email,
    phones,
    mapSrc,
    mapLink,
    whatsAppNumber
  }`;

  const item = await client.fetch(query);

  return Response.json({ item });
}

