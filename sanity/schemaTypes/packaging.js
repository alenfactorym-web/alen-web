export default {
  name: "packaging",
  title: "Packaging",
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
  name: "category",
  title: "Category",
  type: "reference",
  to: [{ type: "category" }],
  validation: (Rule) => Rule.required(),
},
{
  name: "productGroup",
  title: "Product Group",
  type: "reference",
  to: [{ type: "productGroup" }],
  options: {
    filter: ({ document }) => {
  if (!document?.category?._ref || !document?.brand?._ref) {
    return {
      filter: "_type == 'productGroup'",
    };
  }

  return {
    filter:
      "_type == 'productGroup' && category._ref == $categoryId && brand._ref == $brandId",
    params: {
      categoryId: document.category._ref,
      brandId: document.brand._ref,
    },
  };
},
  },
},
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    },
{ name: "image", title: "Image", type: "image" },
{ name: "isActive", title: "Active", type: "boolean", initialValue: true },

  { name: "order", title: "Order", type: "number" },
  ],
  preview: {
    select: {
      title: "title.en",
      brand: "brand.title.en",
      category: "category.title.en",
      media: "image",
    },
    prepare({ title, brand, category, media }) {
      const sub = [
        brand && `Brand: ${brand}`,
        category && `Category: ${category}`,
      ]
        .filter(Boolean)
        .join(" • ");

      return {
        title: title || "Untitled",
        subtitle: sub,
        media,
      };
    },
  },
};
