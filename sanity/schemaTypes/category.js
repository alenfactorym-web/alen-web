export default {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    {
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    },
    {
  name: "slug",
  title: "Slug",
  type: "slug",
  options: {
    source: "title.en",
    isUnique: async (slug, context) => {
      const { document, getClient } = context;
      const client = getClient({ apiVersion: "2026-01-26" });

      const id = (document._id || "").replace(/^drafts\./, "");
      const brandId = document.brand?._ref;

      if (!brandId) return true;

      const params = {
        draft: `drafts.${id}`,
        published: id,
        slug,
        brandId,
      };

      const query = `
        !defined(
          *[
            _type == "category" &&
            !(_id in [$draft, $published]) &&
            slug.current == $slug &&
            brand._ref == $brandId
          ][0]._id
        )
      `;

      return client.fetch(query, params);
    },
  },
  validation: (Rule) => Rule.required(),
},
    { name: "title", title: "Title", type: "localeString", validation: (Rule) => Rule.required() },
    { name: "coverImage", title: "Cover Image", type: "image" },
    { name: "isActive", title: "Active", type: "boolean", initialValue: true },
    { name: "order", title: "Order", type: "number" },
  ],
preview: {
  select: { title: "title.en", brand: "brand.title.en" },
  prepare({ title, brand }) {
    return { title: title || "Untitled", subtitle: brand ? `Brand: ${brand}` : "" };
  },
},
};
