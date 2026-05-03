import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID, // از .env.local می‌آید
  dataset: process.env.SANITY_DATASET || "production",
  useCdn: true, // برای داده‌های عمومی
});

