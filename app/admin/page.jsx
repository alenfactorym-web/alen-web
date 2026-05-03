import { redirect } from "next/navigation";

export default async function AdminIndex({ searchParams }) {
  const params = await searchParams;
  const lang = params?.lang;

  if (lang) {
    redirect(`/admin/home?lang=${lang}`);
  }

  redirect("/admin/home");
}

